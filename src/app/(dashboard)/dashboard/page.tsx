'use client';
import ActionItems from '@/components/dashboard/Action-items';
import ChartCalender from '@/components/dashboard/Chart-and-Calender';
import React, { useState } from 'react';
import UpcomingProjects from '../../../components/dashboard/Upcoming-Projects/UpcomingProjects';

const page = () => {
  const [showTable, setShowTable] = useState<string>('');
  console.log(showTable);

  return (
    <>
      <div className="flex mt-8">
        <div className=" flex-[3]">
          <ActionItems
            latePayments="test"
            showActionItems="test"
            upcomingPayments="test"
            showActionItemsTables={setShowTable}
          />
          <UpcomingProjects />
        </div>
        <div className="flex-1">
          <ChartCalender sanctionedLimit={0} />
        </div>
      </div>
    </>
  );
};

export default page;
