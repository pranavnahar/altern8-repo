import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import ProgressCircle from "../../../components/ProgressCircle/ProgressCircle";
import BasicTable from "../../../components/global/basic-table";
import { InventoryColumns } from "./columns/inventory-columns";
import fundingColumns from "../ProjectSettings/columns/funding-columns";
import SummaryList from "../../../app/(dashboard)/projects/components/summary-list";
import { Inventory, FundingSource, SummaryItem, Project, InventoryResponse, FundingSourceResponse, SummaryResponse, ProjectData, TrancheData } from "./types";
import { fetchProjectInventory } from "../../../app/(dashboard)/project/actions/fetch-project-inventory.actions";
import { fetchProjectFunding } from "../../../app/(dashboard)/project/actions/get-project-funding";
import { fetchTranchData } from "../../../app/(dashboard)/project/actions/fetch-tranche-data";
import { fetchProjectSummary } from "../../../app/(dashboard)/project/actions/fetch-project-summary.actions";
import { fetchProjectTask } from "../../../app/(dashboard)/project/actions/fetch-project-task.actions";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { formatDate, formatINR } from "../../../utils/formatter";
import { IconChevronRight } from "@tabler/icons-react";
import StakeHolderModal from "./StakeHolderModal";
import taskColumns from "../../../components/TimeLine/columns/task-columns";
import { Skeleton } from "../../../components/ui/skeleton";

type Props = {
  user: string;
  openDrawForm: () => void;
}

const ProjectInfo = ({ projectId, user, openStakeholderModal }: any) => {
  return (
    <Card className="flex items-center [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] border-0 text-white gap-3 p-4">
      <div className="relative h-[230px] w-[250px]">
        <Image
          src="https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          layout="fill"
          alt="project_image"
          className="rounded-l-xl"
        />
      </div>
      <div>
        {user === "borrower" && <p className="text-xs mb-1">{"BO-0001"}</p>}
        <p className="text-base">1460 Comal Project</p>
        <p className="text-xs uppercase">Delhi, India</p>
        <div className="my-1">
          <div className="text-blue-600 text-[13px] cursor-pointer">
            Tranche 3 - started on 9/14/2023
          </div>
        </div>
        <div className="my-1">
          <p className="text-sm uppercase">BORROWER</p>
          <p className="text-sm">Joseph Contracting</p>
        </div>
        <div className="my-2">
          <p className="text-sm uppercase">General Contractor</p>
          <p className="text-sm">Joseph Contracting</p>
        </div>
        <div
          className="text-blue-600 text-[13px] cursor-pointer"
          onClick={openStakeholderModal}
        >
          View all stakeholders
        </div>
      </div>
    </Card>
  );
};

const ProjectCompletion = ({ projectCompletion }: any) => {
  return (
    <div className="grid items-center gap-4 w-full">
      {projectCompletion.map((data: ProjectData, index: number) => (
        <div key={index} className="text-sm flex justify-center items-center flex-col w-full bg-white/20 p-2 rounded-lg">
          <p className="text-center text-sm font-medium text-zinc-200">{data?.label}</p>
          <div className="my-2">
            <ProgressCircle radius={30} stroke={10} progress={data?.percentage} />
          </div>
          <p className="text-zinc-400">{data?.date}</p>
        </div>
      ))}
    </div>
  );
};

