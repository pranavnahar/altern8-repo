import { useState } from 'react';
import { showToast } from '../../Helpers/show-toasts';
import { createTransactions } from '../../utils/ledger/ledgerService';

const useTransactionForm = () => {
  const [showAddTransactionBox, setShowAddTransactionBox] = useState(false);
  const [formData, setFormData] = useState({
    transaction_id: '',
    purpose: '',
    amount: '',
    description: '',
    approved: false || '',
    status: '',
    receipt: null,
    timestamp: '',
    invoice_product: '',
    from_account: '',
    to_account: '',
  });

  const resetFormData = () => {
    setFormData({
      transaction_id: '',
      purpose: '',
      amount: '',
      description: '',
      approved: false as unknown as string,
      status: 'Pending for Approval',
      receipt: null,
      timestamp: new Date() as unknown as string,
      invoice_product: '',
      from_account: '',
      to_account: '',
    });
  };

  const handleSubmit = async (submitFunction: (data: any) => void, data: any) => {
    try {
      await submitFunction(data);
      resetFormData();
      return true;
    } catch (error) {
      showToast(`${error}`);
      return false;
    }
  };

  return {
    showAddTransactionBox,
    formData,
    handleAddTransactionSubmit: (data: any) => handleSubmit(createTransactions, data),
    handleAddTransactionButton: () => setShowAddTransactionBox(true),
    handleCloseTransactionBoxButton: () => setShowAddTransactionBox(false),
  };
};

export default useTransactionForm;
