import { useState, useEffect } from 'react';
import { getLedgerDetails } from '../actions';
import { Account } from '../types';

interface LedgerDetails {
  invoiceIDs: string[];
  accounts: Account[];
  otherAccounts: Account[];
}

const useLedgerDetails = () => {
  const [invoiceIDs, setInvoiceIDs] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [otherAccounts, setOtherAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchLedgerDetails = async () => {
    try {
      setIsLoading(true);
      const data = await getLedgerDetails();
      if (data) {
        setInvoiceIDs(data.trancheIDs || []);
        setAccounts(data.accounts || []);
        setOtherAccounts(data.otherAccounts || []);
      }
      return true;
    } catch (error) {
      console.error('Error fetching ledger details:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchLedgerDetails();
  }, []);

  return {
    isLoading,
    invoiceIDs,
    accounts,
    otherAccounts,
    handleFetchLedgerDetails,
  };
};

export default useLedgerDetails;
