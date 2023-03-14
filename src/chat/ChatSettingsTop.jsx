import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';

import { useQuery } from 'react-query';
import profileService from '../services/profileService';
import { formatLargePrice } from '../utils/utils';

const ChatSettingsTop = ({ userName, admin, people }) => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);

  let otherChatPerson;
  let otherChatPersonUuid;

  if (admin && people) {
    otherChatPerson = (people.find((p) => p.person.username !== userName) || {}).person || {};
    otherChatPersonUuid = otherChatPerson.custom_json
      ? JSON.parse(otherChatPerson.custom_json)?.uuid
      : null;
  }

  const searchResult = useQuery(
    ['userDetail', otherChatPersonUuid],
    () => profileService.getUserDetails(otherChatPersonUuid),
    {
      cacheTime: 0,
      enabled: false,
      refetchOnWindowFocus: false,
      retry: false,
      onError: () => null,
      onSuccess: (data) => {
        setUserDetails(data);
      },
    }
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (otherChatPersonUuid) {
      searchResult.refetch();
    }
  }, [otherChatPersonUuid]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return otherChatPersonUuid ? (
    <Card margin={2}>
      <CardHeader>
        <Heading size="md">{otherChatPerson.username}</Heading>
      </CardHeader>
      <CardBody>
        {searchResult.isFetching ? (
          <Spinner size="lg" />
        ) : userDetails ? (
          <Flex>
            <Stat>
              <StatLabel>Net worth</StatLabel>
              <StatNumber>{formatLargePrice(userDetails.netWorth)}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Annual income</StatLabel>
              <StatNumber>{formatLargePrice(userDetails.incTotalAnnual)}</StatNumber>
            </Stat>
          </Flex>
        ) : null}
      </CardBody>
      <CardFooter>
        <Button
          size="sm"
          colorScheme="teal"
          onClick={() => navigate(`/network/p/${otherChatPersonUuid}`)}
        >
          View profile
        </Button>
      </CardFooter>
    </Card>
  ) : null;
};

export default ChatSettingsTop;
