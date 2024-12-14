'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

const toTitleCase = (str: string) => {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const columns: ColumnDef<any>[] = [
  {
    header: 'ID',
    accessorKey: 'id',
    cell: ({ getValue }) => {
      const value = getValue();
      return typeof value === 'number' ? value : '-';
    },
  },
  {
    header: 'Name',
    accessorKey: 'project_name',
    cell: ({ getValue }) => {
      const value = getValue();
      return typeof value === 'string' ? toTitleCase(value) : '-';
    },
  },
  {
    header: 'Location',
    accessorKey: 'location',
    cell: ({ getValue }) => {
      const value = getValue();
      return typeof value === 'string' ? toTitleCase(value) : '-';
    },
  },
  {
    header: 'Project State',
    accessorKey: 'project_state',
    cell: ({ getValue }) => {
      const value = getValue();
      return typeof value === 'string' ? toTitleCase(value) : '-';
    },
  },
  {
    header: 'Total',
    accessorKey: 'project_total',
    cell: ({ getValue }) => {
      const value = getValue();
      return typeof value === 'string' ? toTitleCase(value) : '-';
    },
  },
  {
    header: 'Approval Status',

    accessorKey: 'approved_by_admin', //maybe things can cahnge here as the same accessorKey renders same nae for both ststaus columsn
    cell: ({ row }) => {
      const isApproved = row.original.approved_by_admin;
      return isApproved ? <p>Approved</p> : <p>Pending</p>;
    },
  },
  {
    header: 'Accept',
    accessorKey: 'emudhra_esign_url', //maybe things can cahnge here as the same accessorKey renders same nae for both ststaus columsn
    cell: ({ row }) => {
      const status = row.original.project_state;
      const canBeAccepted = status === 'Approved' || status === 'Under Discussion' ? true : false;

      return (
        <div>
          {canBeAccepted ? (
            <Button
              className="cursor-pointer" //hit this and generate the esign url from the backend
              // onClick={() => handleAcceptButtonClick(info.row.original.id)}
            >
              Accept
            </Button>
          ) : (
            '-'
          )}
        </div>
      );
    },
  },
  {
    header: 'Agreement Sign Status',
    accessorKey: 'emudhra_esign_status', //TODO add status of document signed call api in the backedn to get status for current project
    cell: ({ row }) => {
      return 'Not available';
    },
  },
];

export default columns;

export const statusColors: Record<string, string> = {
  Register: '#fcca83',
  POC: '#fcca83',
  'Bank Details': '#fcca83',
  'Select PAN': '#fcca83',
  ITR: '#fcca83',
  PAN: '#fcca83',
  Entity: '#fcca83',
  'Bureau Report': '#fcca83',
  'Select GST': '#fcca83',
  GST: '#fcca83',
  'Select Project': '#fcca83',
  'Accounting Data': '#fcca83',
  Questions: '#fcca83',
  Ecommerce: '#fcca83',
  POS: '#fcca83',
  Youtube: '#fcca83',
  Udyam: '#fcca83',
  'Upload Contract': '#fcca83',
  'Pending for Maker': '#E74694',
  'Pending for Checker': '#E74694',
  Approved: '#16BDCA',
  Rejected: '#2D87BB',
};
