export type AccountData = {
  name: string;
  account_number: string;
  balance?: string;
  account_type?: string;
};

export type AccountType = {
  id: string;
  description: string;
  is_virtual: boolean;
};

export type Account = {
  name: string;
  id: string | null | undefined;
  account_type: string;
  is_virtual: boolean;
  description?: string;
};

export type Props = {
  isVirtual: boolean;
  setIsVirtual: React.Dispatch<React.SetStateAction<boolean>>;
  isVirtualAccountSelected: boolean;
  accounts: Account[];
  accountData: AccountData;
  setLinkedRealAccount: (s: string) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => void;
  handleAddAccount: () => void;
  account?: AccountData;
  handleFetchAccountsTypes?: () => void;
};
