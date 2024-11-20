import React from "react";
import ProjectCrumbs from "../../_components/breadcrumbs";
import { Vendor } from "../../_components/vendor";

function ProjectTimeline() {
  const breadscrumbPath = [
    { name: "Project", href: "/projects" },
    { name: "Budget", href: "" },
  ];

  return (
    <div className="p-5">
      <ProjectCrumbs paths={breadscrumbPath} />
      <Vendor />
    </div>
  );
}

export default ProjectTimeline;
