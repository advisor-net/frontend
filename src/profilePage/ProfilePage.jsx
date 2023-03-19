import { Suspense, useEffect, useMemo, useState } from 'react';
import { Await, Link, useAsyncValue, useLoaderData, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { getProfileUuid } from '../session/sessionSlice';
import HandleModal, { APPLICABLE_FIELD_KEYS as HANDLE_KEYS } from './HandleModal';
import EditUserProfileModal, {
  APPLICABLE_FIELD_KEYS as PROFILE_KEYS,
} from './EditUserProfileModal';
import EditIncomeStatementModal, {
  APPLICABLE_FIELD_KEYS as INCOME_STATEMENT_KEYS,
} from './EditIncomeStatementModal';
import EditNetWorthModal, { APPLICABLE_FIELD_KEYS as NET_WORTH_KEYS } from './EditNetWorthModal';

import GridSectionSubHeading from './GridSectionSubHeading';

import { formatFloat, formatLargePrice, isNully } from '../utils/utils';

import { FIELD_KEYS, FIELD_LABELS, FIELD_TOOLTIPS } from './constants';
import {
  CURRENT_PFM_LABELS,
  FIELD_PLACEHOLDER,
  GENDER_LABELS,
  JOB_LEVEL_LABELS,
} from '../constants/all';
import profileService from '../services/profileService';

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
      }
      return { background: 'red', color: '#fff' };
    }
    default:
      return { background: 'unset', color: 'unset' };
  }
};

