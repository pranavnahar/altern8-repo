"use client";
import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "../ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

interface Draw {
  amounTableRowequestedGross: string;
  retainage: string;
  amounTableRowequestedNet: string;
}

interface Item {
  lineItem?: string;
  currentBudget: string;
  amounTableRowequestedGross: string;
  retainage: string;
  amounTableRowequestedNet: string;
  balanceToFund: string;
  percenTableRowemainingNet: string;
  draw3: Draw;
  draw2: Draw;
  draw1: Draw;
  type?: "subtotal"; // Optional property, only for subtotal items
}

interface Category {
  category: string;
  items: Item[];
}

type TableDatasWithAccordianProps = {
  category: Category;
};

const data: Category[] = [
  {
    category: "Fees & Interest",
    items: [
      {
        lineItem: "Interest Reserves",
        currentBudget: "₹ 120,583.00",
        amounTableRowequestedGross: "₹ 0.00",
        retainage: "₹ 0.00",
        amounTableRowequestedNet: "₹ 0.00",
        balanceToFund: "₹ 120,583.00",
        percenTableRowemainingNet: "100%",
        draw3: {
          amounTableRowequestedGross: "₹ 0.00",
          retainage: "₹ 0.00",
          amounTableRowequestedNet: "₹ 0.00",
        },
        draw2: {
          amounTableRowequestedGross: "₹ 0.00",
          retainage: "₹ 0.00",
          amounTableRowequestedNet: "₹ 0.00",
        },
        draw1: {
          amounTableRowequestedGross: "₹ 0.00",
          retainage: "₹ 0.00",
          amounTableRowequestedNet: "₹ 0.00",
        },
      },
      {
        lineItem: "Development Fee",
        currentBudget: "₹ 602,918.00",
        amounTableRowequestedGross: "₹ 81,000.00",
        retainage: "₹ 0.00",
        amounTableRowequestedNet: "₹ 81,000.00",
        balanceToFund: "₹ 521,918.00",
        percenTableRowemainingNet: "87%",
        draw3: {
          amounTableRowequestedGross: "₹ 27,000.00",
          retainage: "₹ 0.00",
          amounTableRowequestedNet: "₹ 27,000.00",
        },
        draw2: {
          amounTableRowequestedGross: "₹ 27,000.00",
          retainage: "₹ 0.00",
          amounTableRowequestedNet: "₹ 27,000.00",
        },
        draw1: {
          amounTableRowequestedGross: "₹ 27,000.00",
          retainage: "₹ 0.00",
          amounTableRowequestedNet: "₹ 27,000.00",
        },
      },
      {
        type: "subtotal",
        currentBudget: "₹ 904,133.00",
        amounTableRowequestedGross: "₹ 254,932.50",
        retainage: "₹ 0.00",
        amounTableRowequestedNet: "₹ 254,932.50",
        balanceToFund: "₹ 649,200.50",
        percenTableRowemainingNet: "72%",
        draw3: {
          amounTableRowequestedGross: "₹ 79,430.00",
          retainage: "₹ 0.00",
          amounTableRowequestedNet: "₹ 79,430.00",
        },
        draw2: {
          amounTableRowequestedGross: "₹ 65,117.50",
          retainage: "₹ 0.00",
          amounTableRowequestedNet: "₹ 65,117.50",
        },
        draw1: {
          amounTableRowequestedGross: "₹ 110,385.00",
          retainage: "₹ 0.00",
          amounTableRowequestedNet: "₹ 110,385.00",
        },
      },
      // Add more items as necessary
    ],
  },
  {
    category: "Soft Costs",
    items: [
      {
        lineItem: "Architect",
        currentBudget: "₹ 241,167.00",
        amounTableRowequestedGross: "₹ 167,350.00",
        retainage: "₹ 0.00",
        amounTableRowequestedNet: "₹ 167,350.00",
        balanceToFund: "₹ 73,817.00",
        percenTableRowemainingNet: "31%",
        draw3: {
          amounTableRowequestedGross: "₹ 19,350.00",
          retainage: "₹ 0.00",
          amounTableRowequestedNet: "₹ 19,350.00",
        },
        draw2: {
          amounTableRowequestedGross: "₹ 57,000.00",
          retainage: "₹ 0.00",
          amounTableRowequestedNet: "₹ 57,000.00",
        },
        draw1: {
          amounTableRowequestedGross: "₹ 91,000.00",
          retainage: "₹ 0.00",
          amounTableRowequestedNet: "₹ 91,000.00",
        },
      },
      {
        type: "subtotal",
        currentBudget: "₹ 392,827.00",
        amounTableRowequestedGross: "₹ 167,350.00",
        retainage: "₹ 0.00",
        amounTableRowequestedNet: "₹ 167,350.00",
        balanceToFund: "₹ 225,477.00",
        percenTableRowemainingNet: "57%",
        draw3: {
          amounTableRowequestedGross: "₹ 19,350.00",
          retainage: "₹ 0.00",
          amounTableRowequestedNet: "₹ 19,350.00",
        },
        draw2: {
          amounTableRowequestedGross: "₹ 57,000.00",
          retainage: "₹ 0.00",
          amounTableRowequestedNet: "₹ 57,000.00",
        },
        draw1: {
          amounTableRowequestedGross: "₹ 91,000.00",
          retainage: "₹ 0.00",
          amounTableRowequestedNet: "₹ 91,000.00",
        },
      },
      // Add more items as necessary
    ],
  },
];

