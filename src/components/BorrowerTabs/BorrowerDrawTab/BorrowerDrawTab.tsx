import React from 'react';
import Tab from '../../Tabs/Tabs';
import { tabsProps } from '../../ProjectDetailTabs/PageTab/PageTab';
import BorrowerOverview from './BorrowerOverView';
import { BudgetSection } from '../../../app/(dashboard)/draw/[id]/page';
import { BudgetTabHeader } from '../../../app/(dashboard)/draw/[id]/BudgetTabHeader';
import BudgetFilter from '../../../components/LedgerTypeTable/Filter';
import LedgerTypeTable from '../../../components/LedgerTypeTable/LedgerTypeTable';
import { BaseHeaderProps } from '../../../lib/componentProps';

const BorrowerDrawTab = () => {
  const budgetData: BudgetSection[] = [
    {
      title: 'Fees & Interest',
      isOpen: false,
      items: [
        {
          name: 'Interest Reserves',
          originalBudget: '₹ 120,583.00',
          adjustments: '₹ 0.00',
          currentBudget: '₹ 120,583.00',
          amountRequestedGross: '₹ 0.00',
          retainage: '₹ 0.00',
          amountUsed: '10,000',
          interestRetainage: '100',
          amountRequestedNet: '₹ 0.00',
          balanceToFund: '₹ 120,583.00',
          percentRemainingNet: '100%',
        },
        {
          name: 'Development Fee',
          originalBudget: '₹ 602,918.00',
          adjustments: '₹ 0.00',
          currentBudget: '₹ 602,918.00',
          amountRequestedGross: '₹ 81,000.00',
          retainage: '₹ 0.00',
          amountUsed: '10,000',
          interestRetainage: '100',
          amountRequestedNet: '₹ 81,000.00',
          balanceToFund: '₹ 521,918.00',
          percentRemainingNet: '87%',
        },
      ],
    },
    {
      title: 'Soft Costs',
      isOpen: false,
      items: [
        {
          name: 'Architect',
          originalBudget: '₹ 241,167.00',
          adjustments: '₹ 0.00',
          currentBudget: '₹ 241,167.00',
          amountRequestedGross: '₹ 167,350.00',
          retainage: '₹ 0.00',
          amountUsed: '10,000',
          interestRetainage: '100',
          amountRequestedNet: '₹ 167,350.00',
          balanceToFund: '₹ 73,817.00',
          percentRemainingNet: '31%',
        },
      ],
    },
    {
      title: 'Hard Costs',
      isOpen: false,
      items: [
        {
          name: 'Site Acquisition',
          originalBudget: '₹ 1,205,836.00',
          adjustments: '₹ 0.00',
          currentBudget: '₹ 1,205,836.00',
          amountRequestedGross: '₹ 0.00',
          retainage: '₹ 0.00',
          amountUsed: '10,000',
          interestRetainage: '100',
          amountRequestedNet: '₹ 0.00',
          balanceToFund: '₹ 1,205,836.00',
          percentRemainingNet: '0%',
        },
      ],
    },
  ];

  const headers: BaseHeaderProps[] = [
    { title: 'Name', classname: 'text-center', key: 'name' },
    {
      title: 'Original Budget',
      classname: 'text-center',
      key: 'originalBudget',
    },
    { title: 'Adjustments', classname: 'text-center', key: 'adjustments' },
    { title: 'Current Budget', classname: 'text-center', key: 'currentBudget' },
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

  //tabs as object
  const tabs: tabsProps[] = [
    {
      name: 'Overview',
      content: <BorrowerOverview />,
    },
    {
      name: 'Budget',
      content: (
        <div>
          <BudgetTabHeader />
          <BudgetFilter selectedTab={'draw budget'} />
          <LedgerTypeTable data={budgetData} headers={headers} />
        </div>
      ),
    },
  ];

  return <Tab tabsList={tabs} />;
};

export default BorrowerDrawTab;
