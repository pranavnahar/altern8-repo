"use client";
import { InputForms } from "../../../components/InputForms/InputForms";
import { FormInput } from "../../../components/LedgerTypeTable/Filter";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import React, { Fragment, useState } from "react";


interface MenuOption {
  id: number;
  label: string;
  onClick: () => void;
}

interface MenuOptions {
  moveTo: MenuOption[];
  'Pari Passu With': MenuOption[];
  '': MenuOption[];
}

interface Column {
  name: string;
  organization: string;
  amount: string;
  percentage: string;
  type: string;
  closeDate: string;
  maturityDate: string;
}

interface Header {
  label: string;
  values: MenuOptions;
}

interface FinanceData {
  headers: Header[];
  columns: Column[];
}

const FundingSources = () => {
  const [open, setOpen] = useState<boolean>(false);

  const menuOptions: MenuOptions = {
    moveTo: [
      {
        id: 1,
        label: "Pay 2nd (after Acquisition Loan)",
        onClick: () => console.log("Move to Pay 2nd"),
      },
      {
        id: 2,
        label: "Pay 3rd (after Construction Loan)",
        onClick: () => console.log("Move to Pay 3rd"),
      },
    ],
    'Pari Passu With': [
      {
        id: 1,
        label: "Acquisition Loan",
        onClick: () => console.log("Pari Passu with Acquisition Loan"),
      },
      {
        id: 2,
        label: "Construction Loan",
        onClick: () => console.log("Pari Passu with Construction Loan"),
      },
    ],
    '': [
      {
        id: 1,
        label: "Delete Funding Source",
        onClick: () => console.log("Delete Funding Source"),
      },
    ],
  };
  const financeData: FinanceData = {
    headers: [
      {
        label: "Pay 1st",
        values: menuOptions,
      },
      {
        label: "Pay 2st",
        values: menuOptions,
      },
      {
        label: "Pay 3rd",
        values: menuOptions,
      },
    ],
    columns: [
      {
        name: "Owner Equity",
        organization: "Mitchell Development",
        amount: "$1,590,709",
        percentage: "14%",
        type: "Equity",
        closeDate: "2023-06-28",
        maturityDate: "2023-12-29",
      },
      {
        name: "Acquisition Loan",
        organization: "Great Bank",
        amount: "$2,933,722",
        percentage: "26%",
        type: "Debt",
        closeDate: "2023-06-28",
        maturityDate: "2023-12-29",
      },
      {
        name: "Construction Loan",
        organization: "Bank of Rabbet",
        amount: "$6,800,000",
        percentage: "60%",
        type: "Debt",
        closeDate: "2023-08-29",
        maturityDate: "2024-08-26",
      },
    ],
  };
  const AddSourceFormInput: FormInput[] = [
    {
      type: "text",
      label: "Name",
      name: "name",
      placeholder: "Enter the Name",
      required: false,
    },
    {
      type: "text",
      label: "Stakeholder Name",
      name: "stakeholderName",
      placeholder: "Enter the Stakeholder Name",
      required: false,
    },
    {
      type: "number",
      label: "Contact Number",
      name: "contactno",
      placeholder: "Enter the Contact Number",
      required: false,
    },
    {
      type: "text",
      label: "Organization",
      name: "organization",
      placeholder: "Enter the Organization",
      required: false,
    },
    {
      type: "number",
      label: "Contributed Amount",
      name: "contributedAmount",
      placeholder: "Enter the Amount",
      required: false,
    },
    {
      type: "number",
      label: "Total Amount",
      name: "totalAmount",
      placeholder: "Enter the Amount",
      required: false,
    },
    {
      type: "number",
      label: "Percentage",
      name: "percentage",
      placeholder: "Enter the Percentage",
      required: false,
      min: 0,
      max: 100,
    },
    {
      type: "text",
      label: "Type",
      name: "type",
      placeholder: "Enter the Type",
      required: false,
    },
    {
      type: "date",
      label: "Close Date",
      name: "close_date",
      placeholder: "Select the Close Date",
      required: false,
    },
    {
      type: "date",
      label: "Maturity Date",
      name: "maturity_date",
      placeholder: "Select the Maturity Date",
      required: false,
    },
  ];
  const [columns, setColumns] = useState<Column[]>(financeData.columns);

    // Handle input change
  const handleInputChange = (
    index: number,
    field: keyof Column,
    value: string
  ) => {
    const newColumns = [...columns];
    newColumns[index][field] = value;
    setColumns(newColumns);
  };

  
  return (
    <div>
      <div>
        <div className="flex items-center gap-8 my-1">
          <p>
            <span>Budget</span> : ₹ 1,00,000
          </p>

          <p>
            <span>Total Funding Sources</span> : ₹ 1,00,000
          </p>
        </div>
        <div className="flex items-center justify-between gap-8 my-1">
          <div className="w-[30%] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch id="allocate-funds" className="bg-themeBlue" />
              <Label htmlFor="allocate-funds">
                Auto allocate funds on Tranche
              </Label>
            </div>

            {/* <div className="flex items-center space-x-2">
              <Switch id="uses-of-funds" className="bg-themeBlue" />
              <Label htmlFor="uses-of-funds">Set uses of funds</Label>
            </div> */}
          </div>

          <Button variant={"default"} onClick={() => setOpen(true)} className="bg-themeBlue">
            Add Funding Source
          </Button>
        </div>
      </div>
      <div className="p-4 text-white rounded-lg">
        <div
          // key={index}
          className="grid grid-cols-4 gap-2 text-white"
        >
          <div className="flex flex-col gap-2">
            <p className="p-3 h-12 "></p>
            <p className="p-3 h-12 border text-sm font-medium">Name</p>
            <p className="p-3 h-12 border text-sm font-medium">Organization</p>
            <p className="p-3 h-12 border text-sm font-medium">Amount</p>
            <p className="p-3 h-12 border text-sm font-medium">Percentage</p>
            <p className="p-3 h-12 border text-sm font-medium">Type</p>
            <p className="p-3 h-12 border text-sm font-medium">Close Date</p>
            <p className="p-3 h-12 border text-sm font-medium">Maturity Date</p>
          </div>
          {columns.map((column, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="h-12 flex items-center justify-center gap-3">
                <p>{financeData?.headers?.[index]?.label}</p>
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-black w-24" asChild>
                    <Button variant="outline">Orders</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="text-black flex flex-col ">
                    {Object.keys(financeData?.headers?.[index]?.values).map(
                      (ObjectKey, index) => (
                        <Fragment key={index}>
                          <DropdownMenuLabel className="capitalize">
                            {ObjectKey}
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            {financeData?.headers?.[index]?.values?.[
                              ObjectKey as keyof MenuOptions
                            ]?.map((data: MenuOption, i: number) => (
                              <DropdownMenuItem key={i} onClick={data.onClick}>
                                <span>{data.label}</span>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuGroup>
                        </Fragment>
                      )
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="h-12">
                <input
                  type="text"
                  className=" h-full w-full shadow-sm sm:text-sm  text-black border-gray-300 rounded-md p-2"
                  value={column.name}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                />
              </div>
              <div className="h-12">
                <input
                  type="text"
                  className=" h-full w-full shadow-sm sm:text-sm  text-black border-gray-300 rounded-md p-2"
                  value={column.organization}
                  onChange={(e) =>
                    handleInputChange(index, "organization", e.target.value)
                  }
                />
              </div>
              <div className="h-12">
                <input
                  type="text"
                  className=" h-full w-full shadow-sm sm:text-sm  text-black border-gray-300 rounded-md p-2"
                  value={column.amount}
                  onChange={(e) =>
                    handleInputChange(index, "amount", e.target.value)
                  }
                />
              </div>
              <div className="h-12">
                <input
                  type="text"
                  className=" h-full w-full shadow-sm sm:text-sm  text-black border-gray-300 rounded-md p-2"
                  value={column.percentage}
                  onChange={(e) =>
                    handleInputChange(index, "percentage", e.target.value)
                  }
                />
              </div>
              <div className="h-12">
                <input
                  type="text"
                  className=" h-full w-full shadow-sm sm:text-sm  text-black border-gray-300 rounded-md p-2"
                  value={column.type}
                  onChange={(e) =>
                    handleInputChange(index, "type", e.target.value)
                  }
                />
              </div>
              <div className="h-12">
                <input
                  type="date"
                  className=" h-full w-full shadow-sm sm:text-sm  text-black border-gray-300 rounded-md p-2"
                  value={column.closeDate}
                  onChange={(e) =>
                    handleInputChange(index, "closeDate", e.target.value)
                  }
                />
              </div>
              <div className="h-12">
                <input
                  type="date"
                  className=" h-full w-full shadow-sm sm:text-sm  text-black border-gray-300 rounded-md p-2"
                  value={column.maturityDate}
                  onChange={(e) =>
                    handleInputChange(index, "maturityDate", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
        {/* ))} */}
      </div>
      <InputForms
          open={open}
          onOpenChange={() => setOpen(false)}
          data={AddSourceFormInput}
          title={"Add Funding Source"}
        />
    </div>
  );
};

export default FundingSources;
