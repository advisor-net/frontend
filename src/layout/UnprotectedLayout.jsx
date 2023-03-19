import { Box, Flex, HStack } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Logo from './Logo';
import { HEADER_HEIGHT } from '../constants/all';

const UnprotectedLayout = () => {
  return (
    <Flex direction="column">
      <Box background="gray.100" paddingX={4} position="fixed" top="0px" width="100%" zIndex={1}>
        <Flex height={16} alignItems="center" justifyContent="space-between">
          <HStack spacing={8} alignItems="center">
            <Logo />
          </HStack>
        </Flex>
      </Box>
      <Flex marginTop={HEADER_HEIGHT} direction="column">
        <Outlet />
      </Flex>
    </Flex>
  );
};

export default UnprotectedLayout;
