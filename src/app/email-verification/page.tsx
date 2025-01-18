'use client';

import React, { useState, useEffect, FC } from "react";
import { useSearchParams } from "next/navigation";
import { IconLoader2 } from "@tabler/icons-react";
import { useToast } from "@/utils/show-toasts";
import { Button } from "@/components/ui/button";
import { verifyEmail, verifyOtp } from "./actions";

const EmailVerificationPage: FC = () => {
  const searchParams = useSearchParams();
  const [emailId, setEmailId] = useState("");
  const [userName, setUserName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [otpFieldVisible, setOtpFieldVisible] = useState(false);
  const { showToast } = useToast();
  const [otp, setOtp] = useState("");

  useEffect(() => {
    // Ensure this runs only on client side
    if (typeof window !== 'undefined') {
      const emailParam = searchParams.get("emailid");
      const userNameParam = searchParams.get("userName");
      const companyNameParam = searchParams.get("companyName");
      
      if (emailParam && userNameParam && companyNameParam) {
        setEmailId(emailParam);
        setUserName(userNameParam);
        setCompanyName(companyNameParam);
      }
    }
  }, [searchParams]);

  const handleVerify = async () => {
    try {
      setIsVerifying(true);
      await verifyEmail(emailId);
      showToast({ message: "Email verification initiated. Please enter OTP.", type: "success" });
      setOtpFieldVisible(true);
    } catch (error: any) {
      showToast({ message: error.message || "Failed to send verification request.", type: "error" });
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleOtpSubmit = async () => {
    try {
      setIsRequestingOtp(true);
      await verifyOtp(emailId, otp);
      showToast({ message: "OTP verified successfully!", type: "success" });
    } catch (error: any) {
      showToast({ message: error.message || "Failed to verify OTP.", type: "error" });
    } finally {
      setIsRequestingOtp(false);
    }
  };

  // Return early if no email provided
  if (typeof window !== 'undefined' && !emailId) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-transparent px-4">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md md:max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-6">Invalid Request</h1>
          <p className="text-center text-gray-700">No email address provided.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md md:max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Email Verification</h1>
        <p className="text-left text-sm text-gray-700 mb-6">
          {userName} from {companyName} added you as a POC, please verify your email to approve this.
        </p>
        <p className="text-gray-800 mb-6">
          <strong>Email:</strong> <span className="select-none">{emailId}</span>
        </p>

        <Button
          className="w-full mb-6 py-3 text-sm font-semibold"
          onClick={handleVerify}
          disabled={isVerifying}
        >
          {isVerifying ? <IconLoader2 className="animate-spin" /> : "Verify"}
        </Button>

        {otpFieldVisible && (
          <div className="space-y-4">
            <input
              type="text"
              className="border rounded-md w-full p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={isRequestingOtp}
            />
            <Button
              className="w-full py-3 text-sm font-semibold"
              onClick={handleOtpSubmit}
              disabled={isRequestingOtp}
            >
              {isRequestingOtp ? <IconLoader2 className="animate-spin" /> : "Submit"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationPage;