import {Suspense} from 'react';

import {Text, Heading, Box} from '@chakra-ui/react';

import {useLoaderData, useAsyncValue, Await} from 'react-router-dom';

// ToDo: actually build out the page
const ProfilePageComponent = () => {
  const {user, isOwnProfile} = useAsyncValue();

  return (
    <Box>
      {isOwnProfile ? <Heading>Own profile</Heading> : <Heading>Other profile</Heading>}
      {Object.entries(user).map(([key, value]) => (
        <Text key={key}>{`${key}: ${value}`}</Text>
      ))}
    </Box>
  );
};

const ProfilePage = () => {
  const {data} = useLoaderData();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={data} errorElement={<div>Error!</div>}>
        <ProfilePageComponent />
      </Await>
    </Suspense>
  );
};

export default ProfilePage;
