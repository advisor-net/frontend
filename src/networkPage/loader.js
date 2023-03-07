import {defer} from 'react-router-dom';
import authService from '../services/authService';

const loadNetworkSearch = async () => {
  try {
    const response = await authService.getProfile();
    return {profile: response};
  } catch (error) {
    console.error(error);
    return {};
  }
};

// NOTE: not awaiting here to take advantage of defer behavior
// https://reactrouter.com/en/main/guides/deferred
export const loadNetworkSearchData = async ({params, request}) =>
  defer({
    data: loadNetworkSearch({params, request}),
  });
