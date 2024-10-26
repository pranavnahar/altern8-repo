import React, { useState } from 'react';
import { EllipsisVertical } from 'lucide-react';
import { ActionItems as ActionItemsProps, ActionItemData } from './types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';

const ActionItems: React.FC<ActionItemsProps> = ({
  showActionItems,
  latePayments,
  upcomingPayments,
  showActionItemsTables,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionItemData | null>(null);

  if (!showActionItems) return null;

  // these are the column titles for the Dialouge that will open
  const items = [
    {
      label: 'Late Payment',
      action: 'late',
      data: latePayments,
      details: {
        title: 'Late Payments',
        description: 'Overview of all late payments',
        columns: ['Payment ID', 'Amount', 'Due Date', 'Days Overdue'],
      },
    },
    {
      label: 'Upcoming Payments',
      action: 'upcoming',
      data: upcomingPayments,
      details: {
        title: 'Upcoming Payments',
        description: 'Overview of upcoming payments',
        columns: ['Payment ID', 'Amount', 'Due Date', 'Days Until Due'],
      },
    },
  ];

  const handleItemClick = (item: (typeof items)[0]) => {
    if (item.data.length > 0) {
      setSelectedAction(item);
      setIsDialogOpen(true);
      showActionItemsTables(item.action);
    }
  };

  return (
    <>
      <div className="rounded-lg pb-1 [background:linear-gradient(65.92deg,_#021457,_#170a3f_31.84%,_#251431_51.79%,_#301941_64.24%,_#8e295d_99.08%),_#d9d9d9] shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)]">
        <div className="flex items-center px-2 pt-3">
          <div className="text-center text-gray-300 text-xl font-relative-medium flex-grow">
            Action Items
          </div>
          <div title="Important Actions">
            <EllipsisVertical className="size-5 text-neutral-100 my-auto p-0 cursor-pointer" />
          </div>
        </div>
        <div className="mx-5 mb-8">
          {items.map((item, index) => {
            const isClickable = item.data.length > 0;
            return (
              <div
                key={index}
                onClick={() => isClickable && handleItemClick(item)}
                className={`text-gray-900 font-medium rounded-full mt-5 px-5 py-3 bg-font-light-blue ${
                  isClickable ? 'cursor-pointer hover:bg-opacity-90' : 'cursor-auto'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex">
                    <div className="pr-2">
                      <img src="dashboard/warning.svg" alt="" />
                    </div>
                    <div>{item.label}</div>
                  </div>
                  <div>
                    <div className="hover:bg-gray-400 p-1 px-2 text-[18px] font-bold rounded-lg">
                      {item.data.length}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-none [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white">
              {selectedAction?.details.title}
            </DialogTitle>
            <DialogDescription className="text-zinc-300 text-sm">
              {selectedAction?.details.description}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  {selectedAction?.details.columns.map((column, index) => (
                    <TableHead key={index}>{column}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Render your table data here */}
                {selectedAction?.data.map((row, index) => (
                  <TableRow key={index}>
                    {Object.values(row).map((cell, cellIndex) => (
                      <TableCell className="text-zinc-300 text-sm" key={cellIndex}>
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActionItems;
