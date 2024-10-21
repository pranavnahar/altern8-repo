"use client";

import React from "react";
import { MessageSquareText } from "lucide-react";
import AddSummarySheet from "./add-summary-sheet";
import { Card } from "../../../../components/ui/card";
import { SummaryItem } from "../types";
import { Skeleton } from "../../../../components/ui/skeleton";

type Props = {
  data: SummaryItem[];
  className?: string;
  isLoading?: boolean;
};

const SummaryList = ({ data, className, isLoading = false }: Props) => {
  const summaryFields = [
    { key: "interest_reserves", label: "Interest Reserves" },
    { key: "development_fees", label: "Development Fees" },
    { key: "tranche_inspector_fees", label: "Tranche Inspector Fees" },
    { key: "legal", label: "Legal" },
    { key: "architecture", label: "Architecture" },
    { key: "engineering", label: "Engineering" },
    { key: "title_insurance", label: "Title Insurance" },
    { key: "environmental", label: "Environmental" },
    { key: "soft_cost_contingency", label: "Soft Cost Contingency" },
    { key: "site_acquisition", label: "Site Acquisition" },
    { key: "general_requirements", label: "General Requirements" },
    { key: "concrete", label: "Concrete" },
    { key: "masonry", label: "Masonry" },
    { key: "metal", label: "Metal" },
    { key: "wood_plastics", label: "Wood & Plastics" },
    { key: "thermal_moistures", label: "Thermal & Moistures" },
    { key: "openings", label: "Openings" },
    { key: "finishes", label: "Finishes" },
    { key: "facilities", label: "Facilities" },
  ];

  return (
    <div className={className}>
      <div className="flex items-center justify-between w-full border-b mb-2 border-b-gray-500">
        <h1 className="font-semibold text-white text-2xl">Summary</h1>
      </div>
      <p className="text-zinc-400 text-base mt-2">1460 Comal Project</p>
      <Card className="mt-5 py-7 border-none text-white [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212]">
        <div className="flex items-center justify-between w-[90%] mx-auto mb-5">
          <div className="flex items-center gap-1">
            <MessageSquareText size={20} />
            <strong className="text-sm text-gray-400">Summary</strong>
          </div>
          <AddSummarySheet />
        </div>

        <div className="flex flex-col w-[90%] p-1 gap-3 mx-auto border-b-[#bbb] text-sm">
          {summaryFields.map((field) => (
            <div key={field.key} className="flex justify-between">
              <p>{field.label}:</p>
              {isLoading ? (
                <Skeleton className="h-4 w-[100px]" />
              ) : (
                <p>{data[0]?.[field.key as keyof SummaryItem]}</p>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SummaryList;
