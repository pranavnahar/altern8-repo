export type ButtonProps = {
  className?: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";
  name: string;
  icon?: JSX.Element;
  onClick?: () => void;
};

export type SubmenuProps = {
  name: string;
  status: string;
  hoverContent: string;
  statusColor: "complete" | "inProgress";
};

export interface drawDocumentTableDataProps {
  vendor: string;
  type: string;
  status: string;
  approvalStatus: string;
  nextApprover: string;
  amount: string;
}

export type drawDocumentTableHeaderProps = {
  key: keyof drawDocumentTableDataProps;
  classname: string;
  title: string;
  progress?: boolean;
  compareValues?: string;
  total?: string;
};

export interface BaseTableData {
  [key: string]: string | number | boolean | null | JSX.Element;
}

export interface BaseHeaderProps {
  title: string;
  classname?: string;
  rowClassname?: string;
  key: keyof BaseTableData;
  compareKeys?: (keyof BaseTableData)[];
  onClick?: (row: BaseTableData) => void;
  type? : string
  buttonClick? : () => void
  filter? : boolean
}

export interface InvoiceDocument {
  name: string;
  file: string;
}
