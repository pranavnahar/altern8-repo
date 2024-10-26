import React, { useContext, useState } from 'react';
import { StepperContext } from '../../contxts/stepper-context';
import HelpAndLogin from '../Step-Component/HelpAndLogin';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';
import { useToast } from '../../utils/show-toasts';

type Props = {
  demo: boolean;
};

const RERA = ({ demo }: Props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { currentStep, setCurrentStep, setLoading, getRegistrationState } =
    useContext(StepperContext);
  const { showToast } = useToast();

  const [userData, setUserData] = useState({
    Rera_username: '',
    Rera_password: '',
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
        router.push('/register?demo=true&step=11');
        return;
      }
      const { Rera_username, Rera_password } = userData;

      // Validation: At least one field should be filled, and length should be greater than 5
      if (Rera_username.length < 3 || Rera_password.length < 5) {
        showToast({
          message: 'Please provide a valid RERA name and password.',
          type: 'info'
        });
        return;
      }

      try {
        const newRecord = {
          username: Rera_username,
          password: Rera_password,
        };

        setLoading(true);
        const response = await fetch(`${apiUrl}/user-api/rera-details/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken || localStorage.getItem('token')}`,
          },
          body: JSON.stringify(newRecord),
        });

        // if unauthorized then push to login page
        if (response.status === 401) {
          router.push('/login');
        }

        if (response.ok) {
          let server_message = await response.json();
          showToast({
            message: 'Submission Successful',
            type: 'success'
          });
          getRegistrationState();
        } else {
          let server_error = await response.json();
          showToast({
            message: 'Submission failed!',
            type: 'error'
          });
        }
      } catch (error) {
        showToast({
          message: 'Submission failed, system error!',
          type: 'info'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div className="w-full mx-2 flex-1">
        <div className="font-semibold h-6 mt-3 text-gray-300 text-sm leading-8 uppercase">
          Rera Username
        </div>
        <div className="mt-2 py-1 flex text-gray-200">
          <input
            onChange={handleChange}
            value={userData.Rera_username || ''}
            name="Rera_username"
            placeholder="Rera username"
            className="py-1  w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
            type="text"
            autoComplete="new-password"
          />
        </div>
      </div>
      <div className="w-full mx-2 flex-1">
        <div className="font-semibold h-6 mt-3 text-gray-300 text-sm leading-8 uppercase">
          Password
        </div>
        <div className="mt-2 py-1 flex text-gray-200">
          <input
            onChange={handleChange}
            value={userData.Rera_password || ''}
            name="Rera_password"
            placeholder="Rera password"
            className="py-1  w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
            type="text"
            autoComplete="new-password"
          />
        </div>
      </div>

      {/* Navigation controls  */}
      <div className="container flex flex-col ">
        <div className="flex justify-center items-center mt-4 mb-8">
          {/* back button  */}

          {/* next button  */}
          <button
            onClick={() => handleClick('next')}
            className="bg-[#1565c0] text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer  hover:bg-[#2680e6] hover:text-white transition duration-200 ease-in-out"
          >
            Next
          </button>
        </div>
        <HelpAndLogin />
      </div>
    </div>
  );
};

export default RERA;
