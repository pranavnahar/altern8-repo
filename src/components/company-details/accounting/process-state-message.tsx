import React from 'react';

const ProcessStateMessage: React.FC<{ state: string }> = ({ state }) => {
  if (state === 'success') {
    return (
      <div className="text-center text-green-500">
        <h2 className="text-2xl font-semibold">Success!</h2>
        <p>Your Accounting Platform Is Connected Successfully.</p>
      </div>
    );
  }
  if (state === 'incomplete') {
    return (
      <div className="text-center text-red-500">
        <h2 className="text-2xl font-semibold">Incomplete</h2>
        <p>Process Not Completed.</p>
      </div>
    );
  }
  return null;
};

export default ProcessStateMessage;
