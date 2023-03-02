import {
  createContext, useContext, useEffect, useState, useRef,
} from 'react';
import {
  setJwtToken, setRefreshToken, setUserUuid, removeJwtToken, removeRefreshToken, removeUserUuid,
} from '../utils/session';
import authService from './service';

const AuthContext = createContext(null);

/*
EXPLAINER ON HOW AUTH WORKS IN THIS APPLICATION
We are using JWT token authentication.
This is a high level context that allows us to contruct routes where some pages
can be hit without authentication, and other routes are protected by requiring
an authenticated user. We protect these routes using the RequireAuth component.
This RequireAuth component checks to see if the user object is not null from the
AuthProvider context seen below. If the user is null, it does not let the content 
render for the protected route that is its children. It instead will handle authentication
by first attempting to authenticate the user by using the refresh JWT token. If this is
successful, the user will then be allowed to access the page content. If this is unsuccessful
the user will be routed to the login page to re-enter their credentials.
a JWT stored in session storage.

Alternatively, directly within the request.js file, where the code responsible for hitting
our API lives, we have implemented a separate authorization handler where if we get a 401
back from the request, we will attempt to use the refresh token to get a new access token,
and then we will re-attempt the request from there.

The reason we have implemented it that way is because the application will need to 
hit the API while the user is not switching pages (meaning react-router route logic
will not be able to capture all of the authentication flows). So at any given moment
the application could ping the API with a token that is no longer valid, so we needed
to have the refresh & redirect to login logic always active. Our attempt to sign in
with token is something we do strictly for the first mount of the page.
*/
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokenLoginAttempts, setTokenLoginAttempts] = useState(0);

  // NOTE: we are doing this because I found that we need to let the state do an "entire lap"
  // of updating the state before we push the reroute callback as the route change will happen
  // before the recognition of the updated state there. Meaning the update to the `user` state
  // variable happens after another re-render following a successful authentication, which will 
  // a redirect to the login page. See the RequireAuth component for more details.

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
    setUserUuid(userProfile.uuid);
    if (rerouteCallback) {
      signinCallbackRef.current = () => rerouteCallback(userProfile);
    }
  };

  const signinWithToken = async (signal) => {
    // fetch user info trying with tokens
    const userProfile = await authService.getProfile(signal);
    setUser(userProfile);
    setUserUuid(userProfile.uuid);
    signinCallbackRef.current = () => {
      setTokenLoginAttempts(tokenLoginAttempts + 1);
    }
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
    removeUserUuid();
    setUser(null);
    if (rerouteCallback) {
      rerouteCallback();
    }
  };

  const value = {
    user, signinWithCredentials, signinWithToken, signout, tokenLoginAttempts,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
