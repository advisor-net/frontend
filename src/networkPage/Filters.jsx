import { useState } from 'react';

import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  NumberInput,
  NumberInputField,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffectOnce } from '../utils/hooks';

import {
  FIELD_FILTER_OPTIONS,
  FILTERABLE_FIELD_KEYS,
  FILTERABLE_FIELD_LABELS,
  FILTER_TYPES,
  FILTER_TYPE_LABELS,
} from './constants';

import { CURRENT_PFM_LABELS, GENDER_LABELS, JOB_LEVEL_LABELS } from '../constants/all';

import { addFilterToParams, getEmptyParams, removeFilterFromParams } from './utils';

import { useSearchContext } from './SearchContext';

import { formatLargePrice } from '../utils/utils';

import CurrentPFMSelector from '../components/selectorComponents/CurrentPFMSelector';
import FilterFieldSelector from './selectorComponents/FilterFieldSelector';
import FilterTypeSelector from './selectorComponents/FilterTypeSelector';
import GenderSelector from '../components/selectorComponents/GenderSelector';
import IndustrySelector from '../components/selectorComponents/IndustrySelector';
import JobTitleSelector from '../components/selectorComponents/JobTitleSelector';
import LevelSelector from '../components/selectorComponents/LevelSelector';
import MetroAreaSelector from '../components/selectorComponents/MetroAreaSelector';

import networkService from '../services/networkService';

const getInputForm = (filterField, filterType, onChange) => {
  switch (filterField) {
    case FILTERABLE_FIELD_KEYS.CURRENT_PFM:
      return (
        <CurrentPFMSelector
          onChange={(options) => onChange(options.map((option) => option.value))}
          isMulti
        />
      );
    case FILTERABLE_FIELD_KEYS.GENDER:
      return (
        <GenderSelector
          onChange={(options) => onChange(options.map((option) => option.value))}
          isMulti
        />
      );
    case FILTERABLE_FIELD_KEYS.INDUSTRY:
      return (
        <IndustrySelector
          onChange={(options) => onChange(options.map((option) => option.value))}
          isMulti
        />
      );
    case FILTERABLE_FIELD_KEYS.JOB_TITLE:
      return (
        <JobTitleSelector
          onChange={(options) => onChange(options.map((option) => option.value))}
          isMulti
        />
      );
    case FILTERABLE_FIELD_KEYS.METRO:
      return (
        <MetroAreaSelector
          onChange={(options) => onChange(options.map((option) => option.value))}
          isMulti
        />
      );
    case FILTERABLE_FIELD_KEYS.LEVEL: {
      switch (filterType) {
        case FILTER_TYPES.IN:
          return (
            <LevelSelector
              isMulti
              onChange={(options) => onChange(options.map((option) => option.value))}
            />
          );
        default:
          return <LevelSelector isMulti={false} onChange={(option) => onChange(option.value)} />;
      }
    }
    default:
      return (
        <NumberInput onChange={(valueAsString) => onChange(parseFloat(valueAsString))} size="sm">
          <NumberInputField />
        </NumberInput>
      );
  }
};

const getRenderableValueString = async (filterField, filterType, value) => {
  switch (filterField) {
    case FILTERABLE_FIELD_KEYS.CURRENT_PFM: {
      const stringArr = value.toString().split(',');
      return stringArr.map((v) => CURRENT_PFM_LABELS[v]).join(', ');
    }
    case FILTERABLE_FIELD_KEYS.GENDER: {
      const stringArr = value.toString().split(',');
      return stringArr.map((v) => GENDER_LABELS[v]).join(', ');
    }
    case FILTERABLE_FIELD_KEYS.INDUSTRY: {
      const searchParams = new URLSearchParams();
      searchParams.set('id__in', value);
      const query = searchParams.toString();
      const response = await networkService.industrySearch(query);
      return (response?.results || []).map((obj) => obj.name).join(', ');
    }
    case FILTERABLE_FIELD_KEYS.JOB_TITLE: {
      const searchParams = new URLSearchParams();
      searchParams.set('id__in', value);
      const query = searchParams.toString();
      const response = await networkService.jobTitleSearch(query);
      return (response?.results || []).map((obj) => obj.name).join(', ');
    }
    case FILTERABLE_FIELD_KEYS.METRO: {
      const searchParams = new URLSearchParams();
      searchParams.set('id__in', value);
      const query = searchParams.toString();
      const response = await networkService.metroAreaSearch(query);
      return (response?.results || []).map((obj) => obj.name).join(', ');
    }
    // TODO: bug here with changing an existing filter
    case FILTERABLE_FIELD_KEYS.LEVEL: {
      switch (filterType) {
        case FILTER_TYPES.IN: {
          const stringArr = value.toString().split(',');
          return stringArr.map((idValue) => JOB_LEVEL_LABELS[parseInt(idValue, 10)]).join(', ');
        }
        default:
          return JOB_LEVEL_LABELS[value];
      }
    }
    case FILTERABLE_FIELD_KEYS.AGE:
      return value;
    default:
      return formatLargePrice(value, 3);
  }
};

