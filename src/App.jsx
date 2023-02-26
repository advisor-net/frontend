import {
  ChakraProvider,
  Text,
  theme,
} from '@chakra-ui/react';
import { AuthProvider } from './auth/authContext';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
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
  return <p>There's nothing here: 404!</p>;
};

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
        path="/profile"
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

const App = () => (
  <ChakraProvider theme={theme}>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </ChakraProvider>
);

export default App;
