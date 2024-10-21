import React from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, X, Clock, AlertCircle } from 'lucide-react';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return new Intl.DateTimeFormat('en-GB', options).format(date);
};

const taskColumns: ColumnDef<any>[] = [
  {
    header: 'ID',
    accessorKey: 'id',
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    header: 'Task Name',
    accessorKey: 'name',
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    header: 'Start Date',
    accessorKey: 'startDate',
    cell: ({ getValue }) => {
      const date = getValue();
      return date && typeof date === "string" ? formatDate(date) : "-";
    },
  },
  {
    header: 'End Date',
    accessorKey: 'endDate',
    cell: ({ getValue }) => {
      const date = getValue();
      return date && typeof date === "string" ? formatDate(date) : "-";
    },
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ getValue }) => {
      const status = getValue();
      switch (status) {
        case 'Completed':
          return <div className="flex items-center"><CheckCircle size={20} className="text-green-500 mr-2" /> Completed</div>;
        case 'In Progress':
          return <div className="flex items-center"><Clock size={20} className="text-yellow-500 mr-2" /> In Progress</div>;
        case 'Not Started':
          return <div className="flex items-center"><AlertCircle size={20} className="text-red-500 mr-2" /> Not Started</div>;
        default:
          return status ?? "-";
      }
    },
  },
  {
    header: 'Owner',
    accessorKey: 'owner',
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    header: 'Duration (Days)',
    accessorKey: 'duration',
    cell: ({ row }) => {
      const startDate = new Date(row.original.startDate);
      const endDate = new Date(row.original.endDate);
      const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
      return duration.toString();
    },
  },
];

export default taskColumns;
