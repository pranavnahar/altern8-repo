import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

const AccountSelect: React.FC<{
  accounts: { id: string; name: string }[];
  onSelect: () => void;
  selectedAccount: { id: string; name: string } | string;
}> = ({ accounts, onSelect, selectedAccount }) => {
  return (
    <Select onValueChange={onSelect} value={selectedAccount as string}>
      <SelectTrigger className="w-[200px] gap-5 bg-primary border-2 mr-auto">
        <SelectValue
          className="text-left text-neutral-800"
          placeholder="Select Bank Account"
        />
      </SelectTrigger>
      <SelectContent className="bg-neutral-200/70 backdrop-blur-md border-none w-[200px]">
        <SelectItem value="all" className="truncate rounded-md">
          Show All Accounts
        </SelectItem>
        {accounts.map(
          (account: { id: string; name: string }, index: number) => (
            <SelectItem
              key={index}
              value={account.id.toString()}
              className="rounded-md"
            >
              <h1 className="truncate rounded-md max-w-[180px]">
                {account.name}
              </h1>
            </SelectItem>
          )
        )}
      </SelectContent>
    </Select>
  );
};

export default AccountSelect;
