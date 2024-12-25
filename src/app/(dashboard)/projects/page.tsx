import { checkEsignStatus, fetchProjectData } from "./actions";
import ProjectClient from "./_components/project-client";
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
    const esignStatusObj = esignStatuses.find(status => status.projectId === project.id);
  
    return {
      ...project,
      esign_status: esignStatusObj?.status ?? 'not started',
      esign_url: esignStatusObj?.url ?? null, 
    };
  });

  return (
    <ProjectClient projects={mergedProjects || []} />
  );
}

export default Page
