"use client"
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useLedgerTransactions from './hooks/use-ledger-ransactions';
import BasicTable from '@/components/global/basic-table';
import useLedgerDetails from './hooks/use-ledger-details';
import { ColumnDef } from '@tanstack/react-table';
import { formatDate, formatINR } from '@/utils/formatter';

export const accountsColumns = [
  {
    header: 'ID',
    accessorKey: 'id',
  },
  {
    header: 'Account Name',
    accessorKey: 'name',
  },
  {
    header: 'Balance',
    accessorKey: 'balance',
  },
  {
    header: 'Account Number',
    accessorKey: 'account_number',
  },
  {
    header: 'Link',
    accessorKey: 'actions',
    //@ts-expect-error row types
    cell: ({ row }) => {
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
            className="px-4 py-2 text-sm text-white bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700"
            onClick={openDialog}
          >
            Transactions
          </Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="border-none background max-w-[80%]">
              <DialogHeader>
                <DialogTitle className="text-2xl text-white">Transactions</DialogTitle>
              </DialogHeader>
              <div>
                {transactions && transactions.length > 0 ? (
                  <BasicTable
                    data={transactions}
                    columns={transactionColumns}
                    filters={[]}
                    needFilters={false}                />
                ) : (
                  <h1 className="text-2xl font-semibold text-center">
                    No Transactions available for this account
                  </h1>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  }
]
export const transactionColumns: ColumnDef<any>[] = [
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
    cell: ({ getValue }) => getValue() || '-',
  },
  {
    header: 'Timestamp',
    accessorKey: 'timestamp',
    cell: ({ getValue }) => {
      const date = getValue();
      return date && typeof date === "string" ? formatDate(date) : "-";
      },
  },
  {
    header: 'From Account',
    accessorKey: 'from_account',
    cell: ({ getValue }) => {
      const { accounts, otherAccounts } = useLedgerDetails();
      const allAccounts = [...accounts, ...otherAccounts];
      const account = allAccounts.find(acc => acc.id === getValue());
      return account ? account.name : '~';
    },
  },
  {
    header: 'To Account',
    accessorKey: 'to_account',
    cell: ({ getValue }) => {
      const { accounts, otherAccounts } = useLedgerDetails();
      const allAccounts = [...accounts, ...otherAccounts];
      const account = allAccounts.find(acc => acc.id === getValue());
      return account ? account.name : '~';
    },
  },
  {
    header: 'Balance',
    accessorKey: 'balance',
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return formatINR(value);
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
