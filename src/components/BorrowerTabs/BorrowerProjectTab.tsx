import React from "react";
import OverView from "../ProjectDetailTabs/OverView/OverView";
import { Budget } from "../ProjectDetailTabs/Budget/Budget";
import Tab from "../Tabs/Tabs";
import { tabsProps } from "../ProjectDetailTabs/PageTab/PageTab";

const BorrowerProjectTab = () => {
  //tabs as object
  const tabs: tabsProps[] = [
    {
      name: "Overview",
      content: <OverView user="borrower" />,
    },
    { name: "Budget", content: <Budget /> },
  ];

  return <Tab tabsList={tabs} />;
};

export default BorrowerProjectTab;
