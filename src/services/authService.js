import request from '../utils/request';

const authService = {
  obtainTokenPair: async (params) => request.post({
    url: '/token/',
    params,
  }),

  getProfile: async () => request.get({
    url: '/profile/',
  }),
};

export default authService;
