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
import { Budget } from '../types';
import { fetchTrancheBudget } from '../_actions/tranche-budget.actions';
import budgetColumns from '../_columns/budget-columns';
import BasicTableSkeleton from '@/components/global/basic-table-skeleton';

type Props = {
  projectId: number;
  trancheId: number;
}

const TrancheBudget = ({ projectId, trancheId }: Props) => {
  const [budget, setBudget] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchRules = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchTrancheBudget(projectId, trancheId);
      setBudget(response.results);
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
          View Tranche Budget
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[80vw] h-auto background border-none">
        <DialogHeader>
          <DialogTitle className='text-center text-3xl font-medium text-white'>Tranche Budget</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <BasicTableSkeleton />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="h-full overflow-hidden">
            <BasicTable
              data={budget}
              columns={budgetColumns}
              filters={[]}
              needFilters={false}
              tableName='tranche_budget_table'
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default TrancheBudget;
