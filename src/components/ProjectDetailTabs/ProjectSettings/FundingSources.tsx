"use client";

import React, { useState, useEffect } from 'react';
import BasicTable from '../../../components/global/basic-table';
import fundingColumns from './columns/funding-columns';
import { fetchProjectFunding } from '../../../app/(dashboard)/project/actions/get-project-funding';

interface FundingSource {
  id: number;
  name: string;
  stakeholder_name: string;
  contact_number: string;
  organization: string;
  contributed_amount: string;
  total_amount: string;
  percentage: string;
  type: string;
  close_date: string;
  maturity_date: string;
  project: number;
  tranche: number;
}

interface Props {
  projectId: number;
}

const FundingSources: React.FC<Props> = ({ projectId }) => {
  const [fundingSources, setFundingSources] = useState<FundingSource[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await fetchProjectFunding(projectId);
        setFundingSources(data.results);
      } catch (err) {
        setFundingSources([])
      }
    };

    fetchData();
  }, [projectId]);

  return (
    <div>
      <BasicTable
        data={fundingSources}
        columns={fundingColumns}
        filters={[]}
        needFilters={false}
      />
    </div>
  );
};

export default FundingSources;
