'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Button } from "../../../../components/ui/button"
import { adminApplyProduct } from '../actions'

type AdminApplyProductModalProps = {
  projectId: string
  productId: number
}

const ApplyProduct = ({ projectId, productId }: AdminApplyProductModalProps) => {
  const [approvalStatus, setApprovalStatus] = useState<boolean | null>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (approvalStatus === null) return

    setIsLoading(true)
    const result = await adminApplyProduct(projectId, {
      approval_status: approvalStatus,
      product_id: productId
    })
    setIsLoading(false)

    if (result.success) {
      setIsOpen(false)
      router.refresh()
    } else {
      console.error('Failed to apply product:', result.error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className='text-sm'>Apply Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] background border-none">
        <DialogHeader>
          <DialogTitle className='text-white text-xl'>Apply Product</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Select onValueChange={(value) => setApprovalStatus(value === 'true')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select approval status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">True</SelectItem>
                <SelectItem value="false">False</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={approvalStatus === null || isLoading}>
          {isLoading ? 'Applying...' : 'Apply'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default ApplyProduct
