import React, { FC, useState } from 'react';
//import { ScrollArea } from "../../../components/ui/scroll-area";
import { Button } from '../../../components/ui/button';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../../../components/ui/sheet';
import { Plus } from 'lucide-react';
import SwitchField from './fields/switch-field';
import InputField from './fields/input-field';
import SelectField from './fields/select-field';
import CalendarField from './fields/calender-field';
import FileField from './fields/file-field';
import { fieldData } from './field-data';
import { Account } from '../accounts/types';
import { IconPlus } from '@tabler/icons-react';
import useTransactionForm from '@/hooks/ledger/useTransactionForm';
//import { ScrollAreaScrollbar } from "@radix-ui/react-scroll-area";

interface TransactionSheetProps {
  formData: TransactionData;
  invoiceIds: string[];
  accounts: Account[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'edit' | 'add';
  handleFetchTransactions: () => Promise<void>;
}

interface TransactionData {
  [key: string]: string;
}

interface Field {
  label2: string;
  type: 'text' | 'textarea' | 'switch' | 'select' | 'calendar' | 'file';
  options?: string[] | string;
  [key: string]: string | string[] | undefined;
}

const TransactionSheet: FC<TransactionSheetProps> = ({
  formData,
  invoiceIds,
  accounts,
  isOpen,
  onOpenChange,
  mode,
  handleFetchTransactions,
}) => {
  const [transactionData, setTransactionData] = useState<TransactionData>(formData);
  const { handleAddTransactionSubmit } = useTransactionForm();
  const isEditMode: boolean = mode === 'edit';

  const handleFieldChange = (name: string, value: string | boolean | File | Date): void => {
    setTransactionData(prevData => ({
      ...prevData,
      [name]: value as string,
    }));
  };

  const handleSubmitForm = async (): Promise<void> => {
    try {
      await handleAddTransactionSubmit(transactionData);
      if (isEditMode) {
        onOpenChange(false);
        await handleFetchTransactions();
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
    }
  };
  const renderField = (fieldName: string, field: Field): JSX.Element | null => {
    const fieldProps = {
      label: field.label2,
      value: fieldName.includes('account')
        ? accounts.find(a => a.id === transactionData[fieldName])?.id
        : transactionData[fieldName] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        handleFieldChange(fieldName, e.target.value),
      inputClassName: `w-full py-1 text-gray-100 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none ${
        isEditMode ? 'focus:border-blue-600' : 'focus:border-purple-600'
      }`,
      ...field,
    };

    switch (field.type) {
      case 'text':
      case 'textarea':
        return (
          <InputField
            {...fieldProps}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              handleFieldChange(fieldName, e.target.value)
            }
          />
        );
      case 'switch':
        return (
          <SwitchField
            {...fieldProps}
            checked={transactionData[fieldName]}
            onCheckedChange={(checked: boolean) => handleFieldChange(fieldName, checked)}
          />
        );
      case 'select':
        return (
          <SelectField
            {...fieldProps}
            //@ts-expect-error options type boolean
            options={
              Array.isArray(field.options) &&
              field.options?.map((option: string) => ({
                value:
                  fieldName === 'from_account'
                    ? accounts.find(a => a.id === option)?.id
                    : fieldName === 'to_account'
                    ? accounts.find(a => a.id === option)?.id
                    : option,
                label:
                  fieldName === 'from_account'
                    ? accounts.find(a => a.id === option)?.name
                    : fieldName === 'to_account'
                    ? accounts.find(a => a.id === option)?.name
                    : option,
              }))
            }
          />
        );
      case 'calendar':
        return (
          <>
            <CalendarField
              {...fieldProps}
              selected={transactionData[fieldName]}
              onSelect={(date: Date | undefined) => handleFieldChange(fieldName, date as Date)}
            />
          </>
        );
      case 'file':
        return (
          <FileField
            {...fieldProps}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFieldChange(fieldName, file);
              }
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      {!isEditMode && (
        <SheetTrigger asChild>
          <Button
            size={'sm'}
            className="text-sm w-40 text-white bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700"
          >
            Add Transaction
          </Button>
        </SheetTrigger>
      )}
      <SheetContent
        className={`flex flex-col min-h-screen border-none [background:linear-gradient(269.75deg,#011049,#19112f_25.75%,#251431_51.79%,#301941_64.24%,_#6e3050)] p-4 ${
          isEditMode ? 'edit-mode-classname' : 'add-mode-classname'
        }`}
      >
        <div className=" overflow-x-auto">
          <div className="pl-2 pr-3.5">
            <SheetHeader>
              <SheetTitle className="text-2xl font-normal text-gray-200">
                {isEditMode ? 'Edit Transaction' : 'Add a transaction entry'}
              </SheetTitle>
            </SheetHeader>

            <div>
              <div className="relative flex-auto">
                {Object.entries(fieldData).map(([fieldName, field]) =>
                  renderField(fieldName, {
                    ...field,
                    //@ts-expect-error options types?
                    options:
                      fieldName === 'invoice_product'
                        ? invoiceIds
                        : fieldName === 'from_account' || fieldName === 'to_account'
                        ? accounts.map(account => account.id)
                        : // : field.options,
                          '',
                  }),
                )}
                <Button
                  onClick={handleSubmitForm}
                  className={`w-full mt-5 text-sm text-white bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700`}
                >
                  {isEditMode ? 'Update Transaction' : 'Submit'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TransactionSheet;
