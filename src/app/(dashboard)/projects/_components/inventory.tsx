"use client";
import { Card } from "@/components/ui/card";
import BasicTable from "@/components/global/basic-table";
import { FormData, InputForms } from "@/components/InputForms/InputForms";
import { useEffect, useState } from "react";
import { FormInput } from "@/components/LedgerTypeTable/Filter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/utils/show-toasts";
import { useParams } from "next/navigation";
import { InventoryResponse } from "@/components/ProjectDetailTabs/OverView/types";
import { addProjectInventory, editProjectInventory, fetchProjectInventory } from "@/app/(dashboard)/projects/_actions/fetch-project-inventory.actions";
import { InventoryColumns } from "../_columns/inventory-columns";

export const InventoryTable = (inventoryData: any) => {
  const [open, setOpen] = useState<boolean>(false);
  const OpenChange = () => setOpen(false);
  const { showToast } = useToast();
  const [editId, setEditId] = useState<number>(0);
  const params = useParams();
  const [edit, setEdit] = useState<boolean>(false);
  const [inventory, setInventory] = useState(inventoryData)

  useEffect(() => {
    setInventory(inventoryData)
  }, [inventoryData])

  const inventoryFields: FormInput[] = [
    {
      type: "number",
      label: "Lots Count",
      name: "lots_count",
      placeholder: "Enter the Lots Count",
      required: false,
    },
    {
      type: "number",
      label: "Lots Amount",
      name: "lots_amount",
      placeholder: "Enter the Lots Amount",
      required: false,
    },
    {
      type: "number",
      label: "Foundation Starts Count",
      name: "foundation_starts_count",
      placeholder: "Enter the Foundation Starts Count",
      required: false,
    },
    {
      type: "number",
      label: "Foundation Starts Amount",
      name: "foundation_starts_amount",
      placeholder: "Enter the Foundation Starts Amount",
      required: false,
    },
    {
      type: "number",
      label: "Models Count",
      name: "models_count",
      placeholder: "Enter the Models Count",
      required: false,
    },
    {
      type: "number",
      label: "Models Amount",
      name: "models_amount",
      placeholder: "Enter the Models Amount",
      required: false,
    },
    {
      type: "number",
      label: "Started Completed Count",
      name: "started_completed_count",
      placeholder: "Enter the Started Completed Count",
      required: false,
    },
    {
      type: "number",
      label: "Started Completed Amount",
      name: "started_completed_amount",
      placeholder: "Enter the Started Completed Amount",
      required: false,
    },
    {
      type: "number",
      label: "Units Count",
      name: "units_count",
      placeholder: "Enter the Units Count",
      required: false,
    },
    {
      type: "number",
      label: "Units Amount",
      name: "units_amount",
      placeholder: "Enter the Units Amount",
      required: false,
    },
    {
      type: "number",
      label: "Contingent Sales Count",
      name: "contingent_sales_count",
      placeholder: "Enter the Contingent Sales Count",
      required: false,
    },
    {
      type: "number",
      label: "Contingent Sales Amount",
      name: "contingent_sales_amount",
      placeholder: "Enter the Contingent Sales Amount",
      required: false,
    },
  ];

  const refetch = async () => {
    const inventoryRes = await fetchProjectInventory(Number(params.id)) as InventoryResponse;
    setInventory(inventoryRes)
  }

  const handleSubmit = async (data: any, setData: (data: FormData) => void) => {
    try {
      const result = !edit
        ? await addProjectInventory(Number(params.id), data)
        : await editProjectInventory(Number(editId), data);

      if (edit) {
        if (result.success) {
          showToast({
            message: result.data.detail,
            type: "success",
          });
          setData({})
          refetch()
          OpenChange();
        } else {
          showToast({
            message: result.error || "Failed to update project status",
            type: "error",
          });
        }
      } else {
        if (result.success) {
          showToast({
            message: "Project status updated successfully",
            type: "success",
          });
          setData({})
          refetch()
          OpenChange();
        } else {
          showToast({
            message: result.error || "Failed to update project status",
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
    setOpen(true);
  };

  console.log(editId);

  return (
    <>
      <Card className="border-0 bg-transparent text-white rounded-lg p-5">
        <div className="flex items-center justify-between text-sm">
          <h2 className="text-nowrap py-2 text-2xl tracking-tight">
            Inventory
          </h2>
          <Button onClick={() => setOpen(true)}>Add Inventory</Button>
        </div>
        <BasicTable
          data={inventory.inventory || []}
          columns={InventoryColumns(handleEdit)}
          filters={[]}
          needFilters={false}
        />
      </Card>
      {/* <InputForms
        title="Create Budget"
        open={open}
        onOpenChange={OpenChange}
        data={inventoryFields}
        submitAction={(data: FormData, setData: (data: FormData) => void) => handleSubmit(data, setData)}
        edit={edit}
        getPath={edit ? `/rablet-api/inventories/${editId}/` : undefined}
      /> */}
    </>
  );
};
