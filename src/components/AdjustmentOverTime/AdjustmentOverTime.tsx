'use client';
import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableCell, TableBody } from '../ui/table';
import { ArrowDownAZ, ArrowDownZA, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { CategoryProps, ItemProps } from '../ProjectDetailTabs/Budget/types';

type TableDatasWithAccordianProps = {
  category: CategoryProps;
  headersConfig: HeadersMenu;
};

interface HeaderTextProps {
  data: CategoryProps[];
  setData: (data: CategoryProps[]) => void;
  headerText: string;
  headerKey: keyof CategoryProps['items'][0];
}

const TableDatasWithAccordian = ({ category, headersConfig }: TableDatasWithAccordianProps) => {
  const [showData, setShowData] = useState(true);
  return (
    <React.Fragment>
      {/* Row for Category Header */}
      <TableRow className="font-bold" onClick={() => setShowData(!showData)}>
        <TableCell
          colSpan={headersConfig.columns.length + 4}
          className="flex items-center whitespace-nowrap text-white gap-3"
        >
          {showData ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          {category?.category}
        </TableCell>
      </TableRow>

      {/* Rows for each item */}
      {showData &&
        category?.items.map((item: ItemProps, idx: number) => (
          <TableRow
            key={idx}
            className={`text-white ${item?.type === 'subtotal' ? 'font-bold text-white' : ''}`}
          >
            {headersConfig.columns.map(header => (
              <TableCell
                key={header.key}
                className={
                  header.key === 'name' && item?.type === 'subtotal'
                    ? 'font-bold text-right whitespace-nowrap text-white'
                    : ''
                }
              >
                {header.key in item
                  ? header.key === 'name'
                    ? item[header.key as keyof ItemProps]
                    : `₹ ${item[header.key as keyof ItemProps]?.toLocaleString()}`
                  : ''}
              </TableCell>
            ))}
          </TableRow>
        ))}
    </React.Fragment>
  );
};

const HeaderText = ({ data, setData, headerText, headerKey }: HeaderTextProps) => {
  type SortOrder = 'asc' | 'desc';

  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const sortTable = (column: keyof (typeof data)[0]['items'][0]) => {
    const newSortOrder = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortColumn(column as string);
    setSortOrder(newSortOrder);
    let sortedData: CategoryProps[] = [...data];
    // First, sort the categories (side menu)
    if (column === 'name') {
      sortedData = [...data].sort((a, b) => {
        const aCategory = a.category.toString();
        const bCategory = b.category.toString();
        if (aCategory < bCategory) return newSortOrder === 'asc' ? -1 : 1;
        if (aCategory > bCategory) return newSortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Next, sort the items within each category
    const fullySortedData = sortedData.map(section => {
      const sortedItems = [
        // Filter out subtotal items, sort the remaining items
        ...section.items
          .filter(item => item.type !== 'subtotal')
          .sort((a, b) => {
            const aValue = a[column];
            const bValue = b[column];

            // Handle null or undefined values
            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return 1;
            if (bValue == null) return -1;

            // Convert values to strings for comparison
            const aString = aValue.toString();
            const bString = bValue.toString();

            // Numeric comparison if values are numbers
            const isNumeric = !isNaN(Number(aString)) && !isNaN(Number(bString));
            if (isNumeric) {
              return newSortOrder === 'asc'
                ? Number(aString) - Number(bString)
                : Number(bString) - Number(aString);
            }

            // String comparison
            if (aString < bString) return newSortOrder === 'asc' ? -1 : 1;
            if (aString > bString) return newSortOrder === 'asc' ? 1 : -1;
            return 0;
          }),
        // Add back the subtotal items in their original position
        ...section.items.filter(item => item.type === 'subtotal'),
      ];

      return { ...section, items: sortedItems };
    });

    setData(fullySortedData);
  };
  return (
    <TableCell onClick={() => sortTable(headerKey)}>
      <div className="flex gap-1 whitespace-nowrap justify-between items-center">
        {headerText}
        {sortOrder === 'desc' ? <ArrowDownZA size={16} /> : <ArrowDownAZ size={16} />}
      </div>
    </TableCell>
  );
};

interface HeadersMenu {
  topHeaders: {
    text: string;
    colspan: number;
    className?: string;
    wrap: number;
  }[];
  subHeaders: {
    text: string;
    colspan: number;
    className?: string;
    wrap: number;
  }[];
  columns: { text: string; key: string }[];
}
const AdjustmentOverTime = ({ data: tableData }: { data: CategoryProps[] }) => {
  const [data, setData] = useState<CategoryProps[]>(tableData);

  const headersConfig: HeadersMenu = {
    topHeaders: [
      { text: '', colspan: 1, wrap: 1 },
      { text: '', colspan: 1, wrap: 1 },
      { text: '', colspan: 1, wrap: 1 },
      { text: '', colspan: 1, wrap: 1 },
      { text: 'Tranche 3', colspan: 3, className: 'text-center', wrap: 1 },
      { text: 'Tranche 2', colspan: 3, className: 'text-center', wrap: 1 },
      { text: 'Tranche 1', colspan: 3, className: 'text-center', wrap: 1 },
    ],
    subHeaders: [
      { text: '', colspan: 1, wrap: 1 },
      { text: 'Budget it 9/14/2023', colspan: 1, wrap: 1 },
      { text: 'Budget it 9/14/2023', colspan: 1, wrap: 1 },
      { text: 'Budget it 9/14/2023', colspan: 1, wrap: 1 },
      { text: 'Active', colspan: 3, className: 'text-center', wrap: 3 },
      {
        text: 'Funded 9/14/2023',
        colspan: 3,
        className: 'text-center',
        wrap: 3,
      },
      {
        text: 'Funded 8/15/2023',
        colspan: 3,
        className: 'text-center',
        wrap: 3,
      },
    ],
    columns: [
      { text: 'Line Item', key: 'name' },
      { text: 'Original Budget', key: 'originalBudget' },
      { text: 'Adjustments', key: 'adjustments' },
      { text: 'Current Budget', key: 'currentBudget' },
      { text: 'Original Budget', key: 'draw3originalBudget' },
      { text: 'Adjustments', key: 'draw3' },
      { text: 'Current Budget', key: 'draw3currentBudget' },
      { text: 'Original Budget', key: 'draw2originalBudget' },
      { text: 'Adjustments', key: 'draw2' },
      { text: 'Current Budget', key: 'draw2currentBudget' },
      { text: 'Original Budget', key: 'draw1originalBudget' },
      { text: 'Adjustments', key: 'draw1' },
      { text: 'Current Budget', key: 'draw1currentBudget' },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="my-2"
    >
      <Table className=" w-[99vw] h-[65vh] mx-auto [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] rounded-2xl m-5 border-collapse">
        <TableHeader className="text-white sticky [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] rounded-2xl top-0">
          <TableRow className=" ">
            {headersConfig.topHeaders.map((header, index) => (
              <TableCell key={index} colSpan={header.colspan} className={header.className || ''}>
                {header.text}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            {headersConfig.subHeaders.map((header, index) => (
              <TableCell key={index} colSpan={header.colspan} className={header.className || ''}>
                {header.text}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            {headersConfig.columns.map((header: HeadersMenu['columns'][0]) => (
              <HeaderText
                key={header.key}
                data={data}
                setData={setData}
                headerText={header.text}
                headerKey={header.key as keyof ItemProps}
              />
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((category: CategoryProps, index: number) => (
            <TableDatasWithAccordian
              key={index}
              category={category}
              headersConfig={headersConfig}
            />
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
};

export default AdjustmentOverTime;
