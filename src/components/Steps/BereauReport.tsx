// For Bureau Report

import { useContext, useState, useEffect, useCallback } from "react";
import { StepperContext } from "../../Contexts/StepperContext";
import HelpAndLogin from "../Step-Component/HelpAndLogin";
import { parseCookies } from "nookies";
import { showToast } from "../../Utils/showToast";
import { useRouter } from "next/router";
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
  const [otpSent, setOtpSent] = useState(false);
  const [manualBureauReportNeeded, setManualBureauReportNeeded] =
    useState(true);
  const [entityType, setEntityType] = useState("");
  const [otpTimer, setOtpTimer] = useState(60);

  // Handle token
  let accessToken = parseCookies().accessTokenForRegister;
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
        getRegistrationState();
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

  let documentTypes;

  if (entityType === "Partnership") {
    documentTypes = [
      "Address Proof",
      "Copy of Partnership Deed",
      "List of Authorized Signatories",
      "ID Proof",
      "Company Pan",
    ];
  } else {
    documentTypes = [
      "Address Proof",
      "Copy of Board Resolution",
      "Company Pan",
      "ID Proof",
    ];
  }

  const documentDictionary: { [key: string]: string } = {
    AddressProof:
      "Telephone or Electricity Bill, Bank Passbook or Account Statement, Registered Lease/Sale Agreement of office premises, Proof of Address issued by Scheduled Commercial Banks/Multinational Foreign Banks, Registration Certificate issued under Shops and Establishment Act",
    "Copy of Partnership Deed":
      "Copy of Partnership Deed or Certificate of Registration",
    "List of Authorized Signatories":
      "List of Authorized Signatories with specimen signatures/Authority Letter signed by any Partner with PAN number and Company Stamp",
    "Copy of Board Resolution":
      "Copy of Board Resolution along with authorized signatory list and specimen signature OR Authority letter signed by Company Secretary/Managing Director/Director with DIN number and Company stamp",
    "ID Proof":
      "ID Proof of Partner requesting for CCR (Any one) (PAN / Driving License / Passport) ",
    "Company Pan": "Company or firm Pan",
  };

  const [documentFiles, setDocumentFiles] = useState<DocumentFiles>({});

  const handleFileDrop = useCallback(
    (documentType: string | number, acceptedFiles: File[]) => {
      const validExtensions = [
        ".pdf",
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".xlsx",
      ];

      // Filter files based on valid extensions
      const filteredFiles = acceptedFiles.filter((file: File) =>
        validExtensions.includes(
          file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
        )
      );

      if (filteredFiles.length !== acceptedFiles.length) {
        showToast(
          `Invalid file extension provided. Please upload only PDF, Excel, JPG, JPEG, PNG, or GIF files.`,
          "info"
        );
        return;
      }

      setDocumentFiles((prevState) => {
        const existingFiles = prevState.documentType || [];
        const combinedFiles = existingFiles.concat(filteredFiles).slice(0, 10);

        // Calculate total file size
        const totalSize = combinedFiles.reduce(
          (sum, file) => sum + file.size,
          0
        );

        if (totalSize > 20 * 1024 * 1024) {
          showToast(
            `Total file size exceeds 20MB limit. Please choose smaller files.`,
            "info"
          );
          return prevState;
        }

        return {
          ...prevState,
          [documentType]: combinedFiles,
        };
      });
    },
    []
  );

  const renderDropzones = () => {
    return documentTypes.map((documentType) => {
      const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (files) => handleFileDrop(documentType, files),
      });

      return (
        <div
          key={documentType}
          className="mb-3 mt-2 flex flex-col justify-center"
        >
          <div className="text-start font-medium text-base2 text-gray-300">
            {documentType}:
          </div>
          <div className="text-start font-medium text-base text-gray-300">
            {documentDictionary[documentType]}
          </div>
          <div
            className="p-16 mt-3 mb-5 text-base2 text-gray-300 border border-dashed border-neutral-200"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p className="text-center">
                Drag 'n' drop some files here, or click to select files
              </p>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col">
      {!manualBureauReportNeeded && (
        <div className="">
          <div className="flex flex-col">
            {/* otp  */}
            {otpSent && (
              // otp field
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
            )}
          </div>

          {/* send otp button  */}

          {otpSent ? (
            <div className="flex justify-center items-center">
              <div className="flex justify-center items-center text-gray-300 mt-5 p-3   rounded-xl">
                Time left: {Math.floor(otpTimer / 60)}:
                {(otpTimer % 60).toLocaleString("en-US", {
                  minimumIntegerDigits: 2,
                })}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={handleSendOtp}
                className="bg-[#1565c0] text-white  py-2 px-4 rounded-xl font-medium cursor-pointer  hover:bg-[#2680e6] hover:text-white transition duration-200 ease-in-out"
              >
                Resend OTP
              </button>
            </div>
          )}
        </div>
      )}

      {/* manual bureau report submission  */}

      {manualBureauReportNeeded && (
        <div className="">
          <div className="flex flex-col">
            <div className="mb-3 mt-2 flex flex-col justify-center">
              <div className="text-center font-medium text-xl text-gray-300">
                Document Signature
              </div>
              <div className="text-center font-medium text-base text-gray-300">
                Please sign the below document for fetching Bureau report
              </div>
              <div className="text-center font-medium text-base text-gray-300 py-3">
                <a href="#" className="text-blue-600">
                  Click Here
                </a>
              </div>
            </div>

            {/* drag and drop  */}
            {entityType === "Partnership" && renderDropzones()}
            {(entityType === "Company" ||
              (entityType !== "Sole Proprietorship" &&
                entityType !== "Partnership")) &&
              renderDropzones()}
          </div>
        </div>
      )}

      {/* Navigation controls  */}

      <div className="container flex flex-col ">
        <div className="flex justify-around mt-4 mb-8">
          {/* back button  */}
          <button
            onClick={() => handleClick()}
            className="bg-white text-slate-600 uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer border-2 border-slate-300 hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out ${
                            "
          >
            Back
          </button>

          {/* next button  */}
          <button
            onClick={() => handleClick("next")}
            className="bg-[#1565c0] text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer  hover:bg-[#2680e6] hover:text-white transition duration-200 ease-in-out"
          >
            Next
          </button>
        </div>
        <HelpAndLogin />
      </div>
    </div>
  );
};

export default BureauReport;
