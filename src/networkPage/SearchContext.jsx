import {
  createContext, useMemo, useState, useContext, useCallback,
} from 'react';
import { flipObject } from '../utils/utils';

const SearchContext = createContext(null);

export const FILTER_TYPES = {
  EQUAL: 'eq',
  IN: 'in',
  GTE: 'gte',
  ORDER_BY: 'order_by',
  PAGE_NUMBER: 'page',
  PAGE_SIZE: 'page_size',
};

const FILTERABLE_FIELD_KEYS = {
  METRO: 'metro',
  JOB_TITLE: 'job_title',
  INDUSTRY: 'industry',
  AGE: 'age',
  GENDER: 'gender',
  LEVEL: 'level',
  CURRENT_PFM: 'current_pfm',
  INC_PRIMARY_ANNUAL: 'inc_primary_annual',
  INC_VARIABLE_MONTHLY: 'inc_variable_monthly',
  INC_SECONDARY_MONTHLY: 'inc_secondary_monthly',
  EXP_HOUSING: 'exp_housing',
  INC_TOTAL_ANNUAL: 'inc_total_annual',
  NET_MONTHLY_PROFIT_LOSS: 'net_monthly_profit_loss',
  ASSETS_TOTAL: 'assets_total',
  LIA_TOTAL: 'lia_total',
  NET_WORTH: 'net_worth',
};

export const FIELD_KEYS = {
  ...FILTERABLE_FIELD_KEYS,
  HANDLE: 'handle',
};

export const FIELD_TO_ACCESSOR = {
  [FIELD_KEYS.HANDLE]: 'handle',
  [FIELD_KEYS.METRO]: 'metro.name',
  [FIELD_KEYS.INDUSTRY]: 'industry.name',
  [FIELD_KEYS.JOB_TITLE]: 'jobTitle.name',
  [FIELD_KEYS.AGE]: 'age',
  [FIELD_KEYS.LEVEL]: 'level',
  [FIELD_KEYS.NET_WORTH]: 'netWorth',
  [FIELD_KEYS.INC_TOTAL_ANNUAL]: 'incTotalAnnual',
  [FIELD_KEYS.EXP_HOUSING]: 'expHousing',
};

const ACCESSOR_TO_FIELD = flipObject(FIELD_TO_ACCESSOR);

export const JOB_LEVEL_MAP = {
  1: 'IC, Associate',
  2: 'IC',
  3: 'IC, Senior',
  4: 'IC, Staff',
  5: 'IC, Principal',
  6: 'Manager',
  7: 'Director',
  8: 'Director, Senior',
  9: 'VP',
  10: 'VP, Senior',
  11: 'C-Suite',
  12: 'Founder',
};

export const OTHER_PARAM_KEYS = {
  ORDER_BY: 'order_by',
  PAGE_NUMBER: 'page',
  PAGE_SIZE: 'page_size',
};

// use these for the filter builders
export const FILTER_OPTIONS = {
  [FILTERABLE_FIELD_KEYS.METRO]: [FILTER_TYPES.IN],
  [FILTERABLE_FIELD_KEYS.JOB_TITLE]: [FILTER_TYPES.IN],
  [FILTERABLE_FIELD_KEYS.INDUSTRY]: [FILTER_TYPES.IN],
};

const SEPARATOR = '__';
const NEGATIVE_ORDERING = '-';

const getOrderByParamValidatity = (paramValue) => {
  let validatedValue = paramValue;
  let isDesc = false;
  if (paramValue.startsWith(NEGATIVE_ORDERING)) {
    validatedValue = paramValue.slice(NEGATIVE_ORDERING.length);
    isDesc = true;
  }
  if (Object.values(FILTERABLE_FIELD_KEYS).includes(validatedValue)) {
    return {
      isValid: true, filterType: FILTER_TYPES.ORDER_BY, isDesc, fieldValue: validatedValue,
    };
  }
  return {
    isValid: false, filterType: null, isDesc, fieldValue: validatedValue,
  };
};

const extractFilterInfoFromParamKey = (paramKey, paramValue) => {
  if (paramKey === OTHER_PARAM_KEYS.ORDER_BY) {
    return {
      ...getOrderByParamValidatity(paramValue),
      filterKey: paramKey,
    };
  }

  if (paramKey === OTHER_PARAM_KEYS.PAGE_NUMBER) {
    if (Number.isInteger(parseFloat(paramValue))) {
      return { isValid: true, filterKey: paramKey, filterType: FILTER_TYPES.PAGE_NUMBER };
    }
    return { isValid: false, filterKey: null, filterType: null };
  }

  if (paramKey === OTHER_PARAM_KEYS.PAGE_SIZE) {
    if (Number.isInteger(parseFloat(paramValue))) {
      return { isValid: true, filterKey: paramKey, filterType: FILTER_TYPES.PAGE_SIZE };
    }
    return { isValid: false, filterKey: null, filterType: null };
  }

  if (Object.values(FILTERABLE_FIELD_KEYS).includes(paramKey)) {
    // means its an equals
    return { isValid: true, filterKey: paramKey, filterType: FILTER_TYPES.EQUAL };
  }

  for (const filterKey of Object.values(FILTERABLE_FIELD_KEYS)) {
    if (paramKey.includes(filterKey)) {
      const restOfParamKey = paramKey.substring(paramKey.indexOf(filterKey) + filterKey.length);
      // checking for the __in pattern
      const isValid = (
        restOfParamKey.startsWith(SEPARATOR)
        && Object.values(FILTER_TYPES).includes(restOfParamKey.slice(SEPARATOR.length))
      );
      if (isValid) {
        return { isValid, filterKey, filterType: restOfParamKey.slice(SEPARATOR.length) };
      }
    }
  }
  // if it makes it to here, it must not be a valid filter key
  return { isValid: false, filterKey: null, filterType: null };
};

