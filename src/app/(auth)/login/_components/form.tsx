'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { loginWithOtp, loginWithPassword } from '../actions'
import OtpLoginForm from './otp-form'
import AnimatedLogo from '@/components/Header/AnimatedLogo'
import PasswordLoginForm from './password-form'

const Login = () => {
  const [pageState, setPageState] = useState('login')

  return (
    <div className="w-96 rounded-xl font-roboto text-gray-300 m-5 bg-gradient-to-br from-[#021457] via-[#19112f] to-[#6e3050]">
      <div className="mx-3 p-5 sm:p-6">
        <div className="self-center text-5xl pt-5 pb-16 sm:text-10xl text-center lg:text-20xl text-gray-300 font-exo letter-spacing-2 flex justify-center items-center">
          <AnimatedLogo />
        </div>

        {pageState === 'login' ? (
          <PasswordLoginForm
            action={pageState === 'login' ? loginWithPassword : loginWithOtp}
            onSwitchToOtp={() => setPageState('otpLogin')}
          />
        ) : (
          <OtpLoginForm onSwitchToPassword={() => setPageState('login')} />
        )}

        <div className="pb-1 flex justify-center text-sm text-gray-300 items-center">
          <div>
            Not registered yet?
            <Link href="/register" className="text-indigo-600 font-medium mx-2 hover:text-indigo-500">
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

