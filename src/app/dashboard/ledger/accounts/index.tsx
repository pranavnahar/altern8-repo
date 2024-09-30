import React, { useEffect, useState } from "react";
import BasicTable from "../../../components/dashboard/table/BasicTable";
import useAccounts from "../../../../hooks/ledger/accounts/use-accounts";
import { useAccountTypes } from "../../../../hooks/ledger/accounts/use-account-types";
import { getColumns } from "../../../config/ledger/accounts/constants";
import AddAccountButton from "../../../../components/ledger/accounts/add-account-button";
import TableSkeleton from "@/components/dashboard/ledger/_components/table-skeleton";

const Index = () => {
  const [isVirtual, setIsVirtual] = useState(false);
  const [isVirtualAccountSelected, setIsVirtualAccountSelected] = useState();
  const { accountsTypes } = useAccountTypes();
  const [accountToEdit, setAccountToEdit] = useState(false);
  const {
    isLoading,
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

  const COLUMNS = getColumns(
    isVirtual,
    setIsVirtual,
    accountsTypes,
    isVirtualAccountSelected
  );

  return (
    <div className="flex flex-col gap-6 py-7">
      <div className="grid grid-cols-3">
        <div></div>
        <h1 className="text-5xl font-medium text-center text-white-font">
          Accounts
        </h1>
        <div className="flex justify-end gap-5 ml-auto max-w-max">
          {!isLoading && (
            <AddAccountButton
              isVirtual={isVirtual}
              setIsVirtual={setIsVirtual!}
              isVirtualAccountSelected={isVirtualAccountSelected!}
              handleFetchAccounts={handleFetchAccounts}
              accounts={accounts}
              accountData={accountData!}
              setLinkedRealAccount={setLinkedRealAccount}
              handleInputChange={handleInputChange}
              handleAddAccount={handleAddAccount}
            />
          )}
        </div>
      </div>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <BasicTable
          data={accounts}
          columns={COLUMNS}
          statusColors={{}}
          filters={[]}
        />
      )}
    </div>
  );
};

export default Index;
