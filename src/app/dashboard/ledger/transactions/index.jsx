import React, { useState, useMemo, useEffect } from 'react';
import useLedgerTransactions from '../../../hooks/ledger/transactions/use-ledger-transactions';
import useTransactionForm from '../../../hooks/ledger/transactions/use-transactions-form';
import AccountSelect from '../../../components/dashboard/ledger/transactions/account-select';
import BasicTable from '../../../components/dashboard/table/BasicTable';
import { transactionsAccountsColumns, transactionsColumns } from '../../../config/ledger/transactions/constants';
import useAccounts from '../../../hooks/ledger/accounts/use-accounts';
import TableSkeleton from '../../../components/dashboard/ledger/_components/table-skeleton';
import TransactionUpload from '@/components/dashboard/ledger/transactions/transaction-upload';
import TransactionDownload from '@/components/dashboard/ledger/transactions/transaction-download';
import { showToast } from '@/helpers/show-toast';
import TransactionSheet from '../../../components/dashboard/ledger/transactions/transaction-sheet';

const Index = () => {
  const { accounts } = useAccounts();
  const { accountTransactionsList = [], transactionsList = [], invoiceIds = [], isLoading, handleFetchTransactions, handleFetchAccountTransactions } = useLedgerTransactions();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState('all');
  const { formData } = useTransactionForm(handleFetchTransactions);

  const handleAccountSelect = (accountId) => {
    setSelectedAccountId(accountId);
    if (accountId === 'all') return transactionsList;
    handleFetchAccountTransactions(accountId);
  };

  const handleUploadSuccess = () => {
    showToast(`Uploaded successfully`, true);
  };

  const combinedTransactions = useMemo(() => [
    ...(accountTransactionsList.approved_transactions || []),
    ...(accountTransactionsList.not_approved_transactions || []),
  ], [accountTransactionsList]);

  return (
    <div className="py-10">
      <div className="grid grid-cols-3 pb-5">
        <AccountSelect
          accounts={accounts}
          onSelect={handleAccountSelect}
          selectedAccount={selectedAccountId}
        />
        <h1 className="text-5xl font-medium text-center text-white-font">Transactions</h1>
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
      {isLoading ? (
        <TableSkeleton />
      ) : (
        selectedAccountId === 'all' ? (
          <BasicTable
            data={transactionsList}
            columns={transactionsColumns(handleFetchTransactions)}
            statusColors={{}}
            filters={[]}
          />
        ) : (
          <BasicTable
            data={combinedTransactions}
            columns={transactionsAccountsColumns(handleFetchTransactions)}
            statusColors={{}}
            filters={[]}
          />
        )
      )}
      <>
        {selectedAccountId !== 'all' && (
          <div className='flex justify-end w-full px-4 py-2 mt-5 ml-auto tracking-tight text-right rounded-md hover:bg-white/20 max-w-max bg-white/20'>
            <span className="text-base text-white">
              Account Balance: ₹{' '}
              {(() => {
                const selectedAccount = accounts.find(acc => acc.id === parseInt(selectedAccountId));
                if (selectedAccount) {
                  const balance = parseFloat(selectedAccount.balance);
                  return balance.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  });
                }
                return '0.00';
              })()}
            </span>
          </div>
        )}
      </>
    </div>
  );
};

export default Index;
