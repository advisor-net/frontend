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
import { getUserUuid, removeJwtToken, removeRefreshToken, removeUserUuid } from './utils/session';
import Logo from './Logo';

const HEIGHT = 16;

const ProtectedLayout = () => {
  const navigate = useNavigate();

  const activeStyle = {
    textDecoration: 'underline',
  };

  // TODO: actually log the user out from an API perspective
  const signout = async () => {
    removeJwtToken();
    removeRefreshToken();
    removeUserUuid();
    navigate('/login');
  };

  return (
    <Flex direction="column">
      <Box background="gray.100" paddingX={4} position="fixed" top="0px" width="100%" zIndex={1}>
        <Flex height={HEIGHT} alignItems="center" justifyContent="space-between">
          <HStack spacing={8} alignItems="center">
            <Logo />
            <HStack as="nav" spacing={4} display="flex">
              <NavLink
                to={`/p/${getUserUuid()}`}
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
              >
                Profile
              </NavLink>
              <NavLink to="/network" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
                Network
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
      <Flex marginTop={HEIGHT} direction="column">
        <Outlet />
      </Flex>
    </Flex>
  );
};

export default ProtectedLayout;
