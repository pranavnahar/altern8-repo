import React from 'react';
import dynamic from 'next/dynamic';
import SmallCalendar from '../../components/SmallCalender/SmallCalender';

const MyPieChart = dynamic(() => import('../../components/mui/Piechart-Project'), {
  ssr: false,
});

const ChartCalender: React.FC<{ sanctionedLimit: number }> = ({ sanctionedLimit }) => {
  return (
    <div className="col-span-2 w-full ml-2 xl:ml-5 justify-self-end">
      <div className="mb-10 w-full rounded-lg [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] items-start justify-start relative [&.animate]:animate-[1s_ease_0s_1_normal_forwards_shake-horizontal] opacity-[1]">
        <div className="pt-5 text-center text-gray-300 text-xl font-medium">Limit Sanctioned</div>
        <div className="text-center text-purple-600 text-5xl font-medium">
          {sanctionedLimit !== undefined ? `₹ ${sanctionedLimit.toLocaleString('en-IN')}` : '--'}
        </div>
        <div className="flex justify-center max-w-[200px] mx-auto mt-5 text-center">
          <MyPieChart />
        </div>
        <div className="flex text-center mx-auto justify-center">
          <div className="flex flex-row mt-3 mb-5 items-center">
            <div className="rounded-lg bg-[#0088FE] h-4 px-3 xl:px-4" />
            <div className="text-base mx-1 xl:mx-3 text-gray-300">Amount Used</div>
          </div>
          <div className="flex flex-row mt-3 mb-5 items-center">
            <div className="rounded-lg bg-[#7509b8] h-4 px-3 xl:px-4" />
            <div className="text-base mx-1 xl:mx-3 text-gray-300">Amount Left</div>
          </div>
        </div>
      </div>
      <div className="mb-10  ">
        <div className="text-5xl font-semibold text-gray-300 text-center pb-5">Event Calendar</div>
        <SmallCalendar />
      </div>
    </div>
  );
};

export default ChartCalender;
