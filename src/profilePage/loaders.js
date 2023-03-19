import { defer } from 'react-router-dom';

import profileService from '../services/profileService';
import lazyLoadProfile from '../session/lazyLoadProfile';

const loadProfile = async ({ params, state, dispatch, isPersonal }) => {
  const loggedInUser = await lazyLoadProfile(state, dispatch);

  if (!params.uuid) {
    // redirect to personal profile
    // NOTE: using the redirect react-router function in the loader was not working, so
    // i defered this to the component
    return { redirectTo: `/p/${loggedInUser.uuid}` };
  }

  const isOwnProfile = loggedInUser.uuid === params.uuid;

  if (isPersonal && !isOwnProfile) {
    // redirect to network profile since you are not viewing your own profile
    return { redirectTo: `/network/p/${params.uuid}` };
  }
  if (!isPersonal && isOwnProfile) {
    // redirect to personal profile since you are not viewing your own profile
    return { redirectTo: `/p/${params.uuid}` };
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
export const loadPersonalProfileData = async ({ params, state, dispatch }) =>
  defer({
    data: loadProfile({ params, state, dispatch, isPersonal: true }),
  });

export const loadNetworkProfileData = async ({ params, state, dispatch }) =>
  defer({
    data: loadProfile({ params, state, dispatch, isPersonal: false }),
  });
