'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

async function getAccessToken() {
  const cookieStore = cookies()
  let accessToken = cookieStore.get('altern8_useraccess')?.value

  if (!accessToken) {
    redirect('/login')
  }

  return accessToken
}

export async function fetchDocuments() {
  const accessToken = await getAccessToken()

  const response = await fetch(`${apiUrl}/user-dashboard-api/other-document/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch documents')
  }

  const data = await response.json()
  return data.data || []
}

export async function uploadDocument(formData: FormData) {
  const accessToken = await getAccessToken()

  const response = await fetch(`${apiUrl}/user-dashboard-api/other-document/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload document')
  }

  return await response.json()
}
