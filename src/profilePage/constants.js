export const FIELD_KEYS = {
  AGE: 'age',
  ASSETS_MISC: 'assetsMisc',
  ASSETS_PROPERTY: 'assetsProperty',
  ASSETS_SAVINGS: 'assetsSavings',
  ASSETS_TOTAL: 'assetsTotal',
  CURRENT_PFM: 'currentPfm',
  EXP_HOUSING: 'expHousing',
  EXP_OTHER_FIXED: 'expOtherFixed',
  EXP_OTHER_VARIABLE: 'expOtherVariable',
  EXP_TOTAL: 'expTotal',
  GENDER: 'gender',
  HANDLE: 'handle',
  INC_ANNUAL_TAX_NET: 'incAnnualTaxNet',
  INC_PRIMARY_ANNUAL: 'incPrimaryAnnual',
  INC_PRIMARY_MONTHLY_NET: 'incPrimaryMonthlyNet',
  INC_PRIMARY_TAX_FED: 'incPrimaryTaxFed',
  INC_PRIMARY_TAX_STATE: 'incPrimaryTaxState',
  INC_SECONDARY_MONTHLY: 'incSecondaryMonthly',
  INC_SECONDARY_MONTHLY_NET: 'incSecondaryMonthlyNet',
  INC_SECONDARY_TAX_FED: 'incSecondaryTaxFed',
  INC_SECONDARY_TAX_STATE: 'incSecondaryTaxState',
  INC_TOTAL_ANNUAL: 'incTotalAnnual',
  INC_TOTAL_MONTHLY_NET: 'incTotalMonthlyNet',
  INC_VARIABLE_MONTHLY: 'incVariableMonthly',
  INC_VARIABLE_MONTHLY_NET: 'incVariableMonthlyNet',
  INC_VARIABLE_TAX_FED: 'incVariableTaxFed',
  INC_VARIABLE_TAX_STATE: 'incVariableTaxState',
  INDUSTRY: 'industry',
  JOB_TITLE: 'jobTitle',
  LEVEL: 'level',
  LIA_CREDIT_CARD: 'liaCreditCard',
  LIA_LOANS: 'liaLoans',
  LIA_MISC: 'liaMisc',
  LIA_TOTAL: 'liaTotal',
  METRO: 'metro',
  NET_MONTHLY_PROFIT_LOSS: 'netMonthlyProfitLoss',
  NET_WORTH: 'netWorth',
  SAV_MARKET: 'savRetirement',
  SAV_RETIREMENT: 'savMarket',
  SAV_TOTAL: 'savTotal',
};

