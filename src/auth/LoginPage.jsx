
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';
import { useEffectOnce } from '../utils/hooks';

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
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
 
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
  const { initialLoginAttempts, signinWithCredentials, signinWithToken } = useAuth();

  const originalFrom = location.state?.from?.pathname || '/';
  const from = originalFrom === '/' ? '/profile' : originalFrom;

  const rerouteCallback = (userInfo) => {
    // Send them back to the page they tried to visit when they were
    // redirected to the login page. Use { replace: true } so we don't create
    // another entry in the history stack for the login page.  This means that
    // when they get to the protected page and click the back button, they
    // won't end up back on the login page, which is also really nice for the
    // user experience.
    let useFrom = from === '/profile' ? `/profile/${userInfo.uuid}` : from;
    navigate(useFrom, { replace: true });
  }

  // attempt to login from token first, only do this one time on mount
  // need to use special useEffect to prevent mount, unmount behavior
  useEffectOnce(() => {
    let controller = new AbortController();
    const controlledFetch = async () => {
      await signinWithToken(rerouteCallback, controller.signal)
      controller = null;
    };

    // need this check so the redirect request to the login page when getting
    // an authorized response in request.js does not trigger again
    if (initialLoginAttempts === 0) {
      controlledFetch(); 
    }

    return () => {
      controller?.abort();
    };
  }, [initialLoginAttempts])


  return (
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
              rerouteCallback,
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
  );
};

export default LoginPage;
