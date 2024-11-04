// For Account Aggregator
// Purpose :
// 1. connect with rootfi to collect data
// 2. if it fails then manually upload bank statement

import { useContext, useState, useCallback, useEffect } from 'react';
import { StepperContext } from '../../contexts/stepper-context';
import HelpAndLogin from '../Step-Component/HelpAndLogin';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import { useDropzone } from 'react-dropzone';
import ImageSlider from './Account Aggregator/ImageSlider';
import { AA_videos } from './Account Aggregator/AA_Videos';
import { useToast } from '../../utils/show-toasts';

type Props = {
  demo: boolean;
};

const BankDetails = ({ demo }: Props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [needManualUpload, setNeedManualUpload] = useState(true);
  const { currentStep, setCurrentStep, steps, setLoading, getRegistrationState, setApiFailedIcon } =
    useContext(StepperContext);
  const [files, setFiles] = useState<{ file: File; password: string }[]>([]); // state for file upload
  const [showFileBasedInputFields, setShowFileBasedInputFields] = useState(false);
  const { showToast } = useToast();

  const [showKnowMore, setShowKnowMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const iframeUrl = '';
  // Handle token
  let accessToken = parseCookies().altern8_useraccess;

  const router = useRouter();

  // to handle click on next and back button
  const handleClick = async (direction?: string) => {
    // change the step after click for back button
    let newStep = currentStep;

    if (direction !== 'next') {
      newStep--;
      // add a tick in the stepper instead of red cross
      setApiFailedIcon(false);
      setCurrentStep(newStep);
    }
    // if button is next the submit data to backend api
    else if (direction === 'next') {
      const bodyData = {};

      if (!needManualUpload) {
        try {
          if (demo) {
            setNeedManualUpload(true);
            return;
          }
          if (bodyData) {
            const body = bodyData;
            setLoading(true);
            const response = await fetch(`${apiUrl!}/user-api/account-aggregator/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify(body),
            });

            // if unauthorized then push to login page
            if (response.status === 401) {
              router.push('/login');
            }

            if (response.ok) {
              let server_message = await response.json();
              showToast({
                message: `Submission Successful`,
                type: 'success'
              });
              getRegistrationState();
            } else {
              let server_error = await response.json();
              setNeedManualUpload(true);
              setApiFailedIcon(true);
              showToast({
                message: `Submission failed!`,
                type: 'info'
              });
            }
          }
        } catch (error) {
          // if api fails then go for manaual upload
          setNeedManualUpload(true);
          // add a cross in the stepper instead of tick
          setApiFailedIcon(true);

          showToast({
            message: `Submission failed, system error!`,
            type: 'info'
          });
        } finally {
          setLoading(false);
        }
      }

      if (needManualUpload) {
        try {
          if (demo) {
            router.push('/register?demo=true&step=4');
            return;
          }
          await handleFileChange();
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  // handle input field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    //index?: number
  ) => {
    // const { name, value } = e.target;
    // const updatedFiles = [...files];

    // // Update the specific file object at the given index
    // updatedFiles[index] = {
    //   ...updatedFiles[index],
    //   [name]: value,
    // };

    // // Update the 'files' state with the modified array
    // setFiles(updatedFiles);
    const { value } = e.target;

    // Update the password for all files
    const updatedFiles = files.map(file => ({
      ...file,
      password: value,
    }));

    setFiles(updatedFiles);
  };

  // handle file upload and drag and drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Construct an array with objects containing file and additional fields
    const updatedFiles = acceptedFiles.map((file: File) => ({
      file: file,
      password: '',
    }));

    setShowFileBasedInputFields(true);

    // Update 'files' state with the array of files along with additional fields
    setFiles([]);
    setFiles(updatedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // handle file change
  const handleFileChange = async () => {
    if (files && files.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        const fileObject = files[i];
        console.log(fileObject);
        const file = fileObject.file;
        const password = fileObject.password;

        // file type and size validations
        if (
          file.type === 'application/pdf' || // Check if the file is a PDF
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
          if (file.size <= 5 * 1024 * 1024) {
            // Check if the file size is below 5MB
            formData.append(`file[${i}]`, file);

            // Append other fields individually
            formData.append(`password[${i}]`, password);

            console.log(formData);
          } else {
            alert('File size exceeds 5MB limit. Please choose a smaller file.');
            return; // Stop processing files if size limit exceeded
          }
        } else {
          alert('Please choose PDF or Excel files only.');
          return; // Stop processing files if file type is not supported
        }
      }

      try {
        setLoading(true);

        //@ts-expect-error
        for (const [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }
        let response = await fetch(`${apiUrl}/user-api/bank-document/`, {
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
          await response.json();
          showToast({
            message: `Files uploaded successfully`,
            type: 'info'
          });

          // add a tick in the stepper instead of red cross
          setApiFailedIcon(false);
          // change the step after click and submitting the data
          getRegistrationState();
        } else {
          showToast({
            message: 'Files upload failed!',
            type: 'error'
          });
        }
      } catch (error) {
        showToast({
          message: `Files upload failed!`,
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    } else {
      showToast({
        message: `Please drag and drop files to upload.`,
        type: 'info'
      });
    }
  };

  // to show "know more" text
  const handleKnowMoreButtonClick = () => {
    setShowKnowMore(prevState => !prevState);
  };

  //Digitap SDK PART
  const handleConnectClick = async () => {
    setIsLoading(true);
    if (demo) {
      window.open('https://aa.peedeefinvest.in/boost-money/login', '_blank', 'noopener,noreferrer');
    }

    try {
      const response = await fetch('/api/generate-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: 'accountaggregator',
          return_url: 'http://localhost:3000/register',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      router.push(data.url);
    } catch (error) {
      console.error(`Error generating URL, (${currentStep}):`, error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowKnowMore(false);
    }, 10000); // 10 seconds in milliseconds

    return () => {
      clearTimeout(timer);
    };
  }, [showKnowMore]);

  return (
    <div className="flex flex-col ">
      {!needManualUpload && (
        <div className="mb-10">
          <div className="w-full mx-2 flex-1 flex flex-row items-center justify-center">
            <div className="font-semibold  text-gray-300 text-sm text-center leading-8 uppercase">
              Unified Bank Interface
            </div>
            <div>
              <button
                onClick={handleKnowMoreButtonClick}
                className="text-indigo-600 font-medium mx-2 mr-5"
              >
                Know more
              </button>
            </div>
          </div>
          {showKnowMore && (
            <div className="text-gray-300 flex flex-row items-center text-base p-2 mx-auto  rounded-lg ">
              <div>
                In September 2016, the RBI has proposed setting up of an Account Aggregator (AA)
                that would act as a common platform which enables easy sharing of data from various
                entities with user consent. The Account Aggregator will help individuals share their
                financial data with third parties in a safe and secure manner, and give them greater
                control over how their data is being used. AA does not and cannot store any user’s
                data - thus, the potential for leakage and misuse of user’s data is prevented.
                Aggregators (AA) use technology to assist you in simple and secure exchange of your
                data between financial institutions like banks. This information cannot be shared
                without your consent. With AA, you can use your financial data to access a vast
                array of financial services for your personal or business needs.
              </div>
            </div>
          )}

          {iframeUrl ? (
            <iframe
              src={iframeUrl}
              width="100%"
              height="600px"
              className="border-0"
              title="Account Aggregator"
            ></iframe>
          ) : (
            <div className=' flex-col justify-between items-center my-5'>
              <ImageSlider/>
              <AA_videos />
            </div>
          )}
        </div>
      )}
      {/* if backend fails to get bank statements from the account aggregator then ask user to upload  */}
      {/* upload bank statements  */}
      {needManualUpload && (
        <div className="mb-5 mt-3 flex flex-col justify-center ">
          <div className="text-gray-200 flex flex-row items-center text-base2 p-2 mx-auto  rounded-lg ">
            <div>
              <svg
                className="w-5 h-5  mr-1"
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
            </div>
            <div>
              Account Aggregator Data Fetch Failed. Please upload 3 year Bank Statements of all your
              business accounts (xls,csv, pdf)
            </div>
          </div>
          {/* upload bank statements files  */}
          <div className="mb-5 mt-10 text-center ">
            <div className="text-start font-medium text-base2 text-gray-300">
              Upload your Bank Statements:
            </div>
            {/* dropzone (drag and drop box ) */}
            <div
              className="p-16 mt-3  mb-5 text-base2  text-gray-300 border border-dashed border-neutral-200"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag 'n' drop some files here, or click to select files</p>
              )}
            </div>

            {/* bank statements table  */}
            {files && files.length > 0 && (
              <div className="flex justify-center">
                <table>
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="p-3 text-sm text-gray-300 font-medium text-left">File Name</th>
                      <th className="p-3 text-sm text-gray-300 font-medium text-left">Password</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file, i) => (
                      <tr key={i}>
                        <td className="p-3 text-sm text-gray-300 font-medium text-left">
                          {file.file.name}
                        </td>

                        <td className="p-3 text-sm text-gray-200 font-medium">
                          <input
                            onChange={e => handleChange(e)}
                            //value={file.password || ""}
                            name="password"
                            placeholder={file.password || 'Enter password'}
                            className="py-1 w-full text-gray-100 border-b-2 bg-transparent outline-none focus:border-purple-600 transition-colors"
                            type="text"
                            autoComplete="new-password"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation controls  */}
      {currentStep !== steps.length && (
        <div className="container flex flex-col ">
          <div className="flex justify-center items-center mt-4 mb-8">
            {/* back button  */}
            {/* DIGITAP GENERATION OF URL */}
            {!needManualUpload && (
              <div className="flex justify-center items-center">
                <button
                  onClick={handleConnectClick}
                  className=" bg-teal-400 text-white px-4 mx-3 py-2 rounded-full transition-transform transform hover:scale-110"
                  disabled={isLoading}
                >
                  {isLoading ? '' : 'Connect Bank Accounts'}
                </button>
              </div>
            )}

            {/* next button  */}
            <button
              onClick={() => handleClick('next')}
              className="bg-[#1565c0] mx-3 text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer  hover:bg-[#2680e6] hover:text-white transition duration-200 ease-in-out"
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

export default BankDetails;