export const FIELD_LABELS = {
  [FIELD_KEYS.HANDLE]: 'Handle',
  [FIELD_KEYS.AGE]: 'Age',
  [FIELD_KEYS.GENDER]: 'Gender',
  [FIELD_KEYS.METRO]: 'Location',
  [FIELD_KEYS.JOB_TITLE]: 'Job title',
  [FIELD_KEYS.INDUSTRY]: 'Industry',
  [FIELD_KEYS.CURRENT_PFM]: 'Current Personal Financial Management (PFM) app',
  [FIELD_KEYS.LEVEL]: 'Level',
  [FIELD_KEYS.INC_PRIMARY_ANNUAL]: 'Annual - fixed',
  [FIELD_KEYS.INC_PRIMARY_TAX_FED]: 'Federal taxes',
  [FIELD_KEYS.INC_PRIMARY_TAX_STATE]: 'State taxes',
  [FIELD_KEYS.INC_PRIMARY_MONTHLY_NET]: 'Net monthly',
  [FIELD_KEYS.INC_VARIABLE_MONTHLY]: 'Avg monthly',
  [FIELD_KEYS.INC_VARIABLE_TAX_FED]: 'Federal taxes',
  [FIELD_KEYS.INC_VARIABLE_TAX_STATE]: 'State taxes',
  [FIELD_KEYS.INC_VARIABLE_MONTHLY_NET]: 'Net monthly',
  [FIELD_KEYS.INC_SECONDARY_MONTHLY]: 'Avg monthly',
  [FIELD_KEYS.INC_SECONDARY_TAX_FED]: 'Federal taxes',
  [FIELD_KEYS.INC_SECONDARY_TAX_STATE]: 'State taxes',
  [FIELD_KEYS.INC_SECONDARY_MONTHLY_NET]: 'Net monthly',
  [FIELD_KEYS.INC_TOTAL_ANNUAL]: 'Total annual pre-tax income:',
  [FIELD_KEYS.INC_ANNUAL_TAX_NET]: 'Net tax rate:',
  [FIELD_KEYS.INC_TOTAL_MONTHLY_NET]: 'Post-tax net monthly income:',
  [FIELD_KEYS.EXP_HOUSING]: 'Rent/Housing',
  [FIELD_KEYS.EXP_OTHER_FIXED]: 'Other fixed',
  [FIELD_KEYS.EXP_OTHER_VARIABLE]: 'Other variable',
  [FIELD_KEYS.EXP_TOTAL]: 'Total expenses',
  [FIELD_KEYS.SAV_RETIREMENT]: 'Retirement',
  [FIELD_KEYS.SAV_MARKET]: 'Market investments',
  [FIELD_KEYS.SAV_TOTAL]: 'Total savings',
  [FIELD_KEYS.NET_MONTHLY_PROFIT_LOSS]: 'Net monthly profit/loss',
  [FIELD_KEYS.ASSETS_SAVINGS]: 'Savings/investments',
  [FIELD_KEYS.ASSETS_PROPERTY]: 'Property',
  [FIELD_KEYS.ASSETS_MISC]: 'Miscellaneous',
  [FIELD_KEYS.ASSETS_TOTAL]: 'Total assets',
  [FIELD_KEYS.LIA_LOANS]: 'Loans',
  [FIELD_KEYS.LIA_CREDIT_CARD]: 'Credit card',
  [FIELD_KEYS.LIA_MISC]: 'Miscellaneous',
  [FIELD_KEYS.LIA_TOTAL]: 'Total liabilities',
  [FIELD_KEYS.NET_WORTH]: 'Net worth',
};

