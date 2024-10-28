import { ReactNode } from 'react';

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

export interface actionItemsTable {
  title: string;
  data: string[];
  columns: string[];
  onClose: () => void;
}

export interface actionItems {
  showActionItems: string;
  latePayments: string;
  upcomingPayments: string;
  showActionItemsTables: (s: string) => void;
}

export interface Projects {
  id: string;
  project_total: string;
  project_name: string;
  project_location: string;
  approved_by_admin: boolean;
}

interface Payment {
  id: string
  amount: string
  dueDate: string
  daysOverdue?: number
  daysUntilDue?: number
}

export type Props = {
  showActionItems: boolean
  latePayments: Payment[]
  upcomingPayments: Payment[]
  showActionItemsPath: string
}

export interface ActionItemData {
  label: string
  action: string
  data: Payment[]
  details: {
    title: string
    description: string
    columns: string[]
  }
}

export interface ActionItemDetails {
  title: string;
  description: string;
  columns: string[];
}

export interface ActionItemRow {
  [key: string]: string | number;
}


export interface ActionItems {
  showActionItems: boolean;
  latePayments: ActionItemRow[];
  upcomingPayments: ActionItemRow[];
  showActionItemsTables: (action: string) => void;
}
