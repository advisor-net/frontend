import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useContext } from 'react';
import { ChatEngineContext } from 'react-chat-engine';

import chatService from '../services/chatService';
import UserSearchSelector from '../components/selectorComponents/UserSearchSelector';

const NewDirectChatSchema = Yup.object().shape({
  username: Yup.mixed().required('Required'),
});

const CreateNewDirectChatModal = ({ isOpen, onClose }) => {
  const { creds } = useContext(ChatEngineContext);

  // TODO: set active chat if the chat has not been created
  const onSubmit = async ({ handle, uuid, existingChatUser, agreedToTerms }) => {
    const { projectID, userSecret, userName } = creds;
    await chatService.getOrCreateChat(
      { projectID, userSecret, userName },
      { handle, uuid, chatUser: existingChatUser, agreedToTerms },
      () => onClose()
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <Formik
        initialValues={{
          username: null,
        }}
        validationSchema={NewDirectChatSchema}
        validateOnMount
        onSubmit={async (values) => {
          const { username: usernameObj } = values;
          const { handle, uuid, chatUser: existingChatUser } = usernameObj;
          await onSubmit({
            handle,
            uuid,
            existingChatUser,
            agreedToTerms: false,
          });
        }}
      >
        {({ handleSubmit, isSubmitting, isValid, values }) => (
          <Form onSubmit={handleSubmit}>
            <ModalContent>
              <ModalHeader>Create chat</ModalHeader>
              <ModalBody>
                <Flex direction="column">
                  <Field id="username" name="username">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={!!form.errors[field.name] && form.touched[field.name]}
                        isRequired
                      >
                        <FormLabel>Handle</FormLabel>
                        <UserSearchSelector
                          {...field}
                          onChange={(val) => form.setFieldValue(field.name, val)}
                        />
                        <FormErrorMessage>{form.errors[field.name]}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Flex>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="teal" variant="outline" onClick={onClose} marginRight={2}>
                  Cancel
                </Button>
                <Button
                  colorScheme="teal"
                  type="submit"
                  isLoading={isSubmitting}
                  isDisabled={!isValid || !values.username}
                  formNoValidate
                >
                  Create chat
                </Button>
              </ModalFooter>
            </ModalContent>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreateNewDirectChatModal;
