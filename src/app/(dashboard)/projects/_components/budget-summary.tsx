"use client";

import fundingColumns from "@/components/ProjectDetailTabs/ProjectSettings/columns/funding-columns";
import BasicTable from "@/components/global/basic-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProjectSummary } from "../_actions/fetch-project-summary.actions";
import { SummaryItem, SummaryResponse } from "../types";
import SummaryList from "./summary-list";



type ModalInputs = {
  projectId: number;
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
        tableName="project-budget-summary"
      />
    </Card>
  );
};

const BudgetSummary = ({
  projectId,
}: ModalInputs) => {
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      //   const inventoryData = await fetchProjectInventory(projectId) as InventoryResponse;
      //   const fundingData = await fetchProjectFunding(projectId) as FundingSourceResponse;
      const summaryData = await fetchProjectSummary(projectId) as SummaryResponse;

      //   setInventory(inventoryData.results);
      //   setFundingSources(fundingData.results);
      setSummary(summaryData.results);
    };

    fetchData();
  }, [projectId]);



  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="text-sm">
          Summary
        </Button>
      </DialogTrigger>
      <DialogContent className=" background border-none">
        {/* <DialogHeader>
      <div className="flex items-center justify-between w-[90%]">
          <div className="flex items-center gap-1">
            <MessageSquareText size={20} className="text-white" />
            <strong className="text-sm text-gray-400">Summary</strong>
          </div>
          <AddSummarySheet />
        </div>
        </DialogHeader> */}
        <SummaryList data={summary} />

      </DialogContent>
    </Dialog>
  );
};

export default BudgetSummary;
