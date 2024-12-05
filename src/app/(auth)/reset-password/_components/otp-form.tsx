'use client'

import React, { useState, useEffect, ChangeEvent } from 'react'
import { useFormState } from 'react-dom'
import { motion } from 'framer-motion'
import { useToast } from '@/utils/show-toasts'
import { generateOtp, verifyOtp } from '../actions'
import { IconChevronRight } from '@tabler/icons-react'

const OtpForm = () => {
  const [otpForm, setOtpForm] = useState({ phoneNumber: '', otp: '' })
  const [otpSent, setOtpSent] = useState<boolean>(false)
  const [otpTimer, setOtpTimer] = useState<number>(60)
  const [state, formAction] = useFormState(verifyOtp, { success: false, message: '' })
  const { showToast } = useToast()

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (otpSent) {
      setOtpTimer(60)

      intervalId = setInterval(() => {
        setOtpTimer((prevTimer) => {
          if (prevTimer === 1) {
            clearInterval(intervalId)
            setOtpSent(false)
            return 0
          }
          return prevTimer - 1
        })
      }, 1000)
    }

    return () => clearInterval(intervalId)
  }, [otpSent])

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setOtpForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSendOtp = async () => {
    const result = await generateOtp(otpForm.phoneNumber)
    if (result.success) {
      setOtpSent(true)
      setOtpForm((prev) => ({ ...prev, otp: '' }))
      showToast({
        message: result.message || `OTP sent successfully to ${otpForm.phoneNumber}`,
        type: "success"
      })
    } else {
      showToast({
        message: result.message || "Failed to send OTP, system error",
        type: "error"
      })
    }
  }

  return (
    <form action={formAction}>
      <div className="flex flex-col">
        {!otpSent && (
          <div className="flex-1 w-full mx-2">
            <div className="h-6 mt-3 text-sm font-medium leading-8 text-gray-300">
              Phone Number
            </div>
            <div className="flex py-1 my-2">
              <input
                onChange={handleInput}
                value={otpForm.phoneNumber}
                name="phoneNumber"
                className="w-full py-1 text-gray-100 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
                type="text"
                required
              />
            </div>
          </div>
        )}

        {otpSent && (
          <div className="flex-1 w-full mx-2">
            <div className="h-6 mt-3 text-xs font-bold leading-8 text-gray-300 uppercase">
              OTP
            </div>
            <div className="flex py-1 my-2">
              <input
                onChange={handleInput}
                value={otpForm.otp}
                name="otp"
                placeholder="OTP"
                className="w-full py-1 text-gray-100 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
                type="text"
                required
              />
            </div>
          </div>
        )}
      </div>

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
            type="button"
            className="my-5 p-3 bg-[#1565c0] rounded-xl w-28"
            onClick={handleSendOtp}
          >
            Send OTP
          </button>
        </div>
      )}

      {otpSent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-5 mb-10 text-center"
        >
          <button
            type="submit"
            className="relative inline-flex items-center justify-center h-[35px] w-full lg:h-[35px] lg:w-[120px] p-4 px-6 py-6 overflow-hidden font-normal lg:font-medium text-gray-300 transition duration-300 ease-out border-0 border-[#1565c0] rounded-full group"
          >
            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-gray-300 duration-300 -translate-x-full bg-[#1565c0] group-hover:translate-x-0 ease">
              <IconChevronRight />
            </span>
            <span className="absolute flex items-center justify-center w-full h-full font-normal text-base2 text-gray-300 bg-[#1565c0] transition-all duration-300 transform group-hover:translate-x-full ease">
              Submit
            </span>
            <span className="relative invisible">Submit</span>
          </button>
        </motion.div>
      )}
    </form>
  )
}

export default OtpForm

