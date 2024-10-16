'use client';

import React, { FC, useState, useRef, useEffect, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { IconLogout, IconSend2, IconUserCircle } from '@tabler/icons-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import ChatBox from '@/components/mui/Chatbox';
import { fetchWithAuth } from '../../../utils/fetch-with-auth'; 
import { DashboardContext } from '../../../contexts/DashboardContext'; 
import { showToast } from '@/Helpers/show-toasts';
import { useRouter } from 'next/compat/router';
import { parseCookies } from 'nookies';
import { getAccessToken } from '../../../utils/auth'; 
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export const Navbar: FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showMessageBox, setShowMessageBox] = useState(false);

  const { chatCount, setChatCount } = useContext(DashboardContext);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // chatbot utils
  const handleChatClick = () => {
    setShowMessageBox(true);
    makeServerUnreadChatZero();
  };
  const handleCloseMessageBox = () => {
    setShowMessageBox(false);
  };

  const makeServerUnreadChatZero = async () => {
    try {
      const response = await fetchWithAuth(`/chat/user/read/`);

      if (response) {
        console.log('Unread messages set to zero successfully');
        setChatCount(0);
      } else {
        console.log('Error during setting unread messages to zero');
      }
    } catch (error) {
      console.log('Error during setting unread messages to zero:', error);
    }
  };

  // increase credit utils

  const [showGetMoreCreditBox, setShowGetMoreCreditBox] = useState(false); //show message box
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [userData, setUserData] = useState({
    amount: '',
    comments: '',
  });

  const [oldCreditRequests, setOldCreditRequests] = useState<{
    id: string;
    requested_amount: string;
    status: string;
    current_amount: string;
  }>();

  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState<File[] | null>(null);

  const [loadingSpinner, setLoadingSpinner] = useState(true); // for loading animation
  const router = useRouter();

  // Handle token
  let accessToken = parseCookies().accessToken; //access token from cookies

  // if not accessToken then ask for refresh token
  const ReplaceTokenOrRedirect = async () => {
    // get new access token with help of Refresh token
    const token = await getAccessToken();
    // if not able to get the token then redirect to login
    if (!token) {
      router!.push('/login');
    } else {
      accessToken = token;
    }
  };

  // get the past credit request detail from backend
  const GetOldCredit = async () => {
    try {
      if (!accessToken) {
        await ReplaceTokenOrRedirect();
      }

      let response = await fetch(`${apiUrl}/user-dashboard-api/get-more-credit/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        await ReplaceTokenOrRedirect();
        // Again try to fetch the data
        response = await fetch(`${apiUrl}/user-dashboard-api/get-more-credit/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }

      // if (response.ok) {
      if (true) {
        // const responseData = await response.json();
        const responseData = {
          id: 12,
          user_amount: '600000.00',
          admin_amount: '0.00',
          limit_status: 'Pending for Maker',
          comments: 'required for loan amount',
          created_at: '2024-09-30T12:25:47.326118+05:30',
          modified_at: '2024-09-30T12:25:47.333588+05:30',
          uid: 'YSRBRV6195',
          maker: null,
          checker: null,
          current_amount: 320000,
        };
        let newData = {
          id: responseData['id'],
          requested_amount: parseInt(responseData['user_amount']),
          current_amount: responseData['current_amount'],
          comments: responseData['comments'],
          status: responseData['limit_status'],
        };
        // @ts-ignore
        setOldCreditRequests(newData);
      } else {
        console.log("user don't have any old credit request details");
      }
    } catch (error) {
      console.log("user don't have any old credit request details");
    } finally {
    }
  };

  useEffect(() => {
    GetOldCredit();
  }, []);

  useEffect(() => {
    GetOldCredit();
  }, [showGetMoreCreditBox]);

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value.replace(/\D/g, ''); // Remove non-numeric characters

    // Format the amount with commas

    formattedValue = formattedValue.replace(/(\d)(?=(\d\d)+\d$)/g, '$1,');

    setUserData({ ...userData, [name]: formattedValue });
  };

  const handleGetMoreCreditSubmit = async () => {
    // e.preventDefault();
    const newErrors = {};

    // Validate the amount length
    const amount = userData['amount']?.trim() || '';
    if (amount.length <= 2) {
      showToast('Please enter a valid amount', 'info');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('amount', amount);
      formData.append('comments', userData['comments']?.trim() || '');

      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (
            file.type === 'application/pdf' ||
            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          ) {
            if (file.size <= 5 * 1024 * 1024) {
              // Check if the file size is below 5MB
              formData.append('files', file); // Append each file to the FormData object
            } else {
              showToast('File size exceeds 5MB limit. Please choose a smaller file.', 'info');
              return; // Stop processing files if size limit exceeded
            }
          } else {
            showToast('Please choose PDF or Excel files only.', 'info');
            return; // Stop processing files if file type is not supported
          }
        }
      } else {
        showToast('Please drag and drop files to upload.', 'info');
        return;
      }

      // Send the form data to the server
      setLoadingSpinner(true);

      let response = await fetch(`${apiUrl}/user-dashboard-api/get-more-credit/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.status === 401) {
        await ReplaceTokenOrRedirect();
        // Again try to fetch the data
        response = await fetch(`${apiUrl}/user-dashboard-api/get-more-credit/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        });
      }

      if (response.ok) {
        await response.json();
        showToast('Request submitted successfully', 'info');
        // Handle successful submission, e.g., reset form
        setUserData({ amount: '', comments: '' });
        setFiles(null);
        GetOldCredit();
      } else {
        const serverError = await response.json();
        showToast('Request submission failed, server error', 'info');
      }
    } catch (error) {
      console.log('error', error);
      showToast('Request submission failed, system error', 'info');
    } finally {
      setLoadingSpinner(false);
    }
  };

  const handleGetMoreCreditOpen = () => {
    setShowGetMoreCreditBox(true);
  };

  const handleGetMoreCreditClose = () => {
    setShowGetMoreCreditBox(false);
  };

  // handle file upload and drag and drop

  const onDrop = useCallback(async (acceptedFiles: any) => {
    // Do something with the files
    console.log(acceptedFiles);
    showToast('Files uploaded successfully');
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <nav className="shadow-lg bg-white/10 z-20 backdrop-blur-md">
      <div className="px-4 mx-auto">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white"></Link>
            </div>
          </div>
          <div className="flex gap-5 items-center">
            {/* increase credit */}
            <Dialog>
              <DialogTrigger>
                <Button
                  //@ts-expect-error variant type
                  variant="expandIcon"
                  Icon={IconSend2}
                  size={'sm'}
                  iconPlacement="right"
                  className="text-sm text-white bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700"
                  onClick={handleGetMoreCreditOpen}
                >
                  Increase Credit
                </Button>
              </DialogTrigger>
              {/* Increase Credit modal box */}
              <DialogContent className="border-none none p-0 h-5/5 w-4/5">
                {showGetMoreCreditBox && (
                  <div className="flex w-full h-full items-center justify-center ">
                    <div className=" flex w-full h-full flex-col  rounded-lg shadow-lg outline-none focus:outline-none [background:linear-gradient(269.75deg,_#011049,_#19112f_25.75%,_#251431_51.79%,_#301941_64.24%,_#6e3050)]">
                      {/* Header */}
                      <div className="flex items-start justify-between p-5 rounded-t">
                        <h3 className="text-2xl font-semibold text-white">Get More Credit</h3>
                        <DialogTrigger asChild>
                          <Button
                            size={'sm'}
                            className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none focus:outline-none"
                            onClick={handleGetMoreCreditClose}
                          >
                            <span className="block w-6 h-6 text-2xl text-gray-200 bg-transparent outline-none focus:outline-none">
                              ×
                            </span>
                          </Button>
                        </DialogTrigger>
                      </div>
                      {/* Body */}
                      <div className=" flex-auto p-6">
                        {/* name field  */}
                        <div className="flex-1 w-full">
                          <div className="h-6 mt-3 text-xs font-bold leading-8 text-gray-400 uppercase">
                            Amount Required (₹)
                          </div>
                          <div className="flex py-1 my-2">
                            <input
                              onChange={handleAmountChange}
                              value={userData['amount'] || ''}
                              name="amount"
                              placeholder="amount"
                              className="w-full py-1 text-gray-100 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
                              type="text"
                              required
                            />
                          </div>
                        </div>

                        {/* email field  */}
                        <div className="flex-1 w-full">
                          <div className="h-6 mt-3 text-xs font-bold leading-8 text-gray-400 uppercase">
                            Comments
                          </div>
                          <div className="flex py-1 my-2">
                            <textarea
                              //@ts-expect-error onchange
                              onChange={handleChange}
                              value={userData['comments'] || ''}
                              name="comments"
                              placeholder="Comments"
                              className="w-full py-1 text-gray-100 transition-colors bg-transparent border-b-2 outline-none appearance-none resize-none focus:outline-none focus:border-purple-600" // Added `resize-none` class to prevent resizing
                            />
                          </div>
                        </div>

                        <div className="flex flex-col justify-center mt-3 mb-5 ">
                          {/* upload accounting files  */}
                          <div className="mt-10 mb-5 text-center ">
                            <div className="font-medium text-gray-300 text-start text-base2">
                              Upload your related files:
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

                        {/* old credit request  */}
                        {oldCreditRequests && (
                          <div className="col-span-4 pb-5 mt-5 mr-5 rounded-lg">
                            <div className="flex items-center px-2 pt-3 ">
                              <div className="flex-grow text-xl font-medium text-center text-gray-300">
                                Past Credit Requests
                              </div>
                            </div>
                            <div className="rounded-lg ">
                              <table className="w-full overflow-hidden rounded-lg">
                                <thead className="overflow-hidden border-b-2 border-gray-400 rounded-lg ">
                                  <tr>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-200">
                                      Request ID
                                    </th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-200">
                                      Requested Amount
                                    </th>

                                    <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-200">
                                      Status
                                    </th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-200">
                                      Current Amount
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="">
                                    <td className="p-3 text-sm font-medium text-gray-300">
                                      {oldCreditRequests?.id}
                                    </td>
                                    <td className="p-3 text-sm font-medium text-gray-400 whitespace-nowrap hover:text-gray-300">
                                      ₹ {oldCreditRequests?.requested_amount?.toLocaleString()}
                                    </td>

                                    <td className="p-3 text-sm font-medium text-gray-400 whitespace-nowrap hover:text-gray-300">
                                      {oldCreditRequests?.status === 'Pending for Maker' ||
                                      oldCreditRequests?.status === 'Pending for Checker'
                                        ? 'Pending for Approval'
                                        : oldCreditRequests?.status}
                                    </td>
                                    <td className="p-3 text-sm font-medium text-gray-400 whitespace-nowrap hover:text-gray-300">
                                      ₹ {oldCreditRequests?.current_amount?.toLocaleString()}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Footer */}
                      <div className="flex items-center justify-end p-6 rounded-b">
                        <Button
                          style={{
                            backgroundColor: '#1565c0',
                            borderRadius: '25px', // Adjust the pixel value for the desired border radius
                            marginRight: '20px',
                          }}
                          variant="secondary"
                          onClick={handleGetMoreCreditSubmit}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* chatbox */}

            <div>
              <div className=" text-center">
                <Button
                  //@ts-expect-error variant type
                  variant="expandIcon"
                  Icon={IconSend2}
                  size={'sm'}
                  iconPlacement="right"
                  className="text-sm text-white bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700"
                  onClick={handleChatClick}
                >
                  Chat With Admin
                </Button>
                {showMessageBox && (
                  <ChatBox onClose={handleCloseMessageBox} showMessageBox={showMessageBox} />
                )}
              </div>
            </div>
            {/* login/logout  */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                onClick={toggleDropdown}
                className="flex items-center justify-center w-10 h-10 card-cover rounded-full dark:bg-gray-700 focus:outline-none"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconUserCircle className="w-6 h-6 text-gray-600 dark:text-gray-300 card-cover" />
              </motion.button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 z-50 overflow-hidden rounded-lg shadow-md p-5 min-w-max top-16 bg-zinc-200/90 backdrop-blur-md"
                  >
                    <div className="flex items-center">
                      <div className="grid gap-3">
                        <div className="flex">
                          <img
                            src="https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ2l0aHViL2ltZ18yYVU0VUpvY3hEQkk5Z2JiSzZzcGtGcEhBTmwifQ?width=80"
                            alt="Profile Picture"
                            className="top-0 mb-auto mr-5 rounded-full size-10"
                          />
                          <div>
                            <h2 className="text-lg font-medium">Anurag Das</h2>
                            <p className="text-sm font-medium text-zinc-500 -mt-1">oeuvars</p>
                          </div>
                        </div>
                        <Separator className="opacity-70" />
                        <Link href="/developer-entry" className="w">
                          <Button
                            size="sm"
                            className="text-xs text-white w-full"
                            //variant="expandIcon"
                            //Icon={IconLogout}
                            //iconPlacement="right"
                          >
                            Sign Out
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
