import { Text } from '@chakra-ui/react';

import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import LoginPage from './auth/LoginPage';
import RequireAuth from './auth/RequireAuth';
import ProfilePage from './profilePage/ProfilePage';
import NetworkSearch from './networkPage/NetworkSearch';
import AccountSettings from './accountSettings/AccountSettings';
import Layout from './Layout';

const ErrorPage = () => (
  <Text>ERROR...must have been the night shift....sorry budddddyyyyyyyyyyy</Text>
);

const NoMatch = () => {
  return <Text>There's nothing here: 404!</Text>;
};

// TODO: add a loader to the top level route that is user info? or maybe do that with the RequireAuth component?
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>} errorElement={<ErrorPage/>}>
      <Route 
        index 
        element={
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        } 
      />
      <Route path="/login" element={<LoginPage />} errorElement={<ErrorPage/>} />
      <Route
        path="/profile/:uuid"
        element={
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        }
        errorElement={<ErrorPage/>}
      />
      <Route
        path="/network"
        element={
          <RequireAuth>
            <NetworkSearch />
          </RequireAuth>
        }
        errorElement={<ErrorPage/>}
      />
      <Route
        path="/account"
        element={
          <RequireAuth>
            <AccountSettings />
          </RequireAuth>
        }
        errorElement={<ErrorPage/>}
      />
      <Route path="*" element={<NoMatch />} />
    </Route>
  ),
);

export default router;
