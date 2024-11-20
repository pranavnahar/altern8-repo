
import { TimelineTab } from "@/components/TimeLine/TimeLine";
import React from "react";
import ProjectCrumbs from "../../_components/breadcrumbs";

function ProjectTimeline() {
  const breadscrumbPath = [
    { name: "Project", href: "/projects" },
    { name: "Timeline", href: "" },
  ];

  return (
    <div className="p-5">
      <ProjectCrumbs paths={breadscrumbPath} />
      <TimelineTab />
    </div>
  );
}

export default ProjectTimeline;
