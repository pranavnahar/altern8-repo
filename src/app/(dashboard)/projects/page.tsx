import Filters from "./components/filters";
import { fetchProjectData } from "./actions";

const Page = async () => {
  const projectsData = await fetchProjectData();

  return (
    <Filters
      projects={projectsData.results || []}
    />
  );
}

export default Page
