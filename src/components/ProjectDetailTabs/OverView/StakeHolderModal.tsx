import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
} from "../../../components/ui/alert-dialog";
import DrawTable from "../../../components/CustomizedTable/CustomizedTable";
import { BaseHeaderProps } from "../../../lib/componentProps";
import { X } from "lucide-react";

interface StakeHolderModalProps {
  open: boolean;
  onHide: () => void;
}

export type Stakeholder = {
  stakeholderName: string;
  contactNumber: number;
  organization: string;
  email : string;
  type: "EQUITY" | "DEBT" | "SECONDARY DEBT";
};

const StakeHolderModal = ({ open, onHide }: StakeHolderModalProps) => {
  const stakeholders: Stakeholder[] = [
    {
      stakeholderName: "Rajesh Sharma",
      contactNumber: 8067589432,
      organization: "Tata Consultancy Services",
      email : 'rajeshsharma@gmail.com',
      type: "DEBT",
    },
    {
      stakeholderName: "Anita Mehta",
      contactNumber: 9876543210,
      organization: "Infosys",
      email : 'anita@gmail.com',
      type: "EQUITY",
    },
    {
      stakeholderName: "Vikram Singh",
      contactNumber: 9123456789,
      organization: "Reliance Industries",
      email : 'vikram@gmail.com',
      type: "SECONDARY DEBT",
    },
    {
      stakeholderName: "Sangeeta Patel",
      contactNumber: 9988776655,
      organization: "Wipro",
      email : 'sangeeta@gmail.com',
      type: "DEBT",
    },
    {
      stakeholderName: "Amit Gupta",
      contactNumber: 8098765432,
      organization: "HCL Technologies",
      email : 'amit@gmail.com',
      type: "EQUITY",
    },
    {
      stakeholderName: "Priya Nair",
      contactNumber: 8172635443,
      organization: "Mahindra & Mahindra",
      email : 'priya@gmail.com',
      type: "SECONDARY DEBT",
    },
  ];

  const tableHeaders: BaseHeaderProps[] = [
    {
      title: "Name",
      classname: "",
      key: "stakeholderName",
    },
    {
      title: "Contact Number",
      classname: "",
      key: "contactNumber",
    },
    {
      title: "Email Id",
      classname: "",
      key: "email",
    },
    {
      title: "Organization",
      classname: "",
      key: "organization",
    },
    {
      title: "Type",
      classname: "",
      key: "type",
    },
  ];
  return (
    <AlertDialog open={open} onOpenChange={onHide}>
      <AlertDialogContent className="w-[60vw] [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] border-0">
        <AlertDialogHeader className="text-white " onClick={onHide}>
          <div className="flex items-center justify-between">
            Stakeholders List
            <X size={20} />
          </div>
        </AlertDialogHeader>
        <DrawTable tableData={stakeholders} headers={tableHeaders} />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StakeHolderModal;
