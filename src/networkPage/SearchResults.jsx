import { useEffect, useMemo, useState } from 'react';
import { useSortBy, useTable } from 'react-table';
import { useAsyncValue } from 'react-router-dom';
import { useQuery } from 'react-query';
import Pagination from 'rc-pagination';
import { Select } from 'chakra-react-select';
import {
  Box,
  Flex,
  Heading,
  LinkBox,
  LinkOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useSearchContext } from './SearchContext';
import networkService from '../services/networkService';

import {
  getDefaultParamsForProfile,
  transformParamsObjToSortByTableState,
  transformParamsObjToUrl,
  transformUrlToParamsObj,
  updatePageQueryInParams,
  updatePageSizeInParams,
  updateURLfromParamsObj,
} from './utils';
import { FIELD_KEYS, FIELD_TO_TABLE_ACCESSOR, OTHER_QUERY_PARAM_KEYS } from './constants';

import { JOB_LEVEL_LABELS } from '../constants/all';

import { formatLargePrice } from '../utils/utils';

const CustomTable = ({ columns, data, setOrderBy, initialSortBy }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { sortBy },
  } = useTable(
    {
      columns,
      data: data?.results || [],
      manualSortBy: true,
      disableMultiSort: true, // TODO: enable this
      initialState: {
        sortBy: initialSortBy,
      },
    },
    useSortBy
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  // NOTE: If we include setOrderBy, we get a loop that infinitely runs.
  // This is related to the fact that we return a new object for params
  // (a new array) with each update, which triggers an endless cycle.
  // We should come back and try to make this more elegant
  useEffect(() => {
    setOrderBy(sortBy);
  }, [sortBy]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <Table {...getTableProps()} size="sm">
      <Thead position="sticky" top={0} background="grey" zIndex={1}>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Th
                userSelect="none"
                {...column.getHeaderProps()}
                {...column.getSortByToggleProps()}
                title={column.canSort ? 'Toggle sort' : ''}
                color="#fff"
              >
                <Flex alignItems="center">
                  {column.render('Header')}
                  {/* Add a sort direction indicator. TODO: improve this display */}
                  {column.isSorted &&
                    (column.isSortedDesc ? (
                      <ChevronDownIcon ml={1} w={4} h={4} />
                    ) : (
                      <ChevronUpIcon ml={1} w={4} h={4} />
                    ))}
                </Flex>
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()} zIndex={-1}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <LinkBox
              as={Tr}
              {...row.getRowProps()}
              style={{
                display: 'table-row',
                verticalAlign: 'inherit',
                userSelect: 'none',
              }}
              _hover={{
                background: 'teal',
                color: '#fff',
                transition: '100ms ease all',
              }}
            >
              {row.cells.map((cell, index) => {
                if (index === 0) {
                  return (
                    <Td {...cell.getCellProps()}>
                      <LinkOverlay href={`/network/p/${row.original.uuid}`}>
                        {cell.render('Cell')}
                      </LinkOverlay>
                    </Td>
                  );
                }
                return <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>;
              })}
            </LinkBox>
          );
        })}
      </Tbody>
    </Table>
  );
};

const PAGE_SIZE_OPTIONS = [
  { value: 20, label: 20 },
  { value: 50, label: 50 },
  { value: 100, label: 100 },
];

