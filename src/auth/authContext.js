import {
  createContext, useContext, useEffect, useState, useRef,
} from 'react';

/**
 * This represents some generic auth provider API, like Firebase.
 * To replace with another
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fakeAuthProvider = {
  signin: async (values) => {
    await sleep(1000);
    return {
      userInfo: values,
    };
  },
  signout: async () => {
    await sleep(1000);
  },
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // NOTE: we are doing this because I found that we need to let the state do an "entire lap"
  // of updating the state before we push the reroute callback as the route change will happen
  // before the recognition of the updated state there is likely a bug somewhere else here,
  // but I had to move on.
  // using a useRef instead of useState because react was complaining about updating
  // the state for a function value, so setting it to a useRef that is a pure javascript
  // object made it work better
  const signinCallbackRef = useRef(null);

  const signin = async (values, rerouteCallback) => {
    const { userInfo } = await fakeAuthProvider.signin(values);
    setUser(userInfo);
    signinCallbackRef.current = rerouteCallback;
  };

  useEffect(() => {
    if (signinCallbackRef.current) {
      signinCallbackRef.current();
      signinCallbackRef.current = null;
    }
  }, [user]);

  const signout = async (rerouteCallback) => {
    await fakeAuthProvider.signout();
    setUser(null);
    if (rerouteCallback) {
      rerouteCallback();
    }
  };

  // TODO: register on mount from session storage

  const value = { user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
