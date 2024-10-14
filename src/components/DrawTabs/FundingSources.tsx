"use client";
import React, { useState } from "react";
import DrawTable from "../CustomizedTable/CustomizedTable";
import { BaseHeaderProps } from "../../lib/componentProps";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  File,
  Filter,
  Save,
  SlidersHorizontal,
  View,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { InputForms } from "../InputForms/InputForms";
import { FormInput } from "../LedgerTypeTable/Filter";

function FundingSources() {
  const data = [
    {
      type: "EQUITY",
      contributed: "₹ 1,590,709.00",
      total: "₹ 1,590,709.00",
    },
    {
      type: "DEBT",
      contributed: "₹ 1,590,709.00",
      total: "₹ 9,733,722.00",
    },
    {
      type: "SECONDARY DEBT",
      contributed: "₹ 8,090,709.00",
      total: "₹ 11,324,431.00",
    },
    {
      type: "TOTAL",
      contributed: "₹ 1,590,709.00",
      total: "₹ 11,324,431.00",
    },
  ];

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
      type: "email",
      label: "Email",
      name: "email",
      placeholder: "Enter the Email Id",
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

  //filter
  const FilterContainer = () => {
    const [open, setOpen] = useState<boolean>(false);
    return (
      <motion.div
        className="flex items-end justify-between my-3"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-end gap-3">
          <div className="text-black">
            <strong className="text-xs text-white">Search By:</strong>
            <Select>
              <SelectTrigger className="w-[180px]   ">
                <SelectValue
                  className="text-black"
                  placeholder="Select by column"
                />
              </SelectTrigger>
              <SelectContent className="text-black">
                <SelectGroup>
                  <SelectItem value="Projects">Type</SelectItem>
                  <SelectItem value="location">Contributed</SelectItem>
                  <SelectItem value="commitments">Total</SelectItem>
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
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Add Source
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
        </div>
        <InputForms
          open={open}
          onOpenChange={() => setOpen(false)}
          data={AddSourceFormInput}
          title={"Add Funding Source"}
        />
      </motion.div>
    );
  };

  const fundingTabHeaders: BaseHeaderProps[] = [
    {
      title: "Type",
      classname: "",
      key: "type",
    },
    {
      title: "Contributed",
      classname: "",
      key: "contributed",
    },
    {
      title: "Total",
      classname: "",
      key: "total",
    },
  ];
  return (
    <div className="px-5">
      <FilterContainer />{" "}
      <div>
        <DrawTable tableData={data} headers={fundingTabHeaders} />
      </div>
    </div>
  );
}

export default FundingSources;
