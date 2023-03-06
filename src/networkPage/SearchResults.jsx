import { useMemo, useEffect, useState } from "react";
import { useTable, useSortBy } from "react-table";
import { useAsyncValue } from "react-router-dom";
import { useSearchContext, getDefaultParamsForProfile, updateURLfromParamsObj, constructURLParams, FIELD_KEYS, JOB_LEVEL_MAP, FIELD_TO_ACCESSOR, getSortByTableStateFromParamsObject, getParamsObjFromUrl } from "./SearchContext";
import { useQuery } from "react-query";
import networkService from "../services/networkService";

import { formatLargePrice } from "../utils/utils";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex
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
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <Th
                  userSelect="none"
                  {...column.getHeaderProps()}
                  {...column.getSortByToggleProps()}
                  title={column.canSort ? "Toggle sort" : ""}
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
      <br />
      <div>Showing the first 20 results of {data.count} rows</div>
    </>
  );
}

const SearchResults = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Demographic",
        columns: [
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
        ]
      },
      {
        Header: "Financial",
        columns: [
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
        ]
      }
    ],
    []
  );

  const [initialSortBy, setInitialSortBy] = useState(null);

  const { setParamsObj, paramsObj, results, setResults, setOrderBy } = useSearchContext();
  const { profile } = useAsyncValue();
  
  // onmount set params object
  useEffect(() => {
    const url = new URL(window.location);
    if (!url.search) {
      const defaultParams = getDefaultParamsForProfile(profile);
      updateURLfromParamsObj(defaultParams);
    }
    const nextUrl = new URL(window.location);
    const nextParamsObj = getParamsObjFromUrl(nextUrl);
    const initialSortBy = getSortByTableStateFromParamsObject(nextParamsObj);
    setParamsObj(nextParamsObj);
    updateURLfromParamsObj(nextParamsObj);
    setInitialSortBy(initialSortBy)
  }, [profile, setParamsObj, getDefaultParamsForProfile, updateURLfromParamsObj])

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
      onSuccess: (dta) => {
        setResults(dta);
      },
    },
  );

  useEffect(() => {
    if (searchString) {
      searchResult.refetch();
    }
  }, [searchString])

  return Boolean(initialSortBy) ? (
    <CustomTable columns={columns} data={results} setOrderBy={setOrderBy} initialSortBy={initialSortBy} />
  ) : null;
}

export default SearchResults;
