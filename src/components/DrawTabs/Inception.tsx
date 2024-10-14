/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import DatePicker from "../DatePicker/DatePicker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { BaseHeaderProps, BaseTableData } from "../../lib/componentProps";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FormInput } from "../LedgerTypeTable/Filter";
import { InputForms } from "../InputForms/InputForms";
import { ArrowDownAZ, ArrowDownZA } from "lucide-react";

interface headerProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

export const InceptionDrawHeader = ({
  selectedTab,
  setSelectedTab,
}: headerProps) => {
  const handleTabs = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <div>
      <div className="flex px-5 py-3 border-y border-[#fff] justify-between items-center">
        <p className="text-white text-base">Inspection Report</p>
        {/* <Button>Restart Inspection Report</Button> */}
      </div>
      <div className="my-2 flex items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => handleTabs("details")}
            className={selectedTab === "details" ? "bg-themeBlue" : ""}
          >
            Details
          </Button>
          <Button
            onClick={() => handleTabs("schduled_values")}
            className={selectedTab === "schduled_values" ? "bg-themeBlue" : ""}
          >
            Schduled of Values
          </Button>
          {/* <Button
            onClick={() => handleTabs("images")}
            className={selectedTab === "images" ? "bg-themeBlue" : ""}
          >
            Images
          </Button> */}
        </div>
        <div className="text-white text-sm">
          <p>
            <span>*</span> Saved Responses will be visible to all parties with
            access to the report
          </p>
        </div>
      </div>
    </div>
  );
};

