"use client"

import { parseCookies } from "nookies";
import { getAccessToken } from "../../auth";
import axios from "axios";

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

let accessToken = parseCookies().altern8_useraccessAdmin;

const fetchWithAuth = async (url: string, options: FetchOptions = {}) => {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    const token = await getAccessToken();

    if (!token) {
      window.location.replace("/login");
    } else {
      accessToken = token;
    }

    return fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  return response;
};

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const token = await getAccessToken();
      if (token) {
        accessToken = token;
        axiosInstance.defaults.headers[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        return axiosInstance(error.config);
      }
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

export const getInvoiceIds = async () => {
  const response = await fetchWithAuth("/admin-api/ledger/get_invoice_ids/");
  if (!response.ok) throw new Error("Failed to fetch transactions");
  return response.json();
};

export const getTransactions = async () => {
  const response = await fetchWithAuth("/admin-api/ledger/transactions/");
  if (!response.ok) throw new Error("Failed to fetch transactions");
  return response.json();
};

export const getAccountTransactions = async (id: string) => {
  const response = await fetchWithAuth(`/admin-api/ledger/transactions/${id}`);
  if (!response.ok) throw new Error("Failed to fetch transactions");
  return response.json();
};

export const createTransactions = async (formData: FormData) => {
  try {
    const response = await fetchWithAuth("/admin-api/ledger/transactions/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      return response.json();
    } else {
      return false;
    }
  } catch (error) {
    return;
  }
};

export const approveTransactions = async (formData: FormData) => {
  try {
    const response = await fetchWithAuth(
      `/admin-api/ledger/transactions-approval/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    if (response.ok) {
      return response.json();
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const uploadBulkTransactions = async (
  formData: FormData,
  setUploadProgress?: (arg: number) => void
) => {
  try {
    const response = await axiosInstance.post(
      "/admin-api/ledger/upload-bulk-transactions/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            if (setUploadProgress) setUploadProgress(progress);
          }
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to upload transaction:", error);
    throw error;
  }
};

export const downloadBulkTransactions = async () => {
  try {
    const response = await fetchWithAuth(
      "/admin-api/ledger/upload-bulk-transactions/"
    );

    if (!response.ok) {
      throw new Error(`Failed to download template: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "bulk_transactions_template.xlsx");

    document.body.appendChild(link);
    link.click();
    link.parentNode!.removeChild(link);
  } catch (error) {
    console.error("Failed to download template:", error);
    throw error;
  }
};
