import { getOrCreateChat } from 'react-chat-engine';
import request from '../utils/request';

const chatService = {
  getOrCreateChat: async (senderCredentials, recipientInfo, callback) => {
    const { handle, uuid, chatUser, agreedToTerms } = recipientInfo;
    if (!chatUser) {
      await chatService.getOrCreateChatUser(uuid, { agreedToTerms });
    }

    const { projectID, userSecret, userName } = senderCredentials;
    getOrCreateChat(
      { projectID, userSecret, userName },
      // NOTE: When is_direct_chat is true, the title will be rendered as the handle of the
      // other person. So adding the deleted user title will only render if the user is deleted
      { is_direct_chat: true, usernames: [handle], title: `DM with ${handle} [deleted]` },
      (responseData) => callback && callback(responseData)
    );
  },

  getOrCreateChatUser: async (uuid, payload) =>
    request.post({
      url: `/user/chat_user/${uuid}/`,
      params: payload,
    }),

  updateTerms: async (uuid, payload) =>
    request.post({
      url: `/user/chat_user_terms/${uuid}/`,
      params: payload,
    }),

  reportUser: async (payload) => 
    request.post({
      url: `/user/report_misconduct/`,
      params: payload,
    }),
};

export default chatService;