export const getParamsObjFromUrl = (url) => {
  const newParamsObj = {};
  if (url.search) {
    for (const [paramKey, paramValue] of url.searchParams.entries()) {
      const { isValid, filterKey, filterType } = extractFilterInfoFromParamKey(paramKey, paramValue);
      if (isValid) {
        newParamsObj[filterKey] = {
          filterType,
          value: paramValue,
        };
      }
    }
  }
  return newParamsObj;
};

// TODO: list in and making this all work properly
export const constructURLParams = (paramsObj) => {
  const searchParams = new URLSearchParams();
  for (const [filterKey, info] of Object.entries(paramsObj)) {
    let paramKey;
    if (Object.values(OTHER_PARAM_KEYS).includes(filterKey)) {
      paramKey = `${filterKey}`;
    } else {
      paramKey = info.filterType === FILTER_TYPES.EQUAL
        ? `${filterKey}`
        : `${filterKey}${SEPARATOR}${info.filterType}`;
    }

    searchParams.set(paramKey, info.value);
  }
  return searchParams;
};

export const updateURLfromParamsObj = (paramsObj) => {
  const searchParams = constructURLParams(paramsObj);
  const url = new URL(window.location);
  url.search = searchParams.toString();
  window.history.replaceState(null, '', url.toString());
};

export const getDefaultParamsForProfile = (profile) => {
  if (profile && profile.metro) {
    return {
      [FILTERABLE_FIELD_KEYS.METRO]: { filterType: FILTER_TYPES.IN, value: [profile.metro.id] },
      [OTHER_PARAM_KEYS.ORDER_BY]: { filterType: FILTER_TYPES.ORDER_BY, value: `${NEGATIVE_ORDERING}${FILTERABLE_FIELD_KEYS.NET_WORTH}` },
      [OTHER_PARAM_KEYS.PAGE_NUMBER]: {filterType: FILTER_TYPES.PAGE_NUMBER, value: 1},
      [OTHER_PARAM_KEYS.PAGE_SIZE]: {filterType: FILTER_TYPES.PAGE_SIZE, value: 20},
    };
  }
  return {};
};

export const getSortByTableStateFromParamsObject = (paramsObj) => {
  if (OTHER_PARAM_KEYS.ORDER_BY in paramsObj) {
    const paramInfo = paramsObj[OTHER_PARAM_KEYS.ORDER_BY];
    if (paramInfo) {
      const validity = getOrderByParamValidatity(paramInfo.value);
      if (validity.isValid) {
        return [{
          id: FIELD_TO_ACCESSOR[validity.fieldValue],
          desc: validity.isDesc,
        }];
      }
    }
  }
  return [];
};

const getNextParamsObjFromSortByTableState = (sortByTableState, previousParamsObj) => {
  const nextParamsObj = { ...previousParamsObj };
  if (sortByTableState.length === 0) {
    delete nextParamsObj[OTHER_PARAM_KEYS.ORDER_BY];
  } else {
    const sorter = sortByTableState[0];
    const filterKey = ACCESSOR_TO_FIELD[sorter.id];
    nextParamsObj[OTHER_PARAM_KEYS.ORDER_BY] = {
      filterType: FILTER_TYPES.ORDER_BY,
      value: sorter.desc ? `${NEGATIVE_ORDERING}${filterKey}` : filterKey,
    };
  }
  return nextParamsObj;
};

const SearchProvider = ({ children }) => {
  // params object will be an object of { field: { filterType: 'in', value: [1, 2] } }
  const [paramsObj, setParamsObj] = useState({});
  const [results, setResults] = useState({});

  const setOrderBy = useCallback(
    (sortByTableState) => {
      const nextParamsObj = getNextParamsObjFromSortByTableState(sortByTableState, paramsObj);
      setParamsObj(nextParamsObj);
      updateURLfromParamsObj(nextParamsObj);
    },
    [paramsObj, setParamsObj],
  );

  const store = useMemo(
    () => ({
      paramsObj,
      setParamsObj,
      results,
      setResults,
      setOrderBy,
    }),
    [
      paramsObj,
      setParamsObj,
      results,
      setResults,
      setOrderBy,
    ],
  );

  return (
    <SearchContext.Provider value={store}>{children}</SearchContext.Provider>
  );
};

export const useSearchContext = () => useContext(SearchContext);

export default SearchProvider;
