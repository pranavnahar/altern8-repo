import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from '@/utils/show-toasts';
import { Budget } from '../types';

interface Props {
  projectId: number;
  trancheId: number;
  onSuccess?: () => void;
}

const BudgetSheet = ({ projectId, trancheId, onSuccess }: Props) => {
  const [formData, setFormData] = useState<Partial<Budget>>({
    original_budget: '',
    adjustments: '',
    current_budget: '',
    amount_requested: '',
    amount_used: '',
    balance_to_fund: '',
    percentage_remaining: '',
  });
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    const payload: Budget = {
      project: projectId,
      tranche: trancheId,
      ...formData
    };

    try {
      const result = await createBudget(payload);
      showToast({
        message: 'Budget created',
        type: "success"
      });
      onSuccess?.();
      setIsOpen(false);
    } catch (error) {
      showToast({
        message: 'Failed to create budget',
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="xs" className='text-xs'>
          Add Budget
        </Button>
      </SheetTrigger>
      <SheetContent className='background border-none'>
        <SheetHeader>
          <SheetTitle className='text-2xl text-neutral-200'>
            Create New Budget
          </SheetTitle>
          <SheetDescription>
            Add a new budget for your project
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="original-budget" className="text-right">
              Original Budget
            </Label>
            <Input
              id="original-budget"
              className="col-span-3"
              value={formData.original_budget || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, original_budget: e.target.value }))}
              placeholder="Enter original budget"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="adjustments" className="text-right">
              Adjustments
            </Label>
            <Input
              id="adjustments"
              className="col-span-3"
              value={formData.adjustments || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, adjustments: e.target.value }))}
              placeholder="Enter budget adjustments"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="current-budget" className="text-right">
              Current Budget
            </Label>
            <Input
              id="current-budget"
              className="col-span-3"
              value={formData.current_budget || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, current_budget: e.target.value }))}
              placeholder="Enter current budget"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount-requested" className="text-right">
              Amount Requested
            </Label>
            <Input
              id="amount-requested"
              className="col-span-3"
              value={formData.amount_requested || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, amount_requested: e.target.value }))}
              placeholder="Enter amount requested"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount-used" className="text-right">
              Amount Used
            </Label>
            <Input
              id="amount-used"
              className="col-span-3"
              value={formData.amount_used || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, amount_used: e.target.value }))}
              placeholder="Enter amount used"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="balance-to-fund" className="text-right">
              Balance to Fund
            </Label>
            <Input
              id="balance-to-fund"
              className="col-span-3"
              value={formData.balance_to_fund || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, balance_to_fund: e.target.value }))}
              placeholder="Enter balance to fund"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="percentage-remaining" className="text-right">
              Percentage Remaining
            </Label>
            <Input
              id="percentage-remaining"
              className="col-span-3"
              value={formData.percentage_remaining || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, percentage_remaining: e.target.value }))}
              placeholder="Enter percentage remaining"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              className="col-span-3"
              value={formData.category || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Enter budget category"
              disabled={isLoading}
            />
          </div>
        </div>
        <SheetFooter>
          <Button
            onClick={handleSubmit}
            className='w-full flex justify-center'
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Budget'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default BudgetSheet;
