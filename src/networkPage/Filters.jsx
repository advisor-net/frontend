import { useState, useEffect } from "react";

import { useEffectOnce } from "../utils/hooks";

import {  
  FILTERABLE_FIELD_KEYS, 
  FILTERABLE_FIELD_LABELS, 
  FILTER_TYPE_LABELS,
  FIELD_FILTER_OPTIONS,
  CURRENT_PFM_LABELS,
  GENDER_LABELS,
  JOB_LEVEL_LABELS,
} from "./constants";

import { useSearchContext } from './SearchContext';

import { formatLargePrice } from "../utils/utils";

import FilterFieldSelector from "./selectorComponents/FilterFieldSelector";
import FilterTypeSelector from "./selectorComponents/FilterTypeSelector";
import CurrentPFMSelector from "./selectorComponents/CurrentPFMSelector";
import GenderSelector from "./selectorComponents/GenderSelector";
import IndustrySelector from "./selectorComponents/IndustrySelector";
import JobTitleSelector from "./selectorComponents/JobTitleSelector";
import MetroAreaSelector from "./selectorComponents/MetroAreaSelector";
import LevelSelector from "./selectorComponents/LevelSelector";

import networkService from "../services/networkService";

import {
  Flex,
  Box,
  Heading,
  Text,
  Button,
  useDisclosure,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";

const getInputForm = (filterField, onChange) => {
  switch (filterField) {
    case FILTERABLE_FIELD_KEYS.CURRENT_PFM:
      return <CurrentPFMSelector onChange={(option) => onChange(option.value)}/>
    case FILTERABLE_FIELD_KEYS.GENDER:
      return <GenderSelector onChange={(option) => onChange(option.value)}/>
    case FILTERABLE_FIELD_KEYS.INDUSTRY:
      return <IndustrySelector onChange={(option) => onChange(option.value)}/>
    case FILTERABLE_FIELD_KEYS.JOB_TITLE:
      return <JobTitleSelector onChange={(option) => onChange(option.value)}/>
    case FILTERABLE_FIELD_KEYS.METRO:
      return <MetroAreaSelector onChange={(option) => onChange(option.value)}/>
    case FILTERABLE_FIELD_KEYS.LEVEL:
      return <LevelSelector onChange={(option) => onChange(option.value)}/>
    default:
      return (
        <NumberInput onChange={(valueAsString) => onChange(parseFloat(valueAsString))} size="sm">
          <NumberInputField/>
        </NumberInput>
      )
  }
};

const getRenderableValueString = async (filterField, filterInfo) => {
  switch (filterField) {
    case FILTERABLE_FIELD_KEYS.CURRENT_PFM:
      return CURRENT_PFM_LABELS[filterInfo.value]
    case FILTERABLE_FIELD_KEYS.GENDER:
      return GENDER_LABELS[filterInfo.value]
    case FILTERABLE_FIELD_KEYS.INDUSTRY:
      {
        const searchParams = new URLSearchParams();
        searchParams.set('id__in', filterInfo.value)
        const query = searchParams.toString();
        const response = await networkService.industrySearch(query);
        return (response?.results || []).map((obj) => obj.name).join(', ');
      }
    case FILTERABLE_FIELD_KEYS.JOB_TITLE:
      {
        const searchParams = new URLSearchParams();
        searchParams.set('id__in', filterInfo.value)
        const query = searchParams.toString();
        const response = await networkService.jobTitleSearch(query);
        return (response?.results || []).map((obj) => obj.name).join(', ');
      }
    case FILTERABLE_FIELD_KEYS.METRO:
      {
        const searchParams = new URLSearchParams();
        searchParams.set('id__in', filterInfo.value)
        const query = searchParams.toString();
        const response = await networkService.metroAreaSearch(query);
        return (response?.results || []).map((obj) => obj.name).join(', ');
      }
    case FILTERABLE_FIELD_KEYS.LEVEL:
      return JOB_LEVEL_LABELS[filterInfo.value]
    default:
      return formatLargePrice(filterInfo.value, 3)
  }
};

const ReadOnlyFilter = ({ filterKey, filterInfo, onRemove }) => {
  const [renderValue, setRenderValue] = useState(null);
  const [isFetchingValue, setisFetchingValue] = useState(false);

  // on mount, fetch the field display values if we need to
  useEffectOnce(() => {
    const getRenderValue = async () => {
      return await getRenderableValueString(filterKey, filterInfo);
    };
    if (renderValue === null) {
      console.log('efect running', filterKey)
      getRenderValue().then((resp) => {
        setRenderValue(resp);
      });
    }
  }, [renderValue, setRenderValue, filterKey, filterInfo?.value])
  return (
    <Flex border="1px solid #ddd" borderRadius={4} padding={2} alignItems="center">
      <Text marginRight={1}>{`${FILTERABLE_FIELD_LABELS[filterKey]} ${FILTER_TYPE_LABELS[filterInfo.filterType]}`}</Text>
      {renderValue !== null && <Text>{renderValue}</Text>}
      <Button marginLeft={2} onClick={() => onRemove(filterKey)} size="sm">Remove</Button>
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
      const nextParamsObj = { ...paramsObj };
      nextParamsObj[newFilterField.value] = { filterType: newFilterType.value, value: newFilterValue };
      setParamsObj(nextParamsObj);

      setNewFilterField(null);
      setNewFilterType(null);
      setNewFilterValue(null);
      onClose();
    }
  };

  const handleRemoveFilter = (filterKey) => {
    const nextParamsObj = { ...paramsObj };
    delete nextParamsObj[filterKey];
    setParamsObj(nextParamsObj);
  };

  return (
    <Flex border="1px solid #ddd"  borderRadius={4} padding={2} direction="column">
      <Heading size="md" marginBottom={2}>Filters</Heading>
      <Flex alignItems="center" flexWrap="wrap" gap={2}>
        {Object.entries(paramsObj).map(([filterKey, filterInfo]) => {
          if (Object.values(FILTERABLE_FIELD_KEYS).includes(filterKey)) {
            return (
              <ReadOnlyFilter 
                key={filterKey} 
                filterKey={filterKey} 
                filterInfo={filterInfo}
                onRemove={handleRemoveFilter}
              />
            )
          } else {
            return null;
          }
        })}
        {!isOpen && (
          <Button 
            colorScheme="teal"
            onClick={onOpen}
            size="sm" 
          >
            + Add new
          </Button>
        )}
        {isOpen && (
          <Flex border="1px solid #ddd" borderRadius={4} padding={4} gap={2}>
            <FilterFieldSelector onChange={handleFilterFieldChange} value={newFilterField}/>
            <FilterTypeSelector 
              allowedTypes={FIELD_FILTER_OPTIONS[newFilterField?.value] || []} 
              onChange={handleFilterTypeChange}
              isDisabled={!newFilterField}
              value={newFilterType}
            />
            {newFilterField && newFilterType && (
              <Box>{getInputForm(newFilterField.value, handleFilterValueChange)}</Box>
            )}
            <Button 
              colorScheme="teal"
              isDisabled={!newFilterField || !newFilterType || !newFilterValue == null} 
              onClick={handleAddFilter} 
              size="sm"
            >
              Add
            </Button>
            <Button onClick={onClose} size="sm">Cancel</Button>
          </Flex>
        )}
      </Flex>
    </Flex>
  )
};

export default Filters;
