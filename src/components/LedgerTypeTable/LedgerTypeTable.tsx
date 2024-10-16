/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableCell, TableBody, TableHead } from '../ui/table';
import { ArrowDownAZ, ArrowDownZA, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { BudgetSection } from '../../app/(dashboard)/draw/[id]/page';
import { BaseHeaderProps, BaseTableData } from '../../lib/componentProps';
import { Checkbox } from '../ui/checkbox';

type TableDatasWithAccordianProps = {
  category: BudgetSection;
  headers: BaseHeaderProps[];
  needCheckbox: boolean;
  onRowClick?: () => void | null;
};

type LedgerTypeTableProps = {
  data: BudgetSection[];
  headers: BaseHeaderProps[];
  needCheckbox?: boolean;
  onRowClick?: () => void | null;
};

type HeaderTextProps = {
  data: BudgetSection[];
  header: BaseHeaderProps;
  setData: (data: BudgetSection[]) => void;
};

const TableAccordian = ({
  category,
  headers,
  needCheckbox,
  onRowClick,
}: TableDatasWithAccordianProps) => {
  const [showData, setShowData] = useState(true);

  return (
    <React.Fragment>
      <TableRow className="font-bold">
        {needCheckbox && (
          <TableCell>
            <Checkbox className="border-white" />
          </TableCell>
        )}
        <TableCell
          colSpan={7}
          className="flex items-center text-nowrap cursor-pointer text-white gap-3"
          onClick={() => {
            setShowData(!showData);
          }}
        >
          {showData ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          {category?.title}
        </TableCell>
      </TableRow>
      {showData
        ? category?.items.map((row: BaseTableData, idx: number) => (
            <TableRow
              key={idx}
              className={`text-white ${row?.type === 'subtotal' && 'font-bold'} ${
                onRowClick ? 'cursor-pointer' : 'cursor-auto'
              }`}
              onClick={onRowClick}
            >
              {needCheckbox ? (
                <TableCell>
                  {row?.type !== 'subtotal' && <Checkbox className="border-white" />}
                </TableCell>
              ) : null}
              {headers.map(
                (header, cellIndex) =>
                  header.key && (
                    <TableCell
                      className={`text-nowrap text-white ${header.rowClassname} ${
                        header?.onClick ? 'cursor-pointer' : ''
                      }`}
                      key={cellIndex}
                      onClick={() => (header.onClick ? header.onClick!(row) : undefined)}
                    >
                      {row[header.key]}
                    </TableCell>
                  ),
              )}
            </TableRow>
          ))
        : null}
    </React.Fragment>
  );
};

const HeaderText = ({ data, setData, header }: HeaderTextProps) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const sortTable = (column: keyof (typeof data)[0]['items'][0]) => {
    const newSortOrder = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortColumn(column as string);
    setSortOrder(newSortOrder);
    let sortedData: BudgetSection[] = [...data];

    if (column === 'name') {
      sortedData = [...data].sort((a, b) => {
        const aCategory = a.title.toString();
        const bCategory = b.title.toString();

        if (aCategory < bCategory) return newSortOrder === 'asc' ? -1 : 1;
        if (aCategory > bCategory) return newSortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    const fullySortedData = sortedData.map(section => {
      const sortedItems = [
        ...section.items
          .filter(item => item.type !== 'subtotal')
          .sort((a: any, b: any) => {
            const aValue = a[column];
            const bValue = b[column];

            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return 1;
            if (bValue == null) return -1;

            const aString = aValue.toString();
            const bString = bValue.toString();

            const isNumeric = !isNaN(Number(aString)) && !isNaN(Number(bString));
            if (isNumeric) {
              return newSortOrder === 'asc'
                ? Number(aString) - Number(bString)
                : Number(bString) - Number(aString);
            }

            if (aString < bString) return newSortOrder === 'asc' ? -1 : 1;
            if (aString > bString) return newSortOrder === 'asc' ? 1 : -1;
            return 0;
          }),
        ...section.items.filter(item => item.type === 'subtotal'),
      ];

      return { ...section, items: sortedItems };
    });

    setData(fullySortedData);
  };

  return (
    <TableHead
      className={`capitalize ${header?.classname} text-nowrap`}
      onClick={() => sortTable(header?.key)}
    >
      <div className="flex items-center text-white justify-left gap-1">
        {header?.title}
        {header?.title && (
          <div>{sortOrder === 'desc' ? <ArrowDownZA size={16} /> : <ArrowDownAZ size={16} />}</div>
        )}
      </div>
    </TableHead>
  );
};

type SortOrder = 'asc' | 'desc';

const LedgerTypeTable = ({
  data: tableData,
  headers,
  needCheckbox = false,
  onRowClick,
}: LedgerTypeTableProps) => {
  const [data, setData] = useState<BudgetSection[]>(tableData);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Table className="w-[99vw] mx-auto [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] rounded-2xl my-5">
        <TableHeader className="text-white sticky top-0 bg-[#021457] z-10">
          {headers.map((header, index) => (
            <HeaderText data={data} setData={setData} header={header} key={index} />
          ))}
        </TableHeader>
        <TableBody>
          {data.map((category: BudgetSection, index: number) => (
            <TableAccordian
              key={index}
              category={category}
              headers={headers}
              needCheckbox={needCheckbox}
              onRowClick={onRowClick}
            />
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
};

export default LedgerTypeTable;
