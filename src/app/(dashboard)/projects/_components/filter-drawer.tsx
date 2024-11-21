import React, { useState } from "react";
import { Accordion } from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import { AccordionContent, AccordionItem, AccordionTrigger } from "../../../../components/ui/accordion";
import { Button } from "../../../../components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../../../components/ui/sheet";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Label } from "../../../../components/ui/label";

interface FilterDrawerProps {
  title: string;
  onOpenChange: () => void;
  open: boolean;
  onSaveFilters?: (data: { [key: string]: string[] }) => void;
}

const FilterDrawer = ({
  onOpenChange,
  open,
  onSaveFilters = () => { },
}: FilterDrawerProps) => {
  const filterData: { [key: string]: string[] } = {
    Types: [
      "Multifamily",
      "Commercial",
      "Industrial",
      "Residential",
      "Affordable Housing",
    ],
    Status: ["Approved", "In progress", "Scheduled", "Declined"],
    Location: ["Chennai", "Bangalore", "Mumbai", "Delhi", "Kolkata"],
    Tranche: ["Tranche 1", "Tranche 2", "Tranche 3", "Setup in Progress"]
  };

  // State to manage selected checkboxes
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({
    Types: [],
    Status: [],
    Location: [],
    Tranche: []
  });

  // Function to handle checkbox change
  const handleCheckboxChange = (
    section: string,
    option: string,
    checked: boolean
  ) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [section]: checked
        ? [...prev[section], option]
        : prev[section].filter((item) => item !== option),
    }));
  };

  const handleSave = () => {
    onSaveFilters(selectedFilters);
    onOpenChange(); // Close the drawer after saving
  };

  const handleCancel = () => {
    const initialFilters = {
      Types: [],
      Status: [],
      Location: [],
    };
    setSelectedFilters(initialFilters); // Reset filters to initial state
    onOpenChange(); // Close the drawer
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={"left"}
        className="overflow-auto p-0 [background:linear-gradient(243.52deg,_#021457_0%,_#19112f_30%,_#301941_60%,_#6e3050_100%),_#0f1212] text-white border-0"
      >
        <SheetHeader className="border-b p-3 sticky top-0 border-gray-600">
          <div className="flex justify-between w-[90%] items-center">
            <SheetTitle className="text-white">Filter By</SheetTitle>
            <div className="flex justify-end gap-5">
              <Button
                onClick={handleCancel}
                variant={"link"}
                className=" text-gray-200 p-0 "
              >
                Cancel
              </Button>
              <Button variant={"link"} onClick={handleSave} className="p-0">
                Save
              </Button>
            </div>
          </div>
        </SheetHeader>
        <div className={`w-full p-2 mx-auto `}>
          <Accordion
            type="multiple"
            defaultValue={Object.keys(filterData).map((key) =>
              key.toLowerCase()
            )}
            className="w-full"
          >
            {Object.entries(filterData).map(([section, options]) => (
              <AccordionItem
                key={section}
                value={section.toLowerCase()}
                className="border border-gray-600 rounded-sm my-1"
              >
                <AccordionTrigger className="flex justify-between text-sm p-3 items-center px-4 rounded-lg cursor-pointer text-white hover:bg-gray-800 hover:shadow-lg hover:no-underline transition-all">
                  {section}
                </AccordionTrigger>
                <motion.div
                  initial="collapsed"
                  animate={"open"}
                  variants={{
                    open: { opacity: 1, height: "auto" },
                    collapsed: { opacity: 0, height: 0 },
                  }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                >
                  <AccordionContent className="p-4">
                    <div className="space-y-3">
                      {options.map((option: string) => (
                        <div
                          key={option}
                          className="flex items-center space-x-3"
                        >
                          <Checkbox
                            id={option}
                            checked={selectedFilters[section].includes(option)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(
                                section,
                                option,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={option}
                            className="text-xs text-white"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </motion.div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterDrawer;
