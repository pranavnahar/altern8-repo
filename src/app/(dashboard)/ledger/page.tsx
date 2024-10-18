'use client';

import { useEffect, useState } from 'react';

import { accountsColumns } from '../../../config/ledger/columns';
import BasicTable from '../../../components/dashboard/BasicTable';
import TableSkeleton from '../../../components/ledger/_components/table-skeleton';
import useLedgerDetails from '../../../hooks/ledger/useLedgerDetails';
import TransactionSheet from '../../../components/ledger/transactions/transaction-sheet';
import useTransactionForm from '../../../hooks/ledger/useTransactionForm';
import { Column } from '../../../components/dashboard/types';

const Ledger = () => {
  const { accounts, otherAccounts, isLoading, invoiceIDs, handleFetchLedgerDetails } =
    useLedgerDetails();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { formData } = useTransactionForm();
  const allAccounts = [...accounts, ...otherAccounts];

  useEffect(() => {
    handleFetchLedgerDetails();
  }, [isSheetOpen]);

  return (
    <div className="min-h-screen py-10 pt-32 pr-10">
      <div className="flex justify-between items-center ">
        <h1 className="text-5xl text-center font-relative-medium text-white-font">Accounts</h1>
        <TransactionSheet
          accounts={allAccounts}
          //@ts-expect-error formdata types mismatched
          formData={formData}
          invoiceIds={invoiceIDs}
          isOpen={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          mode="add"
        />
      </div>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <BasicTable data={accounts} columns={accountsColumns as Column[]} filters={[]} />
      )}
    </div>
  );
};

export default Ledger;
