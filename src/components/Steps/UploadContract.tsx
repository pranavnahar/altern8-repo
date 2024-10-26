import { useContext, useState, useCallback } from 'react';
import { StepperContext } from '../../contxts/stepper-context';
import { useRouter } from 'next/navigation';
import HelpAndLogin from '../Step-Component/HelpAndLogin';
import { parseCookies } from 'nookies';
import { useDropzone } from 'react-dropzone';
import { useToast } from '../../utils/show-toasts';

type Props = {
  demo: boolean;
};

const UploadContract = ({ demo }: Props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { currentStep, setCurrentStep, steps, setLoading, getRegistrationState } =
    useContext(StepperContext);
  const { showToast } = useToast();

  const [contractFiles, setContractFiles] = useState<File[]>([]);
  const [pdcFiles, setPdcFiles] = useState<File[]>([]);
  const [checkbox, setCheckbox] = useState(true);
  const accessToken = parseCookies().altern8_useraccessForRegister;
  const router = useRouter();

  const handleCheckboxChange = () => {
    setCheckbox(!checkbox);
  };

  const handleNextClick = async () => {
    try {
      if (demo) {
        router.push('/register?demo=true&step=13');
        return;
      }
      if (contractFiles.length > 0) {
        await handleFileUpload(contractFiles, `${apiUrl}/user-api/upload-contract/`);
      }
      if (pdcFiles.length > 0) {
        await handleFileUpload(pdcFiles, `${apiUrl}/user-api/upload-pdc/`);
      }
      if (checkbox === true) {
        await handleCheckboxSubmit(`${apiUrl}/user-api/referral-checkbox/`);
      }
    } catch (error) {
      showToast({
        message: `Error uploading files`,
        type: 'error'
      });
    } finally {
      getRegistrationState();
    }
  };

  const handleFileUpload = async (files: File[], url: string) => {
    console.log(files);
    const formData = new FormData();
    for (const file of files) {
      if (file.size <= 5 * 1024 * 1024) {
        formData.append('files', file);
      } else {
        showToast({
          message: `File size exceeds 5MB limit. Please choose a smaller file.`,
          type: 'error'
        });
        return;
      }
    }
    console.log(formData);
    try {
      setLoading(true);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      // if unauthorized then push to login page
      if (response.status === 401) {
        router.push('/login');
      }

      if (response.ok) {
        showToast({
          message: `Files uploaded successfully`,
          type: 'success'
        });
      } else {
        showToast({
          message: `File upload failed`,
          type: 'error'
        });
      }
    } catch (error) {
      showToast({
        message: `Error uploading files`,
        type: 'error'
      });
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(bodyData),
      });

      // if unauthorized then push to login page
      if (response.status === 401) {
        router.push('/login');
      }

      if (response.ok) {
        console.log('checkbox submitted successfully');
      } else {
        console.log('Error submitting checkbox status');
      }
    } catch (error) {
      console.log(`Error submitting checkbox status, (${currentStep}) :`, error);
    } finally {
      setLoading(false);
    }
  };

  const onDropContractFiles = useCallback((acceptedFiles: File[]) => {
    const validExtensions = ['.pdf', '.xlsx'];
    const filteredFiles = acceptedFiles.filter(file =>
      validExtensions.includes(file.name.slice(file.name.lastIndexOf('.')).toLowerCase()),
    );
    if (filteredFiles.length !== acceptedFiles.length) {
      showToast({
        message: `Invalid file extension provided. Please upload only PDF or Excel files.`,
        type: 'info'
      });
    }
    setContractFiles(prevFiles => [...prevFiles, ...filteredFiles]);
  }, []);

  const onDropPdcFiles = useCallback((acceptedFiles: File[]) => {
    const validExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.gif'];
    const filteredFiles = acceptedFiles.filter(file =>
      validExtensions.includes(file.name.slice(file.name.lastIndexOf('.')).toLowerCase()),
    );
    if (filteredFiles.length !== acceptedFiles.length) {
      showToast({
        message: `Invalid file extension provided. Please upload only PDF, JPG, JPEG, PNG, or GIF files.`,
        type: 'info',
      });
    }
    setPdcFiles(prevFiles => [...prevFiles, ...filteredFiles]);
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

  const removeFile = (file: File, type: 'contract' | 'pdc') => {
    if (type === 'contract') {
      setContractFiles(prevFiles => prevFiles.filter(f => f !== file));
    } else {
      setPdcFiles(prevFiles => prevFiles.filter(f => f !== file));
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-5 mt-3 flex flex-col justify-center">
        {/* <div className="text-gray-200 flex flex-row items-center text-base2 p-2 mx-auto rounded-lg">
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
          {contractFiles.length > 0 && (
            <div className="mt-2">
              {contractFiles.map(file => (
                <div key={file.name} className="flex items-center justify-start">
                  <span className="text-gray-300">{file.name}</span>
                  <button
                    onClick={() => removeFile(file, 'contract')}
                    className="text-red-500 ml-2"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div> */}
      </div>

      {/* pdc or post dated cheques  */}
      <div className="mb-2 mt-3 flex flex-col justify-center">
        <div className="text-gray-200 flex flex-row items-center text-base2 p-2 mx-auto rounded-lg">
          <div>Please Upload copy of Post Dated Cheques of 80% of Line of Credit Requested</div>
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
          {pdcFiles.length > 0 && (
            <div className="mt-2">
              {pdcFiles.map(file => (
                <div key={file.name} className="flex items-center justify-start">
                  <span className="text-gray-300">{file.name}</span>
                  <button onClick={() => removeFile(file, 'pdc')} className="text-red-500 ml-2">
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
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
              I agree that the platform can contact my partners to offer Altern8 lending
              services in return for a discount on my project Yield/Discount Rate.
            </span>
          </label>
        </div>
      </div>

      {currentStep !== steps.length && (
        <div className="mt-4 container flex flex-col">
          <div className="flex justify-center items-center mt-4 mb-8">
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
