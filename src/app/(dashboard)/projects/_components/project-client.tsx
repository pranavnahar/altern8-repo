'use client';

import React from 'react';
import { LayoutGrid, LayoutList } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import AddProjectSheet from './add-project-sheet';
import BasicTable from '../../../../components/global/basic-table';
import columns from '../columns';
import DashboardGrids from './dashboard-grids';
import { Button } from '../../../../components/ui/button';
import { Project } from '../types';

interface DashboardTableFilterClientProps {
  projects: Project[];
}

const Filters = ({ projects }: DashboardTableFilterClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewType = searchParams.get('view') || 'list';
  const isGridView = viewType === 'grid';

  const handleViewChange = (view: 'list' | 'grid') => {
    const params = new URLSearchParams(searchParams);
    params.set('view', view);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex w-full pr-10">
      <div className="w-full p-4 rounded-lg text-white">
        <div className="flex gap-2 mb-4">
          {/* <Button>
            Projects
          </Button> */}
          <div className="flex items-center gap-1 w-full p-1 border-b border-b-gray-400">
            <p>Project List</p>
            <div className="flex items-center gap-1 relative bg-black rounded-lg ml-2">
              <div
                className={`absolute top-0 bottom-0 left-0 w-1/2 bg-themeBlue rounded-lg ${
                  isGridView ? 'translate-x-full' : ''
                } transition-transform duration-300`}
              />
              <div
                className={`p-1 rounded-lg cursor-pointer z-20`}
                onClick={() => handleViewChange('list')}
              >
                <LayoutList size={15} color={!isGridView ? 'white' : '#555'} />
              </div>
              <div
                className={`p-1 rounded-lg cursor-pointer z-20`}
                onClick={() => handleViewChange('grid')}
              >
                <LayoutGrid size={15} color={isGridView ? 'white' : '#555'} />
              </div>
            </div>
          </div>
          <AddProjectSheet />
        </div>

        <div className="overflow-auto max-h-[calc(100vh-200px)]">
          {!isGridView ? (
            <BasicTable
              data={projects}
              columns={columns}
              filters={[]}
              needFilters={false}
              tableName="project_view_client_table"
            />
          ) : (
            <div className="flex gap-2 items-center justify-center flex-wrap p-2">
              {projects.map((project: any, index: number) => (
                <div className="w-[48%] p-2" key={index}>
                  <DashboardGrids data={project} user="customer" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;
