import React from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, X } from 'lucide-react';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return new Intl.DateTimeFormat('en-GB', options).format(date);
};

const formatINR = (value: string | number) => {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(value);
};

const formatPercentage = (value: string | number) => {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  return `${value}%`;
};

const tranchColumns: ColumnDef<any>[] = [
  {
    header: 'ID',
    accessorKey: 'id',
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    header: 'Tranche Name',
    accessorKey: 'tranche_name',
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    header: 'Tranche Number',
    accessorKey: 'tranche_number',
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    header: 'Submission Date',
    accessorKey: 'submission_date',
    cell: ({ getValue }) => {
      const date = getValue();
      return date && typeof date === "string" ? formatDate(date) : "-";
    },
  },
  {
    header: 'Tranche Total',
    accessorKey: 'tranche_total',
    cell: ({ getValue }) => {
      const total = getValue();
      return total && typeof total === "string" ? formatINR(total) : "-";
    },
  },
  {
    header: 'Funded On',
    accessorKey: 'funded_on',
    cell: ({ getValue }) => {
      const date = getValue();
      return date && typeof date === "string" ? formatDate(date) : "-";
    },
  },
  {
    header: 'Tranche End Date',
    accessorKey: 'tranche_end_date',
    cell: ({ getValue }) => {
      const date = getValue();
      return date && typeof date === "string" ? formatDate(date) : "-";
    },
  },
  {
    header: 'Voucher Discount',
    accessorKey: 'voucher_discount',
    cell: ({ getValue }) => {
      const percentage = getValue();
      return percentage && typeof percentage === "string" ? formatPercentage(percentage) : "-";
    },
  },
  {
    header: 'Approved by Admin',
    accessorKey: 'approved_by_admin',
    cell: ({ getValue }) => {
      const isApproved = getValue();
      return isApproved ? (
        <CheckCircle size={20} />
      ) : (
        <X size={20} />
      );
    },
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    header: 'Project',
    accessorKey: 'project',
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    header: 'Product',
    accessorKey: 'product',
    cell: ({ getValue }) => getValue() ?? "-",
  },
];

export default tranchColumns;
