import {
  Badge,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { InfoOutlineIcon, SpinnerIcon } from '@chakra-ui/icons';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { FIELD_KEYS } from './constants';

import StringInputFormComponent from '../components/forms/StringInputFormComponent';

import profileService from '../services/profileService';
import { containsSpecialChars, hasWhiteSpace, startsWithNumber } from '../utils/utils';

const FirstTimeCopy = () => (
  <Flex direction="column" gap={2} marginBottom={4}>
    <Text>
      Welcome to the world&apos;s first anonymous financial network. Let&apos;s configure your
      profile.
    </Text>
    <Text fontWeight="medium">This should take less than 5 minutes.</Text>
    <Text>
      It will be helpful to have your banking, investment, and personal finance management
      applications open to help input this information.
    </Text>
    <Text>The information you enter here will be visibile to other people in the network.</Text>
    <Text fontWeight="medium">
      We will never divulge contact information, such as your email, to other members of the
      network.
    </Text>
    <Text>
      Most of the information we ask for is strictly demographic and should not be self identifying.
    </Text>
    <Text fontWeight="medium">
      We are asking for this information to help you and others find peers, mentors, and mentees to
      learn from.
    </Text>
    <Text>
      As you enter your information in the next few screens, leverage the info icons (
      <InfoOutlineIcon />) for more information on the fields you are filling out.
    </Text>
    <Text marginTop={4}>
      Let&apos;s start with your handle. This is what others will see you as in the network, so make
      it fun!
    </Text>
  </Flex>
);

const ChangeHandleCopy = () => (
  <Flex direction="column" gap={2} marginBottom={4}>
    <Text>Changing your handle is like changing your name.</Text>
    <Text fontWeight="medium">
      Once you change your handle, someone else will be able to claim it.
    </Text>
  </Flex>
);

export const APPLICABLE_FIELD_KEYS = [FIELD_KEYS.HANDLE];

// TODO: debounce the validation to save query hits
const HandleModal = ({ isOpen, onClose, onUpdate, user, requiresOnboarding }) => {
  const onSubmit = async (values) => {
    onUpdate(values, onClose);
  };

  const validate = async (values) => {
    const errors = {};
    const handleSchema = Yup.string()
      .required('Required')
      .max(24, 'Must be shorter than 24 characters')
      .min(4, 'Must be at least 4 characters')
      .test(
        'doesNotContainSpecialChars',
        'Cannot contain special characters other than an underscore',
        (v) => !containsSpecialChars(v)
      )
      .test('hasWhiteSpace', 'Cannot have white space', (v) => !hasWhiteSpace(v))
      .test('startsWithNumber', 'Cannot start with a number', (v) => !startsWithNumber(v));
    try {
      await handleSchema.validate(values.handle);
    } catch (e) {
      [errors.handle] = e.errors;
      return errors;
    }

    try {
      const response = await profileService.checkHandle(user.uuid, { handle: values.handle });
      if (!response.available) {
        errors.handle = 'Handle is not available';
      }
    } catch (e) {
      errors.handle = e.message || e.originalResponse?.handle?.[0] || 'Unknown error';
    }
    return errors;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      closeOnEsc={!requiresOnboarding}
      closeOnOverlayClick={!requiresOnboarding}
    >
      <ModalOverlay />
      <Formik
        initialValues={{ handle: user.handle || '' }}
        validate={validate}
        validateOnBlur={false}
        validateOnChange
        validateOnMount
        onSubmit={async (values) => {
          await onSubmit(values);
        }}
      >
        {({ handleSubmit, isSubmitting, isValidating, isValid }) => (
          <Form onSubmit={handleSubmit}>
            <ModalContent>
              <ModalHeader>
                {requiresOnboarding ? 'Welcome to Advisor!' : 'Change handle'}
              </ModalHeader>
              {!requiresOnboarding && <ModalCloseButton />}
              <ModalBody>
                <Flex direction="column">
                  {requiresOnboarding ? <FirstTimeCopy /> : <ChangeHandleCopy />}
                  <Field id="handle" name="handle">
                    {({ field, form }) => (
                      <FormControl isInvalid={!!form.errors[field.name]} isRequired>
                        <FormLabel>Handle</FormLabel>
                        <Flex alignItems="center">
                          <StringInputFormComponent
                            {...field}
                            onChange={(val) => form.setFieldValue(field.name, val)}
                            width="50%"
                            autoFocus="autofocus"
                          />
                          <Flex marginLeft={2} alignItems="center">
                            {form.errors[field.name] ? (
                              <FormErrorMessage marginTop={0}>
                                {form.errors[field.name]}
                              </FormErrorMessage>
                            ) : !form.errors[field.name] && !isValidating ? (
                              <Badge colorScheme="green">Available</Badge>
                            ) : isValidating ? (
                              <SpinnerIcon />
                            ) : null}
                          </Flex>
                        </Flex>
                      </FormControl>
                    )}
                  </Field>
                </Flex>
              </ModalBody>
              <ModalFooter>
                {!requiresOnboarding && (
                  <Button colorScheme="teal" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                )}
                <Button
                  marginLeft={2}
                  colorScheme="teal"
                  type="submit"
                  isLoading={isSubmitting}
                  formNoValidate
                  isDisabled={!isValid}
                >
                  Set handle
                </Button>
              </ModalFooter>
            </ModalContent>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default HandleModal;
