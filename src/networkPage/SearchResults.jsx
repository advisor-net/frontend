import { useMemo, useEffect, useState } from "react";
import { useTable, useSortBy } from "react-table";
import { useAsyncValue } from "react-router-dom";
import { 
  useSearchContext, 
  getDefaultParamsForProfile, 
  updateURLfromParamsObj, 
  constructURLParams, 
  FIELD_KEYS, 
  JOB_LEVEL_MAP, 
  FIELD_TO_ACCESSOR, 
  OTHER_PARAM_KEYS,
  FILTER_TYPES,
  getSortByTableStateFromParamsObject, 
  getParamsObjFromUrl,
} from "./SearchContext";
import { useQuery } from "react-query";
import networkService from "../services/networkService";
import Pagination from 'rc-pagination';
import { Select } from "chakra-react-select";

import { formatLargePrice } from "../utils/utils";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Heading,
  Box,
} from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";

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
      }
    },
    useSortBy,
  );

  useEffect(() => {
    setOrderBy(sortBy);
  }, [sortBy])

  return (
    <>
      <Table 
        {...getTableProps()}
        variant="striped" 
        colorScheme="teal"
        size="sm"
      >
        <Thead position="sticky" top={0} background="grey">
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th
                  userSelect="none"
                  {...column.getHeaderProps()}
                  {...column.getSortByToggleProps()}
                  title={column.canSort ? "Toggle sort" : ""}
                  color="#fff"
                >
                  <Flex alignItems="center">
                    {column.render("Header")}
                    {/* Add a sort direction indicator */}
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <ChevronDownIcon ml={1} w={4} h={4} />
                      ) : (
                        <ChevronUpIcon ml={1} w={4} h={4} />
                      )
                    ) : (
                      ""
                    )}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </>
  );
}

const PAGE_SIZE_OPTIONS = [
  { value: 20, label: 20},
  { value: 50, label: 50},
  { value: 100, label: 100},
];

const SearchResults = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Handle",
        accessor: FIELD_TO_ACCESSOR[FIELD_KEYS.HANDLE],
        disableSortBy: true,
      },
      {
        Header: "Location",
        accessor: FIELD_TO_ACCESSOR[FIELD_KEYS.METRO],
      },
      {
        Header: "Industry",
        accessor: FIELD_TO_ACCESSOR[FIELD_KEYS.INDUSTRY],
      },
      {
        Header: "Job title",
        accessor: FIELD_TO_ACCESSOR[FIELD_KEYS.JOB_TITLE],
      },
      {
        Header: "Age",
        accessor: FIELD_TO_ACCESSOR[FIELD_KEYS.AGE],
      },
      {
        Header: "Level",
        accessor: FIELD_TO_ACCESSOR[FIELD_KEYS.LEVEL],
        Cell: ({ value }) => JOB_LEVEL_MAP[value] || '',
        sortDescFirst: true,
      },
      {
        Header: "Net worth",
        accessor: FIELD_TO_ACCESSOR[FIELD_KEYS.NET_WORTH],
        Cell: ({ value }) => formatLargePrice(value, 3),
        sortDescFirst: true,
      },
      {
        Header: "Annual income",
        accessor: FIELD_TO_ACCESSOR[FIELD_KEYS.INC_TOTAL_ANNUAL],
        Cell: ({ value }) => formatLargePrice(value, 3),
        sortDescFirst: true,
      },
      {
        Header: "Housing",
        accessor: FIELD_TO_ACCESSOR[FIELD_KEYS.EXP_HOUSING],
        Cell: ({ value }) => formatLargePrice(value, 3),
        sortDescFirst: true,
      }
    ],
    [],
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
    const nextParamsObj = getParamsObjFromUrl(nextUrl);
    const initialSortBy = getSortByTableStateFromParamsObject(nextParamsObj);
    
    setInitialTableSortBy(initialSortBy);

    // TODO: page protection
    if (nextParamsObj[OTHER_PARAM_KEYS.PAGE_NUMBER]) {
      setCurrentPage(parseInt(nextParamsObj[OTHER_PARAM_KEYS.PAGE_NUMBER].value));
    }
    if (nextParamsObj[OTHER_PARAM_KEYS.PAGE_SIZE]) {
      const paramInfo = nextParamsObj[OTHER_PARAM_KEYS.PAGE_SIZE];
      setCurrentPageSize({ value: parseInt(paramInfo.value), label: paramInfo.value.toString() });
    }
    
    setParamsObj(nextParamsObj);
    updateURLfromParamsObj(nextParamsObj);
  }, [profile, setParamsObj, getDefaultParamsForProfile, updateURLfromParamsObj])

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
    const nextParamsObj = { ...paramsObj };
    nextParamsObj[OTHER_PARAM_KEYS.PAGE_NUMBER] = { filterType: FILTER_TYPES.PAGE_NUMBER, value: nextPage };
    setParamsObj(nextParamsObj);
    updateURLfromParamsObj(nextParamsObj);
  };

  const handlePageSizeChange = (nextPageSize) => {
    setCurrentPageSize(nextPageSize);
    setCurrentPage(1);
    const nextParamsObj = { ...paramsObj };
    nextParamsObj[OTHER_PARAM_KEYS.PAGE_SIZE] = { filterType: FILTER_TYPES.PAGE_SIZE, value: nextPageSize.value };
    nextParamsObj[OTHER_PARAM_KEYS.PAGE_NUMBER] = { filterType: FILTER_TYPES.PAGE_NUMBER, value: 1 };
    setParamsObj(nextParamsObj);
    updateURLfromParamsObj(nextParamsObj);
  };

  // TODO: improve the search triggering
  const searchParams = constructURLParams(paramsObj);
  const searchString = searchParams.toString();

  const searchResult = useQuery(
    ['network', 'search', searchString],
    () =>
      networkService.userSearch(searchString),
    {
      cacheTime: 0,
      enabled: false,
      refetchOnWindowFocus: false,
      retry: false,
      onError: () => null,
      onSuccess: (data) => {
        setResults(data);
      },
    },
  );

  useEffect(() => {
    if (searchString) {
      searchResult.refetch();
    }
  }, [searchString])
  
  // NOTE: we are not mounting until we run the initial effects to allow for the table state
  // to be initialized by information we extract from the URL
  // TODO: figure out scrolling state and heights...same problem we had with similar parts
  //  took what i have from here: https://github.com/chakra-ui/chakra-ui/discussions/4380
  return (
    <Flex direction="column" border="1px solid #ddd" width="100%" padding="2" flexGrow={1}>
      <Heading size="lg">{`Results (${results.count || 0})`}</Heading>
      {Boolean(initialTableSortBy) && (
        <Box overflowY="auto" maxHeight="60vh" borderRadius={4} marginTop={2} marginBottom={2}>
          <CustomTable columns={columns} data={results} setOrderBy={setOrderBy} initialSortBy={initialTableSortBy} />
        </Box>
      )}
      <Flex alignSelf="center" justifyContent="center" alignItems="center">
        <Pagination onChange={handlePageChange} current={currentPage} total={results.count || 0}/>
        <Select 
          size="sm"
          value={pageSize}
          onChange={handlePageSizeChange}
          options={PAGE_SIZE_OPTIONS}
        />
      </Flex>
    </Flex>
  );
}

export default SearchResults;
