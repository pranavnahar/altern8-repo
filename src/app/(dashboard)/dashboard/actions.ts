"use server"

import ky from "ky"
import { notFound, redirect } from "next/navigation"
import { ProjectResponse } from "../projects/types"
import { getAuthToken } from "@/utils/auth-actions"

export async function getSanctionedLimit(): Promise<number> {
  try {
    let token = await getAuthToken()

    const fetchLimit = async (token: string) => {
      const response = await fetch(`${process.env.SERVER_URL}/user-dashboard-api/check-limit/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const responseData = await response.json()
        return responseData.limit
      }

      if (response.status === 401) {
        redirect('/login')
      }
    }

    let limit = await fetchLimit(token)
    return limit
  } catch (error) {
    redirect('/login')
  }
}

export async function fetchProjectData(timeoutMs: number = 60000): Promise<ProjectResponse> {
  try {
    const token = await getAuthToken();

    const response = await ky.get(`${process.env.SERVER_URL}/rablet-api/projects/`, {
      timeout: timeoutMs,
      retry: 3,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
     redirect('/login')
    }
    return await response.json() as ProjectResponse;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        redirect('/login')
      }
      if (error.name === 'TimeoutError') {
        redirect('/login')
      }
      if (error.name === 'HTTPError' && error.message.includes('404')) {
        notFound();
      }
    }
    throw error;
  }
}




// const BasicTable = <T extends object>({
//   data,
//   columns,
//   filters,
//   needFilters,
//   alreadyAppliedFilter,
//   hideTableSearch,
//   tableName,
// }: BasicTableProps<T>) => {
//   const [filterButtonName, setFilterButtonName] = useState<string>('Apply Filter');
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [filtering, setFiltering] = useState<string>('');
//   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
//   const [toggledOnColumns, setToggledOnColumns] = useState<string[]>([]);
//   const [toggledOffColumns, setToggledOffColumns] = useState<string[]>([]);
//   const [isDragging, setIsDragging] = useState<boolean>(false);
//   const [pagination, setPagination] = useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 8,
//   });
//   const [sortedColumns, setSortedColumns] = useState<{ id: string; desc: boolean }[]>([]);
//   const [columnStates, setColumnStates] = useState<Record<string, boolean>>({});
//   const [columnOrder, setColumnOrder] = useState<string[]>(() =>
//     columns.map(
//       col => col.id?.toString() || col.accessorKey?.toString() || col.header?.toString() || '',
//     ),
//   );
//   const [showAllColumns, setShowAllColumns] = useState<boolean>(false);
//   const dragControls = useDragControls();

//   const [tableConfiguration, setTableConfiguration] = useState<{
//     table_id?: string;
//     name?: string;
//   }>({});

//   const [isFirstCall, setIsFirstCall] = useState<boolean>(true);
//   const [isConfigurationFetched, setIsConfigurationFetched] = useState<boolean>(false);

//   // Debounce utility function
//   const useDebounce = (value: any, delay: number) => {
//     const [debouncedValue, setDebouncedValue] = useState(value);

//     useEffect(() => {
//       const handler = setTimeout(() => {
//         setDebouncedValue(value);
//       }, delay);

//       return () => {
//         clearTimeout(handler);
//       };
//     }, [value, delay]);

//     return debouncedValue;
//   };

//   // Debounced values
//   const debouncedToggledOnColumns = useDebounce(toggledOnColumns, 500);
//   const debouncedToggledOffColumns = useDebounce(toggledOffColumns, 500);
//   const debouncedSortedColumns = useDebounce(sortedColumns, 500);

//   const handleSortingChange = (
//     updaterOrValue: SortingState | ((old: SortingState) => SortingState),
//   ) => {
//     setSorting(prevState => {
//       if (typeof updaterOrValue === 'function') {
//         return updaterOrValue(prevState);
//       }
//       return updaterOrValue;
//     });
//   };

//   const handleColumnVisibilityChange = (columnId: string, newVisibility: boolean) => {
//     setColumnStates(prevStates => ({
//       ...prevStates,
//       [columnId]: newVisibility,
//     }));

//     // Update toggledOnColumns and toggledOffColumns arrays
//     if (newVisibility) {
//       // Column toggled ON
//       setToggledOnColumns(prev => (prev.includes(columnId) ? prev : [...prev, columnId]));
//       setToggledOffColumns(prev => prev.filter(id => id !== columnId));
//     } else {
//       // Column toggled OFF
//       setToggledOffColumns(prev => (prev.includes(columnId) ? prev : [...prev, columnId]));
//       setToggledOnColumns(prev => prev.filter(id => id !== columnId));
//     }

//     console.log(
//       `Column "${columnId}" visibility changed to: ${newVisibility ? 'visible' : 'hidden'}`,
//     );
//   };

  

//   const isXs = useMediaQuery('(min-width: 480px)');
//   const isS = useMediaQuery('(min-width: 624px)');
//   const isSm = useMediaQuery('(min-width: 768px)');
//   const isTablet = useMediaQuery('(min-width: 914px)');
//   const isMd = useMediaQuery('(min-width: 1060px)');
//   const isLg = useMediaQuery('(min-width: 1200px)');
//   const isXl = useMediaQuery('(min-width: 1700px)');

//   const getInitialColumnCount = () => {
//     if (isXl) return 8;
//     if (isLg) return 6;
//     if (isMd) return 5;
//     if (isTablet) return 4;
//     if (isSm) return 3;
//     if (isS) return 2;
//     if (isXs) return 1;
//     return 1;
//   };

//   useEffect(() => {
//     const initialStates = Object.fromEntries(
//       columns.map(column => [
//         column.id?.toString() || column.accessorKey?.toString() || column.header?.toString(),
//         true,
//       ]),
//     );
//     setColumnStates(initialStates);

//     const initialOrder = columns.map(
//       col => col.id?.toString() || col.accessorKey?.toString() || col.header?.toString() || '',
//     );
//     setColumnOrder(initialOrder);
//   }, [columns]);

//   const mappedColumns = columns
//     .map(col => {
//       const id = col.id?.toString() || col.accessorKey?.toString() || '';
//       const header = col.header || snakeToTitleCase(col.accessorKey?.toString() || '');
//       const accessorFn = col.accessorKey
//         ? (row: T) => {
//             const keys = (col.accessorKey as string).split('.');
//             return keys.reduce((obj: any, key: string) => obj && obj[key], row);
//           }
//         : undefined;

//       return {
//         ...col,
//         id,
//         header,
//         accessorFn,
//         sortOrderChanges: [],
//       };
//     })
//     .filter(col => col.id);

//   const table = useReactTable<T>({
//     data,
//     columns: mappedColumns as ColumnDef<T, any>[],
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     state: {
//       columnOrder,
//       sorting,
//       globalFilter: filtering,
//       pagination,
//       columnVisibility: columnStates,
//     },
//     onSortingChange: (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
//       // Update sorting state
//       setSorting(prevState => {
//         const newSortingState =
//           typeof updaterOrValue === 'function' ? updaterOrValue(prevState) : updaterOrValue;

//         // Update sortedColumns state
//         setSortedColumns(newSortingState.map(({ id, desc }) => ({ id, desc })));

//         // Log sorting changes
//         if (newSortingState.length > 0) {
//           const { id, desc } = newSortingState[0];
//           const sortDirection = desc ? 'descending' : 'ascending';
//           console.log(`Column "${id}" sorted in ${sortDirection} order`);
//         } else {
//           console.log('Sorting removed');
//         }

//         return newSortingState;
//       });
//     },
//     onGlobalFilterChange: setFiltering,
//     onPaginationChange: setPagination,
//     onColumnVisibilityChange: setColumnStates,
//     onColumnOrderChange: setColumnOrder,
//   });

//   const handleFilterClick = (value: string) => {
//     if (value === 'remove_filter') {
//       setFiltering('');
//       setFilterButtonName('Apply Filter');
//     } else {
//       setFiltering(value);
//       setFilterButtonName(value);
//     }
//     console.log('Filter applied:', filtering);
//   };

//   useEffect(() => {
//     if (alreadyAppliedFilter) {
//       handleFilterClick(alreadyAppliedFilter);
//     }
//   }, [alreadyAppliedFilter]);

//   useEffect(() => {
//     console.log('Filter applied (from useEffect):', filtering);
//   }, [filtering]);


//   const initialColumnCount = useMemo(getInitialColumnCount, [
//     isXs,
//     isS,
//     isSm,
//     isTablet,
//     isMd,
//     isLg,
//     isXl,
//   ]);
//   const totalColumns = table.getAllLeafColumns().length;
//   const showExpandButton = totalColumns > initialColumnCount;

//   const buildPayload = () => {
//     // Combine all column names
//     const allColumns = [
//       ...new Set([
//         ...debouncedToggledOnColumns,
//         ...debouncedToggledOffColumns,
//         ...sortedColumns.map((col) => col.id),
//       ]),
//     ];
  
//     // Generate the `columns` array
//     const columns = allColumns.map((column, index) => {
//       const isVisible = !debouncedToggledOffColumns.includes(column);
  
//       const sortColumn = sortedColumns.find((col) => col.id === column);
//       const sortOrder = sortColumn 
//         ? sortColumn.desc 
//           ? "Descending" 
//           : "Ascending" 
//         : "None";
  
//       return {
//         column_name: column,
//         is_visible: isVisible,
//         sort_order: sortOrder,
//         column_order: index + 1, 
//       };
//     });

//     return {
//       table_name: tableName, 
//       columns,
//     };
//   };
  

//   const saveTableConfiguration = async () => {
//     try {
//       const token = await getAuthToken();
//       const payload = buildPayload();

//       // Determine which HTTP method to use
//       const method = tableConfiguration.table_id ? 'PUT' : 'POST';
//       const url = method === 'POST' 
//         ? `${apiUrl}/admin-api/table-config/` 
//         : `${apiUrl}/admin-api/table-config/${tableConfiguration.table_id}/`;

//       console.log("the payload formed is this: ------", payload)
//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(payload)
//       });

//       if (!response.ok) {
//         throw new Error('Failed to save table configuration');
//       }

//       const responseData = await response.json();
      
//       // If it was a POST request, update the table configuration with the new table_id
//       if (method === 'POST') {
//         setTableConfiguration({
//           table_id: responseData.table_id,
//           name: tableName
//         });
//       }
//     } catch (error) {
//       console.error('Error saving table configuration:', error);
//     }
//   };

//   // Initial configuration fetch
//   useEffect(() => {
//     const fetchTableConfiguration = async () => {
//       console.log("calling teh fetch table cong function---------");
//       try {
//         const token = await getAuthToken();
//         console.log("Table name passed as prop: ", tableName);
  
//         // Step 1: Fetch all tables and their IDs/names
//         const tableResponse = await fetch(`${apiUrl}/admin-api/table-config/`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });
  
//         if (!tableResponse.ok) {
//           throw new Error('Failed to fetch table list');
//         }
  
//         const tables = await tableResponse.json();
//         console.log("Fetched tables: ", tables);
  
//         // Step 2: Find the table with the matching name
//         const matchingTable = tables.find((table: Table) => table.name === tableName);
  
//         if (matchingTable) {
//           console.log("Matching table found: ", matchingTable);
  
//           // Step 3: Use the matching table_id to fetch its configuration
//           const configResponse = await fetch(
//             `${apiUrl}/admin-api/table-config/${matchingTable.table_id}/`,
//             {
//               headers: {
//                 'Authorization': `Bearer ${token}`,
//               },
//             }
//           );
  
//           if (!configResponse.ok) {
//             throw new Error('Failed to fetch table configuration');
//           }
  
//           const configuration = await configResponse.json();
//           console.log("Fetched table configuration: ", configuration);
  
//           // Step 4: Apply the configuration
//           applyTableConfiguration(configuration);
  
//           // Update table configuration state
//           setTableConfiguration({
//             table_id: matchingTable.table_id,
//             name: tableName,
//           });
//         } else {
//           console.log("No matching table found for the given name.");
//           // Optional: Handle the case where no matching table exists
//           setTableConfiguration({ name: tableName });
//         }
  
//         setIsConfigurationFetched(true);
//         console.log("fetchTableConfiguration: Configuration fetched flag set to true");
//       } catch (error) {
//         console.error('Error fetching table configuration:', error);
//         setIsConfigurationFetched(true);
//       }
//     };
  
//     // New function to apply table configuration
//     const applyTableConfiguration = (configuration: any[]) => {
//       console.log("applyTableConfiguration: Called with configuration:", configuration);
//       // Process column visibility
//       const newColumnStates: Record<string, boolean> = {};
//       const newToggledOnColumns: string[] = [];
//       const newToggledOffColumns: string[] = [];
//       const newSortedColumns: { id: string; desc: boolean }[] = [];

//       // configuration.forEach(columnConfig => {
//       //   console.log("applying the filter to this: ", columnConfig.column_name)
//       //   const columnName = columnConfig.column_name;
        
//       //   // Set column visibility
//       //   newColumnStates[columnName] = columnConfig.is_visible;
        
//       //   // Track toggled columns
//       //   if (columnConfig.is_visible) {
//       //     console.log('the visible value is this: ', columnConfig)
//       //     newToggledOnColumns.push(columnName);
//       //   } else {
//       //     console.log('the invisible value is this: ', columnConfig)
//       //     newToggledOffColumns.push(columnName);
//       //   }
        
//       //   // Track sorting
//       //   if (columnConfig.sort_order) {
//       //     newSortedColumns.push({
//       //       id: columnName,
//       //       desc: columnConfig.sort_order === 'Descending'
//       //     });
//       //   }
//       // });

//       // Update states
//       // setColumnStates(newColumnStates);
//       // setToggledOnColumns(newToggledOnColumns);
//       // setToggledOffColumns(newToggledOffColumns);
//       // setSortedColumns(newSortedColumns);

//       // Update column order if specified
//       // const sortedColumns = configuration
//       //   .sort((a, b) => a.column_order - b.column_order)
//       //   .map(col => col.column_name);
      
//       // if (sortedColumns.length > 0) {
//       //   setColumnOrder(sortedColumns);
//       // }
//       // if (table) { // Check if the table instance is ready
//       //   console.log("applyTableConfiguration: Table instance is ready");
//       //   Object.keys(newColumnStates).forEach(columnId => {
//       //     const isVisible = newColumnStates[columnId];
//       //     const column = table.getColumn(columnId);
//       //     if (column) {
//       //       column.toggleVisibility(isVisible);
//       //       console.log(`applyTableConfiguration: Visibility toggled for column ${columnId}`);
//       //     } else{
//       //       console.warn(`applyTableConfiguration: Column ${columnId} not found in table instance`);
//       //     }
//       //   });
//       // } else {
//       //   console.warn("applyTableConfiguration: Table instance is not ready yet");
//       // }
//       console.log("applyTableConfiguration: Finished");
//     };


  
//     fetchTableConfiguration();
//   }, [tableName]);

//   // Trigger save when configuration changes
//   useEffect(() => {
//     if (isConfigurationFetched && 
//         (debouncedToggledOnColumns.length > 0 || 
//          debouncedToggledOffColumns.length > 0 || 
//          debouncedSortedColumns.length > 0)) {
//       saveTableConfiguration();
//     }
//   }, [
//     debouncedToggledOnColumns, 
//     debouncedToggledOffColumns, 
//     debouncedSortedColumns
//   ]);

