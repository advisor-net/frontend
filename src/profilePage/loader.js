import { defer, redirect } from 'react-router-dom';

import profileService from './service';
import { getUserUuid } from '../utils/session';

const loadProfile = async ({ params }) => {
  const loggedInUuid = getUserUuid();
  if (!loggedInUuid) {
    // redirect to login
    return redirect('/login');
  } else if (loggedInUuid !== params.uuid) {
    // redirect to network profile since you are not viewing your own profile
    return redirect(`/network/p/${params.uuid}`);
  }

  try {
   const response = await profileService.getUserDetails(params.uuid);
   return response;
  } catch (error) {
    console.error(error);
    return {};
  }
};

// NOTE: not awaiting here to take advantage of defer behavior
// https://reactrouter.com/en/main/guides/deferred
export const loadProfileData = async ({ params }) => defer({
  data: loadProfile({ params }),
});
