import request from '../utils/request';

const networkService = {
  userSearch: async (query) => request.get({
    url: `/users?${query}`,
  }),
};

export default networkService;
