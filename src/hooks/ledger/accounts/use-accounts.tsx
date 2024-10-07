import React, { useState, useEffect } from "react";
import {
  addAccount,
  editAccountTypes,
  getAccounts,
  changeAccountStatus,
} from "../../../Utils/ledger/accounts/account-service";

interface AccountData {
  description: string;
  is_virtual: boolean;
}

interface AccountType {
  id: string;
  is_virtual: boolean;
}

const useAccounts = (
  accountsTypes?: AccountType[],
  accountToEdit = null,
  isVirtual?: boolean,
  setIsVirtual?: (s: boolean) => void
) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [accountData, setAccountData] = useState<{
    name: string;
    account_number: string;
    account_type: string;
    linked_real_account?: string;
  }>(
    accountToEdit || {
      name: "",
      account_number: "",
      account_type: "",
      linked_real_account: "",
    }
  );
  const [linkedRealAccount, setLinkedRealAccount] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = e.target.value;
    setAccountData({ ...accountData, [field]: value });

    if (field === "account_type") {
      const selectedAccountType = accountsTypes?.find(
        (type) => type.id === value
      );
      if (selectedAccountType && setIsVirtual) {
        setIsVirtual(selectedAccountType.is_virtual);
      }
    }
  };

  const handleAddAccount = async () => {
    setLoading(true);
    try {
      const accountToAdd = { ...accountData };
      if (isVirtual && linkedRealAccount) {
        accountToAdd.linked_real_account = linkedRealAccount;
      }
      await addAccount(accountToAdd);
      setAccountData({
        name: "",
        account_number: "",
        account_type: "",
      });
      setLinkedRealAccount("");
      if (setIsVirtual) setIsVirtual(false);
    } catch (error) {
      console.error("Failed to add account:", error);
    } finally {
      handleFetchAccounts();
      setLoading(false);
    }
  };

  const handleEditAccount = async (accountData: AccountData) => {
    setLoading(true);
    try {
      const response = await editAccountTypes(accountData);
      const updatedAccount = await response.json();
      setLoading(false);
      return updatedAccount;
    } catch (error) {
      console.error("Error editing account:", error);
      setLoading(false);
      return null;
    }
  };

  const handleFetchAccounts = async () => {
    setLoading(true);
    try {
      const data = await getAccounts();
      setAccounts(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch accounts types:", error);
      setLoading(false);
    }
  };

  const handleToggleAccountStatus = async (
    accountId: string,
    currentStatus: string
  ) => {
    const action = currentStatus ? "deactivate" : "activate";
    setLoading(true);
    try {
      await changeAccountStatus(accountId, action);
      return !currentStatus;
      setLoading(false);
    } catch (error) {
      console.error("Error updating account status:", error);
      setLoading(false);
      return currentStatus;
    }
  };

  useEffect(() => {
    handleFetchAccounts();
  }, []);

  return {
    accounts,
    accountData,
    isVirtual,
    setIsVirtual,
    linkedRealAccount,
    setLinkedRealAccount,
    handleInputChange,
    handleAddAccount,
    handleEditAccount,
    handleFetchAccounts,
    handleToggleAccountStatus,
    loading,
  };
};

export default useAccounts;
