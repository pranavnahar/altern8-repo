'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import InputField from './fields/input-field';
import SelectField from './fields/select-field';
import CalendarField from './fields/calender-field';
import FileField from './fields/file-field';
import { fieldData } from './field-data';
import { Account, Field, FieldType, SelectOption } from '../types';
import { createTransaction } from '../actions';
import { useToast } from '@/utils/show-toasts';
import { IconChevronRight, IconLoader2 } from '@tabler/icons-react';

type Props = {
  accounts: Account[];
  trancheIds: string[];
  mode: 'edit' | 'add';
};

interface TransactionData {
  [key: string]: string | boolean | File | Date | null;
}

// Updated FileField type to include onRemove
type FileFieldProps = {
  label: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove?: () => void;
};

const TransactionSheet: React.FC<Props> = ({ accounts, trancheIds, mode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactionData, setTransactionData] = useState<TransactionData>({});
  const isEditMode = mode === 'edit';
  const { showToast } = useToast();

  const isVirtualTransaction = React.useMemo(() => {
    // Use optional chaining and provide a fallback
    const fromAccount = accounts.find(
      account => account?.id?.toString() === transactionData.from_account,
    );
    const toAccount = accounts.find(
      account => account?.id?.toString() === transactionData.to_account,
    );

    // Use optional chaining when checking is_virtual
    return fromAccount?.is_virtual && toAccount?.is_virtual;
  }, [accounts, transactionData.from_account, transactionData.to_account]);

  // Effect to manage transaction ID field based on receipt
  useEffect(() => {
    // Check if receipt is a File and has a valid name, or if it's a non-empty string
    const isReceiptSelected =
      (transactionData.receipt instanceof File && transactionData.receipt.name) ||
      (typeof transactionData.receipt === 'string' && transactionData.receipt !== 'No file chosen');

    if (!isReceiptSelected) {
      const { transaction_id, ...remainingData } = transactionData;
      setTransactionData(remainingData);
    }
  }, [transactionData.receipt]);

  const handleFieldChange = (name: string, value: string | boolean | File | Date | null): void => {
    // Special handling for receipt to manage transaction_id
    if (name === 'receipt') {
      const isReceiptSelected =
        (value instanceof File && value.name) ||
        (typeof value === 'string' && value !== 'No file chosen');

      if (!isReceiptSelected) {
        const { transaction_id, ...remainingData } = transactionData;
        setTransactionData(remainingData);
      } else {
        setTransactionData(prevData => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else {
      setTransactionData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmitForm = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      const requiredFields = ['purpose', 'amount', 'from_account', 'to_account'];
      const missingFields = requiredFields.filter(field => !transactionData[field]);

      if (missingFields.length > 0) {
        showToast({
          message: `Please fill in all required fields: ${missingFields.join(', ')}`,
          type: 'warning',
          duration: 3000,
        });
        setIsLoading(false);
        return;
      }

      let timestamp: string;
      if (transactionData.timestamp instanceof Date) {
        timestamp = transactionData.timestamp.toISOString();
      } else if (typeof transactionData.timestamp === 'string') {
        timestamp = new Date(transactionData.timestamp).toISOString();
      } else {
        timestamp = new Date().toISOString();
      }

      const trancheValue = Array.isArray(transactionData.tranche)
        ? transactionData.tranche[0]
        : transactionData.tranche;

      const apiData = {
        transaction_id: (transactionData.transaction_id as string) || '',
        purpose: (transactionData.purpose as string) || '',
        amount: (transactionData.amount as string) || '0.00',
        description: (transactionData.description as string) || '',
        status: (transactionData.status as string) || 'Pending for Approval',
        receipt: !isVirtualTransaction ? transactionData.receipt : null, // Don't include receipt for virtual transactions
        timestamp: timestamp,
        tranche: String(trancheValue) || '',
        from_account: (transactionData.from_account as string) || '',
        to_account: (transactionData.to_account as string) || '',
      };

      Object.entries(apiData).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (value !== null) {
          formData.append(key, String(value));
        }
      });

      const result = await createTransaction(formData);

      console.log('the result of the create transaction is givin this vale: ', result);

      if (result.success) {
        showToast({
          message: 'Transaction created successfully!',
          type: 'success',
          duration: 2000,
        });
        setIsOpen(false);
        setTransactionData({});
      } else {
        showToast({
          message: result.error || 'Failed to create transaction',
          type: 'error',
          duration: 3000,
        });
      }
    } catch (error) {
      showToast({
        message:
          error instanceof Error
            ? error.message
            : 'An error occurred while creating the transaction',
        type: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectOptions = (fieldName: string, field: Field): SelectOption[] => {
    if (fieldName === 'from_account' || fieldName === 'to_account') {
      return accounts
        .filter((account): account is Account & { id: string } => {
          return account.id != null;
        })
        .map(account => ({
          value: account.id.toString(),
          label: `${account.name || account.id}${account.is_virtual ? ' (Virtual)' : ''}`,
        }));
    }

    if (fieldName === 'tranche') {
      return trancheIds?.map(id => ({
        value: id,
        label: id,
      }));
    }

    return (field.options || []).map(option => ({
      value: option,
      label: option,
    }));
  };

  const renderField = (fieldName: string, field: Field): JSX.Element | null => {
    const commonProps = {
      label: field.label,
      required: field.required,
    };

    // Conditionally render transaction_id only when a valid receipt is present
    const isReceiptSelected =
      (transactionData.receipt instanceof File && transactionData.receipt.name) ||
      (typeof transactionData.receipt === 'string' && transactionData.receipt !== 'No file chosen');

    if (fieldName === 'transaction_id' && !isReceiptSelected) {
      return null;
    }

    switch (field.type as FieldType) {
      case 'text':
      case 'textarea':
        return (
          <InputField
            {...commonProps}
            type={field.type}
            value={(transactionData[fieldName] as string) || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              handleFieldChange(fieldName, e.target.value)
            }
            inputClassName={`w-full py-1 text-gray-100 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none ${
              isEditMode ? 'focus:border-blue-600' : 'focus:border-purple-600'
            }`}
          />
        );

      case 'switch':
        return null;

      case 'select':
        return (
          <SelectField
            {...commonProps}
            value={(transactionData[fieldName] as string) || ''}
            onChange={(value: string) => handleFieldChange(fieldName, value)}
            options={getSelectOptions(fieldName, field)}
          />
        );

      case 'calendar':
        return (
          <CalendarField
            {...commonProps}
            selected={(transactionData[fieldName] as Date) || null}
            onSelect={(date: Date | undefined) => handleFieldChange(fieldName, date || null)}
          />
        );

      case 'file':
        // Don't render the file upload field if both accounts are virtual
        if (fieldName === 'receipt' && isVirtualTransaction) {
          return null;
        }
        return (
          <FileField
            {...commonProps}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFieldChange(fieldName, file);
              }
            }}
            onRemove={() => {
              // Remove the file and transaction_id when file is removed
              const { receipt, transaction_id, ...remainingData } = transactionData;
              setTransactionData(remainingData);
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant="expandIcon"
          Icon={IconChevronRight}
          iconPlacement="right"
          className="text-sm w-40 text-white bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700"
        >
          {isEditMode ? 'Edit Transaction' : 'Add Transaction'}
        </Button>
      </SheetTrigger>
      <SheetContent
        className={`flex flex-col min-h-screen border-none [background:linear-gradient(269.75deg,#011049,#19112f_25.75%,#251431_51.79%,#301941_64.24%,_#6e3050)] p-4 ${
          isEditMode ? 'edit-mode-classname' : 'add-mode-classname'
        }`}
      >
        <div className="overflow-x-auto">
          <div className="pl-2 pr-3.5">
            <SheetHeader>
              <SheetTitle className="text-2xl font-normal text-gray-200">
                {isEditMode ? 'Edit Transaction' : 'Add a transaction entry'}
              </SheetTitle>
            </SheetHeader>
            <div className="relative flex-auto">
              {Object.entries(fieldData).map(([fieldName, field]) => (
                <div key={fieldName}>{renderField(fieldName, field)}</div>
              ))}
              <Button
                onClick={handleSubmitForm}
                disabled={isLoading}
                variant="expandIcon"
                iconPlacement="right"
                Icon={IconChevronRight}
                className={`w-full mt-5 text-sm text-white bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? 'Updating...' : 'Submitting...'}
                  </div>
                ) : isEditMode ? (
                  'Update Transaction'
                ) : (
                  'Submit'
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TransactionSheet;
