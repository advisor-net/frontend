import {
  FIELD_TO_TABLE_ACCESSOR,
  FILTERABLE_FIELD_KEYS,
  FILTER_TYPES,
  NEGATIVE_ORDERING,
  OTHER_QUERY_PARAM_KEYS,
  SEPARATOR,
  TABLE_ACCESSOR_TO_FIELD,
} from './constants';

const getOrderByParamValidity = (paramValue) => {
  let validatedValue = paramValue;
  let isDesc = false;
  if (paramValue.startsWith(NEGATIVE_ORDERING)) {
    validatedValue = paramValue.slice(NEGATIVE_ORDERING.length);
    isDesc = true;
  }
  if (Object.values(FILTERABLE_FIELD_KEYS).includes(validatedValue)) {
    return {
      isValid: true,
      filterType: OTHER_QUERY_PARAM_KEYS.ORDER_BY,
      isDesc,
      fieldValue: validatedValue,
    };
  }
  return {
    isValid: false, filterType: null, isDesc, fieldValue: validatedValue,
  };
};

const extractFilterInfoFromParamKey = (paramKey, paramValue) => {
  if (paramKey === OTHER_QUERY_PARAM_KEYS.ORDER_BY) {
    return {
      ...getOrderByParamValidity(paramValue),
      filterKey: paramKey,
    };
  }

  if (paramKey === OTHER_QUERY_PARAM_KEYS.PAGE_NUMBER) {
    if (Number.isInteger(parseFloat(paramValue))) {
      return {
        isValid: true, filterKey: paramKey, filterType: OTHER_QUERY_PARAM_KEYS.PAGE_NUMBER,
      };
    }
    return { isValid: false, filterKey: null, filterType: null };
  }

  if (paramKey === OTHER_QUERY_PARAM_KEYS.PAGE_SIZE) {
    if (Number.isInteger(parseFloat(paramValue))) {
      return { isValid: true, filterKey: paramKey, filterType: OTHER_QUERY_PARAM_KEYS.PAGE_SIZE };
    }
    return { isValid: false, filterKey: null, filterType: null };
  }

  if (Object.values(FILTERABLE_FIELD_KEYS).includes(paramKey)) {
    // means its an equals
    return { isValid: true, filterKey: paramKey, filterType: FILTER_TYPES.EQUAL };
  }

  for (const filterKey of Object.values(FILTERABLE_FIELD_KEYS)) {
    if (paramKey.includes(filterKey)) {
      const restOfParamKey = paramKey.substring(paramKey.indexOf(filterKey) + filterKey.length);
      // checking for the __in pattern
      const isValid = (
        restOfParamKey.startsWith(SEPARATOR)
        && Object.values(FILTER_TYPES).includes(restOfParamKey.slice(SEPARATOR.length))
      );
      if (isValid) {
        return { isValid, filterKey, filterType: restOfParamKey.slice(SEPARATOR.length) };
      }
    }
  }
  // if it makes it to here, it must not be a valid filter key
  return { isValid: false, filterKey: null, filterType: null };
};

export const transformUrlToParamsObj = (url) => {
  const newParamsObj = {};
  if (url.search) {
    for (const [paramKey, paramValue] of url.searchParams.entries()) {
      const {
        isValid, filterKey, filterType,
      } = extractFilterInfoFromParamKey(paramKey, paramValue);
      if (isValid) {
        newParamsObj[filterKey] = {
          filterType,
          value: paramValue,
        };
      }
    }
  }
  return newParamsObj;
};

// TODO: list in and making this all work properly
export const transformParamsObjToUrl = (paramsObj) => {
  const searchParams = new URLSearchParams();
  for (const [filterKey, info] of Object.entries(paramsObj)) {
    let paramKey;
    if (Object.values(OTHER_QUERY_PARAM_KEYS).includes(filterKey)) {
      paramKey = `${filterKey}`;
    } else {
      paramKey = info.filterType === FILTER_TYPES.EQUAL
        ? `${filterKey}`
        : `${filterKey}${SEPARATOR}${info.filterType}`;
    }

    searchParams.set(paramKey, info.value);
  }
  return searchParams;
};

export const updateURLfromParamsObj = (paramsObj) => {
  const searchParams = transformParamsObjToUrl(paramsObj);
  const url = new URL(window.location);
  url.search = searchParams.toString();
  window.history.replaceState(null, '', url.toString());
};

export const getDefaultParamsForProfile = (profile) => {
  if (profile) {
    const defaultParams = {
      [OTHER_QUERY_PARAM_KEYS.ORDER_BY]: {
        filterType: OTHER_QUERY_PARAM_KEYS.ORDER_BY,
        value: `${NEGATIVE_ORDERING}${FILTERABLE_FIELD_KEYS.NET_WORTH}`,
      },
      [OTHER_QUERY_PARAM_KEYS.PAGE_NUMBER]: {
        filterType: OTHER_QUERY_PARAM_KEYS.PAGE_NUMBER, value: 1,
      },
      [OTHER_QUERY_PARAM_KEYS.PAGE_SIZE]: {
        filterType: OTHER_QUERY_PARAM_KEYS.PAGE_SIZE, value: 20,
      },
    };
    if (profile.metro) {
      defaultParams[FILTERABLE_FIELD_KEYS.METRO] = {
        filterType: FILTER_TYPES.IN, value: [profile.metro.id],
      };
    }
    return defaultParams;
  }
  return {};
};

export const transformParamsObjToSortByTableState = (paramsObj) => {
  if (OTHER_QUERY_PARAM_KEYS.ORDER_BY in paramsObj) {
    const paramInfo = paramsObj[OTHER_QUERY_PARAM_KEYS.ORDER_BY];
    if (paramInfo) {
      const validity = getOrderByParamValidity(paramInfo.value);
      if (validity.isValid) {
        return [{
          id: FIELD_TO_TABLE_ACCESSOR[validity.fieldValue],
          desc: validity.isDesc,
        }];
      }
    }
  }
  return [];
};

export const transformSortByTableStateToParamsObj = (sortByTableState, previousParamsObj) => {
  const nextParamsObj = { ...previousParamsObj };
  if (sortByTableState.length === 0) {
    delete nextParamsObj[OTHER_QUERY_PARAM_KEYS.ORDER_BY];
  } else {
    const sorter = sortByTableState[0];
    const filterKey = TABLE_ACCESSOR_TO_FIELD[sorter.id];
    nextParamsObj[OTHER_QUERY_PARAM_KEYS.ORDER_BY] = {
      filterType: OTHER_QUERY_PARAM_KEYS.ORDER_BY,
      value: sorter.desc ? `${NEGATIVE_ORDERING}${filterKey}` : filterKey,
    };
  }
  return nextParamsObj;
};