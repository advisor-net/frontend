import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import authService from '../services/authService';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState(null);
  const [hasRequested, setHasRequested] = useState(false);

  const verifyLinkUuid = location.pathname.split('/')[2];

  useEffect(() => {
    const onSubmit = async () => {
      await authService.verifyEmail({ verifyLinkUuid });
    };
    if (verifyLinkUuid) {
      onSubmit()
        .then(() => {
          navigate(`/p`);
        })
        .catch(() => setError('Unknown error verifying email. Please request another link.'));
    }
  }, [verifyLinkUuid, navigate, setError]);

  const handleReRequest = async () => {
    await authService.resendEmailVerification();
    setHasRequested(true);
  };

  return (
    <Flex alignItems="center" justifyContent="center" direction="column" padding={4} gap={4}>
      <Heading>Verify email</Heading>
      {error ? (
        <Flex direction="column" gap={2}>
          <Text color="red">{error}</Text>
          <Button colorScheme="teal" onClick={handleReRequest} isDisabled={hasRequested}>
            Request new verification email
          </Button>
        </Flex>
      ) : verifyLinkUuid ? (
        <Flex>
          <Text>Verifying email....</Text>
        </Flex>
      ) : (
        <Flex direction="column" gap={2}>
          <Text>You must verify your email address before accessing the application.</Text>
          <Text>Check your email for a verification link.</Text>
          <Text>If you cannot find a verification link, request another below.</Text>
          <Button colorScheme="teal" onClick={handleReRequest} isDisabled={hasRequested}>
            Request verification email
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default VerifyEmail;
