// import React, { useState } from 'react';
// import LoadingSpinner from '../../components/LoadingSpinner';
// import { MultiSelect } from '../../components/ui/multi-select';
// import { Table, TableHeader, TableRow, TableCell, TableBody } from '../../components/ui/table';
// import { useGetGstList } from './use-gst-gstlist';
// import { Button } from '../../components/ui/button';
// import { apiUrl, getAccessToken } from '../../utils/auth';
// import { parseCookies } from 'nookies';
// import { useToast } from '../../utils/show-toasts';
// import { useRouter } from 'next/navigation';

// const GSTList = () => {
//   const [loadingSpinner,setLoadingSpinner] = useState(false);
//   const { gstList, message } = useGetGstList();
//   const [currentGstin, setCurrentGstin] = useState('');
//   console.log(currentGstin);
//   const [selectedGstin, setSelectedGstin] = useState<string[]>();
//   const [formData, setFormData] = useState({
//     gstin: '',
//   });
//   const router = useRouter()
//   const {showToast }= useToast()

//   const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const { value } = e.target;
//     setCurrentGstin(value);
//   };

//   const handleGstinChange = (selectedValues: string[]) => {
//     setSelectedGstin(selectedValues);
//     handleSelectChange({
//       //@ts-expect-error target types
//       target: {
//         name: 'currentGstin',
//         value: selectedValues[0] || '',
//       },
//     });
//   };

//   let accessToken = parseCookies().accessToken;

//   const ReplaceTokenOrRedirect = async () => {
//     // get new access token with help of Refresh token
//     const token = await getAccessToken();
//     // if not able to get the token then redirect to login
//     if (!token) {
//       router.push('/login');
//     } else {
//       accessToken = token;
//     }
//   };

//   const handleSubmitGstin = async () => {   if (formData.gstin.length < 10) {
//     showToast({
//       message: 'Please type a correct GSTIN number',
//       type: 'info'
//     });
//     return;
//   }

//   // submitting the data to backend
//   try {
//     // Set loading to true when starting the fetch
//     setLoadingSpinner(true);

//     let body = formData
//     // console.log(body);
//     let response = await fetch(`${apiUrl}/user-dashboard-api/change-primary-account/`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${accessToken}`,
//       },

//       body: JSON.stringify(body),
//     });

//     if (response.status === 401) {
//       await ReplaceTokenOrRedirect();
//       // Again try to fetch the data
//       response = await fetch(`${apiUrl}/user-dashboard-api/change-primary-account/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${accessToken}`,
//         },

//         body: JSON.stringify(body),
//       });
//     }

//     if (response.ok) {
//       await response.json();
//       showToast({
//         message: 'Successsfully updated GSTIN',
//         type: 'success'
//       });
//       console.log('GSTIN updated successfully');
//     } else {
//       await response.json();
//       showToast({
//         message: 'Failed to update GSTIN',
//         type: 'error'
//       });
//     }
//   } catch (error) {
//     showToast({
//       message: 'Server Connection Error updating GSTIN',
//       type: 'error'
//     });
//   } finally {
//     setLoadingSpinner(false);
//   }};

//   const handleAddGstinInputChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//   };

//   const gstinOptions = [...gstList.map(gstin => ({ label: gstin, value: gstin }))];

//   return (
//     <div className="max-w-2xl mx-auto mt-8">
//       {loadingSpinner && (
//         <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-600 bg-opacity-50">
//           <LoadingSpinner />
//         </div>
//       )}

//       <div className="mb-5 rounded-lg">
//         <h1 className="mb-3 text-lg font-medium tracking-tight text-center text-gray-200">
//           GST Number List
//         </h1>

//         {message === 'GST list fetched successfully' ? (
//           <>
//             <div className="mt-3">
//               <h3 className="text-base font-medium leading-8 text-gray-300">
//                 Already registered GST numbers:
//               </h3>
//               <Table className="my-2">
//                 <TableHeader className="card-cover">
//                   <TableRow>
//                     <TableCell className="text-gray-200">S.No.</TableCell>
//                     <TableCell className="text-gray-200">GSTIN</TableCell>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody className="border-b border-neutral-50/20">
//                   {gstList.map((gstin: string, index: number) => (
//                     <TableRow key={index}>
//                       <TableCell className="text-gray-200">{index + 1}</TableCell>
//                       <TableCell className="text-gray-200">{gstin}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>

