import React, { useContext, useEffect, useState } from 'react';
import { StepperContext } from '../../contexts/stepper-context';
import { useSearchParams, useRouter } from 'next/navigation';
import HelpAndLogin from '../Step-Component/HelpAndLogin';
import { useToast } from '../../utils/show-toasts';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { Button } from '../ui/button';
import AnimatedLogo from '../Header/AnimatedLogo';

type Props = {
  demo: boolean;
};

const Register = ({ demo }: Props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const entityType = ['Company', 'Partnership', 'Sole Proprietorship', 'Individual', 'Trust'];
  const [userData, setUserData] = useState({
    firstName: '',
    phoneNumber: '',
    password: '',
    password2: '',
    referredBy: '',
    entityType: '',
  });
  const { currentStep, setCurrentStep, steps, setLoading, getRegistrationState } =
    useContext(StepperContext);
  const { showToast } = useToast();
  const search = useSearchParams();
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password2Visible, setPassword2Visible] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showWarningText, setShowWarningText] = useState(false);
  const [currentEntity, setCurrentEntity] = useState('');
  const router = useRouter();

  userData.referredBy = search.get('referal_code')!;

  useEffect(() => {
    if (
      userData.firstName.length &&
      userData.phoneNumber.length === 10 &&
      userData.entityType.length &&
      userData.password.length >= 8 &&
      userData.password2.length >= 8 &&
      termsAccepted
    ) {
      handleConfirmButtonClick()
    }

  }, [userData, termsAccepted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    // if(type){
    //   handleSubmission()
    // }
  };

  const handleNoButtonClick = () => {
    setShowConfirmationModal(false);
    if (userData.phoneNumber) {
      setUserData(prevUserData => ({
        ...prevUserData,
        phoneNumber: '',
      }));
    }
    setShowWarningText(true);
  };

  const handleYesButtonClick = async () => {
    setShowConfirmationModal(false);
    await handleSubmission('next');
  };

  const handleSubmission = async (direction?: string) => {
    if (direction !== 'next') {
      router.push('/');
    } else if (direction === 'next') {
      if (demo) {
        console.log("-----------yes i am in demo mode")
        router.push('/register?demo=true&step=2');
        return;
      } else {
        console.log("I -------- AM -------- NOT IN DEMO MODE -------")
        const updatedRecord = {
          first_name: userData.firstName ? userData.firstName.trim() : '',
          phone_number: userData.phoneNumber ? userData.phoneNumber.trim() : '',
          password: userData.password ? userData.password.trim() : '',
          reenter_password: userData.password2 ? userData.password2.trim() : '',
          referred_by: userData.referredBy ? userData.referredBy.trim() : '',
          entity_type: currentEntity ? currentEntity.trim() : '',
        };

        console.log("the entity type might or mgiht not be this", currentEntity )

        // password validation
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#:])[A-Za-z\d@$!%*?&#:]{8,}$/;
        const isValidPassword = passwordRegex.test(updatedRecord.password);

        if (updatedRecord.first_name.length < 3) {
          showToast({
            message: `Please enter a valid name`,
            type: 'info'
          });
          return;
        }
        if (updatedRecord.phone_number.length !== 10) {
          showToast({
            message: `Phone number must be a 10-digit number`,
            type: 'info'
          });
          setUserData(prevUserData => ({
            ...prevUserData,
            phoneNumber: '',
          }));
          return;
        }
        if (!updatedRecord.entity_type) return showToast({ message: 'Select entity type', type: 'info'});

        
        if (!isValidPassword) {
          showToast(
            {message: `Password must be at least 8 characters long and include at least one letter, one digit, and one special character. Allowed special characters are: @$!%*?&#:`,
            type: 'info',
          });
          return;
        }
        if (updatedRecord.password !== updatedRecord.reenter_password) {
          showToast({
            message: `Both password should match`,
            type: 'info'
          });
          return;
        }
        if (!termsAccepted) {
          showToast({
            message: `You must accept the terms and conditions`,
            type :'info'
          });
          return;
        }

        try {
          const body = updatedRecord;
          setLoading(true);
          const response = await fetch(`${apiUrl}/user-api/register/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          });

          if (response.status === 409) {
            showToast({
              message: `Phone number is already registered. Please login`,
              type: 'info'
            });
            setTimeout(() => {
              router.push('/login');
            }, 3000);
          } else if (response.ok) {
            let serverMessage = await response.json();
            showToast({
              message: `Submission Successful`,
              type: 'info'
            });

            router.push('/register?demo=true&step=2');

            let data = serverMessage;

            // setCookie(null, 'altern8_useraccess', data.access, {
            //   maxAge: 60 * 60,
            //   path: '/',
            // });

            try {
              const superadmin_body =  { ...updatedRecord, is_active: true };
              console.log("relogging the api urls; ", superadmin_body)
              const secondApiResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPERADMIN_SERVER_URL}/auth-service/register/altern8/`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(superadmin_body)
              });
        
              if (secondApiResponse.ok) {
                let secondApiData = await secondApiResponse.json();
                console.log('Second super admin API response:', secondApiData);
              } else {
                let secondApiError = await secondApiResponse.json();
                console.log('Error in second super admin API call:', secondApiError);
                showToast({
                  message: `Error in second super admin API call: ${secondApiError.message}`,
                  type: 'error'
                });
              }
            } catch (secondError) {
              console.error('Error in second super admin API call:', secondError);
            }

            getRegistrationState();
          } else {
            let server_error = await response.json();
            showToast({
              message: `${server_error.message.phone_number[0]}`,
              type: 'info'
            });

            if (!server_error.message.phone_number) {
              showToast({
                message: `Submission Failed`,
                type: 'info'
              });
            }
          }


        } catch (error) {
          console.error(
            `Error submitting register form data, Error in fetching api (${currentStep}) :`,
            error,
          );
          showToast({
            message: `Submission failed, system error!`,
            type: 'error'
          });
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const handleShowPassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleShowPassword2 = () => {
    setPassword2Visible(!password2Visible);
  };

  const handleConfirmButtonClick = async () => {
    console.log('first', 1);
    console.log("----------THE USER DATA FULL IS THIS: ", userData)
    if (

      userData.firstName.length &&
      userData.phoneNumber.length &&
      currentEntity.length &&
      userData.password.length &&
      userData.password2.length
    ) {
      console.log("the first if blick triggered......");
      console.log("the values are being set to this stuff: 1", userData)
      setShowConfirmationModal(true);
    } else {
      console.log("the values are being set to this stuff: 11111", userData)
      await handleSubmission('next');
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setCurrentEntity(value);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center font-medium text-gray-200 text-xl">
        <div className="flex items-center w-[40%]">
          <div className="mx-3">
            <img className="w-[40px] h-[40%]" alt="" src="/ballons.png" />
          </div>
          <div className="text-5xl text-white flex w-full gap-3 justify-center items-center"><span>Welcome to</span> <AnimatedLogo/></div>
          <div className="mx-3">
            <img className="w-[40px] h-[40%]" alt="" src="/ballons.png" />
          </div>
        </div>
      </div>
      <div className="w-full mx-2 flex-1">
        <div className="font-semibold h-6 mt-3 text-gray-300 text-sm leading-8 uppercase">
          First Name
        </div>
        <div className="mt-2 py-1 flex text-gray-200">
          <input
            onChange={handleChange}
            value={userData.firstName || ''}
            name="firstName"
            placeholder="First Name"
            className="py-1 w-full text-gray-100 border-b-2 bg-transparent outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
            type="text"
            autoComplete="new-password"
            required
          />
        </div>
      </div>
      <div className="w-full mx-2 flex-1">
        <div className="font-semibold h-6 mt-3 text-gray-300 text-sm leading-8 uppercase">
          Phone Number
        </div>
        <div className="mt-2 py-1 flex text-gray-200">
          <input
            onChange={handleChange}
            value={userData.phoneNumber || ''}
            name="phoneNumber"
            placeholder="Phone Number"
            className="py-1 w-full text-gray-100 border-b-2 bg-transparent outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
            type="text"
            autoComplete="new-password"
            required
          />
        </div>
      </div>
      {!showWarningText && (
        <div className="text-gray-300 mx-2 text-sm">
          Please input mobile number connected with PAN of the entity requesting Real estate project
        </div>
      )}
      {showWarningText && (
        <div className="text-yellow-600 mx-2 text-sm">
          Please input mobile number connected with PAN of the entity requesting Real estate project
        </div>
      )}
      <div className="text-gray-300 mx-2 text-sm">
        <ul>
          <li>Please keep this mobile number accessible for OTPs</li>
        </ul>
      </div>

      <div className="flex py-1 my-2 ml-2 ">
        <select
          onChange={handleSelectChange}
          value={currentEntity || ''}
          name="primary account"
          className="w-full py-1 text-gray-100 transition-colors bg-transparent border-b-2 outline-none focus:outline-none focus:border-purple-600"
          required
        >
          <option
            className="bg-[#2c173c] text-gray-100 w-full rounded-md outline-none hover:bg-[#602b4c]"
            value=""
            disabled
          >
            Select an Entity
          </option>
          {entityType.map((item, index) => (
            <option
              className="bg-[#2c173c] text-gray-100 tracking-wider rounded-md outline-none hover:bg-[#602b4c]"
              key={index}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-semibold h-6 mt-3 text-gray-300 text-sm leading-8 uppercase">
          Create Password
        </div>
        <div className="my-2 py-1 relative">
          <input
            onChange={handleChange}
            value={userData.password || ''}
            name="password"
            placeholder="Password"
            className="py-1 w-full text-gray-100 border-b-2 bg-transparent outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
            type={passwordVisible ? 'text' : 'password'}
            autoComplete="new-password"
            required
          />
          {passwordVisible ? (
            <IconEye
              onClick={handleShowPassword}
              className="size-6 absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
            />
          ) : (
            <IconEyeOff
              onClick={handleShowPassword}
              className="size-6 absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
            />
          )}
        </div>
      </div>
      <div className="text-gray-300 mb-2 mx-2 text-sm">
        Password must be at least 8 characters long and include at least one letter, one digit, and
        one special character. Allowed special characters are: @$!%*?&#:
      </div>
      <div className="w-full mx-2 flex-1">
        <div className="font-semibold text-sm h-6 mt-3 text-gray-300 leading-8 uppercase">
          Re-enter Password
        </div>
        <div className="mt-2 py-1 relative">
          <input
            onChange={handleChange}
            value={userData.password2 || ''}
            name="password2"
            placeholder="Password"
            className="py-1 w-full text-gray-100 border-b-2 bg-transparent outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
            type={password2Visible ? 'text' : 'password'}
            autoComplete="new-password"
            required
          />
          {password2Visible ? (
            <IconEye
              onClick={handleShowPassword2}
              className="size-6 absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
            />
          ) : (
            <IconEyeOff
              onClick={handleShowPassword2}
              className="size-6 absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
            />
          )}
        </div>
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="mt-1 py-1 flex text-gray-200">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-indigo-500"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
            />
            <span className="ml-2 text-gray-300">
              I agree to the{' '}
              <a
                href="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-500"
              >
                terms and conditions
              </a>{' '}
             ,{' '}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-500"
              >
                privacy policy
              </a> and {' '}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-500"
              >
                cancellation policy
              </a>
            </span>
          </label>
        </div>
      </div>

      {currentStep !== steps.length && (
        <div className="container flex flex-col ">
          <div className="flex justify-around mt-6 mb-8">
            {/* back button  */}
            {/* <button
              onClick={() => handleSubmission()}
              className="bg-white text-slate-600 uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer border-2 border-slate-300 hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out ${
                            "
            >
              Back
            </button> */}

            {!showConfirmationModal && (
              //  popup confirmation button
              <button
                onClick={() => handleConfirmButtonClick()}
                className="bg-[#1565c0] text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer  hover:bg-[#2680e6] hover:text-white transition duration-200 ease-in-out"
              >
                Confirm
              </button>
)}
            {showConfirmationModal && (
              // next button
              <button
                onClick={() => handleSubmission('next')}
                className="bg-[#1565c0] text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer  hover:bg-[#2680e6] hover:text-white transition duration-200 ease-in-out"
              >
                Next
              </button>
            )}

            {showConfirmationModal && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50  flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                <div className="relative w-3/4 max-w-lg  mx-auto my-6">
                  {/* Modal content */}
                  <div className="relative flex flex-col   rounded-lg shadow-lg outline-none focus:outline-none [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212]">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5  rounded-t">
                      <div className="text-2xl  font-semibold text-gray-300">Confirmation</div>
                      <button
                        className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                        onClick={() => {
                          setShowConfirmationModal(false);
                        }}
                      >
                        <span className="bg-transparent text-gray-200 h-6 w-6 text-2xl block outline-none focus:outline-none">
                          ×
                        </span>
                      </button>
                    </div>
                    {/* Body */}
                    <div className="underline border-b-2 mx-5 border-gray-400"></div>
                    <div className="relative p-6 flex-auto">
                      <div className="text-gray-300 text-base2">
                        Is {userData.phoneNumber} connected with PAN of the entity requesting
                        Discounting ?
                      </div>
                    </div>
                    {/* Footer */}
                    <div className="flex items-center justify-end p-6 rounded-b">
                      <div>
                        <Button
                          onClick={handleNoButtonClick}
                          size="sm"
                          className='mr-1'
                        >
                          No
                        </Button>
                      </div>
                      <div>
                        <Button
                          size="sm"
                          onClick={handleYesButtonClick}
                        >
                          Yes
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <HelpAndLogin />
        </div>
      )}
    </div>
  );
};

export default Register;
