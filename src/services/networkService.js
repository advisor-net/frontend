import request from '../utils/request';

const networkService = {
  userSearch: async query =>
    request.get({
      url: `/users?${query}`,
    }),

  industrySearch: async query =>
    request.get({
      url: query ? `/industries?${query}` : '/industries/',
    }),

  jobTitleSearch: async query =>
    request.get({
      url: query ? `/job_titles?${query}` : '/job_titles/',
    }),

  metroAreaSearch: async query =>
    request.get({
      url: query ? `/metros?${query}` : '/metros/',
    }),
};

export default networkService;
