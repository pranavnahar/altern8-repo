"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import DrawTable from "../CustomizedTable/CustomizedTable";
import { FilterSheet } from "./FilterSheet";
import { BaseHeaderProps, BaseTableData } from "../../lib/componentProps";
import GanttChart from "../Charts/GranttChart";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export interface TaskData {
  Task: string;
  Owner: string;
  Status: string;
  OriginalStartDate: string;
  ProjectedActualStartDate: string;
  OriginalCompletionDate: string;
  ProjectedActualCompletionDate: string;
  CompletionDateVariance: string;
}

export interface TaskHeaderProps {
  title: string;
  classname?: string;
  rowClassname?: string;
  key: keyof TaskData;
  onClick?: (row: TaskData) => void;
}

export type ChartDataPoint = {
  x: [number, number];
  y: string;
};

interface TimeRanges {
  [key: string]: {
    min: number;
    max: number;
    format:
      | false
      | "millisecond"
      | "second"
      | "minute"
      | "hour"
      | "day"
      | "week"
      | "month"
      | "quarter"
      | "year"
      | undefined;
  };
}

interface chartTimeProps {
  min: number;
  max: number;
  format:
    | false
    | "millisecond"
    | "second"
    | "minute"
    | "hour"
    | "day"
    | "week"
    | "month"
    | "quarter"
    | "year"
    | undefined;
}

const data: ChartDataPoint[] = [
  {
    x: [new Date("2023-01-01").getTime(), new Date("2023-06-01").getTime()],
    y: "Land acquisition",
  },
  {
    x: [new Date("2023-03-01").getTime(), new Date("2023-04-01").getTime()],
    y: "Delivery",
  },
  {
    x: [new Date("2023-11-01").getTime(), new Date("2024-01-01").getTime()],
    y: "Phase 3",
  },

  {
    x: [new Date("2024-02-01").getTime(), new Date("2024-02-05").getTime()],
    y: "Phase 4",
  },
];

export const TimelineTab = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [chartTime, setChartTime] = useState<chartTimeProps>({
    min: new Date("2024-02-20").getTime(),
    max: new Date("2024-01-31").getTime(),
    format: "day",
  });
  const [showGantt, setShowGantt] = useState<boolean>(true);
  const tableData: BaseTableData[] = [
    {
      Task: "Delivery",
      Owner: "N/A",
      Status: "Not Started",
      OriginalStartDate: "02/29/2024",
      ProjectedActualStartDate: "02/29/2024",
      OriginalCompletionDate: "02/29/2024",
      ProjectedActualCompletionDate: "02/29/2024",
      CompletionDateVariance: "0 days",
    },
    {
      Task: "Phase 3",
      Owner: "N/A",
      Status: "In Progress",
      OriginalStartDate: "02/29/2024",
      ProjectedActualStartDate: "02/29/2024",
      OriginalCompletionDate: "02/29/2024",
      ProjectedActualCompletionDate: "02/29/2024",
      CompletionDateVariance: "0 days",
    },
  ];
  const [formUsage, setFormUsage] = useState<"create" | "edit">("create");
  const documentsTableHeaders: BaseHeaderProps[] = [
    {
      title: "Task",
      classname: "w-[100px]",
      key: "Task",
    },
    {
      title: "Owner",
      classname: "",
      key: "Owner",
    },
    {
      title: "Status",
      classname: "",
      key: "Status",
    },
    {
      title: "Original Start Date",
      classname: "",
      key: "OriginalStartDate",
    },
    {
      title: "Projected Actual Start Date",
      classname: "",
      key: "ProjectedActualStartDate",
    },
    {
      title: "Original Completion Date",
      classname: "",
      key: "OriginalCompletionDate",
    },
    {
      title: "Projected Actual Completion Date",
      classname: "",
      key: "ProjectedActualCompletionDate",
    },
    {
      title: "Completion Date Variance",
      classname: "",
      key: "CompletionDateVariance",
    },
  ];

  const OpenChange = () => {
    setOpen(false);
    setFormUsage("create");
  };

  const handleRadioChange = (value: string) => {
    const time: TimeRanges = {
      Day: {
        min: new Date("2024-01-31").getTime(),
        max: new Date("2024-02-20").getTime(), // Fixed this
        format: "day",
      },
      Month: {
        min: new Date("2023-01-01").getTime(),
        max: new Date("2023-09-01").getTime(),
        format: "month",
      },
      Week: {
        min: new Date("2023-01-01").getTime(),
        max: new Date("2023-04-01").getTime(),
        format: "week",
      },
    };
    setChartTime(time[value]);
  };
  

  const handleEdit = () => {
    setOpen(true);
    setFormUsage("edit");
  };

  return (
    <div>
      <div className=" px-5">
        <div className="flex items-center justify-between text-white my-5">
          <p> 1460 Comal Project Timeline</p>
          <div className="flex items-center gap-5">
            <p>View By : </p>
            <div>
              <RadioGroup
                className="flex items-center text-white"
                defaultValue="Day"
                onValueChange={handleRadioChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem className="bg-white" value="Day" id="r1" />
                  <Label htmlFor="r1">Day</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem className="bg-white" value="Week" id="r2" />
                  <Label htmlFor="r2">Week</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem className="bg-white" value="Month" id="r3" />
                  <Label htmlFor="r3">Month</Label>
                </div>
              </RadioGroup>
            </div>
            <Button
              variant={"outline"}
              className="bg-transparent text-white hover:bg-transparent hover:text-white"
              onClick={() => setShowGantt(!showGantt)}
            >
              {showGantt ? "Hide" : "Show"} Gantt
            </Button>
          </div>
        </div>
        {showGantt && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <GanttChart
              backgroundColor={["red", "blue", "pink", "green"]}
              data={data}
              min={chartTime?.min}
              max={chartTime?.max}
            />
          </motion.div>
        )}
      </div>
      <motion.div
        className="flex items-end justify-between px-5 my-3 m-2"
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

          <Button
            variant={"outline"}
            className="bg-transparent text-white hover:bg-transparent hover:text-white"
            onClick={() => setShowGantt(!showGantt)}
          >
            {showGantt ? "Hide" : "Show"} Gantt
          </Button>

          <Button
            variant="default"
            className="bg-themeBlue hover:bg-themeBlue"
            onClick={() => setOpen(true)}
          >
            Add New Task
          </Button>
        </div>
      </motion.div>
      <div className="px-5">
        <DrawTable
          tableData={tableData}
          headers={documentsTableHeaders}
          edit={true}
          editFunction={handleEdit}
        />
      </div>
      <FilterSheet
        open={open}
        onOpenChange={OpenChange}
        type={formUsage}
        data={{
          Task: "Delivery",
          Owner: "N/A",
          Status: "Not Started",
          OriginalStartDate: "02/29/2024",
          ProjectedActualStartDate: "02/29/2024",
          OriginalCompletionDate: "02/29/2024",
          ProjectedActualCompletionDate: "02/29/2024",
          CompletionDateVariance: "0",
        }}
      />
    </div>
  );
};
