'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { parseCookies } from 'nookies';
import LinearBuffer from '../../../components/LinearBuffer';
import AnimatedLogo from '../../../components/Header/AnimatedLogo';
import { useToast } from '../../../utils/show-toasts';
import { setAccessTokenCookie, setRefreshTokenCookie } from '../../../utils/auth';
let accessToken = parseCookies().altern8_useraccess;

const page = () => {
  const [otpForm, setOtpForm] = useState({
    phoneNumber: '',
    otp: '',
  });
  const [resetPassword, setResetPassword] = useState({
    phoneNumber: '',
    otp: '',
    resetPassword1: '',
    resetPassword2: '',
  });
  const [password1Visible, setPassword1Visible] = useState(false);
  const [password2Visible, setPassword2Visible] = useState(false);
  const [showResetPasswordPage, setShowResetPasswordPage] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // handle form input for phone number and otp
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setOtpForm({ ...otpForm, [name]: value });
  };

  // handle form input for reset password
  const handleInputPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setResetPassword({ ...resetPassword, [name]: value });
  };

  // validations
  const validatePhoneNumber = (phoneNumber: string) => {
    phoneNumber = phoneNumber.trim();
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const validatePassword = (password: string) => {
    password = password.trim();
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#:])[A-Za-z\d@$!%*?&#:]{8,}$/;
    const isValidPassword = passwordRegex.test(password);
    if (isValidPassword) {
      return true;
    } else {
      return false;
    }
  };

  // handle submit otp
  const handleSubmitOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otpSent) {
      if (!validatePhoneNumber(otpForm.phoneNumber)) {
        showToast({
          message: `Phone number must be a 10-digit number`,
          type: 'error'
        });
        return;
      }

      let newRecord = {
        phone_number: otpForm.phoneNumber.trim(),
        otp_code: otpForm.otp.trim(),
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

          // Set the access token in a cookie
          setAccessTokenCookie(data.access);
          setRefreshTokenCookie(data.refresh);

          // update accessToken variable
          accessToken = data.access;

          console.log('otp verified successfully', accessToken);
          setShowResetPasswordPage(true);
        } else {
          let server_error = await response.json();
          showToast({
            message: `OTP verification failed, ${server_error.message}`,
            type: 'info'
          });
        }
      } catch (error) {
        showToast({
          message: `OTP verification failed, system error`,
          type: 'info'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // handle submit password
  const handleSubmitPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (resetPassword.resetPassword1.trim() !== resetPassword.resetPassword2.trim()) {
      showToast({
        message: `Both password should match`,
        type: 'info'
      });
      return;
    } else if (!validatePassword(resetPassword.resetPassword1)) {
      showToast({
        message: `Password must be at least 8 characters long and contain at least one letter, one digit, and one special character.`,
        type: 'info',
      });
      return;
    }

    // trim the fields before send
    let newRecord = {
      new_password: resetPassword.resetPassword1.trim(),
      reenter_new_password: resetPassword.resetPassword1.trim(),
    };

    try {
      setLoading(true);
      let body = newRecord;
      console.log(body);
      const response = await fetch(`${apiUrl}/user-api/change-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await response.json();
        console.log('password changed successfully');
        router.push('/login');
      } else {
        let server_error = await response.json();
        showToast({
          message: `Password change failed, ${server_error.message}`,
          type: 'info'
        });
      }
    } catch (error) {
      showToast({
        message: `Password change failed, system error`,
        type: 'info'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithPasswordClick = () => {
    router.push('/login');
  };

  const handleSendOtp = async () => {
    if (!validatePhoneNumber(otpForm.phoneNumber)) {
      showToast({
        message: `Phone number must be a 10-digit number`,
        type: 'info'
      });
      return;
    }

    let newRecord = {
      phone_number: otpForm.phoneNumber.trim(),
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

        console.log('otp sent, get success');
        setOtpSent(true);

        otpForm.otp = '';
      } else {
        let server_error = await response.json();
        otpForm.otp = '';
        showToast({
          message: `${server_error.message} `,
          type: 'error'
        });
      }
    } catch (error) {
      showToast({
        message: `Failed to send otp, system error`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
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

  const handleShowPassword1 = () => {
    setPassword1Visible(!password1Visible);
  };

  const handleShowPassword2 = () => {
    setPassword2Visible(!password2Visible);
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
        className="w-96 mt-5 rounded-xl font-roboto text-gray-300
        [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212]"
      >
        <div className="mx-5 my-5 rounded-lg">
          {/* Show LinearProgress when loading is true */}
          {loading && <LinearBuffer />}
        </div>
        <div className="p-5 mx-3 sm:p-6">
          <div className="flex justify-center items-center pt-5 pb-6 text-5xl text-center text-gray-300 font-exo sm:text-10xl lg:text-20xl letter-spacing-2">
            <AnimatedLogo />
          </div>

          <div className="pb-10 font-medium text-center text-gray-400 underline">
            Password Reset
          </div>

          {/* forgot password, password reset  */}

          {/* before otp submission  */}
          {!showResetPasswordPage && (
            <form onSubmit={handleSubmitOtp} className="">
              <div className="flex flex-col">
                {/* phone number field  */}

                {!otpSent && (
                  // phone number field
                  <div className="flex-1 w-full mx-2">
                    <div className="h-6 mt-3 text-xs font-bold leading-8 text-gray-300 uppercase">
                      Phone Number
                    </div>
                    <div className="flex py-1 my-2 ">
                      <input
                        onChange={handleInput}
                        value={otpForm.phoneNumber || ''}
                        name="phoneNumber"
                        placeholder="Phone Number"
                        className="w-full py-1 text-gray-100 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
                        type="text"
                        required
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                )}

                {/* otp  */}
                {otpSent && (
                  // otp field
                  <div className="flex-1 w-full mx-2">
                    <div className="h-6 mt-3 text-xs font-bold leading-8 text-gray-300 uppercase ">
                      OTP
                    </div>
                    <div className="flex py-1 my-2 ">
                      <input
                        onChange={handleInput}
                        value={otpForm.otp || ''}
                        name="otp"
                        placeholder="OTP"
                        className="w-full py-1 text-gray-100 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
                        type="text"
                        required
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-2 text-gray-300">
                <div></div>
                <div>
                  <a
                    href="#"
                    onClick={() => {
                      handleLoginWithPasswordClick();
                    }}
                    className="ml-3 text-sm font-semibold text-indigo-500 hover:text-indigo-400"
                  >
                    Login
                  </a>
                </div>
              </div>
              {/* send otp button  */}

              {otpSent ? (
                <div className="flex items-center justify-center">
                  <div className="flex items-center justify-center p-3 mt-5 text-gray-300 rounded-xl">
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
                <div className="mt-5 mb-10 text-center">
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
                      Submit
                    </span>
                    <span className="relative invisible">Submit</span>
                  </button>
                </div>
              ) : (
                <div className="my-5"></div>
              )}
            </form>
          )}

          {/* after otp submission  */}
          {showResetPasswordPage && (
            <form onSubmit={handleSubmitPassword} className="">
              <div className="flex-1 w-full mx-2">
                <div className="h-6 mt-3 text-xs font-bold leading-8 text-gray-400 uppercase">
                  Password
                </div>
                <div className="relative py-1 my-2">
                  <input
                    onChange={handleInputPassword}
                    value={resetPassword['resetPassword1'] || ''}
                    name="resetPassword1"
                    placeholder="Password"
                    className="w-full py-1 text-gray-100 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
                    type={password1Visible ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                  />
                  {password1Visible && (
                    <svg
                      className="w-6 h-6 absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 cursor-pointer"
                      aria-hidden="true"
                      onClick={handleShowPassword1}
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

                  {!password1Visible && (
                    <svg
                      className="w-6 h-6 absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 cursor-pointer"
                      aria-hidden="true"
                      onClick={handleShowPassword1}
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
              {/* re enter password  */}
              <div className="flex-1 w-full mx-2">
                <div className="h-6 mt-3 text-xs font-bold leading-8 text-gray-400 uppercase">
                  Reenter Password
                </div>
                <div className="relative py-1 my-2">
                  <input
                    onChange={handleInputPassword}
                    value={resetPassword['resetPassword2'] || ''}
                    name="resetPassword2"
                    placeholder="Password"
                    className="w-full py-1 text-gray-100 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
                    type={password2Visible ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                  />
                  {password2Visible && (
                    <svg
                      className="w-6 h-6 absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 cursor-pointer"
                      aria-hidden="true"
                      onClick={handleShowPassword2}
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

                  {!password2Visible && (
                    <svg
                      className="w-6 h-6 absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 cursor-pointer"
                      aria-hidden="true"
                      onClick={handleShowPassword2}
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
              <div className="mx-2 text-sm text-gray-400">
                Password must be at least 8 characters long and contain at least one letter, one
                digit, and one special character.
              </div>

              {/* submit button section  */}
              <div className="mt-5 mb-10 text-center">
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
                    Submit
                  </span>
                  <span className="relative invisible">Submit</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default page;
