import React, { useState, useMemo } from "react";
import useLedgerTransactions from "../../../../hooks/ledger/transactions/use-ledger-transactions";
import useTransactionForm from "../../../../hooks/ledger/transactions/use-transactions-form";
import AccountSelect from "../../../../components/ledger/transactions/account-select";
import BasicTable from "../../../../components/dashboard/BasicTable";
import { transactionsAccountsColumns, transactionsColumns } from "./constants";
import useAccounts from "../../../../hooks/ledger/accounts/use-accounts";
import TableSkeleton from "../../../../components/ledger/_components/table-skeleton";
import TransactionUpload from "../../../../components/ledger/transactions/transaction-upload";
import TransactionDownload from "../../../../components/ledger/transactions/transaction-download";
import { showToast } from "../../../../Utils/showToast";
import TransactionSheet from "../../../../components/ledger/transactions/transaction-sheet";
import { Column, DataRow } from "@/components/dashboard/types";

const Index = () => {
  const { accounts } = useAccounts();
  const {
    accountTransactionsList = [],
    transactionsList = [],
    invoiceIds = [],
    loading,
    handleFetchTransactions,
    handleFetchAccountTransactions,
  } = useLedgerTransactions();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState("all");
  const { formData } = useTransactionForm();
  //handleFetchTransactions

  const handleAccountSelect = (accountId?: string) => {
    setSelectedAccountId(accountId!);
    if (accountId === "all") return transactionsList;
    handleFetchAccountTransactions(accountId!);
  };

  const handleUploadSuccess = () => {
    showToast(`Uploaded successfully`, "true");
  };

  const combinedTransactions = useMemo(
    () => [
      //@ts-expect-error approved_transactions not present
      ...(accountTransactionsList.approved_transactions || []),
      //@ts-expect-error approved_transactions not present
      ...(accountTransactionsList.not_approved_transactions || []),
    ],
    [accountTransactionsList]
  );

  return (
    <div className="flex flex-col gap-6 py-7 overflow-x-hidden">
      <div className="grid grid-cols-3 pb-5">
        <AccountSelect
          accounts={accounts}
          onSelect={handleAccountSelect}
          selectedAccount={selectedAccountId}
        />
        <h1 className="text-5xl font-medium text-center text-white">
          Transactions
        </h1>
        <div className="flex justify-end gap-5 ml-auto max-w-max">
          <TransactionUpload onUploadSuccess={handleUploadSuccess} />
          <TransactionDownload />
          <TransactionSheet
            formData={formData}
            invoiceIds={invoiceIds}
            accounts={accounts}
            isOpen={isSheetOpen}
            onOpenChange={setIsSheetOpen}
            mode="add"
            handleFetchTransactions={handleFetchTransactions}
          />
        </div>
      </div>
      {loading ? (
        <TableSkeleton />
      ) : selectedAccountId === "all" ? (
        <BasicTable
          data={transactionsList as unknown as DataRow[]}
          columns={transactionsColumns(handleFetchTransactions) as Column[]}
          //statusColors={{}}
          filters={[]}
        />
      ) : (
        <BasicTable
          data={combinedTransactions}
          columns={
            transactionsAccountsColumns(handleFetchTransactions) as Column[]
          }
          //statusColors={{}}
          filters={[]}
        />
      )}
      <>
        {selectedAccountId !== "all" && (
          <div className="flex justify-end w-full px-4 py-2 mt-5 ml-auto tracking-tight text-right rounded-md hover:bg-white/20 max-w-max bg-white/20">
            <span className="text-base text-white">
              Account Balance: ₹{" "}
              {(() => {
                const selectedAccount: { balance: string } = accounts.find(
                  (acc: { id: number }) =>
                    acc.id === parseInt(selectedAccountId)
                )!;
                if (selectedAccount) {
                  const balance = parseFloat(selectedAccount.balance);
                  return balance.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  });
                }
                return "0.00";
              })()}
            </span>
          </div>
        )}
      </>
    </div>
  );
};

export default Index;
