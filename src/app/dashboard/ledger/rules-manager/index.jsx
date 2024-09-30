import React, { useState } from 'react';
import RuleSheet from '../../../components/dashboard/ledger/rule-manager/rule-sheet';
import BasicTable from 'components/dashboard/table/BasicTable';
import { columns } from '@/config/ledger/rule-manager/constants';
import useAccounts from '@/hooks/ledger/accounts/use-accounts';
import useLedgerRules from '@/hooks/ledger/rule-manager/use-ledger-rules';
import TableSkeleton from '@/components/dashboard/ledger/_components/table-skeleton';

const Index = () => {
  const { isLoading, rules, handleAddRules, handleFetchRules } = useLedgerRules();
  const { accounts } = useAccounts();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 py-7 scroll">
      <div className="grid grid-cols-3">
        <div></div>
        <h1 className="text-5xl font-medium text-center text-white-font">Rules Manager</h1>
        <div className="flex justify-end gap-5 ml-auto max-w-max">
          {!isLoading && (
            <RuleSheet
              mode="add"
              rule={rules}
              accounts={accounts}
              isLoading={isLoading}
              isOpen={isSheetOpen}
              onOpenChange={setIsSheetOpen}
              handleAddRules={handleAddRules}
              handleFetchRules={handleFetchRules}
            />
          )}
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <BasicTable
          data={rules}
          columns={columns(accounts, handleFetchRules)}
          statusColors={{}}
          filters={[]}
        />
      )}
    </div>
  );
};

export default Index;
