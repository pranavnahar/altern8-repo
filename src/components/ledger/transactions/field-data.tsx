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
];

const TRANSACTION_TYPE = [
  "Recievable",
  "Payable",
  "Bank Transaction",
  "Virtual Transaction",
];

export const fieldData = {
  transaction_id: {
    label: "Transaction Id",
    type: "text",
    required: true,
  },
  purpose: {
    label: "Purpose",
    type: "select",
    options: TRANSACTION_PURPOSES,
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
    options: TRANSACTION_TYPE,
  },
  timestamp: {
    label: "Date & Time",
    type: "calendar",
  },
  invoice_product: {
    label: "Invoice Id",
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
};
