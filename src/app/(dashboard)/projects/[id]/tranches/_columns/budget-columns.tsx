"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Budget } from "../types";
import { formatINR } from "@/utils/formatter";
import BudgetSheet from "../_components/budget-sheet";

const formatCurrency = (value: string) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(parseFloat(value));
};

const budgetColumns: ColumnDef<Budget>[] = [
  {
    header: "Id",
    accessorKey: "id",
    cell: ({ getValue }) => getValue() ?? "-",
    enableHiding: true,
  },
  {
    header: "Project",
    accessorKey: "project",
    cell: ({ getValue }) => getValue() ?? "-",
    enableHiding: true,
  },
  {
    header: "Tranche",
    accessorKey: "tranche",
    cell: ({ getValue }) => getValue() ?? "-",
    enableHiding: true,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    accessorKey: "original_budget",
    header: "Original Budget",
    cell: ({ getValue }) => {
      const total = getValue();
      return total && typeof total === "string" ? formatINR(total) : "-";
    },
  },
  {
    accessorKey: "adjustments",
    header: "Adjustments",
    cell: ({ getValue }) => {
      const total = getValue();
      return total && typeof total === "string" ? formatINR(total) : "-";
    },
  },
  {
    accessorKey: "current_budget",
    header: "Current Budget",
    cell: ({ getValue }) => {
      const total = getValue();
      return total && typeof total === "string" ? formatINR(total) : "-";
    },
  },
  {
    accessorKey: "amount_requested",
    header: "Amount Requested",
    cell: ({ getValue }) => {
      const total = getValue();
      return total && typeof total === "string" ? formatINR(total) : "-";
    },
  },
  {
    accessorKey: "amount_used",
    header: "Amount Used",
    cell: ({ getValue }) => {
      const total = getValue();
      return total && typeof total === "string" ? formatINR(total) : "-";
    },
  },
  {
    accessorKey: "balance_to_fund",
    header: "Balance to Fund",
    cell: ({ getValue }) => {
      const total = getValue();
      return total && typeof total === "string" ? formatINR(total) : "-";
    },
  },
  {
    accessorKey: "percentage_remaining",
    header: "Percentage Remaining",
    cell: ({ getValue }) => {
      const value = getValue();
      return value ? `${value}%` : "-";
    },
  },
  {
    accessorKey: "line_items",
    header: "Line Items",
    cell: ({ getValue }) => getValue() ?? "-",
  },
];

export default budgetColumns
