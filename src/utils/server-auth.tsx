"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { parseCookies } from "nookies";
import { setAccessTokenCookie } from "./auth";

export async function getAuthToken() {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('altern8_useraccess')
  if (!accessToken) {
    redirect('/login')
  }
  return accessToken.value
}


export const getAccessToken = async () => {
  const cookies = parseCookies();
  const refreshToken = cookies.altern8_userrefresh;

  let accessToken = "";
  const body = { refresh: refreshToken };

  const response = await fetch(`${process.env.SERVER_URL}/token/refresh/`, {
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
