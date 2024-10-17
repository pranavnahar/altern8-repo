import React, { useContext, useState } from 'react';
import { StepperContext } from '../../Contexts/StepperContext';
import HelpAndLogin from '../Step-Component/HelpAndLogin';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';
import { useToast } from '../../Utils/show-toasts';

type Props = {
  demo: boolean;
};

const Udyam = ({ demo }: Props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { currentStep, setCurrentStep, setLoading, getRegistrationState } =
    useContext(StepperContext);
  const { showToast } = useToast();

  const [userData, setUserData] = useState({
    udyam_number: '',
    uam_number: '',
  });
  let accessToken = parseCookies().altern8_useraccessForRegister;
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // to handle click on next and back button
  const handleClick = async (direction?: string) => {
    let newStep = currentStep;

    if (direction !== 'next') {
      newStep--;
      setCurrentStep(newStep);
    } else if (direction === 'next') {
      if (demo) {
        router.push('/register?demo=true&step=12');
        return;
      }
      const { udyam_number, uam_number } = userData;

      // Validation: At least one field should be filled, and length should be greater than 5
      if ((!udyam_number || udyam_number.length <= 5) && (!uam_number || uam_number.length <= 5)) {
        showToast('Please provide a valid Udyam or UAM Number.', 'info');
        return;
      }

      try {
        const newRecord = {
          udyam_number,
          uam_number,
        };

        setLoading(true);
        const response = await fetch(`${apiUrl}/user-api/udyam/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(newRecord),
        });

        // if unauthorized then push to login page
        if (response.status === 401) {
          router.push('/login');
        }

        if (response.ok) {
          let server_message = await response.json();
          console.log('Udyam data submitted successfully', server_message);

          showToast('Submission Successful', 'info');
          getRegistrationState();
        } else {
          let server_error = await response.json();
          console.error('Udyam submission failed', server_error);
          showToast('Submission failed!', 'info');
        }
      } catch (error) {
        console.error(`Error in submitting udyam data, (${currentStep}) :`, error);
        showToast('Submission failed, system error!', 'info');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div className="w-full mx-2 flex-1">
        <div className="font-semibold h-6 mt-3 text-gray-300 text-sm leading-8 uppercase">
          Udyam Number
        </div>
        <div className="mt-2 py-1 flex text-gray-200">
          <input
            onChange={handleChange}
            value={userData['udyam_number'] || ''}
            name="udyam_number"
            placeholder="Udyam Number"
            className="py-1  w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
            type="text"
            autoComplete="new-password"
          />
        </div>
      </div>
      <div className="w-full mx-2 flex-1">
        <div className="font-semibold h-6 mt-3 text-gray-300 text-sm leading-8 uppercase">
          UAM Number
        </div>
        <div className="mt-2 py-1 flex text-gray-200">
          <input
            onChange={handleChange}
            value={userData['uam_number'] || ''}
            name="uam_number"
            placeholder="UAM Number"
            className="py-1  w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
            type="text"
            autoComplete="new-password"
          />
        </div>
      </div>

      {/* Navigation controls  */}
      <div className="container flex flex-col ">
        <div className="flex flex-row-reverse justify-center items-center gap-5 mt-4 mb-8">
          {/* back button  */}

          {/* next button  */}
          <button
            onClick={() => handleClick('next')}
            className="bg-[#1565c0] text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer  hover:bg-[#2680e6] hover:text-white transition duration-200 ease-in-out"
          >
            Next
          </button>
          <button
            onClick={() => {
              getRegistrationState('Upload Contract');
            }}
            className="bg-gray-500 text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer  hover:bg-gray-700 hover:text-white transition duration-200 ease-in-out"
          >
            Skip
          </button>
        </div>
        <HelpAndLogin />
      </div>
    </div>
  );
};

export default Udyam;
