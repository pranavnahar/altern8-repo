'use client';

import React, { useState, useEffect } from 'react';
import BasicTable from '@/components/global/basic-table';
import { ColumnDef } from '@tanstack/react-table';

interface ProjectTableWrapperProps {
  initialData: any[];
  columns: ColumnDef<any>[];
  tableName: string;
}

export default function ProjectTableWrapper({ 
  initialData, 
  columns, 
  tableName 
}: ProjectTableWrapperProps) {
  const [data, setData] = useState(initialData);

  // Optional: If you want to ensure data is always up to date
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  return (
    <BasicTable
      data={data}
      columns={columns}
      filters={[]}
      needFilters={false}
      tableName={tableName}
    />
  );
}