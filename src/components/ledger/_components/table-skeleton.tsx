import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Skeleton } from "../../ui/skeleton";

const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="">
      <Table>
        <TableHeader>
          <TableRow>
            {Array(columns)
              .fill(null)
              .map((_, index) => (
                <TableHead key={index}>
                  <Skeleton className="h-4 w-[100px]" />
                </TableHead>
              ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array(rows)
            .fill(null)
            .map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array(columns)
                  .fill(null)
                  .map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                  ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableSkeleton;