const ReadOnlyFilter = ({ filterKey, filterType, value, onRemove, onEdit }) => {
  const [renderValue, setRenderValue] = useState(null);

  // onMount, fetch the field display values...
  // NOTE: we are forcing the component to remount by being clever with the key value
  useEffectOnce(() => {
    const getRenderValue = async () => {
      return getRenderableValueString(filterKey, filterType, value);
    };
    getRenderValue().then((resp) => {
      setRenderValue(resp);
    });
  }, [setRenderValue, filterKey, filterType, value]);

  return (
    <Flex border="1px solid #ddd" borderRadius={4} padding={2} alignItems="center">
      <Text
        marginRight={1}
      >{`${FILTERABLE_FIELD_LABELS[filterKey]} ${FILTER_TYPE_LABELS[filterType]}`}</Text>
      {renderValue !== null && <Text>{renderValue}</Text>}
      <Menu>
        <MenuButton as={Button} marginLeft={2} size="sm">
          <HamburgerIcon />
        </MenuButton>
        {/* NOTE: need the z-index because of the sticky table header */}
        <MenuList zIndex={2}>
          <MenuItem onClick={() => onEdit(filterKey, filterType, value)}>Edit</MenuItem>
          <MenuDivider />
          <MenuItem onClick={() => onRemove(filterKey, filterType)} color="red">
            Remove
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

const Filters = () => {
  const { setParamsObj, paramsObj } = useSearchContext();

  const [newFilterField, setNewFilterField] = useState(null);
  const [newFilterType, setNewFilterType] = useState(null);
  const [newFilterValue, setNewFilterValue] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleFilterFieldChange = (option) => {
    setNewFilterField(option);
    setNewFilterType(null);
    setNewFilterValue(null);
  };

  const handleFilterTypeChange = (option) => {
    setNewFilterType(option);
    setNewFilterValue(null);
  };

  const handleFilterValueChange = (value) => {
    setNewFilterValue(value);
  };

  const handleAddFilter = () => {
    if (newFilterField && newFilterType && newFilterValue !== null) {
      const nextParamsObj = addFilterToParams(
        newFilterField.value,
        newFilterType.value,
        newFilterValue,
        paramsObj
      );
      setParamsObj(nextParamsObj);

      setNewFilterField(null);
      setNewFilterType(null);
      setNewFilterValue(null);
      onClose();
    }
  };

  const handleRemoveFilter = (filterKey, filterType) => {
    const nextParamsObj = removeFilterFromParams(filterKey, filterType, paramsObj);
    setParamsObj(nextParamsObj);
  };

  // TODO: set default value
  const handleEditFilter = (filterKey, filterType, _) => {
    handleRemoveFilter(filterKey, filterType);
    setNewFilterField({
      value: filterKey,
      label: FILTERABLE_FIELD_LABELS[filterKey],
    });
    setNewFilterType({
      value: filterType,
      label: FILTER_TYPE_LABELS[filterType],
    });
    setNewFilterValue(null);
    onOpen();
  };

  const handleClearFilters = () => {
    setParamsObj(getEmptyParams());
  };

  return (
    <Flex border="1px solid #ddd" borderRadius={4} padding={2} direction="column">
      <Heading size="md" marginBottom={2}>
        Filters
      </Heading>
      <Flex alignItems="center" flexWrap="wrap" gap={2}>
        {paramsObj.map(({ filterKey, filterType, value }) => {
          if (Object.values(FILTERABLE_FIELD_KEYS).includes(filterKey)) {
            // NOTE: using the combined value for the key causes it to remount when value changes
            // Doing this to optimize fetch calls.
            return (
              <ReadOnlyFilter
                key={filterKey.toString() + filterType.toString() + value.toString()}
                filterKey={filterKey}
                filterType={filterType}
                value={value}
                onRemove={handleRemoveFilter}
                onEdit={handleEditFilter}
              />
            );
          }
          return null;
        })}
        {!isOpen && (
          <Button colorScheme="teal" onClick={onOpen} size="sm">
            + Add filter
          </Button>
        )}
        {isOpen && (
          <Flex border="1px solid #ddd" borderRadius={4} padding={4} gap={2}>
            <FilterFieldSelector onChange={handleFilterFieldChange} value={newFilterField} />
            <FilterTypeSelector
              allowedTypes={FIELD_FILTER_OPTIONS[newFilterField?.value] || []}
              onChange={handleFilterTypeChange}
              isDisabled={!newFilterField}
              value={newFilterType}
            />
            {newFilterField && newFilterType && (
              <Box>
                {getInputForm(newFilterField.value, newFilterType.value, handleFilterValueChange)}
              </Box>
            )}
            <Button
              colorScheme="teal"
              isDisabled={!newFilterField || !newFilterType || !newFilterValue == null}
              onClick={handleAddFilter}
              size="sm"
            >
              Add
            </Button>
            <Button onClick={onClose} size="sm">
              Cancel
            </Button>
          </Flex>
        )}
        <Button colorScheme="red" onClick={handleClearFilters} size="sm">
          Clear filters
        </Button>
      </Flex>
    </Flex>
  );
};

export default Filters;
