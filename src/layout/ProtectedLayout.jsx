import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { removeToken } from '../session/token';
import Logo from './Logo';
import { HEADER_HEIGHT } from '../constants/all';
import { getProfileUuid } from '../session/sessionSlice';
import authService from '../services/authService';

const ProtectedLayout = () => {
  const profileUuid = useSelector(getProfileUuid);

  const navigate = useNavigate();

  const activeStyle = {
    textDecoration: 'underline',
  };

  const signout = async () => {
    await authService.logout();
    removeToken();
    navigate('/login');
  };

  return (
    <Flex direction="column">
      <Box background="gray.100" paddingX={4} position="fixed" top="0px" width="100%" zIndex={1}>
        <Flex height={HEADER_HEIGHT} alignItems="center" justifyContent="space-between">
          <HStack spacing={8} alignItems="center">
            <Logo />
            <HStack as="nav" spacing={4} display="flex">
              <NavLink
                to={profileUuid ? `/p/${profileUuid}` : '/p'}
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
              >
                Profile
              </NavLink>
              <NavLink to="/network" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
                Network
              </NavLink>
              <NavLink to="/chat" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
                Chat
              </NavLink>
            </HStack>
          </HStack>
          <Flex alignItems="center">
            <Menu>
              <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minWidth={0}>
                <Avatar size="sm" background="teal.500" />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => navigate('/account')}>Account settings</MenuItem>
                <MenuDivider />
                <MenuItem onClick={signout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Box>
      <Flex marginTop={HEADER_HEIGHT} direction="column">
        <Outlet />
      </Flex>
    </Flex>
  );
};

export default ProtectedLayout;
