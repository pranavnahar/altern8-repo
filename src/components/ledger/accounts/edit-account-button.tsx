import AccountFormButton from "./add-account-button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from "../../../components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useAccountTypes } from "../../../hooks/ledger/accounts/use-account-types";
import useAccounts from "../../../hooks/ledger/accounts/use-accounts";
import { Switch } from "../../../components/ui/switch";
import { Button } from "../../../components/ui/button.jsx";
import React, { useState } from "react";
import { Account, AccountType, Props } from "./types";

const EditAccountButton: React.FC<Props> = ({
  account,
  handleFetchAccountsTypes,
  isVirtual,
  setIsVirtual,
  isVirtualAccountSelected,
}) => {
  const {
    accountsTypes,
    newAccountType,
    handleAddNewAccountType,
    handleNewAccountTypeChange,
  } = useAccountTypes(handleFetchAccountsTypes);
  const { setLinkedRealAccount, handleEditAccount } =
    useAccounts(accountsTypes);
  const virtualText = isVirtual ? "Virtual" : "Non-Virtual";
  const [accountData, setAccountData] = useState({
    name: account?.name,
    account_number: account?.account_number,
    account_type: account?.account_type ? account?.account_type.toString() : "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const { value } = e.target;
    setAccountData((prev) => ({ ...prev, [field]: value }));
    if (field === "account_type") {
      const selectedAccountType: Account = accountsTypes.find(
        (type: AccountType) => type.id.toString() === value
      )!;
      if (selectedAccountType) {
        setIsVirtual(selectedAccountType.is_virtual);
      }
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          //size="sm"
          className="text-primary hover:text-primary/90"
        >
          Edit
        </button>
      </SheetTrigger>
      <SheetContent className="flex flex-col min-h-screen border-none [background:linear-gradient(269.75deg,_#011049,_#19112f_25.75%,_#251431_51.79%,_#301941_64.24%,_#6e3050)]">
        <SheetHeader>
          <h1 className="text-xl font-medium text-neutral-50">Edit Account</h1>
          <SheetDescription className="text-sm tracking-tight text-justify text-neutral-400 font-normal">
            Edit your account details here.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-5 mt-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-sm text-neutral-100">Name</h1>
            <input
              onChange={(e) => handleInputChange(e, "name")}
              value={accountData.name}
              required
              placeholder="Account Name"
              className="py-1 text-sm text-gray-200 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
              type="text"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-sm text-neutral-100">Account Number</h1>
            <input
              onChange={(e) => handleInputChange(e, "account_number")}
              value={accountData.account_number}
              required
              placeholder="Account Number"
              className="py-1 text-sm text-gray-200 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
              type="text"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-neutral-100">Account type</h1>
            <Select
              onValueChange={(value) =>
                handleInputChange({ target: { value } }, "account_type")
              }
              defaultValue={accountData.account_type}
            >
              <SelectTrigger className="w-full border-2 bg-primary">
                <SelectValue placeholder="Select an account type..." />
              </SelectTrigger>
              <SelectContent className="border-none bg-neutral-200/70 backdrop-blur-md max-h-40">
                {accountsTypes &&
                  accountsTypes.map((accountsType: AccountType) => (
                    <SelectItem
                      key={accountsType.id}
                      value={accountsType.id.toString()}
                      className="truncate rounded-md"
                    >
                      {accountsType.description}{" "}
                      {accountsType.is_virtual ? "(Virtual)" : ""}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          {isVirtualAccountSelected && (
            <div className="flex flex-col gap-2">
              <h1 className="text-sm text-neutral-100">Linked Real Account</h1>
              <Select onValueChange={(value) => setLinkedRealAccount(value)}>
                <SelectTrigger className="w-full border-2 bg-primary">
                  <SelectValue placeholder="Select a real account..." />
                </SelectTrigger>
                <SelectContent className="border-none bg-neutral-200/70 backdrop-blur-md max-h-80">
                  {accountsTypes &&
                    accountsTypes
                      .filter((account: Account) => !account.is_virtual)
                      .map((account: Account) => (
                        <SelectItem
                          key={account.id}
                          value={account.id!.toString()}
                          className="truncate rounded-md"
                        >
                          {account.description}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex flex-col gap-2 p-3 rounded-md bg-white/10">
            <h1 className="text-sm text-neutral-100">
              Add Account Type{" "}
              <span className="text-neutral-400">(if needed)</span>
            </h1>
            <div className="grid grid-cols-2 gap-5">
              <input
                onChange={handleNewAccountTypeChange}
                value={newAccountType.description}
                placeholder="New Account Type"
                className="py-1 text-sm text-gray-200 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
                type="text"
              />
              <div className="flex my-auto">
                <Switch
                  checked={isVirtual}
                  onCheckedChange={setIsVirtual}
                  className=""
                />
                <h1 className="ml-2">{virtualText}</h1>
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleAddNewAccountType}
              className="w-full mt-3 bg-primary hover:bg-primary/80"
            >
              Add
            </Button>
          </div>
        </div>
        <SheetClose asChild>
          <Button
            onClick={() => handleEditAccount}
            className="w-full mt-5 bg-primary hover:bg-primary/80"
          >
            Update Account
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
};

export default EditAccountButton;
