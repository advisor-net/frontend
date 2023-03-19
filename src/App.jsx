import { ChakraProvider, theme } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import getRouter from './layout/getRouter';
import store from './store/store';

const queryClient = new QueryClient();

const App = () => (
  <ChakraProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={getRouter(store)} />
      </Provider>
    </QueryClientProvider>
  </ChakraProvider>
);

export default App;
