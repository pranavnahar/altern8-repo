"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BasicTable from '@/components/global/basic-table';
import { fetchTrancheRules } from '../_actions/tranche-rules.actions';
import { Rule } from '../types';
import { rulesColumns } from '../_columns/rule-columns';
import BasicTableSkeleton from '@/components/global/basic-table-skeleton';

type Props = {
  projectId: number;
  trancheId: number;
}

const TrancheRules = ({ projectId, trancheId }: Props) => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchRules = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchTrancheRules(projectId, trancheId);
      setRules(response.results);
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
          View Tranche Rules
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[80vw] h-auto background border-none">
        <DialogHeader>
          <DialogTitle className='text-center text-3xl font-medium text-white'>Tranche Rules</DialogTitle>
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
              data={rules}
              columns={rulesColumns}
              filters={[]}
              needFilters={false}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default TrancheRules;
