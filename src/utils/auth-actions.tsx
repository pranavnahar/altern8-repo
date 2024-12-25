'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getAuthToken() {
  const cookieStore = cookies();
  let authCookie = cookieStore.get('altern8_useraccess');

  if (!authCookie) {
    const refreshToken = cookieStore.get('altern8_userrefresh');
    if (refreshToken) {
      const newToken = await refreshAccessToken(refreshToken?.value);
      if (newToken) {
        cookieStore.set('altern8_useraccess', newToken, {
          maxAge: 5 * 24 * 60 * 60,
          path: '/',
          httpOnly: true,
          sameSite: 'lax'
        });
        authCookie = { name: 'altern8_useraccess', value: newToken };
      }
    }
  }

  if (!authCookie) {
    return;
  }

  let isValid = await validateToken(authCookie.value);

  if (!isValid) {
    const refreshToken = cookieStore.get('altern8_userrefresh');
    if (refreshToken) {
      const newToken = await refreshAccessToken(refreshToken?.value);
      if (newToken) {
        isValid = await validateToken(newToken);
        if (isValid) {
          cookieStore.set('altern8_useraccess', newToken, {
            maxAge: 5 * 24 * 60 * 60,
            path: '/',
            httpOnly: true,
            sameSite: 'lax'
          });
          authCookie = { name: 'altern8_useraccess', value: newToken };
        }
      }
    } else {
      redirect('/login');
      return;
    }
  }

  return authCookie?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('altern8_userrefresh');
  return refreshToken?.value;
}

export async function removeAuthCookies() {
  const cookieStore = cookies();
  cookieStore.delete('altern8_useraccess');
  cookieStore.delete('altern8_userrefresh');
}

async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.SERVER_URL}/user-api/validate-token/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.ok;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
}

export async function checkAuthentication() {
  try {
    await getAuthToken();
    return { isAuthenticated: true };
  } catch {
    return { isAuthenticated: false };
  }
}

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = cookies();

  cookieStore.set('altern8_useraccess', accessToken, {
    maxAge: 5 * 24 * 60 * 60,
    path: '/',
    httpOnly: true,
    sameSite: 'lax'
  });

  cookieStore.set('altern8_userrefresh', refreshToken, {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    httpOnly: true,
    sameSite: 'lax'
  });
}

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch(`${process.env.SERVER_URL}/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.access;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
  return null;
}

export async function checkAuthServer() {
  const cookieStore = cookies();
  let accessToken = cookieStore.get('altern8_useraccess');
  const refreshToken = cookieStore.get('altern8_userrefresh');

  if (!refreshToken) {
    return false;
  }

  if (!accessToken && refreshToken) {
    const newAccessToken = await refreshAccessToken(refreshToken.value);
    if (newAccessToken) {
      cookieStore.set('altern8_useraccess', newAccessToken, {
        maxAge: 5 * 24 * 60 * 60,
        path: '/',
        httpOnly: true,
        sameSite: 'lax'
      });
      accessToken = { name: 'altern8_useraccess', value: newAccessToken };
    } else {
      return false;
    }
  }

  return !!(accessToken && refreshToken);
}


//redirect for ONLY dashboard component as getAuthToken was causing isues on main landing page it was automactilly redirecting to login on page laod.

export async function getAuthTokenWithoutRedirect() {
  const cookieStore = cookies();
  let authCookie = cookieStore.get('altern8_useraccess');

  if (!authCookie) {
    const refreshToken = cookieStore.get('altern8_userrefresh');
    if (refreshToken) {
      const newToken = await refreshAccessToken(refreshToken.value);
      if (newToken) {
        authCookie = { name: 'altern8_useraccess', value: newToken };
      }
    }
  }

  if (!authCookie) return null; // No redirect, return null instead.

  const isValid = await validateToken(authCookie.value);

  if (!isValid) {
    const refreshToken = cookieStore.get('altern8_userrefresh');
    if (refreshToken) {
      const newToken = await refreshAccessToken(refreshToken.value);
      if (newToken) {
        const isValid = await validateToken(newToken);
        if (isValid) {
          return newToken; // Return new token if valid.
        }
      }
    }
    return null; // Return null if no valid token.
  }

  return authCookie.value; // Return the token if valid.
}

export async function getDynamicRedirectUrl() {
  const token = await getAuthTokenWithoutRedirect();
  return token ? "/dashboard" : "/register";
}



//Registration step separate auth token logic as getAuthToekn was redirecting...
//even new users who visit register page for first time to login page
export async function getRegistrationAuthToken() {
  const cookieStore = cookies();
  let authCookie = cookieStore.get('altern8_useraccess');

  if (!authCookie) {
    const refreshToken = cookieStore.get('altern8_userrefresh');
    if (refreshToken) {
      const newToken = await refreshAccessToken(refreshToken.value);
      if (newToken) {
        authCookie = { name: 'altern8_useraccess', value: newToken };
      }
    }
  }

  return authCookie?.value || null;
}