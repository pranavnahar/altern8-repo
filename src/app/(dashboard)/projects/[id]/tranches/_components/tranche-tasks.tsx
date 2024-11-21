"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BasicTable from '@/components/global/basic-table';
import { Budget, Tasks } from '../types';
import TableSkeleton from '@/components/ledger/_components/table-skeleton';
import { fetchTrancheTasks } from '../_actions/tranche-tasks.actions';
import { tasksColumns } from '../_columns/task-columns';

type Props = {
  projectId: number;
  trancheId: number;
}

const TrancheTasks = ({ projectId, trancheId }: Props) => {
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchRules = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchTrancheTasks(projectId, trancheId);
      console.log(response.results)
      setTasks(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="xs"
          className='text-xs'
          onClick={handleFetchRules}
        >
          View Tranche Tasks
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[80vw] h-auto background border-none">
        <DialogHeader>
          <DialogTitle className='text-center text-3xl font-medium text-white'>Tranche Tasks</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <TableSkeleton />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="h-full overflow-hidden">
            <BasicTable
              data={tasks}
              columns={tasksColumns}
              filters={[]}
              needFilters={false}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default TrancheTasks;
