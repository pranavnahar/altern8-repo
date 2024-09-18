import { useContext, useState, useCallback, useEffect } from "react";
import { showToast } from "../../Utils/showToast";
import { StepperContext } from "../../Contexts/StepperContext";
import HelpAndLogin from "../Step-Component/HelpAndLogin";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";

interface UserData {
  companyName: string;
  companyRegNumber: string;
  repName: string;
  position: string;
  email: string;
  resolutionConfirmed: boolean;
  powerOfAttorneyConfirmed: boolean;
  authorizedPersons: string;
  authorizedPositions: string;
  additionalDocsConfirmed: boolean;
}

const AuthorizationCompliance = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { currentStep, setCurrentStep, setLoading, getRegistrationState } =
    useContext(StepperContext);

  const [userData, setUserData] = useState<UserData>({
    companyName: "",
    companyRegNumber: "",
    repName: "",
    position: "",
    email: "",
    resolutionConfirmed: true,
    powerOfAttorneyConfirmed: true,
    authorizedPersons: "",
    authorizedPositions: "",
    additionalDocsConfirmed: true,
  });
  const [files, setFiles] = useState<File[]>();
  let accessToken = parseCookies().accessTokenForRegister;
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUserData({
      ...userData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/user-api/authorization-compliance/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          const data = responseData.data;
          setUserData((prevUserData) => {
            const updatedUserData: Partial<UserData> = { ...prevUserData };
            for (const key in prevUserData) {
              if (data.hasOwnProperty(key)) {
                updatedUserData[key as keyof UserData] = data[key];
              }
            }
            return updatedUserData as UserData;
          });
        } else if (response.status === 401) {
          router.push("/login");
        } else {
          showToast("Failed to fetch data", "info");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast("Failed to fetch data, system error!", "info");
      }
    };

    fetchData();
  }, []);

  const handleClick = async (direction?: string) => {
    let newStep = currentStep;

    if (direction !== "next") {
      newStep--;
      setCurrentStep(newStep);
    } else {
      // Validation
      const {
        companyName,
        companyRegNumber,
        repName,
        position,
        email,
        resolutionConfirmed,
        powerOfAttorneyConfirmed,
        authorizedPersons,
        authorizedPositions,
        additionalDocsConfirmed,
      } = userData;

      if (
        !companyName ||
        !companyRegNumber ||
        !repName ||
        !position ||
        !email ||
        !resolutionConfirmed ||
        !powerOfAttorneyConfirmed ||
        !authorizedPersons ||
        !authorizedPositions ||
        !additionalDocsConfirmed
      ) {
        showToast(
          "Please fill all fields and confirm all checkboxes before submission.",
          "info"
        );
        return;
      }

      try {
        setLoading(true);
        const formData = new FormData();

        formData.append("company_name", companyName);
        formData.append("company_reg_number", companyRegNumber);
        formData.append("rep_name", repName);
        formData.append("position", position);
        formData.append("email", email);
        formData.append("authorized_persons", authorizedPersons);
        formData.append("authorized_positions", authorizedPositions);

        if (files && files.length > 0) {
          files.forEach((file) => {
            formData.append("documents", file);
          });
        }

        const response = await fetch(
          `${apiUrl}/seller-api/authorization-compliance/`,
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
          showToast("Submission Successful", "info");
          getRegistrationState();
        } else {
          showToast("Submission failed!", "info");
        }
      } catch (error) {
        console.error("Submission failed:", error);
        showToast("Submission failed, system error!", "info");
      } finally {
        setLoading(false);
      }
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  //   const handleFileChange = async (acceptedFiles) => {
  //     const files = acceptedFiles;

  //     if (files && files.length > 0) {
  //       const formData = new FormData();

  //       for (let i = 0; i < files.length; i++) {
  //         const file = files[i];

  //         if (
  //           file.type === "application/pdf" ||
  //           file.type ===
  //             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  //         ) {
  //           if (file.size <= 5 * 1024 * 1024) {
  //             // Check if the file size is below 5MB
  //             formData.append(`files[${i}]`, file);

  //             // Add password or None if not provided
  //             const password = filePasswords[file.name] || "None";
  //             formData.append(`passwords[${i}]`, password);

  //             console.log(formData, file, password);
  //           } else {
  //             alert("File size exceeds 5MB limit. Please choose a smaller file.");
  //             return; // Stop processing files if size limit exceeded
  //           }
  //         } else {
  //           alert("Please choose PDF or Excel files only.");
  //           return; // Stop processing files if file type is not supported
  //         }
  //       }

  //       try {
  //         setLoading(true);

  //         for (const [key, value] of formData.entries()) {
  //           console.log(`${key}: ${value}`);
  //         }

  //         let response = await fetch(`${apiUrl}/seller-api/itr-document/`, {
  //           method: "POST",
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //           },
  //           body: formData,
  //         });

  //         // if unauthorized then push to login page
  //         if (response.status === 401) {
  //           router.push("/login");
  //         }

  //         if (response.ok) {
  //           const responseData = await response.json();

  //           console.log("Files uploaded successfully:");
  //           showToast(`Files uploaded successfully`, "info");

  //           // add a tick in the stepper instead of red cross
  //           setApiFailedIcon(false);

  //           // change the step after click and submitting the data
  //           getRegistrationState();
  //         } else {
  //           const responseData = await response.json();
  //           console.log(responseData);
  //           console.error("Error uploading files:");
  //           const message = responseData.message
  //             ? responseData.message
  //             : "Files upload failed!";
  //           showToast(message, "info");
  //         }
  //       } catch (error) {
  //         console.log(`Error uploading files, (${currentStep}) :`, error);
  //         showToast(`Files upload failed!`, "info");
  //       } finally {
  //         setLoading(false);
  //       }
  //     } else {
  //       showToast(`Please drag and drop files to upload.`, "info");
  //     }
  //   };

  return (
    <div className="flex flex-col space-y-4">
      <div className="w-full">
        <div className="font-semibold h-6 my-3 text-gray-300 text-sm leading-8 uppercase">
          General Information
        </div>
        <div className="space-y-2 px-5">
          <input
            onChange={handleChange}
            value={userData.companyName}
            name="companyName"
            placeholder="Company Name"
            className="py-1 px-2 w-full text-gray-100 border-b-2 bg-transparent outline-none focus:outline-none focus:border-purple-600 transition-colors"
            type="text"
          />
          <input
            onChange={handleChange}
            value={userData.companyRegNumber}
            name="companyRegNumber"
            placeholder="Company Registration Number"
            className="py-1 px-2 w-full text-gray-100 border-b-2 bg-transparent outline-none focus:outline-none focus:border-purple-600 transition-colors"
            type="text"
          />
          <input
            onChange={handleChange}
            value={userData.repName}
            name="repName"
            placeholder="Authorized Representative Name"
            className="py-1 px-2 w-full text-gray-100 border-b-2 bg-transparent outline-none focus:outline-none focus:border-purple-600 transition-colors"
            type="text"
          />
          <input
            onChange={handleChange}
            value={userData.position}
            name="position"
            placeholder="Position"
            className="py-1 px-2 w-full text-gray-100 border-b-2 bg-transparent outline-none focus:outline-none focus:border-purple-600 transition-colors"
            type="text"
          />
          <input
            onChange={handleChange}
            value={userData.email}
            name="email"
            placeholder="Email"
            className="py-1 px-2 w-full text-gray-100 border-b-2 bg-transparent outline-none focus:outline-none focus:border-purple-600 transition-colors"
            type="email"
          />
        </div>
      </div>

      <div className="w-full">
        <div className="font-semibold h-6 my-3 text-gray-300 text-sm leading-8 uppercase">
          Authorization Confirmation
        </div>
        <div className="space-y-2 px-5">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="resolutionConfirmed"
              checked={userData.resolutionConfirmed}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <span className="text-gray-200">
              I confirm that the Board of Directors of the company has passed a
              resolution authorizing the creation of this account and the
              transaction of business by availing the services on this platform.
            </span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="powerOfAttorneyConfirmed"
              checked={userData.powerOfAttorneyConfirmed}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <span className="text-gray-200">
              I confirm that a Power of Attorney has been granted to the
              following managers, officers, or employees to transact as
              representatives on behalf of the company:
            </span>
          </label>
          <input
            onChange={handleChange}
            value={userData.authorizedPersons}
            name="authorizedPersons"
            placeholder="Name(s) of Authorized Persons"
            className="py-1 px-2 w-full text-gray-100 border-b-2 bg-transparent outline-none focus:outline-none focus:border-purple-600 transition-colors"
            type="text"
          />
          <input
            onChange={handleChange}
            value={userData.authorizedPositions}
            name="authorizedPositions"
            placeholder="Position(s)"
            className="py-1 px-2 w-full text-gray-100 border-b-2 bg-transparent outline-none focus:outline-none focus:border-purple-600 transition-colors"
            type="text"
          />
        </div>
        <div className="font-semibold h-6 mt-6 mb-3 text-gray-300 text-sm leading-8 uppercase">
          Additional Documents
        </div>
        <div>
          <div className="px-5 py-2">
            <span className="text-gray-200">
              Furthermore, being an authorized beneficial owner/manager/ officer
              of the Company I confirm to have with me and to submit the
              following documents:
            </span>
            <ul className="text-gray-200 space-y-1 mt-2">
              <li>
                1. The Aadhaar number and proof of possession of Aadhaar number
              </li>
              <li>
                2. The Permanent Account Number or the equivalent e-document
                thereof or Form No. 60 as defined in Income-tax Rules, 1962
              </li>
            </ul>
            <label className="flex items-center space-x-2 my-2">
              <input
                type="checkbox"
                name="additionalDocsConfirmed"
                checked={userData.additionalDocsConfirmed}
                onChange={handleChange}
                className="h-4 w-4"
              />

              <span className="text-gray-200">
                I confirm that the above mentioned documents related to
                individual holding an attorney to transact on behalf of the
                company have been submitted.
              </span>
            </label>
          </div>
        </div>

        <div className="font-semibold h-6 my-3 text-gray-300 text-sm leading-8 uppercase">
          Acknowledgment and Agreement
        </div>

        <div className="px-5 py-2">
          <span className="text-gray-200">
            By signing below, I acknowledge and confirm that:
          </span>
          <ol className="text-gray-200 space-y-1 mt-2">
            <li>
              1. All information provided is accurate and truthful to my best
              knowledge.
            </li>
            <li>2. The documents uploaded are authentic and valid.</li>
            <li>
              3. I understand that the platform reserves the right to verify the
              information and documents provided.
            </li>
            <li>
              4. That any falsification of information and submission of
              misleading documents is liable to penal or other actions under law
              and equity.{" "}
            </li>
          </ol>
        </div>
        <div className="font-semibold h-6 my-3 text-gray-300 text-sm leading-8 uppercase">
          Please upload your documents here:
        </div>
        <div className="mb-5 text-center ">
          {/* dropzone (drag and drop box ) */}
          <div
            className="p-16 mt-3  mb-5 text-base2 text-gray-300 border border-dashed border-neutral-200"
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

      {/* Navigation controls */}
      <div className="container flex justify-around mt-4 mb-8">
        {/* Back button */}
        <button
          onClick={() => handleClick()}
          className="bg-white text-slate-600 uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer border-2 border-slate-300 hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out"
        >
          Back
        </button>

        {/* Next button */}
        <button
          onClick={() => handleClick("next")}
          className="bg-[#1565c0] text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer hover:bg-[#2680e6] transition duration-200 ease-in-out"
        >
          Confirm
        </button>
      </div>
      <HelpAndLogin />
    </div>
  );
};

export default AuthorizationCompliance;
// function setApiFailedIcon(arg0: boolean) {
//     throw new Error("Function not implemented.");
// }
