import React from 'react';

const CurrentSoftware: React.FC<{ software: string }> = ({ software }) => (
  <>
    <div className="h-6 mt-3 text-base font-medium leading-8 text-gray-300">
      Current accounting software:
    </div>
    <div className="py-1 my-2 font-medium text-gray-300">{software}</div>
  </>
);

export default CurrentSoftware;