const SearchResults = () => {
  const columns = useMemo(
    () => [
      {
        Header: 'Handle',
        accessor: FIELD_TO_TABLE_ACCESSOR[FIELD_KEYS.HANDLE],
        disableSortBy: true,
      },
      {
        Header: 'Location',
        accessor: FIELD_TO_TABLE_ACCESSOR[FIELD_KEYS.METRO],
      },
      {
        Header: 'Industry',
        accessor: FIELD_TO_TABLE_ACCESSOR[FIELD_KEYS.INDUSTRY],
      },
      {
        Header: 'Job title',
        accessor: FIELD_TO_TABLE_ACCESSOR[FIELD_KEYS.JOB_TITLE],
      },
      {
        Header: 'Age',
        accessor: FIELD_TO_TABLE_ACCESSOR[FIELD_KEYS.AGE],
      },
      {
        Header: 'Level',
        accessor: FIELD_TO_TABLE_ACCESSOR[FIELD_KEYS.LEVEL],
        Cell: ({ value }) => JOB_LEVEL_LABELS[value] || '',
        sortDescFirst: true,
      },
      {
        Header: 'Net worth',
        accessor: FIELD_TO_TABLE_ACCESSOR[FIELD_KEYS.NET_WORTH],
        Cell: ({ value }) => formatLargePrice(value, 3),
        sortDescFirst: true,
      },
      {
        Header: 'Annual income',
        accessor: FIELD_TO_TABLE_ACCESSOR[FIELD_KEYS.INC_TOTAL_ANNUAL],
        Cell: ({ value }) => formatLargePrice(value, 3),
        sortDescFirst: true,
      },
      {
        Header: 'Housing',
        accessor: FIELD_TO_TABLE_ACCESSOR[FIELD_KEYS.EXP_HOUSING],
        Cell: ({ value }) => formatLargePrice(value, 3),
        sortDescFirst: true,
      },
    ],
    []
  );

  const [initialTableSortBy, setInitialTableSortBy] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setCurrentPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  const { setParamsObj, paramsObj, results, setResults, setOrderBy } = useSearchContext();
  const { profile } = useAsyncValue();

  // onmount set params object from the URL
  useEffect(() => {
    const url = new URL(window.location);
    if (!url.search) {
      const defaultParams = getDefaultParamsForProfile(profile);
      updateURLfromParamsObj(defaultParams);
    }
    const nextUrl = new URL(window.location);
    const nextParamsObj = transformUrlToParamsObj(nextUrl);
    const initialSortBy = transformParamsObjToSortByTableState(nextParamsObj);

    setInitialTableSortBy(initialSortBy);

    // TODO: page protection
    if (nextParamsObj[OTHER_QUERY_PARAM_KEYS.PAGE_NUMBER]) {
      setCurrentPage(parseInt(nextParamsObj[OTHER_QUERY_PARAM_KEYS.PAGE_NUMBER].value, 10));
    }
    if (nextParamsObj[OTHER_QUERY_PARAM_KEYS.PAGE_SIZE]) {
      const paramInfo = nextParamsObj[OTHER_QUERY_PARAM_KEYS.PAGE_SIZE];
      setCurrentPageSize({
        value: parseInt(paramInfo.value, 10),
        label: paramInfo.value.toString(),
      });
    }

    setParamsObj(nextParamsObj);
  }, [profile, setParamsObj]);

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
    const nextParamsObj = updatePageQueryInParams(nextPage, paramsObj);
    setParamsObj(nextParamsObj);
  };

  const handlePageSizeChange = (nextPageSize) => {
    setCurrentPageSize(nextPageSize);
    setCurrentPage(1);
    const nextParamsObj = updatePageSizeInParams(nextPageSize.value, 1, paramsObj);
    setParamsObj(nextParamsObj);
  };

  const searchParams = transformParamsObjToUrl(paramsObj);
  const searchString = searchParams.toString();

  const searchResult = useQuery(
    ['network', 'search', searchString],
    () => networkService.userSearch(searchString),
    {
      cacheTime: 0,
      enabled: false,
      refetchOnWindowFocus: false,
      retry: false,
      onError: () => null,
      onSuccess: (data) => {
        setResults(data);
      },
    }
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (searchString) {
      searchResult.refetch();
    }
  }, [searchString]);
  /* eslint-enable react-hooks/exhaustive-deps */

  // NOTE: we are not mounting until we run the initial effects to allow for the table state
  // to be initialized by information we extract from the URL
  // TODO: figure out scrolling state and heights...same problem we had with similar parts
  //  took what i have from here: https://github.com/chakra-ui/chakra-ui/discussions/4380
  return (
    <Flex direction="column" border="1px solid #ddd" borderRadius={4} padding={2} flexGrow={1}>
      <Heading size="md">{`Results (${results.count || 0})`}</Heading>
      {Boolean(initialTableSortBy) && (
        <Box
          overflowY="auto"
          maxHeight="60vh"
          border="1px solid #ddd"
          borderRadius={4}
          marginTop={2}
          marginBottom={2}
        >
          <CustomTable
            columns={columns}
            data={results}
            setOrderBy={setOrderBy}
            initialSortBy={initialTableSortBy}
          />
        </Box>
      )}
      <Flex alignSelf="center" justifyContent="center" alignItems="center" gap={2}>
        <Pagination
          onChange={handlePageChange}
          current={currentPage}
          pageSize={pageSize.value}
          total={results.count || 0}
        />
        <Select
          size="sm"
          value={pageSize}
          onChange={handlePageSizeChange}
          options={PAGE_SIZE_OPTIONS}
          menuPlacement="auto"
        />
      </Flex>
    </Flex>
  );
};

export default SearchResults;
