export type InvoiceDocument = {
  type: "invoice" | "draw summary";
  name: string;
  price: string;
  draw?: string;
  file: string;
};
