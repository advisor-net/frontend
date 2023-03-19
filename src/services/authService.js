import request from '../utils/request';

const authService = {
  login: async (params) =>
    request.post({
      url: '/api_token_auth/',
      params,
    }),

  getProfile: async () =>
    request.get({
      url: '/profile/',
    }),
};

export default authService;
