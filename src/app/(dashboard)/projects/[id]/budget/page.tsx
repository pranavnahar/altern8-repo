import React from "react";
import { projectOriginalBudet } from "./actions";
import { Budget } from "@/components/ProjectDetailTabs/Budget/Budget";
import ProjectCrumbs from "../../_components/breadcrumbs";

async function ProjectBudget({ params }: any) {
  const originalBudget = await projectOriginalBudet(params.id);
  const breadscrumbPath = [
    { name: "Project", href: "/projects" },
    { name: "Budget", href: "" },
  ];
  return (
    <div className="p-5">
      <ProjectCrumbs paths={breadscrumbPath} />
      {/* @ts-ignore */}
      <Budget originalBudget={originalBudget} />
    </div>
  );
}

export default ProjectBudget;
