import { ReactNode } from "react";

export interface Column {
  id?: string;
  header?: string;
  accessorKey?: string;
  accessorFn?: (row: string) => string;
  cell?: (info: string) => ReactNode;
  nowrap?: boolean;
}

export interface BasicTableProps {
  data: DataRow[];
  columns: Column[];
  filters: string[];
  needFilters?: boolean;
  alreadyAppliedFilter?: string;
  hideTableSearch?: boolean;
  pageSize?: number;
}

export interface DataRow {
  [key: string]: DataRow;
}
