import { fetchProjectData } from "./actions";
import ProjectClient from "./_components/project-client";

const Page = async () => {
  const projectsData = await fetchProjectData();

  return (
    <ProjectClient projects={projectsData.results || []} />
  );
}

export default Page
