import React from 'react';
import { useAccountingData } from './use-accounting-data';
import LoadingOverlay from './loading-overlay';
import CurrentFlow from './current-flow';
import ProcessStateMessage from './process-state-message';
import AccountingSoftwareList from './accounting-software-list';

const Accounting = () => {
  const {
    loadingSpinner,
    currentAccountingSoftware,
    accountingSoftwareList,
    processState,
    handleProcessChange,
    changeUserPlatform,
  } = useAccountingData();

  return (
    <div className="max-w-2xl mx-auto mt-8">
      {loadingSpinner && <LoadingOverlay />}
      <div className="mb-5 rounded-lg ">
        <h2 className="mb-3 font-medium text-center text-gray-200 text-base2">
          Accounting Softwares
        </h2>
        <CurrentFlow software={currentAccountingSoftware} />
        <AccountingSoftwareList
          softwareList={accountingSoftwareList}
          onSelectSoftware={changeUserPlatform}
          onProcessChange={handleProcessChange}
          currentAccountingSoftware={currentAccountingSoftware}
        />
        <ProcessStateMessage state={processState} />
      </div>
    </div>
  );
};

export default Accounting;
