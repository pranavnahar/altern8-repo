"use client"

import React, { FC, useState } from 'react'
import { EllipsisVertical } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ActionItemData, Props } from '../types'
import { IconInfoCircle, IconMenu, IconMenu3 } from '@tabler/icons-react'

const ActionItems: FC<Props> = ({
  showActionItems,
  latePayments,
  upcomingPayments,
  showActionItemsPath,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<ActionItemData | null>(null)

  if (!showActionItems) return null

  const items: ActionItemData[] = [
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
  ]

  const handleItemClick = (item: ActionItemData) => {
    if (item.data.length > 0) {
      setSelectedAction(item)
      setIsDialogOpen(true)
    }
  }

  return (
    <>
      <div className="rounded-lg pb-1 background">
        <div className="flex items-center px-2 pt-3">
          <div className="text-center text-gray-300 text-xl font-relative-medium flex-grow">
            Action Items
          </div>
        </div>
        <div className="mx-5 mb-8">
          {items.map((item, index) => {
            const isClickable = item.data.length > 0
            return (
              <div
                key={index}
                onClick={() => isClickable && handleItemClick(item)}
                className={`text-zinc-200 font-normal rounded-full mt-5 px-5 py-3 bg-white/30 ${
                  isClickable ? 'cursor-pointer hover:bg-opacity-90' : 'cursor-auto'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex">
                    <div className="pr-2">
                      <IconInfoCircle className='text-zinc-200'/>
                    </div>
                    <div>{item.label}</div>
                  </div>
                  <div>
                    <div className="hover:bg-gray-400 p-1 px-2 text-[18px] font-medium rounded-lg">
                      {item.data.length}
                    </div>
                  </div>
                </div>
              </div>
            )
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
                    <TableHead key={index} className="text-zinc-300">{column}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedAction?.data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-zinc-300 text-sm">{row.id}</TableCell>
                    <TableCell className="text-zinc-300 text-sm">{row.amount}</TableCell>
                    <TableCell className="text-zinc-300 text-sm">{row.dueDate}</TableCell>
                    <TableCell className="text-zinc-300 text-sm">
                      {row.daysOverdue !== undefined ? row.daysOverdue : row.daysUntilDue}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <form action={showActionItemsPath}>
              <input type="hidden" name="action" value={selectedAction?.action || ''} />
              <Button type="submit" onClick={() => setIsDialogOpen(false)}>Close</Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ActionItems
