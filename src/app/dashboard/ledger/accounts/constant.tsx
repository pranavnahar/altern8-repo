import { useState } from "react";
import { Switch } from "../../../../components/ui/switch";
import useAccounts from "../../../../hooks/ledger/accounts/use-accounts";
import { Skeleton } from "@/components/ui/skeleton";

export const getColumns = (
  accountsTypes: {
    id: string;
    account_type: string;
    description: string;
    is_virtual: boolean;
  }[]
) => [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: (info: { getValue: () => string }) => (
      <h1 className="font-normal">{info.getValue()}</h1>
    ),
  },
  {
    header: "Balance",
    accessorKey: "balance",
    cell: (info: { getValue: () => string }) => {
      return `₹ ${parseFloat(info.getValue()).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
  {
    header: "Account Number",
    accessorKey: "account_number",
  },
  {
    header: "User",
    accessorKey: "user",
    cell: (info: { getValue: () => string }) => {
      const value = info.getValue();
      return value ? <h1 className="">{value}</h1> : "N/A";
    },
  },
  {
    header: "Account Type",
    accessorKey: "account_type",
    cell: (info: { getValue: () => string }) => {
      const accountType = accountsTypes.find(
        (type: { id: string }) => type.id === info.getValue()
      );

      return (
        <span className="font-normal">
          {accountType ? accountType.description : "Unknown"}
          {accountType?.is_virtual && " (Virtual)"}
        </span>
      );
    },
  },
  {
    header: "Linked Real Account",
    accessorKey: "linked_real_account",
    cell: (info: { getValue: () => string }) => {
      const { accounts } = useAccounts();
      const linkedAccountId = info.getValue();

      if (linkedAccountId) {
        const linkedAccount: { name: string } = accounts.find(
          (account: { id: string }) => account.id === linkedAccountId
        )!;
        return linkedAccount ? (
          <p className="font-normal text-white">{linkedAccount.name}</p>
        ) : (
          <Skeleton className="h-4 min-w-60" />
        );
      } else {
        return "N/A";
      }
    },
  },
  {
    header: "Status",
    accessorKey: "is_active",
    cell: (info: {
      getValue: () => string;
      row: { original: { id: string } };
    }) => {
      const [isActive, setIsActive] = useState<string | boolean>(
        info.getValue()
      );
      const { handleToggleAccountStatus } = useAccounts();

      const handleToggle = async () => {
        const newStatus = await handleToggleAccountStatus(
          info.row.original.id,
          isActive as string
        );
        setIsActive(newStatus);
      };

      return (
        <Switch checked={isActive as boolean} onCheckedChange={handleToggle} />
      );
    },
  },
  // {
  //   header: "Actions",
  //   cell: (info) => {
  //     const { handleFetchAccountsTypes } = useAccountTypes();
  //     return (
  //     <div className="flex space-x-2">
  //       <EditAccountButton
  //         account={info.row.original}
  //         handleFetchAccountsTypes={handleFetchAccountsTypes}
  //         isVirtual={isVirtual}
  //         setIsVirtual={setIsVirtual}
  //         isVirtualAccountSelected={isVirtualAccountSelected}
  //       />
  //     </div>
  //     )
  //   },
  // },
];

// You can add more constants here if needed, similar to TRANSACTION_PURPOSES and TRANSACTION_TYPES in your example
export const ACCOUNT_STATUS = [
  { value: true, label: "Active" },
  { value: false, label: "Inactive" },
];
