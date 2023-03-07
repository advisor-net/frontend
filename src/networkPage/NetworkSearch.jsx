import {Suspense} from 'react';
import {useLoaderData, Await} from 'react-router-dom';

import {Flex, Heading} from '@chakra-ui/react';
import SearchResults from './SearchResults';
import SearchProvider from './SearchContext';
import Filters from './Filters';

const NetworkSearchComponent = () => {
  return (
    <Flex direction="column" padding="4" gap="2" width="100%">
      <Heading size="lg">Find people</Heading>
      <Filters />
      <SearchResults />
    </Flex>
  );
};

const NetworkSearch = () => {
  const {data} = useLoaderData();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={data} errorElement={<div>Error!</div>}>
        <SearchProvider>
          <NetworkSearchComponent />
        </SearchProvider>
      </Await>
    </Suspense>
  );
};

export default NetworkSearch;
