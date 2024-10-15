import { Button } from '@/components/ui/button';
import { useState } from 'react';
import BasicTable from '@/components/dashboard/BasicTable';
import useLedgerTransactions from '@/hooks/ledger/useLedgerTransactions';
import useLedgerDetails from '@/hooks/ledger/useLedgerDetails';
import CustomDialog from '@/components/ledger/_components/customLedgerDialog';
import { Column } from '@/components/dashboard/types';

export const accountsColumns = [
  {
    header: 'ID',
    accessorKey: 'id', // Valid accessor for the "ID" column
  },
  {
    header: 'Account Name',
    accessorKey: 'name', // Valid accessor for the "Account Name" column
  },
  {
    header: 'Balance',
    accessorKey: 'balance', // Valid accessor for the "Balance" column
  },
  {
    header: 'Account Number',
    accessorKey: 'account_number', // Valid accessor for the "Account Number" column
  },
  {
    header: 'Link', // Header for the "Link" column
    accessorKey: 'actions', // Key for rendering the column
    //@ts-expect-error row types
    cell: ({ row }) => {
      console.log('reeooww', row);
      const [isOpen, setIsOpen] = useState(false);
      const id = row.original.id;
      const { handleFetchTransactions, transactions } = useLedgerTransactions(id);

      const openDialog = () => {
        handleFetchTransactions(id);
        setIsOpen(true);
      };

      return (
        <>
          <Button
            size="sm"
            className="px-4 py-2text-sm text-white bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700"
            onClick={openDialog}
          >
            Transactions
          </Button>
          <CustomDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <h2 className="mb-4 text-2xl text-white">Transactions</h2>
            {transactions && transactions.length > 0 ? (
              <BasicTable
                data={transactions}
                columns={transactionsColumns as Column[]}
                //statusColors={{}}
                filters={[]}
              />
            ) : (
              <h1 className="text-2xl font-semibold text-center text-white">
                No Transactions available for this account
              </h1>
            )}
          </CustomDialog>
        </>
      );
    },
  },
];

export const transactionsColumns = [
  {
    header: 'ID',
    accessorKey: 'id',
  },
  {
    header: 'Invoice Product',
    accessorKey: 'invoice_product',
  },
  {
    header: 'Transaction ID',
    accessorKey: 'transaction_id',
  },
  {
    header: 'Amount',
    accessorKey: 'amount',
  },
  {
    header: 'Purpose',
    accessorKey: 'purpose',
  },
  {
    header: 'Description',
    accessorKey: 'description',
    cell: (info: { getValue: () => string }) => info.getValue() || '-',
  },
  {
    header: 'Timestamp',
    accessorKey: 'timestamp',
    cell: (info: { getValue: () => string | number | Date }) => {
      const dateObj = new Date(info.getValue());
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      return dateObj.toLocaleString('en-IN');
    },
  },
  {
    header: 'From Account',
    accessorKey: 'from_account',
    cell: (info: { getValue: () => string }) => {
      const { accounts, otherAccounts } = useLedgerDetails();
      const allAccounts = [...accounts, ...otherAccounts];
      //@ts-expect-error id not present
      const account: { name: string } = allAccounts.find(acc => acc.id === info.getValue())!;
      return account ? account.name : '~';
    },
  },
  {
    header: 'To Account',
    accessorKey: 'to_account',
    cell: (info: { getValue: () => string }) => {
      const { accounts, otherAccounts } = useLedgerDetails();
      const allAccounts = [...accounts, ...otherAccounts];
      //@ts-expect-error id not present
      const account: { name: string } = allAccounts.find(acc => acc.id === info.getValue())!;
      return account ? account.name : '~';
    },
  },
  {
    header: 'Balance',
    accessorKey: 'balance',
    cell: (info: { getValue: () => string }) => {
      return `₹ ${parseFloat(info.getValue()).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
];

export const TRANSACTION_PURPOSES = [
  'Principal',
  'Interest',
  'One time processing fees',
  'Platform fees',
  'Fractionalization fees',
  'Penalty',
  'Wallet fees',
  'Legal fees',
  'Insurance charges',
  'Prepayment',
  'Other charges',
];

export const TRANSACTION_TYPES = [
  { value: 'Debit', label: 'Debit (from admin account)' },
  { value: 'Credit', label: 'Credit (from admin account)' },
];

export const TRANSACTION_STATUS = [
  'Approved',
  'Pending for Approval',
  'In Progress',
  'Initiated',
  'Rejected',
  'Declined',
];
