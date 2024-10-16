import { getTransactions } from '@/utils/ledger/ledgerService';
import { useState, useEffect } from 'react';

const useLedgerTransactions = (id: string) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchTransactions = async (id: string) => {
    if (id) {
      try {
        setIsLoading(true);
        const data = await getTransactions(id);
        const approvedTransactions = data.transactions.filter(
          (transaction: any) => transaction.approved === true,
        );
        setTransactions(approvedTransactions);
        return true;
      } catch (error) {
        return false;
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    handleFetchTransactions(id);
  }, []);

  return {
    isLoading,
    transactions,
    handleFetchTransactions,
  };
};

export default useLedgerTransactions;
