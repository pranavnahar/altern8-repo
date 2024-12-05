import BasicTable from '@/components/global/basic-table'
import { InventoryColumns } from '@/components/ProjectDetailTabs/OverView/columns/inventory-columns'
import React from 'react'

export const InventoryOverview = () => {
  return (
    <>
      <div className="flex items-center justify-between text-sm">
        <h2 className="text-nowrap py-2 text-2xl tracking-tight">Inventory</h2>
      </div>
      {/* <BasicTable data={inventory.inventory || []} columns={InventoryColumns} filters={[]} needFilters={false} /> */}
    </>
  )
}
