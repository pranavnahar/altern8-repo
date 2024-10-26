import { useState } from 'react';
import { createTransaction } from '../actions';
import { useToast } from '@/utils/show-toasts';

const useTransactionForm = () => {
  const [showAddTransactionBox, setShowAddTransactionBox] = useState(false);
  const { showToast } = useToast()
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
      showToast({
        message: 'Failed to add transaction, server error',
        type: 'error'
      });
      return false;
    }
  };

  return {
    showAddTransactionBox,
    formData,
    handleAddTransactionSubmit: (data: any) => handleSubmit(createTransaction, data),
    handleAddTransactionButton: () => setShowAddTransactionBox(true),
    handleCloseTransactionBoxButton: () => setShowAddTransactionBox(false),
  };
};

export default useTransactionForm;
