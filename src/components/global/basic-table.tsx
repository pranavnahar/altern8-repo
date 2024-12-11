// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
//   ColumnDef,
//   SortingState,
//   PaginationState,
//   Row,
// } from "@tanstack/react-table";
// import { useState, useEffect, useMemo } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../components/ui/select";
// import { AnimatePresence, Reorder, motion } from "framer-motion";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHeader,
//   TableRow,
// } from "../ui/table";
// import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";
// import {
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
//   ChevronUp,
// } from "lucide-react";
// import { Checkbox } from "../../components/ui/checkbox";
// import useMediaQuery from "../../hooks/use-media-query";
// import { Skeleton } from "../ui/skeleton";
// import { Button } from "../ui/button";

// type CustomColumnDef<T extends object> = ColumnDef<T> & {
//   accessorKey?: keyof T | string;
// };

// type BasicTableProps<T extends object> = {
//   data: T[];
//   columns: CustomColumnDef<T>[];
//   filters: string[];
//   needFilters: boolean;
//   alreadyAppliedFilter?: string;
//   hideTableSearch?: boolean;
// };

// const snakeToTitleCase = (str: string): string => {
//   if (!str) return "";
//   return str
//     .split(/[_.]/)
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ");
// };

// const BasicTable = <T extends object>({
//   data,
//   columns,
//   filters,
//   needFilters,
//   alreadyAppliedFilter,
//   hideTableSearch,
// }: BasicTableProps<T>) => {
//   const [filterButtonName, setFilterButtonName] =
//     useState<string>("Apply Filter");
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [filtering, setFiltering] = useState<string>("");
//   const [pagination, setPagination] = useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 8,
//   });
//   const [columnStates, setColumnStates] = useState<Record<string, boolean>>({});
//   const [columnOrder, setColumnOrder] = useState<string[]>(() =>
//     columns.map(
//       (col) =>
//         col.id?.toString() ||
//         col.accessorKey?.toString() ||
//         col.header?.toString() ||
//         ""
//     )
//   );
//   const [showAllColumns, setShowAllColumns] = useState<boolean>(false);

//   const isXs = useMediaQuery("(min-width: 480px)");
//   const isS = useMediaQuery("(min-width: 624px)");
//   const isSm = useMediaQuery("(min-width: 768px)");
//   const isTablet = useMediaQuery("(min-width: 914px)");
//   const isMd = useMediaQuery("(min-width: 1060px)");
//   const isLg = useMediaQuery("(min-width: 1200px)");
//   const isXl = useMediaQuery("(min-width: 1700px)");

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
//       columns.map((column) => [
//         column.id?.toString() ||
//         column.accessorKey?.toString() ||
//         column.header?.toString(),
//         true,
//       ])
//     );
//     setColumnStates(initialStates);

//     const initialOrder = columns.map(
//       (col) =>
//         col.id?.toString() ||
//         col.accessorKey?.toString() ||
//         col.header?.toString() ||
//         ""
//     );
//     setColumnOrder(initialOrder);
//   }, [columns]);

//   const mappedColumns = columns
//     .map((col) => {
//       const id = col.id?.toString() || col.accessorKey?.toString() || "";
//       const header =
//         col.header || snakeToTitleCase(col.accessorKey?.toString() || "");
//       const accessorFn = col.accessorKey
//         ? (row: T) => {
//           const keys = (col.accessorKey as string).split(".");
//           return keys.reduce((obj: any, key: string) => obj && obj[key], row);
//         }
//         : undefined;

//       return {
//         ...col,
//         id,
//         header,
//         accessorFn,
//       };
//     })
//     .filter((col) => col.id);

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
//     onSortingChange: setSorting,
//     onGlobalFilterChange: setFiltering,
//     onPaginationChange: setPagination,
//     onColumnVisibilityChange: setColumnStates,
//     onColumnOrderChange: setColumnOrder,
//   });

//   const handleFilterClick = (value: string) => {
//     if (value === "remove_filter") {
//       setFiltering("");
//       setFilterButtonName("Apply Filter");
//     } else {
//       setFiltering(value);
//       setFilterButtonName(value);
//     }
//   };

//   useEffect(() => {
//     if (alreadyAppliedFilter) {
//       handleFilterClick(alreadyAppliedFilter);
//     }
//   }, [alreadyAppliedFilter]);

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

