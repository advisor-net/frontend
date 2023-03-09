import request from '../utils/request';

const profileService = {
  getUserDetails: async (uuid) =>
    request.get({
      url: `/user/profile/${uuid}/`,
    }),

  updateProfile: async (uuid, payload) =>
    request.patch({
      url: `/user/profile/${uuid}/`,
      params: payload,
    }),

  checkHandle: async (uuid, payload) =>
    request.post({
      url: `/user/check_handle/${uuid}/`,
      params: payload,
    }),

  updateHandle: async (uuid, payload) =>
    request.patch({
      url: `/user/update_handle/${uuid}/`,
      params: payload,
    }),
};

export default profileService;
