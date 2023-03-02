
import { useLocation, useNavigate } from 'react-router-dom';
import authService from './service';
import { setJwtToken, setRefreshToken, setUserUuid} from '../utils/session';

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Checkbox,
  Button,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import Logo from '../Logo';
 
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
  rememberMe: Yup.boolean(),
});

// ToDo: fix theming
// ToDo: add unable to login with credential async error handling
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const originalFrom = location.state?.from?.pathname || '/';
  const from = originalFrom === '/' ? '/profile' : originalFrom;

  const signinWithCredentials = async (params) => {
    const tokenInfo = await authService.obtainTokenPair(params);
    setJwtToken(tokenInfo.access);
    setRefreshToken(tokenInfo.refresh);

    // now fetch user info
    const userProfile = await authService.getProfile();
    setUserUuid(userProfile.uuid);

    // Send them back to the page they tried to visit when they were
    // redirected to the login page. Use { replace: true } so we don't create
    // another entry in the history stack for the login page.  This means that
    // when they get to the protected page and click the back button, they
    // won't end up back on the login page, which is also really nice for the
    // user experience.
    let useFrom = from === '/profile' ? `/profile/${userProfile.uuid}` : from;
    navigate(useFrom, { replace: true });
  };

  return (
    <>
      <Box background={'gray.100'} paddingX={4}>
        <Flex height={16} alignItems={'center'} justifyContent={'space-between'}>
          <HStack spacing={8} alignItems={'center'}>
            <Logo/>
          </HStack>
        </Flex>
      </Box>
      <Flex alignItems="center" justifyContent="center" >
        <Box bg="white" p={6} rounded="md" w={64}>
          <Formik
            initialValues={{
              email: "",
              password: "",
              rememberMe: false
            }}
            validationSchema={LoginSchema}
            validateOnMount={false}
            onSubmit={async (values) => {
              await signinWithCredentials(
                {
                  username: values.email,
                  password: values.password,
                },
              );
            }}
          >
            {({ handleSubmit, errors, touched, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <VStack spacing={4} align="flex-start">
                  <FormControl isInvalid={!!errors.email && touched.email}>
                    <FormLabel htmlFor="email">Email address</FormLabel>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      variant="filled"
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.password && touched.password}>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type="password"
                      variant="filled"
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  <Field
                    as={Checkbox}
                    id="rememberMe"
                    name="rememberMe"
                    colorScheme="purple"
                  >
                    Remember me?
                  </Field>
                  <Button type="submit" colorScheme="purple" width="full" isLoading={isSubmitting}>
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
