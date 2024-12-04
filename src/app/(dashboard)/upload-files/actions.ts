'use server'

import { getAuthToken } from '@/utils/auth-actions'

export async function fetchDocuments() {
  const accessToken = await getAuthToken()

  const response = await fetch(`${process.env.SERVER_URL}/user-dashboard-api/other-document/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await response.json()
  return data.data || []
}

export async function uploadDocument(formData: FormData) {
  const accessToken = await getAuthToken()

  const response = await fetch(`${process.env.SERVER_URL}/user-dashboard-api/other-document/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  })

  return await response.json()
}
