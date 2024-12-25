// src/components/DataProvider.tsx
import React from 'react';
import { getBankDetailsForSpecificUser, getVoucherDetails, getCreditDetails, getCalenderDetails, getBorrowerFlowCharges } from './actions';

const DataProvider = async ( userId:string, children:any) => {
  try {
    const [bankDetails, voucherDetails, creditDetails, calendarDetails, borrowerFlowCharges] = await Promise.all([
      getBankDetailsForSpecificUser(userId),
      getVoucherDetails(),
      getCreditDetails(),
      getCalenderDetails(),
      getBorrowerFlowCharges(),
    ]);

    const data = {
      bankDetails,
      voucherDetails,
      creditDetails,
      calendarDetails,
      borrowerFlowCharges,
    };

    return <>{children(data)}</>;
  } catch (error) {
    console.error('Error fetching data:', error);
    return <div>Error fetching data</div>;
  }
};

export default DataProvider;
