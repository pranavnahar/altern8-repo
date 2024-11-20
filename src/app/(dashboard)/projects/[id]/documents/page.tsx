import Document from "@/components/ProjectDetailTabs/Document/Document";
import React from "react";
import ProjectCrumbs from "../../_components/breadcrumbs";

function ProjectDocument() {
  const breadscrumbPath = [
    { name: "Project", href: "/projects" },
    { name: "Document", href: "" },
  ];

  return (
    <div className="p-5">
      <ProjectCrumbs paths={breadscrumbPath} />
      <Document />
    </div>
  );
}

export default ProjectDocument;
