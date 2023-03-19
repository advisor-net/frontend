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

  requestPasswordReset: async (params) =>
    request.post({
      url: '/request_password_reset/',
      params,
    }),

  resetPassword: async (params) =>
    request.post({
      url: '/reset_password/',
      params,
    }),

  signup: async (params) =>
    request.post({
      url: '/signup/',
      params,
    }),

  verifyEmail: async (params) =>
    request.post({
      url: '/verify_email/',
      params,
    }),

  resendEmailVerification: async (params) =>
    request.post({
      url: '/resend_email_verification/',
      params,
    }),
};

export default authService;
