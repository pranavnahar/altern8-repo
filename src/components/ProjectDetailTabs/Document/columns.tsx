import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';

const toTitleCase = (str: string) => {
  return str
    .split('_')
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
  return new Intl.DateTimeFormat('en-GB', options)
    .format(date)
    .replace(/(\d+)(st|nd|rd|th)/, '$1<sup>$2</sup>');
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
    header: 'Document ID',
    accessorKey: 'id',
    cell: ({ getValue }) => getValue() ?? '-',
  },
  {
    header: 'Project Id',
    accessorKey: 'project',
    cell: ({ getValue }) => getValue() ?? '-',
  },
  {
    header: 'File',
    accessorKey: 'file',
    cell: ({ getValue, row }) => {
      const value = getValue();
      const fileName = typeof value === 'string' ? toTitleCase(value) : '-';
      const fileUrl = row.original.file;

      const handleDownload = () => {
        if (fileUrl) {
          const link = document.createElement('a');
          link.href = fileUrl;
          link.target = '_blank';
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          console.error('File URL not available');
        }
      };

      return (
        <div className="flex items-center space-x-2">
          {fileUrl && (
            <Button onClick={handleDownload} size="xs" className="text-xs">
              Download
            </Button>
          )}
        </div>
      );
    },
  },
  {
    header: 'Tranch',
    accessorKey: 'tranch',
    cell: ({ getValue }) => getValue() ?? '-',
  },
  {
    header: 'Pin Code',
    accessorKey: 'pin_code',
    cell: ({ getValue }) => getValue() ?? '-',
  },
  {
    header: 'Uploaded At',
    accessorKey: 'uploaded_at',
    cell: ({ getValue }) => {
      const date = getValue();
      return date && typeof date === 'string' ? formatDate(date) : '-';
    },
  },
  // {
  //   header: 'Uploaded BY',
  //   accessorKey: 'uploaded_by',
  //   cell: ({ getValue, row }) => {
  //     const userId = row.original.uploaded_by;
  //     const userValue = getValue() as string;
  //     return (
  //       <Link href={`/borrowers/${userId}`}>
  //         <h1 className='underline underline-offset-2'>{userValue}</h1>
  //       </Link>
  //     );
  //   },
  // },
];

export default columns;
