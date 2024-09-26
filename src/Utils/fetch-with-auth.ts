import { getAccessToken } from "./auth";
import { parseCookies } from "nookies";
import { GetServerSidePropsContext } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

export const fetchWithAuthSSR = async (
  url: string,
  ctx: GetServerSidePropsContext,
  options: FetchOptions = {}
) => {
  const cookies = parseCookies(ctx);
  let accessToken = cookies.accessToken;

  let response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    const token = await getAccessToken();

    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    } else {
      accessToken = token;
    }

    response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return response;
};

export const fetchWithAuth = async (
  url: string,
  options: FetchOptions = {}
) => {
  let accessToken = parseCookies().accessToken;

  let response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    const token = await getAccessToken();

    if (!token) {
      window.location.href = "/login";
      return;
    } else {
      accessToken = token;
    }

    response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return response;
};
