import React from 'react';
import { ColumnDef } from "@tanstack/react-table";
import Link from 'next/link';
import { CheckCircle, X } from 'lucide-react';
import ApplyProduct from './_components/apply-product';
import RoutingButton from './_components/navigate-page-button';
import FundingSources from './_components/funding-sources';
import BudgetSummary from './_components/budget-summary';
import { formatDate, formatINR, formatPercentage, toTitleCase } from '@/utils/formatter';
import { Button } from '@/components/ui/button';

// {
//   request_for_approval_date: null,
//   legal_flow_user_choice: null,
//   legal_flow_state: null,
//   legal_flow_report_file: null,
//   legal_flow_documents: []
// }

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
    header: 'Project Name',
    accessorKey: 'project_name',
    cell: ({ getValue }) => {
      const value = getValue();
      return typeof value === 'string' ? toTitleCase(value) : "-";
    },
  },
  {
    header: 'Project State',
    accessorKey: 'project_state',
    cell: ({ getValue }) => {
      const value = getValue();
      return typeof value === 'string' ? toTitleCase(value) : "-";
    },
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
    header: 'RERA Registration Number',
    accessorKey: 'rera_reg_no',
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
    header: 'Project Completion Date',
    accessorKey: 'project_completion_date',
    cell: ({ getValue }) => {
      const date = getValue();
      return date && typeof date === "string" ? formatDate(date) : "-";
    },
  },
  {
    header: 'Request for Approval Date',
    accessorKey: 'request_for_approval_date',
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
    header: 'Request Approval Date',
    accessorKey: 'request_for_approval_date',
    cell: ({ getValue }) => {
      const date = getValue();
      return date && typeof date === "string" ? formatDate(date) : "-";
    },
  },
  {
    header: 'Inventory',
    accessorKey: 'inventory',
    cell: ({ row }) => {
      const projectId = row.original.id;
      return (
        <RoutingButton name={'View'} path={`/${projectId}/inventory`} />
      )
    },
  },
  {
    header: 'Funding Sources',
    accessorKey: 'funding_sources',
    cell: ({ row }) => {
      const projectId = row.original.id;
      return (
        <FundingSources projectId={projectId} />
      )
    },
  },
  {
    header: 'Summary',
    accessorKey: 'summary',
    cell: ({ row }) => {
      const projectId = row.original.id;
      return (
        <BudgetSummary projectId={projectId} />
      )
    },
  },
  {
    header: 'Budget',
    accessorKey: 'budget',
    cell: ({ row }) => {
      const projectId = row.original.id;
      return (
        <RoutingButton name={'View'} path={`/${projectId}/budget`} />
      )
    },
  },
  {
    header: 'Documents',
    accessorKey: 'documents',
    cell: ({ row }) => {
      const projectId = row.original.id;
      return (
        <RoutingButton name={'View'} path={`/${projectId}/documents`} />
      )
    },
  },
  {
    header: 'Timeline',
    accessorKey: 'timeline',
    cell: ({ row }) => {
      const projectId = row.original.id;
      return (
        <RoutingButton name={'View'} path={`/${projectId}/timeline`} />
      )
    },
  },
  {
    header: 'Vendor',
    accessorKey: 'vendor',
    cell: ({ row }) => {
      const projectId = row.original.id;
      return (
        <RoutingButton name={'View'} path={`/${projectId}/vendor`} />
      )
    },
  },
  {
    header: 'Tranches',
    accessorKey: 'tranches',
    cell: ({ row }) => {
      const projectId = row.original.id;
      return (
        <Link href={`/projects/${projectId}/tranches`}>View Tranches</Link>
      )
    },
  },

  {
    header: 'Approval status',
    accessorKey: 'is_verified_by_user',
    cell: ({ getValue }) => {
      const isApproved = getValue();
      return isApproved ? (
        <X size={20} />
        // <CheckCircle size={20} />
      ) : (
        <X size={20} />
      );
    },
  },
  {
    header: 'Actions',
    accessorKey: 'actions',
    cell: ({ row }) => {
      const projectId = row.original.id;
      const productId = row.original.product_id;
      return (
        <Link href={`/project-verification/${projectId}/`}>
          <Button size="sm" className="text-sm">
            Proceed to verify
          </Button>
        </Link>
      )
    },
  },

];

export default columns;
