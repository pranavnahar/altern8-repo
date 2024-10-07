import { useContext, useState, useEffect } from "react";
import { StepperContext } from "../../contexts/StepperContext";
import HelpAndLogin from "../Step-Component/HelpAndLogin";
import { parseCookies } from "nookies";
import { showToast } from "../../utils/showToast";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";

interface DocumentFiles {
  [key: string]: File[];
}

const BureauReport = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { currentStep, setCurrentStep, setLoading, getRegistrationState } =
    useContext(StepperContext);
  const [referenceId, setReferenceId] = useState("");
  const [otpForm, setOtpForm] = useState({
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(true);
  const [manualBureauReportNeeded, setManualBureauReportNeeded] =
    useState(false);
  const [entityType, setEntityType] = useState("");
  console.log(entityType);
  const [otpTimer, setOtpTimer] = useState(60);
  const [documentFiles, setDocumentFiles] = useState<DocumentFiles>({});

  // Handle token
  let accessToken = parseCookies().altern8_useraccessForRegister;
  const router = useRouter();

  // handle form input for phone number and otp
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setOtpForm({ ...otpForm, [name]: value });
  };

  const GetBureauResponseId = async () => {
    try {
      setLoading(true);
      let response = await fetch(`${apiUrl}/user-api/bureau-report/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // if unauthorized then push to login page
      if (response.status === 401) {
        router.push("/login");
      }

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        if (responseData.is_manual_bureau_report_needed) {
          setManualBureauReportNeeded(true);
          if (responseData.entity_type) {
            setEntityType(responseData.entity_type);
          }
        } else {
          if (responseData.referenceId) {
            setReferenceId(responseData.referenceId);
            setOtpSent(true);
          } else {
            setTimeout(() => {
              showToast(
                `Unable to get reference ID, please try again later.`,
                "info"
              );
            }, 1000);
          }
        }
      } else {
        console.log("Unable to fetch reference id for Bureau report");
        //getRegistrationState();
      }
    } catch (error) {
      console.log(
        `Unable to fetch reference id for Bureau report, (${currentStep}) :`,
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetBureauResponseId();
  }, []);

  // to handle click on next and back button
  const handleClick = async (direction?: string) => {
    let newStep = currentStep;

    if (direction !== "next") {
      newStep--;
      setCurrentStep(newStep);
    } else if (direction === "next") {
      if (!manualBureauReportNeeded) {
        const newRecord: { otp: string; referenceId: string } = {
          otp: "",
          referenceId: "",
        };
        newRecord.otp = otpForm.otp;
        newRecord.referenceId = referenceId;

        if (newRecord["otp"].length < 3) {
          showToast(`Please enter valid otp`, "info");
          return;
        }

        try {
          if (newRecord) {
            const body = newRecord;
            console.log(body);
            setLoading(true);
            const response = await fetch(
              `${apiUrl}/scoreme-api/bda/external/validateotp/`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(body),
              }
            );

            if (response.ok) {
              let server_message = await response.json();
              console.log(
                `Bureau Report submission successful`,
                server_message
              );
              showToast(`Submission Successful`, "info");

              // change the step after click and submitting the data
              getRegistrationState();
            } else {
              let server_error = await response.json();
              console.error(`Bureau Report submission failed!`, server_error);
              showToast(`Submission failed! ${server_error.message}`, "info");
            }
          }
        } catch (error) {
          console.error(
            `Bureau Report submission failed!, (${currentStep}) :`,
            error
          );
          showToast(`Submission failed, system error!`, "info");
        } finally {
          setLoading(false);
        }
      } else {
        const formData = new FormData();
        Object.entries(documentFiles).forEach(([documentType, files]) => {
          files.forEach((file: File) => {
            formData.append(documentType, file);
          });
        });

        if (Array.from(formData.values()).length === 0) {
          showToast("Please select files", "info");
          return;
        }

        try {
          setLoading(true);
          const response = await fetch(
            `${apiUrl}/user-api/upload-bureau-docs/`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              body: formData,
            }
          );

          if (response.status === 401) {
            router.push("/login");
          }

          if (response.ok) {
            showToast("Files uploaded successfully", "info");
            getRegistrationState();
          } else {
            showToast("File upload failed", "info");
          }
        } catch (error) {
          console.error("Error uploading files:", error);
          showToast("Error uploading files", "info");
        } finally {
          setLoading(false);
        }
      }
    }
  };

  // to resend the otp
  const handleSendOtp = async () => {
    try {
      setLoading(true);
      const newRecord: { referenceId: string } = {
        referenceId: "",
      };
      newRecord.referenceId = referenceId;
      console.log(newRecord);
      const response = await fetch(
        `${apiUrl}/scoreme-api/bda/external/resendotp/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRecord),
        }
      );

      if (response.ok) {
        let responseData = await response.json();
        console.log("otp sent, get success", responseData);
        setOtpSent(true);
        otpForm.otp = "";
      } else {
        let server_error = await response.json();

        // empty previous otp in login form field
        otpForm.otp = "";
        console.error("Failed to send otp", server_error);
        showToast(`Failed to send otp,${server_error.message}`, "info");
      }
    } catch (error) {
      console.log(error);
      console.error(
        "Server Connection Error during otp, (${currentStep}) :",
        error
      );
      showToast(`Failed to send otp, system error`, "info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (otpSent) {
      setOtpTimer(60);

      intervalId = setInterval(() => {
        setOtpTimer((prevTimer) => {
          if (prevTimer === 1) {
            clearInterval(intervalId);
            setOtpSent(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [otpSent]);

  const documentDictionary: { [key: string]: string } = {
    AddressProof:
      "Telephone or Electricity Bill, Bank Passbook or Account Statement, Registered Lease/Sale Agreement of office premises, Proof of Address issued by Scheduled Commercial Banks/Multinational Foreign Banks, Registration Certificate issued under Shops and Establishment Act",
    "Copy of Partnership Deed":
      "Copy of Partnership Deed which is mandatory to submit in case of Partnership",
    "List of Authorized Signatories":
      "A list of authorized signatories is mandatory to submit in case of Partnership",
    IDProof: "PAN Card, Driving License, Passport, Voter ID card, Aadhaar Card",
    CompanyPan:
      "Copy of Company PAN which is mandatory to submit in case of Partnership",
    "Copy of Board Resolution":
      "Copy of Board Resolution which is mandatory to submit in case of Partnership",
  };

  // Define all potential document types regardless of entityType
  const allDocumentTypes = [
    "Address Proof",
    "Copy of Partnership Deed",
    "List of Authorized Signatories",
    "ID Proof",
    "Company Pan",
    "Copy of Board Resolution",
  ];

  // Create hooks for all document types
  const dropzoneHooks = allDocumentTypes.reduce((acc, documentType) => {
    acc[documentType] = useDropzone({
      onDrop: (acceptedFiles: File[]) =>
        setDocumentFiles((prevFiles) => ({
          ...prevFiles,
          [documentType]: acceptedFiles,
        })),
    });
    return acc;
  }, {} as { [key: string]: ReturnType<typeof useDropzone> });

  const renderDropzones = () => {
    // Only render dropzones for the current document types
    return allDocumentTypes.map((documentType, index) => {
      const { getRootProps, getInputProps } = dropzoneHooks[documentType];

      return (
        <div key={index}>
          <h3 className="font-bold my-2 text-white">{documentType}</h3>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p className="border-dashed border-2 border-gray-400 py-6 text-center cursor-pointer text-gray-300">
              Drag and drop files here, or click to select files
            </p>
            {documentFiles[documentType] && (
              <div className=" text-gray-200">
                <h4>Selected files:</h4>
                <ul>
                  {documentFiles[documentType].map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="my-4">
            <h4 className="text-sm text-gray-400">Allowed Document Types:</h4>
            <p className="text-xs text-gray-300">
              {documentDictionary[documentType.replace(/\s+/g, "")]}
            </p>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <div className="p-4">
        <div className="">
          <div className="grid grid-cols-1 gap-6">
            {manualBureauReportNeeded ? (
              <div>{renderDropzones()}</div>
            ) : (
              <div>
                <div className="w-full mx-2 flex-1">
                  <div className="font-semibold h-6 mt-3 text-gray-300 text-sm leading-8 uppercase ">
                    OTP for Bureau Report
                  </div>
                  <div className=" my-2 py-1 flex ">
                    <input
                      onChange={handleInput}
                      value={otpForm.otp || ""}
                      name="otp"
                      placeholder="OTP"
                      className="py-1    w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
                      type="text"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <p className="text-sm text-white">
                      Resend OTP in {otpTimer} seconds
                    </p>
                  </div>
                )}
                {!otpSent && (
                  <button
                    onClick={handleSendOtp}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            )}

            <div className="flex justify-center items-center">
              <button
                onClick={() => handleClick("next")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <HelpAndLogin />
    </>
  );
};

export default BureauReport;