export const FIELD_TOOLTIPS = {
  [FIELD_KEYS.HANDLE]: 'Your Advisor personality',
  [FIELD_KEYS.AGE]: null,
  [FIELD_KEYS.GENDER]: null,
  [FIELD_KEYS.METRO]: 'Metropolitan area',
  [FIELD_KEYS.JOB_TITLE]: 'Title of your currently held position',
  [FIELD_KEYS.INDUSTRY]: null,
  [FIELD_KEYS.CURRENT_PFM]:
    'A Personal Finance Management (PFM) app is used to help you keep track of the money coming in and the money going out each month. Examples: Rocket Money, Mint',
  [FIELD_KEYS.LEVEL]:
    'The level of your current employment position in a range of IC (Individual Contributor), Associate to Founder.',
  [FIELD_KEYS.INC_PRIMARY_ANNUAL]: 'Pre-tax yearly salary for your primary employment',
  [FIELD_KEYS.INC_PRIMARY_TAX_FED]: 'Federal tax rate on your primary income',
  [FIELD_KEYS.INC_PRIMARY_TAX_STATE]: 'State tax rate on your primary income',
  [FIELD_KEYS.INC_PRIMARY_MONTHLY_NET]: 'Post-tax monthly primary income',
  [FIELD_KEYS.INC_VARIABLE_MONTHLY]:
    'Average monthly variable income, likely associated with performance i.e. a sales quota',
  [FIELD_KEYS.INC_VARIABLE_TAX_FED]:
    'Federal tax rate on your variable income. Pick an average if it fluctuates.',
  [FIELD_KEYS.INC_VARIABLE_TAX_STATE]:
    'State tax rate on your variable income. Pick an average if it fluctuates.',
  [FIELD_KEYS.INC_VARIABLE_MONTHLY_NET]: 'Post-tax monthly variable income',
  [FIELD_KEYS.INC_SECONDARY_MONTHLY]:
    'Average monthly income from secondary income streams i.e. side hustles like Rover, Upwork, Uber, or Tutoring.',
  [FIELD_KEYS.INC_SECONDARY_TAX_FED]:
    'Federal tax rate on your secondary income. Pick an average if it fluctuates.',
  [FIELD_KEYS.INC_SECONDARY_TAX_STATE]:
    'State tax rate on your variable income. Pick an average if it fluctuates.',
  [FIELD_KEYS.INC_SECONDARY_MONTHLY_NET]: 'Post-tax monthly secondary income',
  [FIELD_KEYS.INC_TOTAL_ANNUAL]: null,
  [FIELD_KEYS.INC_ANNUAL_TAX_NET]: null,
  [FIELD_KEYS.INC_TOTAL_MONTHLY_NET]: null,
  [FIELD_KEYS.EXP_HOUSING]: 'Monthly housing expense e.g. rent or mortgage payment',
  [FIELD_KEYS.EXP_OTHER_FIXED]:
    'Expenses and debts that must be paid every single month, do not often change, excluding housing payments (e.g. internet, car insurance, parking, netflix, etc.)',
  [FIELD_KEYS.EXP_OTHER_VARIABLE]:
    'Expenses that must be paid every single month and could change (e.g. - leisure, entertainment, eating out, luxuries, etc.)',
  [FIELD_KEYS.EXP_TOTAL]: 'Total amount of money you are spending each month',
  [FIELD_KEYS.SAV_RETIREMENT]:
    'Average monthly contribution to retirement funds e.g. Roth IRA & 401k.',
  [FIELD_KEYS.SAV_MARKET]: 'Average monthly contribution to non-retirement investment funds',
  [FIELD_KEYS.SAV_TOTAL]: 'Total amount of money you are putting away each month',
  [FIELD_KEYS.NET_MONTHLY_PROFIT_LOSS]:
    'The amount of money you are saving for a rainy day or losing each month based on comparing your income to expenses and savings inputs',
  [FIELD_KEYS.ASSETS_SAVINGS]:
    'The current amount of value held in retirement and investment accounts',
  [FIELD_KEYS.ASSETS_PROPERTY]: 'The total valuation of any property holdings',
  [FIELD_KEYS.ASSETS_MISC]:
    'Any additional assets you could sell reasonably quickly if you needed to e.g. art, new clothing, your bike, etc.',
  [FIELD_KEYS.ASSETS_TOTAL]: 'Total assets',
  [FIELD_KEYS.LIA_LOANS]:
    'Outstanding loans i.e. student loans, small busines loans, car loans, etc.',
  [FIELD_KEYS.LIA_CREDIT_CARD]: 'Credit card debt',
  [FIELD_KEYS.LIA_MISC]:
    'Other miscellaneous liabilities e.g. owing your parents money, overdue bill payments, etc.',
  [FIELD_KEYS.LIA_TOTAL]: 'Total liabilities',
  [FIELD_KEYS.NET_WORTH]:
    'Your net worth is a snapshot of your financial situation at a given point in time. It is determined by the relationship between your assets and your liabilities. Assets are all the property you own. Liabilities are all of your debts. If your assets outweigh your liabilities, you have positive net worth. If your liabilities outweigh your assets, you have negative net worth.',
  incomeStatement:
    'There are three key factors that drive your monthly income statement: income, savings, and expenses. Your monthly income statement is important because it allows you to understand how profitable you are. Profitable in this sense means positive savings and positive net income, where you are able to put the desired amount of money away to your desired accounts and you still have money left over at the end of the month.',
  primaryIncome:
    'This is the fixed income associated with your primary profession or your full time job. This is your base salary.',
  variableIncome: 'Income associated with your job performance e.g. commission, bonus, etc.',
  secondaryIncome:
    'Income from secondary income streams i.e. side hustles like Rover, Upwork, Uber, or Tutoring.',
  monthlyExpenses:
    'Expenses are any items requiring you to spend money, either to another person or group as payment for an item, service, etc. There are two kinds of expenses: fixed and variable.',
  monthlySavings:
    'There are two primary reasons to save money: to have cash available for opportunities, emergencies, and retirement; and to activate compound interest.',
  assets:
    'Assets are all the property you own. Assets are broken into two categories: current assets (liquid) - can be converted into cash quickly (less than 3 months), and long-term assets (illiquid) - cannot be converted into cash quickly (greater than 3 months).',
  liabilities:
    'Liabilities are all of your debts that are currently outstanding to lenders. Liabilities are broken into two categories: current - liabilities that need to be paid off within 12 months or less, and long-term - liabilities that need to be paid off in greater than 12 months.',
};
