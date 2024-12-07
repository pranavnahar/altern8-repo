'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
//@ts-ignore
import { useFormState, useFormStatus } from 'react-dom'
import FormInput from './form-input'
import { IconChevronRight, IconEye, IconEyeOff, IconLoader } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/utils/show-toasts'
import { useRouter } from 'next/navigation'
import { getBorrowerState } from '../actions'

interface Props {
  action: (prevState: any, formData: FormData) => Promise<any>
  onSwitchToOtp: () => void
}

const SubmitButton = ({ isSubmitted }: { isSubmitted: boolean }) => {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      size="default"
      variant="expandIcon"
      iconPlacement="right"
      Icon={pending || isSubmitted ? IconLoader : IconChevronRight}
      className="w-full font-normal tracking-tight"
      disabled={pending || isSubmitted}
    >
      {pending ? 'Logging In...' : isSubmitted ? 'Logged In' : 'Log In'}
    </Button>
  )
}

const PasswordLoginForm = ({ action, onSwitchToOtp }: Props) => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [state, formAction] = useFormState(action, null);
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      setIsSubmitted(true);
      showToast({
        message: state.message,
        type: "success"
      });
      checkBorrowerState();
    } else if (state?.message) {
      showToast({
        message: state.message,
        type: "error"
      });
    }
  }, [state, router, showToast]);

  const checkBorrowerState = async () => {
    const result = await getBorrowerState();

    if (result.success) {
      switch (result.sellerState) {
        case 'Approved':
          router.push('/dashboard');
          break;
        case 'Pending':
          router.push('/register');
          break;
        case 'Rejected':
          router.push('/rejected');
          break;
        case 'Incomplete':
          router.push('/register');
          break;
        default:
          router.push('/register');
          break;
      }
    } else {
      router.push('/register')
    }
  };

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

      <div className='py-5'>
        <SubmitButton isSubmitted={isSubmitted} />
      </div>
    </form>
  )
}

export default PasswordLoginForm

