import { ChakraProvider, theme } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ChatEngineWrapper } from 'react-chat-engine';
import router from './router';

const queryClient = new QueryClient();

const App = () => (
  <ChakraProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      <ChatEngineWrapper>
        <RouterProvider router={router} />
      </ChatEngineWrapper>
    </QueryClientProvider>
  </ChakraProvider>
);

export default App;
