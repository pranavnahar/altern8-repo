/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
  PaginationState,
  Row,
} from '@tanstack/react-table';
import { useState, useEffect, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AnimatePresence, Reorder, motion, useDragControls } from 'framer-motion';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconChevronUp,
} from '@tabler/icons-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import useMediaQuery from '@/hooks/use-media-query';
import { getAuthToken } from '@/utils/auth-actions';
import BasicTableSkeleton from './basic-table-skeleton';

type CustomColumnDef<T extends object> = ColumnDef<T> & {
  accessorKey?: keyof T | string;
  sortOrderChanges?: {
    id: string;
    desc: boolean;
  }[];
};

type TableConfigurationPayload = {
  column_name: string;
  table?: string;
  sorted_columns?: { id: string; desc: boolean }[];
  toggled_on_columns?: string[];
  toggled_off_columns?: string[];
};

type BasicTableProps<T extends object> = {
  data: T[];
  columns: CustomColumnDef<T>[];
  filters: string[];
  needFilters: boolean;
  alreadyAppliedFilter?: string;
  hideTableSearch?: boolean;
  tableName: string;
};

interface Table {
  name: string;
}

const snakeToTitleCase = (str: string): string => {
  if (!str) return '';
  return str
    .split(/[_.]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const BasicTable = <T extends object>({
  data,
  columns,
  filters,
  needFilters,
  alreadyAppliedFilter,
  hideTableSearch,
  tableName,
}: BasicTableProps<T>) => {
  const [filterButtonName, setFilterButtonName] = useState<string>('Apply Filter');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState<string>('');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [toggledOnColumns, setToggledOnColumns] = useState<string[]>([]);
  const [toggledOffColumns, setToggledOffColumns] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [sortedColumns, setSortedColumns] = useState<{ id: string; desc: boolean }[]>([]);
  const [columnStates, setColumnStates] = useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    columns.map(
      col => col.id?.toString() || col.accessorKey?.toString() || col.header?.toString() || '',
    ),
  );
    const [showAllColumns, setShowAllColumns] = useState<boolean>(false);
    const dragControls = useDragControls();
  
    const [tableConfiguration, setTableConfiguration] = useState<{
        table_id?: string;
        name?: string;
    }>({});
  
    const [isFirstCall, setIsFirstCall] = useState<boolean>(true);
    const [isConfigurationFetched, setIsConfigurationFetched] = useState<boolean>(false);

   // Debounce utility function
  const useDebounce = (value: any, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  // Debounced values
  const debouncedToggledOnColumns = useDebounce(toggledOnColumns, 500);
  const debouncedToggledOffColumns = useDebounce(toggledOffColumns, 500);
  const debouncedSortedColumns = useDebounce(sortedColumns, 500);
  const debouncedColumnOrder = useDebounce(columnOrder, 500);
  
  const handleSortingChange = (
    updaterOrValue: SortingState | ((old: SortingState) => SortingState),
  ) => {
    // Directly use setSorting to handle both cases.
    setSorting(prevState => {
      if (typeof updaterOrValue === 'function') {
        // If it's a function, call it with the previous state
        return updaterOrValue(prevState);
      }
      // Otherwise, directly return the new SortingState
      return updaterOrValue;
    });
  };

  const handleColumnVisibilityChange = (columnId: string, newVisibility: boolean) => {
      setColumnStates(prevStates => ({
        ...prevStates,
        [columnId]: newVisibility,
      }));
    
      // Update toggledOnColumns and toggledOffColumns arrays
      if (newVisibility) {
        // Column toggled ON
        setToggledOnColumns(prev => (prev.includes(columnId) ? prev : [...prev, columnId]));
        setToggledOffColumns(prev => prev.filter(id => id !== columnId));
      } else {
        // Column toggled OFF
        setToggledOffColumns(prev => (prev.includes(columnId) ? prev : [...prev, columnId]));
        setToggledOnColumns(prev => prev.filter(id => id !== columnId));
      }
    
      console.log(
        `Column "${columnId}" visibility changed to: ${newVisibility ? 'visible' : 'hidden'}`,
      );
    };


  const isXs = useMediaQuery('(min-width: 480px)');
  const isS = useMediaQuery('(min-width: 624px)');
  const isSm = useMediaQuery('(min-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 914px)');
  const isMd = useMediaQuery('(min-width: 1060px)');
  const isLg = useMediaQuery('(min-width: 1200px)');
  const isXl = useMediaQuery('(min-width: 1700px)');

  const getInitialColumnCount = () => {
    if (isXl) return 8;
    if (isLg) return 6;
    if (isMd) return 5;
    if (isTablet) return 4;
    if (isSm) return 3;
    if (isS) return 2;
    if (isXs) return 1;
    return 1;
  };

  useEffect(() => {
    const initialStates = Object.fromEntries(
      columns.map(column => [
        column.id?.toString() || column.accessorKey?.toString() || column.header?.toString(),
        true,
      ]),
    );
    setColumnStates(initialStates);

    const initialOrder = columns.map(
      col => col.id?.toString() || col.accessorKey?.toString() || col.header?.toString() || '',
    );
    setColumnOrder(initialOrder);
  }, [columns]);

  const mappedColumns = columns
    .map(col => {
      const id = col.id?.toString() || col.accessorKey?.toString() || '';
      const header = col.header || snakeToTitleCase(col.accessorKey?.toString() || '');
      const accessorFn = col.accessorKey
        ? (row: T) => {
            const keys = (col.accessorKey as string).split('.');
            return keys.reduce((obj: any, key: string) => obj && obj[key], row);
          }
        : undefined;

      return {
        ...col,
        id,
        header,
        accessorFn,
        sortOrderChanges: [],
      };
    })
    .filter(col => col.id);

  const table = useReactTable<T>({
    data,
    columns: mappedColumns as ColumnDef<T, any>[],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnOrder,
      sorting,
      globalFilter: filtering,
      pagination,
      columnVisibility: columnStates,
    },
    onSortingChange: (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
      // Update sorting state
      setSorting(prevState => {
        const newSortingState =
          typeof updaterOrValue === 'function' ? updaterOrValue(prevState) : updaterOrValue;

        // Update sortedColumns state
        setSortedColumns(newSortingState.map(({ id, desc }) => ({ id, desc })));

        // Log sorting changes
        if (newSortingState.length > 0) {
          const { id, desc } = newSortingState[0];
          const sortDirection = desc ? 'descending' : 'ascending';
          console.log(`Column "${id}" sorted in ${sortDirection} order`);
        } else {
          console.log('Sorting removed');
        }

        return newSortingState;
      });
    },
    onGlobalFilterChange: setFiltering,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnStates,
    onColumnOrderChange: setColumnOrder,
  });

  const handleFilterClick = (value: string) => {
    if (value === 'remove_filter') {
      setFiltering('');
      setFilterButtonName('Apply Filter');
    } else {
      setFiltering(value);
      setFilterButtonName(value);
    }
    console.log('Filter applied:', filtering);
  };

  useEffect(() => {
    if (alreadyAppliedFilter) {
      handleFilterClick(alreadyAppliedFilter);
    }
  }, [alreadyAppliedFilter]);

  useEffect(() => {
    console.log('Filter applied (from useEffect):', filtering);
  }, [filtering]);

  const initialColumnCount = useMemo(getInitialColumnCount, [
    isXs,
    isS,
    isSm,
    isTablet,
    isMd,
    isLg,
    isXl,
  ]);
  const totalColumns = table.getAllLeafColumns().length;
  const showExpandButton = totalColumns > initialColumnCount;


  const buildPayload = () => {
      // Use the current column order as the primary source of truth
      const allColumns = columnOrder;
    
      // Generate the `columns` array
      const columns = allColumns.map((column, index) => {
        const isVisible = !debouncedToggledOffColumns.includes(column);
    
        const sortColumn = sortedColumns.find((col) => col.id === column);
        const sortOrder = sortColumn 
          ? sortColumn.desc 
            ? "Descending" 
            : "Ascending" 
          : "None";
    
        return {
          column_name: column,
          is_visible: isVisible,
          sort_order: sortOrder,
          column_order: index + 1, // Use the actual current order
        };
      });
    
      // Wrap it in the payload
      return {
        table_name: tableName,
        columns,
      };
    };


  const saveTableConfiguration = async () => {
    try {
      const token = await getAuthToken();
      const payload = buildPayload();

      // Determine which HTTP method to use
      const method = tableConfiguration.table_id ? 'PUT' : 'POST';
      const url = method === 'POST' 
        ? `${apiUrl}/admin-api/table-config/` 
        : `${apiUrl}/admin-api/table-config/${tableConfiguration.table_id}/`;

      console.log("the payload formed is this: ------", payload)
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to save table configuration');
      }

      const responseData = await response.json();
      
      // If it was a POST request, update the table configuration with the new table_id
      if (method === 'POST') {
        setTableConfiguration({
          table_id: responseData.table_id,
          name: tableName
        });
      }
    } catch (error) {
      console.error('Error saving table configuration:', error);
    }
  };

  // Initial configuration fetch
  useEffect(() => {
    const fetchTableConfiguration = async () => {
      setIsLoading(true);
      try {
        const token = await getAuthToken();
        console.log("Table name passed as prop: ", tableName);
  
        // Step 1: Fetch all tables and their IDs/names
        const tableResponse = await fetch(`${apiUrl}/admin-api/table-config/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!tableResponse.ok) {
          throw new Error('Failed to fetch table list');
        }
  
        const tables = await tableResponse.json();
        console.log("Fetched tables: ", tables);
  
        // Step 2: Find the table with the matching name
        const matchingTable = tables.find((table: Table) => table.name === tableName);
  
        if (matchingTable) {
          console.log("Matching table found: ", matchingTable);
  
          // Step 3: Use the matching table_id to fetch its configuration
          const configResponse = await fetch(
            `${apiUrl}/admin-api/table-config/${matchingTable.table_id}/`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );
  
          if (!configResponse.ok) {
            throw new Error('Failed to fetch table configuration');
          }
  
          const configuration = await configResponse.json();
          console.log("Fetched table configuration: ", configuration);
  
          // Step 4: Apply the configuration

          applyTableConfiguration(configuration);
  
          // Update table configuration state
          setTableConfiguration({
            table_id: matchingTable.table_id,
            name: tableName,
          });
        } else {
          console.log("No matching table found for the given name.");
          // Optional: Handle the case where no matching table exists
          setTableConfiguration({ name: tableName });
        }
  
        setIsConfigurationFetched(true);
      } catch (error) {
        console.error('Error fetching table configuration:', error);
        setIsConfigurationFetched(true);
      } finally{
        setIsLoading(false);
      }
    };
  
  
    const applyTableConfiguration = (configuration: any[]) => {
        // Create a map of all original columns with their original indices
        const allColumnsWithIndices = columns.map((col, index) => ({
          name: col.id?.toString() || col.accessorKey?.toString() || col.header?.toString() || '',
          originalIndex: index
        }));
      
        // Create a map of configuration for quick lookup
        const configMap = new Map(
          configuration.map(config => [config.column_name, config])
        );
      
        // Prepare states
        const newColumnStates: Record<string, boolean> = {};
        const newToggledOnColumns: string[] = [];
        const newToggledOffColumns: string[] = [];
        const newSortedColumns: { id: string; desc: boolean }[] = [];
      
        // Process each column with explicit order handling
        const processedColumns = allColumnsWithIndices.map(columnInfo => {
          const columnName = columnInfo.name;
          const columnConfig = configMap.get(columnName);
      
          // Determine visibility
          const isVisible = columnConfig 
            ? columnConfig.is_visible 
            : true; // Default to true if no specific config
      
          // Update column states
          newColumnStates[columnName] = isVisible;
      
          // Track toggled columns
          if (isVisible) {
            newToggledOnColumns.push(columnName);
          } else {
            newToggledOffColumns.push(columnName);
          }
      
          // Check for sorting
          let sortOrder: { id: string; desc: boolean } | null = null;
          if (columnConfig && columnConfig.sort_order && columnConfig.sort_order !== 'None') {
            sortOrder = {
              id: columnName,
              desc: columnConfig.sort_order === 'Descending'
            };
            newSortedColumns.push(sortOrder);
          }
      
          return {
            name: columnName,
            originalIndex: columnInfo.originalIndex,
            configuredOrder: columnConfig?.column_order,
            isVisible,
            sortOrder
          };
        });
      
        // Determine column order with more sophisticated logic
        const orderedColumns = processedColumns
          .sort((a, b) => {
            // First, prioritize configured order if available
            if (a.configuredOrder !== undefined && b.configuredOrder !== undefined) {
              return a.configuredOrder - b.configuredOrder;
            }
            
            // If no configured order, but both are visible, maintain their relative original order
            if (a.isVisible && b.isVisible) {
              return a.originalIndex - b.originalIndex;
            }
            
            // Visible columns come before hidden columns
            if (a.isVisible && !b.isVisible) return -1;
            if (!a.isVisible && b.isVisible) return 1;
            
            // If both are hidden, maintain their original relative order
            return a.originalIndex - b.originalIndex;
          })
          .map(col => col.name);
      
        // Ensure all columns are included in the order
        const finalColumnOrder = [
          ...new Set([
            ...orderedColumns,
            ...processedColumns
              .map(col => col.name)
              .filter(name => !orderedColumns.includes(name))
          ])
        ];
      
        // Update states
        setColumnStates(newColumnStates);
        setToggledOnColumns(newToggledOnColumns);
        setToggledOffColumns(newToggledOffColumns);
        
        // Set initial sorting if configured
        if (newSortedColumns.length > 0) {
          setSorting(newSortedColumns);
        }
      
        // Prioritize configured order, then visibility, then original order
        setColumnOrder(finalColumnOrder);
      };
  
    fetchTableConfiguration();
  }, [tableName]);


  // Trigger save when configuration changes
  useEffect(() => {
    if (isConfigurationFetched && 
        (debouncedToggledOnColumns.length > 0 || 
         debouncedToggledOffColumns.length > 0 || 
         debouncedSortedColumns.length > 0 ||
        debouncedColumnOrder.length > 0 )) {
      saveTableConfiguration();
    }
  }, [
    debouncedToggledOnColumns, 
    debouncedToggledOffColumns, 
    debouncedSortedColumns,
    debouncedColumnOrder
  ]);

  if (isLoading) {
    return <BasicTableSkeleton />;
  }

  return (
    <div className="w-full overflow-auto">
      <div className="flex items-center justify-between w-auto">
        {!hideTableSearch && (
          <div className="py-1 my-2">
            <input
              onChange={e => setFiltering(e.target.value)}
              value={filtering}
              placeholder="Search"
              className="py-1 text-gray-200 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
              type="text"
            />
          </div>
        )}

        {needFilters && (
          <div className="py-1 my-2">
            <Select
              onValueChange={handleFilterClick}
              value={filterButtonName === 'Apply Filter' ? 'remove_filter' : filterButtonName}
            >
              <SelectTrigger className="w-[180px] bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 border-2 border-zinc-200/70 font-medium text-white">
                <SelectValue placeholder="Apply Filter" />
              </SelectTrigger>
              <SelectContent className="w-[180px] border-none bg-white/70 backdrop-blur-md">
                <SelectItem value="remove_filter" className="rounded-md">
                  Remove Filter
                </SelectItem>
                {filters.map(filter => (
                  <SelectItem key={filter} value={filter} className="rounded-md">
                    {filter}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <AnimatePresence>
        <motion.div
          className="flex pt-8"
          initial={{ height: 0 }}
          animate={{
            height: showAllColumns ? 'auto' : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div className="grid w-full tablet:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-y-3 gap-x-5">
            {table
              .getAllLeafColumns()
              .slice(0, showAllColumns ? undefined : initialColumnCount)
              .map((column, index) => {
                const columnId = column.id?.toString();
                const displayName = column.columnDef.header as string;
                return (
                  <motion.li
                    key={index}
                    className="flex gap-3 py-1"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Checkbox
                      checked={column.getIsVisible()}
                      onCheckedChange={checked => {
                        const columnId = column.id?.toString();
                        column.toggleVisibility(!!checked);
                        if (columnId) {
                          handleColumnVisibilityChange(columnId, !!checked);
                        }
                      }}
                      id={columnId}
                      className="my-auto rounded-md border-primary/30 size-5"
                    />
                    <p className="my-auto text-sm tracking-wide truncate text-neutral-200 w-auto">
                      {displayName}
                    </p>
                  </motion.li>
                );
              })}
          </div>
          {showExpandButton && (
            <div className="flex justify-end p-1 mb-auto ml-auto rounded-md card-cover">
              <button
                onClick={() => setShowAllColumns(!showAllColumns)}
                className={`text-white transform transition-transform duration-300 ${
                  showAllColumns ? 'rotate-180' : ''
                }`}
              >
                <IconChevronDown className="size-5" />
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="max-w-[calc(100vw-2rem)] pt-16">
        <ScrollArea type="auto" className="w-[100%] whitespace-nowrap">
          <Table className="min-w-full">
            <TableHeader className="overflow-hidden border-b-2 border-neutral-300/40">
              {table.getHeaderGroups().map((headerGroup, index) => (
                <Reorder.Group
                  key={index}
                  as="tr"
                  axis="x"
                  values={columnOrder}
                  onReorder={setColumnOrder}
                  className="h-12"
                >
                  <AnimatePresence initial={false}>
                    {columnOrder.map(columnId => {
                      const header = headerGroup.headers.find(h => h.id === columnId);
                      if (!header || header.isPlaceholder) return null;

                      return (
                        <Reorder.Item
                          key={columnId}
                          value={columnId}
                          as="th"
                          className={`whitespace-nowrap pr-5 pl-3.5 font-normal text-sm text-zinc-300/80 rounded-lg ${
                            isDragging ? 'z-50' : ''
                          }`}
                          onDragStart={() => setIsDragging(true)}
                          onDragEnd={() => setIsDragging(false)}
                          drag="x"
                        >
                          <div
                            className="flex mr-10 cursor-grab active:cursor-grabbing min-w-32"
                            onClick={e => {
                              if (!isDragging) {
                                header.column.getToggleSortingHandler()?.(e);
                              }
                            }}
                          >
                            <h1 className="my-auto">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </h1>
                            {header.column.getIsSorted() && (
                              <IconChevronUp
                                className={`size-5 my-auto mx-2 ${
                                  header.column.getIsSorted() === 'asc'
                                    ? 'rotate-asc'
                                    : 'rotate-desc'
                                }`}
                              />
                            )}
                          </div>
                        </Reorder.Item>
                      );
                    })}
                  </AnimatePresence>
                </Reorder.Group>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row: Row<T>, index) => (
                <TableRow key={index} data-state={row.getIsSelected() ? 'selected' : undefined}>
                  {columnOrder.map((columnId, index) => {
                    const cell = row.getVisibleCells().find(c => c.column.id === columnId);
                    return cell ? (
                      <TableCell key={index} className="text-sm font-normal text-white">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ) : null;
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="flex justify-between p-2 my-4">
        <div className="flex items-center gap-2">
          <div className="w-[70px] border-primary/30">
            <Select
              onValueChange={value => setPagination(old => ({ ...old, pageSize: Number(value) }))}
              value={pagination.pageSize.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Per Page" />
              </SelectTrigger>
              <SelectContent className="w-[70px] bg-white/50 border-none backdrop-blur-md">
                {[5, 8, 12, 15, 20, 25, 50].map(pageSize => (
                  <SelectItem
                    className="rounded-md cursor-pointer"
                    key={pageSize}
                    value={pageSize.toString()}
                  >
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm font-medium text-neutral-400">Rows per page</p>
        </div>

        <div className="flex items-center gap-2 my-1">
          <Button
            onClick={() => table.setPageIndex(0)}
            size="sm"
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronsLeft className="size-4" />
          </Button>
          <Button
            onClick={() => table.previousPage()}
            size="sm"
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronLeft className="size-4" />
          </Button>
          <span className="text-sm font-medium text-white">
            Page <span>{table.getState().pagination.pageIndex + 1}</span> of {table.getPageCount()}
          </span>
          <Button onClick={() => table.nextPage()} size="sm" disabled={!table.getCanNextPage()}>
            <IconChevronRight className="size-4" />
          </Button>
          <Button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            size="sm"
            disabled={!table.getCanNextPage()}
          >
            <IconChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BasicTable;