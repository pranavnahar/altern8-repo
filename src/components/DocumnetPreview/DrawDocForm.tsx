import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { Input } from "../ui/input";
const DrawDocForm: React.FC = () => {
  return (
    <div className="p-1 w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl text-white font-semibold">
          38 Automated Way - Tranche 1.xlsx
        </h1>
        <div className="flex items-center">
          <span className="mr-2 text-white">Assigned to Matthew Wheeler</span>
        </div>
      </div>

      <Accordion.Root type="single" collapsible>
        <Accordion.Item value="item-1" className="my-5">
          <Accordion.Header>
            <Accordion.Trigger className="flex justify-between items-center w-full px-4 py-2 bg-gray-200 border border-l-4 border-l-custom-border rounded mb-2">
              <span>Document Information</span>
              <svg
                className="w-4 h-4 ml-2 transition-transform transform rotate-0 data-[state=open]:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="p-1 pt-2 border-t border-gray-200 mb-4">
            <div className="flex w-full">
              <select
                className="mr-1 w-1/2 m-w-[320px] py-2 bg-white border rounded shadow-sm"
                defaultValue=""
              >
                <option value="" disabled>
                  Tranche Summary
                </option>
                <option value="drawSummary1">Tranche Summary 1</option>
                <option value="drawSummary2">Tranche Summary 2</option>
              </select>
              <select
                className="ml-1 py-2 w-1/2 m-w-[320px] bg-white border rounded shadow-sm"
                defaultValue=""
              >
                <option value="" disabled>
                  Tranche 1
                </option>
                <option value="draw1">Tranche 1</option>
                <option value="draw2">Tranche 2</option>
              </select>
            </div>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="item-2" className="my-5">
          <Accordion.Header>
            <Accordion.Trigger className="flex justify-between items-center w-full px-4 py-2 bg-gray-200 border border-l-4 border-l-custom-border rounded mb-2">
              <span>Tranche Summary Options</span>
              <svg
                className="w-4 h-4 ml-2 transition-transform transform rotate-0 data-[state=open]:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="p-4 border-t border-gray-200 mb-4">
            <p className="text-white">Tranche Summary Options</p>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="item-3" className="my-5">
          <Accordion.Header>
            <Accordion.Trigger className="flex justify-between items-center w-full px-4 py-2 bg-gray-200 border border-l-4 border-l-custom-border rounded mb-2">
              <span>Tranche Summary Information</span>
              <svg
                className="w-4 h-4 ml-2 transition-transform transform rotate-0 data-[state=open]:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="p-1 border-t border-gray-200 mb-4">
            <p className="text-white my-5">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
            <div className="flex my-5 items-center">
              <p className="text-white mr-5">Lorem ipsum dolor sit amet</p>
              <select
                className="m-w-[320px] py-2 bg-white border rounded shadow-sm"
                defaultValue=""
              >
                <option value="" disabled>
                  Tranche Summary
                </option>
                <option value="drawSummary1">Tranche Summary 1</option>
                <option value="drawSummary2">Tranche Summary 2</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex flex-col w-1/5 mx-2">
                <label
                  htmlFor="column-select"
                  className="text-sm mb-5 text-white"
                >
                  Select Column
                </label>
                <select
                  id="column-select"
                  className="border border-gray-300 p-2 rounded"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  {/* Add more options as needed */}
                </select>
              </div>
              <div className="flex flex-col w-1/5 mx-2">
                <label htmlFor="row-select" className="text-sm mb-5 text-white">
                  Select Row / Line
                </label>
                <select
                  id="row-select"
                  className="border border-gray-300 p-2 rounded"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  {/* Add more options as needed */}
                </select>
              </div>
              <div className="flex flex-col w-1/5 mx-2">
                <label
                  htmlFor="adjustments"
                  className="text-sm mb-5 text-white"
                >
                  Adjustments To Date
                </label>
                <select
                  id="adjustments"
                  className="border border-gray-300 p-2 rounded"
                >
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  {/* Add more options as needed */}
                </select>
              </div>
              <div className="flex flex-col w-1/5 mx-2">
                <label
                  htmlFor="amount-requested"
                  className="text-sm mb-5 text-white"
                >
                  Amount Requested
                </label>
                <select
                  id="amount-requested"
                  className="border border-gray-300 p-2 rounded"
                >
                  <option value="G">G</option>
                  <option value="H">H</option>
                  <option value="I">I</option>
                  {/* Add more options as needed */}
                </select>
              </div>
              <div className="flex flex-col w-1/5 mx-2">
                <label htmlFor="retainage" className="text-sm mb-5 text-white">
                  Retainage To Date
                </label>
                <select
                  id="retainage"
                  className="border border-gray-300 p-2 rounded"
                >
                  <option value="I">I</option>
                  <option value="J">J</option>
                  <option value="K">K</option>
                  {/* Add more options as needed */}
                </select>
              </div>
            </div>

            <h4 className="w-full my-2 bg-stone-300">Tranche</h4>
            {[1, 2, 3, 4].map((_, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center my-5"
              >
                <p className="text-white text-nowrap">Text 1</p>
                <select
                  className="m-w-[320px] py-2 bg-white border rounded shadow-sm"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Tranche Summary
                  </option>
                  <option value="drawSummary1">Tranche Summary 1</option>
                  <option value="drawSummary2">Tranche Summary 2</option>
                </select>
                <div className=" w-[50%] flex gap-2">
                  <div className="flex text-white gap-2 items-center justify-between">
                    <p>₹</p>
                    <Input className="text-black" value={0} type="number" />
                  </div>
                  <div className="flex text-white gap-2 items-center justify-between">
                    <p>₹</p>
                    <Input className="text-black" value={0} type="number" />
                  </div>
                  <div className="flex text-white gap-2 items-center justify-between">
                    <p>₹</p>
                    <Input className="text-black" value={0} type="number" />
                  </div>
                </div>
              </div>
            ))}
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
};

export default DrawDocForm;
