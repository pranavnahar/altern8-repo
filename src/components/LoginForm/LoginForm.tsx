import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // for animations
import Link from 'next/link';
import LinearBuffer from '../LinearBuffer'; //for progress animation
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { setAccessTokenCookie, setRefreshTokenCookie, removeTokenCookie } from '../../Utils/auth';
import AnimatedLogo from '../Header/AnimatedLogo';
import { useRouter } from 'next/navigation';
import { useToast } from '../../Utils/show-toasts';

let accessToken = parseCookies().altern8_useraccess;

const login = () => {
  const [LoginForm, setLoginForm] = useState<{
    phoneNumber: string;
    password: string;
    otp: string;
  }>({
    phoneNumber: '',
    password: '',
    otp: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [pageState, setPageState] = useState('login'); //page state from login, password reset and otp
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // handle form input
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setLoginForm({ ...LoginForm, [name]: value });
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    phoneNumber = phoneNumber.trim();
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const validatePassword = (password: string) => {
    password = password.trim();
    return password.length >= 8;
  };

  const getUserState = async () => {
    try {
      setLoading(true);
      const sellerDataResponse = await fetch(`${apiUrl}/user-api/states/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const sellerData = await sellerDataResponse.json();
      const registrationStep = sellerData.user_state;
      if (registrationStep === 'Approved') {
        router.push('/dashboard');
      } else {
        // setCookie(null, 'altern8_registeruseraccess', accessToken, {
        //   expires: 30,
        //   path: '/',
        // });
        // destroyCookie(null, 'altern8_useraccess');
        // destroyCookie(null, 'altern8_userrefresh');
        router.push('/register');
        showToast(`Please complete the registration`, 'info');
      }
    } catch (error) {
      showToast('Please try again later', 'error');
      console.log('login page, error during fetching seller registration states', error);
    } finally {
      setLoading(false);
    }
  };

  // handle login with phone number & password
  const handleLoginWithPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePhoneNumber(LoginForm.phoneNumber)) {
      showToast(`Phone number must be a 10-digit number`, 'info');
      return;
    }

    if (!validatePassword(LoginForm.password)) {
      showToast(`Password must be at least 8 characters`, 'info');
      return;
    }

    let newRecord = {
      phone_number: LoginForm.phoneNumber.trim(),
      password: LoginForm.password.trim(),
    };

    try {
      setLoading(true);
      let body = newRecord;
      const response = await fetch(`${apiUrl}/user-api/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        let data = await response.json();

        // Set the access token in a cookie
        setAccessTokenCookie(data.access);
        setRefreshTokenCookie(data.refresh);
        accessToken = data.access;
        await getUserState();
      } else {
        let serverError = await response.json();
        console.error('Login failed.', serverError.message);
        showToast(`Invalid Credentials`, 'info');
      }
    } catch (error) {
      console.error('System Error during login:', error);
      showToast(`Login Failed, system error`, 'info');
    } finally {
      setLoading(false);
    }
  };

  // handle login with phone number & otp
  const handleLoginWithOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!otpSent) {
      return;
    }

    if (!validatePhoneNumber(LoginForm.phoneNumber)) {
      showToast(`Phone number must be a 10-digit number`, 'info');
      return;
    }

    let newRecord = {
      phone_number: LoginForm.phoneNumber.trim(),
      otp_code: LoginForm.otp.trim(),
    };

    try {
      setLoading(true);
      let body = newRecord;
      console.log(body);
      const response = await fetch(`${apiUrl}/user-api/verify-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(body),
      });

      if (response.ok) {
        let data = await response.json();
        setAccessTokenCookie(data.access);
        setRefreshTokenCookie(data.refresh);
        accessToken = data.access;
        await getUserState();
      } else {
        let server_error = await response.json();
        console.error('Login failed.', server_error);
        showToast(`Invalid Credentials, ${server_error.message}`, 'info');
      }
    } catch (error) {
      console.error('System Error during login:', error);
      showToast(`Login Failed, system error`, 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithPasswordClick = () => {
    setPageState('login');
  };

  const handleLoginWithOtpClick = () => {
    setPageState('otpLogin');
  };

  // login with otp link click
  const handleSendOtp = async () => {
    if (!validatePhoneNumber(LoginForm.phoneNumber)) {
      showToast(`Phone number must be a 10-digit number`, 'info');
      return;
    }

    let newRecord = {
      phone_number: LoginForm.phoneNumber.trim(),
    };

    try {
      setLoading(true);
      let body = newRecord;
      console.log(body);
      const response = await fetch(`${apiUrl}/user-api/generate-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await response.json();
        console.log('otp sent');
        setOtpSent(true);
        LoginForm.otp = '';
      } else {
        let server_error = await response.json();
        console.error('Failed to send otp', server_error);
        showToast(`Failed to send otp,${server_error.message}`, 'info');

        // temp
        setOtpSent(true);
      }
    } catch (error) {
      console.error('System Error during otp', error);
      showToast(`Failed to send otp, system error`, 'info');
    } finally {
      setLoading(false);
    }
  };

  // login with password link click
  const handleForgotPasswordClick = () => {
    router.push('/reset-password');
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (otpSent) {
      setOtpTimer(60);

      intervalId = setInterval(() => {
        setOtpTimer(prevTimer => {
          if (prevTimer === 1) {
            clearInterval(intervalId);
            setOtpSent(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [otpSent]);

  // remove all tokens when user reaches login page
  useEffect(() => {
    removeTokenCookie();
  }, []);

  // on click on ethyx club redirect to landing page
  const handleClickLogo = () => {
    router.push('/');
  };

  // handle password visibility
  const handleShowPassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen  [background:linear-gradient(269.75deg,_#011049,_#19112f_25.75%,_#251431_51.79%,_#301941_64.24%,_#6e3050)] ">
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.7, delay: 0.3 }}
        whileHover={{ scale: 1.03, opacity: 1 }}
        className="w-96  rounded-xl font-roboto text-gray-300 m-5
        [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212]"
      >
        {/* linear buffer  */}
        <div className="mx-5 my-5  rounded-lg">{loading && <LinearBuffer />}</div>
        <div className="mx-3 p-5 sm:p-6">
          <div
            className="self-center text-5xl pt-5 pb-16 sm:text-10xl text-center lg:text-20xl text-gray-300 font-exo letter-spacing-2 flex justify-center items-center"
            onClick={() => {
              handleClickLogo();
            }}
          >
            <AnimatedLogo />
          </div>

          {/* login with password form  */}
          {pageState === 'login' && (
            <form onSubmit={handleLoginWithPasswordSubmit} className="">
              <div className="flex flex-col">
                <div className="w-full mx-2 flex-1">
                  <div className="font-bold h-6 mt-3 text-gray-300 text-xs leading-8 uppercase">
                    Phone Number
                  </div>
                  <div className=" my-2 py-1 flex ">
                    <input
                      onChange={handleInput}
                      value={LoginForm.phoneNumber || ''}
                      name="phoneNumber"
                      placeholder="Phone Number"
                      className="py-1    w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
                      type="text"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                {/* password  */}
                <div className="w-full mx-2 flex-1">
                  <div className="font-bold h-6 mt-3 text-gray-300 text-xs leading-8 uppercase ">
                    Password
                  </div>
                  <div className=" my-2 py-1 relative ">
                    <input
                      onChange={handleInput}
                      value={LoginForm.password || ''}
                      name="password"
                      placeholder="Password"
                      className="py-1    w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
                      type={passwordVisible ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                    />

                    {passwordVisible && (
                      <svg
                        className="w-6 h-6 absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 cursor-pointer"
                        aria-hidden="true"
                        onClick={handleShowPassword}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 7.8C6.7 6.3 9.2 5 12 5s5.3 1.3 7 2.8a12.7 12.7 0 0 1 2.7 3.2c.2.2.3.6.3 1s-.1.8-.3 1a2 2 0 0 1-.6 1 12.7 12.7 0 0 1-9.1 5c-2.8 0-5.3-1.3-7-2.8A12.7 12.7 0 0 1 2.3 13c-.2-.2-.3-.6-.3-1s.1-.8.3-1c.1-.4.3-.7.6-1 .5-.7 1.2-1.5 2.1-2.2Zm7 7.2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}

                    {!passwordVisible && (
                      <svg
                        className="w-6 h-6 absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 cursor-pointer"
                        aria-hidden="true"
                        onClick={handleShowPassword}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="m4 15.6 3-3V12a5 5 0 0 1 5-5h.5l1.8-1.7A9 9 0 0 0 12 5C6.6 5 2 10.3 2 12c.3 1.4 1 2.7 2 3.6Z" />
                        <path d="m14.7 10.7 5-5a1 1 0 1 0-1.4-1.4l-5 5A3 3 0 0 0 9 12.7l.2.6-5 5a1 1 0 1 0 1.4 1.4l5-5 .6.2a3 3 0 0 0 3.6-3.6 3 3 0 0 0-.2-.6Z" />
                        <path d="M19.8 8.6 17 11.5a5 5 0 0 1-5.6 5.5l-1.7 1.8 2.3.2c6.5 0 10-5.2 10-7 0-1.2-1.6-2.9-2.2-3.4Z" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-2 flex justify-between items-center text-gray-300">
                <div>
                  <a
                    href="#"
                    onClick={() => {
                      handleLoginWithOtpClick();
                    }}
                    className="ml-3 text-indigo-500 text-sm font-medium hover:text-indigo-400"
                  >
                    Login with OTP
                  </a>
                </div>
                <div>
                  <a
                    href="#"
                    onClick={() => {
                      handleForgotPasswordClick();
                    }}
                    className="text-indigo-500 text-sm font-medium hover:text-indigo-400"
                  >
                    Forgot Password?
                  </a>
                </div>
              </div>
              <div className="mt-10 mb-10  text-center">
                <button
                  type="submit"
                  className="relative inline-flex items-center justify-center h-[35px] w-full
              lg:h-[35px] lg:w-[120px]  p-4 px-6 py-6 overflow-hidden font-normal lg:font-medium text-gray-300 transition duration-300 ease-out border-0 border-[#1565c0] rounded-full  group"
                >
                  <span className="absolute inset-0 flex items-center justify-center w-full h-full text-gray-300 duration-300 -translate-x-full bg-[#1565c0]  group-hover:translate-x-0 ease">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </span>
                  <span className="absolute flex items-center justify-center w-full h-full font-normal text-base2 text-gray-300 bg-[#1565c0]  transition-all duration-300 transform group-hover:translate-x-full ease">
                    LOGIN
                  </span>
                  <span className="relative invisible">Login</span>
                </button>
              </div>
              <div className="pb-1 flex justify-center text-sm text-gray-300 items-center">
                <div>
                  Not registered yet?
                  <Link
                    href="/register"
                    className="text-indigo-600 font-medium mx-2 hover:text-indigo-500"
                  >
                    Register Here
                  </Link>
                </div>
              </div>
            </form>
          )}

          {/* login with otp  */}
          {pageState === 'otpLogin' && (
            <form onSubmit={handleLoginWithOtpSubmit}>
              <div className="flex flex-col">
                {/* phone number field  */}

                {otpSent ? (
                  ''
                ) : (
                  <div className="w-full mx-2 flex-1">
                    <div className="font-bold h-6 mt-3 text-gray-300 text-xs leading-8 uppercase">
                      Phone Number
                    </div>
                    <div className=" my-2 py-1 flex ">
                      <input
                        onChange={handleInput}
                        value={LoginForm.phoneNumber || ''}
                        name="phoneNumber"
                        placeholder="Phone Number"
                        className="py-1    w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
                        type="text"
                        required
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                )}

                {/* otp  */}
                {otpSent ? (
                  <div className="w-full mx-2 flex-1">
                    <div className="font-bold h-6 mt-3 text-gray-300 text-xs leading-8 uppercase ">
                      OTP
                    </div>
                    <div className=" my-2 py-1 flex ">
                      <input
                        onChange={handleInput}
                        value={LoginForm.otp || ''}
                        name="otp"
                        placeholder="OTP"
                        className="py-1    w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
                        type="otp"
                        required
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>

              {/* links  */}
              <div className="mt-2 flex justify-between items-center text-gray-300">
                <div>
                  <a
                    href="#"
                    onClick={() => {
                      handleLoginWithPasswordClick();
                    }}
                    className="ml-3 text-indigo-500 text-sm font-medium hover:text-indigo-400"
                  >
                    Login with Password
                  </a>
                </div>
                <div></div>
              </div>

              {/* send otp button  */}

              {otpSent ? (
                <div className="flex justify-center items-center">
                  <div className="flex justify-center items-center text-gray-300 mt-5 p-3   rounded-xl">
                    Time left: {Math.floor(otpTimer / 60)}:
                    {(otpTimer % 60).toLocaleString('en-US', {
                      minimumIntegerDigits: 2,
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <button
                    className=" my-5 p-3 bg-[#1565c0]  rounded-xl w-28 "
                    onClick={handleSendOtp}
                  >
                    Send OTP
                  </button>
                </div>
              )}
              {/* submit button section  */}
              {otpSent ? (
                <div className="mt-5 mb-10  text-center">
                  <button
                    type="submit"
                    className="relative inline-flex items-center justify-center h-[35px] w-full
              lg:h-[35px] lg:w-[120px]  p-4 px-6 py-6 overflow-hidden font-normal lg:font-medium text-gray-300 transition duration-300 ease-out border-0 border-[#1565c0] rounded-full  group"
                  >
                    <span className="absolute inset-0 flex items-center justify-center w-full h-full text-gray-300 duration-300 -translate-x-full bg-[#1565c0]  group-hover:translate-x-0 ease">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        ></path>
                      </svg>
                    </span>
                    <span className="absolute flex items-center justify-center w-full h-full font-normal text-base2 text-gray-300 bg-[#1565c0]  transition-all duration-300 transform group-hover:translate-x-full ease">
                      LOGIN
                    </span>
                    <span className="relative invisible">Login</span>
                  </button>
                </div>
              ) : (
                <div className="my-5"></div>
              )}
              <div className="pb-1 flex justify-center text-sm text-gray-300 items-center">
                <div>
                  Not registered yet?
                  <Link
                    href="/register"
                    className="text-indigo-600 font-medium mx-2 hover:text-indigo-500"
                  >
                    Register Here
                  </Link>
                </div>
              </div>
            </form>
          )}
        </div>
      </motion.div>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default login;
