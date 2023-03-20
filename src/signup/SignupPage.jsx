import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  VStack,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { setProfile } from '../session/sessionSlice';
import { setToken } from '../session/token';
import authService from '../services/authService';
import { getErrorMessageForFields } from '../utils/utils';
import StringInputFormComponent from '../components/forms/StringInputFormComponent';

const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const signUpLinkUuid = location.pathname.split('/')[2];

  const onSubmit = async (values) => {
    await authService.signup({ ...values, signUpLinkUuid });

    const tokenInfo = await authService.login({
      username: values.email,
      password: values.password,
    });
    setToken(tokenInfo.token);

    // now fetch user info
    const userProfile = await authService.getProfile();
    dispatch(setProfile(userProfile));

    navigate(`/post_signup`);
  };

  return (
    <Flex alignItems="center" justifyContent="center" direction="column" padding={4}>
      <Heading>Sign up for Advisor</Heading>
      <Box bg="white" p={6} rounded="md" width="600px">
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validateOnChange={false}
          validateOnBlur={false}
          validateOnMount={false}
          validationSchema={SignupSchema}
          onSubmit={async (values, { setFieldError }) => {
            try {
              await onSubmit(values);
            } catch (e) {
              setFieldError(
                'password',
                e.message ||
                  getErrorMessageForFields(e, 'nonFieldErrors', 'email', 'password') ||
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
                <Field id="password" name="password" type="password">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={!!form.errors[field.name] && form.touched[field.name]}
                      isRequired
                    >
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <StringInputFormComponent
                        {...field}
                        onChange={(val) => form.setFieldValue(field.name, val)}
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
                  Sign up
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </Box>
    </Flex>
  );
};

export default SignupPage;
