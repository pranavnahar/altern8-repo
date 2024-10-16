import { getLedgerDetails } from '@/utils/ledger/ledgerService';
import { useState, useEffect } from 'react';

const useLedgerDetails = () => {
  const [invoiceIDs, setInvoiceIDs] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [otherAccounts, setOtherAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchLedgerDetails = async () => {
    try {
      setIsLoading(true);
      const data = await getLedgerDetails();
      setInvoiceIDs(data.invoice_ids || []);
      setAccounts(data.accounts || []);
      setOtherAccounts(data.other_accounts || []);
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
