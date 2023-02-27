import request from '../utils/request';

const authService = {
  obtainTokenPair: async (params) => request.post({
    url: '/token/',
    params,
  }),

  getProfile: async (signal) => request.get({
    url: '/profile/',
    signal,
  }),
};

export default authService;
