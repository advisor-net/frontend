import { ChatEngine } from 'react-chat-engine';
import { useDisclosure } from '@chakra-ui/react';
import { getSessionUser } from '../utils/session';
import ChatTermsModal from './ChatTermsModal';
import { HEADER_HEIGHT } from '../constants/all';

const DirectChatPage = () => {
  // need to redo this and make it have a hook to see that its changing...redux
  const sessionUser = getSessionUser();

  const needsModal = !(sessionUser.chatUserSecret && sessionUser.chatAgreedToTerms);

  const { isOpen, onClose } = useDisclosure({ isOpen: needsModal });

  // TODO: render a custom new chat message form
  // TODO: render a custom new chat form where we search the network for people
  // TOOD: render a custom profile form on the right for the person details

  return (
    <>
      {!needsModal && (
        <ChatEngine
          height={`calc(100vh - ${HEADER_HEIGHT})`}
          userName={sessionUser.chatUsername}
          userSecret={sessionUser.chatUserSecret}
          projectID={process.env.REACT_APP_CHAT_ENGINE_PROJECT_ID}
        />
      )}
      <ChatTermsModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default DirectChatPage;
