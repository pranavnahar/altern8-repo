import { useState } from "react";
import {
  approveTransactions,
  createTransactions,
} from "../../../utils/ledger/transactions/transactions-service";
import { useToast } from "@/utils/show-toasts";

const useTransactionForm = () => {
  const [showAddTransactionBox, setShowAddTransactionBox] = useState<boolean>(false);
  const { showToast } = useToast()
  const [formData, setFormData] = useState<{
    transaction_id: string;
    purpose: string;
    amount: string;
    description: string;
    approved: string;
    status: string;
    type?: string;
    receipt: string;
    timestamp: string;
    invoice_product: string;
    from_account: string;
    to_account: string;
  }>({
    transaction_id: "",
    purpose: "",
    amount: "",
    description: "",
    approved: false as unknown as string,
    status: "",
    type: "",
    receipt: "",
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
      approved: false as unknown as string,
      status: "",
      receipt: "",
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
      showToast("Submission error occured", "error")
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
