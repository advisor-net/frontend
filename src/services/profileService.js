import request from '../utils/request';

const profileService = {
  getUserDetails: async (uuid) =>
    request.get({
      url: `/user/profile/${uuid}/`,
    }),

  updateProfile: async (uuid, payload) => request.patch({
    url: `/user/profile/${uuid}/`,
    params: payload,
  })
};

export default profileService;
