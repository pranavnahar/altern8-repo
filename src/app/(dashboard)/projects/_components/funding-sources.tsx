"use client";

import { FundingSource, FundingSourceResponse, Inventory } from "@/components/ProjectDetailTabs/OverView/types";
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
import { fetchProjectFunding } from "../_actions/get-project-funding";
import { SummaryItem } from "../types";
import Link from "next/link";



type ModalInputs = {
  projectId: number;
  type: "MODAL" | "TABLE"
};


const Funding = (fundingSource: any) => {
  const router = useRouter()
  return (
    <Card className="text-sm bg-transparent border-0 text-white p-5">
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
        tableName="funding-sources-view-table"
      />
    </Card>
  );
};

const FundingSources = ({
  projectId,
  type
}: ModalInputs) => {

  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [fundingSources, setFundingSources] = useState<FundingSource[]>([]);
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);



  useEffect(() => {
    const fetchData = async () => {
      //   const inventoryData = await fetchProjectInventory(projectId) as InventoryResponse;
      const fundingData = await fetchProjectFunding(projectId) as FundingSourceResponse;
      //   const summaryData = await fetchProjectSummary(projectId) as SummaryResponse;

      //   setInventory(inventoryData.results);
      setFundingSources(fundingData.results);
      //   setSummary(summaryData.results);
    };

    fetchData();
  }, [projectId]);



  return type === "TABLE" ? <>
    <div className="">
      {fundingSources && <Funding fundingSource={fundingSources} />}
      <Link href={`/project-verification/1?tab=inventory`}>

        <button
          type="submit"
          className=" p-2 mx-auto w-24 bg-[#1565c0] text-white rounded-3xl m-l-[30px] flex item-center justify-center"
        >
          Next
        </button>
      </Link>
    </div>
  </> : (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="text-sm">
          Funding Sources
        </Button>
      </DialogTrigger>
      <DialogContent className=" background border-none max-w-[80%]">
        <div className="max-w-[75%]">
          {fundingSources && <Funding fundingSource={fundingSources} />}
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default FundingSources;