const TableDatasWithAccordian = ({
  category,
}: TableDatasWithAccordianProps) => {
  const [showData, setShowData] = useState(true);
  return (
    <React.Fragment>
      <TableRow className="font-bold" onClick={() => setShowData(!showData)}>
        <TableCell
          colSpan={7}
          className="flex items-center text-nowrap cursor-pointer text-white gap-3"
        >
          {showData ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          {category?.category}
        </TableCell>
      </TableRow>
      {showData
        ? category?.items.map((item: Item, idx: number) => (
            <TableRow
              key={idx}
              className={`text-white ${
                item?.type === "subtotal" && "font-bold text-white"
              }`}
            >
              <TableCell
                className={
                  item?.type === "subtotal"
                    ? "font-bold text-right text-white"
                    : ""
                }
              >
                {item.lineItem}
              </TableCell>
              <TableCell>{item.currentBudget}</TableCell>
              <TableCell>{item.amounTableRowequestedGross}</TableCell>
              <TableCell>{item.retainage}</TableCell>
              <TableCell>{item.amounTableRowequestedNet}</TableCell>
              <TableCell>{item.balanceToFund}</TableCell>
              <TableCell>{item.percenTableRowemainingNet}</TableCell>
              <TableCell>{item.draw3.amounTableRowequestedGross}</TableCell>
              <TableCell>{item.draw3.retainage}</TableCell>
              <TableCell>{item.draw3.amounTableRowequestedNet}</TableCell>
              <TableCell>{item.draw2.amounTableRowequestedGross}</TableCell>
              <TableCell>{item.draw2.retainage}</TableCell>
              <TableCell>{item.draw2.amounTableRowequestedNet}</TableCell>
              <TableCell>{item.draw1.amounTableRowequestedGross}</TableCell>
              <TableCell>{item.draw1.retainage}</TableCell>
              <TableCell>{item.draw1.amounTableRowequestedNet}</TableCell>
            </TableRow>
          ))
        : null}
    </React.Fragment>
  );
};

const RequestedOverTime = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Table className=" w-[99vw] mx-auto [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] rounded-2xl m-5">
        <TableHeader>
          <TableRow className="text-white text-nowrap">
            <TableHead>Line Item</TableHead>
            <TableHead>Current Budget</TableHead>
            <TableHead>Amount Requested (Gross)</TableHead>
            <TableHead>Retainage</TableHead>
            <TableHead>Amount Requested (Net)</TableHead>
            <TableHead>Balance Line</TableHead>
            <TableHead>% Remaining (Net)</TableHead>
            <TableHead colSpan={3} className=" text-center">
              Tranche 3
            </TableHead>
            <TableHead colSpan={3} className=" text-center">
              Tranche 2
            </TableHead>
            <TableHead colSpan={3} className=" text-center">
              Tranche 1
            </TableHead>
          </TableRow>
          <TableRow className="text-white text-nowrap">
            <TableHead></TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
            <TableHead>Amount Requested (Gross)</TableHead>
            <TableHead>Retainage</TableHead>
            <TableHead>Amount Requested (Net)</TableHead>
            <TableHead>Amount Requested (Gross)</TableHead>
            <TableHead>Retainage</TableHead>
            <TableHead>Amount Requested (Net)</TableHead>
            <TableHead>Amount Requested (Gross)</TableHead>
            <TableHead>Retainage</TableHead>
            <TableHead>Amount Requested (Net)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-white">
          {data.map((category: Category, index: number) => (
            <TableDatasWithAccordian key={index} category={category} />
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
};

export default RequestedOverTime;
