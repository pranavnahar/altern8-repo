'use server'

import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'
import { redirect } from 'next/navigation'

const apiUrl = process.env.NEXT_PUBLIC_API_URL
const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL

export type ActionState =
  | { status: 'success'; message: string }
  | { status: 'error'; message: string }
  | null

export async function getAccessToken() {
  const cookieStore = cookies()
  return cookieStore.get('altern8_useraccess')?.value
}

export async function getUserId() {
  const token = await getAccessToken()
  if (!token) {
    redirect('/login')
  }
  const decodedToken: { uid: string } = jwtDecode(token)
  return decodedToken.uid
}

export async function getReferralLink(): Promise<{ referralLink: string }> {
  const userId = await getUserId()
  return { referralLink: `${frontendUrl}/register?referal_code=${userId}` }
}

export async function sendInvite(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = formData.get('email') as string
  if (!validateEmail(email)) {
    return { status: 'error', message: 'Invalid email address' }
  }

  const userId = await getUserId()
  const referralLink = `${frontendUrl}/register?referal_code=${userId}`

  console.log("sending this as the data: ", userId, referralLink)

  try {
    const response = await fetch(`${apiUrl}/user-dashboard-api/referral-email/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await getAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.trim(), link: referralLink }),
    })

    console.log("teh reponse for sending thr invite is this: ", response)

    if (!response.ok) {
      throw new Error('Failed to send invitation')
    }

    return { status: 'success', message: 'Invitation email sent!' }
  } catch (error) {
    return { status: 'error', message: 'Failed to send invitation' }
  }
}

export async function uploadBulkInvites(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const file = formData.get('file') as File
  if (!file) {
    return { status: 'error', message: 'No file selected' }
  }

  const userId = await getUserId()
  const referralLink = `${frontendUrl}/register?referal_code=${userId}`

  const uploadFormData = new FormData()
  uploadFormData.append('file', file)
  uploadFormData.append('link', referralLink)

  try {
    const response = await fetch(`${apiUrl}/user-dashboard-api/referral-email-bulk/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await getAccessToken()}`,
      },
      body: uploadFormData,
    })

    if (!response.ok) {
      throw new Error('Failed to send bulk emails')
    }

    console.log("the email invitation was sent successfully")

    return { status: 'success', message: 'Bulk emails sent successfully!' }
  } catch (error) {
    return { status: 'error', message: 'Error sending bulk emails' }
  }
}

function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  return emailRegex.test(email.trim())
}
