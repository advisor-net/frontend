import { createBrowserRouter } from 'react-router-dom';

import { ChatEngineWrapper } from 'react-chat-engine';
import UnprotectedLayout from './UnprotectedLayout';
import SignupPage from '../signup/SignupPage';
import PostSignup from '../login/PostSignup';
import VerifyEmail from '../signup/VerifyEmail';
import LoginPage from '../login/LoginPage';
import RequestPasswordReset from '../login/RequestPasswordReset';
import ResetPassword from '../login/ResetPassword';
import WaitlistPage from '../login/WaitlistPage';

import ProtectedLayout from './ProtectedLayout';
import ProfilePage from '../profilePage/ProfilePage';
import NetworkSearch from '../networkPage/NetworkSearch';
import AccountSettings from '../accountSettings/AccountSettings';
import ChatApp from '../chat/ChatApp';

import ErrorPage from './ErrorPage';
import NoMatch from './NoMatch';

import { loadNetworkProfileData, loadPersonalProfileData } from '../profilePage/loaders';
import { loadNetworkSearchData } from '../networkPage/loader';
import lazyLoadProfile from '../session/lazyLoadProfile';

/*
Reason for this state pattern is im trying to take advantage of the react-router loaders
If I could do it all again, I probably would just ditch the loading pattern and use 
react-redux for all of the routing logic as well.
See more here: https://github.com/remix-run/react-router/discussions/9327
In hindsight, i also could have just used a usecontext for this...
*/
const getRouter = (store) => {
  const { dispatch, getState } = store;
  const router = createBrowserRouter([
    {
      path: '/',
      element: <UnprotectedLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/login',
          element: <LoginPage />,
          errorElement: <ErrorPage />,
        },
        {
          path: '/request_password_reset',
          element: <RequestPasswordReset />,
          errorElement: <ErrorPage />,
        },
        {
          path: '/reset_password/:resetPasswordLink',
          element: <ResetPassword />,
          errorElement: <ErrorPage />,
        },
        {
          path: '/waitlist',
          element: <WaitlistPage />,
          errorElement: <ErrorPage />,
        },
        {
          path: '/signup/:signupLinkUuid',
          element: <SignupPage />,
          errorElement: <ErrorPage />,
        },
      ],
    },
    {
      // TODO: force a redirect to email verification if the user is not verified
      path: '/',
      element: <ProtectedLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          path: '/p',
          loader: ({ params }) => loadPersonalProfileData({ params, state: getState(), dispatch }),
          element: <ProfilePage />,
          errorElement: <ErrorPage />,
        },
        {
          path: '/p/:uuid',
          loader: ({ params }) => loadPersonalProfileData({ params, state: getState(), dispatch }),
          element: <ProfilePage />,
          errorElement: <ErrorPage />,
        },
        {
          path: '/network',
          loader: ({ params }) => loadNetworkSearchData({ params, state: getState(), dispatch }),
          element: <NetworkSearch />,
          errorElement: <ErrorPage />,
        },
        {
          path: '/network/p/:uuid',
          loader: ({ params }) => loadNetworkProfileData({ params, state: getState(), dispatch }),
          element: <ProfilePage />,
          errorElement: <ErrorPage />,
        },
        {
          path: '/account',
          loader: () => lazyLoadProfile(getState(), dispatch),
          element: <AccountSettings />,
          errorElement: <ErrorPage />,
        },
        {
          path: '/chat',
          loader: () => lazyLoadProfile(getState(), dispatch),
          element: (
            // NOTE: we are doing this because there is currently a bug with react-chat-engine
            // that causes a mount failure due to some websocket BS if you access thes page twice
            // from within the web app...so while we may want to access chat engine state from
            // lateral components, adding the wrapper at this level is the best way to deal with
            // this bug for now
            <ChatEngineWrapper>
              <ChatApp />
            </ChatEngineWrapper>
          ),
          errorElement: <ErrorPage />,
        },
        {
          path: '/verify_email/:verifyLinkUuid',
          loader: () => lazyLoadProfile(getState(), dispatch),
          element: <VerifyEmail />,
          errorElement: <ErrorPage />,
        },
        {
          path: '/post_signup',
          loader: () => lazyLoadProfile(getState(), dispatch),
          element: <PostSignup />,
          errorElement: <ErrorPage />,
        },
        {
          path: '*',
          element: <NoMatch />,
        },
      ],
    },
    {
      path: '*',
      element: <NoMatch />,
    },
  ]);

  return router;
};

export default getRouter;
