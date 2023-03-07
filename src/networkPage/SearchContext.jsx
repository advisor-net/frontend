import {
  createContext, useCallback, useContext, useMemo, useState
} from 'react';
import { 
  transformSortByTableStateToParamsObj,
  updateURLfromParamsObj,
} from './utils';

const SearchContext = createContext(null);

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
