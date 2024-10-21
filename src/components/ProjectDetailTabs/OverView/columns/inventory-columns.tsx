"use client"

import { ColumnDef } from "@tanstack/react-table";

interface InventoryItem {
  id: number;
  lots: number;
  foundation_starts: number;
  models_count: number;
  started_completed: number;
  units: number;
  contingent_sales: number;
  project: number;
}

export const InventoryColumns: ColumnDef<InventoryItem>[] = [
  {
    header: 'ID',
    accessorKey: 'id',
    cell: ({ getValue }) => getValue() ?? '-',
  },
  {
    header: 'Lots',
    accessorKey: 'lots',
    cell: ({ getValue }) => getValue() ?? '-',
  },
  {
    header: 'Foundation Starts',
    accessorKey: 'foundation_starts',
    cell: ({ getValue }) => getValue() ?? '-',
  },
  {
    header: 'Models Count',
    accessorKey: 'models_count',
    cell: ({ getValue }) => getValue() ?? '-',

  },
  {
    header: 'Started/Completed',
    accessorKey: 'started_completed',
    cell: ({ getValue }) => getValue() ?? '-',
  },
  {
    header: 'Units',
    accessorKey: 'units',
    cell: ({ getValue }) => getValue() ?? '-',
  },
  {
    header: 'Contingent Sales',
    accessorKey: 'contingent_sales',
    cell: ({ getValue }) => getValue() ?? '-',
  },
  {
    header: 'Project ID',
    accessorKey: 'project',
    cell: ({ getValue }) => getValue() ?? '-',
  },
];
