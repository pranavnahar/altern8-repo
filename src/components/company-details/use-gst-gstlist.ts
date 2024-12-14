"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/utils/auth-actions";

export const useGetGstList = () => {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [processedGstList, setProcessedGstList] = useState([]);
  const [unprocessedGstList, setUnprocessedGstList] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  const fetchData = async () => {
    try {
      const token = await getAuthToken();

      let response = await fetch(`${apiUrl}/user-api/processed-unprocessed-gstins/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // if (response.status === 401) {
      //   // Handle token expiry
      //   response = await fetch(`${apiUrl}/user-api/processed-unprocessed-gstins/`, {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   });
      // }

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
  }, []);

  const sendOtp = async (gstin: any, username: string): Promise<boolean> => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${apiUrl}/scoreme-api/gst/external/gstgenerateotp/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gstin, username }),
      });
  
      if (!response.ok) {
        console.error("Failed to send OTP. HTTP status:", response.status);
        return false; 
      }
  
      const data = await response.json();
  
      if (data.message === "GST API is disabled") {
        console.log("GST API is disabled. Response:", data);
        return false;
      }
  
      // If everything is fine, return true
      return true;
    } catch (error) {
      console.error("Error sending OTP:", error);
      return false;
    }
  };

  const verifyOtp = async (gstin: any, otp: any): Promise<boolean> => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${apiUrl}/scoreme-api/gst/external/gstauthentication/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gstin, otp }),
      });
  
      if (!response.ok) {
        console.error("Failed to verify OTP. HTTP status:", response.status);
        return false; // Return false for non-200 responses
      }
  
      const data = await response.json();
  
      if (data.message) {
        console.log("Server message:", data.message);
      }
  
      return true; 
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return false; 
    }
  };

  return { processedGstList, unprocessedGstList, message, error, isLoading, sendOtp, verifyOtp };
};