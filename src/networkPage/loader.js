import { defer } from 'react-router-dom';
import lazyLoadProfile from '../session/lazyLoadProfile';

const loadNetworkSearch = async ({ state, dispatch }) => {
  try {
    const profile = await lazyLoadProfile(state, dispatch);
    return { profile };
  } catch (error) {
    console.error(error);
    return {};
  }
};

// NOTE: not awaiting here to take advantage of defer behavior
// https://reactrouter.com/en/main/guides/deferred
export const loadNetworkSearchData = async ({ params, state, dispatch }) =>
  defer({
    data: loadNetworkSearch({ params, state, dispatch }),
  });
