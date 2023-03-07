import {
  createContext, useMemo, useState, useContext, useCallback,
} from 'react';
import { flipObject } from '../utils/utils';

const SearchContext = createContext(null);

// TODO: range filtering
export const FILTER_TYPES = {
  EQUAL: 'eq',
  IN: 'in',
  LT: 'lt',
  LTE: 'lte',
  GT: 'gt',
  GTE: 'gte',
};

export const FILTER_TYPE_LABELS = {
  [FILTER_TYPES.EQUAL]: "Equals",
  [FILTER_TYPES.IN]: "In",
  [FILTER_TYPES.LT]: "Less than",
  [FILTER_TYPES.LTE]: "Less than or equal to",
  [FILTER_TYPES.GT]: "Greater than",
  [FILTER_TYPES.GTE]: "Greater than or equal to",
};

export const FILTERABLE_FIELD_KEYS = {
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

export const FILTERABLE_FIELD_LABELS = {
  [FILTERABLE_FIELD_KEYS.METRO]: 'Location',
  [FILTERABLE_FIELD_KEYS.JOB_TITLE]: 'Job title',
  [FILTERABLE_FIELD_KEYS.INDUSTRY]: 'Industry',
  [FILTERABLE_FIELD_KEYS.GENDER]: 'Gender',
  [FILTERABLE_FIELD_KEYS.AGE]: 'Age',
  [FILTERABLE_FIELD_KEYS.LEVEL]: 'Level',
  [FILTERABLE_FIELD_KEYS.INC_TOTAL_ANNUAL]: 'Income, total annual',
  [FILTERABLE_FIELD_KEYS.INC_PRIMARY_ANNUAL]: 'Income, primary annual',
  [FILTERABLE_FIELD_KEYS.INC_VARIABLE_MONTHLY]: 'Income, variable monthly',
  [FILTERABLE_FIELD_KEYS.INC_SECONDARY_MONTHLY]: 'Income, secondary monthly',
  [FILTERABLE_FIELD_KEYS.EXP_HOUSING]: 'Expense, monthly housing',
  [FILTERABLE_FIELD_KEYS.NET_MONTHLY_PROFIT_LOSS]: 'Net monthly profit/loss',
  [FILTERABLE_FIELD_KEYS.ASSETS_TOTAL]: 'Assets, total',
  [FILTERABLE_FIELD_KEYS.ASSETS_TOTAL]: 'Liabilities, total',
  [FILTERABLE_FIELD_KEYS.NET_WORTH]: 'Net worth',
  [FILTERABLE_FIELD_KEYS.CURRENT_PFM]: 'Current PFM app',
};

export const FIELD_KEYS = {
  ...FILTERABLE_FIELD_KEYS,
  HANDLE: 'handle',
};

export const FIELD_TO_TABLE_ACCESSOR = {
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

const TABLE_ACCESSOR_TO_FIELD = flipObject(FIELD_TO_TABLE_ACCESSOR);

export const OTHER_QUERY_PARAM_KEYS = {
  ORDER_BY: 'order_by',
  PAGE_NUMBER: 'page',
  PAGE_SIZE: 'page_size',
};

export const FIELD_FILTER_OPTIONS = {
  [FILTERABLE_FIELD_KEYS.METRO]: [FILTER_TYPES.IN],
  [FILTERABLE_FIELD_KEYS.JOB_TITLE]: [FILTER_TYPES.IN],
  [FILTERABLE_FIELD_KEYS.INDUSTRY]: [FILTER_TYPES.IN],
  [FILTERABLE_FIELD_KEYS.GENDER]: [FILTER_TYPES.IN],
  [FILTERABLE_FIELD_KEYS.AGE]: [FILTER_TYPES.EQUAL, FILTER_TYPES.LT, FILTER_TYPES.LTE, FILTER_TYPES.GT, FILTER_TYPES.GTE],
  [FILTERABLE_FIELD_KEYS.LEVEL]: [FILTER_TYPES.IN, FILTER_TYPES.LT, FILTER_TYPES.LTE, FILTER_TYPES.GT, FILTER_TYPES.GTE],
  [FILTERABLE_FIELD_KEYS.INC_TOTAL_ANNUAL]: [FILTER_TYPES.LT, FILTER_TYPES.LTE, FILTER_TYPES.GT, FILTER_TYPES.GTE],
  [FILTERABLE_FIELD_KEYS.INC_PRIMARY_ANNUAL]: [FILTER_TYPES.LT, FILTER_TYPES.LTE, FILTER_TYPES.GT, FILTER_TYPES.GTE],
  [FILTERABLE_FIELD_KEYS.INC_VARIABLE_MONTHLY]: [FILTER_TYPES.LT, FILTER_TYPES.LTE, FILTER_TYPES.GT, FILTER_TYPES.GTE],
  [FILTERABLE_FIELD_KEYS.INC_SECONDARY_MONTHLY]: [FILTER_TYPES.LT, FILTER_TYPES.LTE, FILTER_TYPES.GT, FILTER_TYPES.GTE],
  [FILTERABLE_FIELD_KEYS.EXP_HOUSING]: [FILTER_TYPES.LT, FILTER_TYPES.LTE, FILTER_TYPES.GT, FILTER_TYPES.GTE],
  [FILTERABLE_FIELD_KEYS.NET_MONTHLY_PROFIT_LOSS]: [FILTER_TYPES.LT, FILTER_TYPES.LTE, FILTER_TYPES.GT, FILTER_TYPES.GTE],
  [FILTERABLE_FIELD_KEYS.ASSETS_TOTAL]: [FILTER_TYPES.LT, FILTER_TYPES.LTE, FILTER_TYPES.GT, FILTER_TYPES.GTE],
  [FILTERABLE_FIELD_KEYS.ASSETS_TOTAL]: [FILTER_TYPES.LT, FILTER_TYPES.LTE, FILTER_TYPES.GT, FILTER_TYPES.GTE],
  [FILTERABLE_FIELD_KEYS.NET_WORTH]: [FILTER_TYPES.LT, FILTER_TYPES.LTE, FILTER_TYPES.GT, FILTER_TYPES.GTE],
  [FILTERABLE_FIELD_KEYS.CURRENT_PFM]: [FILTER_TYPES.IN],
};

const SEPARATOR = '__';
const NEGATIVE_ORDERING = '-';

const getOrderByParamValidity = (paramValue) => {
  let validatedValue = paramValue;
  let isDesc = false;
  if (paramValue.startsWith(NEGATIVE_ORDERING)) {
    validatedValue = paramValue.slice(NEGATIVE_ORDERING.length);
    isDesc = true;
  }
  if (Object.values(FILTERABLE_FIELD_KEYS).includes(validatedValue)) {
    return {
      isValid: true, filterType: OTHER_QUERY_PARAM_KEYS.ORDER_BY, isDesc, fieldValue: validatedValue,
    };
  }
  return {
    isValid: false, filterType: null, isDesc, fieldValue: validatedValue,
  };
};

const extractFilterInfoFromParamKey = (paramKey, paramValue) => {
  if (paramKey === OTHER_QUERY_PARAM_KEYS.ORDER_BY) {
    return {
      ...getOrderByParamValidity(paramValue),
      filterKey: paramKey,
    };
  }

  if (paramKey === OTHER_QUERY_PARAM_KEYS.PAGE_NUMBER) {
    if (Number.isInteger(parseFloat(paramValue))) {
      return { isValid: true, filterKey: paramKey, filterType: OTHER_QUERY_PARAM_KEYS.PAGE_NUMBER };
    }
    return { isValid: false, filterKey: null, filterType: null };
  }

  if (paramKey === OTHER_QUERY_PARAM_KEYS.PAGE_SIZE) {
    if (Number.isInteger(parseFloat(paramValue))) {
      return { isValid: true, filterKey: paramKey, filterType: OTHER_QUERY_PARAM_KEYS.PAGE_SIZE };
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

export const transformUrlToParamsObj = (url) => {
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
export const transformParamsObjToUrl = (paramsObj) => {
  const searchParams = new URLSearchParams();
  for (const [filterKey, info] of Object.entries(paramsObj)) {
    let paramKey;
    if (Object.values(OTHER_QUERY_PARAM_KEYS).includes(filterKey)) {
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
  const searchParams = transformParamsObjToUrl(paramsObj);
  const url = new URL(window.location);
  url.search = searchParams.toString();
  window.history.replaceState(null, '', url.toString());
};

export const getDefaultParamsForProfile = (profile) => {
  if (profile) {
    const defaultParams = {
      [OTHER_QUERY_PARAM_KEYS.ORDER_BY]: { filterType: OTHER_QUERY_PARAM_KEYS.ORDER_BY, value: `${NEGATIVE_ORDERING}${FILTERABLE_FIELD_KEYS.NET_WORTH}` },
      [OTHER_QUERY_PARAM_KEYS.PAGE_NUMBER]: {filterType: OTHER_QUERY_PARAM_KEYS.PAGE_NUMBER, value: 1},
      [OTHER_QUERY_PARAM_KEYS.PAGE_SIZE]: {filterType: OTHER_QUERY_PARAM_KEYS.PAGE_SIZE, value: 20},
    };
    if (profile.metro) {
      defaultParams[FILTERABLE_FIELD_KEYS.METRO] = { filterType: FILTER_TYPES.IN, value: [profile.metro.id] };
    }
    return defaultParams;
  }
  return {};
};

export const transformParamsObjToSortByTableState = (paramsObj) => {
  if (OTHER_QUERY_PARAM_KEYS.ORDER_BY in paramsObj) {
    const paramInfo = paramsObj[OTHER_QUERY_PARAM_KEYS.ORDER_BY];
    if (paramInfo) {
      const validity = getOrderByParamValidity(paramInfo.value);
      if (validity.isValid) {
        return [{
          id: FIELD_TO_TABLE_ACCESSOR[validity.fieldValue],
          desc: validity.isDesc,
        }];
      }
    }
  }
  return [];
};

const transformSortByTableStateToParamsObj = (sortByTableState, previousParamsObj) => {
  const nextParamsObj = { ...previousParamsObj };
  if (sortByTableState.length === 0) {
    delete nextParamsObj[OTHER_QUERY_PARAM_KEYS.ORDER_BY];
  } else {
    const sorter = sortByTableState[0];
    const filterKey = TABLE_ACCESSOR_TO_FIELD[sorter.id];
    nextParamsObj[OTHER_QUERY_PARAM_KEYS.ORDER_BY] = {
      filterType: OTHER_QUERY_PARAM_KEYS.ORDER_BY,
      value: sorter.desc ? `${NEGATIVE_ORDERING}${filterKey}` : filterKey,
    };
  }
  return nextParamsObj;
};

const SearchProvider = ({ children }) => {
  // params object will be an object of { field: { filterType: 'in', value: [1, 2] } }
  const [paramsObj, _setParamsObj] = useState({});
  const [results, setResults] = useState({});

  const setParamsObj = useCallback(
    (nextParamsObj) => {
      _setParamsObj(nextParamsObj);
      updateURLfromParamsObj(nextParamsObj);
    },
    [],
  )

  const setOrderBy = useCallback(
    (sortByTableState) => {
      const nextParamsObj = transformSortByTableStateToParamsObj(sortByTableState, paramsObj);
      setParamsObj(nextParamsObj);
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
