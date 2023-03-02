import { Text } from '@chakra-ui/react';

import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './auth/LoginPage';
import RequireAuth from './auth/RequireAuth';
import ProfilePage from './profilePage/ProfilePage';
import NetworkSearch from './networkPage/NetworkSearch';
import AccountSettings from './accountSettings/AccountSettings';
import Layout from './Layout';

import { loadProfileData } from './profilePage/loader';

const ErrorPage = () => (
  <Text>ERROR...must have been the night shift....sorry budddddyyyyyyyyyyy</Text>
);

const NoMatch = () => {
  return <Text>There's nothing here: 404!</Text>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
        errorElement: <ErrorPage />,
      },
      // NOTE: this is getting called twice due to our shitty login flow, FIX IT
      {
        index: true,
        path: "/profile/:uuid",
        loader: loadProfileData,
        element: (
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/n",
        element: (
          <RequireAuth>
            <NetworkSearch />
          </RequireAuth>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/account",
        element: (
          <RequireAuth>
            <AccountSettings />
          </RequireAuth>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "*",
        element: <NoMatch />
      },
    ],
  },
]);

export default router;
