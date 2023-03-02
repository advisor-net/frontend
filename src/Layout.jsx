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
import { useAuth } from './auth/authContext';
import Logo from './Logo';

const Layout = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  
  const activeStyle = {
    textDecoration: "underline",
  };

  return (
    <>
      <Box background={'gray.100'} paddingX={4}>
        <Flex height={16} alignItems={'center'} justifyContent={'space-between'}>
          <HStack spacing={8} alignItems={'center'}>
            <Logo/>
            {!!auth.user && (
              <HStack
                as={'nav'}
                spacing={4}
                display={'flex'}
              >
                <NavLink 
                  to={`/profile/${auth.user.uuid}`}
                  style={({ isActive }) =>
                    isActive ? activeStyle : undefined
                  }
                >
                  Profile
                </NavLink>
                <NavLink 
                  to={'/n'}
                  style={({ isActive }) =>
                    isActive ? activeStyle : undefined
                  }
                >
                  Network
                </NavLink>
              </HStack>
            )}
          </HStack>
          {!!auth.user && (
            <Flex alignItems={'center'}>
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minWidth={0}>
                  <Avatar
                    size={'sm'}
                    background='teal.500'
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => navigate('/account')}>Account settings</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={
                    () => {
                      auth.signout(() => navigate('/login'));
                    }
                  }
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          )}
        </Flex>
      </Box>
      <Outlet />
    </>
  );
};

export default Layout;
