"use client";

import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import React, { useState } from "react";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";

const Rules = () => {
  const drawRequiredDocumentation = [
    "Require inspection report for this Tranche",
    "Require title report on this Tranche",
    "All Payment Applications in previous draws are fully covered by unconditial lien waivers",
  ];
  const [manualAddons, setManualAddOns] = useState<string[]>(
    drawRequiredDocumentation
  );
  const [inputText, setInputText] = useState<string>("");

  const contentData = [
    {
      type: "switch",
      label:
        "Requested amount on the Tranche cover sheet matches the requested amount in the budget",
      field: "drawCoverAmountMatch",
    },
    {
      type: "switch",
      label:
        "All line items' Inspected Completion to Date are greater than their Gross Amount Requested to Date",
      field: "inspectedCompletion",
    },
    {
      type: "input-switch",
      label: "Percent complete from the inspection report is within",
      field: "percentComplete",
      suffix: "% of hard costs percent complete",
    },
    {
      type: "switch",
      label:
        "Interest reserves remaining is sufficient to complete the project",
      field: "interestReserves",
    },
    {
      type: "switch",
      label: "Line items have a remaining balance greater than or equal to $0",
      field: "remainingBalance",
    },
    {
      type: "input-switch",
      label: "The project is at risk of being more than",
      field: "riskDays",
      suffix: "days behind schedule",
    },
  ];

  const processing = [
    {
      type: "switch",
      label:
        "Percent of contingency exhasted is not more than 10% greater than project completion",
      field: "remainingBalance",
    },
    {
      type: "switch",
      label: "Retainage expected maatches retaiange requested",
      field: "interestReserves",
    },
  ];

  const handleAddons = () => {
    if (inputText.length > 0) {
      setManualAddOns((prev) => [...prev, inputText]);
      setInputText("");
    }
  };
console.log(manualAddons,drawRequiredDocumentation)
  return (
    <div>
      <h2 className="font-semibold text-lg my-2">Automatic</h2>
      <p className="mb-8">
        we will automatically run checks for any of the selected rules below.{" "}
        <a className="text-themeBlue cursor-pointer">Learn more.</a>
      </p>

      <div className="grid grid-cols-2 gap-5">
        <Card className="p-2 h-full [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] border-0 text-white">
          <h3 className="text-lg font-semibold mb-2">
            Project Required Documentation
          </h3>
          <div className="">
            <div className="flex items-center space-x-2">
              <Switch id="Line items" className="bg-themeBlue" />
              <Label htmlFor="Line items" className="leading-7">
                <span>Line items drawing more than</span>
                <Input type="number" className="ml-2 w-24 inline" />
                <span className="ml-2">
                  are fully supported by documentation
                </span>
              </Label>
            </div>
            <div className="flex items-center mb-2">
              <Switch id="general contractor" />
              <Label htmlFor="general contractor" className="ml-2  leading-7">
                Require performance bond for the general contractor
              </Label>
            </div>
            <div className="flex items-center mb-2">
              <Switch id="reached 100% completion" />
              <Label
                htmlFor="reached 100% completion"
                className="ml-2  leading-7"
              >
                When project reaches 100% completition request notice of
                completion. Below that when project reaches 100% completion
                request certificate of occupancy
              </Label>
            </div>
            <div className="flex items-center mb-2">
              <Switch id="bill_of_sale" />
              <Label htmlFor="bill_of_sale" className="ml-2  leading-7">
                Require a bill of sale if a Payment Application has stored
                materials
              </Label>
            </div>
            <div className="flex items-center mb-2">
              <Switch id="pay_application" />
              <Label htmlFor="pay_application" className="ml-2  leading-7">
                Require GST Invoice, E Way Bill, if payment application has
                stored materials{" "}
              </Label>
            </div>
          </div>
        </Card>

        <Card className="mb-6 p-2 h-full [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] border-0 text-white">
          <h3 className="text-lg font-semibold mb-2">
          Tranche Required Documentation
          </h3>

          {drawRequiredDocumentation?.map((data, index) => (
            <div className="flex items-center mb-2" key={index}>
              <Switch id={data} />
              <Label htmlFor={data} className="ml-2  leading-7">
                {data}
              </Label>
            </div>
          ))}
        </Card>

        <Card className="mb-6 p-2 h-full [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] border-0 text-white">
          <h3 className="text-lg font-semibold mb-2">Line Item Accounts</h3>
          {contentData.map((item, index) => (
            <div className="flex items-center mb-2" key={index}>
              <Switch id={item.label} />
              <p className="ml-2   leading-7">
                <span>{item.label}</span>
                {item.type === "input-switch" && (
                  <>
                    <Input
                      type="number"
                      className="ml-2 w-24 inline text-black"
                    />
                    <span className="ml-2 ">{item.suffix}</span>
                  </>
                )}
              </p>
            </div>
          ))}
        </Card>

        <Card className="mb-6 p-2 h-full [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] border-0 text-white">
          <h3 className="text-lg font-semibold mb-2">Processing</h3>

          {processing?.map((item, index) => (
            <div className="flex items-center mb-2" key={index}>
              <Switch id={item.label} />
              <Label
                htmlFor={item.label}
                className="ml-2 flex items-center leading-7"
              >
                {item.label}
              </Label>
            </div>
          ))}
        </Card>

        <Card className="mb-6 p-2 h-full [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] border-0 text-white">
          <h3 className="text-lg font-semibold mb-2">Manual</h3>
          <p className="mb-8">
            The rules will appear on a chcklist for you to manually complete
            before the Tranche is submitted.{" "}
            <a className="text-themeBlue cursor-pointer">Learn more.</a>
          </p>
          {manualAddons?.map((item, index) => (
            <div className="flex items-center mb-2" key={index}>
              <Switch id={`${item}-manual`} />
              <Label
                htmlFor={`${item}-manual`}
                className="ml-2 flex items-center leading-7"
              >
                {item}
              </Label>
            </div>
          ))}
          <div className="mt-5 flex flex-col">
            <Textarea
              placeholder="Type a comment here."
              className="h-6 text-black "
              onChange={(e) => setInputText(e.target.value)}
              value={inputText}
            />
            <Button
              className="mt-4 bg-themeBlue w-24 self-end"
              onClick={handleAddons}
            >
              Add
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Rules;
