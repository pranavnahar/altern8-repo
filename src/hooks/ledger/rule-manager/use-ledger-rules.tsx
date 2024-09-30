import { useState, useEffect } from "react";
import {
  addLedgerRule,
  deleteLedgerRule,
  getLedgerRules,
  updateLedgerRule,
} from "../../../Utils/ledger/rule-manager/rules-manager-service";

const useLedgerRules = () => {
  const [rules, setRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleFetchRules = async () => {
    setIsLoading(true);
    try {
      const data = await getLedgerRules();
      setRules(data);
    } catch (error) {
      console.error("Failed to fetch accounts types:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRules = async (data: {
    [key: string]: string | number | Date | null;
  }) => {
    setIsLoading(true);
    try {
      await addLedgerRule(data);
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRules = async (
    data: { [key: string]: string | number | Date | null },
    id: string
  ) => {
    setIsLoading(true);
    try {
      await updateLedgerRule(data, id);
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRules = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteLedgerRule(id);
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
      await handleFetchRules();
    }
  };

  useEffect(() => {
    handleFetchRules();
  }, []);

  return {
    rules,
    handleAddRules,
    handleUpdateRules,
    isLoading,
    handleFetchRules,
    handleDeleteRules,
  };
};

export default useLedgerRules;
