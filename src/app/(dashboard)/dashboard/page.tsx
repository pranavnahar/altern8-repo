'use client';
import { fetchProjectData, getSanctionedLimit, postForFunding } from './actions';
import { ColumnDef } from '@tanstack/react-table';
import BasicTable from '@/components/global/basic-table';
import ActionItems from './components/action-items';
import columns, { statusColors } from './columns';
import ChartCalender from './components/chart-and-calender';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useEffect } from 'react';
import { Project } from '../projects/types';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [projectIdsToFund, setProjectIdsToFund] = useState<string[]>([]);
  const [sanctionedLimit, setSanctionedLimit] = useState(0);
  const [projectList, setProjectList] = useState<Project[]>([]);
  const allColumns = columns(projectIdsToFund, setProjectIdsToFund);
  useEffect(() => {
    const getData = async () => {
      try {
        const limit = await getSanctionedLimit();
        const list = await fetchProjectData();
        console.log(list);
        setSanctionedLimit(limit);
        setProjectList(list.results);
      } catch (error) {
        setSanctionedLimit(0);
        setProjectList([]);
      }
    };
    getData();
  }, []);
  //not sure which API's to use yet
  const handleFunding = async () => {
    try {
      const response = await postForFunding(projectIdsToFund);
    } catch (error) {}
  };
  const handleAddProject = () => {
    router.push(`projects?open=${true}`);
  };
  // const sanctionedLimit = await getSanctionedLimit();
  // const projectList = await fetchProjectData();
  console.log('the project results are in this format: ', projectList);
  const filters = Object.keys(statusColors);
  // const allColumns: ColumnDef<any>[] = columns();
  return (
    <div className="flex mt-8">
      <div className="w-[calc(100%-385px)] transition-all duration-300 px-2 pl-5">
        <div className="space-y-6">
          <ActionItems
            showActionItems={true}
            latePayments={[
              { id: '1', amount: '$1000', dueDate: '2024-10-15', daysOverdue: 5 },
              { id: '2', amount: '$2000', dueDate: '2024-10-10', daysOverdue: 10 },
            ]}
            upcomingPayments={[
              { id: '3', amount: '$1500', dueDate: '2024-11-01', daysUntilDue: 7 },
              { id: '4', amount: '$23455', dueDate: '2024-11-05', daysUntilDue: 11 },
            ]}
            showActionItemsPath="/dashboard/show-action-items"
          />

          <div>
            <div className="text-center text-2xl font-medium text-white mb-6">
              List of Upcoming Projects
            </div>
            <div className="w-full flex justify-end">
              {projectIdsToFund.length > 0 && <Button onClick={handleFunding}>Get Funded</Button>}
            </div>
            <div className="w-full flex justify-between px-2">
              <BasicTable
                data={projectList || []}
                columns={allColumns}
                filters={filters}
                needFilters={false}
                tableName="dashboard-table-user"
              />
              {projectList.length > 0 && (
                <Button type="button" onClick={handleAddProject}>
                  Add Projects
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 w-[385px]">
        <ChartCalender sanctionedLimit={sanctionedLimit} />
      </div>
    </div>
  );
}
