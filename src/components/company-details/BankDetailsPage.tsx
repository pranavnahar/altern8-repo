// This is a dashboard page component for showing users bank details

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import { getAccessToken } from '../../Utils/auth';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Check } from 'lucide-react';
import { useToast } from '../../Utils/show-toasts';
import { Button } from '../ui/button';
import { IconChevronRight } from '@tabler/icons-react';
 
const BankDetailsPage = () => {
  const [bankAccountsList, setBankAccountsList] = useState<
    {
      bankName: string;
      accountNumber: string;
      ifscCode: string;
      status: string;
      isPrimary: boolean;
    }[]
  >([]);
  const [loadingSpinner, setLoadingSpinner] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [currentPrimaryAccount, setCurrentPrimaryAccount] = useState('');
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    ifscCode: '',
  });
  const router = useRouter();

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    // console.log("jo", value);

    setCurrentPrimaryAccount(value);
  };
  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle token
  let accessToken = parseCookies().accessToken; //access token from cookies

  // if not accessToken then ask for refresh token
  const ReplaceTokenOrRedirect = async () => {
    // get new access token with help of Refresh token
    const token = await getAccessToken();
    // if not able to get the token then redirect to login
    if (!token) {
      router.push('/login');
    } else {
      accessToken = token;
    }
  };

  // get the Bank details from backend
  const GetBankDetails = async () => {
    try {
      if (!accessToken) {
        await ReplaceTokenOrRedirect();
      }

      let response = await fetch(`${apiUrl}/user-dashboard-api/bank-account/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        await ReplaceTokenOrRedirect();
        // Again try to fetch the data
        response = await fetch(`${apiUrl}/user-dashboard-api/bank-account/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }

      if (response.ok) {
        const responseData = await response.json();
        const newBanks = [];
        for (let i = 0; i < responseData.length; i++) {
          const newData = {
            bankName: responseData[i]['bank_name'],
            accountNumber: responseData[i]['account_number'],
            ifscCode: responseData[i]['IFSC_code'],
            status: responseData[i]['status'],
            isPrimary: responseData[i]['is_primary'],
          };
          newBanks.push(newData);
        }
        // console.log(newBanks);

        setBankAccountsList(newBanks);
      } else {
        console.log('error during getting bank details');
      }
    } catch (error) {
      console.log('server error during getting bank details');
    } finally {
      setLoadingSpinner(false);
    }
  };

  useEffect(() => {
    GetBankDetails();
  }, []);

  const handleChangePrimaryAccount = async () => {
    // trim the fields before send
    let newRecord = {
      account_number: currentPrimaryAccount.trim(),
    };

    if (currentPrimaryAccount.length < 5) {
      showToast({
        message: 'Please select a bank account for primary account',
        type: 'info'
      });
      return;
    }

    // submitting the data to backend
    try {
      // Set loading to true when starting the fetch
      setLoadingSpinner(true);

      let body = newRecord;
      // console.log(body);
      let response = await fetch(`${apiUrl}/user-dashboard-api/change-primary-account/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },

        body: JSON.stringify(body),
      });

      if (response.status === 401) {
        await ReplaceTokenOrRedirect();
        // Again try to fetch the data
        response = await fetch(`${apiUrl}/user-dashboard-api/change-primary-account/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },

          body: JSON.stringify(body),
        });
      }

      if (response.ok) {
        await response.json();
        await GetBankDetails();
        showToast({
          message: 'Successsfully updated primary account',
          type: 'success'
        });
        console.log('Primary account updated successfully');
      } else {
        let server_error = await response.json();
        showToast({
          message: 'Failed to updated primary account',
          type: 'error'
        });
      }
    } catch (error) {
      showToast({
        message: 'Server Connection Error updating primary bank account',
        type: 'error'
      });
    } finally {
      setLoadingSpinner(false);
    }
  };

  const handleAddBankAccount = async () => {
    if (formData['bankName'].length < 5) {
      showToast({
        message: 'Please enter a valid bank name',
        type: 'info'
      });
      return;
    } else if (formData['accountNumber'].length < 5) {
      showToast({
        message: 'Please enter a valid bank account number',
        type: 'info'
      });
      return;
    } else if (formData['ifscCode'].length < 3) {
      showToast({
        message: 'Please enter a valid IFSC code',
        type: 'info'
      });
      return;
    } else if (formData['ifscCode'].length > 11) {
      showToast({
        message: 'Please enter a valid IFSC code',
        type: 'info'
      });
      return;
    }

    // trim the fields before send
    let newRecord = {
      bank_name: formData['bankName'].trim(),
      account_number: formData['accountNumber'].trim(),
      IFSC_code: formData['ifscCode'].toUpperCase().trim(),
    };

    // submitting the data to backend
    try {
      setLoadingSpinner(true);

      let body = newRecord;
      let response = await fetch(`${apiUrl}/user-dashboard-api/bank-account/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },

        body: JSON.stringify(body),
      });

      if (response.status === 401) {
        await ReplaceTokenOrRedirect();
        response = await fetch(`${apiUrl}/user-dashboard-api/bank-account/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(body),
        });
      }

      if (response.ok) {
        await response.json();
        await GetBankDetails();
        setFormData({
          bankName: '',
          accountNumber: '',
          ifscCode: '',
        });
        showToast({
          message: 'Bank account added successfully',
          type: 'success'
        });
      } else {
        let server_error = await response.json();
        showToast({
          message: server_error.message,
          type: 'error'
        });
      }
    } catch (error) {
      showToast({
        message: 'Failed to add bank account, server error',
        type: 'error'
      });
    } finally {
      setLoadingSpinner(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      {loadingSpinner && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-600 bg-opacity-50 ">
          <div className="relative">
            <LoadingSpinner />
          </div>
        </div>
      )}
      <div className="pt-6 pb-8 mb-2 rounded ">
        <div className="mb-3 text-lg font-medium text-center text-gray-200">Bank Accounts</div>
        {bankAccountsList.length !== 0 &&
          bankAccountsList.map((bankDetail, index) => (
            <div
              key={index}
              className="px-3 py-2 mb-6 text-center rounded-lg [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212]"
            >
              <div className="flex mt-3 item-center">
                <p className="text-base font-semibold text-gray-200">Bank Name:</p>
                <p className="pl-3 text-base text-gray-300">{bankDetail.bankName}</p>
              </div>
              <div className="flex mt-3 item-center">
                <p className="text-base font-semibold text-gray-200">Account Number:</p>
                <p className="pl-3 text-base text-gray-400">{bankDetail.accountNumber}</p>
              </div>
              <div className="flex mt-3 item-center">
                <p className="text-base font-semibold text-gray-200">IFSC Code:</p>
                <p className="pl-3 text-base text-gray-400">{bankDetail.ifscCode}</p>
              </div>
              {bankDetail.isPrimary && (
                <div className="flex mt-3 item-center">
                  <p className="text-base font-semibold text-gray-200">Primary:</p>
                  <p className="pl-3 text-base text-gray-400">
                    <span className="font-bold text-green-600"> &#x2713;</span>
                  </p>
                </div>
              )}

              <div>
                {bankDetail.status === 'Verified' ? (
                  <span className="flex items-center justify-center py-2 my-2 text-sm rounded-lg bg-primary text-white">
                    <Check
                      className="p-1 my-auto mr-2 rounded-full size-5 bg-white/20"
                      strokeWidth={2}
                    />
                    Verified
                  </span>
                ) : (
                  <span className="flex items-center justify-center py-2 my-2 text-sm rounded-lg bg-primary/70 text-white">
                    Not Verified
                  </span>
                )}
              </div>
            </div>
          ))}

        {/* change primary bank account  */}
        {bankAccountsList.length !== 0 && (
          <div>
            <div className="h-6 mt-10 text-base font-medium leading-8 text-gray-300 ">
              Change primary bank account:
            </div>
            <div className="flex py-1 my-2 ">
              <select
                onChange={handleSelectChange}
                value={currentPrimaryAccount || ''}
                name="primary account"
                className="w-full py-1 text-gray-100 transition-colors bg-transparent border-b-2 outline-none focus:outline-none focus:border-purple-600"
                required
              >
                <option
                  className="bg-[#2c173c] text-gray-100 w-full rounded-md outline-none hover:bg-[#602b4c]"
                  value=""
                  disabled
                >
                  Select a bank account
                </option>
                {bankAccountsList
                  .filter(account => !account.isPrimary) // Filter out primary accounts
                  .map((account, index) => (
                    <option
                      className="bg-[#2c173c] text-gray-100 tracking-wider rounded-md outline-none hover:bg-[#602b4c]"
                      key={index}
                      value={account.accountNumber}
                    >
                      {account.bankName} - {account.accountNumber}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex justify-center pt-5">
              <Button
                onClick={handleChangePrimaryAccount}
                type="submit"
                size="sm"
              >
                Proceed
              </Button>
            </div>
          </div>
        )}

        <div className="pt-6 pb-8 mb-4 rounded">
          <div className="h-6 mt-5 text-base font-medium leading-8 text-gray-300 ">
            Add new bank account:
          </div>
          <div className="flex-1 w-full">
            <div className="h-6 mt-3 text-xs font-bold leading-8 text-gray-400 uppercase">
              Bank Name
            </div>
            <div className="flex py-1 my-2">
              <input
                onChange={handleChange}
                value={formData['bankName'] || ''}
                name="bankName"
                placeholder="Bank name"
                className="w-full py-1 text-gray-200 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
                type="text"
                required
              />
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="h-6 mt-3 text-xs font-bold leading-8 text-gray-400 uppercase">
              Account Number
            </div>
            <div className="flex py-1 my-2">
              <input
                onChange={handleChange}
                value={formData['accountNumber'] || ''}
                name="accountNumber"
                placeholder="Account number"
                className="w-full py-1 text-gray-200 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
                type="text"
                required
              />
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="h-6 mt-3 text-xs font-bold leading-8 text-gray-400 uppercase">
              IFSC Code
            </div>
            <div className="flex py-1 my-2">
              <input
                onChange={handleChange}
                value={formData['ifscCode'] || ''}
                name="ifscCode"
                placeholder="IFSC code"
                className="w-full py-1 text-gray-200 uppercase transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
                type="text"
                required
              />
            </div>
          </div>
          <div className="flex justify-center pt-5">
            <Button
              onClick={handleAddBankAccount}
              type="submit"
              size="sm"
              variant="expandIcon"
              iconPlacement='right'
              Icon={IconChevronRight}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetailsPage;
