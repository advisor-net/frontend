import { Button, Flex, useDisclosure } from '@chakra-ui/react';

import { ChatEngine, ChatEngineContext } from 'react-chat-engine';
import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSessionUser } from '../utils/session';
import ChatTermsModal from './ChatTermsModal';
import CreateNewDirectChatModal from './CreateNewDirectChatModal';
import ChatSettingsTop from './ChatSettingsTop';
import { HEADER_HEIGHT } from '../constants/all';

import chatService from '../services/chatService';
import networkService from '../services/networkService';

const findChatForUsername = (chats, username) => {
  for (const chat of Object.values(chats)) {
    const { people } = chat;
    const targetUser = people.find((p) => p.person.username === username);
    if (targetUser) {
      return chat;
    }
  }
  return null;
};

const ChatApp = () => {
  // need to redo this and make it have a hook to see that its changing...redux
  const sessionUser = getSessionUser();
  const needsModal = !(sessionUser.chatUserSecret && sessionUser.chatAgreedToTerms);
  const { isOpen: isTermsModalOpen, onClose: onCloseTermsModal } = useDisclosure({
    isOpen: needsModal,
  });

  const location = useLocation();

  const { chats, creds, setActiveChat } = useContext(ChatEngineContext);

  // set the active chat from the one in the URL or create a new chat
  useEffect(() => {
    const fetchUser = async (handle) => {
      const searchParams = new URLSearchParams();
      searchParams.set('handle', handle);
      const response = await networkService.userSearch(searchParams.toString());
      return response.results.length === 1 ? response.results[0] : null;
    };

    if (chats && location.search) {
      const params = new URLSearchParams(location.search);
      const targetHandle = params.get('with');
      const existingChat = findChatForUsername(chats, targetHandle);
      if (existingChat) {
        setActiveChat(existingChat.id);
      } else if (targetHandle) {
        fetchUser(targetHandle).then((recipientUser) => {
          if (recipientUser) {
            chatService.getOrCreateChat(
              creds,
              {
                handle: targetHandle,
                uuid: recipientUser.uuid,
                chatUser: recipientUser.chatUser,
                agreedToTerms: false,
              },
              () => null
            );
          }
        });
      }
    }
  }, [chats, creds, setActiveChat, location.search]);

  const {
    isOpen: isCreateNewDirectChatOpen,
    onClose: onCloseCreateNewDirectChat,
    onOpen: onOpenCreateNewDirectChat,
  } = useDisclosure();

  // TODO: render a custom new chat message form to fix the double space bar bug
  // TODO: timezones

  const renderNewDirectChatForm = () => {
    return (
      <Flex width="100%" padding={2} alignItems="center" justifyContent="center">
        <Button onClick={() => onOpenCreateNewDirectChat()} colorScheme="teal">
          + Create new chat
        </Button>
      </Flex>
    );
  };

  return (
    <>
      {!needsModal && (
        <ChatEngine
          height={`calc(100vh - ${HEADER_HEIGHT})`}
          projectID={process.env.REACT_APP_CHAT_ENGINE_PROJECT_ID}
          userName={sessionUser.chatUsername}
          userSecret={sessionUser.chatUserSecret}
          renderNewChatForm={() => renderNewDirectChatForm()}
          renderOptionsSettings={() => null}
          renderChatSettingsTop={(innerCreds, chat) => (
            <ChatSettingsTop {...innerCreds} {...chat} />
          )}
          // onNewMessage={(val, other) => console.log(val, other)}  // TODO: notifications
        />
      )}
      <ChatTermsModal isOpen={isTermsModalOpen} onClose={onCloseTermsModal} />
      <CreateNewDirectChatModal
        isOpen={isCreateNewDirectChatOpen}
        onClose={onCloseCreateNewDirectChat}
        projectID={process.env.REACT_APP_CHAT_ENGINE_PROJECT_ID}
        userName={sessionUser.chatUsername}
        userSecret={sessionUser.chatUserSecret}
      />
    </>
  );
};

export default ChatApp;
