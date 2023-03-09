import { Suspense, useState } from 'react';

import {
  Text,
  Heading,
  Flex,
  Button,
  Grid,
  GridItem,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import EditUserProfileModal from './EditUserProfileModal';

import { useLoaderData, useAsyncValue, Await } from 'react-router-dom';

import { formatLargePrice, formatFloat } from '../utils/utils';

import { FIELD_KEYS, FIELD_LABELS, FIELD_TOOLTIPS } from './constants';
import {
  CURRENT_PFM_LABELS,
  GENDER_LABELS,
  JOB_LEVEL_LABELS,
  FIELD_PLACEHOLDER,
} from '../constants/all';
import profileService from '../services/profileService';
import { getUserUuid } from '../utils/session';

const getDisplayValueForKey = ({ user, fieldKey }) => {
  switch (fieldKey) {
    case FIELD_KEYS.HANDLE:
      return user.handle || FIELD_PLACEHOLDER;
    case FIELD_KEYS.METRO:
      return (user.metro || {}).name || FIELD_PLACEHOLDER;
    case FIELD_KEYS.INDUSTRY:
      return (user.industry || {}).name || FIELD_PLACEHOLDER;
    case FIELD_KEYS.JOB_TITLE:
      return (user.jobTitle || {}).name || FIELD_PLACEHOLDER;
    case FIELD_KEYS.GENDER:
      return user.gender ? GENDER_LABELS[user.gender] : FIELD_PLACEHOLDER;
    case FIELD_KEYS.LEVEL:
      return user.level ? JOB_LEVEL_LABELS[user.level] : FIELD_PLACEHOLDER;
    case FIELD_KEYS.CURRENT_PFM:
      return user.currentPfm ? CURRENT_PFM_LABELS[user.currentPfm] : FIELD_PLACEHOLDER;
    case FIELD_KEYS.AGE:
      return user.age || FIELD_PLACEHOLDER;
    case FIELD_KEYS.INC_PRIMARY_TAX_FED:
    case FIELD_KEYS.INC_PRIMARY_TAX_STATE:
    case FIELD_KEYS.INC_VARIABLE_TAX_FED:
    case FIELD_KEYS.INC_VARIABLE_TAX_STATE:
    case FIELD_KEYS.INC_SECONDARY_TAX_FED:
    case FIELD_KEYS.INC_SECONDARY_TAX_STATE:
    case FIELD_KEYS.INC_ANNUAL_TAX_NET:
      return `${formatFloat(user[fieldKey], 2) || FIELD_PLACEHOLDER}%`;
    default:
      return user[fieldKey] ? formatLargePrice(user[fieldKey], 3) : `$${FIELD_PLACEHOLDER}`;
  }
};

const getStyleSettingsForPosNeg = ({ user, fieldKey }) => {
  switch (fieldKey) {
    case FIELD_KEYS.NET_MONTHLY_PROFIT_LOSS:
    case FIELD_KEYS.NET_WORTH: {
      const value = user[fieldKey];
      if (value === null || value === undefined) {
        return { background: 'unset', color: 'unset' };
      }
      if (parseFloat(value) >= 0) {
        return { background: 'green', color: '#fff' };
      } else {
        return { background: 'red', color: '#fff' };
      }
    }
    default:
      return { background: 'unset', color: 'unset' };
  }
};

// TODO: rendering tooltip when there is an ellipsis
const FieldValue = ({ title, displayValue, tooltipInfo, maxWidth = '300px' }) => (
  <Flex direction="column" gap={1} maxWidth={maxWidth}>
    {!!tooltipInfo ? (
      <Flex alignItems="center" gap={1}>
        <Text fontWeight="medium">{title}</Text>
        <Tooltip label={tooltipInfo} placement="top-end">
          <InfoOutlineIcon size="sm" />
        </Tooltip>
      </Flex>
    ) : (
      <Text fontWeight="medium">{title}</Text>
    )}
    <Text fontStyle="italic" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
      {displayValue}
    </Text>
  </Flex>
);

const ControlledFieldValue = ({ user, fieldKey, maxWidth = '300px' }) => {
  return (
    <FieldValue
      title={FIELD_LABELS[fieldKey] || fieldKey}
      displayValue={getDisplayValueForKey({ user, fieldKey })}
      tooltipInfo={FIELD_TOOLTIPS[fieldKey]}
      maxWidth={maxWidth}
    />
  );
};

const SummaryFieldValue = ({ user, fieldKey }) => (
  <Grid alignItems="center" gap={4} templateColumns="repeat(4, 1fr)" marginBottom={2}>
    <GridItem />
    <GridItem textAlign="right" colSpan={2}>
      {!!FIELD_TOOLTIPS[fieldKey] ? (
        <Flex gap={1} justifyContent="flex-end" alignItems="center">
          <Text fontWeight="medium">{FIELD_LABELS[fieldKey] || fieldKey}</Text>
          <Tooltip label={FIELD_TOOLTIPS[fieldKey]} placement="top-end">
            <InfoOutlineIcon size="sm" />
          </Tooltip>
        </Flex>
      ) : (
        <Text fontWeight="medium">{FIELD_LABELS[fieldKey] || fieldKey}</Text>
      )}
    </GridItem>
    <GridItem
      border="1px solid #ddd"
      borderRadius={4}
      padding={1}
      {...getStyleSettingsForPosNeg({ user, fieldKey })}
    >
      <Text fontStyle="italic">{getDisplayValueForKey({ user, fieldKey })}</Text>
    </GridItem>
  </Grid>
);

const SectionHeading = ({ title, tooltipInfo, isOwnProfile, onEdit }) => (
  <Flex alignItems="center" marginBottom={2}>
    {!!tooltipInfo ? (
      <Flex flexGrow={1} gap={1} alignItems="center">
        <Heading fontSize="lg">{title}</Heading>
        <Tooltip label={tooltipInfo} placement="top-end">
          <InfoOutlineIcon size="sm" />
        </Tooltip>
      </Flex>
    ) : (
      <Heading fontSize="lg" flexGrow={1}>
        {title}
      </Heading>
    )}
    {isOwnProfile && onEdit && (
      <Button size="sm" colorScheme="teal" onClick={onEdit}>
        Edit
      </Button>
    )}
  </Flex>
);

const SectionSubHeading = ({ title, tooltipInfo }) =>
  !!tooltipInfo ? (
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

const ProfilePageComponent = () => {
  const { user: originalUser, isOwnProfile } = useAsyncValue();

  const [user, setUser] = useState(originalUser);

  const commonFlexProps = {
    direction: 'column',
    border: '1px solid #ddd',
    borderRadius: 4,
    padding: 4,
    minWidth: '800px',
  };

  const {
    isOpen: isEditUserProfileModalOpen,
    onOpen: onOpenEditUserProfileModal,
    onClose: onCloseEditUserProfileModal,
  } = useDisclosure();

  const handleUpdate = async (values, callback) => {
    const uuid = getUserUuid();
    const response = await profileService.updateProfile(uuid, values);
    setUser(response);
    callback();
  };

  return (
    <>
      <Flex direction="column" alignItems="center" gap={4} padding={4}>
        <Flex {...commonFlexProps}>
          <SectionHeading
            title={isOwnProfile ? 'Your profile' : 'User profile'}
            tooltipInfo={null}
            isOwnProfile={isOwnProfile}
            onEdit={onOpenEditUserProfileModal}
          />
          <Grid gap={4}>
            <GridItem colSpan={3} rowSpan={1}>
              <ControlledFieldValue fieldKey={FIELD_KEYS.HANDLE} user={user} maxWidth="unset" />
            </GridItem>
            <GridItem colSpan={1} rowSpan={1}>
              <ControlledFieldValue fieldKey={FIELD_KEYS.AGE} user={user} />
            </GridItem>
            <GridItem colSpan={1} rowSpan={1}>
              <ControlledFieldValue fieldKey={FIELD_KEYS.GENDER} user={user} />
            </GridItem>
            <GridItem colSpan={1} rowSpan={1}>
              <ControlledFieldValue fieldKey={FIELD_KEYS.METRO} user={user} maxWidth="400px" />
            </GridItem>
            <GridItem colSpan={1} rowSpan={1}>
              <ControlledFieldValue fieldKey={FIELD_KEYS.INDUSTRY} user={user} />
            </GridItem>
            <GridItem colSpan={1} rowSpan={1}>
              <ControlledFieldValue fieldKey={FIELD_KEYS.JOB_TITLE} user={user} />
            </GridItem>
            <GridItem colSpan={1} rowSpan={1}>
              <ControlledFieldValue fieldKey={FIELD_KEYS.LEVEL} user={user} />
            </GridItem>
            <GridItem colSpan={3} rowSpan={1}>
              <ControlledFieldValue
                fieldKey={FIELD_KEYS.CURRENT_PFM}
                user={user}
                maxWidth="unset"
              />
            </GridItem>
          </Grid>
        </Flex>
        <Flex {...commonFlexProps}>
          <SectionHeading
            title="Income statement"
            tooltipInfo={FIELD_TOOLTIPS.incomeStatement}
            isOwnProfile={isOwnProfile}
          />
          <Grid gap={4}>
            <GridItem colSpan={3} rowSpan={1}>
              <SectionSubHeading
                title="Primary income"
                tooltipInfo={FIELD_TOOLTIPS.primaryIncome}
              />
              <Grid gap={4} templateColumns="repeat(4, 1fr)">
                <GridItem>
                  <ControlledFieldValue fieldKey={FIELD_KEYS.INC_PRIMARY_ANNUAL} user={user} />
                </GridItem>
                <GridItem>
                  <ControlledFieldValue fieldKey={FIELD_KEYS.INC_PRIMARY_TAX_FED} user={user} />
                </GridItem>
                <GridItem>
                  <ControlledFieldValue fieldKey={FIELD_KEYS.INC_PRIMARY_TAX_STATE} user={user} />
                </GridItem>
                <GridItem>
                  <ControlledFieldValue fieldKey={FIELD_KEYS.INC_PRIMARY_MONTHLY_NET} user={user} />
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem colSpan={3} rowSpan={1}>
              <SectionSubHeading
                title="Variable income"
                tooltipInfo={FIELD_TOOLTIPS.variableIncome}
              />
              <Grid gap={4} templateColumns="repeat(4, 1fr)">
                <GridItem>
                  <ControlledFieldValue fieldKey={FIELD_KEYS.INC_VARIABLE_MONTHLY} user={user} />
                </GridItem>
                <GridItem>
                  <ControlledFieldValue fieldKey={FIELD_KEYS.INC_VARIABLE_TAX_FED} user={user} />
                </GridItem>
                <GridItem>
                  <ControlledFieldValue fieldKey={FIELD_KEYS.INC_VARIABLE_TAX_STATE} user={user} />
                </GridItem>
                <GridItem>
                  <ControlledFieldValue
                    fieldKey={FIELD_KEYS.INC_VARIABLE_MONTHLY_NET}
                    user={user}
                  />
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem colSpan={3} rowSpan={1}>
              <SectionSubHeading
                title="Secondary income"
                tooltipInfo={FIELD_TOOLTIPS.secondaryIncome}
              />
              <Grid gap={4} templateColumns="repeat(4, 1fr)">
                <GridItem>
                  <ControlledFieldValue fieldKey={FIELD_KEYS.INC_SECONDARY_MONTHLY} user={user} />
                </GridItem>
                <GridItem>
                  <ControlledFieldValue fieldKey={FIELD_KEYS.INC_SECONDARY_TAX_FED} user={user} />
                </GridItem>
                <GridItem>
                  <ControlledFieldValue fieldKey={FIELD_KEYS.INC_SECONDARY_TAX_STATE} user={user} />
                </GridItem>
                <GridItem>
                  <ControlledFieldValue
                    fieldKey={FIELD_KEYS.INC_SECONDARY_MONTHLY_NET}
                    user={user}
                  />
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem colSpan={3} rowSpan={1}>
              <SummaryFieldValue fieldKey={FIELD_KEYS.INC_TOTAL_ANNUAL} user={user} />
              <SummaryFieldValue fieldKey={FIELD_KEYS.INC_ANNUAL_TAX_NET} user={user} />
              <SummaryFieldValue fieldKey={FIELD_KEYS.INC_TOTAL_MONTHLY_NET} user={user} />
            </GridItem>
            <GridItem colSpan={3} rowSpan={1}>
              <SectionSubHeading
                title="Monthly expenses"
                tooltipInfo={FIELD_TOOLTIPS.monthlyExpenses}
              />
              <Grid gap={4} templateColumns="repeat(4, 1fr)">
                <GridItem>
                  <ControlledFieldValue fieldKey={FIELD_KEYS.EXP_HOUSING} user={user} />
                </GridItem>
                <GridItem>
                  <ControlledFieldValue fieldKey={FIELD_KEYS.EXP_OTHER_FIXED} user={user} />
                </GridItem>
                <GridItem>
                  <ControlledFieldValue fieldKey={FIELD_KEYS.EXP_OTHER_VARIABLE} user={user} />
                </GridItem>
                <GridItem>
                  <ControlledFieldValue fieldKey={FIELD_KEYS.EXP_TOTAL} user={user} />
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem colSpan={3} rowSpan={1}>
              <SectionSubHeading
                title="Monthly savings"
                tooltipInfo={FIELD_TOOLTIPS.monthlySavings}
              />
              <Grid gap={4} templateColumns="repeat(4, 1fr)">
                <GridItem>
                  <ControlledFieldValue fieldKey={FIELD_KEYS.SAV_RETIREMENT} user={user} />
                </GridItem>
                <GridItem>
                  <ControlledFieldValue fieldKey={FIELD_KEYS.SAV_MARKET} user={user} />
                </GridItem>
                <GridItem />
                <GridItem>
                  <ControlledFieldValue fieldKey={FIELD_KEYS.SAV_TOTAL} user={user} />
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem colSpan={3} rowSpan={1}>
              <SummaryFieldValue fieldKey={FIELD_KEYS.NET_MONTHLY_PROFIT_LOSS} user={user} />
            </GridItem>
          </Grid>
        </Flex>
        <Flex {...commonFlexProps}>
          <SectionHeading
            title="Net worth"
            tooltipInfo={FIELD_TOOLTIPS[FIELD_KEYS.NET_WORTH]}
            isOwnProfile={isOwnProfile}
          />
          <Grid gap={4}>
            <GridItem colSpan={3} rowSpan={1}>
              <SectionSubHeading title="Assets" tooltipInfo={FIELD_TOOLTIPS.assets} />
              <Grid gap={4} templateColumns="repeat(4, 1fr)">
                <GridItem>
                  <ControlledFieldValue fieldKey={FIELD_KEYS.ASSETS_SAVINGS} user={user} />
                </GridItem>
                <GridItem>
                  <ControlledFieldValue fieldKey={FIELD_KEYS.ASSETS_PROPERTY} user={user} />
                </GridItem>
                <GridItem>
                  <ControlledFieldValue fieldKey={FIELD_KEYS.ASSETS_MISC} user={user} />
                </GridItem>
                <GridItem>
                  <ControlledFieldValue fieldKey={FIELD_KEYS.ASSETS_TOTAL} user={user} />
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem colSpan={3} rowSpan={1}>
              <SectionSubHeading title="Liabilities" tooltipInfo={FIELD_TOOLTIPS.liabilities} />
              <Grid gap={4} templateColumns="repeat(4, 1fr)">
                <GridItem>
                  <ControlledFieldValue fieldKey={FIELD_KEYS.LIA_LOANS} user={user} />
                </GridItem>
                <GridItem>
                  <ControlledFieldValue fieldKey={FIELD_KEYS.LIA_CREDIT_CARD} user={user} />
                </GridItem>
                <GridItem>
                  <ControlledFieldValue fieldKey={FIELD_KEYS.LIA_MISC} user={user} />
                </GridItem>
                <GridItem>
                  <ControlledFieldValue fieldKey={FIELD_KEYS.LIA_TOTAL} user={user} />
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem colSpan={3} rowSpan={1}>
              <SummaryFieldValue fieldKey={FIELD_KEYS.NET_WORTH} user={user} />
            </GridItem>
          </Grid>
        </Flex>
      </Flex>
      <EditUserProfileModal
        isOpen={isEditUserProfileModalOpen}
        onClose={onCloseEditUserProfileModal}
        onUpdate={handleUpdate}
        user={user}
      />
    </>
  );
};

const ProfilePage = () => {
  const { data } = useLoaderData();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={data} errorElement={<div>Error!</div>}>
        <ProfilePageComponent />
      </Await>
    </Suspense>
  );
};

export default ProfilePage;
