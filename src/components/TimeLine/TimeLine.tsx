"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GanttChart from "../Charts/GranttChart";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import BasicTable from "../global/basic-table";
import { useParams } from "next/navigation";
import { fetchProjectTask } from "../../app/(dashboard)/project/actions/fetch-project-task.actions";
import AddTaskSheet from "./AddTaskSheet";
import taskColumns from "./columns/task-columns";
import { Button } from "../ui/button";

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
  const [showGantt, setShowGantt] = useState<boolean>(false);
  const [formUsage, setFormUsage] = useState<"create" | "edit">("create");
  const params = useParams();
  const projectId = Number(params.id);
  const [taskList, setTaskList] = useState<any[]>([]);

  useEffect(() => {
    const handleFetchTask = async () => {
      const data: any = await fetchProjectTask(projectId)
      setTaskList([
        {
          id: 1,
          name: "Task 1",
          startDate: "2024-01-01",
          endDate: "2024-01-15",
          status: "In Progress",
          owner: "Rahul Sharma",
        },
        {
          id: 2,
          name: "Task 2",
          startDate: "2024-01-10",
          endDate: "2024-02-05",
          status: "Not Started",
          owner: "Priya Patel",
        },
        {
          id: 3,
          name: "Task 3",
          startDate: "2024-02-01",
          endDate: "2024-02-28",
          status: "Completed",
          owner: "Amit Kumar",
        },
        {
          id: 4,
          name: "Task 4",
          startDate: "2024-02-15",
          endDate: "2024-03-15",
          status: "In Progress",
          owner: "Neha Gupta",
        },
        {
          id: 5,
          name: "Task 5",
          startDate: "2024-03-01",
          endDate: "2024-03-31",
          status: "Not Started",
          owner: "Vikram Singh",
        },
      ])
    }
    handleFetchTask()
  }, [])

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
    <section>
      <div className="px-5">
        <div className="flex items-center justify-between text-white my-5 w-[97%] mx-auto">
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
      <div className="grid w-[95%] mx-auto mt-10">
        <div className="grid grid-cols-3">
          <div></div>
          <h1 className="text-3xl text-white font-semibold text-center">TaskList</h1>
          <AddTaskSheet />
        </div>
        <BasicTable data={taskList} columns={taskColumns} filters={[]} needFilters={false} />
      </div>
    </section>
  );
};
