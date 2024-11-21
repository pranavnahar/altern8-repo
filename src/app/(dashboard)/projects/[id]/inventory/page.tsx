import React from "react";
import { InventoryResponse } from "@/components/ProjectDetailTabs/OverView/types";
import { fetchProjectInventory } from "@/app/(dashboard)/projects/_actions/fetch-project-inventory.actions";
import { InventoryTable } from "@/app/(dashboard)/projects/_components/inventory";
import ProjectCrumbs from "../../_components/breadcrumbs";

async function ProjectDocument({ params }: { params: { id: number } }) {
  const inventoryData = (await fetchProjectInventory(
    params.id
  )) as InventoryResponse;
  console.log(inventoryData)
  const breadscrumbPath = [
    { name: "Project", href: "/projects" },
    { name: "Inventory", href: "" },
  ];

  return (
    <div className="p-5">
      <ProjectCrumbs paths={breadscrumbPath} />
      {inventoryData.results && (
        <InventoryTable inventory={inventoryData.results} />
      )}
    </div>
  );
}

export default ProjectDocument;
