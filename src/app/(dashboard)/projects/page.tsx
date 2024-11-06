import Filters from "./components/filters";
import { fetchProjectData, checkEsignStatus } from "./actions";
import { Project } from "./types";
interface ProjectWithEsign extends Project {
  esign_status: string;
}

const Page = async () => {

  const projectsData = await fetchProjectData();
  const projectIds = projectsData.results.map((project: Project) => project.id);

  // initialize w empty array and proper types
  const esignResponse = await checkEsignStatus(projectIds);
  const esignStatuses = esignResponse.success ? esignResponse.data : [];

  // merge esign status w project data
  const mergedProjects: ProjectWithEsign[] = projectsData.results.map((project: Project) => {
    const esignStatus = esignStatuses.find(status => status.projectId === project.id)?.status ?? 'not started';
    return { ...project, esign_status: esignStatus };
  });

  return (
    <Filters projects={mergedProjects} />
  );
};

export default Page;