import { useState } from 'react';

import { Button, Flex, Heading, Text } from '@chakra-ui/react';

import authService from '../services/authService';

const PostSignup = () => {
  const [hasRequested, setHasRequested] = useState(false);
  const handleReRequest = async () => {
    await authService.resendEmailVerification();
    setHasRequested(true);
  };

  return (
    <Flex alignItems="center" justifyContent="center" direction="column" padding={4} gap={4}>
      <Heading>Signup successful!</Heading>
      <Text>We have sent a verification email to your inbox.</Text>
      <Text>If you do not receive one in the next few minutes, request a new email below.</Text>
      <Button isDisabled={hasRequested} onClick={handleReRequest} colorScheme="teal">
        Resend verification email
      </Button>
    </Flex>
  );
};

export default PostSignup;
