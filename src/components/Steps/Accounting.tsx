import { useContext, useState, useCallback } from 'react';
import { StepperContext } from '../../contexts/StepperContext';
import HelpAndLogin from '../Step-Component/HelpAndLogin';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import { useDropzone } from 'react-dropzone';
import ConnectSDK from '../Step-Component/ConnectSDK';
import { useToast } from '../../utils/show-toasts';

type Props = {
  demo: boolean;
};

const Accounting = ({ demo }: Props) => {
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

  const [accountingPlatforms] = useState(['TALLY', 'ZOHO_BOOKS', 'QUICKBOOKS', 'Others']);

  const [userData, setUserData] = useState({
    category: 'ACCOUNTING',
    platform: '',
  });

  const [processState, setProcessState] = useState('initializing');
  const { showToast } = useToast();

  function handleProcessChange(newState: string) {
    setProcessState(newState);
  }

  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  console.log(uploadedFiles);

  // if the system fails to get accounting data via api
  // then user will manually upload the data
  const [needManualUpload, setNeedManualUpload] = useState(false);
  const [files, setFiles] = useState<File[]>([]); // state for file upload

  // Handle token
  let accessToken = parseCookies().altern8_useraccessForRegister;

  function changeUserPlatform(platform: string) {
    if (platform === 'Others') {
      setNeedManualUpload(true);
    } else {
      setUserData({ ...userData, platform: platform });
    }
  }

  // to handle click on next and back button
  const handleClick = async (direction?: string) => {
    let newStep = currentStep;

    if (direction !== 'next') {
      newStep--;
      setApiFailedIcon(false);
      setCurrentStep(newStep);
    } else if (direction === 'next') {
      if (demo) {
        router.push('/register?demo=true&step=10');
        return;
      }
      if (!needManualUpload) {
        if (userData.platform === '') {
          showToast(`Please select an accounting data platform`, 'info');
          return;
        }

        const newRecord = {
          category: userData.category,
          platform: userData.platform,
        };

        try {
          if (newRecord) {
            setLoading(true);
            const response = await fetch(`${apiUrl}/user-api/accounting-data/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify(newRecord),
            });

            if (response.status === 401) {
              router.push('/login');
            }

            if (response.ok) {
              const serverMessage = await response.json();
              console.log(`Accounting data submission successful`, serverMessage);
              showToast(`Submission Successful`, 'info');
              getRegistrationState();
            } else {
              const serverError = await response.json();
              console.error(`Accounting data submission failed!`, serverError);
              showToast(`Submission failed! ${serverError.message}`, 'info');
              setNeedManualUpload(true);
              setApiFailedIcon(true);
            }
          }
        } catch (error) {
          console.error(`Accounting data submission failed!, (${currentStep}) :`, error);
          showToast(`Submission failed, system error!`, 'info');
          setNeedManualUpload(true);
          setApiFailedIcon(true);
        } finally {
          setLoading(false);
        }
      }
      if (needManualUpload) {
        try {
          await handleFileChange(files);
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
    setUploadedFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // handle file change
  const handleFileChange = async (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const formData = new FormData();

      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];

        if (
          file.type === 'application/pdf' ||
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
          if (file.size <= 5 * 1024 * 1024) {
            formData.append(`files[${i}]`, file);
          } else {
            alert('File size exceeds 5MB limit. Please choose a smaller file.');
            return;
          }
        } else {
          alert('Please choose PDF or Excel files only.');
          return;
        }
      }

      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/user-api/accounting-document/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        });

        if (response.status === 401) {
          router.push('/login');
        }

        if (response.ok) {
          await response.json();
          showToast(`Files uploaded successfully`, 'info');
          setApiFailedIcon(false);
          getRegistrationState();
        } else {
          showToast(`Files upload failed!`, 'info');
        }
      } catch (error) {
        console.log(`Error uploading files, (${currentStep}) :`, error);
        showToast(`Files upload failed!`, 'info');
      } finally {
        setLoading(false);
      }
    } else {
      showToast(`Please drag and drop files to upload.`, 'info');
    }
  };

  // handle remove file
  const handleRemoveFile = (fileIndex: number) => {
    const newFiles = files.filter((_, index) => index !== fileIndex);
    setFiles(newFiles);
    setUploadedFiles(newFiles);
  };

  return (
    <div>
      <div className="flex flex-col">
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
                      {platform !== 'Others' ? (
                        <ConnectSDK
                          integration={platform}
                          category={'ACCOUNTING'}
                          onEventChange={handleProcessChange}
                        />
                      ) : (
                        <button className="grid h-full gap-0 px-5 my-auto rounded-full">
                          <img src="/icons/others.svg" alt="..." className="m-auto size-12" />
                          <h1 className="-mt-1 text-white">Others</h1>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
              {processState === 'success' && (
                <div className="text-center text-green-500">
                  <h2 className="text-2xl font-semibold">Success!</h2>
                  <p>Your Accounting Platform Is Connected Successfully.</p>
                </div>
              )}
              {processState === 'incomplete' && (
                <div className="text-center text-red-500">
                  <h2 className="text-2xl font-semibold">Incomplete</h2>
                  <p>Process Not Completed .</p>
                </div>
              )}
            </div>
          </div>
        )}

        {needManualUpload && (
          <>
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
                      Data Fetching from your Accounting Platform failed. Please upload your
                      accounting statements and ledgers (Only PDF and Excel Files Allowed).
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      Please upload your accounting statements and ledgers (Only PDF and Excel Files
                      Allowed).
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-col items-center justify-center w-full px-6 py-8 border-2 border-gray-600 rounded-lg">
                <div className="text-lg font-semibold text-gray-300">Upload Files</div>
                <div
                  {...getRootProps()}
                  className={`flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-400 rounded-md p-4 mt-2 transition-colors duration-300 ${
                    isDragActive ? 'border-blue-500' : ''
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center justify-center w-full py-2">
                    <img src="/icons/upload_icon.svg" className="h-20 w-22" />
                    <div className="mt-2 font-medium text-gray-300 text-md">
                      Drag and drop files here or click to select files
                    </div>
                  </div>
                </div>
              </div>
              {files.length > 0 && (
                <div className="text-gray-300">
                  <h2 className="mb-2 font-medium text-md">Selected Files:</h2>
                  <ul>
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center">
                        <span>{file.name}</span>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="ml-2 text-red-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}

        <div className="flex justify-center my-4">
          <button
            onClick={() => handleClick('next')}
            className="px-10 py-2 font-semibold text-gray-300 transition duration-200 ease-in-out bg-blue-800 rounded-lg shadow-md hover:bg-blue-600"
          >
            {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
      <HelpAndLogin />
    </div>
  );
};

export default Accounting;
