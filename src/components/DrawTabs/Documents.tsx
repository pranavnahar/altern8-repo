'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  File,
  Filter,
  Save,
  SlidersHorizontal,
  View,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { DropdownMenuContent } from '@radix-ui/react-dropdown-menu';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
// import { ButtonProps } from "@/lib/componentProps";
import { useRouter } from 'next/navigation';
import { FormInput } from '../LedgerTypeTable/Filter';
import { InputForms } from '../InputForms/InputForms';
import LedgerTypeTable from '../LedgerTypeTable/LedgerTypeTable';
import { BudgetSection } from '../../app/(dashboard)/draw/[id]/page';
import { BaseHeaderProps } from '../../lib/componentProps';
import { useRecoilValue } from 'recoil';
import { userRole } from '../../atom/atom';

interface Item {
  document: string;
  vendor: string;
  currentAmountRequestedNet: string;
  uploaded: string;
  pages: string;
  originalFile: string;
  status: string;
  backup: boolean;
  assignedTo: string;
  approvalStatus: string;
  type?: 'subtotal';
}

export interface Category {
  category: string;
  items: Item[];
}
//header Ui for the documents tab
// const Header = () => {
//   const buttons: ButtonProps[] = [
//     {
//       name: "Default",
//       className: "bg-themeBlue hover:bg-blue-700",
//       onClick: () => console.log("hi"),
//     },
//     {
//       name: "Invoices",
//       variant: "outline",
//       onClick: () => console.log("bye"),
//     },
//     {
//       name: "Payment Applications",
//       variant: "outline",
//       onClick: () => console.log("bye"),
//     },
//     {
//       name: "Assigned to Me",
//       variant: "outline",
//       onClick: () => console.log("bye"),
//     },
//     {
//       name: "Email Import",
//       variant: "outline",
//       onClick: () => console.log("bye"),
//     },
//   ];
//   return (
//     <div className="px-5 flex items-center justify-between">
//       <div className="flex items-center gap-3">
//         {buttons?.length &&
//           buttons.map((button, index) => (
//             <div key={index} className="flex items-center gap-3">
//               <Button
//                 className={button.className}
//                 variant={button.variant || "default"}
//               >
//                 {button.name}
//               </Button>
//             </div>
//           ))}
//       </div>

//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="outline">Take Actions</Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent className="bg-white rounded-lg m-2">
//           <DropdownMenuItem>
//             <SlidersHorizontal size={18} className="mr-2" />
//             Customize Columns...
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             <Boxes size={18} className="mr-2" />
//             Group By...
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             <Save size={18} className="mr-2" />
//             Save Current View...
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             <View size={18} className="mr-2" />
//             Manage Views...
//           </DropdownMenuItem>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem>
//             <File size={18} className="mr-2" />
//             Export to csv
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             <File size={18} className="mr-2" />
//             Export to Excel
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// };

//filter
const FilterContainer = () => {
  const [open, setOpen] = useState<boolean>(false);
  const drawDocumentFormInputs: FormInput[] = [
    {
      type: 'file',
      label: 'Budget',
      name: 'document',
      required: false,
    },
    {
      type: 'text',
      label: 'Vendor',
      name: 'vendor',
      placeholder: 'Enter the Vendor Name',
      required: false,
    },
    {
      type: 'number',
      label: 'Current Amount Requested (Net)',
      name: 'currentAmountRequested(Net)',
      placeholder: 'Current Amount Requested (Net)',
      required: false,
    },
    {
      type: 'text',
      label: 'Current Budget',
      name: 'currentBudget',
      placeholder: 'Current Budget',
      required: false,
    },
    {
      type: 'file',
      label: 'Other Documents',
      name: 'originalFile',
      required: false,
    },
  ];
  return (
    <motion.div
      className="flex items-end justify-between px-5 my-3"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-end gap-3">
        <div className="text-black">
          <strong className="text-xs text-white">Search By:</strong>
          <Select>
            <SelectTrigger className="w-[180px] bg-gray-200  ">
              <SelectValue className="text-black bg-gray-300" placeholder="Select by column" />
            </SelectTrigger>
            <SelectContent className="text-black">
              <SelectGroup>
                <SelectItem value="Projects">Projects</SelectItem>
                <SelectItem value="location">Location</SelectItem>
                <SelectItem value="commitments">Commitments</SelectItem>
                <SelectItem value="projectTotal">Project Total</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Input className="text-black" type="search" placeholder="Search" />
        </div>
        <div>
          <Button variant="secondary">
            <Filter />
          </Button>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant={'secondary'} className=" text-gray-200" onClick={() => setOpen(true)}>
          Add Documents
        </Button>
        <div className="text-black">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Take Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <SlidersHorizontal size={18} className="mr-2" />
                Customize Columns...
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Boxes size={18} className="mr-2" />
                Group By...
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Save size={18} className="mr-2" />
                Save Current View...
              </DropdownMenuItem>
              <DropdownMenuItem>
                <View size={18} className="mr-2" />
                Manage Views...
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <File size={18} className="mr-2" />
                Export to csv
              </DropdownMenuItem>
              <DropdownMenuItem>
                <File size={18} className="mr-2" />
                Export to Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button variant="secondary" className="">
          <ChevronLeft />
        </Button>
        <Button variant="secondary">
          <ChevronRight />
        </Button>
        <Button variant="secondary">View Uploads</Button>
      </div>
      <InputForms
        open={open}
        onOpenChange={() => setOpen(false)}
        data={drawDocumentFormInputs}
        title={'Add New Document'}
        type="tranches"
      />
    </motion.div>
  );
};

