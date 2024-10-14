import DrawTable from "../../../components/CustomizedTable/CustomizedTable";
import { InputForms } from "../../../components/InputForms/InputForms";
import { FormInput } from "../../../components/LedgerTypeTable/Filter";
import { Button } from "../../../components/ui/button";
import { BaseHeaderProps, BaseTableData } from "../../../lib/componentProps";
import React, { useState } from "react";

const LineItemSettings = () => {
  const [open, setOpen] = useState<boolean>(false);
  const projectDatas: BaseTableData[] = [
    {
      name: "Interest Reserves",
      createdBy: "Ramesh",
      createdOn: "10/08/2024",
      category: "Soft Cost",
    },
    {
      name: "Development Fee",
      createdBy: "Ramesh",
      createdOn: "10/08/2024",
      category: "Soft Cost",
    },
    {
      name: "Tranche/Inspector Fees",
      createdBy: "Ramesh",
      createdOn: "10/08/2024",
      category: "Fees and Interest",
    },
    {
      name: "Legal",
      createdBy: "Ramesh",
      createdOn: "10/08/2024",
      category: "Soft Cost",
    },
    {
      name: "Architect",
      createdBy: "Ramesh",
      createdOn: "10/08/2024",
      category: "Soft Cost",
    },
    {
      name: "Engineering",
      createdBy: "Ramesh",
      createdOn: "10/08/2024",
      category: "Soft Cost",
    },
    {
      name: "Title Insurance",
      createdBy: "Ramesh",
      createdOn: "10/08/2024",
      category: "Soft Cost",
    },
    {
      name: "Environmental",
      createdBy: "Ramesh",
      createdOn: "10/08/2024",
      category: "Soft Cost",
    },
    {
      name: "Soft Cost Contingency",
      createdBy: "Ramesh",
      createdOn: "10/08/2024",
      category: "Soft Cost",
    },
    {
      name: "Site Acquisition",
      createdBy: "Ramesh",
      createdOn: "10/08/2024",
      category: "Soft Cost",
    },
    {
      name: "GENERAL REQUIREMENTS",
      createdBy: "Ramesh",
      createdOn: "10/08/2024",
      category: "Fees and Interest",
    },
    {
      name: "CONCRETE",
      createdBy: "Ramesh",
      createdOn: "10/08/2024",
      category: "Hard Cost",
    },
    {
      name: "MASONRY",
      createdBy: "Ramesh",
      createdOn: "10/08/2024",
      category: "Hard Cost",
    },
    {
      name: "METAL",
      createdBy: "Ramesh",
      createdOn: "10/08/2024",
      category: "Hard Cost",
    },
    {
      name: "WOOD & PLASTICS",
      createdBy: "Ramesh",
      createdOn: "10/08/2024",
      category: "Hard Cost",
    },
    {
      name: "THERMAL & MOISTURE",
      createdBy: "Ramesh",
      createdOn: "10/08/2024",
      category: "Hard Cost",
    },
    {
      name: "OPENINGS",
      createdBy: "Ramesh",
      createdOn: "10/08/2024",
      category: "Hard Cost",
    },
    {
      name: "FINISHES",
      createdBy: "Ramesh",
      createdOn: "10/08/2024",
      category: "Hard Cost",
    },
    {
      name: "SPECIALTIES",
      createdBy: "Ramesh",
      createdOn: "10/08/2024",
      category: "Hard Cost",
    },
  ];

  const tableHeaders: BaseHeaderProps[] = [
    {
      title: "Line Item Name",
      classname: "",
      key: "name",
    },    
    {
      title: "Category",
      classname: "",
      key: "category",
    },
    {
      title: "Created By",
      classname: "",
      key: "createdBy",
    },
    {
      title: "Created On",
      classname: "",
      key: "createdOn",
    },
  ];

  const drawDocumentFormInputs: FormInput[] = [
    {
      type: "text",
      label: "Line Item Name",
      name: "LineItemName",
      required: false,
    },
  ];
  return (
    <div>
      <div className="mt-2 my-3 text-right">
        <Button
          className="bg-themeBlue hover:bg-themeBlue"
          onClick={() => setOpen(true)}
        >
          Add Line Item
        </Button>
      </div>
      <div className="w-[90vw] mx-auto  [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] p-5">
        <DrawTable tableData={projectDatas} headers={tableHeaders} />
      </div>
      <InputForms
        open={open}
        onOpenChange={() => setOpen(false)}
        data={drawDocumentFormInputs}
        title={"Add New Line Item"}
      />
    </div>
  );
};

export default LineItemSettings;
