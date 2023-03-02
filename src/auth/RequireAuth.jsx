import {
  useLocation,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./authContext";
import { useEffectOnce } from "../utils/hooks";
import { useQuery } from "react-query";

const RequireAuth = ({ children }) => {
  const location = useLocation();
  
  const { user, signinWithToken, tokenLoginAttempts } = useAuth();

  const tokenSignin = useQuery(
    ['tokenSignIn '],
    () => signinWithToken(),
    {
      cacheTime: 0,
      enabled: false,
      refetchOnWindowFocus: false,
      retry: false,
      onError: (e) => console.log(e),
      onSuccess: (data) => console.log(data),
    },
  );

  // If a user is not present, attempt to login using token
  // need to use special useEffect to prevent mount, unmount behavior
  useEffectOnce(() => {
    if (!user && tokenLoginAttempts === 0 && !tokenSignin.isFetching) {
      tokenSignin.refetch();
    }
  }, [tokenLoginAttempts, user])

  if (tokenSignin.isFetching || tokenLoginAttempts === 0) {
    // TODO: clean up with standard loading component
    return <div>Loading......</div>
  } else if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children
};

export default RequireAuth;