//             <div className="h-6 mt-8 text-base font-medium leading-8 text-gray-300">
//               Select a GST Number to proceed with it:
//             </div>
//             <MultiSelect
//               options={gstinOptions}
//               onValueChange={handleGstinChange}
//               defaultValue={selectedGstin}
//               placeholder="Select GST Number"
//               className="w-full py-1 mt-5 text-gray-100 transition-colors bg-transparent outline-none focus:outline-none focus:border-purple-600"
//               variant="default"
//             />
//           </>
//         ) : (
//           <Table className="my-2">
//             <TableHeader className="card-cover">
//               <TableRow>
//                 <TableCell className="text-gray-200">S.No.</TableCell>
//                 <TableCell className="text-gray-200">GSTIN</TableCell>
//               </TableRow>
//             </TableHeader>
//             <TableBody className="border-b border-neutral-50/20">
//               <TableRow>
//                 <TableCell className="text-gray-200">-</TableCell>
//                 <TableCell className="text-gray-200">No Gst Available for this user</TableCell>
//               </TableRow>
//             </TableBody>
//           </Table>
//         )}

//         <div className="flex justify-center pt-5">
//           <Button
//             onClick={handleSubmitGstin}
//             className="text-white rounded hover:bg-white/10 animation bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700"
//             type="submit"
//             disabled={message !== 'GST list fetched successfully'}
//           >
//             Proceed
//           </Button>
//         </div>

//         <div className="h-6 mt-5 text-base font-medium leading-8 text-gray-300">
//           Add a new GSTIN Number:
//         </div>
//         <div className="flex-1 w-full">
//           <div className="flex py-1 my-2">
//             <input
//               onChange={handleAddGstinInputChange}
//               value={formData.gstin || ''}
//               name="gstin"
//               placeholder="GSTIN Number"
//               className="w-full py-1 text-gray-200 capitalize transition-colors bg-transparent border-b-2 outline-none focus:outline-none focus:border-purple-600 placeholder:text-sm"
//               type="text"
//               required
//             />
//           </div>
//         </div>

//         <div className="flex justify-center pt-5">
//           <Button
//             onClick={handleSubmitGstin}
//             className="text-white rounded bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 hover:bg-white/10"
//             type="submit"
//           >
//             Add
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GSTList;
// function showToast(arg0: { message: string; type: string; }) {
//   throw new Error('Function not implemented.');
// }

import React, { useState } from 'react';
import { MultiSelect } from '../../components/ui/multi-select';
import { Table, TableHeader, TableRow, TableCell, TableBody } from '../../components/ui/table';
import { useGetGstList } from './use-gst-gstlist';
import { Button } from '../../components/ui/button';
import { useToast } from '../../utils/show-toasts';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/utils/auth-actions';
import { parseCookies } from 'nookies';
import LoadingSpinner from '../LoadingSpinner';


