import {
  Box,
  Flex,
  Avatar,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import Logo from './Logo';

const Layout = () => {
  return (
    <>
      <Box background={'gray.100'} paddingX={4}>
        <Flex height={16} alignItems={'center'} justifyContent={'space-between'}>
          <HStack spacing={8} alignItems={'center'}>
            <Logo/>
          </HStack>
        </Flex>
      </Box>
      <Outlet />
    </>
  );
};

export default Layout;
