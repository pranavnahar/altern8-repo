import React from 'react'
import Link from 'next/link'
import AnimatedLogo from '@/components/Header/AnimatedLogo'
import OtpForm from './_components/otp-form'
import PasswordReset from './_components/password-reset'

const Page = () => {
  return (
    <div className="flex justify-center items-center w-full min-h-screen [background:linear-gradient(269.75deg,_#011049,_#19112f_25.75%,_#251431_51.79%,_#301941_64.24%,_#6e3050)]">
      <div className="w-96 mt-5 rounded-xl font-roboto text-gray-300 [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212]">
        <div className="p-5 mx-3 sm:p-6">
          <div className="flex justify-center items-center pt-5 pb-6 text-5xl text-center text-gray-300 font-exo sm:text-10xl lg:text-20xl letter-spacing-2">
            <AnimatedLogo />
          </div>

          <OtpForm />
          <PasswordReset />

          <div className="flex items-center justify-center mt-2 text-gray-300">
            <Link
              href="/login"
              className="ml-3 text-sm font-semibold text-indigo-500 hover:text-indigo-400"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
