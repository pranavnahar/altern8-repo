"use client";
import React, { ChangeEvent, FormEvent, Fragment, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
} from "../ui/alert-dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface Props {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}

export interface formData {
  commitments: number;
  projectTotal: number;
  accountRemaining: number;
  percentCompleteNet: number;
  location: string;
  projectName: string;
}

const AddProjectFormModal = ({ open, setOpen }: Props) => {
  // Form Input Sections as object
  let formInputs = [
    {
      type: "text",
      label: "Project Name",
      name: "projectName",
      placeholder: "Project Name",
      required: true,
      errMsg: "Please fill this out!",
    },
    {
      type: "text",
      label: "Location",
      name: "location",
      placeholder: "Your Location",
      required: false,
    },
    {
      type: "text",
      label: "Commitments",
      name: "commitments",
      placeholder: "Commitments",
      required: false,
    },
    {
      type: "text",
      label: "Project Total",
      name: "projectTotal",
      placeholder: "Project Total",
      required: false,
    },
    {
      type: "number",
      label: "Account Remaining",
      name: "accountRemaining",
      placeholder: "Account Remaining",
      required: false,
    },
    {
      type: "number",
      label: "% Complete (Net)",
      name: "percentCompleteNet",
      placeholder: "Enter the percentage",
      required: false,
      min: 0,
      max: 100,
    },
    {
      type: "text",
      label: "Application Date",
      name: "percentCompleteNet",
      placeholder: "Enter the percentage",
      required: false,
      min: 0,
      max: 100,
    },
    {
      type: "text",
      label: "LOC Date",
      name: "percentCompleteNet",
      placeholder: "Enter the percentage",
      required: false,
      min: 0,
      max: 100,
    },
    {
      type: "number",
      label: "% Complete (Net)",
      name: "percentCompleteNet",
      placeholder: "Enter the percentage",
      required: false,
      min: 0,
      max: 100,
    },
    {
      type: "text",
      label: " Project Completion date",
      name: "percentCompleteNet",
      placeholder: "Enter the percentage",
      required: false,
      min: 0,
      max: 100,
    },
    {
      type: "text",
      label: "Last Tranche date",
      name: "percentCompleteNet",
      placeholder: "Enter the percentage",
      required: false,
      min: 0,
      max: 100,
    },
  ];

  const [formData, setFormData] = useState<formData>({
    commitments: 0,
    projectTotal: 0,
    accountRemaining: 0,
    percentCompleteNet: 0,
    location: "",
    projectName: "",
  });

  //onchange function for inputs
  const onChange = (e: ChangeEvent<HTMLInputElement>, type: keyof FormData) => {
    e.preventDefault();
    setFormData({
      ...formData,
      [type]: e.target.value,
    });
  };

  //form submit
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpen(false);

    toast("UI Is Initialized", {
      description: "Not integrated with any API>",
      action: {
        label: "Read",
        onClick: () => console.log("Readed"),
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={() => setOpen(false)}>
      <AlertDialogContent className="[background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] w-[30vw] mx-auto text-white border-0">
        <AlertDialogHeader>Add Project</AlertDialogHeader>
        <form
          className="text-black flex flex-col gap-2"
          onSubmit={(e) => handleSubmit(e)}
        >
          {/* formInputs  */}
          {formInputs.map((item, index) => (
            <Fragment key={index}>
              <Label htmlFor={item?.name} className="text-white my-2">
                {item?.label}{" "}
                {item?.required && <span className="text-red-500">*</span>}
              </Label>
              <Input
                type={item.type}
                placeholder={item.placeholder}
                name={item.name}
                onChange={(e) => onChange(e, item.name as keyof FormData)}
                value={formData?.[item.name as keyof formData]}
                required={item?.required}
                min={item.min}
                max={item.max}
              />
            </Fragment>
          ))}
          <div className="flex items-center justify-end gap-3 my-3">
            <Button
              variant={"outline"}
              className="bg-transparent text-white w-32"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant={"outline"}
              className="bg-transparent text-white w-32"
            >
              Submit
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddProjectFormModal;
