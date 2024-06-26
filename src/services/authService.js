import request from '../utils/request';

const authService = {
  login: async (params) =>
    request.post({
      url: '/api_token_auth/',
      params,
    }),

  logout: async () =>
    request.delete({
      url: '/logout/',
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

  joinWaitlist: async (params) =>
    request.post({
      url: '/waitlist/',
      params,
    }),

  changePassword: async (params) =>
    request.post({
      url: '/change_password/',
      params,
    }),
};

export default authService;
