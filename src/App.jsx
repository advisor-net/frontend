import {
  ChakraProvider,
  theme,
} from '@chakra-ui/react';
import { AuthProvider } from './auth/authContext';
import { RouterProvider } from 'react-router-dom';
import router from './router';

const App = () => (
  <ChakraProvider theme={theme}>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </ChakraProvider>
);

export default App;
