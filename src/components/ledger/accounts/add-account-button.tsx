import React from 'react';
import { Button } from '../../../components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from '../../../components/ui/sheet';
import { Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
//import { useAccountTypes } from "../../../hooks/ledger/accounts/use-account-types";
import { Switch } from '../../../components/ui/switch';
import { AccountType, Props, Account } from './types';

const AddAccountButton: React.FC<Props> = ({
  isVirtual,
  setIsVirtual,
  isVirtualAccountSelected,
  accounts,
  accountData,
  setLinkedRealAccount,
  handleInputChange,
  handleAddAccount,
}) => {
  const {
    accountsTypes,
    newAccountType,
    handleAddNewAccountType,
    handleNewAccountTypeChange,
    //@ts-expect-error use account not present
  } = useAccountTypes(isVirtual, setIsVirtual);
  const virtualText = isVirtual ? 'Virtual' : 'Non-Virtual';

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-md bg-primary animation hover:bg-primary/90 border-primary">
          <Plus className="my-auto mr-2 size-4" />
          Add Account
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col min-h-screen overflow-y-scroll scroll border-none [background:linear-gradient(269.75deg,_#011049,_#19112f_25.75%,_#251431_51.79%,_#301941_64.24%,_#6e3050)]">
        <SheetHeader>
          <h1 className="text-xl font-medium text-neutral-50">Edit Account</h1>
          <SheetDescription className="text-sm font-normal tracking-tight text-justify text-neutral-400">
            Edit your account details here.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-5 mt-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-sm text-neutral-100">Name</h1>
            <input
              onChange={e => handleInputChange(e, 'name')}
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
              onChange={e => handleInputChange(e, 'account_number')}
              value={accountData.account_number}
              required
              placeholder="Account Number"
              className="py-1 text-sm text-gray-200 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
              type="text"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-sm text-neutral-100">Balance</h1>
            <input
              onChange={e => handleInputChange(e, 'balance')}
              value={accountData.balance}
              required
              placeholder="Account Balance"
              className="py-1 text-sm text-gray-200 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
              type="text"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-neutral-100">Account type</h1>
            <Select
              onValueChange={value =>
                handleInputChange(
                  { target: { value } } as React.ChangeEvent<HTMLInputElement>,
                  'account_type',
                )
              }
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
                      {accountsType.description} {accountsType.is_virtual ? '(Virtual)' : '(Real)'}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          {isVirtualAccountSelected && (
            <div className="flex flex-col gap-2">
              <h1 className="text-sm text-neutral-100">Link Real Account</h1>
              <Select onValueChange={value => setLinkedRealAccount(value)}>
                <SelectTrigger className="w-full border-2 bg-primary">
                  <SelectValue placeholder="Select a real account..." />
                </SelectTrigger>
                <SelectContent className="border-none bg-neutral-200/70 backdrop-blur-md max-h-80">
                  {accounts &&
                    accounts
                      .filter(account => {
                        const accountType: Account = accountsTypes.find(
                          (type: AccountType) => type.id === account.account_type,
                        )!;
                        return accountType && !accountType.is_virtual;
                      })
                      .map(account => (
                        <SelectItem
                          key={account.id}
                          value={account.id!.toString()}
                          className="truncate rounded-md"
                        >
                          {account.name}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex flex-col gap-2 p-3 rounded-md bg-white/10">
            <h1 className="text-sm text-neutral-100">
              Add Account Type <span className="text-neutral-400">(if needed)</span>
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
                <Switch checked={isVirtual} onCheckedChange={setIsVirtual} className="" />
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
          <Button onClick={handleAddAccount} className="w-full mt-5 bg-primary hover:bg-primary/80">
            Add Account
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
};

export default AddAccountButton;
