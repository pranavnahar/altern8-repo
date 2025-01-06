import BasicTable from '@/components/global/basic-table';
import { getLedgerDetails } from './actions';
import TransactionSheet from './components/transaction-sheet';
import { accountsColumns } from './columns';
import TransactionUpload from './components/transaction-upload';
import TransactionDownload from './components/transcation-download';

const Page = async () => {
  const { accounts, otherAccounts, trancheIDs } = await getLedgerDetails();
  const allAccounts = [...accounts, ...otherAccounts];

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-3">
        <div></div>
        <h1 className="text-5xl text-center font-relative-medium text-white-font">Accounts</h1>
        <div className="flex items-center gap-5">
          <TransactionUpload />
          <TransactionDownload />
          <TransactionSheet accounts={allAccounts} trancheIds={trancheIDs} mode="add" />
        </div>
      </div>
      <BasicTable
        data={accounts}
        columns={accountsColumns}
        filters={[]}
        needFilters={false}
        tableName="ledger-accounts-view-table"
      />
    </div>
  );
};

export default Page;
