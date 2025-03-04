import React, { useContext, useState, useEffect } from 'react';
import { StepperContext } from '../../contexts/stepper-context';
import HelpAndLogin from '../Step-Component/HelpAndLogin';
import { useRouter } from 'next/navigation';
import { useToast } from '../../utils/show-toasts';
import { Button } from '../ui/button';
import { getAuthToken } from '@/utils/auth-actions';
import { IconLoader2 } from '@tabler/icons-react';

type Props = {
  demo: boolean;
};

type OtpResponse = {
  message: string;
  otp_id: number;
  is_email_verified: boolean;
};

const POC = ({ demo }: Props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [otpAvailable, setOtpAvailable] = useState(false);
  const [otpId, setOtpId] = useState<number | null>(null);
  const [enteredOtp, setEnteredOtp] = useState<string | null>(null);
  const [isOtpSubmitting, setIsOtpSubmitting] = useState(false);
  const [otpSubmitSuccess, setOtpSubmitSuccess] = useState(false);
  const [isEmailFieldLoading, setEmailFieldLoading] = useState(false);
  const [showEditDetails, setShowEditDetails] = useState(false);
  const [showAddDetails, setShowAddDetails] = useState(false);
  const [pocDetails, setPocDetails] = useState<
    {
      id: string;
      name: string;
      email: string;
      phoneNumber: string;
      designation: string;
    }[]
  >([]); // to show previous poc details
  const [currentPocId, setCurrentPocId] = useState(''); // to show previous poc details

  const [userData, setUserData] = useState({
    name: 'Vivek Kumar',
    email: 'vivek@mail.com',
    phoneNumber: '',
    designation: '',
  });
  const { currentStep, setCurrentStep, steps, setLoading, getRegistrationState } =
    useContext(StepperContext);
  const router = useRouter();
  const { showToast } = useToast();

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // validations
  const validateName = (name: string) => {
    name = name.trim();
    const nameRegex = /^[a-zA-Z ]{2,}$/;
    return nameRegex.test(name);
  };

  const validateEmail = (email: string) => {
    email = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    phoneNumber = phoneNumber.trim();
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const GetPoc = async () => {
    try {
      setLoading(true);
      const token = await getAuthToken();
      let response = await fetch(`${apiUrl}/user-api/poc/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        const newPocDetails = responseData.map(
          (poc: {
            id: string;
            name: string;
            email: string;
            phone_number: string;
            designation: string;
          }) => ({
            id: poc.id,
            name: poc.name || '',
            email: poc.email || '',
            phoneNumber: poc.phone_number || '',
            designation: poc.designation || '',
          }),
        );

        if (newPocDetails.length < 1) {
          setShowAddDetails(true);
        }
        setPocDetails(() => [...newPocDetails]);
      } else {
        console.log("user don't have any poc details");
      }
    } catch (error) {
      console.log(`user don't have any poc details, (${currentStep}) :`, error);
    } finally {
      setLoading(false);
    }
  };

  const GetFetchedPersonalDetails = async () => {
    try {
      setLoading(true);
      const token = await getAuthToken();
      let response = await fetch(`${apiUrl}/user-api/phone-to-details/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        const { first_name, last_name, email, phone_number, designation } = responseData[0] || {};

        setUserData({
          name: `${first_name || ''} ${last_name || ''}`,
          email: email || '',
          phoneNumber: phone_number || '',
          designation: designation || '',
        });

        setShowAddDetails(true);
      } else {
        console.log("user don't have any poc details");
      }
    } catch (error) {
      console.log(`user don't have any poc details, (${currentStep}) :`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!demo) {
      GetFetchedPersonalDetails();
      GetPoc();
    } else {
      setUserData({
        name: 'Anurag Das',
        email: 'oeuvars@gmail.com',
        phoneNumber: '8335924401',
        designation: '',
      });

      setShowAddDetails(true);
    }
  }, []);

  const handleEditButtonClick = (id: string) => {
    // show edit poc details fields
    // Find the selected POC based on the ID
    const selectedPOC = pocDetails.find(poc => poc.id === id);
    if (selectedPOC) {
      // Set the userData state with the selected POC data
      setUserData({
        name: selectedPOC.name,
        email: selectedPOC.email,
        phoneNumber: selectedPOC.phoneNumber,
        designation: selectedPOC.designation,
      });

      setCurrentPocId(id);
      setShowEditDetails(true);
      setShowAddDetails(false);
    } else {
      console.error('POC with ID', id, 'not found.');
    }
  };
  const handleAddButtonClick = () => {
    // show add poc details fields
    // Set the userData state with the selected POC data
    setUserData({
      name: '',
      email: '',
      phoneNumber: '',
      designation: '',
    });
    setShowAddDetails(true);
    setShowEditDetails(false);
  };

  const submitEditedPOC = async () => {
    // edit particular poc detail and submit to backend

    // Validate Name
    if (!validateName(userData.name)) {
      showToast({
        message: `Valid Name is required`,
        type: 'info',
      });
      return;
    } else if (!validateEmail(userData.email)) {
      showToast({
        message: `Invalid email address`,
        type: 'info',
      });
      return;
    } else if (!validatePhoneNumber(userData.phoneNumber)) {
      showToast({
        message: `Phone number must be a 10-digit number`,
        type: 'info',
      });
      return;
    } else if (userData.designation.length < 3) {
      showToast({
        message: `Invalid designation`,
        type: 'info',
      });
      return;
    }

    const bodyData = {
      id: currentPocId,
      name: userData['name'].trim(),
      email: userData['email'].trim(),
      phone_number: userData['phoneNumber'].trim(),
      designation: userData['designation'].trim(),
      source: 'user_register_page',
    };
    try {
      if (bodyData) {
        const token = await getAuthToken();
        const body = bodyData;
        setLoading(true);
        const response = await fetch(`${apiUrl}/user-api/poc/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          showToast({
            message: `Submission Successful`,
            type: 'info',
          });
          GetPoc();
          setShowEditDetails(false);
        } else {
          showToast({
            message: `Submission failed, please try again!`,
            type: 'info',
          });
        }
      }
    } catch (error) {
      showToast({
        message: `Submission failed, system error!`,
        type: 'info',
      });
    } finally {
      setLoading(false);
    }
  };

  const submitAddedPOC = async () => {
    if (demo) {
      router.push('register?demo=true&step=3');
      return;
    }
    if (!validateName(userData.name)) {
      showToast({
        message: `Valid Name is required`,
        type: 'info',
      });
      return;
    } else if (!validateEmail(userData.email)) {
      showToast({
        message: `Invalid email address`,
        type: 'info',
      });
      return;
    } else if (!validatePhoneNumber(userData.phoneNumber)) {
      showToast({
        message: `Phone number must be a 10-digit number`,
        type: 'info',
      });
      return;
    } else if (userData.designation.length < 3) {
      showToast({
        message: `Please add a valid designation`,
        type: 'info',
      });
      return;
    }
    const bodyData = {
      name: userData['name'].trim(),
      email: userData['email'].trim(),
      phone_number: userData['phoneNumber'].trim(),
      designation: userData['designation'].trim(),
      source: 'user_register_page',
    };
    try {
      if (bodyData) {
        const body = bodyData;
        const token = await getAuthToken();
        const response = await fetch(`${apiUrl}/user-api/poc/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
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
            type: 'info',
          });
          GetPoc();
          setShowAddDetails(false);
        } else {
          showToast({
            message: `Submission failed!`,
            type: 'info',
          });
        }
      }
    } catch (error) {
      showToast({
        message: `Submission failed, system error!`,
        type: 'info',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNextButtonClick = async () => {
    if (demo) {
      setShowAddDetails(false);
      setPocDetails([
        {
          id: '1',
          name: 'Anurag Das',
          email: 'oeuvars@gmail.com',
          phoneNumber: '8335924401',
          designation: 'Manager',
        },
      ]);
      setShowAddDetails(true);
      return;
    }
    if (pocDetails && pocDetails.length === 0) {
      await submitAddedPOC();
    } else if (pocDetails && pocDetails.length > 0) {
      getRegistrationState('Bank Details');
    } else {
      showToast({
        message: `Please add atleast one point of contact detail`,
        type: 'info',
      });
    }
  };

  const handleEmailVerifySubmit = async () => {
    setEmailFieldLoading(true);
    const email = userData['email'];
    console.log('the email to be sent to verification is this: ', email);
    const token = await getAuthToken();

    try {
      const response = await fetch(`${apiUrl}/surepass-api/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        showToast({
          message: `Email verification failed, please retry..`,
          type: 'error',
        });
        return;
      }

      const data: OtpResponse = await response.json();

      setOtpAvailable(true);
      setOtpId(data.otp_id);
      showToast({
        message: `An OTP was sent to the email you entered, please enter that below`,
        type: 'success',
      });
    } catch (error) {
      showToast({
        message: `An unexpected error occurred, please retry..`,
        type: 'error',
      });
      console.error('Error:', error);
    } finally {
      setEmailFieldLoading(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredOtp(e.target.value);
  };

  const handleSubmitOTP = async () => {
    if (!enteredOtp) {
      showToast({ message: 'Please enter the OTP.', type: 'error' });
      return;
    }
    console.log('the otp is is this: ', otpId, enteredOtp);

    setIsOtpSubmitting(true);

    try {
      const token = await getAuthToken();
      const response = await fetch(`${apiUrl}/surepass-api/verify_otp/${otpId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email_otp: enteredOtp, email: userData['email'] }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showToast({ message: errorData.message || 'OTP verification failed.', type: 'error' });
        setOtpSubmitSuccess(false);
      } else {
        const data = await response.json();
        showToast({ message: 'OTP verified successfully!', type: 'success' });
        setOtpSubmitSuccess(true);
        setOtpAvailable(false);
      }
    } catch (error) {
      showToast({ message: 'Something went wrong. Please try again.', type: 'error' });
    } finally {
      setIsOtpSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* show  poc details  */}

      <div className="">
        <div className="">
          <div className="flex justify-center items-center ">
            <div className="text-center mb-3 font-medium text-gray-200 text-base2">
              Point of contact details
            </div>
          </div>

          {pocDetails.length > 0 && (
            <table className="w-[75%] mx-auto overflow-hidden">
              <thead className=" border-b-2 border-gray-400  overflow-hidden">
                <tr>
                  <th className="p-3 text-sm text-gray-300 font-semibold tracking-wide text-left">
                    Name
                  </th>
                  <th className="p-3 text-sm text-gray-300  font-semibold tracking-wide text-center">
                    Email
                  </th>
                  <th className="p-3 text-sm text-gray-300  font-semibold tracking-wide text-end">
                    Phone Number
                  </th>
                  <th className="p-3 text-sm text-gray-300  font-semibold tracking-wide text-end">
                    Designation
                  </th>
                  <th className="p-3 text-sm text-gray-300  font-semibold tracking-wide text-end">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {pocDetails.map((poc, index) => (
                  <tr key={index} className={``}>
                    <td
                      className={`p-3 text-sm font-medium ${
                        index === 0 ? 'text-blue-400' : 'text-gray-300'
                      }`}
                    >
                      {poc.name}
                    </td>
                    <td
                      className={`p-3 text-sm font-medium text-center ${
                        index === 0 ? 'text-blue-400' : 'text-gray-300'
                      }`}
                    >
                      {poc.email}
                    </td>
                    <td
                      className={`p-3 text-sm font-medium text-end ${
                        index === 0 ? 'text-blue-400' : 'text-gray-300'
                      }`}
                    >
                      {poc.phoneNumber}
                    </td>
                    <td
                      className={`p-3 text-sm font-medium text-end ${
                        index === 0 ? 'text-blue-400' : 'text-gray-300'
                      }`}
                    >
                      {poc.designation}
                    </td>
                    <td className="py-3 text-sm text-gray-300 font-medium text-end">
                      <button
                        onClick={() => handleEditButtonClick(poc.id)}
                        className="bg-slate-700 hover:bg-blue-600  text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer   hover:text-white transition duration-200 ease-in-out"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!showEditDetails && !showAddDetails && (
            <div className="flex  justify-center pt-8">
              <Button onClick={handleAddButtonClick} size="sm">
                Add Another poc
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* edit details */}
      {showEditDetails && (
        <div className="flex justify-center items-center">
          <div className="w-3/4">
            <div className="w-full mx-2 flex-1">
              <div className="font-semibold h-6 mt-3 text-gray-400 text-sm leading-8 uppercase">
                Name
              </div>
              <div className="my-2 py-1 flex">
                <input
                  onChange={handleChange}
                  value={userData['name'] || ''}
                  name="name"
                  placeholder="name"
                  className="py-1 placeholder:text-white  w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
                  type="text"
                  required
                />
              </div>
            </div>
            <div className="w-full mx-2 flex-1">
              <div className="font-semibold h-6 mt-3 text-gray-400 text-sm leading-8 uppercase">
                Email
              </div>
              <div className="my-2 py-1 relative">
                <input
                  onChange={handleChange}
                  value={userData['email'] || ''}
                  name="email"
                  placeholder="Email"
                  className="py-1 w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
                  type="email"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
            <div className="w-full mx-2 flex-1">
              <div className="font-semibold h-6 mt-3 text-gray-400 text-sm leading-8 uppercase">
                Phone Number
              </div>
              <div className="my-2 py-1 relative">
                <input
                  onChange={handleChange}
                  value={userData['phoneNumber'] || ''}
                  name="phoneNumber"
                  placeholder="Phone Number"
                  className="py-1    w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
                  type="number"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
            <div className="w-full mx-2 flex-1">
              <div className="font-semibold h-6 mt-3 text-gray-400 text-sm leading-8 uppercase">
                Designation
              </div>
              <div className="my-2 py-1 flex">
                <input
                  onChange={handleChange}
                  value={userData['designation'] || ''}
                  name="designation"
                  placeholder="designation"
                  className="py-1  w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
                  type="text"
                  required
                />
              </div>
            </div>
            <div className="flex  justify-center pt-8">
              <Button onClick={submitEditedPOC} size="sm">
                Submit Details
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* add poc details */}
      {showAddDetails && (
        <div className="flex justify-center items-center">
          <div className="w-3/4">
            <div className="w-full mx-2 flex-1">
              <div className="font-semibold h-6 mt-3 text-gray-400 text-sm leading-8 uppercase">
                Name
              </div>
              <div className="my-2 py-1 flex">
                <input
                  onChange={handleChange}
                  value={userData['name'] || ''}
                  name="name"
                  placeholder="name"
                  className="py-1  w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
                  type="text"
                  required
                />
              </div>
            </div>
            <div className="w-full mx-2 flex-1">
              <div className="font-semibold h-6 mt-3 text-gray-400 text-sm leading-8 uppercase">
                Email
              </div>
              <div className="my-2 py-1 relative flex items-center">
                <input
                  onChange={handleChange}
                  value={userData['email'] || ''}
                  name="email"
                  placeholder="Email"
                  className="py-1
                    w-full
                  text-gray-100 border-b-2 bg-transparent outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
                  type="email"
                  autoComplete="new-password"
                  required
                />
                
              </div>
            </div>

            {!otpAvailable && !otpSubmitSuccess && (
                  <Button
                    onClick={handleEmailVerifySubmit}
                    className="text-sm ml-2"
                  >
                    {isEmailFieldLoading ? (
                      <IconLoader2 className="animate-spin mr-2" size={18} />
                    ) : (
                      'Verify'
                    )}
                  </Button>
                )}

            {otpAvailable && (
              <div className="w-full mx-2 flex-1">
                <div className="font-semibold h-6 mt-3 text-gray-400 text-sm leading-8 uppercase">
                  Enter the OTP
                </div>
                <div className="my-2 py-1 relative flex items-center">
                  <input
                    name="otp"
                    onChange={handleOtpChange}
                    className="py-1 text-gray-100 border-b-2 bg-transparent outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
                    type="text"
                    required
                  />
                  <Button
                    onClick={handleSubmitOTP}
                    className="ml-2 px-3 py-0 text-sm"
                    disabled={isOtpSubmitting}
                  >
                    {isOtpSubmitting ? (
                      <IconLoader2 className="animate-spin mr-2" size={18} />
                    ) : (
                      'Submit'
                    )}
                  </Button>
                </div>
              </div>
            )}

            <div className="w-full mx-2 flex-1">
              <div className="font-semibold h-6 mt-3 text-gray-400 text-sm leading-8 uppercase">
                Phone Number
              </div>
              <div className="my-2 py-1 relative">
                <input
                  onChange={handleChange}
                  value={userData['phoneNumber'] || ''}
                  name="phoneNumber"
                  placeholder="Phone Number"
                  className="py-1    w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
                  type="number"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
            <div className="w-full mx-2 flex-1">
              <div className="font-semibold h-6 mt-3 text-gray-400 text-sm leading-8 uppercase">
                Designation
              </div>
              <div className="my-2 py-1 flex">
                <input
                  onChange={handleChange}
                  value={userData['designation'] || ''}
                  name="designation"
                  placeholder="designation"
                  className="py-1  w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
                  type="text"
                  required
                />
              </div>
            </div>
            {pocDetails && pocDetails.length > 0 && (
              <div className="flex  justify-center pt-8">
                <Button onClick={submitAddedPOC} size="sm">
                  Add Details
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation controls  */}
      {currentStep !== steps.length && (
        <div className="container flex flex-col  mt-10">
          <div className="flex justify-center items-center mt-4 mb-8">
            {/* back button  */}
            <div>
              <Button
                onClick={() => handleNextButtonClick()}
                className="bg-[#1565c0] text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer  hover:bg-[#2680e6] hover:text-white transition duration-200 ease-in-out"
              >
                Next
              </Button>
            </div>

            {/* button for submitting edited details  */}
          </div>
          <HelpAndLogin />
        </div>
      )}
    </div>
  );
};

export default POC;
