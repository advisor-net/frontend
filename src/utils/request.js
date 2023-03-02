import { keysToCamelCaseDeep, keysToSnakeCaseDeep } from './utils';
import { getJwtToken, getRefreshToken, setJwtToken } from './session';

const isObject = (a) => typeof a === 'object' && a !== null;

const prepareFetch = ({
  url,
  token,
  params,
  method,
  additionalRequestParams,
  signal,
}) => {
  const fetchUrl = url.includes('://') ? url : process.env.REACT_APP_API_URL + url;
  let credentials = {};
  if (
    fetchUrl.includes(process.env.REACT_APP_API_URL)
    && !additionalRequestParams.ignoreCredentials
  ) {
    // if we are making CORS request to our API server, send any cookies
    credentials = {
      credentials: 'include',
    };
  }

  let headers = {
    Accept: 'application/json',
  };

  if (token !== null && !additionalRequestParams.ignoreAuthorizationHeader) {
    // likely use this for s3 downloads
    headers.Authorization = `Bearer ${token}`;
  }

  if ('headers' in additionalRequestParams) {
    headers = {
      ...headers,
      ...additionalRequestParams.headers,
    };
  }

  const fetchOptions = {
    method,
    headers,
    ...credentials,
  };

  if (params instanceof FormData) {
    fetchOptions.body = params;
  } else if (fetchOptions.method !== 'GET') {
    headers['Content-Type'] = 'application/json';
    fetchOptions.body = additionalRequestParams.ignoreSnakeCaseConversion
      ? JSON.stringify(params)
      : JSON.stringify(keysToSnakeCaseDeep(params));
  }

  if (signal) {
    fetchOptions.signal = signal;
  }

  return { fetchUrl, fetchOptions };
};

const getPayload = (response, additionalRequestParams) => {
  const contentType = response.headers.get('Content-Type');
  const isImage = contentType && contentType.indexOf('image') !== -1;
  const isJSON = contentType && contentType.indexOf('application/json') !== -1;
  const isZip = contentType && contentType.indexOf('application/zip') !== -1;

  if (isImage || isZip) {
    return response.blob();
  }
  if (isJSON) {
    return additionalRequestParams.ignoreCamelCaseConversion
      ? response.json()
      : response.json().then(keysToCamelCaseDeep);
  }
  return response.text();
};

export function FetchError(statusCode, payload) {
  this.name = 'FetchError';
  this.stack = new Error().stack;
  this.statusCode = statusCode;
  if (statusCode) {
    this.originalResponse = payload;
  }
  if (isObject(payload)) {
    this.code = payload.code;
    this.message = payload.message;
    this.extra = payload.extra;
  } else if (statusCode) {
    this.message = 'Unknown error.';
  } else {
    this.message = 'Server is unavailable.';
  }
}
FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;

const performRequest = async ({
  url,
  params,
  method,
  additionalRequestParams,
  signal,
}) => {
  const token = getJwtToken();
  const { fetchUrl, fetchOptions } = prepareFetch({
    url,
    token,
    params,
    method,
    additionalRequestParams,
    signal,
  });

  let response;
  try {
    response = await fetch(fetchUrl, fetchOptions);
  } catch (error) {
    if (error?.message) {
      // Log message to help with debugging
      console.error(error?.message);
    }
    throw new FetchError(null, null);
  }

  const statusCode = response.status;
  const payload = await getPayload(response, additionalRequestParams);

  if (statusCode >= 400 || (isObject(payload) && payload.error === true)) {
    throw new FetchError(statusCode, payload);
  }

  return payload;
};

const requestFunc = async ({
  url,
  params,
  method,
  additionalRequestParams,
  signal,
}) => {
  try {
    return await performRequest({
      url, params, method, additionalRequestParams, signal,
    });
  } catch (error) {
    // check for authentication woes
    if (error.statusCode === 401) {
      // try to grab a new access token using the refresh token
      // if this works, then retry the endpoint. If not, then push them to login
      // screen.
      const refreshToken = getRefreshToken();
      try {
        const refreshTokenResponse = await performRequest({
          url: '/token/refresh/',
          params: { refresh: refreshToken || '' },
          method: 'POST',
          additionalRequestParams: {},
        });
        setJwtToken(refreshTokenResponse.access);
      } catch (refreshTokenError) {
        if (refreshTokenError.statusCode === 401) {
          window.location.replace(
            `${window.location.origin}/login`,
          );
          return null;
        }
        throw refreshTokenError;
      }

      // now retry the request that got us here
      // let this throw if it fails since we have handled authentication
      const refreshedResponse = await performRequest({
        url, params, method, additionalRequestParams, signal,
      });
      return refreshedResponse;
    }
    throw error;
  }
};

const request = {
  get: async ({
    url,
    params = {},
    additionalRequestParams = {},
    signal = null,
  }) => requestFunc({
    url,
    params,
    method: 'GET',
    additionalRequestParams,
    signal,
  }),

  post: async ({
    url,
    params = {},
    additionalRequestParams = {},
    signal = null,
  }) => requestFunc({
    url,
    params,
    method: 'POST',
    additionalRequestParams,
    signal,
  }),

  patch: async ({
    url,
    params = {},
    additionalRequestParams = {},
    signal = null,
  }) => requestFunc({
    url,
    params,
    method: 'PATCH',
    additionalRequestParams,
    signal,
  }),

  delete: async ({
    url,
    params = {},
    additionalRequestParams = {},
    signal = null,
  }) => requestFunc({
    url,
    params,
    method: 'DELETE',
    additionalRequestParams,
    signal,
  }),
};

export default request;
