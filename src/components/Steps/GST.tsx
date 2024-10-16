// get the gst details of the user

import { useContext, useState, useEffect } from 'react';
import { StepperContext } from '../../Contexts/StepperContext';
//import HelpAndLogin from "./stepsComponents/HelpAndLogin";
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';
import { useToast } from '@/Utils/show-toasts';

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
    '123321123321',
    'gjkgj1232jkgh',
    'gjkgj1232jk00',
  ]);
  const { currentStep, setCurrentStep, steps, setLoading, getRegistrationState } =
    useContext(StepperContext);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(10);
  const { showToast } = useToast();

  // Handle token
  let accessToken = parseCookies().altern8_useraccessForRegister;

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
      let response = await fetch(`${apiUrl}/user-api/gst-list/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // if unauthorized then push to login page
      if (response.status === 401) {
        router.push('/login');
      }

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        if (responseData.data) {
          const gstinNumbers = responseData.data;
          console.log('gstin list:', gstinNumbers);
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
        console.log('Unable to fetch gst numbers list', responseData);
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
          showToast(`GSTIN Number must contain 15 digits`, 'info');
          return;
        }
      }

      if (newRecord.username.length < 3) {
        showToast(`Enter a valid gst username`, 'info');
        return;
      }
      if (!isIasEnabled) {
        console.log(newRecord);
        try {
          if (newRecord) {
            const body = newRecord;
            setLoading(true);
            // temp
            // setOtpSent(true);
            // return;
            const response = await fetch(`${apiUrl}/scoreme-api/gst/external/gstgenerateotp/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify(body),
            });

            if (response.ok) {
              let server_message = await response.json();
              console.log(`GST data submitted successfully`, server_message);

              // set otp state
              setOtpSent(true);
              showToast(`Submission successful`, 'info');
            } else {
              let server_error = await response.json();
              console.error(`Failed to submit GST data`, server_error);

              // temp
              // set otp state
              // setOtpSent(true);

              showToast(`Submission failed! ${server_error.message}`, 'info');
            }
          }
        } catch (error) {
          console.error(`Error submitting GST form data, (${currentStep}) :`, error);
          showToast(`Submission failed, system error!`, 'info');
        } finally {
          setLoading(false);
        }
      } else {
        // for IAS GST Scoreme api
        newRecord.password = userData.gstPassword;
        if (newRecord.password.length < 3) {
          showToast(`Please enter a valid gst password`, 'info');
          return;
        }
        console.log(newRecord);
        try {
          if (newRecord) {
            const body = newRecord;
            setLoading(true);
            const response = await fetch(`${apiUrl}/user-api/ias-gst/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify(body),
            });

            if (response.ok) {
              let server_message = await response.json();
              console.log(`GST data submitted successfully`, server_message);

              showToast(`Submission successful`, 'info');
            } else {
              let server_error = await response.json();
              console.error(`Failed to submit GST data`, server_error);
              showToast(`Submission failed! ${server_error.message}`, 'info');
            }
          }
        } catch (error) {
          console.error(`Error submitting GST form data, (${currentStep}) :`, error);
          showToast(`Submission failed, system error!`, 'info');
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
      showToast(`Enter valid OTP`, 'info');
      return;
    }

    try {
      // Set loading to true when starting the fetch
      setLoading(true);

      let body = {
        otp: userData.otp.trim(),
        gstin: userData.gstNumber.trim(),
      };
      console.log(body);
      // temp
      // return;
      const response = await fetch(`${apiUrl}/scoreme-api/gst/external/gstauthentication/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },

        body: JSON.stringify(body),
      });

      if (response.ok) {
        let responseData = await response.json();
        console.log(responseData);
        console.log('Otp submitted, get success');
        setAtleastOneGstinSubmitted(true);

        if (atleastOneGstinSubmitted) {
          getRegistrationState();
        }
      } else {
        let server_error = await response.json();
        if (server_error.message) {
          console.error('Failed to submit otp', server_error.message);
          showToast(`Failed to submit otp, ${server_error.message}`, 'info');
        } else {
          console.error('Failed to submit otp', server_error);
          showToast(`Failed to submit otp`, 'info');
        }
      }
    } catch (error) {
      console.error(`Server Connection Error during otp, (${currentStep}) :`, error);
      showToast(`Failed to send otp, system error`, 'info');
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
                <div>
                  {currentGstinList.map((currentGstin, index) => (
                    <label key={index} className="block mx-2 font-medium text-gray-300 text-start">
                      <input
                        type="checkbox"
                        onChange={handleChangeInSelect}
                        checked={userData.gstNumber === currentGstin}
                        name="gstNumber"
                        value={currentGstin}
                        className="mr-2"
                      />
                      {currentGstin}
                    </label>
                  ))}
                </div>
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
            <button
              onClick={() => handleClick()}
              className="bg-white text-slate-600 uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer border-2 border-slate-300 hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out ${
                            "
            >
              Back
            </button>

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
          {/* <HelpAndLogin /> */}
        </div>
      )}
    </div>
  );
};

export default GST;
