"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies"; // Fetch cookies
import { getAccessToken } from "../../utils/auth"; // Your token refresh logic

export const useGetGstList = () => {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [processedGstList, setProcessedGstList] = useState([]);
  const [unprocessedGstList, setUnprocessedGstList] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Access token from cookies
  let accessToken = parseCookies().altern8_useraccess;

  // Replace or refresh token logic
  const ReplaceTokenOrRedirect = async () => {
    const token = await getAccessToken();
    if (!token) {
      router.push("/login"); 
    } else {
      accessToken = token;
    }
  };

  const fetchData = async () => {
    try {
      if (!accessToken) {
        await ReplaceTokenOrRedirect();
      }

      let response = await fetch(`${apiUrl}/user-api/processed-unprocessed-gstins/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        // Handle token expiry
        await ReplaceTokenOrRedirect();
        response = await fetch(`${apiUrl}/user-api/processed-unprocessed-gstins/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message || "");
        setProcessedGstList(data.processed_gstins || []);
        setUnprocessedGstList(data.unprocessed_gstins || []);
      } else {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
    } catch (err: any) {
      console.error("Error fetching GST data:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // const getSigningUrl = async () => {
  //   try {
  //     if (!accessToken) {
  //       await ReplaceTokenOrRedirect();
  //     }

  //     const response = await fetch(`${apiUrl}/user-api/get-signing-url/`, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch signing URL: ${response.statusText}`);
  //     }

  //     const data = await response.json();
  //     console.log("Signing URL:", data.signing_url);
  //     return data.signing_url;
  //   } catch (error) {
  //     console.error("Error fetching signing URL:", error);
  //     throw error;
  //   }
  // };

  useEffect(() => {
    // getSigningUrl();
    fetchData();
  });

  const sendOtp = async (gstin: any, username: string) => {
    try {
      const response = await fetch(`${apiUrl}/scoreme-api/gst/external/gstgenerateotp/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ gstin, username }),
      });

      if (!response.ok) {
        throw new Error("Failed to send OTP");
      }
      return true;
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }
  };

  const verifyOtp = async (gstin: any, otp: any) => {
    try {
      const response = await fetch(`${apiUrl}/scoreme-api/gst/external/gstauthentication/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ gstin, otp }),
      });

      if (!response.ok) {
        throw new Error("Failed to verify OTP");
      }
      return true;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  };

  return { processedGstList, unprocessedGstList, message, error, isLoading, sendOtp, verifyOtp };
};