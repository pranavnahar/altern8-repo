import { parseCookies, setCookie } from "nookies";

export const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
export const accessToken = parseCookies().altern8_useraccess;

interface Cookies {
  accessToken?: string;
  refreshToken?: string;
  [key: string]: string | undefined;
}

export const setAccessTokenCookie = (accessToken: string) => {
  setCookie(null, "altern8_useraccess", accessToken, {
    maxAge: 30 * 24 * 60 * 60, // Max age in seconds (e.g., 30 days)
    path: "/", // Path accessible across the entire site
    httpOnly: false, // HTTP only, cannot be accessed by JavaScript
  });
};

export const setRefreshTokenCookie = (refreshToken: string) => {
  setCookie(null, "altern8_userrefresh", refreshToken, {
    maxAge: 30 * 24 * 60 * 60, // Max age in seconds (e.g., 30 days)
    path: "/", // Path accessible across the entire site
    httpOnly: false, // HTTP only, cannot be accessed by JavaScript
  });
};

export const removeTokenCookie = () => {
  document.cookie = "altern8_useraccess=; Max-Age=0; path=/;";
  document.cookie = "altern8_userrefresh=; Max-Age=0; path=/;";
  document.cookie = "altern8_registeruseraccess=; Max-Age=0; path=/;";
};

// get new access token from a refresh token
export const getAccessToken = async () => {
  const cookies = parseCookies();
  const refreshToken = cookies.altern8_userrefresh

  let accessToken = "";
  const body = { refresh: refreshToken };

  const response = await fetch(`${apiUrl}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const responseData = await response.json();
  accessToken = responseData.access;
  if (accessToken) {
    setAccessTokenCookie(accessToken);
    return accessToken;
  }
  return false;
};

export const isAuthenticated = async (cookies: Cookies) => {
  const accessToken = cookies.altern8_useraccess;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!accessToken) {
    return false;
  }

  try {
    const response = await fetch(`${apiUrl}/user-api/validate-token/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
