import React, { useState } from 'react'
import Link from 'next/link'
import FormInput from './form-input'
import { IconChevronRight, IconEye, IconEyeOff } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

interface Props {
  formAction: (formData: FormData) => void
  onSwitchToOtp: () => void
}

const PasswordLoginForm = ({ formAction, onSwitchToOtp }: Props) => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false)
  return (
    <form action={formAction}>
      <div className="flex flex-col">
        <FormInput
          name="phoneNumber"
          placeholder="Phone Number"
          type="text"
          required
          label="Phone Number"
        />
        <div className="w-full mx-2 flex-1">
      <div className="font-bold h-6 mt-3 text-gray-300 text-xs leading-8 uppercase">
        Password
      </div>
      <div className="relative">
        <input
          name="password"
          placeholder="Password"
          className="py-1 w-full text-gray-100 border-b-2 bg-transparent outline-none focus:border-purple-600 transition-colors"
          type={passwordVisible ? 'text' : 'password'}
          required
        />
        <button
          type="button"
          onClick={() => setPasswordVisible(!passwordVisible)}
          className="absolute inset-y-0 right-0 flex items-center px-2"
        >
          {passwordVisible ? <IconEyeOff /> : <IconEye />}
        </button>
      </div>
    </div>
      </div>

      <div className="mt-2 flex justify-between items-center text-gray-300">
        <button
          type="button"
          onClick={onSwitchToOtp}
          className="text-indigo-500 text-sm font-medium hover:text-indigo-400"
        >
          Login with OTP
        </button>
        <Link href="/reset-password" className="text-indigo-500 text-sm font-medium hover:text-indigo-400">
          Forgot Password?
        </Link>
      </div>

      <div className="mt-10 mb-10 text-center">
        <Button
          type="submit"
          variant="expandIcon"
          Icon={IconChevronRight}
          iconPlacement='right'
          size="default"
          className='text-sm'
        >
          Login
        </Button>
      </div>
    </form>
  )
}

export default PasswordLoginForm
