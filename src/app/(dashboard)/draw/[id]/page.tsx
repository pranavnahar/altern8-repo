'use client';
import DrawTabs from '../../../../components/DrawTabs/DrawTabs';
import DrawHeader from '../../../../components/DrawTabs/Header';
import { BaseTableData } from '../../../../lib/componentProps';
import { BudgetTabHeader } from './BudgetTabHeader';

export interface BudgetItem {
  name: string;
  originalBudget: string;
  adjustments: string;
  currentBudget: string;
  amountRequestedGross: string;
  retainage: string;
  amountRequestedNet: string;
  balanceToFund: string;
  percentRemainingNet: string;
  interestRetainage: string;
  amountUsed: string;
}

export interface BudgetSection {
  title: string;
  isOpen?: boolean;
  items: BaseTableData[];
}

export default function Draw({ params }: { params: { id: string } }) {
  return (
    <div className="py-5 ">
      <DrawHeader params={params} />
      <BudgetTabHeader />
      <DrawTabs />
    </div>
  );
}
