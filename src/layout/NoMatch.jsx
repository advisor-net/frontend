import { Button, Flex, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NoMatch = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login');
  }, [navigate]);

  return (
    <Flex direction="column" padding={2}>
      <Text>There is nothing here!</Text>
      <Button colorScheme="teal" onClick={() => navigate('/login')} size="md">
        Go to login page
      </Button>
    </Flex>
  );
};

export default NoMatch;
