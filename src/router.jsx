import { Text } from '@chakra-ui/react';

import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './loginPage/LoginPage';
import ProfilePage from './profilePage/ProfilePage';
import NetworkSearch from './networkPage/NetworkSearch';
import AccountSettings from './accountSettings/AccountSettings';
import ProtectedLayout from './ProtectedLayout';

import { loadProfileData } from './profilePage/loader';

const ErrorPage = () => (
  <Text>ERROR...must have been the night shift....sorry budddddyyyyyyyyyyy</Text>
);

const NoMatch = () => {
  return <Text>There's nothing here: 404!</Text>;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        path: "/profile/:uuid",
        loader: loadProfileData,
        element: <ProfilePage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/network",
        element: <NetworkSearch />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/account",
        element: <AccountSettings />,
        errorElement: <ErrorPage />,
      },
      {
        path: "*",
        element: <NoMatch />
      },
    ],
  },
  {
    path: "*",
    element: <NoMatch />
  },
]);

export default router;
