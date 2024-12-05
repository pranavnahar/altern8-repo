"use client"

import React from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TrancheRules from './_components/tranche-rules';
import TrancheBudget from './_components/tranche-budget';
import TrancheTasks from './_components/tranche-tasks';

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

export const trancheColumns: ColumnDef<any>[] = [
  {
    header: 'Tranche Number',
    accessorKey: 'tranche_number',
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    header: 'Project',
    accessorKey: 'project',
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    header: 'Tranche Rules',
    accessorKey: 'tracnche_rules',
    cell: ({ getValue, row }) => {
      const projectId = row.original.project;
      const trancheId = row.original.tranche_number
      return (
        <TrancheRules projectId={projectId} trancheId={trancheId} />
      );
    },
  },
  {
    header: 'Tranche Status',
    accessorKey: 'tranche_state',
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    header: 'Line of Credit',
    accessorKey: 'tranche_total',
    cell: ({ getValue }) => {
      const total = getValue();
      return total && typeof total === "string" ? formatINR(total) : "-";
    },
  },
  {
    header: 'Start Date',
    accessorKey: 'funded_on',
    cell: ({ getValue }) => {
      const date = getValue();
      return date && typeof date === "string" ? formatDate(date) : "-";
    },
  },
  {
    header: 'Submission Date',
    accessorKey: 'tranche_end_date',
    cell: ({ getValue }) => {
      const date = getValue();
      return date && typeof date === "string" ? formatDate(date) : "-";
    },
  },
  {
    header: 'Budget',
    accessorKey: 'budget',
    cell: ({ row }) => {
      const projectId = row.original.project;
      const trancheId = row.original.tranche_number
      return (
        <TrancheBudget projectId={projectId} trancheId={trancheId} />
      );
    },
  },
  {
    header: 'Timeline',
    accessorKey: 'timeline',
    cell: ({ row }) => {
      const projectId = row.original.project;
      const trancheId = row.original.tranche_number
      return (
        <TrancheTasks projectId={projectId} trancheId={trancheId} />
      );
    },
  },
  {
    header: 'Additional Documents',
    accessorKey: 'additional_documents',
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    header: 'Actions',
    accessorKey: 'actions',
    cell: ({ row }) => {
      return (
        <Button size="xs" className='text-xs'>Complete</Button>
      )
    },
  },
  {
    header: 'Product Details',
    accessorKey: 'product_details',
    cell: ({ row }) => {
      const projectId = row.original.id;
      const productId = row.original.product_id;
      return (
        <Button size="xs" className='text-xs'>Product Details</Button>
      )
    },
  },
  {
    header: 'E-Mudhra Action',
    accessorKey: 'emudhra_action',
    cell: ({ row }) => {
      const projectId = row.original.id;
      const productId = row.original.product_id;
      return (
        <Button size="xs" className='text-xs'>Start</Button>
      )
    },
  },
  {
    header: 'Approved Status',
    accessorKey: 'approved_by_admin',
    cell: ({ getValue }) => {
      const isApproved = getValue();
      return isApproved ? (
        <CheckCircle size={20} />
      ) : (
        <X size={20} />
      );
    },
  }
];

export default trancheColumns;
