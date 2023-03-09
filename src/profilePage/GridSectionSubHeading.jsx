import {
  Flex,
  Heading,
  Tooltip,
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';

const GridSectionSubHeading = ({ title, tooltipInfo }) =>
  tooltipInfo ? (
    <Flex gap={1} marginBottom={2} alignItems="center">
      <Heading fontSize="md">{title}</Heading>
      <Tooltip label={tooltipInfo} placement="top-end">
        <InfoOutlineIcon size="sm" />
      </Tooltip>
    </Flex>
  ) : (
    <Heading fontSize="md" marginBottom={2}>
      {title}
    </Heading>
  );

  export default GridSectionSubHeading;
  