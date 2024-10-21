'use client'

import React, { useState } from "react";
import { LayoutGrid, LayoutList } from "lucide-react";
import AddProjectSheet from "./add-project-sheet";
import BasicTable from "../../../../components/global/basic-table";
import columns from "../columns";
import DashboardGrids from "./dashboard-grids";
import { Button } from "../../../../components/ui/button";
import { Project, SummaryItem } from "../types";

interface DashboardTableFilterClientProps {
  projects: Project[];
  summaryData: SummaryItem[];
}

const Filters = ({ projects, summaryData }: DashboardTableFilterClientProps) => {
  const [gridType, setGridType] = useState<boolean>(false);

  return (
    <div className="flex w-full pr-10">
      <div className="w-full p-4 rounded-lg text-white">
        <div className="flex gap-2 mb-4">
          <Button>
            Charts
          </Button>
          <div className="flex items-center gap-1 w-full p-1 border-b border-b-gray-400">
            <p>Project List</p>
            <div className="flex items-center gap-1 relative bg-black rounded-lg ml-2">
              <div
                className={`absolute top-0 bottom-0 left-0 w-1/2 bg-themeBlue rounded-lg ${gridType ? 'translate-x-full' : ''
                  } transition-transform duration-300`}
              />
              <div
                className={`p-1 rounded-lg cursor-pointer z-20`}
                onClick={() => setGridType(false)}
              >
                <LayoutList
                  size={15}
                  color={!gridType ? "white" : "#555"}
                />
              </div>
              <div
                className={`p-1 rounded-lg cursor-pointer z-20`}
                onClick={() => setGridType(true)}
              >
                <LayoutGrid size={15} color={gridType ? "white" : "#555"} />
              </div>
            </div>
          </div>
          <AddProjectSheet />
        </div>

        <div className="overflow-auto max-h-[calc(100vh-200px)]">
          {!gridType ? (
            <BasicTable data={projects} columns={columns} filters={[]} needFilters={false} />
          ) : (
            <div className="flex gap-2 items-center justify-center flex-wrap p-2">
              {projects.map((project: any, index: number) => (
                <div className="w-[48%] p-2" key={index}>
                  <DashboardGrids data={project} user="customer" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Filters
