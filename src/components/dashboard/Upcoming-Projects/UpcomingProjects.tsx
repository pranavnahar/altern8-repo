import React from 'react';
import { useProjects } from './useProjects';
import BasicTable from '../BasicTable';
import getColumns, { statusColors } from './Columns';
import { Button } from '../../../components/ui/button';
import { useRouter } from 'next/navigation';

const UpcomingProjects = () => {
  const { projectList } = useProjects();
  const filters = Object.keys(statusColors);
  const router = useRouter();
  return (
    <div className=" px-10">
      <div className="text-center text-white mt-8">List of Upcoming Projects</div>
      <BasicTable data={projectList} columns={getColumns()} filters={filters} />
      <div className=" flex justify-center items-center">
        <Button
          className="text-white self-center mt-3 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 hover:bg-gray-500"
          onClick={() => router.push('/projects-list')}
        >
          Add New Project
        </Button>
      </div>
    </div>
  );
};

export default UpcomingProjects;
