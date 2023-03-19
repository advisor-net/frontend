import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  VStack,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { setProfile } from '../session/sessionSlice';
import { setToken } from '../session/token';
import authService from '../services/authService';
import StringInputFormComponent from '../components/forms/StringInputFormComponent';

import Logo from '../layout/Logo';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

// ToDo: add unable to login with credential async error handling
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const originalFrom = location.state?.from?.pathname || '/';
  const from = originalFrom === '/' ? '/p' : originalFrom;

  const signinWithCredentials = async (params) => {
    const tokenInfo = await authService.login(params);
    setToken(tokenInfo.token);

    // now fetch user info
    const userProfile = await authService.getProfile();
    dispatch(setProfile(userProfile));

    // Send them back to the page they tried to visit when they were
    // redirected to the login page. Use { replace: true } so we don't create
    // another entry in the history stack for the login page.  This means that
    // when they get to the protected page and click the back button, they
    // won't end up back on the login page, which is also really nice for the
    // user experience.
    const useFrom = from === '/p' ? `/p/${userProfile.uuid}` : from;
    navigate(useFrom, { replace: true });
  };

  return (
    <>
      <Box background="gray.100" paddingX={4}>
        <Flex height={16} alignItems="center" justifyContent="space-between">
          <HStack spacing={8} alignItems="center">
            <Logo />
          </HStack>
        </Flex>
      </Box>
      <Flex alignItems="center" justifyContent="center" direction="column" padding={4}>
        <Heading>Welcome to Advisor</Heading>
        <Box bg="white" p={6} rounded="md" w={64}>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={LoginSchema}
            validateOnMount={false}
            onSubmit={async (values) => {
              await signinWithCredentials({
                username: values.email,
                password: values.password,
              });
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
                          type="email"
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
                  <Button type="submit" colorScheme="teal" width="full" isLoading={isSubmitting}>
                    Login
                  </Button>
                </VStack>
              </Form>
            )}
          </Formik>
        </Box>
      </Flex>
    </>
  );
};

export default LoginPage;