const TrancheSection = ({ tranches, openDrawForm }: any) => {
  const router = useRouter();

  if (!tranches || tranches.length === 0) {
    return (
      <Card className="p-5 flex flex-col gap-3 [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] border-0 text-white">
        <Skeleton className="h-8 w-40 bg-white/30" />
        <div className="flex flex-wrap items-center gap-3">
          {[...Array(2)].map((_, index) => (
            <Card
              key={index}
              className="p-2 px-4 text-sm z-50 [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] text-white border-l-8 cursor-pointer bg-slate-100/20 w-64"
            >
              <Skeleton className="h-5 w-40 bg-white/30 mb-2" /> {/* Tranche name skeleton */}
              <div className="my-2">
                <Skeleton className="h-4 w-20 bg-white/30 mb-1" /> {/* Active status skeleton */}
                <Skeleton className="h-3 w-24 bg-white/30" /> {/* Date skeleton */}
              </div>
              <div className="my-2 flex gap-3">
                <Skeleton className="h-4 w-24 bg-white/30" /> {/* Tranche Total label skeleton */}
                <Skeleton className="h-4 w-20 bg-white/30" /> {/* Tranche Total value skeleton */}
              </div>
            </Card>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5 flex flex-col gap-3 [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] border-0 text-white">
      <Button
        variant="expandIcon"
        size="sm"
        className="text-sm max-w-max"
        Icon={IconChevronRight}
        iconPlacement="right"
        onClick={openDrawForm}
      >
        Create New Tranche
      </Button>
      <div className="flex flex-wrap items-center gap-3">
        {tranches.map((tranch: any, index: number) => (
          <Card
            key={index}
            onClick={() => router.push(`/draw/${tranch.id}`)}
            className="p-2 px-4 text-sm z-50 [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] text-white border-l-8 cursor-pointer bg-slate-100 hover:border-blue-500 transition-all duration-500 ease-in-out"
          >
            <h1 className="capitalize">
              {tranch.id}: {tranch.tranche_name}
            </h1>
            <div className="my-2">
              <p className="capitalize text-base">Active</p>
              <p className="text-xs">{formatDate(tranch.tranche_end_date)}</p>
            </div>
            <div className="my-2 flex gap-3">
              <p>Tranche Total:</p>
              <p>{formatINR(tranch.tranche_total)}</p>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

const InventoryTable = (inventory: any) => {
  return (
    <Card className="border-0 [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] text-white rounded-lg p-5">
      <div className="flex items-center justify-between text-sm">
        <h2 className="text-nowrap py-2 text-2xl tracking-tight">Inventory</h2>
      </div>
      <BasicTable data={inventory.inventory || []} columns={InventoryColumns} filters={[]} needFilters={false} />
    </Card>
  );
};

const Funding = (fundingSource: any) => {
  const router = useRouter()
  return (
    <Card className="text-sm [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] border-0 text-white p-5">
      <div className="flex items-center justify-between text-sm">
        <p className="text-nowrap text-2xl">Funding Sources Overview</p>
        <Button
          variant="default"
          size="xs"
          className="text-zinc-100 text-xs"
          onClick={() => router.push("/draw/3?current_tab=Funding%20Sources")}
        >
          Funding Source Details
        </Button>
      </div>
      <BasicTable
        data={fundingSource.fundingSource}
        columns={fundingColumns}
        filters={[]}
        needFilters={false}
      />
    </Card>
  );
};

const TasksSection = ({ tasks, setOpen }: any) => {
  return (
    <Card className="p-5 border-none text-white [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] mt-3">
      <div className="flex items-center justify-between pl-2 border-b-gray-100 text-2xl">Tasks</div>
      <BasicTable data={tasks} columns={taskColumns} filters={[]} needFilters={false} />
    </Card>
  );
};

const Overview = ({ user, openDrawForm }: Props) => {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [fundingSources, setFundingSources] = useState<FundingSource[]>([]);
  const [tranches, setTranches] = useState<TrancheData[]>([]);
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [stakeHolderModal, setStakeHolderModal] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const params = useParams();
  const projectId = Number(params.id);

  const projectCompletion: ProjectData[] = [
    { date: "06/27/2024", label: "Project Completion", percentage: 50 },
    { date: "06/27/2024", label: "Tranche Completion", percentage: 50 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const inventoryData = await fetchProjectInventory(projectId) as InventoryResponse;
      const fundingData = await fetchProjectFunding(projectId) as FundingSourceResponse;
      const tranchData = await fetchTranchData(projectId) as { results: TrancheData[] };
      const summaryData = await fetchProjectSummary(projectId) as SummaryResponse;
      const taskData = await fetchProjectTask(projectId) as any[];

      setInventory(inventoryData.results);
      setFundingSources(fundingData.results);
      setTranches(tranchData.results);
      setSummary(summaryData.results);
      setTasks([
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
    };

    fetchData();
  }, [projectId]);

  return (
    <div className="flex p-2">
      <div className="w-1/3 p-2">
        <p className="text-white mb-2 font-semibold text-2xl">Project</p>
        <div className="grid grid-cols-[3fr_1fr] gap-3">
          <ProjectInfo projectId={projectId} user={user} openStakeholderModal={() => setStakeHolderModal(true)} />
          <ProjectCompletion projectCompletion={projectCompletion} />
        </div>
        <p className="text-white mt-4 mb-2 text-2xl font-semibold">Tranches</p>
        <TrancheSection tranches={tranches} openDrawForm={openDrawForm} />
        <TasksSection tasks={tasks} setOpen={setOpen} />
      </div>

      <div className="w-[45%] p-3 space-y-3">
        {inventory && <InventoryTable inventory={inventory} />}
        {fundingSources && <Funding fundingSource={fundingSources} /> }
      </div>

      <div className="w-1/3 p-2 text-white">
        <SummaryList data={summary} />
      </div>

      {/* Add your modal components here */}
      <StakeHolderModal open={stakeHolderModal} onHide={() => setStakeHolderModal(false)} />
      {/* <FilterSheet open={open} onOpenChange={() => setOpen(false)} /> */}
    </div>
  );
};

export default Overview;
