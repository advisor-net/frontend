import request from '../utils/request';

const chatService = {
  creatChatUser: async (uuid, payload) =>
    request.post({
      url: `/user/chat_user/${uuid}/`,
      params: payload,
    }),

  updateTerms: async (uuid, payload) =>
    request.post({
      url: `/user/chat_user_terms/${uuid}/`,
      params: payload,
    }),
};

export default chatService;
