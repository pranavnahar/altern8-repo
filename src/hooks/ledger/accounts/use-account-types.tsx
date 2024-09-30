import { useEffect, useState } from "react";
import {
  createAccountsTypes,
  getAccountsTypes,
} from "../../../Utils/ledger/accounts/account-service";

export const useAccountTypes = (
  isVirtual: boolean,
  setIsVirtual: () => void
) => {
  const [newAccountType, setNewAccountType] = useState<{
    key?: string;
    description: string;
  }>({ description: "" });
  const [accountsTypes, setAccountsTypes] = useState([]);
  const [onAccountAdd, setOnAccountAdd] = useState(false);

  const handleAddNewAccountType = async () => {
    try {
      const data = {
        description: newAccountType.description,
        is_virtual: isVirtual,
      };
      await createAccountsTypes(data);
      setNewAccountType({ key: "", description: "" });
      setOnAccountAdd(true);
    } catch (error) {
      console.error("Failed to add new account type:", error);
    } finally {
      handleFetchAccountsTypes();
    }
  };

  const handleNewAccountTypeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const description = e.target.value;
    setNewAccountType({
      description: description,
    });
  };

  const handleFetchAccountsTypes = async () => {
    try {
      const data = await getAccountsTypes();
      setAccountsTypes(data);
    } catch (error) {
      console.error("Failed to fetch accounts types:", error);
    }
  };

  useEffect(() => {
    handleFetchAccountsTypes();
  }, [onAccountAdd]);

  return {
    accountsTypes,
    newAccountType,
    isVirtual,
    setIsVirtual,
    handleAddNewAccountType,
    handleNewAccountTypeChange,
    handleFetchAccountsTypes,
  };
};
