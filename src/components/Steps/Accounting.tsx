// to get  Account Data from tally, zoho
// purpose :
// 1. if the system fails to get data through api
// 2. then ask for manual upload of data

import { useContext, useState, useCallback } from "react";
import { StepperContext } from "../../Contexts/StepperContext";
import HelpAndLogin from "../Step-Component/HelpAndLogin";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { useDropzone } from "react-dropzone";
import ConnectSDK from "../Step-Component/ConnectSDK";
import { showToast } from "../../Utils/showToast";
//import { RectangleEllipsis } from "lucide-react";

const Accounting = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const {
    currentStep,
    setCurrentStep,
    steps,
    setLoading,
    getRegistrationState,
    apiFailedIcon,
    setApiFailedIcon,
  } = useContext(StepperContext);

  const [accountingPlatforms] = useState([
    "TALLY",
    "ZOHO_BOOKS",
    "QUICKBOOKS",
    "Others",
  ]);

  const [userData, setUserData] = useState({
    category: "ACCOUNTING",
    platform: "",
  });

  const [processState, setProcessState] = useState("initializing");

  function handleProcessChange(newState: string) {
    setProcessState(newState);
  }

  const router = useRouter();

  // if the system fails to get accounting data via api
  // then user will manually uploads the data
  const [needManualUpload, setNeedManualUpload] = useState(false);
  const [files, setFiles] = useState<File[]>(); // state for file upload

  // Handle token
  let accessToken = parseCookies().accessTokenForRegister;

  // questions selected steps
  const selectedPages = localStorage.getItem("selectedPages");
  let nextStep = "Ecommerce";
  if (selectedPages) {
    const pagesArray = JSON.parse(selectedPages);
    if (Array.isArray(pagesArray) && pagesArray.length > 0) {
      nextStep = pagesArray[0];
    }
  }

  // handle input change
  //   const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     setUserData({ ...userData, [name]: value });
  //   };

  function changeUserPlatform(Platform: string) {
    if (Platform === "Others") {
      setNeedManualUpload(true);
    } else {
      setUserData({ ...userData, platform: Platform });
    }
  }

  // to handle click on next and back button
  const handleClick = async (direction?: string) => {
    // change the step after click for back button
    let newStep = currentStep;

    if (direction !== "next") {
      newStep--;
      // add a tick in the stepper instead of red cross
      setApiFailedIcon(false);
      setCurrentStep(newStep);
    }
    // if button is next the submit data to backend api
    else if (direction === "next") {
      if (!needManualUpload) {
        // send the data to api

        // data validation
        if (userData.platform === "") {
          showToast(`Please select an accounting data platform`, "info");
          return;
        }

        const newRecord: { category: string; platform: string } = {
          category: "",
          platform: "",
        };
        newRecord.category = userData.category;
        newRecord.platform = userData.platform;

        try {
          if (newRecord) {
            const body = newRecord;
            console.log(body);
            setLoading(true);
            const response = await fetch(
              `${apiUrl}/user-api/accounting-data/`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(body),
              }
            );

            // if unauthorized then push to login page
            if (response.status === 401) {
              router.push("/login");
            }

            if (response.ok) {
              let server_message = await response.json();
              console.log(
                `Accounting data submission successful`,
                server_message
              );

              showToast(`Submission Successful`, "info");

              // change the step after click and submitting the data
              getRegistrationState(nextStep);
            } else {
              let server_error = await response.json();
              console.error(`Accounting data submission failed!`, server_error);

              showToast(`Submission failed! ${server_error.message}`, "info");

              // ask user to upload manually
              setNeedManualUpload(true);
              // add a cross in the stepper instead of tick
              setApiFailedIcon(true);
            }
          }
        } catch (error) {
          console.error(
            `Accounting data submission failed!, (${currentStep}) :`,
            error
          );
          showToast(`Submission failed, system error!`, "info");

          // ask user to upload manually
          setNeedManualUpload(true);
          // add a cross in the stepper instead of tick
          setApiFailedIcon(true);
        } finally {
          setLoading(false);
        }
      }
      if (needManualUpload) {
        try {
          await handleFileChange(files!);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  // handle file upload and drag and drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // handle file change
  const handleFileChange = async (acceptedFiles: File[]) => {
    const files = acceptedFiles;

    if (files && files.length > 0) {
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (
          file.type === "application/pdf" || // Check if the file is a PDF
          file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // Check if the file is an Excel file
        ) {
          if (file.size <= 5 * 1024 * 1024) {
            // Check if the file size is below 5MB
            formData.append(`files[${i}]`, file); // Append each file to the FormData object
            console.log(formData, file);
          } else {
            alert("File size exceeds 5MB limit. Please choose a smaller file.");
            return; // Stop processing files if size limit exceeded
          }
        } else {
          alert("Please choose PDF or Excel files only.");
          return; // Stop processing files if file type is not supported
        }
      }

      try {
        setLoading(true);

        for (const [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }
        let response = await fetch(`${apiUrl}/user-api/accounting-document/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        });

        // if unauthorized then push to login page
        if (response.status === 401) {
          router.push("/login");
        }

        if (response.ok) {
          await response.json();

          console.log("Files uploaded successfully:");
          showToast(`Files uploaded successfully`, "info");

          // add a tick in the stepper instead of red cross
          setApiFailedIcon(false);
          // change the step after click and submitting the data
          getRegistrationState(nextStep);
        } else {
          console.error("Error uploading files:");
          showToast(`Files upload failed!`, "info");
        }
      } catch (error) {
        console.log(`Error uploading files, (${currentStep}) :`, error);
        showToast(`Files upload failed!`, "info");
      } finally {
        setLoading(false);
      }
    } else {
      showToast(`Please drag and drop files to upload.`, "info");
    }
  };

  return (
    <div>
      {/* input for accounting data like tally, zoho... */}

      <div className="flex flex-col">
        {/* input fields for rootfi api  */}

        {!needManualUpload && (
          <div>
            <div className="w-full mx-2">
              <>
                <div className="h-6 mt-3 text-sm font-semibold leading-8 text-gray-300 uppercase">
                  Select an Accounting platform
                </div>
                <div className="flex flex-row justify-center w-full my-8">
                  {accountingPlatforms.map((platform, index) => (
                    <div
                      key={index}
                      className="rounded-full"
                      onClick={() => changeUserPlatform(platform)}
                    >
                      {platform !== "Others" ? (
                        <ConnectSDK
                          integration={platform}
                          category={"ACCOUNTING"}
                          onEventChange={handleProcessChange}
                        />
                      ) : (
                        <button className="grid h-full gap-0 px-5 my-auto rounded-full">
                          <img
                            src="/icons/others.svg"
                            alt="..."
                            className="m-auto size-12"
                          />
                          <h1 className="-mt-1 text-white">Others</h1>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
              {processState === "success" && (
                <div className="text-center text-green-500">
                  <h2 className="text-2xl font-semibold">Success!</h2>
                  <p>Your Accounting Platform Is Connected Successfully.</p>
                </div>
              )}
              {processState === "incomplete" && (
                <div className="text-center text-red-500">
                  <h2 className="text-2xl font-semibold">Incomplete</h2>
                  <p>Process Not Completed .</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* manual files upload */}

        {needManualUpload && (
          <div className="flex flex-col justify-center mt-3 mb-5 ">
            <div className="flex flex-row items-center p-2 mx-auto text-gray-300 rounded-lg text-base2 ">
              {apiFailedIcon ? (
                <>
                  <svg
                    className="w-5 h-5 mr-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <div>
                    Data Fetching from your Accounting Platform failed. Please
                    upload your accounting statements and ledgers (csv, xls,
                    pdf).
                  </div>
                </>
              ) : (
                <div>
                  Please upload your accounting statements and ledgers (csv,
                  xls, pdf).
                </div>
              )}
            </div>

            {/* upload accounting files  */}
            <div className="mt-10 mb-5 text-center ">
              <div className="font-medium text-gray-300 text-start text-base2">
                Upload your accounting files:
              </div>
              {/* dropzone (drag and drop box ) */}
              <div
                className="p-16 mt-5 border border-dashed rounded-md cursor-pointer text-neutral-400 border-neutral-500 hover:bg-neutral-950/20 animation"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <p>Drag 'n' drop some files here, or click to select files</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation controls  */}
        {currentStep !== steps.length && (
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
        )}
      </div>
    </div>
  );
};

export default Accounting;
