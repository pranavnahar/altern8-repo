"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";
import { Button } from "../../../components/ui/button";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import FundingSources from "./FundingSources";
import Rules from "./Rules";
import { motion } from "framer-motion";
import LineItemSettings from "./LineItemSettings";
import DrawTable from "../../../components/CustomizedTable/CustomizedTable";
import { BaseHeaderProps } from "../../../lib/componentProps";
import { Stakeholder } from "../OverView/StakeHolderModal";
import FileUpload from "../../../components/FileUpload/FileUpload";
import { useRecoilValue } from "recoil";
import { userRole } from "../../../atom/atom";
import { GenearlContracter } from "./GenearlContracter";

type AccordianProps = {
  data: menuItemsProps;
  index: number;
  setAccordianValues: React.Dispatch<React.SetStateAction<string[]>>;
  accordianValues: string[];
};

export const AccordianSettings = ({
  data,
  index,
  setAccordianValues,
  accordianValues,
}: AccordianProps) => {
  const isOpen = accordianValues.includes(`item-${index}`);

  const handleToggle = () => {
    setAccordianValues((prev) => {
      const currentValue = `item-${index}`;
      if (prev.includes(currentValue)) {
        return prev.filter((value) => value !== currentValue);
      } else {
        return [...prev, currentValue];
      }
    });
  };
  return (
    <AccordionItem
      value={`item-${index}`}
      className="border border-black rounded-lg my-1 "
      style={{ textDecoration: "none" }}
    >
      <AccordionTrigger
        onClick={handleToggle}
        className="flex justify-between items-center px-4 rounded-lg cursor-pointer text-white bg-blue-950 hover:no-underline"
      >
        {data.name}
      </AccordionTrigger>
      <motion.div
        initial="collapsed"
        animate={isOpen ? "open" : "collapsed"}
        variants={{
          open: { opacity: 1, height: "auto" },
          collapsed: { opacity: 0, height: 0 },
        }}
        transition={{ duration: 0.3 }}
      >
        <AccordionContent className="py-2 px-4 rounded-2xl">
          {data.child}
        </AccordionContent>
      </motion.div>
    </AccordionItem>
  );
};

export const GeneralUpload = () => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  console.log(files)
  return (
    <div>
      <FileUpload onDrop={onDrop} className="h-48" />
    </div>
  );
};

type menuItemsProps = {
  name: string;
  child: ReactNode;
};

export const Timeline = () => {
  const [accordianValues, setAccordianValues] = useState<string[]>([]);
  const admin = useRecoilValue(userRole);

  const stakeholders: Stakeholder[] = [
    {
      stakeholderName: "Rajesh Sharma",
      contactNumber: 8067589432,
      email: "rajesh@gmail.com",
      organization: "Tata Consultancy Services",
      type: "DEBT",
    },
    {
      stakeholderName: "Anita Mehta",
      contactNumber: 9876543210,
      email: "anita@gmail.com",
      organization: "Infosys",
      type: "EQUITY",
    },
    {
      stakeholderName: "Vikram Singh",
      contactNumber: 9123456789,
      organization: "Reliance Industries",
      email: "vikram@gmail.com",
      type: "SECONDARY DEBT",
    },
    {
      stakeholderName: "Sangeeta Patel",
      contactNumber: 9988776655,
      organization: "Wipro",
      email: "sangeeta@gmail.com",
      type: "DEBT",
    },
    {
      stakeholderName: "Amit Gupta",
      contactNumber: 8098765432,
      organization: "HCL Technologies",
      email: "amit@gmail.com",
      type: "EQUITY",
    },
    {
      stakeholderName: "Priya Nair",
      contactNumber: 8172635443,
      organization: "Mahindra & Mahindra",
      email: "priya@gmail.com",
      type: "SECONDARY DEBT",
    },
  ];

  const tableHeaders: BaseHeaderProps[] = [
    {
      title: "Name",
      classname: "",
      key: "stakeholderName",
    },
    {
      title: "Contact Number",
      classname: "",
      key: "contactNumber",
    },
    {
      title: "Email Id",
      classname: "",
      key: "email",
    },
    {
      title: "Organization",
      classname: "",
      key: "organization",
    },
    {
      title: "Type",
      classname: "",
      key: "type",
    },
  ];
  const menuItems: menuItemsProps[] = [
    {
      name: "Funding Sources",
      child: <FundingSources />,
    },
    {
      name: "Line Item Settings",
      child: <LineItemSettings />,
    },
    {
      name: "Stakeholders",
      child: <DrawTable tableData={stakeholders} headers={tableHeaders} />,
    },
    {
      name: "General Upload",
      child: <GeneralUpload />,
    },
    {
      name: "General Contractor",
      child: <GenearlContracter />,
    },
  ];
  const [menus, setMenus] = useState<menuItemsProps[]>(menuItems);

  const handleAccordian = (open: boolean) => {
    if (open) {
      const indices = menuItems.map((_, index) => `item-${index}`);
      setAccordianValues(indices);
    } else {
      setAccordianValues([]);
    }
  };

  useEffect(() => {
    if (admin) {
      setMenus((prev) => [
        ...prev,
        {
          name: "Rules",
          child: <Rules />,
        },
      ]);
    }
  }, [admin]);

  return (
    <div className="h-[65vh] overflow-auto">
      <motion.div
        className="flex justify-between px-4 items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Button className="bg-themeBlue" onClick={() => handleAccordian(true)}>
          Expand all
        </Button>
        <Button className="bg-themeBlue" onClick={() => handleAccordian(false)}>
          Collapse All
        </Button>
      </motion.div>
      <div className="p-2 w-[99%] text-white mx-auto">
        <Accordion type="multiple" value={accordianValues}>
          {menus.map((data: menuItemsProps, key: number) => (
            <motion.div
              key={key}
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: "0%", opacity: 1 }}
              transition={{ delay: 0.5 + key * 0.1, duration: 0.5 }}
            >
              <AccordianSettings
                data={data}
                index={key}
                setAccordianValues={setAccordianValues}
                accordianValues={accordianValues}
              />
            </motion.div>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
