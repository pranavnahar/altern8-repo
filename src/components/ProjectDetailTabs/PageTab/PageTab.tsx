"use client";

import Tab from "../../../components/Tabs/Tabs";
import React, { useState } from "react";
import OverView from "../OverView/OverView";
import { Budget } from "../Budget/Budget";
import { TimelineTab } from "../../../components/TimeLine/TimeLine";
import { Timeline } from "../ProjectSettings/Timeline";
import { ButtonProps } from "../../../lib/componentProps";
import { DrawForm } from "../DrawForm/DrawForm";
import Document from "../Document/Document";
import { useRouter, useSearchParams } from "next/navigation";

export type tabsProps = {
  name: string;
  content: JSX.Element;
};

const PageTab = () => {
  const [openForm, setOpenForm] = useState<boolean>(false);
  const router = useRouter();
  const params = useSearchParams();

  //tabs as object
  const tabs: tabsProps[] = [
    {
      name: "Overview",
      content: (
        <OverView user="customer" openDrawForm={() => setOpenForm(true)} />
      ),
    },
    { name: "Budget", content: <Budget /> },
    { name: "Documents", content: <Document /> },
    { name: "Timeline", content: <TimelineTab /> },
    { name: "Project Settings", content: <Timeline /> },
  ];

  //buttons as object
  const buttons: ButtonProps[] = [
    {
      name: "Tranche",
      className: "bg-themeBlue hover:bg-blue-700",
      onClick: () => router.push("/draw/3"), // Need to push to avtive draw page of project - for now i done it as static.
    },
    {
      name: "Create New Tranche",
      variant: "outline",
      className:
        "bg-transparent text-white hover:bg-transparent hover:text-white",

      onClick: () => setOpenForm(true),
    },
  ];

  //for draw to close
  const onOpenChange = () => {
    setOpenForm(false);
  };

  return (
    <>
      {params.get("current_tab") !== "Overview" && (
        <div className=" ml-5 justify-start gap-3">
          {/* <Image
            src={"/images.jpeg"}
            alt="real_estate"
            width={120}
            height={120}
            className="rounded-md "
          /> */}
          <p className="text-2xl my-3 font-bold text-white mr-5">
            1460 Comal Project
          </p>
        </div>
      )}
      <Tab tabsList={tabs} buttons={buttons} />
      <DrawForm open={openForm} onOpenChange={onOpenChange} />
    </>
  );
};

export default PageTab;
