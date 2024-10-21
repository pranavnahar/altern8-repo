
import { fetchProjectSummary } from "../../(dashboard)/project/actions/fetch-project-summary.actions";
import type { SummaryResponse } from "./types";
import Filters from "./components/filters";
import { fetchProjectData } from "./actions";

const Page = async () => {
  const projectsData = await fetchProjectData();
  const summaryResponse = await fetchProjectSummary(1) as SummaryResponse;

  return (
    <Filters
      projects={projectsData.results || []}
      summaryData={summaryResponse.results}
    />
  );
}

export default Page
