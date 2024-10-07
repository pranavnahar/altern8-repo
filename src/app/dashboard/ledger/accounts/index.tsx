import React, { useEffect, useState } from "react";
import BasicTable from "../../../../components/dashboard/BasicTable";
import useAccounts from "../../../../hooks/ledger/accounts/use-accounts";
import { useAccountTypes } from "../../../../hooks/ledger/accounts/use-account-types";
import { getColumns } from "./constant";
import AddAccountButton from "../../../../components/ledger/accounts/add-account-button";
import TableSkeleton from "../../../../components/ledger/_components/table-skeleton";
import { Column } from "@/components/dashboard/types";

const Index = () => {
  const [isVirtual, setIsVirtual] = useState(false);
  const [isVirtualAccountSelected, setIsVirtualAccountSelected] =
    useState<boolean>();
  const { accountsTypes } = useAccountTypes();
  const [accountToEdit] = useState();
  const {
    loading,
    accounts,
    handleFetchAccounts,
    accountData,
    setLinkedRealAccount,
    handleInputChange,
    handleAddAccount,
  } = useAccounts(accountsTypes, accountToEdit, isVirtual, setIsVirtual);

  useEffect(() => {
    if (isVirtual) {
      setIsVirtualAccountSelected(true);
    } else {
      setIsVirtualAccountSelected(false);
    }
  }, [isVirtual]);

  const COLUMNS = getColumns(accountsTypes);

  return (
    <div className="flex flex-col gap-6 py-7">
      <div className="grid grid-cols-3">
        <h1 className="text-5xl font-medium text-center text-white-font">
          Accounts
        </h1>
        <div className="flex justify-end gap-5 ml-auto max-w-max">
          {!loading && (
            <AddAccountButton
              isVirtual={isVirtual}
              setIsVirtual={setIsVirtual!}
              isVirtualAccountSelected={isVirtualAccountSelected!}
              handleFetchAccountsTypes={handleFetchAccounts}
              accounts={accounts}
              accountData={accountData!}
              setLinkedRealAccount={setLinkedRealAccount}
              handleInputChange={handleInputChange}
              handleAddAccount={handleAddAccount}
            />
          )}
        </div>
      </div>
      {loading ? (
        <TableSkeleton />
      ) : (
        <BasicTable
          data={accounts}
          columns={COLUMNS as Column[]}
          //statusColors={{}}
          filters={[]}
        />
      )}
    </div>
  );
};

export default Index;
