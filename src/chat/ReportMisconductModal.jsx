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
  Text,
  Textarea,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import chatService from '../services/chatService';

const ReportedMisconductSchema = Yup.object().shape({
  handle: Yup.string().required('Required'),
  description: Yup.string().required('Required').min(10, 'Must be at least 10 characters.'),
});

const ReportingDescriptionCopy = () => (
  <Flex direction="column" gap={2} marginBottom={4}>
    <Text>Reporting this person could result in them getting suspended or permanently banned.</Text>
    <Text fontWeight="medium">
      Please provide a description for why you are reporting this person.
    </Text>
    <Text>Admins will review the incident shortly after you provide details on the incident.</Text>
  </Flex>
);

const ReportMisconductModal = ({ isOpen, onClose, reportedUserHandle }) => {
  const onSubmit = async (values) => {
    chatService.reportUser(values);
    onClose();
  };

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
          handle: reportedUserHandle,
          description: '',
        }}
        validationSchema={ReportedMisconductSchema}
        validateOnMount
        onSubmit={async (values) => {
          await onSubmit(values);
        }}
      >
        {({ handleSubmit, isSubmitting, isValid }) => (
          <Form onSubmit={handleSubmit}>
            <ModalContent>
              <ModalHeader>{`Report ${reportedUserHandle}`}</ModalHeader>
              <ModalBody>
                <Flex direction="column">
                  <ReportingDescriptionCopy />
                  <Field id="description" name="description">
                    {({ field, form }) => (
                      <FormControl isInvalid={!!form.errors[field.name]} isRequired>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                          value={field.value}
                          onChange={(e) => form.setFieldValue(field.name, e.target.value)}
                          placeholder="Description..."
                          autoFocus="autofocus"
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
                  isDisabled={!isValid}
                  formNoValidate
                >
                  Report user
                </Button>
              </ModalFooter>
            </ModalContent>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default ReportMisconductModal;
