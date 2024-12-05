// get the gst details of the user

import { useContext, useState, useEffect } from 'react';
import { StepperContext } from '../../contexts/stepper-context';
import { useRouter } from 'next/navigation';
import { useToast } from '../../utils/show-toasts';
import HelpAndLogin from '../Step-Component/HelpAndLogin';
import { getAuthToken } from '@/utils/auth-actions';

type Props = {
  demo: boolean;
};

const GST = ({ demo }: Props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [userData, setUserData] = useState({
    gstNumber: '',
    gstUsername: '',
    gstPassword: '',
    otp: '',
  });
  const router = useRouter();
  const [alreadyHaveGstin, setAlreadyHaveGstin] = useState(false);
  const [atleastOneGstinSubmitted, setAtleastOneGstinSubmitted] = useState(false);
  const [isIasEnabled, setIsIasEnabled] = useState(true);
  const [currentGstinList, setCurrentGstinList] = useState([
    '29AALFP3236R1Z7',
    '33BCHPQ7890T2Z1',
    '27DKJLM4567N8Z9',
    '19FGHIJ1234P5Z3',
    '06MNOPQ7890R3Z8'
  ]);
  const { currentStep, setCurrentStep, steps, setLoading, getRegistrationState } =
    useContext(StepperContext);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(10);
  const { showToast } = useToast();

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // handle checkbox change for selecting GST number
  const handleChangeInSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setUserData({ ...userData, gstNumber: value });
    } else {
      setUserData({ ...userData, gstNumber: '' });
    }
  };

  const GetGSTINList = async () => {
    try {
      setLoading(true);
      const token = await getAuthToken()
      let response = await fetch(`${apiUrl}/user-api/gst-list/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.data) {
          const gstinNumbers = responseData.data;
          setCurrentGstinList(gstinNumbers);

          if (gstinNumbers.length > 0) {
            setAlreadyHaveGstin(true);
          }
        }
        if (responseData.is_ias_enabled) {
          setIsIasEnabled(true);
        }
      } else {
        let responseData = await response.json();
        setAlreadyHaveGstin(false);
      }
    } catch (error) {
      console.log(`Unable to fetch gst numbers list, (${currentStep}) :`, error);
      setAlreadyHaveGstin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!demo) {
      GetGSTINList();
    } else {
      setAlreadyHaveGstin(true);
      return;
    }
  }, []);

  const handleClick = async (direction?: string) => {
    let newStep = currentStep;
    if (direction !== 'next') {
      newStep--;
      setCurrentStep(newStep);
    } else if (direction === 'next') {
      if (demo) {
        router.push('/register?demo=true&step=9');
        return;
      }
      let newRecord: { gstIn: string; username: string; password: string } = {
        gstIn: '',
        username: '',
        password: '',
      };
      newRecord.gstIn = userData.gstNumber;
      newRecord.username = userData.gstUsername;

      if (!alreadyHaveGstin) {
        if (newRecord.gstIn.length !== 15) {
          showToast({
            message: `GSTIN Number must contain 15 digits`,
            type: 'info'
          });
          return;
        }
      }

      if (newRecord.username.length < 3) {
        showToast({
          message: `Enter a valid gst username`,
          type: 'info'
        });
        return;
      }
      if (!isIasEnabled) {
        console.log(newRecord);
        try {
          if (newRecord) {
            const body = newRecord;
            const token = await getAuthToken()
            setLoading(true);
            const response = await fetch(`${apiUrl}/scoreme-api/gst/external/gstgenerateotp/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(body),
            });

            if (response.ok) {
              let server_message = await response.json();
              setOtpSent(true);
              showToast({
                message: `Submission successful`,
                type: 'info'
              });
            } else {
              let server_error = await response.json();
              showToast({
                message: `Submission failed! ${server_error.message}`,
                type: 'info'
              });
            }
          }
        } catch (error) {
          showToast({
            message: `Submission failed, system error!`,
            type: 'info'
          });
        } finally {
          setLoading(false);
        }
      } else {
        // for IAS GST Scoreme api
        newRecord.password = userData.gstPassword;
        if (newRecord.password.length < 3) {
          showToast({
            message: `Please enter a valid gst password`,
            type: 'info'
          });
          return;
        }
        console.log(newRecord);
        try {
          if (newRecord) {
            const body = newRecord;
            setLoading(true);
            const token = await getAuthToken()
            const response = await fetch(`${apiUrl}/user-api/ias-gst/`, {
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
                message: `Submission successful`,
                type: 'info'
              });
            } else {
              let server_error = await response.json();
              showToast({
                message: `Submission failed! ${server_error.message}`,
                type: 'info'
              });
            }
          }
        } catch (error) {
          showToast({
            message: `Submission failed, system error!`,
            type: 'info'
          });
        } finally {
          setLoading(false);
        }
      }
    }
  };

  // to send the otp
  const handleSendOtp = async () => {
    if (demo) {
      setCurrentStep(9);
    }
    if (userData.otp.length < 4) {
      showToast({
        message: `Enter valid OTP`,
        type: 'warning'
      });
      return;
    }

    try {
      setLoading(true);
      const token = await getAuthToken()
      let body = {
        otp: userData.otp.trim(),
        gstin: userData.gstNumber.trim(),
      };
      const response = await fetch(`${apiUrl}/scoreme-api/gst/external/gstauthentication/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(body),
      });

      if (response.ok) {
        setAtleastOneGstinSubmitted(true);

        if (atleastOneGstinSubmitted) {
          getRegistrationState();
        }
      } else {
        let server_error = await response.json();
        if (server_error.message) {
          showToast({
            message: `Failed to submit otp, ${server_error.message}`,
            type: 'info'
          });
        } else {
          showToast({
            message: `Failed to submit otp`,
            type: 'info'
          });
        }
      }
    } catch (error) {
      showToast({
        message: `Failed to send otp, system error`,
        type: 'info'
      });
    } finally {
      setLoading(false);
    }
  };

  // otp time counter
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    // Start the countdown when otpSent is true
    if (otpSent) {
      intervalId = setInterval(() => {
        setOtpTimer(prevTimer => {
          if (prevTimer === 0) {
            clearInterval(intervalId);
            setOtpSent(false);
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    // Clear the interval when the component is unmounted or when otpSent becomes false
    return () => clearInterval(intervalId);
  }, [otpSent]);

  return (
    <div className="flex flex-col">
      {!otpSent && (
        <div className="flex flex-col">
          <div className="flex flex-row items-center p-2 mx-auto text-gray-200 rounded-lg text-base2 ">
            <div>
              <svg
                className="w-5 h-5 mr-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <div>AA GST fetch Failed, No problem lets try from GSTIN Website</div>
          </div>

          {alreadyHaveGstin && (
            <div className="flex-1 w-full mx-2">
              <div className="h-6 mt-3 text-sm font-semibold leading-8 text-gray-400 uppercase ">
                Select GST Number
              </div>
              <div className="flex justify-start py-1 my-2 ">
                <select
                  name="gstNumber"
                  value={userData.gstNumber}
                  onChange={(e) => setUserData({ ...userData, gstNumber: e.target.value })}
                  className="py-1 w-full text-gray-100 border-b-2 bg-transparent outline-none focus:outline-none focus:border-purple-600 transition-colors"
                >
                  <option value="">Select a GSTIN</option>
                  {currentGstinList.map((currentGstin, index) => (
                    <option key={index} value={currentGstin}>
                      {currentGstin}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* we have dont have gsting the ask user to input  */}
          {!alreadyHaveGstin && (
            // gstin number input field
            <div className="flex-1 w-full mx-2">
              <div className="h-6 mt-3 text-sm font-semibold leading-8 text-gray-400 uppercase ">
                GST Number
              </div>
              <div className="flex py-1 my-2 ">
                <input
                  onChange={handleChange}
                  value={userData.gstNumber || ''}
                  name="gstNumber"
                  placeholder="GSTIN"
                  className="w-full py-1 text-gray-100 uppercase transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
                  type="text"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
          )}

          <div className="flex-1 w-full mx-2">
            <div className="h-6 mt-3 text-sm font-semibold leading-8 text-gray-400 uppercase">
              GST Username
            </div>
            <div className="flex py-1 my-2 ">
              <input
                onChange={handleChange}
                value={userData.gstUsername || ''}
                name="gstUsername"
                placeholder="GST Username"
                className="w-full py-1 text-gray-100 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
                type="text"
                autoComplete="new-password"
                required
              />
            </div>
          </div>
          {isIasEnabled && (
            <div className="flex-1 w-full mx-2">
              <div className="h-6 mt-3 text-sm font-semibold leading-8 text-gray-400 uppercase">
                GST Password
              </div>
              <div className="flex py-1 my-2 ">
                <input
                  onChange={handleChange}
                  value={userData.gstPassword || ''}
                  name="gstPassword"
                  placeholder="GST Password"
                  className="w-full py-1 text-gray-100 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
                  type="text"
                  autoComplete="new-password"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {otpSent && (
        <div className="flex flex-col">
          <div>
            <div className="flex-1 w-full mx-2">
              <div className="h-6 mt-3 text-sm font-semibold leading-8 text-gray-300 uppercase">
                OTP
              </div>
              <div className="flex py-1 my-2 ">
                <input
                  onChange={handleChange}
                  value={userData.otp || ''}
                  name="otp"
                  placeholder="OTP"
                  className="w-full py-1 text-gray-100 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
                  type="number"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation controls  */}
      {currentStep !== steps.length && (
        <div className="container flex flex-col ">
          <div className="flex justify-around mt-4 mb-8">
            {/* back button  */}
            {/* <button
              onClick={() => handleClick()}
              className="bg-white text-slate-600 uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer border-2 border-slate-300 hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out ${
                            "
            >
              Back
            </button> */}

            {/* next button  */}
            {!otpSent && (
              <button
                onClick={() => handleClick('next')}
                className="bg-[#1565c0] text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer  hover:bg-[#2680e6] hover:text-white transition duration-200 ease-in-out"
              >
                Next
              </button>
            )}

            {otpSent && (
              <button
                onClick={() => handleSendOtp()}
                className="bg-[#1565c0] text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer  hover:bg-[#2680e6] hover:text-white transition duration-200 ease-in-out"
              >
                Next
              </button>
            )}
          </div>
          <HelpAndLogin />
        </div>
      )}
    </div>
  );
};

export default GST;
