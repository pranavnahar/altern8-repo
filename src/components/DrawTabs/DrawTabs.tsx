"use client";
/* eslint-disable camelcase */

import React, { useEffect, useState } from "react";
import Inception from "./Inception";
import BorrowerOverview from "../BorrowerTabs/BorrowerDrawTab/BorrowerOverView";
import FundingSources from "./FundingSources";
import Documents from "./Documents";
import Budget from "./Budget";
import DrawOverView from "./DrawOverView";
import { tabsProps } from "../ProjectDetailTabs/PageTab/PageTab";
import { BaseTableData, SubmenuProps } from "../../lib/componentProps";
import Tab from "../Tabs/Tabs";
import { useRecoilValue } from "recoil";
import { userRole } from "../../atom/atom";

function DrawTabs() {
  const admin = useRecoilValue(userRole);

  const documentsTableData: BaseTableData[] = [
    {
      vendor: "INV001",
      type: "Chennai, India",
      status: "0.00",
      approvalStatus: "Approved",
      nextApprover: "0.00",
      amount: "Setup in Progress",
    },
    {
      vendor: "INV001",
      type: "Chennai, India",
      status: "0.00",
      approvalStatus: "Scheduled",
      nextApprover: "0.00",
      amount: "Setup in Progress",
    },
    {
      vendor: "INV001",
      type: "Chennai, India",
      status: "0.00",
      approvalStatus: "Inprogress",
      nextApprover: "0.00",
      amount: "Setup in Progress",
    },
    {
      vendor: "INV001",
      type: "Chennai, India",
      status: "0.00",
      approvalStatus: "Inprogress",
      nextApprover: "0.00",
      amount: "Setup in Progress",
    },
    {
      vendor: "INV001",
      type: "Chennai, India",
      status: "0.00",
      approvalStatus: "Declined",
      nextApprover: "0.00",
      amount: "Setup in Progress",
    },
    {
      vendor: "INV001",
      type: "Chennai, India",
      status: "0.00",
      approvalStatus: "Approved",
      nextApprover: "0.00",
      amount: "Setup in Progress",
    },
    {
      vendor: "INV001",
      type: "Chennai, India",
      status: "0.00",
      approvalStatus: "Declined",
      nextApprover: "0.00",
      amount: "Setup in Progress",
    },
  ];

  const rulesTableData: BaseTableData[] = [
    {
      name: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      status: "Passed",
      updated_by: "Passed By Rabbet",
      updated_last: "8/21/2023 8.00am",
    },
    {
      name: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      status: "Passed",
      updated_by: "Passed By Rabbet",
      updated_last: "8/21/2023 8.00am",
    },
    {
      name: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      status: "Passed",
      updated_by: "Passed By Rabbet",
      updated_last: "8/21/2023 8.00am",
    },
    {
      name: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      status: "Passed",
      updated_by: "Passed By Rabbet",
      updated_last: "8/21/2023 8.00am",
    },
    {
      name: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      status: "Passed",
      updated_by: "Passed By Rabbet",
      updated_last: "8/21/2023 8.00am",
    },
    {
      name: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      status: "Passed",
      updated_by: "Passed By Rabbet",
      updated_last: "8/21/2023 8.00am",
    },
    {
      name: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      status: "Passed",
      updated_by: "Passed By Rabbet",
      updated_last: "8/21/2023 8.00am",
    },
    {
      name: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      status: "Passed",
      updated_by: "Passed By Rabbet",
      updated_last: "8/21/2023 8.00am",
    },
    {
      name: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      status: "Passed",
      updated_by: "Passed By Rabbet",
      updated_last: "8/21/2023 8.00am",
    },
    {
      name: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      status: "Passed",
      updated_by: "Passed By Rabbet",
      updated_last: "8/21/2023 8.00am",
    },
    {
      name: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      status: "Passed",
      updated_by: "Passed By Rabbet",
      updated_last: "8/21/2023 8.00am",
    },
    {
      name: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      status: "Passed",
      updated_by: "Passed By Rabbet",
      updated_last: "8/21/2023 8.00am",
    },
  ];

  const tabs: tabsProps[] = [
    {
      name: "Overview",
      content: (
        <div className="max-h-[65vh] overflow-auto">
          <DrawOverView
            documentsTableData={documentsTableData}
            rulesTableData={rulesTableData}
          />
        </div>
      ),
    },
    {
      name: "Budget",
      content: (
        <div className="max-h-[65vh] overflow-auto">
          <Budget />{" "}
        </div>
      ),
    },
    {
      name: "Documents",
      content: (
        <div className="max-h-[65vh] overflow-auto">
          <Documents />
        </div>
      ),
    },
    {
      name: "Funding Sources",
      content: (
        <div className="max-h-[65vh] overflow-auto">
          {" "}
          <FundingSources />
        </div>
      ),
    },
    {
      name: "Upload",
      content: (
        <div className="max-h-[65vh] overflow-auto">
          <BorrowerOverview />{" "}
        </div>
      ),
    },
  ];

  const [subTabs, setSubTabs] = useState(tabs);
  const subMenu: SubmenuProps[] = [
    {
      name: "Documents",
      status: "5/5",
      hoverContent: "Approved",
      statusColor: "complete",
    },
    {
      name: "Budget",
      status: "4/4",
      hoverContent: "Approved",
      statusColor: "complete",
    },
    {
      name: "Rules",
      status: "12/12",
      hoverContent: "Approved",
      statusColor: "complete",
    },
    {
      name: "Funding Sources",
      status: "100%",
      hoverContent: "Approved",
      statusColor: "complete",
    },
    {
      name: "Inspection",
      status: "0/1",
      hoverContent: "Approved",
      statusColor: "inProgress",
    },
    {
      name: "Tranche Approvals",
      status: "0/0",
      hoverContent: "Approved",
      statusColor: "complete",
    },
  ];

  useEffect(() => {
    if (admin) {
        setSubTabs((prev) => [...prev,
            {
            name: "Inspection",
            content: (
              <div className="max-h-[65vh] overflow-auto">
                <Inception type={"draw"} />
              </div>
            ),
          }
        ])
    }
  }, [admin]);
  
  return <Tab tabsList={subTabs} subMenuList={subMenu} stickyClassName='.draw-header' />;
}

export default DrawTabs;
