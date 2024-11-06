import React from 'react';
import { ColumnDef } from "@tanstack/react-table";
import Link from 'next/link';
import ApplyProduct from './components/apply-product';
import { IconCheck, IconX } from '@tabler/icons-react';

const toTitleCase = (str: string) => {
  return str.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return new Intl.DateTimeFormat('en-GB', options).format(date).replace(/(\d+)(st|nd|rd|th)/, '$1<sup>$2</sup>');
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

export const columns: ColumnDef<any>[] = [
  {
    header: 'Project ID',
    accessorKey: 'id',
    cell: ({ getValue, row }) => {
      const userId = row.original.id;
      const userValue = getValue() as string;
      return (
        <Link href={`/project/${userId}?current_tab=Overview`}>
          <h1 className='underline underline-offset-2'>{userValue}</h1>
        </Link>
      );
    },
  },
  {
    header: 'Borrower ID',
    accessorKey: 'user',
    cell: ({ getValue, row }) => {
      const userId = row.original.user;
      const userValue = getValue() as string;
      return (
        <Link href={`/borrowers/${userId}`}>
          <h1 className='underline underline-offset-2'>{userValue}</h1>
        </Link>
      );
    },
  },
  {
    header: 'Project Name',
    accessorKey: 'project_name',
    cell: ({ getValue }) => {
      const value = getValue();
      return typeof value === 'string' ? toTitleCase(value) : "-";
    },
  },
  {
    header: 'Project Status',
    accessorKey: 'current_project_status',
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    header: 'Project Type',
    accessorKey: 'project_type',
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    header: 'Location',
    accessorKey: 'location',
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    header: 'Pin Code',
    accessorKey: 'pin_code',
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    header: 'RERA Registration Number',
    accessorKey: 'rera_regd_no',
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    header: 'Start Date',
    accessorKey: 'start_date',
    cell: ({ getValue }) => {
      const date = getValue();
      return date && typeof date === "string" ? formatDate(date) : "-";
    },
  },
  {
    header: 'Current Tranche Name',
    accessorKey: 'current_tranche_name',
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    header: 'Current Tranche Status',
    accessorKey: 'current_tranche_status',
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    header: 'Line of Credit',
    accessorKey: 'line_of_credit',
    cell: ({ getValue }) => {
      const total = getValue();
      return total && typeof total === "string" ? formatINR(total) : "-";
    },
  },
  {
    header: 'Line of Credit Used',
    accessorKey: 'line_of_credit_used',
    cell: ({ getValue }) => {
      const total = getValue();
      return total && typeof total === "string" ? formatINR(total) : "-";
    },
  },
  {
    header: 'Line of Credit Available',
    accessorKey: 'line_of_credit_available',
    cell: ({ getValue }) => {
      const total = getValue();
      return total && typeof total === "string" ? formatINR(total) : "-";
    },
  },
  {
    header: 'Equity Commitment',
    accessorKey: 'equity_commitment',
    cell: ({ getValue }) => {
      const total = getValue();
      return total && typeof total === "string" ? formatINR(total) : "-";
    },
  },
  {
    header: 'Debt Commitment',
    accessorKey: 'debt_commitment',
    cell: ({ getValue }) => {
      const total = getValue();
      return total && typeof total === "string" ? formatINR(total) : "-";
    },
  },
  {
    header: 'Other Commitment',
    accessorKey: 'other_commitment',
    cell: ({ getValue }) => {
      const total = getValue();
      return total && typeof total === "string" ? formatINR(total) : "-";
    },
  },
  {
    header: 'Project Total',
    accessorKey: 'project_total',
    cell: ({ getValue }) => {
      const total = getValue();
      return total && typeof total === "string" ? formatINR(total) : "-";
    },
  },
  {
    header: 'Percentage Complete Net',
    accessorKey: 'percentage_complete_net',
    cell: ({ getValue }) => {
      const percentage = getValue();
      return percentage && typeof percentage === "string" ? formatPercentage(percentage) : "-";
    },
  },
  {
    header: 'Application Date',
    accessorKey: 'application_date',
    cell: ({ getValue }) => {
      const date = getValue();
      return date && typeof date === "string" ? formatDate(date) : "-";
    },
  },
  {
    header: 'Project Completion Date',
    accessorKey: 'project_completion_date',
    cell: ({ getValue }) => {
      const date = getValue();
      return date && typeof date === "string" ? formatDate(date) : "-";
    },
  },
  {
    header: 'Last Tranche Date',
    accessorKey: 'last_tranche_date',
    cell: ({ getValue }) => {
      const date = getValue();
      return date && typeof date === "string" ? formatDate(date) : "-";
    },
  },
  {
    header: 'Approved Status',
    accessorKey: 'approved_by_admin',
    cell: ({ getValue }) => {
      const isApproved = getValue();
      return isApproved ? (
        <IconCheck size={20} />
      ) : (
        <IconX size={20} />
      );
    },
  },
  {
    header: 'Agreement Signing status',
    accessorKey: 'esign_status',
    cell: ({ row }) => {
      const esignStatus = row.original.esign_status;
      
      return esignStatus && esignStatus !== 'not started' ? (
        <Link 
          href={esignStatus}
          target="_blank"
          rel="noopener noreferrer" 
          className="text-blue-500 underline"
        >
          Sign Document
        </Link>
      ) : (
        <span>No Actions Needed</span>
      );
    },
  }
];

export default columns;
