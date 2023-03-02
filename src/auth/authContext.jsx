import {
  createContext, useContext, useEffect, useState, useRef,
} from 'react';
import {
  setJwtToken, setRefreshToken, removeJwtToken, removeRefreshToken,
} from '../utils/token';
import authService from './service';

const AuthContext = createContext(null);


/*
EXPLAINER ON HOW AUTH WORKS IN THIS APPLICATION
We are using JWT token authentication.
This is a high level context that allows us to contruct routes where some pages
can be hit without authentication, and other routes are protected by requiring
an authenticated user. The login component will attempt to log the user in user
a JWT stored in session storage. It will do this by attempting to fetch the user
profile. If the JWT token does not exist or it is no longer valid, the request
API (found in utils/request.js) will catch the 401 unauthorized error and attempt
to login with the refresh token. If this refresh token is still valid, we will then
re-attempt the user profile login from the request.js file. If it fails, we will be
redirected to the login component for a full credentials sign in.

The reason we have implemented it that way is because the application will need to 
hit the API while the user is not switching pages (meaning react-router route logic
will not be able to capture all of the authentication flows). So at any given moment
the application could ping the API with a token that is no longer valid, so we needed
to have the refresh & redirect to login logic always active. Our attempt to sign in
with token is something we do strictly for the first mount of the page.
*/
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initialLoginAttempts, setInitialLoginAttempts] = useState(0);

  // NOTE: we are doing this because I found that we need to let the state do an "entire lap"
  // of updating the state before we push the reroute callback as the route change will happen
  // before the recognition of the updated state there is likely a bug somewhere else here,
  // but I had to move on.
  // using a useRef instead of useState because react was complaining about updating
  // the state for a function value, so setting it to a useRef that is a pure javascript
  // object made it work better
  const signinCallbackRef = useRef(null);

  const signinWithCredentials = async (params, rerouteCallback) => {
    const tokenInfo = await authService.obtainTokenPair(params);
    setJwtToken(tokenInfo.access);
    setRefreshToken(tokenInfo.refresh);

    // now fetch user info
    const userProfile = await authService.getProfile();
    setUser(userProfile);
    signinCallbackRef.current = () => rerouteCallback(userProfile);
  };

  const signinWithToken = async (rerouteCallback, signal) => {
    // fetch user info trying with tokens
    setInitialLoginAttempts(initialLoginAttempts + 1);
    const userProfile = await authService.getProfile(signal);
    setUser(userProfile);
    signinCallbackRef.current = () => rerouteCallback(userProfile);
  };

  useEffect(() => {
    if (signinCallbackRef.current) {
      signinCallbackRef.current();
      signinCallbackRef.current = null;
    }
  }, [user]);

  // ToDo: add endpoint to really log the person out
  const signout = async (rerouteCallback) => {
    removeJwtToken();
    removeRefreshToken();
    setUser(null);
    if (rerouteCallback) {
      rerouteCallback();
    }
  };

  const value = {
    user, signinWithCredentials, signinWithToken, signout, initialLoginAttempts,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
