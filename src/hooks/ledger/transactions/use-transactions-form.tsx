import { useState } from "react";
import { toast } from "react-toastify";
import {
  approveTransactions,
  createTransactions,
} from "../../../Utils/ledger/transactions/transactions-service";

const useTransactionForm = () => {
  const [showAddTransactionBox, setShowAddTransactionBox] = useState(false);
  const [formData, setFormData] = useState<{
    transaction_id: string;
    purpose: string;
    amount: string;
    description: string;
    approved: boolean;
    status: string;
    type?: string;
    receipt: null;
    timestamp: string;
    invoice_product: string;
    from_account: string;
    to_account: string;
  }>({
    transaction_id: "",
    purpose: "",
    amount: "",
    description: "",
    approved: false,
    status: "",
    type: "",
    receipt: null,
    timestamp: "",
    invoice_product: "",
    from_account: "",
    to_account: "",
  });

  const resetFormData = () => {
    setFormData({
      transaction_id: "",
      purpose: "",
      amount: "",
      description: "",
      approved: false,
      status: "",
      receipt: null,
      timestamp: new Date().toLocaleTimeString(),
      invoice_product: "",
      from_account: "",
      to_account: "",
    });
  };

  const handleSubmit = async (
    submitFunction: { (data: FormData): void },
    data: FormData
  ) => {
    try {
      submitFunction(data);
      resetFormData();
      return true;
    } catch (error) {
      toast.error(String(error), { autoClose: false });
      return false;
    }
  };

  return {
    showAddTransactionBox,
    formData,
    handleAddTransactionSubmit: (data: FormData | { [key: string]: string }) =>
      handleSubmit(createTransactions, data as FormData),
    handleApproveTransactionSubmit: (
      data: FormData | { [key: string]: string }
    ) => handleSubmit(approveTransactions, data as FormData),
    handleAddTransactionButton: () => setShowAddTransactionBox(true),
    handleCloseTransactionBoxButton: () => setShowAddTransactionBox(false),
  };
};

export default useTransactionForm;
