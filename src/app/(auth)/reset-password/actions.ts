'use server'

import { getAuthToken } from '@/utils/auth-actions'
import { cookies } from 'next/headers'

export async function generateOtp(phoneNumber: string) {
  try {
    const response = await fetch(`${process.env.SERVER_URL}/user-api/generate-otp/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone_number: phoneNumber.trim() }),
    })

    if (response.ok) {
      return { success: true, message: `OTP sent to ${phoneNumber}` }
    } else {
      const serverError = await response.json()
      return { success: false, message: serverError.message as string || 'Failed to send OTP, system error' }
    }
  } catch (error) {
    return { success: false, message: 'Failed to send OTP, system error' }
  }
}

export async function verifyOtp(prevState: any, formData: FormData) {
  const phoneNumber = formData.get('phoneNumber') as string
  const otp = formData.get('otp') as string
  try {
    const response = await fetch(`${process.env.SERVER_URL}/user-api/verify-otp/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone_number: phoneNumber.trim(), otp_code: otp.trim() }),
    })

    if (response.ok) {
      const data = await response.json()
      cookies().set('altern8_useraccess', data.access, { httpOnly: true, secure: true })
      cookies().set('altern8_userrefresh', data.refresh, { httpOnly: true, secure: true })
      return { success: true, message: "OTP verification successful" }
    } else {
      const serverError = await response.json()
      return { success: false, message: `OTP verification failed, ${serverError.message}` }
    }
  } catch (error) {
    return { success: false, message: 'OTP verification failed, system error' }
  }
}

export async function changePassword(prevState: any, formData: FormData) {
  const password = formData.get('resetPassword1') as string
  const reenterPassword = formData.get('resetPassword2') as string

  try {
    const token = await getAuthToken()
    const response = await fetch(`${process.env.SERVER_URL}/user-api/change-password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ new_password: password.trim(), reenter_new_password: reenterPassword.trim() }),
    })

    if (response.ok) {
      return { success: true, message: "Password changed successfully" }
    } else {
      const serverError = await response.json()
      return { success: false, message: `Password change failed, ${serverError.message}` }
    }
  } catch (error) {
    return { success: false, message: 'Password change failed, system error' }
  }
}

