import { flipObject } from '../utils/utils';

// TODO: range filtering, and move all of this to constants
export const FILTER_TYPES = {
  EQUAL: 'eq',
  IN: 'in',
  LT: 'lt',
  LTE: 'lte',
  GT: 'gt',
  GTE: 'gte',
};

export const FILTER_TYPE_LABELS = {
  [FILTER_TYPES.EQUAL]: 'Equals',
  [FILTER_TYPES.IN]: 'In',
  [FILTER_TYPES.LT]: 'Less than',
  [FILTER_TYPES.LTE]: 'Less than or equal to',
  [FILTER_TYPES.GT]: 'Greater than',
  [FILTER_TYPES.GTE]: 'Greater than or equal to',
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

export const TABLE_ACCESSOR_TO_FIELD = flipObject(FIELD_TO_TABLE_ACCESSOR);

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
  [FILTERABLE_FIELD_KEYS.AGE]: [
    FILTER_TYPES.EQUAL,
    FILTER_TYPES.LT,
    FILTER_TYPES.LTE,
    FILTER_TYPES.GT,
    FILTER_TYPES.GTE,
  ],
  [FILTERABLE_FIELD_KEYS.LEVEL]: [
    FILTER_TYPES.IN,
    FILTER_TYPES.LT,
    FILTER_TYPES.LTE,
    FILTER_TYPES.GT,
    FILTER_TYPES.GTE,
  ],
  [FILTERABLE_FIELD_KEYS.INC_TOTAL_ANNUAL]: [
    FILTER_TYPES.LT,
    FILTER_TYPES.LTE,
    FILTER_TYPES.GT,
    FILTER_TYPES.GTE,
  ],
  [FILTERABLE_FIELD_KEYS.INC_PRIMARY_ANNUAL]: [
    FILTER_TYPES.LT,
    FILTER_TYPES.LTE,
    FILTER_TYPES.GT,
    FILTER_TYPES.GTE,
  ],
  [FILTERABLE_FIELD_KEYS.INC_VARIABLE_MONTHLY]: [
    FILTER_TYPES.LT,
    FILTER_TYPES.LTE,
    FILTER_TYPES.GT,
    FILTER_TYPES.GTE,
  ],
  [FILTERABLE_FIELD_KEYS.INC_SECONDARY_MONTHLY]: [
    FILTER_TYPES.LT,
    FILTER_TYPES.LTE,
    FILTER_TYPES.GT,
    FILTER_TYPES.GTE,
  ],
  [FILTERABLE_FIELD_KEYS.EXP_HOUSING]: [
    FILTER_TYPES.LT,
    FILTER_TYPES.LTE,
    FILTER_TYPES.GT,
    FILTER_TYPES.GTE,
  ],
  [FILTERABLE_FIELD_KEYS.NET_MONTHLY_PROFIT_LOSS]: [
    FILTER_TYPES.LT,
    FILTER_TYPES.LTE,
    FILTER_TYPES.GT,
    FILTER_TYPES.GTE,
  ],
  [FILTERABLE_FIELD_KEYS.ASSETS_TOTAL]: [
    FILTER_TYPES.LT,
    FILTER_TYPES.LTE,
    FILTER_TYPES.GT,
    FILTER_TYPES.GTE,
  ],
  [FILTERABLE_FIELD_KEYS.ASSETS_TOTAL]: [
    FILTER_TYPES.LT,
    FILTER_TYPES.LTE,
    FILTER_TYPES.GT,
    FILTER_TYPES.GTE,
  ],
  [FILTERABLE_FIELD_KEYS.NET_WORTH]: [
    FILTER_TYPES.LT,
    FILTER_TYPES.LTE,
    FILTER_TYPES.GT,
    FILTER_TYPES.GTE,
  ],
  [FILTERABLE_FIELD_KEYS.CURRENT_PFM]: [FILTER_TYPES.IN],
};

export const SEPARATOR = '__';
export const NEGATIVE_ORDERING = '-';

const CURRENT_PFM_KEYS = {
  MINT: 'mint',
  ROCKET_MONEY: 'rocket money',
  CHIME: 'chime',
  SPLITWISE: 'splitwise',
  PEN_PAPER: 'pen paper',
  NONE: 'none',
};

export const CURRENT_PFM_LABELS = {
  [CURRENT_PFM_KEYS.MINT]: 'Mint',
  [CURRENT_PFM_KEYS.ROCKET_MONEY]: 'Rocket Money',
  [CURRENT_PFM_KEYS.CHIME]: 'Chime',
  [CURRENT_PFM_KEYS.SPLITWISE]: 'Splitwise',
  [CURRENT_PFM_KEYS.PEN_PAPER]: 'Pen & paper',
  [CURRENT_PFM_KEYS.NONE]: 'None',
};

const GENDER_KEYS = {
  MALE: 'male',
  FEMALE: 'female',
  TRANSGENDER: 'transgender',
  PREFER_NOT_TO_SAY: 'prefer_not_to_say',
};

export const GENDER_LABELS = {
  [GENDER_KEYS.MALE]: 'Male',
  [GENDER_KEYS.FEMALE]: 'Female',
  [GENDER_KEYS.TRANSGENDER]: 'Transgender',
  [GENDER_KEYS.PREFER_NOT_TO_SAY]: 'Prefer not to say',
};

export const JOB_LEVEL_LABELS = {
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
