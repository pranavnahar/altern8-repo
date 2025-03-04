// choose the primary bank account

import { useContext, useState, useEffect } from 'react';
import { StepperContext } from '../../contexts/stepper-context';
import { useRouter } from 'next/navigation';
import { useToast } from '../../utils/show-toasts';
import { getAuthToken } from '@/utils/auth-actions';

type Props = {
  demo: boolean;
};

const SelectPrimaryBankAccount = ({ demo }: Props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [bankAccountsList, setBankAccountsList] =
    useState<{ accountNumber: string; bankName: string }[]>();
  const { showToast } = useToast();
  const [currentBankAccount, setCurrentBankAccount] = useState('');
  const { currentStep, setCurrentStep, steps, setLoading, getRegistrationState } =
    useContext(StepperContext);
  const router = useRouter();

  const GetBankAccountList = async () => {
    const token = await getAuthToken()
    setLoading(true);
    try {
      let response = await fetch(`${apiUrl}/user-api/select-primary-bank/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.accounts) {
          setBankAccountsList(responseData.accounts);
        } else {
          console.log('No accounts data available');
        }
      } else {
        console.log('Unable to fetch bank accounts list');
      }
    } catch (error) {
      console.log(`Unable to fetch bank accounts list, (${currentStep}) :`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!demo) {
      GetBankAccountList();
    } else {
      setBankAccountsList([
        { accountNumber: '987654321098', bankName: 'SBI' },
        { accountNumber: '123456789123', bankName: 'Kotak Mahindra Bank' },
        { accountNumber: '456789012345', bankName: 'Bank of India' },
      ]);
      return;
    }
  }, []);

  // to handle click on next and back button
  const handleClick = async (direction?: string) => {
    // change the step after click for back button
    let newStep = currentStep;

    if (direction !== 'next') {
      newStep--;
      setCurrentStep(newStep);
    }
    // if button is next the submit data to backend api
    else if (direction === 'next') {
      if (demo) {
        router.push('/register?demo=true&step=5');
        return;
      }
      if (currentBankAccount == '') {
        showToast({
          message: `Please select a valid bank account`,
          type: 'info'
        });
        return;
      }

      let newRecord: { accountNumber: string } = {
        accountNumber: '',
      };
      newRecord.accountNumber = currentBankAccount;
      const token = await getAuthToken()
      try {
        if (newRecord) {
          const body = newRecord;
          setLoading(true);
          const response = await fetch(`${apiUrl}/user-api/select-primary-bank/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
          });

          if (response.ok) {
            let server_message = await response.json();
            showToast({
              message: `Submission Successful`,
              type: 'success'
            });
            getRegistrationState();
          } else {
            let server_error = await response.json();
            showToast({
              message: `Submission failed! ${server_error.message}`,
              type: 'error'
            });
          }
        }
      } catch (error) {
        showToast({
          message: `Submission failed, system error!`,
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-300 text-sm leading-8 uppercase">
          Select a primary bank account
        </div>
        <div className="my-2 py-1 flex">
          <select
            onChange={e => setCurrentBankAccount(e.target.value)}
            value={currentBankAccount || ''}
            name="currentBankAccount"
            className="py-1 w-full text-gray-100 border-b-2 bg-transparent outline-none focus:outline-none focus:border-purple-600 transition-colors"
            required
          >
            <option
              className="bg-[#2c173c] text-gray-100 w-full rounded-md outline-none hover:bg-[#602b4c]"
              value=""
              disabled
            >
              Select bank account
            </option>
            {bankAccountsList?.map((bankAccount, index) => (
              <option
                className="bg-[#2c173c] text-gray-100 w-full rounded-md outline-none hover:bg-[#602b4c]"
                key={index}
                value={bankAccount.accountNumber}
              >
                {bankAccount.bankName} - {bankAccount.accountNumber}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation controls  */}
      {currentStep !== steps.length && (
        <div className="container flex flex-col ">
          <div className="flex justify-around mt-4 mb-8">
            {/* back button  */}
            <button
              onClick={() => handleClick()}
              className="bg-white text-slate-600 uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer border-2 border-slate-300 hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out ${
                            "
            >
              Back
            </button>
            {/* next button  */}
            <button
              onClick={() => handleClick('next')}
              className="bg-[#1565c0] text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer  hover:bg-[#2680e6] hover:text-white transition duration-200 ease-in-out"
            >
              Next
            </button>
          </div>
          {/* <HelpAndLogin /> */}
        </div>
      )}
    </div>
  );
};

export default SelectPrimaryBankAccount;
