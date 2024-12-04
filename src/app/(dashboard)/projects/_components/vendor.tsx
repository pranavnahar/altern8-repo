"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import BasicTable from "../../../../components/global/basic-table";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { FormData, InputForms } from "../../../../components/InputForms/InputForms";
import { FormInput } from "../../../../components/LedgerTypeTable/Filter";
import DownloadButton from "./download";
import { useToast } from "@/utils/show-toasts";
import { addProjectVendor, fetchProjectVendors } from "@/app/(dashboard)/projects/_actions/fetch-project-vendor-actions";
import { vendorColumns } from "../_columns/vendor-columns";

export interface TaskData {
  Task: string;
  Owner: string;
  Status: string;
  OriginalStartDate: string;
  ProjectedActualStartDate: string;
  OriginalCompletionDate: string;
  ProjectedActualCompletionDate: string;
  CompletionDateVariance: string;
}

export interface TaskHeaderProps {
  title: string;
  classname?: string;
  rowClassname?: string;
  key: keyof TaskData;
  onClick?: (row: TaskData) => void;
}

export type ChartDataPoint = {
  x: [number, number];
  y: string;
};

interface TimeRanges {
  [key: string]: {
    min: number;
    max: number;
    format:
    | false
    | "millisecond"
    | "second"
    | "minute"
    | "hour"
    | "day"
    | "week"
    | "month"
    | "quarter"
    | "year"
    | undefined;
  };
}

interface chartTimeProps {
  min: number;
  max: number;
  format:
  | false
  | "millisecond"
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "year"
  | undefined;
}

export const Vendor = () => {
  const params = useParams();
  const projectId = Number(params.id);
  const [vendorList, setVendorList] = useState<any[]>([]);
  const [inputOpen, setInputOpen] = useState<boolean>(false);
  const [uploadOpen, setUploadOpen] = useState<boolean>(false);

  const { showToast } = useToast();
  const [editId, setEditId] = useState<number>(0);
  const [edit, setEdit] = useState<boolean>(false);

  const vendorFields: FormInput[] = [
    {
      type: "text",
      label: "Name",
      name: "name",
      placeholder: "Enter the Vendor Name",
      required: true,
    },
    {
      type: "text",
      label: "Contact Number",
      name: "contact_number",
      placeholder: "Enter the Contact Number",
      required: true,
    },
    {
      type: "email",
      label: "Email",
      name: "email",
      placeholder: "Enter the Email",
      required: true,
    },
    {
      type: "text",
      label: "Address",
      name: "address",
      placeholder: "Enter the Address",
      required: false,
    },
  ];

  const vendorUploadFields: FormInput[] = [
    {
      type: "file",
      label: "Task",
      name: "file",
      placeholder: "",
      required: false,
    },
  ];


  const handleFetchTask = async () => {
    const data: any = await fetchProjectVendors(projectId);
    setVendorList(data.results);
  };

  //   const refetch = async() => {
  //     const inventoryRes = await fetchProjectInventory(Number(params.id)) as InventoryResponse ;
  //     setInventory(inventoryRes)
  //   }

  const handleSubmit = async (data: any, setData: (data: FormData) => void) => {
    try {
      const result = await addProjectVendor(Number(params.id), data)
      if (edit) {
        if (result.success) {
          showToast({
            message: result.data.detail,
            type: "success",
          });
          setData({})
          handleFetchTask()
          OpenChange();
        } else {
          showToast({
            message: result.error || "Failed to update project vendor",
            type: "error",
          });
        }
      } else {
        if (result.success) {
          showToast({
            message: "Project vendor updated successfully",
            type: "success",
          });
          setData({})
          // refetch()
          OpenChange();
        } else {
          showToast({
            message: result.error || "Failed to update project vendor",
            type: "error",
          });
        }
      }
    } catch (error) {
      console.error("Error updating project status:", error);
      showToast({
        message: "An unexpected error occurred. Please try again.",
        type: "error",
      });
    }
  };

  const handleEdit = (id: number) => {
    setEditId(id);
    setEdit(true);
    setInputOpen(true);
  };



  const OpenChange = () => setInputOpen(false);

  useEffect(() => {
    handleFetchTask();
  }, []);

  return (
    <section className="flex flex-col">
      <div className="grid w-[95%] mx-auto mt-10">
        <div className="grid grid-cols-3">
          <div></div>
          <h1 className="text-3xl text-white font-semibold text-center">
            Vendor List
          </h1>
          <div className="flex items-center gap-5 justify-end">
            <DownloadButton fileName={"Task"} from={"task"} />
            <Button
              variant={"outline"}
              className=" bg-transparent text-white hover:bg-transparent hover:text-white"
              onClick={() => setUploadOpen(true)}
            >
              Upload File
            </Button>
            <Button
              variant="expandIcon"
              size="sm"
              Icon={ChevronRight}
              iconPlacement="right"
              className="text-sm h-10 max-w-max"
              onClick={() => setInputOpen(true)}
            >
              Add Vendor
            </Button>
          </div>
        </div>
        <BasicTable
          data={vendorList}
          columns={vendorColumns(handleEdit)}
          filters={[]}
          needFilters={false}
        />

        {/* <InputForms
          title="New Vendor"
          open={inputOpen}
          onOpenChange={OpenChange}
          data={vendorFields}
          submitAction={(data: FormData, setData: (data: FormData) => void) => handleSubmit(data, setData)}
        /> */}

        {/* <InputForms
          title="Upload Vendor List"
          open={uploadOpen}
          onOpenChange={() => setUploadOpen(false)}
          data={vendorUploadFields}
          type="vendors"
          usage="upload"
          edit={edit}
        //   getPath="" add the path here where we can  get the individual vendor detail
        /> */}
      </div>
    </section>
  );
};
