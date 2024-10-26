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

export type Transaction = {
  id: number
  uid: string
  company_name: string
  transaction_id: string
  purpose: string
  amount: string
  description: string
  approved: boolean
  from_account_balance_after: string
  to_account_balance_after: string
  receipt: string | null
  timestamp: string
  tranche: number
  from_account: number
  to_account: number
}

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


export interface Field {
  label: string;
  type: 'text' | 'textarea' | 'switch' | 'calendar' | 'file' | 'select';
  required?: boolean;
  options?: string[];
}

export interface TransactionData {
  [key: string]: string | boolean | File | Date | null;
}

export type FieldType = 'text' | 'textarea' | 'switch' | 'calendar' | 'file' | 'select';

export interface Field {
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
}

export interface FieldData {
  [key: string]: Field;
}

export interface SelectOption {
  value: string;
  label: string;
}

