import { useState, useEffect } from 'react';
import { parseCookies } from 'nookies';
//import { getCompanyId } from '../utils/accounting-service';

export const useAccountingData = () => {
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const accountingSoftwareList = ['TALLY', 'ZOHO_BOOKS', 'QUICKBOOKS','CLEARBOOKS','BUSY'];
  const [currentAccountingSoftware, setCurrentAccountingSoftware] = useState('NONE');
  const [companyId, setCompanyId] = useState(6891);
  console.log(companyId);

  const [processState, setProcessState] = useState('initializing');
  const [userData, setUserData] = useState({ category: 'ACCOUNTING', platform: '' });

  const accessToken = parseCookies().accessToken;

  const changeUserPlatform = (platform: string) => {
    setUserData({ ...userData, platform });
  };

  const handleProcessChange = (newState: string) => {
    setProcessState(newState);
    // Start processing the next software in the list
    processNextSoftware();
  };

  const processNextSoftware = () => {
    const currentIndex = accountingSoftwareList.indexOf(currentAccountingSoftware);
    const nextIndex = currentIndex + 1;
    if (nextIndex < accountingSoftwareList.length) {
      const nextSoftware = accountingSoftwareList[nextIndex];
      setCurrentAccountingSoftware(nextSoftware);
      setProcessState('processing');
      //   getCompanyId(
      //     'NAHAR',
      //     accessToken,
      //     setCompanyId,
      //     setCurrentAccountingSoftware,
      //     setLoadingSpinner,
      //   );
    } else {
      setProcessState('completed');
    }
  };

  useEffect(() => {
    if (currentAccountingSoftware === 'NONE' && accountingSoftwareList.length > 0) {
      processNextSoftware();
    }
  }, [currentAccountingSoftware]);

  return {
    loadingSpinner,
    currentAccountingSoftware,
    accountingSoftwareList,
    processState,
    handleProcessChange,
    changeUserPlatform,
  };
};