//   if (data.length === 0) {
//     return (
//       <h1>Looks empty.</h1>
//     );
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between w-auto">
//         {!hideTableSearch && (
//           <div className="py-1 my-2">
//             <input
//               onChange={(e) => setFiltering(e.target.value)}
//               value={filtering}
//               placeholder="Search"
//               className="py-1 text-gray-200 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
//               type="text"
//             />
//           </div>
//         )}

//         {needFilters && (
//           <div className="py-1 my-2">
//             <Select
//               onValueChange={handleFilterClick}
//               value={
//                 filterButtonName === "Apply Filter"
//                   ? "remove_filter"
//                   : filterButtonName
//               }
//             >
//               <SelectTrigger className="w-[180px] bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 border-2 border-zinc-200/70 font-medium text-white">
//                 <SelectValue placeholder="Apply Filter" />
//               </SelectTrigger>
//               <SelectContent className="w-[180px] border-none bg-white/70 backdrop-blur-md">
//                 <SelectItem value="remove_filter" className="rounded-md">
//                   Remove Filter
//                 </SelectItem>
//                 {filters.map((filter) => (
//                   <SelectItem
//                     key={filter}
//                     value={filter}
//                     className="rounded-md"
//                   >
//                     {filter}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         )}
//       </div>

//       <AnimatePresence>
//         <motion.div
//           className="flex pt-8"
//           initial={{ height: 0 }}
//           animate={{
//             height: showAllColumns ? "auto" : 0,
//           }}
//           transition={{ duration: 0.3, ease: "easeInOut" }}
//         >
//           <div className="grid w-full tablet:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-y-3 gap-x-5">
//             {table
//               .getAllLeafColumns()
//               .slice(0, showAllColumns ? undefined : initialColumnCount)
//               .map((column, index) => {
//                 const columnId = column.id?.toString();
//                 const displayName = column.columnDef.header as string;
//                 return (
//                   <motion.li
//                     key={index}
//                     className="flex gap-3 py-1"
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: "auto" }}
//                     exit={{ opacity: 0, height: 0 }}
//                     transition={{ duration: 0.2, delay: index * 0.05 }}
//                   >
//                     <Checkbox
//                       checked={column.getIsVisible()}
//                       onCheckedChange={(checked) =>
//                         column.toggleVisibility(!!checked)
//                       }
//                       id={columnId}
//                       className="my-auto rounded-md border-primary/30 size-5"
//                     />
//                     <p className="my-auto text-sm tracking-wide truncate text-neutral-200 w-auto">
//                       {displayName}
//                     </p>
//                   </motion.li>
//                 );
//               })}
//           </div>
//           {showExpandButton && (
//             <div className="flex justify-end p-1 mb-auto ml-auto rounded-md card-cover">
//               <button
//                 onClick={() => setShowAllColumns(!showAllColumns)}
//                 className={`text-white transform transition-transform duration-300 ${showAllColumns ? "rotate-180" : ""
//                   }`}
//               >
//                 <ChevronDown className="size-5" />
//               </button>
//             </div>
//           )}
//         </motion.div>
//       </AnimatePresence>

//       <div className="max-w-[calc(100vw-2rem)] pt-16">
//         <ScrollArea type="auto" className="w-[100%] whitespace-nowrap">
//           <Table className="min-w-full">
//             <TableHeader className="overflow-hidden border-b-2 border-neutral-300/40">
//               {table.getHeaderGroups().map((headerGroup, index) => (
//                 <Reorder.Group
//                   key={index}
//                   as="tr"
//                   axis="x"
//                   values={columnOrder}
//                   onReorder={setColumnOrder}
//                   className="h-12"
//                 >
//                   {columnOrder.map((columnId, index) => {
//                     const header = headerGroup.headers.find(
//                       (h) => h.id === columnId
//                     );
//                     if (!header || header.isPlaceholder) return null;
//                     return (
//                       <Reorder.Item
//                         key={index}
//                         as="th"
//                         value={columnId}
//                         className="whitespace-nowrap pr-5 pl-3.5 font-normal text-sm text-zinc-300/80 rounded-lg"
//                         onClick={header.column.getToggleSortingHandler()}
//                         style={{ cursor: "grab" }}
//                         whileDrag={{
//                           cursor: "grabbing",
//                         }}
//                       >
//                         <div className="flex mr-5 cursor-pointer w-36">
//                           <h1 className="my-auto">
//                             {flexRender(
//                               header.column.columnDef.header,
//                               header.getContext()
//                             )}
//                           </h1>
//                           {header.column.getIsSorted() && (
//                             <ChevronUp
//                               className={`size-5 my-auto mx-2 ${header.column.getIsSorted() === "asc"
//                                 ? "rotate-asc"
//                                 : "rotate-desc"
//                                 }`}
//                             />
//                           )}
//                         </div>
//                       </Reorder.Item>
//                     );
//                   })}
//                 </Reorder.Group>
//               ))}
//             </TableHeader>
//             <TableBody>
//               {table.getRowModel().rows.map((row: Row<T>, index) => (
//                 <TableRow
//                   key={index}
//                   data-state={row.getIsSelected() ? "selected" : undefined}
//                 >
//                   {columnOrder.map((columnId, index) => {
//                     const cell = row
//                       .getVisibleCells()
//                       .find((c) => c.column.id === columnId);
//                     return cell ? (
//                       <TableCell
//                         key={index}
//                         className="text-sm font-normal text-white"
//                       >
//                         {flexRender(
//                           cell.column.columnDef.cell,
//                           cell.getContext()
//                         )}
//                       </TableCell>
//                     ) : null;
//                   })}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//           <ScrollBar orientation="horizontal" />
//         </ScrollArea>
//       </div>

