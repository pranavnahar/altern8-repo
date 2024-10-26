

import { useState, useEffect } from 'react';
import { getTransactions } from '../actions';
import { Transaction } from '../types';

const useLedgerTransactions = (id: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFetchTransactions = async (id: string) => {
    if (id) {
      try {
        setIsLoading(true);
        const data = await getTransactions(id);
        const approvedTransactions = data.transactions.filter(
          (transaction: Transaction) => transaction.approved === true,
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
