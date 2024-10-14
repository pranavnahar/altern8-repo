"use client";

import { userRole } from "../../../atom/atom";
import AdjustmentOverTime from "../../../components/AdjustmentOverTime/AdjustmentOverTime";
import BudgetFilter from "../../../components/LedgerTypeTable/Filter";
import LedgerTypeTable from "../../../components/LedgerTypeTable/LedgerTypeTable";
import RequestedOverTime from "../../../components/RequestedOverTime/RequestedOverTime";
import { Button } from "../../../components/ui/button";
import { BaseHeaderProps } from "../../../lib/componentProps";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { adjustmentData } from "./data/adjustments-data";
import { budgetData } from "./data/budget-data";

const headers: BaseHeaderProps[] = [
  { title: "Name", classname: "text-center", key: "name" },
  {
    title: "Original Budget",
    classname: "text-center",
    key: "originalBudget",
  },
  { title: "Adjustments", classname: "text-center", key: "adjustments" },
  { title: "Current Budget", classname: "text-center", key: "currentBudget" },
  {
    title: "Amount Requested (Net)",
    classname: "text-center",
    key: "amountRequestedNet",
  },
  { title: "Amount Used", classname: "text-center", key: "amountUsed" },
  {
    title: "Balance To Fund",
    classname: "text-center",
    key: "balanceToFund",
  },
  {
    title: "% Remaining (Net)",
    classname: "text-center",
    key: "percentRemainingNet",
  },
];

export const Budget = () => {
  const [renderComponent, setRenderComponent] = useState<"current budget" | "adjustment over time" | "requested over time">("current budget");
  const [budgeHeaders, setBudgetHeaders] = useState<BaseHeaderProps[]>(headers);
  const admin = useRecoilValue(userRole);
  useEffect(() => {
    if (admin) {
      const adminColumns = [
        {
          title: "Amount Requested (Gross)",
          classname: "text-center",
          key: "amountRequestedGross",
        },
        {
          title: "Interest Retainage",
          classname: "text-center",
          key: "interestRetainage",
        },
        { title: "Retainage", classname: "text-center", key: "retainage" },
      ];
      setBudgetHeaders((prev) => [...prev, ...adminColumns]);
    }
  }, [admin]);
  let classname =
    "bg-transparent text-white hover:text-white hover:bg-transparent";
  return (
    <div className="px-3 h-[65vh] overflow-auto ">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-3">


          <Button
            variant={"outline"}
            className={`${classname} ${
              renderComponent === "current budget" && "bg-themeBlue border-0"
            }`}
            onClick={() => setRenderComponent("current budget")}
          >
            Current Budget
          </Button>
          <Button
            variant={"outline"}
            className={`${classname} ${
              renderComponent === "adjustment over time" &&
              "bg-themeBlue border-0"
            }`}
            onClick={() => setRenderComponent("adjustment over time")}
          >
            Adjustment Over Time
          </Button>
          {/* <Button
            variant={"outline"}
            className={`${classname} ${
              renderComponent === "requested over time" &&
              "bg-themeBlue border-0"
            }`}
            onClick={() => setRenderComponent("requested over time")}
          >
            Requested Over Time
          </Button> */}
        </div>

        {/* <div className="flex items-center gap-3">
          <Button variant={"outline"} className={classname}>
            Show Budget Progress Graphs
          </Button>
        </div> */}
      </div>
      <BudgetFilter selectedTab={renderComponent} />
      {renderComponent === "current budget" && (
        <LedgerTypeTable data={budgetData} headers={budgeHeaders} />
      )}
      {renderComponent === "adjustment over time" && (
        <AdjustmentOverTime data={adjustmentData} />
      )}
      {/* as per sugeestion by pranav, i made this component in unused for now  */}
      {renderComponent === "requested over time" && <RequestedOverTime />}
    </div>
  );
};
