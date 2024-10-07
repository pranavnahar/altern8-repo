import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState, useEffect, ReactNode } from "react";
import { AnimatePresence, Reorder, motion } from "framer-motion";
import { PaginationButton } from "../global/PaginationButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
//import { ScrollArea } from "../../components/ui/scroll-area";
import { Checkbox } from "../../components/ui/checkbox";
//import { ScrollBar } from "../../components/ui/scroll-area";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { BasicTableProps, Column, DataRow } from "./types";
import { ScrollArea } from "../ui/scroll-area";

const snakeToTitleCase = (str: string) => {
  if (!str) return "";
  return str
    .split(/[_.]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const BasicTable: React.FC<BasicTableProps> = ({
  data,
  columns,
  filters,
  needFilters,
  alreadyAppliedFilter,
  hideTableSearch,
  pageSize,
}) => {
  const [filterButtonName, setFilterButtonName] = useState("Apply Filter");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize || 10,
  });
  const [columnStates, setColumnStates] = useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    (columns as Column[])
      .map((col) => col.id || col.accessorKey || col.header)
      .filter((col): col is string => col !== undefined)
  );
  const [showAllColumns, setShowAllColumns] = useState(false);

  useEffect(() => {
    const initialStates = Object.fromEntries(
      (columns as Column[]).map((column) => [
        column.id || column.accessorKey || column.header,
        true,
      ])
    );
    setColumnStates(initialStates);

    const initialOrder = (columns as Column[])
      .map((col) => col.id || col.accessorKey || col.header)
      .filter((col): col is string => col !== undefined);
    setColumnOrder(initialOrder);
  }, [columns]);

  const table = useReactTable<DataRow>({
    data,
    columns: columns.map((col) => ({
      ...col,
      id: col.id || col.accessorKey,
      header: col.header || snakeToTitleCase(col.accessorKey!),
      accessorFn: col.accessorKey
        ? (row: DataRow) => {
          const keys = col.accessorKey!.split(".");
          return keys.reduce((obj, key) => obj && obj[key], row);
        }
        : col.accessorFn,
    })) as ColumnDef<DataRow, string>[],
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

  return (
    <div>
      <div className="flex items-center justify-between w-full mb-10 bg-transparent">
        {!hideTableSearch && columns.length > 0 && (
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
              <SelectTrigger className="w-[180px] bg-[#1565c0] hover:bg-blue-800 font-medium  border-none">
                <SelectValue placeholder="Apply Filter" />
              </SelectTrigger>
              <SelectContent className="w-[180px] border-none bg-white/70 backdrop-blur-md">
                <SelectItem value="remove_filter" className="rounded-md">
                  Remove Filter
                </SelectItem>
                {filters.map((filter: string) => (
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

      {/* Column visibility toggles */}
      <AnimatePresence>
        <motion.div
          className="flex pb-16"
          initial={{ height: 0 }}
          animate={{
            height: showAllColumns ? "auto" : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="grid w-full grid-cols-3 tablet:grid-cols-4 lg:grid-cols-6 gap-x-5 gap-y-1">
            {table
              .getAllLeafColumns()
              .slice(0, showAllColumns ? undefined : 6)
              .map((column, index) => {
                const columnId = column.id;
                const displayName = column.columnDef.header;
                return (
                  <motion.li
                    key={index}
                    className="flex gap-2 py-1"
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
                      className="my-auto"
                    />
                    <p className="my-auto text-sm tracking-wide truncate text-neutral-200 text-nowrap">
                      {displayName as ReactNode}
                    </p>
                  </motion.li>
                );
              })}
          </div>
          {columns.length > 6 && (
            <div className="flex justify-end p-1 mb-auto ml-auto rounded-md card-cover">
              <button
                onClick={() => setShowAllColumns(!showAllColumns)}
                className={`text-white transform transition-transform duration-300 ${showAllColumns ? "rotate-180" : ""
                  }`}
              >
                <ChevronDown
                  className="text-gray-300 size-5"
                  strokeWidth={1.75}
                />
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="max-w-[calc(100vw-2rem)]">
        <ScrollArea className="w-[100%] whitespace-nowrap overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader className="overflow-hidden border-b-2 border-neutral-300/40">
              {table.getHeaderGroups().map((headerGroup) => (
                <Reorder.Group
                  axis="x"
                  values={columnOrder}
                  onReorder={setColumnOrder}
                  key={headerGroup.id}
                  as="tr"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <Reorder.Item
                        key={header.id}
                        value={header.column.id}
                        as="th"
                        className="px-3 py-4 text-xs tracking-wider uppercase align-top text-ellipsis select-none whitespace-nowrap text-neutral-300 bg-transparent backdrop-blur-lg"
                      >
                        <div
                          {...{
                            className: `flex gap-2 items-center text-sm font-semibold tracking-wider justify-center select-none ${header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : ""
                              }`,
                            onClick: header.column.getCanSort()
                              ? (header.column.getToggleSortingHandler() as React.MouseEventHandler<HTMLDivElement>)
                              : undefined,
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: (
                              <ChevronUp className="w-4 h-4 text-white/60" />
                            ),
                            desc: (
                              <ChevronDown className="w-4 h-4 text-white/60" />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </Reorder.Item>
                    );
                  })}
                </Reorder.Group>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="text-gray-300/80 hover:bg-[#c1b49a0d] hover:shadow-lg cursor-pointer transition-all duration-150"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="p-2 text-center align-middle"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        {/* <ScrollBar orientation="horizontal" /> */}
      </div>

      <div className="flex justify-between py-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <PaginationButton
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              aria-label="First page"
            >
              <ChevronsLeft className="w-5 h-5" />
            </PaginationButton>
            <PaginationButton
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </PaginationButton>
          </div>
          <span className="text-sm font-medium text-gray-300">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <div className="flex items-center gap-2">
            <PaginationButton
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </PaginationButton>
            <PaginationButton
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              aria-label="Last page"
            >
              <ChevronsRight className="w-5 h-5" />
            </PaginationButton>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-200">
          <span>Go to page:</span>
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="w-16 px-2 py-1 text-sm text-gray-800 border border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-200">
          <span>Show:</span>
          <Select
            onValueChange={(value: string) => {
              table.setPageSize(Number(value));
            }}
            value={`${table.getState().pagination.pageSize}`}
          >
            <SelectTrigger className="w-[70px] bg-[#1565c0] hover:bg-blue-800 font-medium border-none">
              <SelectValue
                placeholder={`${table.getState().pagination.pageSize}`}
              />
            </SelectTrigger>
            <SelectContent className="w-[70px] border-none bg-white/70 backdrop-blur-md">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem
                  key={pageSize}
                  value={`${pageSize}`}
                  className="rounded-md"
                >
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default BasicTable;
