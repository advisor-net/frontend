import { defer, redirect } from 'react-router-dom';

import profileService from '../services/profileService';
import { getUserUuid } from '../utils/session';

// TODO: improve the data flow here (from login as well), where the page handles the URL nonsense
// I want each page to be independent and pull the resources it needs
// could set up a loader for the protected route that fetches the profile information for each
// page...that is probably a good way to do things
// may lead to a lot of redundant fetches...but we will optimize that later
const loadProfile = async ({ params }) => {
  const loggedInUuid = getUserUuid();
  const isOwnProfile = loggedInUuid === params.uuid;

  if (!loggedInUuid) {
    // redirect to login
    return redirect('/login');
  } if (!isOwnProfile) {
    // redirect to network profile since you are not viewing your own profile
    return redirect(`/network/p/${params.uuid}`);
  }

  try {
    const response = await profileService.getUserDetails(params.uuid);
    return { user: response, isOwnProfile };
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
