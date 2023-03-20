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
  VStack,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import authService from '../services/authService';
import { getErrorMessageForFields } from '../utils/utils';
import StringInputFormComponent from '../components/forms/StringInputFormComponent';

const RequestResetSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});

const RequestPasswordReset = () => {
  const [successMessage, setSuccessMessage] = useState(null);

  return (
    <Flex alignItems="center" justifyContent="center" direction="column" padding={4}>
      <Heading>Request password reset link</Heading>
      <Box bg="white" p={6} rounded="md" width="600px">
        <Formik
          initialValues={{
            email: '',
          }}
          validateOnChange={false}
          validateOnBlur={false}
          validateOnMount={false}
          validationSchema={RequestResetSchema}
          onSubmit={async (values, { setFieldError }) => {
            try {
              await authService.requestPasswordReset(values);
              setSuccessMessage('We have sent a password reset link to this email.');
            } catch (e) {
              setFieldError(
                'email',
                e.message ||
                  getErrorMessageForFields(e, 'nonFieldErrors', 'email') ||
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
                <Button
                  type="submit"
                  colorScheme="teal"
                  width="full"
                  isLoading={isSubmitting}
                  formNoValidate
                >
                  Request password reset
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

export default RequestPasswordReset;
