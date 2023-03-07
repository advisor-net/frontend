import { HStack, Text } from '@chakra-ui/react';
import MoneyTalkIcon from './icons/MoneyTalkIcon';

const Logo = () => (
  <HStack>
    <MoneyTalkIcon height="2em" width="2em" />
    <Text fontSize="2xl">Advisor</Text>
  </HStack>
);

export default Logo;
