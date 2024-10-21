import React from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, X } from 'lucide-react';


const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const taskColumns: ColumnDef<any>[] = [
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
    header: 'Close Date',
    accessorKey: 'close_date',
    cell: ({ getValue }) => formatDate(getValue() as string),
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

export default taskColumns;
