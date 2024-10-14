"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { BaseHeaderProps, BaseTableData } from "../../lib/componentProps";
import { Progress } from "../ui/progress";
import { ArrowDownAZ, ArrowDownZA, Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface DrawTableProps<T extends BaseTableData, U extends BaseHeaderProps> {
  tableData: T[];
  headers: U[];
  edit?: boolean;
  editFunction?: () => void;
}

interface HeaderConfig {
  key: keyof BaseTableData;
  title?: string;
  classname?: string;
  type?: string;
  filter?: boolean;
}

interface HeaderTextProps {
  data: BaseTableData[];
  setData: (data: BaseTableData[]) => void;
  header: HeaderConfig;
}

const HeaderText: React.FC<HeaderTextProps> = ({ data, setData, header }) => {
  type SortOrder = "asc" | "desc";

  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const sortTable = (column: keyof BaseTableData) => {
    if (header?.filter !== false) {
      const newSortOrder: SortOrder = sortOrder === "asc" ? "desc" : "asc";
      setSortOrder(newSortOrder);

      const sortedData = [...data].sort((a, b) => {
        const aValue = a[column as string];
        const bValue = b[column as string];

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
          return newSortOrder === "asc"
            ? Number(aString) - Number(bString)
            : Number(bString) - Number(aString);
        }

        // String comparison
        if (aString < bString) return newSortOrder === "asc" ? -1 : 1;
        if (aString > bString) return newSortOrder === "asc" ? 1 : -1;
        return 0;
      });

      // Update the state with the sorted data
      setData(sortedData);
    }
  };

  return (
    <TableHead
      className={`capitalize ${header?.classname} text-nowrap ${
        header?.type === "button" ? "" : "cursor-pointer"
      }`}
      onClick={() =>
        header?.type !== "button" &&
        sortTable(header?.key as keyof BaseTableData)
      }
    >
      <div className="flex items-center justify-between gap-1">
        {header?.type !== "button" && header?.title}
        {header?.filter !== false &&
          header?.type !== "button" &&
          header?.title && (
            <div>
              {sortOrder === "desc" ? (
                <ArrowDownZA size={16} />
              ) : (
                <ArrowDownAZ size={16} />
              )}
            </div>
          )}
      </div>
    </TableHead>
  );
};

const RenderBodyCell = ({
  row,
  header,
}: {
  row: BaseTableData;
  header: BaseHeaderProps;
}) => {
  if (header?.type === "button") {
    return <Button onClick={header?.buttonClick}>{header.title}</Button>;
  }
  return row[header.key as keyof BaseTableData];
};

export default function DrawTable<
  T extends BaseTableData,
  U extends BaseHeaderProps
>({
  tableData,
  headers,
  edit = false,
  editFunction = () => {},
}: DrawTableProps<T, U>) {
  const [data, setData] = useState<BaseTableData[]>(tableData);
  const percentageFinder = (total: string, value: string) => {
    let valueToNumber = Number(value.replaceAll(",", "").replace("₹", ""));
    let totalToNumber = Number(total.replaceAll(",", "").replace("₹", ""));
    return (valueToNumber / totalToNumber) * 100;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((header, index) => (
            <HeaderText
              data={data}
              setData={setData}
              header={header}
              key={index}
            />
          ))}
          {edit && <TableHead></TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {headers.map((header, cellIndex) => (
              <TableCell
                className={`text-nowrap text-white ${header.rowClassname} ${
                  header?.onClick ? "cursor-pointer" : ""
                }`}
                key={cellIndex}
                onClick={() =>
                  header.onClick ? header.onClick!(row) : undefined
                }
              >
                {Array.isArray(header.compareKeys) ? (
                  <Progress
                    value={percentageFinder(
                      row[header.compareKeys?.[1] as keyof T] as string,
                      row[header.compareKeys?.[0] as keyof T] as string
                    )}
                    className="w-24 h-2 bg-black"
                  />
                ) : (
                  <RenderBodyCell row={row} header={header} />
                )}
              </TableCell>
            ))}
            {edit && (
              <TableCell>
                <Pencil onClick={editFunction} className="text-white cursor-pointer" size={18} />
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
