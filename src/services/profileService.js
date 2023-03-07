import request from '../utils/request';

const profileService = {
  getUserDetails: async (uuid, signal) =>
    request.get({
      url: `/user/profile/${uuid}/`,
      signal,
    }),
};

export default profileService;
