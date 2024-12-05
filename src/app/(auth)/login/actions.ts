'use server'

import { cookies } from 'next/headers'

export async function loginWithPassword(prevState: any, formData: FormData) {
  const phoneNumber = formData.get('phoneNumber') as string
  const password = formData.get('password') as string

  if (!validatePhoneNumber(phoneNumber)) {
    return { success: false, message: 'Phone number must be a 10-digit number' }
  }

  if (!validatePassword(password)) {
    return { success: false, message: 'Password must be at least 8 characters' }
  }

  try {
    const response = await fetch(`${process.env.SERVER_URL}/user-api/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone_number: phoneNumber, password: password }),
    })

    if (response.ok) {
      const data = await response.json()
      cookies().set('altern8_useraccess', data.access, { httpOnly: true, secure: true })
      cookies().set('altern8_userrefresh', data.refresh, { httpOnly: true, secure: true })
      return { success: true, message: "You are logged in" }
    } else {
      return { success: false, message: 'Invalid credentials' }
    }
  } catch (error) {
    return { success: false, message: 'Login failed, system error' }
  }
}

export async function loginWithOtp(prevState: any, formData: FormData) {
  const phoneNumber = formData.get('phoneNumber') as string
  const otp = formData.get('otp') as string

  if (!validatePhoneNumber(phoneNumber)) {
    return { success: false, message: 'Phone number must be a 10-digit number' }
  }

  try {
    const response = await fetch(`${process.env.SERVER_URL}/user-api/verify-otp/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone_number: phoneNumber, otp_code: otp }),
    })

    if (response.ok) {
      const data = await response.json()
      cookies().set('altern8_useraccess', data.access, { httpOnly: true, secure: true })
      cookies().set('altern8_userrefresh', data.refresh, { httpOnly: true, secure: true })
      return { success: true, message: "You are logged in" }
    } else {
      const serverError = await response.json()
      return { success: false, message: `Invalid credentials, ${serverError.message}` }
    }
  } catch (error) {
    return { success: false, message: 'Login failed, system error' }
  }
}

export async function sendOtp(phoneNumber: string) {
  if (!validatePhoneNumber(phoneNumber)) {
    return { error: 'Phone number must be a 10-digit number' }
  }

  try {
    const response = await fetch(`${process.env.SERVER_URL}/user-api/generate-otp/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone_number: phoneNumber }),
    })

    if (response.ok) {
      return { success: true }
    } else {
      const serverError = await response.json()
      return { error: `Failed to send OTP, ${serverError.message}` }
    }
  } catch (error) {
    return { error: 'Failed to send OTP, system error' }
  }
}

export async function handleOtpLogin(prevState: any, formData: FormData) {
  const phoneNumber = formData.get('phoneNumber') as string
  const otp = formData.get('otp') as string

  if (!phoneNumber && !otp) {
    return { error: 'Phone number or OTP is missing' }
  }

  if (otp) {
    try {
      const response = await fetch(`${process.env.SERVER_URL}/user-api/verify-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone_number: phoneNumber, otp_code: otp }),
      })

      if (response.ok) {
        const data = await response.json()
        cookies().set('altern8_useraccess', data.access, { httpOnly: true, secure: true })
        cookies().set('altern8_userrefresh', data.refresh, { httpOnly: true, secure: true })
        return { success: true }
      } else {
        const serverError = await response.json()
        return { error: `Invalid credentials, ${serverError.message}` }
      }
    } catch (error) {
      return { error: 'Login failed, system error' }
    }
  } else {
    try {
      const response = await fetch(`${process.env.SERVER_URL}/user-api/generate-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone_number: phoneNumber }),
      })

      if (response.ok) {
        return { success: true, message: 'OTP sent successfully' }
      } else {
        const serverError = await response.json()
        return { error: `Failed to send OTP, ${serverError.message}` }
      }
    } catch (error) {
      return { error: 'Failed to send OTP, system error' }
    }
  }
}

function validatePhoneNumber(phoneNumber: string) {
  const phoneRegex = /^\d{10}$/
  return phoneRegex.test(phoneNumber.trim())
}

function validatePassword(password: string) {
  return password.trim().length >= 8
}

