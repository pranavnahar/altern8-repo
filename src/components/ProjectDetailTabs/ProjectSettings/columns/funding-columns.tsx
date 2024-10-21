import React from 'react';
import { ColumnDef } from "@tanstack/react-table";

interface FundingSource {
  id: number;
  name: string;
  stakeholder_name: string;
  contact_number: string;
  organization: string;
  contributed_amount: string;
  total_amount: string;
  percentage: string;
  type: string;
  close_date: string;
  maturity_date: string;
  project: number;
  tranche: number;
}

const formatCurrency = (value: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(value));
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const fundingColumns: ColumnDef<FundingSource>[] = [
  {
    header: 'ID',
    accessorKey: 'id',
    cell: ({ getValue }) => getValue(),
  },
  {
    header: 'Name',
    accessorKey: 'name',
    cell: ({ getValue }) => getValue(),
  },
  {
    header: 'Stakeholder',
    accessorKey: 'stakeholder_name',
    cell: ({ getValue }) => getValue(),
  },
  {
    header: 'Contact',
    accessorKey: 'contact_number',
    cell: ({ getValue }) => getValue(),
  },
  {
    header: 'Organization',
    accessorKey: 'organization',
    cell: ({ getValue }) => getValue(),
  },
  {
    header: 'Contributed Amount',
    accessorKey: 'contributed_amount',
    cell: ({ getValue }) => formatCurrency(getValue() as string),
  },
  {
    header: 'Total Amount',
    accessorKey: 'total_amount',
    cell: ({ getValue }) => formatCurrency(getValue() as string),
  },
  {
    header: 'Percentage',
    accessorKey: 'percentage',
    cell: ({ getValue }) => `${parseFloat(getValue() as string).toFixed(2)}%`,
  },
  {
    header: 'Type',
    accessorKey: 'type',
    cell: ({ getValue }) => getValue(),
  },
  {
    header: 'Close Date',
    accessorKey: 'close_date',
    cell: ({ getValue }) => formatDate(getValue() as string),
  },
  {
    header: 'Maturity Date',
    accessorKey: 'maturity_date',
    cell: ({ getValue }) => formatDate(getValue() as string),
  },
  {
    header: 'Project ID',
    accessorKey: 'project',
    cell: ({ getValue }) => getValue(),
  },
  {
    header: 'Tranche',
    accessorKey: 'tranche',
    cell: ({ getValue }) => getValue(),
  },
];

export default fundingColumns;