// TODO: rendering tooltip when there is an ellipsis
const FieldValue = ({ title, displayValue, tooltipInfo, maxWidth = '300px' }) => (
  <Flex direction="column" gap={1} maxWidth={maxWidth}>
    {tooltipInfo ? (
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
      {FIELD_TOOLTIPS[fieldKey] ? (
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
    {tooltipInfo ? (
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

const ProfilePageComponent = () => {
  const { user: originalUser, isOwnProfile, redirectTo } = useAsyncValue();
  const navigate = useNavigate();
  const profileUuid = useSelector(getProfileUuid);

  useEffect(() => {
    if (redirectTo) {
      navigate(redirectTo);
    }
  }, [redirectTo, navigate]);

  const [user, setUser] = useState(originalUser);

  useEffect(() => {
    setUser(originalUser);
  }, [originalUser, setUser]);

  const commonFlexProps = {
    direction: 'column',
    border: '1px solid #ddd',
    borderRadius: 4,
    padding: 4,
    minWidth: '800px',
  };

  const {
    isOpen: isHandleModalOpen,
    onOpen: onOpenHandleModal,
    onClose: onCloseHandleModal,
  } = useDisclosure();
  const {
    isOpen: isEditUserProfileModalOpen,
    onOpen: onOpenEditUserProfileModal,
    onClose: onCloseEditUserProfileModal,
  } = useDisclosure();
  const {
    isOpen: isEditIncomeStatementModalOpen,
    onOpen: onOpenEditIncomeStatementModal,
    onClose: onCloseEditIncomeStatementModal,
  } = useDisclosure();
  const {
    isOpen: isEditNetWorthModalOpen,
    onOpen: onOpenEditNetWorthModal,
    onClose: onCloseEditNetWorthModal,
  } = useDisclosure();

  const handleUpdate = async (values, closeModalCallback) => {
    const response = await profileService.updateProfile(profileUuid, values);
    setUser(response);
    closeModalCallback();
  };

  const handleUpdateHandle = async (values, closeModalCallback) => {
    const response = await profileService.updateHandle(profileUuid, values);
    setUser(response);
    closeModalCallback();
  };

  const requiresOnboardingInitial = useMemo(() => {
    if (!user) return false;
    for (const fieldKey of HANDLE_KEYS) {
      if (isNully(user[fieldKey])) {
        return true;
      }
    }
    return false;
  }, [user]);
  const requiresOnboardingProfile = useMemo(() => {
    if (!user) return false;
    for (const fieldKey of PROFILE_KEYS) {
      if (isNully(user[fieldKey])) {
        return true;
      }
    }
    return false;
  }, [user]);
  const requiresOnboardingIncomeStatement = useMemo(() => {
    if (!user) return false;
    for (const fieldKey of INCOME_STATEMENT_KEYS) {
      if (isNully(user[fieldKey])) {
        return true;
      }
    }
    return false;
  }, [user]);
  const requiresOnboardingNetWorth = useMemo(() => {
    if (!user) return false;
    for (const fieldKey of NET_WORTH_KEYS) {
      if (isNully(user[fieldKey])) {
        return true;
      }
    }
    return false;
  }, [user]);

  useEffect(() => {
    if (isOwnProfile) {
      if (requiresOnboardingInitial) onOpenHandleModal();
      else if (requiresOnboardingProfile) onOpenEditUserProfileModal();
      else if (requiresOnboardingIncomeStatement) onOpenEditIncomeStatementModal();
      else if (requiresOnboardingNetWorth) onOpenEditNetWorthModal();
    }
  }, [
    user,
    isOwnProfile,
    requiresOnboardingInitial,
    requiresOnboardingProfile,
    requiresOnboardingIncomeStatement,
    requiresOnboardingNetWorth,
    onOpenHandleModal,
    onOpenEditUserProfileModal,
    onOpenEditIncomeStatementModal,
    onOpenEditNetWorthModal,
  ]);

  if (!user) {
    return null;
  }
  return (
    <>
      <Flex direction="column" alignItems="center" gap={4} padding={4}>
        <Flex minWidth="800px" padding={4}>
          <Heading fontStyle="italic" fontSize="xl" color="teal" flexGrow={1}>
            {user.handle || FIELD_PLACEHOLDER}
          </Heading>
          {isOwnProfile ? (
            <Button colorScheme="teal" size="sm" onClick={onOpenHandleModal}>
              Change handle
            </Button>
          ) : (
            <Button as={Link} colorScheme="teal" size="sm" to={`/chat?with=${user.handle}`}>
              Message
            </Button>
          )}
        </Flex>
        <Flex {...commonFlexProps}>
          <SectionHeading
            title="Profile"
            tooltipInfo={null}
            isOwnProfile={isOwnProfile}
            onEdit={onOpenEditUserProfileModal}
          />
          <Grid gap={4}>
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
            onEdit={onOpenEditIncomeStatementModal}
          />
          <Grid gap={4}>
            <GridItem colSpan={3} rowSpan={1}>
              <GridSectionSubHeading
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
              <GridSectionSubHeading
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
              <GridSectionSubHeading
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
              <GridSectionSubHeading
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
              <GridSectionSubHeading
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
            onEdit={onOpenEditNetWorthModal}
          />
          <Grid gap={4}>
            <GridItem colSpan={3} rowSpan={1}>
              <GridSectionSubHeading title="Assets" tooltipInfo={FIELD_TOOLTIPS.assets} />
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
              <GridSectionSubHeading title="Liabilities" tooltipInfo={FIELD_TOOLTIPS.liabilities} />
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
      <HandleModal
        isOpen={isHandleModalOpen}
        onClose={onCloseHandleModal}
        onUpdate={handleUpdateHandle}
        user={user}
        requiresOnboarding={requiresOnboardingInitial}
      />
      <EditUserProfileModal
        isOpen={isEditUserProfileModalOpen}
        onClose={onCloseEditUserProfileModal}
        onUpdate={handleUpdate}
        user={user}
        requiresOnboarding={requiresOnboardingProfile}
      />
      <EditIncomeStatementModal
        isOpen={isEditIncomeStatementModalOpen}
        onClose={onCloseEditIncomeStatementModal}
        onUpdate={handleUpdate}
        user={user}
        requiresOnboarding={requiresOnboardingIncomeStatement}
      />
      <EditNetWorthModal
        isOpen={isEditNetWorthModalOpen}
        onClose={onCloseEditNetWorthModal}
        onUpdate={handleUpdate}
        user={user}
        requiresOnboarding={requiresOnboardingNetWorth}
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
