import { Suspense } from 'react';
import { useLoaderData, Await } from 'react-router-dom';

import { 
  Box,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react';
import SearchResults from './SearchResults';
import SearchProvider from './SearchContext';

const NetworkSearchComponent = () => {
  return (
    <Flex direction="column" padding="4" gap="2" width="100%">
      <Heading size="xl">Find people</Heading>
      <Flex border="1px solid #ddd" width="100%" padding="2">
        <Heading size="lg">Filters</Heading>
      </Flex>
      <SearchResults/>
    </Flex>
  )
};

const NetworkSearch = () => {
  const { data } = useLoaderData();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={data} errorElement={<div>Error!</div>}>
        <SearchProvider>
          <NetworkSearchComponent />
        </SearchProvider>
      </Await>
    </Suspense>
  );
}

export default NetworkSearch;
