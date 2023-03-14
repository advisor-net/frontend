import { Text } from '@chakra-ui/react';

import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './loginPage/LoginPage';
import ProfilePage from './profilePage/ProfilePage';
import NetworkSearch from './networkPage/NetworkSearch';
import AccountSettings from './accountSettings/AccountSettings';
import ProtectedLayout from './ProtectedLayout';
import ChatApp from './chat/ChatApp';

import { loadNetworkProfileData, loadPersonalProfileData } from './profilePage/loaders';
import { loadNetworkSearchData } from './networkPage/loader';

const ErrorPage = () => (
  <Text>ERROR...must have been the night shift....sorry budddddyyyyyyyyyyy</Text>
);

const NoMatch = () => {
  return <Text>There is nothing here: 404!</Text>;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/',
    element: <ProtectedLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        path: '/p/:uuid',
        loader: loadPersonalProfileData,
        element: <ProfilePage />,
        errorElement: <ErrorPage />,
      },
      {
        path: '/network',
        loader: loadNetworkSearchData,
        element: <NetworkSearch />,
        errorElement: <ErrorPage />,
      },
      {
        path: '/network/p/:uuid',
        loader: loadNetworkProfileData,
        element: <ProfilePage />,
        errorElement: <ErrorPage />,
      },
      {
        path: '/account',
        element: <AccountSettings />,
        errorElement: <ErrorPage />,
      },
      {
        path: '/chat',
        element: <ChatApp />,
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

export default router;
