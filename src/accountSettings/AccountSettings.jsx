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

const AccountSettingsSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Required'),
  newPassword: Yup.string().required('Required'),
});

const AccountSettings = () => {
  const [successMessage, setSuccessMessage] = useState(null);

  return (
    <Flex alignItems="flex-start" justifyContent="center" direction="column" padding={4}>
      <Heading>Account settings</Heading>
      <Heading fontSize="lg" marginTop={4}>Change password</Heading>
      <Box bg="white" paddingTop={4} rounded="md" width="600px">
        <Formik
          initialValues={{
            currentPassword: '',
            newPassword: '',
          }}
          validateOnChange={false}
          validateOnBlur={false}
          validateOnMount={false}
          validationSchema={AccountSettingsSchema}
          onSubmit={async (values, { setFieldError }) => {
            try {
              await authService.changePassword(values);
              setSuccessMessage('Successfully changed password');
            } catch (e) {
              setFieldError(
                'newPassword',
                e.message || e.originalResponse?.[0] ||
                  getErrorMessageForFields(e, ['nonFieldErrors', 'currentPassword', 'newPassword']) ||
                  'Unknown error'
              );
            }
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <VStack spacing={4} align="flex-start">
                <Field id="currentPassword" name="currentPassword" type="password">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={!!form.errors[field.name] && form.touched[field.name]}
                      isRequired
                    >
                      <FormLabel htmlFor="password">Current password</FormLabel>
                      <StringInputFormComponent
                        {...field}
                        onChange={(val) => form.setFieldValue(field.name, val)}
                        autoFocus="autofocus"
                        type="password"
                        variant="filled"
                      />
                      <FormErrorMessage>{form.errors[field.name]}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field id="newPassword" name="newPassword" type="password">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={!!form.errors[field.name] && form.touched[field.name]}
                      isRequired
                    >
                      <FormLabel htmlFor="password">New password</FormLabel>
                      <StringInputFormComponent
                        {...field}
                        onChange={(val) => form.setFieldValue(field.name, val)}
                        autoFocus="autofocus"
                        type="password"
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
                  Change password
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

export default AccountSettings;
