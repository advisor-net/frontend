import authService from '../services/authService';
import { getProfile, setProfile } from './sessionSlice';

const lazyLoadProfile = async (state, dispatch) => {
  try {
    let user = getProfile(state);
    if (!user) {
      const response = await authService.getProfile();
      dispatch(setProfile(response));
      user = response;
    }
    return user;
  } catch (error) {
    console.error(error);
    return {};
  }
};

export default lazyLoadProfile;
