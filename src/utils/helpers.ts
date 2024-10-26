'use server'

import { cookies } from 'next/headers';

export async function getAuthToken() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('altern8_useraccess');
  if (!authCookie) {
    throw new Error('Not authenticated');
  }
  return authCookie.value;
}

export async function checkAuthentication() {
  try {
    await getAuthToken();
    return { isAuthenticated: true };
  } catch {
    return { isAuthenticated: false };
  }
}
