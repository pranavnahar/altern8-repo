'use client';
import { BudgetSection } from '../../app/(dashboard)/draw/[id]/page';
import { BudgetTabHeader } from '../../app/(dashboard)/draw/[id]/BudgetTabHeader';
import React, { useEffect, useState } from 'react';
import BudgetFilter from '../LedgerTypeTable/Filter';
import LedgerTypeTable from '../LedgerTypeTable/LedgerTypeTable';
import AdjustmentOverTime from '../AdjustmentOverTime/AdjustmentOverTime';
import { CategoryProps } from '../ProjectDetailTabs/Budget/types';
import { BaseHeaderProps } from '../../lib/componentProps';
import { useRecoilValue } from 'recoil';
import { userRole } from '../../atom/atom';

const Budget = () => {
  const budgetData: BudgetSection[] = [
    {
      title: 'Fees & Interest',
      isOpen: false,
      items: [
        {
          name: 'Interest Reserves',
          originalBudget: '₹ 10,00,438.00',
          adjustments: '₹ 0.00',
          currentBudget: '₹ 10,00,438.00',
          amountRequestedGross: '₹ 0.00',
          retainage: '₹ 0.00',
          amountRequestedNet: '₹ 0.00',
          amountUsed: '₹ 0.00',
          interestRetainage: '70%',
          balanceToFund: '₹ 10,00,438.00',
          percentRemainingNet: '100%',
        },
        {
          name: 'Development Fee',
          originalBudget: '₹ 50,04,219.00',
          adjustments: '₹ 0.00',
          currentBudget: '₹ 50,04,219.00',
          amountRequestedGross: '₹ 0.00',
          retainage: '₹ 0.00',
          amountRequestedNet: '₹ 0.00',
          amountUsed: '₹ 0.00',
          interestRetainage: '70%',
          balanceToFund: '₹ 50,04,219.00',
          percentRemainingNet: '100%',
        },
      ],
    },
    {
      title: 'Soft Costs',
      isOpen: false,
      items: [
        {
          name: 'Architect',
          originalBudget: '₹ 19,99,861.00',
          adjustments: '₹ 0.00',
          currentBudget: '₹ 19,99,861.00',
          amountRequestedGross: '₹ 0.00',
          retainage: '₹ 0.00',
          amountRequestedNet: '₹ 0.00',
          amountUsed: '₹ 0.00',
          interestRetainage: '70%',
          balanceToFund: '₹ 19,99,861.00',
          percentRemainingNet: '100%',
        },
        {
          name: 'Engineering',
          originalBudget: '₹ 5,83,017.00',
          adjustments: '₹ 0.00',
          currentBudget: '₹ 5,83,017.00',
          amountRequestedGross: '₹ 0.00',
          retainage: '₹ 0.00',
          amountRequestedNet: '₹ 0.00',
          amountUsed: '₹ 0.00',
          interestRetainage: '70%',
          balanceToFund: '₹ 5,83,017.00',
          percentRemainingNet: '100%',
        },
        {
          name: 'Title Insurance',
          originalBudget: '₹ 3,16,927.00',
          adjustments: '₹ 0.00',
          currentBudget: '₹ 3,16,927.00',
          amountRequestedGross: '₹ 0.00',
          retainage: '₹ 0.00',
          amountRequestedNet: '₹ 0.00',
          amountUsed: '₹ 0.00',
          interestRetainage: '70%',
          balanceToFund: '₹ 3,16,927.00',
          percentRemainingNet: '100%',
        },
        {
          name: 'Environmental',
          originalBudget: '₹ 3,99,534.00',
          adjustments: '₹ 0.00',
          currentBudget: '₹ 3,99,534.00',
          amountRequestedGross: '₹ 0.00',
          retainage: '₹ 0.00',
          amountRequestedNet: '₹ 0.00',
          amountUsed: '₹ 0.00',
          interestRetainage: '70%',
          balanceToFund: '₹ 3,99,534.00',
          percentRemainingNet: '100%',
        },
        {
          name: 'Soft Cost Contingency',
          originalBudget: '₹ 3,16,927.00',
          adjustments: '₹ 0.00',
          currentBudget: '₹ 3,16,927.00',
          amountRequestedGross: '₹ 0.00',
          retainage: '₹ 0.00',
          amountRequestedNet: '₹ 0.00',
          amountUsed: '₹ 0.00',
          interestRetainage: '70%',
          balanceToFund: '₹ 3,16,927.00',
          percentRemainingNet: '100%',
        },
      ],
    },
    {
      title: 'Hard Costs',
      isOpen: false,
      items: [
        {
          name: 'General Requirements',
          originalBudget: '₹ 44,03,413.00',
          adjustments: '₹ 0.00',
          currentBudget: '₹ 44,03,413.00',
          amountRequestedGross: '₹ 0.00',
          retainage: '₹ 0.00',
          amountRequestedNet: '₹ 0.00',
          amountUsed: '₹ 0.00',
          interestRetainage: '70%',
          balanceToFund: '₹ 44,03,413.00',
          percentRemainingNet: '100%',
        },
        {
          name: 'Concrete',
          originalBudget: '₹ 1,34,69,621.00',
          adjustments: '₹ 0.00',
          currentBudget: '₹ 1,34,69,621.00',
          amountRequestedGross: '₹ 0.00',
          retainage: '₹ 0.00',
          amountRequestedNet: '₹ 0.00',
          amountUsed: '₹ 0.00',
          interestRetainage: '70%',
          balanceToFund: '₹ 1,34,69,621.00',
          percentRemainingNet: '100%',
        },
        {
          name: 'Masonry',
          originalBudget: '₹ 52,12,000.00',
          adjustments: '₹ 0.00',
          currentBudget: '₹ 52,12,000.00',
          amountRequestedGross: '₹ 0.00',
          retainage: '₹ 0.00',
          amountRequestedNet: '₹ 0.00',
          amountUsed: '₹ 0.00',
          interestRetainage: '70%',
          balanceToFund: '₹ 52,12,000.00',
          percentRemainingNet: '100%',
        },
        {
          name: 'Metal',
          originalBudget: '₹ 30,06,000.00',
          adjustments: '₹ 0.00',
          currentBudget: '₹ 30,06,000.00',
          amountRequestedGross: '₹ 0.00',
          retainage: '₹ 0.00',
          amountRequestedNet: '₹ 0.00',
          amountUsed: '₹ 0.00',
          interestRetainage: '70%',
          balanceToFund: '₹ 30,06,000.00',
          percentRemainingNet: '100%',
        },
        {
          name: 'Wood & Plastics',
          originalBudget: '₹ 1,70,65,031.00',
          adjustments: '₹ 0.00',
          currentBudget: '₹ 1,70,65,031.00',
          amountRequestedGross: '₹ 0.00',
          retainage: '₹ 0.00',
          amountRequestedNet: '₹ 0.00',
          amountUsed: '₹ 0.00',
          interestRetainage: '70%',
          balanceToFund: '₹ 1,70,65,031.00',
          percentRemainingNet: '100%',
        },
        {
          name: 'Thermal & Moisture',
          originalBudget: '₹ 78,39,433.00',
          adjustments: '₹ 0.00',
          currentBudget: '₹ 78,39,433.00',
          amountRequestedGross: '₹ 0.00',
          retainage: '₹ 0.00',
          amountRequestedNet: '₹ 0.00',
          amountUsed: '₹ 0.00',
          interestRetainage: '70%',
          balanceToFund: '₹ 78,39,433.00',
          percentRemainingNet: '100%',
        },
        {
          name: 'Openings',
          originalBudget: '₹ 40,16,949.00',
          adjustments: '₹ 0.00',
          currentBudget: '₹ 40,16,949.00',
          amountRequestedGross: '₹ 0.00',
          retainage: '₹ 0.00',
          amountRequestedNet: '₹ 0.00',
          amountUsed: '₹ 0.00',
          interestRetainage: '70%',
          balanceToFund: '₹ 40,16,949.00',
          percentRemainingNet: '100%',
        },
        {
          name: 'Finishes',
          originalBudget: '₹ 40,16,949.00',
          adjustments: '₹ 0.00',
          currentBudget: '₹ 40,16,949.00',
          amountRequestedGross: '₹ 0.00',
          retainage: '₹ 0.00',
          amountRequestedNet: '₹ 0.00',
          amountUsed: '₹ 0.00',
          interestRetainage: '70%',
          balanceToFund: '₹ 40,16,949.00',
          percentRemainingNet: '100%',
        },
        {
          name: 'Specialties',
          originalBudget: '₹ 46,231.00',
          adjustments: '₹ 0.00',
          currentBudget: '₹ 46,231.00',
          amountRequestedGross: '₹ 0.00',
          retainage: '₹ 0.00',
          amountRequestedNet: '₹ 0.00',
          amountUsed: '₹ 0.00',
          interestRetainage: '70%',
          balanceToFund: '₹ 46,231.00',
          percentRemainingNet: '100%',
        },
        {
          name: 'Hard Cost Contingency',
          originalBudget: '₹ 46,231.00',
          adjustments: '₹ 0.00',
          currentBudget: '₹ 46,231.00',
          amountRequestedGross: '₹ 0.00',
          retainage: '₹ 0.00',
          amountRequestedNet: '₹ 0.00',
          amountUsed: '₹ 0.00',
          interestRetainage: '70%',
          balanceToFund: '₹ 46,231.00',
          percentRemainingNet: '100%',
        },
      ],
    },
  ];
  const adjustmentData: CategoryProps[] = [
    {
      category: 'Fees & Interest',
      items: [
        {
          name: 'Interest Reserves',
          originalBudget: 120583.0,
          adjustments: 0.0,
          currentBudget: 120583.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Development Fee',
          originalBudget: 602918.0,
          adjustments: 0.0,
          currentBudget: 602918.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Tranche/Inspector Fees',
          originalBudget: 20097.0,
          adjustments: 0.0,
          currentBudget: 20097.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Legal',
          originalBudget: 110535.0,
          adjustments: 50000.0,
          currentBudget: 160535.0,
          draw3: 30000.0,
          draw3originalBudget: 30000.0,
          draw3currentBudget: 30000.0,
          draw2: 20000.0,
          draw2originalBudget: 20000.0,
          draw2currentBudget: 20000.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Fees & Interest Subtotal',
          originalBudget: 854133.0,
          adjustments: 50000.0,
          currentBudget: 904133.0,
          draw3: 30000.0,
          draw3originalBudget: 30000.0,
          draw3currentBudget: 30000.0,
          draw2: 20000.0,
          draw2originalBudget: 20000.0,
          draw2currentBudget: 20000.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
          type: 'subtotal',
        },
      ],
    },
    {
      category: 'Soft Costs',
      items: [
        {
          name: 'Architect',
          originalBudget: 241167.0,
          adjustments: 0.0,
          currentBudget: 241167.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Engineering',
          originalBudget: 70243.0,
          adjustments: 0.0,
          currentBudget: 70243.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Title Insurance',
          originalBudget: 38184.0,
          adjustments: 0.0,
          currentBudget: 38184.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Environmental',
          originalBudget: 48233.0,
          adjustments: 0.0,
          currentBudget: 48233.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Soft Cost Contingency',
          originalBudget: 45000.0,
          adjustments: -50000.0,
          currentBudget: -5000.0,
          draw3: -50000.0,
          draw3originalBudget: -50000.0,
          draw3currentBudget: -50000.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'General Requirements',
          originalBudget: 4403413.0,
          adjustments: 0.0,
          currentBudget: 4403413.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Soft Costs Subtotal',
          originalBudget: 442827.0,
          adjustments: -50000.0,
          currentBudget: 392827.0,
          draw3: -50000.0,
          draw3originalBudget: -50000.0,
          draw3currentBudget: -50000.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
          type: 'subtotal',
        },
      ],
    },
    {
      category: 'Hard Costs',
      items: [
        {
          name: 'Site Acquisition',
          originalBudget: 10008388.0,
          adjustments: 0.0,
          currentBudget: 10008388.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Concrete',
          originalBudget: 13469621.0,
          adjustments: 0.0,
          currentBudget: 13469621.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Masonary',
          originalBudget: 5212000.0,
          adjustments: 0.0,
          currentBudget: 5212000.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Metal',
          originalBudget: 3006000.0,
          adjustments: 0.0,
          currentBudget: 3006000.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Wood & Plastics',
          originalBudget: 17065031.0,
          adjustments: 0.0,
          currentBudget: 17065031.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Thermal & Moisture',
          originalBudget: 7839433.0,
          adjustments: 0.0,
          currentBudget: 7839433.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Openings',
          originalBudget: 4016949.0,
          adjustments: 0.0,
          currentBudget: 4016949.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Finishes',
          originalBudget: 4016949.0,
          adjustments: 0.0,
          currentBudget: 4016949.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Specialities',
          originalBudget: 46231.0,
          adjustments: 0.0,
          currentBudget: 46231.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Hard Cost Contingency',
          originalBudget: 45000.0,
          adjustments: -50000.0,
          currentBudget: -5000.0,
          draw3: -50000.0,
          draw3originalBudget: -50000.0,
          draw3currentBudget: -50000.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Hard Costs Subtotal',
          originalBudget: 10008388.0,
          adjustments: 0.0,
          currentBudget: 10008388.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
          type: 'subtotal',
        },
      ],
    },
  ];

  const headers: BaseHeaderProps[] = [
    { title: 'Line Item Name', classname: 'text-center', key: 'name' },
    {
      title: 'Original Budget',
      classname: 'text-center',
      key: 'originalBudget',
    },
    { title: 'Adjustments', classname: 'text-center', key: 'adjustments' },
    { title: 'Current Budget', classname: 'text-center', key: 'currentBudget' },
    {
      title: 'Amount Requested (Net)',
      classname: 'text-center',
      key: 'amountRequestedNet',
    },
    { title: 'Amount Used', classname: 'text-center', key: 'amountUsed' },
    {
      title: 'Balance To Fund',
      classname: 'text-center',
      key: 'balanceToFund',
    },
    {
      title: '% Remaining (Net)',
      classname: 'text-center',
      key: 'percentRemainingNet',
    },
  ];

  const [selectedTableView, setSelectedTableView] = useState<'current_budget' | 'adjustment_over'>(
    'current_budget',
  );
  const [budgeHeaders, setBudgetHeaders] = useState<BaseHeaderProps[]>(headers);
  const admin = useRecoilValue(userRole);

  useEffect(() => {
    if (admin) {
      const adminColumns = [
        {
          title: 'Amount Requested (Gross)',
          classname: 'text-center',
          key: 'amountRequestedGross',
        },
        {
          title: 'Interest Retainage',
          classname: 'text-center',
          key: 'interestRetainage',
        },
        { title: 'Retainage', classname: 'text-center', key: 'retainage' },
      ];
      setBudgetHeaders(prev => [...prev, ...adminColumns]);
    }
  }, [admin]);

  return (
    <div>
      <BudgetTabHeader />
      <BudgetFilter
        selectedTab={'draw budget'}
        setSelectedTableView={setSelectedTableView}
        selectedTableView={selectedTableView}
      />
      {selectedTableView === 'current_budget' && (
        <LedgerTypeTable data={budgetData} headers={budgeHeaders} />
      )}
      {selectedTableView === 'adjustment_over' && <AdjustmentOverTime data={adjustmentData} />}
    </div>
  );
};

export default Budget;
