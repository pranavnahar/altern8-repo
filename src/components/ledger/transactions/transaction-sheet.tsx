import React, { FC, useState } from "react";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Button } from "../../../components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { Plus } from "lucide-react";
import useTransactionForm from "../../../hooks/ledger/transactions/use-transactions-form";
import SwitchField from "./fields/switch-field";
import InputField from "./fields/input-field";
import SelectField from "./fields/select-field";
import CalendarField from "./fields/calender-field";
import FileField from "./fields/file-field";
import { fieldData } from "./field-data";

interface TransactionSheetProps {
  formData: TransactionData;
  invoiceIds: string[];
  accounts: Array<{ id: string; name: string }>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "edit" | "add";
  handleFetchTransactions: () => Promise<void>;
}

interface TransactionData {
  [key: string]: string;
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
  const [transactionData, setTransactionData] =
    useState<TransactionData>(formData);
  const { handleAddTransactionSubmit, handleApproveTransactionSubmit } =
    useTransactionForm();
  const isEditMode: boolean = mode === "edit";

  const handleFieldChange = (name: string, value: any): void => {
    setTransactionData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmitForm = async (): Promise<void> => {
    try {
      isEditMode
        ? await handleApproveTransactionSubmit(transactionData)
        : await handleAddTransactionSubmit(transactionData);
      if (isEditMode) {
        onOpenChange(false);
        await handleFetchTransactions();
      }
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  };

  const renderField = (fieldName: string, field: any): JSX.Element | null => {
    const fieldProps = {
      label: field.label,
      value: fieldName.includes("account")
        ? accounts.find((a) => a.id === transactionData[fieldName])?.id
        : transactionData[fieldName] || "",
      onChange: (value: any) => handleFieldChange(fieldName, value),
      inputClassName: `w-full py-1 text-gray-100 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none ${
        isEditMode ? "focus:border-blue-600" : "focus:border-purple-600"
      }`,
      ...field,
    };

    switch (field.type) {
      case "text":
      case "textarea":
        return (
          <InputField
            {...fieldProps}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleFieldChange(fieldName, e.target.value)
            }
          />
        );
      case "switch":
        return (
          <SwitchField
            {...fieldProps}
            checked={transactionData[fieldName]}
            onCheckedChange={(checked: boolean) =>
              handleFieldChange(fieldName, checked)
            }
          />
        );
      case "select":
        return (
          <SelectField
            {...fieldProps}
            options={field.options?.map((option: string) => ({
              value:
                fieldName === "from_account"
                  ? accounts.find((a) => a.id === option)?.id
                  : fieldName === "to_account"
                  ? accounts.find((a) => a.id === option)?.id
                  : option,
              label:
                fieldName === "from_account"
                  ? accounts.find((a) => a.id === option)?.name
                  : fieldName === "to_account"
                  ? accounts.find((a) => a.id === option)?.name
                  : option,
            }))}
          />
        );
      case "calendar":
        return (
          <CalendarField
            {...fieldProps}
            selected={transactionData[fieldName]}
            onSelect={(date: Date) => handleFieldChange(fieldName, date)}
          />
        );
      case "file":
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
          <Button className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-md bg-primary hover:bg-primary/90">
            <Plus className="my-auto mr-2 size-4" />
            Add Transaction
          </Button>
        </SheetTrigger>
      )}
      <SheetContent
        className={`flex flex-col min-h-screen border-none [background:linear-gradient(269.75deg,#011049,#19112f_25.75%,#251431_51.79%,#301941_64.24%,_#6e3050)] p-4 ${
          isEditMode ? "edit-mode-classname" : "add-mode-classname"
        }`}
      >
        <ScrollArea>
          <div className="pl-2 pr-3.5">
            <SheetHeader>
              <SheetTitle className="text-2xl font-normal text-gray-200">
                {isEditMode ? "Edit Transaction" : "Add a transaction entry"}
              </SheetTitle>
            </SheetHeader>
            <ScrollArea>
              <div className="relative flex-auto">
                {Object.entries(fieldData).map(([fieldName, field]) =>
                  renderField(fieldName, {
                    ...field,
                    options:
                      fieldName === "invoice_product"
                        ? invoiceIds
                        : fieldName === "from_account" ||
                          fieldName === "to_account"
                        ? accounts.map((account) => account.id)
                        : // : field.options,
                          "",
                  })
                )}
                <Button
                  onClick={handleSubmitForm}
                  className={`w-full mt-5 rounded-md bg-primary hover:bg-primary/90 animation z-20`}
                >
                  {isEditMode ? "Update Transaction" : "Submit"}
                </Button>
              </div>
            </ScrollArea>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default TransactionSheet;
