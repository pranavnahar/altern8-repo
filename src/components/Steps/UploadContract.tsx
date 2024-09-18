import { useContext, useState, useCallback } from "react";
import { StepperContext } from "../../Contexts/StepperContext";
import { useRouter } from "next/navigation";
import HelpAndLogin from "../Step-Component/HelpAndLogin";
import { parseCookies } from "nookies";
import { useDropzone } from "react-dropzone";
import { showToast } from "../../Utils/showToast";

const UploadContract = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const {
    currentStep,
    setCurrentStep,
    steps,
    setLoading,
    getRegistrationState,
  } = useContext(StepperContext);

  const [contractFiles, setContractFiles] = useState<File[]>([]);
  const [pdcFiles, setPdcFiles] = useState<File[]>([]);
  const [checkbox, setCheckbox] = useState(true);
  const accessToken = parseCookies().accessTokenForRegister;
  const router = useRouter();

  const handleCheckboxChange = () => {
    setCheckbox(!checkbox);
  };

  const handleBackClick = () => {
    let newStep = currentStep;
    newStep--;
    setCurrentStep(newStep);
  };

  const handleNextClick = async () => {
    try {
      if (contractFiles.length > 0) {
        await handleFileUpload(
          contractFiles,
          `${apiUrl}/seller-api/upload-contract/`
        );
      }
      if (pdcFiles.length > 0) {
        await handleFileUpload(pdcFiles, `${apiUrl}/seller-api/upload-pdc/`);
      }
      if (checkbox === true) {
        await handleCheckboxSubmit(`${apiUrl}/seller-api/referral-checkbox/`);
      }
    } catch (error) {
      console.error(`Error uploading files, (${currentStep}) :`, error);
      showToast(`Error uploading files`, "info");
    } finally {
      getRegistrationState("selectedPages", "Upload Contract");
    }
  };

  const handleFileUpload = async (files: File[], url: string) => {
    console.log(files);
    const formData = new FormData();
    for (const file of files) {
      if (file.size <= 5 * 1024 * 1024) {
        formData.append("files", file);
      } else {
        showToast(
          `File size exceeds 5MB limit. Please choose a smaller file.`,
          "info"
        );

        return;
      }
    }
    console.log(formData);
    try {
      setLoading(true);
      const response = await fetch(url, {
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
        showToast(`Files uploaded successfully`, "info");
      } else {
        showToast(`File upload failed`, "info");
      }
    } catch (error) {
      console.error(`Error uploading files, (${currentStep}) :`, error);
      showToast(`Error uploading files`, "info");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxSubmit = async (url: string) => {
    const bodyData = {
      checkbox: checkbox,
    };
    try {
      setLoading(true);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(bodyData),
      });

      // if unauthorized then push to login page
      if (response.status === 401) {
        router.push("/login");
      }

      if (response.ok) {
        console.log("checkbox submitted successfully");
      } else {
        console.log("Error submitting checkbox status");
      }
    } catch (error) {
      console.log(
        `Error submitting checkbox status, (${currentStep}) :`,
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const onDropContractFiles = useCallback((acceptedFiles: File[]) => {
    const validExtensions = [".pdf", ".xlsx"];
    const filteredFiles = acceptedFiles.filter((file) =>
      validExtensions.includes(
        file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
      )
    );
    if (filteredFiles.length !== acceptedFiles.length) {
      showToast(
        `Invalid file extension provided. Please upload only PDF or Excel files.`,
        "info"
      );
    }
    setContractFiles(filteredFiles);
  }, []);

  const onDropPdcFiles = useCallback((acceptedFiles: File[]) => {
    const validExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".gif"];
    const filteredFiles = acceptedFiles.filter((file) =>
      validExtensions.includes(
        file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
      )
    );
    if (filteredFiles.length !== acceptedFiles.length) {
      showToast(
        `Invalid file extension provided. Please upload only PDF, JPG, JPEG, PNG, or GIF files.`,
        "info"
      );
    }
    setPdcFiles(filteredFiles);
  }, []);

  const {
    getRootProps: getRootPropsContract,
    getInputProps: getInputPropsContract,
    isDragActive: isDragActiveContract,
  } = useDropzone({ onDrop: onDropContractFiles });

  const {
    getRootProps: getRootPropsPdc,
    getInputProps: getInputPropsPdc,
    isDragActive: isDragActivePdc,
  } = useDropzone({
    onDrop: onDropPdcFiles,
  });

  return (
    <div className="flex flex-col">
      <div className="mb-5 mt-3 flex flex-col justify-center">
        <div className="text-gray-200 flex flex-row items-center text-base2 p-2 mx-auto rounded-lg">
          <div>Please upload your contract's with buyers (xls, csv, pdf)</div>
        </div>
        <div className="mb-5 mt-10 text-center">
          <div className="text-start font-medium text-base2 text-gray-300">
            Upload your contract files:
          </div>
          <div
            className="p-16 mt-3 mb-5 text-base2 text-gray-300 border border-dashed border-neutral-200"
            {...getRootPropsContract()}
          >
            <input {...getInputPropsContract()} />
            {isDragActiveContract ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
          </div>
        </div>
      </div>

      {/* pdc or post dated cheques  */}
      <div className="mb-2 mt-3 flex flex-col justify-center">
        <div className="text-gray-200 flex flex-row items-center text-base2 p-2 mx-auto rounded-lg">
          <div>
            Please Upload copy of Post Dated Cheques of 80% of Line of Credit
            Requested
          </div>
        </div>
        <div className=" mt-10 text-center">
          <div className="text-start font-medium text-base2 text-gray-300">
            Upload your cheques:
          </div>
          <div
            className="p-16 mt-3  text-base2 text-gray-300 border border-dashed border-neutral-200"
            {...getRootPropsPdc()}
          >
            <input {...getInputPropsPdc()} />
            {isDragActivePdc ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
          </div>
        </div>
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="mt-1 py-1 flex text-gray-200">
          <label className="inline-flex items-start">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-indigo-500"
              checked={checkbox}
              onChange={handleCheckboxChange}
            />
            <span className="ml-2 text-gray-300">
              I agree that the platform can contact by partners to offer Invoice
              Discounting services in return for a discount on my Invoice
              Yield/Discount Rate.
            </span>
          </label>
        </div>
      </div>

      {currentStep !== steps.length && (
        <div className="mt-4 container flex flex-col">
          <div className="flex justify-around mt-4 mb-8">
            <button
              onClick={() => handleBackClick()}
              className="bg-white text-slate-600 uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer border-2 border-slate-300 hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out ${
                                "
            >
              Back
            </button>

            <button
              onClick={handleNextClick}
              className="bg-[#1565c0] text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer hover:bg-[#2680e6] hover:text-white transition duration-200 ease-in-out"
            >
              Next
            </button>
          </div>
          <HelpAndLogin />
        </div>
      )}
    </div>
  );
};

export default UploadContract;
