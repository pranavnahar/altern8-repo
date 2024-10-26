import { FieldData } from "../types";

const TRANSACTION_PURPOSES = [
  "Principal",
  "Interest",
  "One time processing fees",
  "Platform fees",
  "Fractionalization fees",
  "Penalty",
  "Wallet fees",
  "Legal fees",
  "Insurance charges",
  "Prepayment",
  "Other charges",
] as const;

const TRANSACTION_TYPE = [
  "Recievable",
  "Payable",
  "Bank Transaction",
  "Virtual Transaction",
] as const;

type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;
type TransactionPurpose = ArrayElement<typeof TRANSACTION_PURPOSES>;
type TransactionType = ArrayElement<typeof TRANSACTION_TYPE>;

export const fieldData: FieldData = {
  transaction_id: {
    label: "Transaction Id",
    type: "text",
    required: true,
  },
  purpose: {
    label: "Purpose",
    type: "select",
    options: Array.from(TRANSACTION_PURPOSES),
  },
  amount: {
    label: "Amount (₹)",
    type: "text",
    required: true,
  },
  description: {
    label: "Description",
    type: "textarea",
  },
  approved: {
    label: "Approved",
    type: "switch",
  },
  status: {
    label: "Type",
    type: "select",
    options: Array.from(TRANSACTION_TYPE),
  },
  timestamp: {
    label: "Date & Time",
    type: "calendar",
  },
  tranche: {
    label: "Tranche Id",
    type: "select",
    options: [],
  },
  from_account: {
    label: "From Account",
    type: "select",
    options: [],
  },
  to_account: {
    label: "To Account",
    type: "select",
    options: [],
  },
  receipt: {
    label: "Receipt",
    type: "file",
  },
} as const;
