import {
  ChakraProvider,
  theme,
} from '@chakra-ui/react';
import { AuthProvider } from './auth/authContext';
import { RouterProvider } from 'react-router-dom';
import router from './router';

import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

const App = () => (
  <ChakraProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router}/>
      </AuthProvider>
    </QueryClientProvider>
  </ChakraProvider>
);

export default App;
