import Link from "next/link";
import { Switch } from "../../../../components/ui/switch";
import useLedgerTransactions from "../../../../hooks/ledger/transactions/use-ledger-transactions";
import useAccounts from "../../../../hooks/ledger/accounts/use-accounts";
import { useState } from "react";
import TransactionSheet from "../../../../components/ledger/transactions/transaction-sheet";

export const transactionsColumns = (
  handleFetchTransactions: () => Promise<void>
) => [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Transaction ID",
    accessorKey: "transaction_id",
  },
  {
    header: "Company Name",
    accessorKey: "company_name",
  },
  {
    header: "Purpose",
    accessorKey: "purpose",
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: (info: { getValue: () => void }) => {
      return `₹ ${parseFloat(info.getValue()!).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: (info: { getValue: () => void }) => info.getValue()! || "-",
  },
  {
    header: "Type",
    accessorKey: "type",
    cell: (info: { getValue: () => void; row: { index: number } }) => {
      const values = ["Recievable", "Virtual Transaction", "Bank Transaction"];
      return values[info.row.index % values.length];
    },
  },
  {
    header: "Approval Status",
    accessorKey: "approved",
    //@ts-expect-error rows not typed
    cell: ({ row }) => {
      const value = row.original.approved;
      const transactionData = row.original;
      const { accounts } = useAccounts();
      const { invoiceIds = [] } = useLedgerTransactions();
      const [isSheetOpen, setIsSheetOpen] = useState(false);
      const handleOpenSheet = () => setIsSheetOpen(true);

      return (
        <div className="flex items-center space-x-2">
          <Switch checked={value} onCheckedChange={() => handleOpenSheet()} />
          <TransactionSheet
            formData={transactionData}
            invoiceIds={invoiceIds}
            accounts={accounts}
            isOpen={isSheetOpen}
            onOpenChange={setIsSheetOpen}
            mode="edit"
            handleFetchTransactions={handleFetchTransactions}
          />
        </div>
      );
    },
  },
  {
    header: "Timestamp",
    accessorKey: "timestamp",
    cell: (info: { getValue: () => void }) => {
      const dateObj = new Date(info.getValue()!);
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return dateObj.toLocaleString("en-IN", options);
    },
  },
  {
    header: "Invoice Product",
    accessorKey: "invoice_product",
  },
  {
    header: "From Account",
    accessorKey: "from_account",
    cell: (info: { getValue: () => void }) => {
      const { accounts } = useAccounts();
      const account: { name: string } = accounts.find(
        (acc: { id: string }) => acc.id === info.getValue()!
      )!;
      return account ? account.name : "Unknown Account";
    },
  },
  {
    header: "Balance After",
    accessorKey: "from_account_balance_after",
    cell: (info: { getValue: () => void }) => {
      return `₹ ${parseFloat(info.getValue()!).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
  {
    header: "To Account",
    accessorKey: "to_account",
    cell: (info: { getValue: () => void }) => {
      const { accounts } = useAccounts();
      const account: { name: string } = accounts.find(
        (acc: { id: string }) => acc.id === info.getValue()!
      )!;
      return account ? account.name : "Unknown Account";
    },
  },
  {
    header: "Balance After",
    accessorKey: "to_account_balance_after",
    cell: (info: { getValue: () => void }) => {
      return `₹ ${parseFloat(info.getValue()!).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
  {
    header: "Receipt",
    accessorKey: "receipt",
    cell: (info: { getValue: () => void }) => {
      const value = info.getValue()!;
      if (value) {
        return (
          <Link href={value} target="_blank" rel="noopener noreferrer">
            <h1 className="text-blue-600 cursor-pointer">Receipt</h1>
          </Link>
        );
      } else {
        return "-";
      }
    },
  },
];

export const transactionsAccountsColumns = (
  handleFetchTransactions: () => Promise<void>
) => [
  {
    header: "Transaction ID",
    accessorKey: "transaction_id",
  },
  {
    header: "Purpose",
    accessorKey: "purpose",
  },
  {
    header: "From Account",
    accessorKey: "from_account_name",
  },
  {
    header: "To Account",
    accessorKey: "to_account_name",
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: (info: { getValue: () => void }) => {
      return `₹ ${parseFloat(info.getValue()!).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: (info: { getValue: () => void }) => info.getValue()! || "-",
  },
  {
    header: "Transaction Type",
    accessorKey: "transaction_type",
  },
  {
    header: "From Account Balance After",
    accessorKey: "from_account_balance_after",
    cell: (info: { getValue: () => void }) => {
      return `₹ ${parseFloat(info.getValue()!).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
  {
    header: "To Account Balance After",
    accessorKey: "to_account_balance_after",
    cell: (info: { getValue: () => void }) => {
      return `₹ ${parseFloat(info.getValue()!).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
  {
    header: "Approve Transaction",
    accessorKey: "approved",
    //@ts-expect-error rows not typed
    cell: ({ row }) => {
      const value = row.original.approved;
      let transactionData = row.original;
      transactionData.from_account = row.original.from_account_name;
      transactionData.to_account = row.original.to_account_name;
      const { accounts } = useAccounts();
      const { invoiceIds = [] } = useLedgerTransactions();
      const [isSheetOpen, setIsSheetOpen] = useState(false);
      const handleOpenSheet = () => setIsSheetOpen(true);
      console.log(transactionData, "transactionData");

      return (
        <div className="flex items-center space-x-2">
          <Switch checked={value} onCheckedChange={() => handleOpenSheet()} />
          <TransactionSheet
            formData={transactionData}
            invoiceIds={invoiceIds}
            accounts={accounts}
            isOpen={isSheetOpen}
            onOpenChange={setIsSheetOpen}
            mode="edit"
            handleFetchTransactions={handleFetchTransactions}
          />
        </div>
      );
    },
  },
  {
    header: "Timestamp",
    accessorKey: "timestamp",
    cell: (info: { getValue: () => void }) => {
      const dateObj = new Date(info.getValue()!);
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return dateObj.toLocaleString("en-IN", options);
    },
  },
];

export const TRANSACTION_PURPOSES = [
  "Principal",
  "Interest",
  "One time processing fees",
  "Platform fees",
  "Fractionalization fees",
  "Penalty",
  "Wallet fees",
  "Legal fees",
  "Insurance charges",
  "Prepayment",
  "Other charges",
];

export const TRANSACTION_TYPES = [
  { value: "Debit", label: "Debit (from admin account)" },
  { value: "Credit", label: "Credit (from admin account)" },
];

export const TRANSACTION_STATUS = [
  "Approved",
  "Pending for Approval",
  "In Progress",
  "Initiated",
  "Rejected",
  "Declined",
];
