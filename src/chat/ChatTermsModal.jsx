import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

import { getSessionUser, setSessionUser } from '../utils/session';
import chatService from '../services/chatService';

const ChatTermsSchema = Yup.object().shape({
  agreedToTerms: Yup.boolean().required(),
});

const RulesOfConductCopy = () => (
  <Flex direction="column" gap={2} marginBottom={4}>
    <Text>
      There is absolutely no solicitation, bullying, shaming, or obscene language allowed on
      Advisor. You and anyone you message will have the ability to report you for abuse at any time.
    </Text>
    <Text fontWeight="medium">Punishments for abuse are suspension and bans.</Text>
    <Text>
      We offer direct messaging to help the network get answers to questions and to share advice.
      This is a privilege. We will keep message history for 30 days before removing it.
    </Text>
    <Text>
      Check the box below to acknowledge you understand these rules and are going to be cool.
    </Text>
  </Flex>
);

const ChatTermsModal = ({ isOpen, onClose }) => {
  const sessionUser = getSessionUser();

  const onSubmit = async (values) => {
    let response;
    if (sessionUser.chatUserSecret) {
      response = await chatService.updateTerms(sessionUser.uuid, values);
    } else {
      response = await chatService.getOrCreateChatUser(sessionUser.uuid, values);
    }
    setSessionUser(response);
    onClose();
  };

  const navigate = useNavigate();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <Formik
        initialValues={{
          agreedToTerms: false,
        }}
        validationSchema={ChatTermsSchema}
        validateOnMount
        onSubmit={async (values) => {
          await onSubmit(values);
        }}
      >
        {({ handleSubmit, isSubmitting, isValid, values }) => (
          <Form onSubmit={handleSubmit}>
            <ModalContent>
              <ModalHeader>Chat terms of service</ModalHeader>
              <ModalBody>
                <Flex direction="column">
                  <RulesOfConductCopy />
                  <Field id="agreedToTerms" name="agreedToTerms">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={!!form.errors[field.name] && form.touched[field.name]}
                        isRequired
                      >
                        <Checkbox
                          isChecked={field.value}
                          onChange={(e) => form.setFieldValue(field.name, e.target.checked)}
                        >
                          I agree to the rules of conduct and understand the repercussions
                        </Checkbox>
                      </FormControl>
                    )}
                  </Field>
                </Flex>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="teal"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  marginRight={2}
                >
                  Go back
                </Button>
                <Button
                  colorScheme="teal"
                  type="submit"
                  isLoading={isSubmitting}
                  isDisabled={!isValid || !values.agreedToTerms}
                  formNoValidate
                >
                  Start messaging
                </Button>
              </ModalFooter>
            </ModalContent>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default ChatTermsModal;
