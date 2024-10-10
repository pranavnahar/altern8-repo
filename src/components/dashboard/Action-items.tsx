import React, { MouseEventHandler } from 'react';
import { EllipsisVertical } from 'lucide-react';
import { actionItems } from './types';

const ActionItems: React.FC<actionItems> = ({
  showActionItems,
  latePayments,
  upcomingPayments,
  showActionItemsTables,
}) => {
  if (!showActionItems) return null;

  const items = [
    { label: 'Late Payment', action: 'late', data: latePayments },
    { label: 'Upcoming Payments', action: 'upcoming', data: upcomingPayments },
  ];

  return (
    <div className="rounded-lg  pb-1 [background:linear-gradient(65.92deg,_#021457,_#170a3f_31.84%,_#251431_51.79%,_#301941_64.24%,_#8e295d_99.08%),_#d9d9d9] shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)]">
      <div className="flex items-center px-2 pt-3">
        <div className="text-center text-gray-300 text-xl font-relative-medium flex-grow">
          Action Items
        </div>
        <div title="Important Actions">
          <EllipsisVertical className="size-5 text-neutral-100 my-auto p-0 cursor-pointer" />
        </div>
      </div>
      <div className="mx-5 mb-8">
        {items.map((item, index) => {
          const isClickable = item.data.length > 0;
          return (
            <div
              key={index}
              onClick={
                isClickable
                  ? () => showActionItemsTables(item.action)
                  : (showActionItemsTables('') as MouseEventHandler<HTMLDivElement> | undefined)
              }
              className={`text-gray-900 font-medium rounded-full mt-5 px-5 py-3 bg-font-light-blue ${
                isClickable ? 'cursor-pointer ' : 'cursor-auto'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex">
                  <div className="pr-2">
                    <img src="dashboard/warning.svg" alt="" />
                  </div>
                  <div>{item.label}</div>
                </div>
                <div>
                  <div className="hover:bg-gray-400 p-1 px-2 text-[18px] font-bold rounded-lg">
                    {item.data.length}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActionItems;