const GSTList: React.FC = () => {
  const [selectedGstin, setSelectedGstin] = useState<string[]>([]);
  const [currentGstin, setCurrentGstin] = useState('');
  const [formData, setFormData] = useState({ gstin: '' });
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [step, setStep] = useState(0); // 0: initial, 1: username input, 2: OTP input
  const [addNewStep, setAddNewStep] = useState(0); // Separate state for adding new GSTIN flow

  const { processedGstList, unprocessedGstList, message, error, isLoading, sendOtp, verifyOtp } =
    useGetGstList();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { showToast } = useToast();
  const accessToken = parseCookies().accessToken;

  const handleGstinChange = (selectedValues: string[]) => {
    setSelectedGstin(selectedValues);
    setCurrentGstin(selectedValues[0] || '');
  };

  console.log('loading the page ans getting this: ', process.env.SERVER_URL);

  const handleAddGstinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const ReplaceTokenOrRedirect = async () => {
    const token = await getAuthToken();
    if (!token) {
      router.push('/login');
    }
    return token;
  };

  const handleProceed = () => {
    if (!currentGstin) return;
    setStep(1);
  };

  const handleAddNewGstinProceed = () => {
    if (!formData.gstin) return;
    setCurrentGstin(formData.gstin);
    setAddNewStep(1);
  };

  const handleSendOtp = async () => {
    try {
      await sendOtp(currentGstin, username);
      setOtpSent(true);
      setStep(1);
      showToast({
        message: 'OTP sent successfully. Please check your phone.',
        type: 'success',
      });
    } catch (error) {
      showToast({
        message: 'Failed to send OTP. Please try again.',
        type: 'error',
      });
    }
  };

  const handleSendOtpForNewGstin = async () => {
    try {
      await sendOtp(currentGstin, username);
      setOtpSent(true);
      setAddNewStep(1);
      showToast({
        message: 'OTP sent successfully. Please check your phone.',
        type: 'success',
      });
    } catch (error) {
      showToast({
        message: 'Failed to send OTP. Please try again.',
        type: 'error',
      });
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyOtp(currentGstin, otp);
      showToast({
        message: 'OTP verified successfully!',
        type: 'success',
      });

      // Here you can add the logic to submit the GSTIN
      await handleSubmitGstin();

      // Reset states
      setStep(0);
      setUsername('');
      setOtp('');
      setCurrentGstin('');
      setFormData({ gstin: '' });
    } catch (error) {
      showToast({
        message: 'Failed to verify OTP. Please try again.',
        type: 'error',
      });
    }
  };

  const handleVerifyOtpForNewGstin = async () => {
    try {
      await verifyOtp(currentGstin, otp);
      showToast({
        message: 'OTP verified successfully!',
        type: 'success',
      });

      // Here you can add the logic to submit the new GSTIN
      await handleSubmitGstin();

      // Reset states
      setAddNewStep(0);
      setUsername('');
      setOtp('');
      setCurrentGstin('');
      setFormData({ gstin: '' });
    } catch (error) {
      showToast({
        message: 'Failed to verify OTP. Please try again.',
        type: 'error',
      });
    }
  };

  const handleSubmitGstin = async () => {
    if (formData.gstin.length < 10) {
      showToast({
        message: 'Please type a correct GSTIN number',
        type: 'info',
      });
      return;
    }

    try {
      const body = formData;
      let response = await fetch(`${apiUrl}/user-dashboard-api/change-primary-account/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });

      if (response.status === 401) {
        const newToken = await ReplaceTokenOrRedirect();
        response = await fetch(`${apiUrl}/user-dashboard-api/change-primary-account/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newToken}`,
          },
          body: JSON.stringify(body),
        });
      }

      if (response.ok) {
        await response.json();
        showToast({
          message: 'Successfully updated GSTIN',
          type: 'success',
        });
      } else {
        await response.json();
        showToast({
          message: 'Failed to update GSTIN',
          type: 'error',
        });
      }
    } catch (error) {
      showToast({
        message: 'Server Connection Error updating GSTIN',
        type: 'error',
      });
    }
  };

  const unprocessedOptions = unprocessedGstList.map(gstin => ({
    label: gstin,
    value: gstin,
  }));
  const gstList = [...processedGstList, ...unprocessedGstList];

  return (
    <div className="max-w-2xl mx-auto mt-8">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">Error: {error}</div>
      ) : (
        <div className="mb-5 rounded-lg">
          <h1 className="mb-3 text-lg font-medium tracking-tight text-center text-gray-200">
            GST Number List
          </h1>

          {/* Processed GSTINs Table */}
          {processedGstList?.length > 0 ? (
            <div className="mt-3">
              <h3 className="text-base font-medium leading-8 text-gray-300">
                Already processed GSTIN:
              </h3>
              <Table className="my-2">
                <TableHeader className="card-cover">
                  <TableRow>
                    <TableCell className="text-gray-200">S.No.</TableCell>
                    <TableCell className="text-gray-200">GSTIN</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="border-b border-neutral-50/20">
                  {processedGstList.map((gstin, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-gray-200">{index + 1}</TableCell>
                      <TableCell className="text-gray-200">{gstin}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Table className="my-2">
              <TableHeader className="card-cover">
                <TableRow>
                  <TableCell className="text-gray-200">S.No.</TableCell>
                  <TableCell className="text-gray-200">GSTIN</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="border-b border-neutral-50/20">
                <TableRow>
                  <TableCell className="text-gray-200">-</TableCell>
                  <TableCell className="text-gray-200">No GST available for this user</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}

          {/* Unprocessed GSTINs Dropdown */}
          {unprocessedGstList.length > 0 ? (
            <>
              <div className="h-6 mt-8 text-base font-medium leading-8 text-gray-300">
                Select a GST Number to proceed with it:
              </div>
              <MultiSelect
                options={unprocessedOptions}
                onValueChange={handleGstinChange}
                defaultValue={selectedGstin}
                placeholder="Select GST Number"
                className="w-full py-1 mt-5 text-gray-100 transition-colors bg-white outline-none focus:outline-none focus:border-purple-600"
                variant="default"
                popoverClassName="bg-white text-black" // This will help style the popover
                commandItemClassName="hover:bg-gray-100 text-black"
              />
            </>
          ) : (
            <>
              <div className="h-6 mt-8 text-base font-medium leading-8 text-gray-300">
                Select a GST Number to proceed with it:
              </div>
              <MultiSelect
                options={unprocessedOptions}
                onValueChange={handleGstinChange}
                defaultValue={selectedGstin}
                placeholder="Select GST Number"
                className="w-full py-1 mt-5 text-gray-100 transition-colors bg-white outline-none focus:outline-none focus:border-purple-600"
                variant="default"
                popoverClassName="bg-white text-black" // This will help style the popover
                commandItemClassName="hover:bg-gray-100 text-black"
              />
            </>
          )}

          {/* Proceed Button for Unprocessed GSTIN */}
          {step === 0 && (
            <div className="flex justify-center pt-5">
              <Button onClick={handleSendOtp} className="text-white" disabled={!currentGstin}>
                Proceed
              </Button>
            </div>
          )}

          {/* Username Input for Unprocessed GSTIN */}
          {/* {step === 1 && (
            <div className="mt-5">
              <h3 className="text-base font-medium leading-8 text-gray-300">Enter Username:</h3>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full py-1 text-gray-200 transition-colors bg-transparent border-b-2 outline-none focus:outline-none focus:border-purple-600 placeholder:text-sm"
              />
              <div className="flex justify-center pt-5">
                <Button onClick={handleSendOtp} className="text-white" disabled={!username}>
                  Submit
                </Button>
              </div>
            </div>
          )} */}

          {/* OTP Input for Unprocessed GSTIN */}
          {step === 1 && otpSent && (
            <div className="mt-5">
              <h3 className="text-base font-medium leading-8 text-gray-300">
                Enter OTP sent to your phone:
              </h3>
              <input
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full py-1 text-gray-200 transition-colors bg-transparent border-b-2 outline-none focus:outline-none focus:border-purple-600 placeholder:text-sm"
              />
              <div className="flex justify-center pt-5">
                <Button onClick={handleVerifyOtp} className="text-white">
                  Verify OTP
                </Button>
              </div>
            </div>
          )}

          {/* Add New GSTIN Section */}
          <div className="mt-8">
            <h3 className="text-base font-medium leading-8 text-gray-300">Add New GSTIN:</h3>
            <input
              value={formData.gstin}
              onChange={handleAddGstinInputChange}
              name="gstin"
              placeholder="Enter GSTIN"
              className="w-full py-1 text-gray-200 transition-colors bg-transparent border-b-2 outline-none focus:outline-none focus:border-purple-600 placeholder:text-sm"
            />
            <div className="flex justify-center pt-5">
              <Button
                onClick={handleSendOtpForNewGstin}
                className="text-white"
                disabled={!formData.gstin}
              >
                Proceed
              </Button>
            </div>
          </div>

          {/* Add New GSTIN Username Input */}
          {/* {addNewStep === 1 && (
            <div className="mt-5">
              <h3 className="text-base font-medium leading-8 text-gray-300">
                Enter Username for New GSTIN:
              </h3>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full py-1 text-gray-200 transition-colors bg-transparent border-b-2 outline-none focus:outline-none focus:border-purple-600 placeholder:text-sm"
              />
              <div className="flex justify-center pt-5">
                <Button
                  onClick={handleSendOtpForNewGstin}
                  className="text-white"
                  disabled={!username}
                >
                  Submit
                </Button>
              </div>
            </div>
          )} */}

          {/* OTP Input for New GSTIN */}
          {addNewStep === 1 && otpSent && (
            <div className="mt-5">
              <h3 className="text-base font-medium leading-8 text-gray-300">
                Enter OTP for New GSTIN:
              </h3>
              <input
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full py-1 text-gray-200 transition-colors bg-transparent border-b-2 outline-none focus:outline-none focus:border-purple-600 placeholder:text-sm"
              />
              <div className="flex justify-center pt-5">
                <Button onClick={handleVerifyOtpForNewGstin} className="text-white">
                  Verify OTP
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GSTList;
