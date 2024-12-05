'use client'

import React, { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import FormInput from './form-input'
import { handleOtpLogin } from '../actions'
import { useToast } from '@/utils/show-toasts'

interface Props {
  onSwitchToPassword: () => void
}

const OtpLoginForm = ({ onSwitchToPassword }: Props) => {
  const [state, formAction] = useFormState(handleOtpLogin, null)
  const [otpSent, setOtpSent] = useState<boolean>(false)
  const [otpTimer, setOtpTimer] = useState<number>(60)
  const { showToast } = useToast()

  useEffect(() => {
    if (state?.success && !state?.message) {
    } else if (state?.success && state?.message === 'OTP sent successfully') {
      setOtpSent(true);
      startOtpTimer();
      showToast({
        message: "OTP sent successfully",
        type: "success"
      })
    }
  }, [state])

  const startOtpTimer = () => {
    setOtpTimer(60)
    const interval = setInterval(() => {
      setOtpTimer((prevTimer) => {
        if (prevTimer === 1) {
          clearInterval(interval)
          setOtpSent(false)
          return 0
        }
        return prevTimer - 1
      })
    }, 1000)
  }

  return (
    <form action={formAction}>
      <div className="flex flex-col">
        {!otpSent && (
          <FormInput
            name="phoneNumber"
            placeholder="Phone Number"
            type="text"
            required
            label="Phone Number"
          />
        )}

        {otpSent && (
          <FormInput
            name="otp"
            placeholder="OTP"
            type="text"
            required
            label="OTP"
          />
        )}
      </div>

      <div className="mt-2 flex justify-between items-center text-gray-300">
        <button
          type="button"
          onClick={onSwitchToPassword}
          className="text-indigo-500 text-sm font-medium hover:text-indigo-400"
        >
          Login with Password
        </button>
      </div>

      {otpSent ? (
        <div className="flex justify-center items-center">
          <div className="flex justify-center items-center text-gray-300 mt-5 p-3 rounded-xl">
            Time left: {Math.floor(otpTimer / 60)}:
            {(otpTimer % 60).toLocaleString('en-US', {
              minimumIntegerDigits: 2,
            })}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <button type="submit" className="my-5 p-3 bg-[#1565c0] rounded-xl w-28">
            Send OTP
          </button>
        </div>
      )}

      {otpSent && (
        <button
          type="submit"
          className="relative inline-flex items-center justify-center h-[35px] w-full lg:w-[120px] p-4 px-6 py-6 overflow-hidden font-normal lg:font-medium text-gray-300 transition duration-300 ease-out border-0 border-[#1565c0] rounded-full group"
        >
          <span className="absolute inset-0 flex items-center justify-center w-full h-full text-gray-300 duration-300 -translate-x-full bg-[#1565c0] group-hover:translate-x-0 ease">
            {/* Add your arrow SVG here */}
          </span>
          <span className="absolute flex items-center justify-center w-full h-full font-normal text-base2 text-gray-300 bg-[#1565c0] transition-all duration-300 transform group-hover:translate-x-full ease">
            LOGIN
          </span>
          <span className="relative invisible">Login</span>
        </button>
      )}

      {state?.error && (
        <div className="mt-4 text-red-500 text-center">{state.error}</div>
      )}
    </form>
  )
}

export default OtpLoginForm

