'use client'

import React, { useState, useEffect } from 'react'
//@ts-ignore
import { useFormState } from 'react-dom'
import { motion } from 'framer-motion'
import { changePassword } from '../actions'
import { useToast } from '@/utils/show-toasts'
import { IconChevronRight } from '@tabler/icons-react'

const PasswordReset = () => {
  const [resetPassword, setResetPassword] = useState({
    resetPassword1: '',
    resetPassword2: '',
  })
  const [password1Visible, setPassword1Visible] = useState(false)
  const [password2Visible, setPassword2Visible] = useState(false)
  const { showToast } = useToast()

  const [state, formAction] = useFormState(changePassword, { success: false, message: '' })

  const handleInputPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setResetPassword((prev) => ({ ...prev, [name]: value }))
  }

  const handleShowPassword1 = () => setPassword1Visible(!password1Visible)
  const handleShowPassword2 = () => setPassword2Visible(!password2Visible)

  useEffect(() => {
    if (state.success) {
      showToast({
        message: state.message,
        type: "success"
      })
    } else if (state.message) {
      showToast({
        message: state.message,
        type: "error"
      })
    }
  }, [state, showToast])

  return (
    <form action={formAction}>
      <div className="flex-1 w-full mx-2">
        <div className="h-6 mt-3 text-sm font-medium leading-8 text-gray-300">
          Password
        </div>
        <div className="relative py-1 my-2">
          <input
            onChange={handleInputPassword}
            value={resetPassword.resetPassword1}
            name="resetPassword1"
            className="w-full py-1 text-gray-100 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
            type={password1Visible ? 'text' : 'password'}
            required
          />
          <button
            type="button"
            onClick={handleShowPassword1}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 cursor-pointer"
          >
            {password1Visible ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div className="flex-1 w-full mx-2">
        <div className="h-6 mt-3 text-sm font-medium leading-8 text-gray-300">
          Re-enter Password
        </div>
        <div className="relative py-1 my-2">
          <input
            onChange={handleInputPassword}
            value={resetPassword.resetPassword2}
            name="resetPassword2"
            className="w-full py-1 text-gray-100 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
            type={password2Visible ? 'text' : 'password'}
            required
          />
          <button
            type="button"
            onClick={handleShowPassword2}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 cursor-pointer"
          >
            {password2Visible ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div className="mx-2 text-sm text-gray-400">
        Password must be at least 8 characters long and contain at least one letter, one
        digit, and one special character.
      </div>

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
    </form>
  )
}

export default PasswordReset
