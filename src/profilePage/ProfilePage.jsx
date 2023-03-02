import { Suspense } from 'react';

import { Text } from '@chakra-ui/react';

import { useLoaderData, useAsyncValue, Await } from 'react-router-dom';

const ProfilePageComponent = () => {
  const loadedData = useAsyncValue();

  return (
    <Text>Here is the profile page</Text>
  )
};

function ProfilePage() {
  const { data } = useLoaderData();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={data} errorElement={<div>Error!</div>}>
        <ProfilePageComponent />
      </Await>
    </Suspense>
  );
}

export default ProfilePage;


