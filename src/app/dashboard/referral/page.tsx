"use client";
import React, { useState, useContext } from "react";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { getAccessToken } from "../../../Utils/auth";
import { DashboardContext } from "../../../Contexts/DashboardContext";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { showToast } from "../../../Utils/showToast";
import { SendHorizonal, Upload } from "lucide-react";
import { jwtDecode } from "jwt-decode";

const page = () => {
  const [formData, setFormData] = useState({ email: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  console.log(selectedFile);
  const { uId } = useContext(DashboardContext);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const router = useRouter();
  console.log(uId);

  let accessToken = parseCookies().accessToken;
  let userId = "";
  const token = accessToken;

  if (token) {
    // Decode the token to extract information
    const decodedToken: { uid: string } = jwtDecode(token);

    // Extract the user ID (assuming it's stored in the 'sub' claim)
    console.log(decodedToken.uid);

    userId = decodedToken.uid;
  }
  let referralLink = `${frontendUrl}/register?referal_code=${userId}`;
  const ReplaceTokenOrRedirect = async () => {
    const token = await getAccessToken();
    if (!token) {
      router.push("/login");
    } else {
      accessToken = token;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      showToast("Invalid email address", "info");
      return;
    }

    try {
      setLoadingSpinner(true);

      const bodyData = {
        email: formData.email.trim(),
        link: referralLink,
      };

      console.log(bodyData);

      let response = await fetch(
        `${apiUrl}/user-dashboard-api/referral-email/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        }
      );

      console.log(response);

      if (response.status === 401) {
        await ReplaceTokenOrRedirect();
        response = await fetch(`${apiUrl}/user-dashboard-api/referral-email/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        });
      }

      if (response.ok) {
        setFormData({ email: "" });
        showToast("Invitation email sent!", "info");
      } else {
        showToast("Invitation email submission failed, server error", "info");
      }
    } catch (error) {
      showToast("Invitation email submission failed, system error", "info");
    } finally {
      setLoadingSpinner(false);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    // Check if the file is an Excel file based on its extension
    const allowedExtensions = ["xlsx", "xls"];
    const fileExtension = file?.name.split(".").pop()?.toLowerCase();

    if (!allowedExtensions.includes(fileExtension!)) {
      showToast("Please upload a valid Excel file (.xlsx or .xls)", "info");
      fileInput.value = ""; // Reset the file input
      return;
    }

    // Check if the file size is less than 2 MB
    if (file && file.size > 2 * 1024 * 1024) {
      showToast("File size should be less than 2 MB", "info");
      fileInput.value = ""; // Reset the file input
      return;
    }

    setSelectedFile(file!);

    // Trigger the bulk upload process
    await handleBulkUpload(file!);

    // Reset the file input to clear the selected file
    fileInput.value = "";
  };

  const handleBulkUpload = async (file: File) => {
    if (!file) {
      showToast("Please select an Excel file to upload", "info");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("link", referralLink);

    try {
      setLoadingSpinner(true);
      const response = await fetch(
        `${apiUrl}/user-dashboard-api/referral-email-bulk/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        showToast("Bulk emails sent successfully!", "info");
      } else {
        const responseData = await response.json();
        console.log(responseData);
        showToast("Failed to send bulk emails", "info");
      }
    } catch (error) {
      console.log(error);

      showToast("Error sending bulk emails", "info");
    } finally {
      setLoadingSpinner(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        showToast("Copied to clipboard!", "info");
      })
      .catch((error) => console.error("Error copying to clipboard:", error));
  };

  return (
    <div className="min-h-screen mt-10 text-xl font-semibold text-center text-white-font">
      {loadingSpinner && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-600 bg-opacity-50">
          <LoadingSpinner />
        </div>
      )}

      <div className="w-4/5">
        <div className="py-5 text-3xl text-white font-semibold text-center text-white-font">
          Invite New user
        </div>

        <div className="pt-6 pb-8 mb-4 rounded">
          <div className="text-center">
            <div className="flex-1 w-3/5 mx-auto">
              {referralLink && (
                <div className="relative placeholder-gray-400 bg-gray-700 border-gray-600 rounded-lg">
                  <span
                    id="referral-link"
                    className="block w-3/4 p-4 text-sm text-white"
                  >
                    {referralLink}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="text-white absolute end-2.5 bottom-2 bg-[#1565c0] font-medium rounded-lg text-sm px-4 py-2"
                  >
                    Copy Link
                  </button>
                </div>
              )}

              <div className="h-6 mt-3 text-xs font-bold leading-8 text-gray-400 uppercase text-start">
                Email
              </div>
              <form onSubmit={handleSubmit}>
                <div className="flex py-1 my-2 text-sm">
                  <input
                    onChange={handleChange}
                    value={formData.email}
                    name="email"
                    placeholder="Email"
                    className="w-full py-1 text-gray-100 transition-colors bg-transparent border-b-2 outline-none focus:border-purple-600"
                    type="email"
                    required
                  />
                </div>
              </form>
            </div>

            <div className="flex flex-col items-center justify-center pt-8">
              <Button
                onClick={handleSubmit}
                style={{
                  backgroundColor: "#1565c0",
                  borderRadius: "25px",
                  width: "200px",
                }}
                variant="contained"
                type="submit"
                endIcon={
                  <SendHorizonal
                    className="text-gray-200 size-4"
                    strokeWidth={1.75}
                  />
                }
              >
                Send Invite
              </Button>
              <div className="pt-8">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  id="upload-excel-file"
                />
                <label htmlFor="upload-excel-file">
                  <Button
                    component="span"
                    style={{ backgroundColor: "#1565c0", borderRadius: "25px" }}
                    variant="contained"
                    endIcon={
                      <Upload
                        className="text-gray-200 size-4"
                        strokeWidth={1.75}
                      />
                    }
                  >
                    Bulk Email Upload
                  </Button>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