//       <div className="flex justify-between p-2 my-4">
//         <div className="flex items-center gap-2">
//           <div className="w-[70px] border-primary/30">
//             <Select
//               onValueChange={(value) =>
//                 setPagination((old) => ({ ...old, pageSize: Number(value) }))
//               }
//               value={pagination.pageSize.toString()}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Per Page" />
//               </SelectTrigger>
//               <SelectContent className="w-[70px] bg-white/50 border-none backdrop-blur-md">
//                 {[5, 8, 12, 15, 20, 25, 50].map((pageSize) => (
//                   <SelectItem
//                     className="rounded-md cursor-pointer"
//                     key={pageSize}
//                     value={pageSize.toString()}
//                   >
//                     {pageSize}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <p className="text-sm font-medium text-neutral-400">Rows per page</p>
//         </div>

//         <div className="flex items-center gap-2 my-1">
//           <Button
//             onClick={() => table.setPageIndex(0)}
//             size="sm"
//             disabled={!table.getCanPreviousPage()}
//           >
//             <ChevronsLeft className="size-4" />
//           </Button>
//           <Button
//             onClick={() => table.previousPage()}
//             size="sm"
//             disabled={!table.getCanPreviousPage()}
//           >
//             <ChevronLeft className="size-4" />
//           </Button>
//           <span className="text-sm font-medium text-white">
//             Page <span>{table.getState().pagination.pageIndex + 1}</span> of{" "}
//             {table.getPageCount()}
//           </span>
//           <Button
//             onClick={() => table.nextPage()}
//             size="sm"
//             disabled={!table.getCanNextPage()}
//           >
//             <ChevronRight className="size-4" />
//           </Button>
//           <Button
//             onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//             size="sm"
//             disabled={!table.getCanNextPage()}
//           >
//             <ChevronsRight className="size-4" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BasicTable;

"use client";

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
} from "@tanstack/react-table";
import { useState, useEffect, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatePresence, Reorder, motion, useDragControls } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconChevronUp,
} from "@tabler/icons-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import useMediaQuery from "@/hooks/use-media-query";

type CustomColumnDef<T extends object> = ColumnDef<T> & {
  accessorKey?: keyof T | string;
};

type BasicTableProps<T extends object> = {
  data: T[];
  columns: CustomColumnDef<T>[];
  filters: string[];
  needFilters: boolean;
  alreadyAppliedFilter?: string;
  hideTableSearch?: boolean;
};

const snakeToTitleCase = (str: string): string => {
  if (!str) return "";
  return str
    .split(/[_.]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const BasicTable = <T extends object>({
  data,
  columns,
  filters,
  needFilters,
  alreadyAppliedFilter,
  hideTableSearch,
}: BasicTableProps<T>) => {
  const [filterButtonName, setFilterButtonName] =
    useState<string>("Apply Filter");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });
  const [columnStates, setColumnStates] = useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    columns.map(
      (col) =>
        col.id?.toString() ||
        col.accessorKey?.toString() ||
        col.header?.toString() ||
        ""
    )
  );
  const [showAllColumns, setShowAllColumns] = useState<boolean>(false);
  const dragControls = useDragControls();

  const isXs = useMediaQuery("(min-width: 480px)");
  const isS = useMediaQuery("(min-width: 624px)");
  const isSm = useMediaQuery("(min-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 914px)");
  const isMd = useMediaQuery("(min-width: 1060px)");
  const isLg = useMediaQuery("(min-width: 1200px)");
  const isXl = useMediaQuery("(min-width: 1700px)");

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
      columns.map((column) => [
        column.id?.toString() ||
        column.accessorKey?.toString() ||
        column.header?.toString(),
        true,
      ])
    );
    setColumnStates(initialStates);

    const initialOrder = columns.map(
      (col) =>
        col.id?.toString() ||
        col.accessorKey?.toString() ||
        col.header?.toString() ||
        ""
    );
    setColumnOrder(initialOrder);
  }, [columns]);

  const mappedColumns = columns
    .map((col) => {
      const id = col.id?.toString() || col.accessorKey?.toString() || "";
      const header =
        col.header || snakeToTitleCase(col.accessorKey?.toString() || "");
      const accessorFn = col.accessorKey
        ? (row: T) => {
          const keys = (col.accessorKey as string).split(".");
          return keys.reduce((obj: any, key: string) => obj && obj[key], row);
        }
        : undefined;

      return {
        ...col,
        id,
        header,
        accessorFn,
      };
    })
    .filter((col) => col.id);

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
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnStates,
    onColumnOrderChange: setColumnOrder,
  });

  const handleFilterClick = (value: string) => {
    if (value === "remove_filter") {
      setFiltering("");
      setFilterButtonName("Apply Filter");
    } else {
      setFiltering(value);
      setFilterButtonName(value);
    }
  };

  useEffect(() => {
    if (alreadyAppliedFilter) {
      handleFilterClick(alreadyAppliedFilter);
    }
  }, [alreadyAppliedFilter]);

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

  return (
    <div className="w-full overflow-auto">
      <div className="flex items-center justify-between w-auto">
        {!hideTableSearch && (
          <div className="py-1 my-2">
            <input
              onChange={(e) => setFiltering(e.target.value)}
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
              value={
                filterButtonName === "Apply Filter"
                  ? "remove_filter"
                  : filterButtonName
              }
            >
              <SelectTrigger className="w-[180px] bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 border-2 border-zinc-200/70 font-medium text-white">
                <SelectValue placeholder="Apply Filter" />
              </SelectTrigger>
              <SelectContent className="w-[180px] border-none bg-white/70 backdrop-blur-md">
                <SelectItem value="remove_filter" className="rounded-md">
                  Remove Filter
                </SelectItem>
                {filters.map((filter) => (
                  <SelectItem
                    key={filter}
                    value={filter}
                    className="rounded-md"
                  >
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
            height: showAllColumns ? "auto" : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
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
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Checkbox
                      checked={column.getIsVisible()}
                      onCheckedChange={(checked) =>
                        column.toggleVisibility(!!checked)
                      }
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
                className={`text-white transform transition-transform duration-300 ${showAllColumns ? "rotate-180" : ""
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
                    {columnOrder.map((columnId) => {
                      const header = headerGroup.headers.find(
                        (h) => h.id === columnId
                      );
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
                            onClick={(e) => {
                              if (!isDragging) {
                                header.column.getToggleSortingHandler()?.(e);
                              }
                            }}
                          >
                            <h1 className="my-auto">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </h1>
                            {header.column.getIsSorted() && (
                              <IconChevronUp
                                className={`size-5 my-auto mx-2 ${
                                  header.column.getIsSorted() === "asc"
                                    ? "rotate-asc"
                                    : "rotate-desc"
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
                <TableRow
                  key={index}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {columnOrder.map((columnId, index) => {
                    const cell = row
                      .getVisibleCells()
                      .find((c) => c.column.id === columnId);
                    return cell ? (
                      <TableCell
                        key={index}
                        className="text-sm font-normal text-white"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
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
              onValueChange={(value) =>
                setPagination((old) => ({ ...old, pageSize: Number(value) }))
              }
              value={pagination.pageSize.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Per Page" />
              </SelectTrigger>
              <SelectContent className="w-[70px] bg-white/50 border-none backdrop-blur-md">
                {[5, 8, 12, 15, 20, 25, 50].map((pageSize) => (
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
            Page <span>{table.getState().pagination.pageIndex + 1}</span> of{" "}
            {table.getPageCount()}
          </span>
          <Button
            onClick={() => table.nextPage()}
            size="sm"
            disabled={!table.getCanNextPage()}
          >
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