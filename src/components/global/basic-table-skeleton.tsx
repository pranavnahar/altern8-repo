import React from 'react'
import { Skeleton } from '../ui/skeleton'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

type Props = {}

const BasicTableSkeleton = (props: Props) => {
  return (
    <div>
        {/* Search and Filter */}
        <div className="flex items-center justify-between w-auto mb-8">
            <div className="py-1 my-2">
              <Skeleton className="h-8 w-40" />
            </div>
            <div className="py-1 my-2">
              <Skeleton className="h-10 w-[180px]" />
            </div>
        </div>

        {/* Column Visibility Toggles */}
        <div className="flex pt-8 mb-8">
          <div className="grid w-full tablet:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-y-3 gap-x-5">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="flex gap-2 py-1">
                <Skeleton className="h-5 w-5 rounded-md" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="max-w-[calc(100vw-2rem)]">
          <ScrollArea type="auto" className="w-[100%] whitespace-nowrap">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  {[...Array(6)].map((_, index) => (
                    <TableCell key={index}>
                      <Skeleton className="h-6 w-36" />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(8)].map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {[...Array(6)].map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="h-5 w-36" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Pagination */}
        <div className="flex justify-between p-2 my-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-[70px]" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="flex items-center gap-2 my-1">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </div>
  )
}

export default BasicTableSkeleton
