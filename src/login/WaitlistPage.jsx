import { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import authService from '../services/authService';
import { getErrorMessageForFields } from '../utils/utils';
import StringInputFormComponent from '../components/forms/StringInputFormComponent';

const WaitlistSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  howDidYouHearAboutUs: Yup.string().required('Required'),
  whyDoYouWantToJoin: Yup.string().required('Required'),
});

const WaitlistPage = () => {
  const [successMessage, setSuccessMessage] = useState(null);

  return (
    <Flex alignItems="center" justifyContent="center" direction="column" padding={4}>
      <Heading>Join the waitlist</Heading>
      <Box bg="white" p={6} rounded="md" width="600px">
        <Formik
          initialValues={{
            email: '',
            howDidYouHearAboutUs: '',
            whyDoYouWantToJoin: '',
          }}
          validateOnChange={false}
          validateOnBlur={false}
          validateOnMount={false}
          validationSchema={WaitlistSchema}
          onSubmit={async (values, { setFieldError }) => {
            try {
              await authService.joinWaitlist(values);
              setSuccessMessage(
                'Congratulations! You are on the waitlist. We will email you when things are ready!'
              );
            } catch (e) {
              setFieldError(
                'whyDoYouWantToJoin',
                e.message ||
                  getErrorMessageForFields(
                    e,
                    ['nonFieldErrors',
                    'email',
                    'howDidYouHearAboutUs',
                    'whyDoYouWantToJoin']
                  ) ||
                  'Unknown error'
              );
            }
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <VStack spacing={4} align="flex-start">
                <Field id="email" name="email" type="email">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={!!form.errors[field.name] && form.touched[field.name]}
                      isRequired
                    >
                      <FormLabel htmlFor="email">Email address</FormLabel>
                      <StringInputFormComponent
                        {...field}
                        onChange={(val) => form.setFieldValue(field.name, val)}
                        autoFocus="autofocus"
                        variant="filled"
                      />
                      <FormErrorMessage>{form.errors[field.name]}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field id="howDidYouHearAboutUs" name="howDidYouHearAboutUs">
                  {({ field, form }) => (
                    <FormControl isInvalid={!!form.errors[field.name]} isRequired>
                      <FormLabel>How did you hear about us?</FormLabel>
                      <Textarea
                        value={field.value}
                        onChange={(e) => form.setFieldValue(field.name, e.target.value)}
                        placeholder="I heard about you from..."
                      />
                      <FormErrorMessage>{form.errors[field.name]}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field id="whyDoYouWantToJoin" name="whyDoYouWantToJoin">
                  {({ field, form }) => (
                    <FormControl isInvalid={!!form.errors[field.name]} isRequired>
                      <FormLabel>Why do you want to join advisor?</FormLabel>
                      <Textarea
                        value={field.value}
                        onChange={(e) => form.setFieldValue(field.name, e.target.value)}
                        placeholder="I want to join because..."
                      />
                      <FormErrorMessage>{form.errors[field.name]}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Button
                  type="submit"
                  colorScheme="teal"
                  width="full"
                  isLoading={isSubmitting}
                  formNoValidate
                >
                  Join waitlist
                </Button>
                {successMessage && <Text color="teal">{successMessage}</Text>}
              </VStack>
            </Form>
          )}
        </Formik>
      </Box>
    </Flex>
  );
};

export default WaitlistPage;