interface Errors {
  inspectorName?: string;
  date?: string;
}
export const InceptionHeader = ({
  selectedTab,
  setSelectedTab,
}: headerProps) => {
  const handleTabs = (tab: string) => {
    setSelectedTab(tab);
  };

  const projectLists = ["Project 1", "Project 2", "Project 3", "Project 4"];

  return (
    <div className="mb-5">
      <div className="flex px-5 py-3 border-y border-[#fff] justify-between items-center">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => handleTabs("details")}
            className={selectedTab === "details" ? "bg-themeBlue" : ""}
          >
            Details
          </Button>
          <Button
            onClick={() => handleTabs("schduled_values")}
            className={selectedTab === "schduled_values" ? "bg-themeBlue" : ""}
          >
            Schduled of Values
          </Button>
          {/* <Button
            onClick={() => handleTabs("images")}
            className={selectedTab === "images" ? "bg-themeBlue" : ""}
          >
            Images
          </Button> */}
        </div>
        <div className="w-48">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={"Select the Projects"} />
            </SelectTrigger>
            <SelectContent>
              {projectLists.map((dpItem, key) => (
                <SelectItem value={dpItem} key={key}>
                  {dpItem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
export const InceptionDetail = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [inspectorName, setInspectorName] = useState<string>("mwheeler");
  const [siteRepresentative, setSiteRepresentative] = useState<string>("");
  const [weather, setWeather] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});

  const handleDateChange = (day: Date | undefined) => {
    if (day) setDate(day);
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!inspectorName) newErrors.inspectorName = "Inspector Name is required.";
    if (!date) newErrors.date = "Date is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (validateForm()) {
      // Form is valid, submit the form
      console.log({
        inspectorName,
        siteRepresentative,
        date,
        weather,
      });
    }
  };

  return (
    <div className="w-[60vh] mx-auto">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="inspector_name" className="text-white text-base">
            Inspector Name
          </Label>
          <Input
            id="inspector_name"
            value={inspectorName}
            onChange={(e) => setInspectorName(e.target.value)}
            disabled
          />
          {errors.inspectorName && (
            <p className="text-red-500 text-sm">{errors.inspectorName}</p>
          )}
        </div>
        <div>
          <Label htmlFor="site_representative" className="text-white text-base">
            Site Representative
          </Label>
          <Input
            id="site_representative"
            value={siteRepresentative}
            onChange={(e) => setSiteRepresentative(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="date" className="text-white text-base">
            Date
          </Label>
          <DatePicker date={date} handleDateChange={handleDateChange} />
          {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
        </div>
        <div>
          <Label htmlFor="weather" className="text-white text-base">
            Weather
          </Label>
          <Input
            id="weather"
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
          />
        </div>
        <Button type="submit" className="mt-5">
          Submit
        </Button>
      </form>
    </div>
  );
};
interface HeaderTextProps {
  data: BaseTableData[];
  setData: (data: BaseTableData[]) => void;
  header: BaseHeaderProps
}

type SortOrder = "asc" | "desc";
const HeaderText: React.FC<HeaderTextProps> = ({ data, setData, header }) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const sortTable = (column: keyof BaseTableData) => {
    const newSortOrder: SortOrder = sortOrder === "asc" && sortColumn === column ? "desc" : "asc";
    setSortOrder(newSortOrder);
    setSortColumn(column as string);

    const sortedData = [...data].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      const aString = aValue.toString();
      const bString = bValue.toString();
      const isNumeric = !isNaN(Number(aString)) && !isNaN(Number(bString));

      if (isNumeric) {
        return newSortOrder === "asc"
          ? Number(aString) - Number(bString)
          : Number(bString) - Number(aString);
      }

      if (aString < bString) return newSortOrder === "asc" ? -1 : 1;
      if (aString > bString) return newSortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setData(sortedData);
  };

  return (
    <TableHead
      className={`capitalize ₹{header?.classname} text-nowrap cursor-pointer`}
      onClick={() => sortTable(header.key)}
    >
      <div className="flex items-center justify-between gap-1">
        {header?.title}
        {sortColumn === header.key && (
          <div>
            {sortOrder === "desc" ? <ArrowDownZA size={16} /> : <ArrowDownAZ size={16} />}
          </div>
        )}
      </div>
    </TableHead>
  );
};

export const ScheduledOfValues = () => {
  const [open, setOpen] = useState<boolean>(false);
  const hardCosts: BaseTableData[] = [
    {
      lineItem: "GENERAL REQUIREMENTS",
      currentBudget: "₹542,511.00",
      amountRequestedGross: "₹0.00",
      amountRequestedToDate: "₹0.00",
      percentRequestedToDate: "0%",
      balanceToFundGross: "₹542,511.00",
      greatestInspectionPercentComplete: "-",
      toDatePercentComplete: "",
      toDateAmountComplete: "",
      notes: "",
    },
    {
      lineItem: "CONCRETE",
      currentBudget: "₹1,622,887.00",
      amountRequestedGross: "₹144,997.00",
      amountRequestedToDate: "₹238,079.00",
      percentRequestedToDate: "15%",
      balanceToFundGross: "₹1,384,808.00",
      greatestInspectionPercentComplete: "-",
      toDatePercentComplete: "",
      toDateAmountComplete: "",
      notes: "",
    },
    {
      lineItem: "MASONRY",
      currentBudget: "₹628,000.00",
      amountRequestedGross: "₹76,049.00",
      amountRequestedToDate: "₹85,072.00",
      percentRequestedToDate: "14%",
      balanceToFundGross: "₹542,928.00",
      greatestInspectionPercentComplete: "-",
      toDatePercentComplete: "",
      toDateAmountComplete: "",
      notes: "",
    },
    {
      lineItem: "METAL",
      currentBudget: "₹362,000.00",
      amountRequestedGross: "₹35,011.00",
      amountRequestedToDate: "₹124,356.00",
      percentRequestedToDate: "34%",
      balanceToFundGross: "₹237,644.00",
      greatestInspectionPercentComplete: "-",
      toDatePercentComplete: "",
      toDateAmountComplete: "",
      notes: "",
    },
    {
      lineItem: "WOOD & PLASTICS",
      currentBudget: "₹2,236,157.00",
      amountRequestedGross: "₹0.00",
      amountRequestedToDate: "₹0.00",
      percentRequestedToDate: "0%",
      balanceToFundGross: "₹2,236,157.00",
      greatestInspectionPercentComplete: "-",
      toDatePercentComplete: "",
      toDateAmountComplete: "",
      notes: "",
    },
    {
      lineItem: "THERMAL & MOISTURE",
      currentBudget: "₹94,451.00",
      amountRequestedGross: "₹0.00",
      amountRequestedToDate: "₹0.00",
      percentRequestedToDate: "0%",
      balanceToFundGross: "₹94,451.00",
      greatestInspectionPercentComplete: "-",
      toDatePercentComplete: "",
      toDateAmountComplete: "",
      notes: "",
    },
    {
      lineItem: "OPENINGS",
      currentBudget: "₹483,903.00",
      amountRequestedGross: "₹0.00",
      amountRequestedToDate: "₹0.00",
      percentRequestedToDate: "0%",
      balanceToFundGross: "₹483,903.00",
      greatestInspectionPercentComplete: "-",
      toDatePercentComplete: "",
      toDateAmountComplete: "",
      notes: "",
    },
    {
      lineItem: "FINISHES",
      currentBudget: "₹522,500.00",
      amountRequestedGross: "₹0.00",
      amountRequestedToDate: "₹0.00",
      percentRequestedToDate: "0%",
      balanceToFundGross: "₹522,500.00",
      greatestInspectionPercentComplete: "-",
      toDatePercentComplete: "",
      toDateAmountComplete: "",
      notes: "",
    },
    {
      lineItem: "SPECIALTIES",
      currentBudget: "₹46,231.00",
      amountRequestedGross: "₹0.00",
      amountRequestedToDate: "₹0.00",
      percentRequestedToDate: "0%",
      balanceToFundGross: "₹46,231.00",
      greatestInspectionPercentComplete: "-",
      toDatePercentComplete: "",
      toDateAmountComplete: "",
      notes: "",
    },
  ];

  const [data, setData] = useState<BaseTableData[]>(hardCosts);

  const inceptionFormInputs: FormInput[] = [
    {
      type: "file",
      label: "Documents",
      name: "file",
      placeholder: "",
      required: false,
    },
  ];

  const costTableHeaders: BaseHeaderProps[] = [
    {
      title: "Line Item",
      classname: "",
      key: "lineItem",
    },
    {
      title: "Current Budget",
      classname: "",
      key: "currentBudget",
    },
    {
      title: "Amount Requested (Gross)",
      classname: "",
      key: "amountRequestedGross",
    },
    {
      title: "Amount Requested to Date (Gross)",
      classname: "",
      key: "amountRequestedToDate",
    },
    {
      title: "% Requested to Date",
      classname: "",
      key: "percentRequestedToDate",
    },
    {
      title: "Banlance Line (Gross)",
      classname: "",
      key: "balanceToFundGross",
    },
    {
      title: "Greatest Inspection % Complete Prior to Current Tranche",
      classname: "",
      key: "greatestInspectionPercentComplete",
    },
    {
      title: "To Date Percent Complete",
      classname: "",
      key: "toDatePercentComplete",
    },
    {
      title: "To Date Amount Complete",
      classname: "",
      key: "toDateAmountComplete",
    },
    {
      title: "Notes",
      classname: "",
      key: "notes",
    },
  ];

  const renderText = (
    headers: { key: string | number },
    row: { [x: string]: string | null }
  ) => {
    let data: string | null = row[headers.key];
    if (
      headers.key === "toDateAmountComplete" ||
      headers.key === "toDatePercentComplete" ||
      headers.key === "notes"
    ) {
      return (
        <Input
          className="w-[200px] text-black"
          onChange={(e) => (data = e.target.value)}
        />
      );
    } else {
      return data;
    }
  };

  return (
    <div className="w-[80vw] mx-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {costTableHeaders.map((header, index) => (
              <HeaderText
                header={header}
                key={index}
                data={data}
                setData={setData}
              />
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row: any, rowIndex) => (
            <TableRow key={rowIndex}>
              {costTableHeaders.map((header, cellIndex) => (
                <TableCell
                  className={`text-nowrap text-center text-white ₹{header.rowClassname}`}
                  key={cellIndex}
                  onClick={() =>
                    header.onClick ? header.onClick!(row) : undefined
                  }
                >
                  {renderText(header, row)}
                </TableCell>
              ))}
              <TableCell className={`text-nowrap text-center text-white `}>
                <Button
                  variant={"link"}
                  className="text-blue-500"
                  onClick={() => setOpen(true)}
                >
                  Upload or View Images
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <InputForms
        open={open}
        onOpenChange={() => setOpen(false)}
        data={inceptionFormInputs}
        title={"Upload Document"}
      />
    </div>
  );
};

const Inception = ({ type }: { type: "draw" | "inspection" }) => {
  const [selectedTab, setSelectedTab] = useState<string>("details");

  return (
    <div>
      {type === "draw" ? (
        <InceptionDrawHeader
          setSelectedTab={setSelectedTab}
          selectedTab={selectedTab}
        />
      ) : (
        <InceptionHeader
          setSelectedTab={setSelectedTab}
          selectedTab={selectedTab}
        />
      )}
      {selectedTab === "details" && <InceptionDetail />}
      {selectedTab === "schduled_values" && <ScheduledOfValues />}
      {/* {selectedTab === "images" && <Images />} */}
    </div>
  );
};

export default Inception;
