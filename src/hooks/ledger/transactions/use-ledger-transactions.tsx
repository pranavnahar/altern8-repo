import {
  getAccountTransactions,
  getInvoiceIds,
  getTransactions,
  uploadBulkTransactions,
  downloadBulkTransactions,
} from "../../../Utils/ledger/transactions/transactions-service";
import { useState, useEffect, useCallback } from "react";

const useLedgerTransactions = () => {
  const [state, setState] = useState<{
    transactionsList: any[];
    accountTransactionsList: any[];
    invoiceIds: any[];
    isDownloading: boolean;
    downloadError: null | string | Error;
  }>({
    transactionsList: [],
    accountTransactionsList: [],
    invoiceIds: [],
    isDownloading: false,
    downloadError: null,
  });

  const fetchData = useCallback(
    async (fetchFn: () => void, stateProp: string) => {
      try {
        const data = await fetchFn();
        setState((prev) => ({ ...prev, [stateProp]: data }));
      } catch (error) {
        console.error(`Failed to fetch ${stateProp}:`, error);
      }
    },
    []
  );

  const handleFetchTransactions = useCallback(
    () => fetchData(getTransactions, "transactionsList"),
    [fetchData]
  );
  const handleFetchAccountTransactions = useCallback(
    (id: string) =>
      fetchData(() => getAccountTransactions(id), "accountTransactionsList"),
    [fetchData]
  );
  const handleFetchInvoiceIds = useCallback(
    () =>
      fetchData(async () => {
        const { invoice_product_ids } = await getInvoiceIds();
        return invoice_product_ids;
      }, "invoiceIds"),
    [fetchData]
  );

  const handleBulkUpload = async (data: FormData) => {
    try {
      const response = await uploadBulkTransactions(data);
      await handleFetchTransactions();
      return response;
    } catch (error) {
      console.error("Failed to upload transaction:", error);
    }
  };

  const handleDownloadTemplate = async () => {
    setState((prev) => ({ ...prev, isDownloading: true, downloadError: null }));
    try {
      await downloadBulkTransactions();
    } catch (error) {
      console.error("Failed to download template:", error);
      setState((prev) => ({
        ...prev,
        downloadError: "Failed to download template",
      }));
    } finally {
      setState((prev) => ({ ...prev, isDownloading: false }));
    }
  };

  useEffect(() => {
    handleFetchTransactions();
    handleFetchInvoiceIds();
  }, [handleFetchTransactions, handleFetchInvoiceIds]);

  return {
    ...state,
    handleFetchTransactions,
    handleFetchAccountTransactions,
    handleFetchInvoiceIds,
    handleBulkUpload,
    handleDownloadTemplate,
  };
};

export default useLedgerTransactions;
