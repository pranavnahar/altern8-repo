import { BudgetSection } from '../../../app/(dashboard)/draw/[id]/page';
import { userRole } from '../../../atom/atom';
import { InputForms } from '../../../components/InputForms/InputForms';
import { FormInput } from '../../../components/LedgerTypeTable/Filter';
import LedgerTypeTable from '../../../components/LedgerTypeTable/LedgerTypeTable';
import { Button } from '../../../components/ui/button';
import { BaseHeaderProps } from '../../../lib/componentProps';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

const Document = () => {
  const [open, setOpen] = useState<boolean>(false);
  const ProjectDocumentFormInputs: FormInput[] = [
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
    { title: 'Pages', classname: '', key: 'pages' },
    { title: 'Original File', classname: '', key: 'originalFile' },
    { title: 'Status', classname: '', key: 'status' },
    {
      title: 'Approval Status',
      classname: '',
      key: 'approvalStatus',
    },
  ];
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
          originalFile: '38 Automated Way - Tranche 3.pdf',
          status: '✔',
          backup: true,
          assignedTo: '-',
          approvalStatus: 'Declined',
        },
        {
          document: 'Arjun Concrete_Payment Application_₹130,497.30.pdf',
          vendor: 'Arjun Concrete',
          currentAmountRequestedNet: '₹130,497.30',
          uploaded: '09/14/2023',
          pages: '1, 2',
          originalFile: 'Sub Backup.pdf',
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
          pages: '9, 10',
          originalFile: 'Sub Backup.pdf',
          status: '✔',
          backup: true,
          assignedTo: '-',
          approvalStatus: 'Approved',
        },
        {
          document: 'Aarif Masonry_Payment Application_₹68,444.10.pdf',
          vendor: 'Aarif Masonry',
          currentAmountRequestedNet: '₹68,444.10',
          uploaded: '09/14/2023',
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
          status: '✔',
          backup: false,
          assignedTo: '-',
          approvalStatus: '',
          type: 'subtotal',
        },
      ],
    },
  ];
  const router = useRouter();
  const params = useParams();
  const [tableColumns, setTableColumns] = useState<BaseHeaderProps[]>(columns);
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

  const handleOnclick = admin
    ? () => router.push(`/project/${params?.id}/document_preview`)
    : () => {};

  return (
    <div className="flex flex-col px-5 h-[65vh] overflow-auto">
      <Button className=" self-end my-2 " onClick={() => setOpen(true)}>
        Add Documents
      </Button>
      <LedgerTypeTable
        data={data}
        onRowClick={handleOnclick}
        headers={tableColumns}
        needCheckbox={true}
      />
      <InputForms
        open={open}
        onOpenChange={() => setOpen(false)}
        data={ProjectDocumentFormInputs}
        title={'Add New Documents'}
        type="documents"
      />
    </div>
  );
};

export default Document;
