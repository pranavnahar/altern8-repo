import { fetchProjectData, getSanctionedLimit } from './actions';
import BasicTable from '@/components/global/basic-table';
import ActionItems from './components/action-items';
import columns, { statusColors } from './columns';
import ChartCalender from './components/chart-and-calender';
export default async function DashboardPage() {
  const sanctionedLimit = await getSanctionedLimit();
  const projectList = await fetchProjectData();
  console.log("the project results are in this format: ", projectList)
  const filters = Object.keys(statusColors);
  
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
            <BasicTable
              data={projectList.results || []}
              columns={columns}
              filters={filters}
              needFilters={false}
              tableName='dashboard-table-user'
            />
          </div>
        </div>
      </div>
      
      <div className="flex-shrink-0">
        <ChartCalender sanctionedLimit={sanctionedLimit} />
      </div>
    </div>
  );
}