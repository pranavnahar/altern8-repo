// get the ITR details of the user

import React, { useContext, useState, useCallback, useEffect } from 'react';
import { StepperContext } from '../../Contexts/StepperContext';
import { parseCookies } from 'nookies';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { useToast } from '../../utilities/show-toasts';

type Props = {
  demo: boolean;
};

const ITR = ({ demo }: Props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [userData, setUserData] = useState<{
    itrUsername: string;
    itrPassword: string;
  }>({
    itrUsername: '',
    itrPassword: '',
  });
  const { currentStep, setCurrentStep, steps, setLoading, getRegistrationState, setApiFailedIcon } =
    useContext(StepperContext);

  // if the system fails to get ITR via api
  // then user will manually uploads the data
  const [needManualUpload, setNeedManualUpload] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [filePasswords, setFilePasswords] = useState<{ [key: string]: string }>({
    fileName: '',
  });
  const [externalApiErrorCounts, setExternalApiErrorCounts] = useState(0);
  const { showToast } = useToast();

  // Handle token
  let accessToken = parseCookies().altern8_useraccessForRegister;

  const [passwordVisible, setPasswordVisible] = useState(false);

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const router = useRouter();

  const GetItrUsername = async () => {
    try {
      setLoading(true);
      let response = await fetch(`${apiUrl}/user-api/get-itr-username/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // if unauthorized then push to login page
      if (response.status === 401) {
        router.push('/login');
      }

      if (response.ok) {
        const responseData = await response.json();
        const panNumber = responseData.data;
        setUserData(prevData => ({
          ...prevData,
          itrUsername: panNumber,
        }));
      } else {
        console.log('Unable to fetch itr username');
      }
    } catch (error) {
      console.log('Unable to fetch itr username, (${currentStep}) :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!demo) {
      GetItrUsername();
    } else {
      setUserData({
        itrUsername: 'AFZPK7190K',
        itrPassword: ''
      });
    }
  }, []);

  // to handle click on next and back button
  const handleClick = async (direction?: string) => {
    let newStep = currentStep;

    if (direction !== 'next') {
      newStep--;
      setApiFailedIcon(false);
      setCurrentStep(newStep);
    } else if (direction === 'next') {
      if (demo) {
        router.push('/register?demo=true&step=7');
        return;
      }
      if (!needManualUpload) {
        let newRecord: { username: string; password: string } = {
          username: '',
          password: '',
        };
        newRecord.username = userData.itrUsername;
        newRecord.password = userData.itrPassword;
        if (newRecord.username.length !== 10) {
          showToast({
            message: `PAN Number or username must contain 10 digits`,
            type: 'warning'
          });
          return;
        }
        if (newRecord.password.length < 4) {
          showToast({
            message: `Please enter valid ITR password`,
            type: 'info'
          });
          return;
        }

        try {
          if (newRecord) {
            console.log(newRecord);
            const body = newRecord;
            setLoading(true);
            const response = await fetch(
              `${apiUrl}/scoreme-api/itr/external/fileautomatedrequest/validationcheck/`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(body),
              },
            );

            // if unauthorized then push to login page
            if (response.status === 401) {
              router.push('/login');
            }

            if (response.ok) {
              let serverMessage = await response.json();
              showToast({
                message: `Submission Successful`,
                type: 'info'
              });
              getRegistrationState();
            } else {
              let server_error = await response.json();
              setExternalApiErrorCounts(
                prevExternalApiErrorCounts => prevExternalApiErrorCounts + 1,
              );
              showToast({
                message: `Submission failed! ${server_error.message}`,
                type: 'error'
              });

              if (externalApiErrorCounts > 1) {
                setNeedManualUpload(true);
                setApiFailedIcon(true);
              }
            }
          }
        } catch (error) {
          showToast({
            message: `Submission failed, system error!`,
            type: 'info'
          });
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
    setFilePasswords({ fileName: '' });
  }, []);

  const handlePasswordChange = (fileName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    setFilePasswords(prevPasswords => ({
      ...prevPasswords,
      [fileName]: event.target.value,
    }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // handle file change
  const handleFileChange = async (acceptedFiles: File[]) => {
    const files = acceptedFiles;

    if (files && files.length > 0) {
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (
          file.type === 'application/pdf' ||
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
          if (file.size <= 5 * 1024 * 1024) {
            // Check if the file size is below 5MB
            formData.append(`files[${i}]`, file);

            // Add password or None if not provided
            const password = filePasswords.fileName || 'None';
            formData.append(`passwords[${i}]`, password);

            console.log(formData, file, password);
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

        let response = await fetch(`${apiUrl}/user-api/itr-document/`, {
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
            type: 'success'
          });
          setApiFailedIcon(false);
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

  // handle password visibility
  const handleShowPassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="flex flex-col">
      {!needManualUpload && (
        <div>
          {/* itr username field */}
          <div className="w-full mx-2 flex-1">
            <div className="font-semibold h-6 mt-3 text-gray-400 text-sm leading-8 uppercase">
              Username
            </div>
            <div className=" my-2 py-1 flex">
              <input
                onChange={handleChange}
                value={userData.itrUsername || ''}
                name="itrUsername"
                placeholder="ITR Username"
                className="py-1   uppercase w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
                type="text"
                autoComplete="new-password"
                required
              />
            </div>
          </div>
          <div className="w-full mx-2 flex-1">
            <div className="font-semibold h-6 mt-3 text-gray-400 text-sm leading-8 uppercase">
              Password
            </div>
            <div className=" my-2 py-1 relative">
              <input
                onChange={handleChange}
                value={userData.itrPassword || ''}
                name="itrPassword"
                placeholder="ITR Password"
                className="py-1 w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
                type={passwordVisible ? 'text' : 'password'}
                autoComplete="new-password"
                required
              />
              {passwordVisible && (
                <svg
                  className="w-6 h-6 absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 cursor-pointer"
                  aria-hidden="true"
                  onClick={handleShowPassword}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 7.8C6.7 6.3 9.2 5 12 5s5.3 1.3 7 2.8a12.7 12.7 0 0 1 2.7 3.2c.2.2.3.6.3 1s-.1.8-.3 1a2 2 0 0 1-.6 1 12.7 12.7 0 0 1-9.1 5c-2.8 0-5.3-1.3-7-2.8A12.7 12.7 0 0 1 2.3 13c-.2-.2-.3-.6-.3-1s.1-.8.3-1c.1-.4.3-.7.6-1 .5-.7 1.2-1.5 2.1-2.2Zm7 7.2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}

              {!passwordVisible && (
                <svg
                  className="w-6 h-6 absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 cursor-pointer"
                  aria-hidden="true"
                  onClick={handleShowPassword}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="m4 15.6 3-3V12a5 5 0 0 1 5-5h.5l1.8-1.7A9 9 0 0 0 12 5C6.6 5 2 10.3 2 12c.3 1.4 1 2.7 2 3.6Z" />
                  <path d="m14.7 10.7 5-5a1 1 0 1 0-1.4-1.4l-5 5A3 3 0 0 0 9 12.7l.2.6-5 5a1 1 0 1 0 1.4 1.4l5-5 .6.2a3 3 0 0 0 3.6-3.6 3 3 0 0 0-.2-.6Z" />
                  <path d="M19.8 8.6 17 11.5a5 5 0 0 1-5.6 5.5l-1.7 1.8 2.3.2c6.5 0 10-5.2 10-7 0-1.2-1.6-2.9-2.2-3.4Z" />
                </svg>
              )}
            </div>
          </div>
        </div>
      )}

      {/* if backend fails to get ITR data from the API then ask user to upload  */}
      {/* manual ITR data upload button  */}

      {needManualUpload && (
        <div className=" mt-3 flex flex-col justify-center ">
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
              Income Tax Data Fetch Failed. Please upload 3 year ITR of all your business accounts
              (xls,csv, pdf)
            </div>
          </div>
          {/* upload ITR files  */}
          <div className="mb-5 mt-10 text-center ">
            <div className="text-start font-medium text-base2 text-gray-300">
              Upload your ITR files:
            </div>
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
      )}
      {/* Display uploaded files and password inputs */}
      {files && files.length > 0 && (
        <div className="mt-2 mb-5">
          <div className="text-start font-medium text-base2 text-gray-300">
            Selected Files(Please enter file passwords if any):
          </div>
          <div className="flex ">
            <ul>
              {files.map((file: File, index: number) => (
                <li key={index} className="">
                  <div className="text-gray-200 flex flex-row items-center">
                    <span className="mr-4">
                      {index + 1}. {file.name}
                    </span>
                    <div className=" my-1 py-1 flex">
                      <input
                        onChange={e => handlePasswordChange(file.name, e)}
                        value={filePasswords.fileName || ''}
                        placeholder="Enter password if any"
                        className="py-1 w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
                        type="text"
                        autoComplete="new-password"
                        required
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Navigation controls  */}
      {currentStep !== steps.length && (
        <div className="container flex flex-col ">
          <div className="flex justify-center items-center mt-4 mb-8">
            {/* back button  */}

            {/* next button  */}
            <button
              onClick={() => handleClick('next')}
              className="bg-[#1565c0] text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer  hover:bg-[#2680e6] hover:text-white transition duration-200 ease-in-out"
            >
              Next
            </button>
          </div>
          {/* <HelpAndLogin /> */}
        </div>
      )}
    </div>
  );
};

export default ITR;
