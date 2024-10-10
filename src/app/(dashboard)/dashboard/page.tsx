'use client';
import ActionItems from '@/components/dashboard/Action-items';
import ChartCalender from '@/components/dashboard/Chart-and-Calender';
import React, { useState } from 'react';

const page = () => {
  const [showTable, setShowTable] = useState<string>('');
  console.log(showTable);

  return (
    <>
      <h1 className="text-5xl font-semibold text-center w-full text-zinc-100">Dashboard</h1>
      <div className="flex mt-8">
        <div className=" flex-[3]">
          <ActionItems
            latePayments="test"
            showActionItems="test"
            upcomingPayments="test"
            showActionItemsTables={setShowTable}
          />
        </div>
        <div className="flex-1">
          <ChartCalender sanctionedLimit={0} />
        </div>
      </div>
    </>
  );
};

export default page;
