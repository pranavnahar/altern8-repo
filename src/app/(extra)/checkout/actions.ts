import { getAuthToken } from "@/utils/auth-actions";

const API_BASE_URL = process.env.SERVER_URL
const BEARER_TOKEN = getAuthToken()

export const getBankDetailsForSpecificUser = async (userId:string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin-api/sellers/bank-details/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BEARER_TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching bank details for specific user:', error);
    throw error;
  }
};

export const getVoucherDetails = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/vouchers/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BEARER_TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching voucher details:', error);
    throw error;
  }
};

export const getCreditDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/payment/get-more-credit-charges/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEARER_TOKEN}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching voucher details:', error);
      throw error;
    }
  };

  export const getCalenderDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin-api/calendar/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEARER_TOKEN}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching voucher details:', error);
      throw error;
    }
  };


  export const getBorrowerFlowCharges = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/payment/borrower-flow-charges/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEARER_TOKEN}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching voucher details:', error);
      throw error;
    }
  };

  