function Documents() {
  const data: BudgetSection[] = [
    {
      title: 'Payment Application',
      items: [
        {
          document: 'Prem Contracting_Payment Application_₹281,206.80.pdf',
          vendor: 'Prem Contracting',
          currentAmountRequestedNet: '₹281,206.80',
          uploaded: '09/14/2023',
          pages: '1, 2',
          originalFile: '38 Automated Way - Draw 3.pdf',
          paidDate: '09/23/2023',
          status: '✔',
          backup: true,
          assignedTo: '-',
          approvalStatus: 'Approved',
        },
        {
          document: 'Arjun Concrete_Payment Application_₹130,497.30.pdf',
          vendor: 'Arjun Concrete',
          currentAmountRequestedNet: '₹130,497.30',
          uploaded: '09/14/2023',
          pages: '1, 2',
          originalFile: 'Sub Backup.pdf',
          paidDate: '09/23/2023',
          status: '✔',
          backup: true,
          assignedTo: '-',
          approvalStatus: 'Scheduled',
        },
        {
          document: 'Latha Earthwork_Payment Application_₹39,906.00.pdf',
          vendor: 'Latha Earthwork',
          currentAmountRequestedNet: '₹39,906.00',
          uploaded: '09/14/2023',
          pages: '5, 6',
          paidDate: '09/23/2023',
          originalFile: 'Sub Backup.pdf',
          status: '✔',
          backup: true,
          assignedTo: '-',
          approvalStatus: 'Inprogress',
        },
        {
          document: 'Suresh Metal_Payment Application_₹31,509.90.pdf',
          vendor: 'Suresh Metal',
          currentAmountRequestedNet: '₹31,509.90',
          uploaded: '09/14/2023',
          paidDate: '09/23/2023',
          pages: '9, 10',
          originalFile: 'Sub Backup.pdf',
          status: '✔',
          backup: true,
          assignedTo: '-',
          approvalStatus: 'Declined',
        },
        {
          document: 'Aarif Masonry_Payment Application_₹68,444.10.pdf',
          vendor: 'Aarif Masonry',
          currentAmountRequestedNet: '₹68,444.10',
          uploaded: '09/14/2023',
          paidDate: '09/23/2023',
          pages: '13, 14',
          originalFile: 'Sub Backup.pdf',
          status: '✔',
          backup: true,
          assignedTo: '-',
          approvalStatus: 'Declined',
        },
        {
          document: "Sid's Sitework_Payment Application_₹10,849.50.pdf",
          vendor: "Sid's Sitework",
          currentAmountRequestedNet: '₹10,849.50',
          uploaded: '09/14/2023',
          pages: '17, 18',
          paidDate: '09/23/2023',
          originalFile: 'Sub Backup.pdf',
          status: '✔',
          backup: true,
          assignedTo: '-',
          approvalStatus: 'Approved',
        },
        {
          document: 'Payment Application Subtotal',
          vendor: '',
          currentAmountRequestedNet: '₹562,413.60',
          uploaded: '09/14/2023',
          pages: '',
          originalFile: '',
          paidDate: '19/14/2023',
          status: '✔',
          backup: false,
          assignedTo: '-',
          approvalStatus: ' ',
          type: 'subtotal',
        },
      ],
    },
  ];

  const columns: BaseHeaderProps[] = [
    { title: '', classname: '', key: '' },
    { title: 'Document', classname: '', key: 'document' },
    { title: 'Vendor', classname: '', key: 'vendor' },
    {
      title: 'Current Amount Requested (Net)',
      classname: '',
      key: 'currentAmountRequestedNet',
    },
    { title: 'Uploaded', classname: '', key: 'uploaded' },
    {
      title: 'Paid Date',
      classname: '',
      key: 'paidDate',
    },
    { title: 'Pages', classname: '', key: 'pages' },
    { title: 'Original File', classname: '', key: 'originalFile' },
    { title: 'Status', classname: '', key: 'status' },
    {
      title: 'Approval Status',
      classname: '',
      key: 'approvalStatus',
    },
  ];

  const [tableColumns, setTableColumns] = useState<BaseHeaderProps[]>(columns);
  const router = useRouter();
  const admin = useRecoilValue(userRole);

  useEffect(() => {
    if (admin) {
      const adminColumn = {
        title: 'Assigned To',
        classname: '',
        key: 'assignedTo',
      };
      setTableColumns(prev => [...prev, adminColumn]);
    }
  }, [admin]);

  const handleOnclick = admin ? () => router.push(`/draw/document-preview`) : () => { };

  return (
    <div>
      {/* <Header /> */}
      <FilterContainer />
      <div className="mx-5">
        <LedgerTypeTable
          data={data}
          headers={tableColumns}
          needCheckbox={true}
          onRowClick={handleOnclick}
        />
      </div>
    </div>
  );
}

export default Documents;
