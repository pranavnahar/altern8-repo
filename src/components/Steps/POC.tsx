import React, { useContext, useState, useEffect } from 'react';
import { StepperContext } from '../../Contexts/StepperContext';
import HelpAndLogin from '../Step-Component/HelpAndLogin';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import { Button } from '@mui/material';
import { IconChevronUpRight } from '@tabler/icons-react';
import { useToast } from '@/Utils/show-toasts';

type Props = {
  demo: boolean;
};

const POC = ({ demo }: Props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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
    name: '',
    email: '',
    phoneNumber: '',
    designation: '',
  });
  const { currentStep, setCurrentStep, steps, setLoading, getRegistrationState } =
    useContext(StepperContext);
  const router = useRouter();
  const { showToast } = useToast();

  // Handle token
  let accessToken = parseCookies().altern8_useraccessForRegister;

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
      let response = await fetch(`${apiUrl}/user-api/poc/`, {
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
      let response = await fetch(`${apiUrl}/user-api/phone-to-details/`, {
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
        console.log(responseData);

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
    }
  }, []);

  // const handleClick = async (direction?: string) => {
  //   let newStep = currentStep;
  //   if (direction !== "next") {
  //     newStep--;
  //     setCurrentStep(newStep);
  //   }
  // };

  const handleEditButtonClick = (id: string) => {
    // show edit poc details fields
    // Find the selected POC based on the ID
    const selectedPOC = pocDetails.find(poc => poc.id === id);
    console.log(selectedPOC);
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
      showToast(`Valid Name is required`, 'info');
      return;
    } else if (!validateEmail(userData.email)) {
      showToast(`Invalid email address`, 'info');
      return;
    } else if (!validatePhoneNumber(userData.phoneNumber)) {
      showToast(`Phone number must be a 10-digit number`, 'info');
      return;
    } else if (userData.designation.length < 3) {
      showToast(`Invalid designation`, 'info');
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
    console.log(bodyData);
    try {
      if (bodyData) {
        const body = bodyData;
        console.log(accessToken);
        setLoading(true);
        const response = await fetch(`${apiUrl}/user-api/poc/`, {
          method: 'PUT',
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
          console.log(`POC Form data submitted successfully!`, server_message);
          showToast(`Submission Successful`, 'info');

          //  update the poc details list
          GetPoc();
          // hide edit box
          setShowEditDetails(false);
        } else {
          let server_error = await response.json();
          console.error(`Failed to submit poc data`, server_error);

          showToast(`Submission failed!`, 'info');
        }
      }
    } catch (error) {
      console.error(
        `Error submitting POC form data, Error in fetching api, (${currentStep}) :`,
        error,
      );
      showToast(`Submission failed, system error!`, 'info');
    } finally {
      setLoading(false);
    }
  };

  const submitAddedPOC = async () => {
    if (!validateName(userData.name)) {
      showToast(`Valid Name is required`, 'info');
      return;
    } else if (!validateEmail(userData.email)) {
      showToast(`Invalid email address`, 'info');
      return;
    } else if (!validatePhoneNumber(userData.phoneNumber)) {
      showToast(`Phone number must be a 10-digit number`, 'info');
      return;
    } else if (userData.designation.length < 3) {
      showToast(`Please add a valid designation`, 'info');
      return;
    }
    const bodyData = {
      name: userData['name'].trim(),
      email: userData['email'].trim(),
      phone_number: userData['phoneNumber'].trim(),
      designation: userData['designation'].trim(),
      source: 'user_register_page',
    };
    console.log(bodyData);
    try {
      if (bodyData) {
        const body = bodyData;
        console.log(accessToken);
        setLoading(true);
        const response = await fetch(`${apiUrl}/user-api/poc/`, {
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
          console.log(`POC Form data submitted successfully!-- ${currentStep}`, server_message);

          showToast(`Submission Successful`, 'info');

          // update poc details list
          GetPoc();
          // close add details box
          setShowAddDetails(false);
        } else {
          let server_error = await response.json();
          console.error(`Failed to submit poc form data.`, server_error);

          showToast(`Submission failed!`, 'info');
        }
      }
    } catch (error) {
      console.error(
        `Error submitting poc form data, Error in fetching api :, (${currentStep}) :`,
        error,
      );
      showToast(`Submission failed, system error!`, 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleNextButtonClick = async () => {
    if (demo) {
      router.push('/register?demo=true&step=3');
      return;
    }
    if (pocDetails && pocDetails.length === 0) {
      await submitAddedPOC();
    } else if (pocDetails && pocDetails.length > 0) {
      getRegistrationState('Bank Details');
    } else {
      showToast(`Please add atleast one point of contact detail`, 'info');
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
            <table className="w-full  overflow-hidden">
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
                  <tr key={index} className="">
                    <td className="p-3 text-sm text-gray-300 font-medium">{poc.name}</td>
                    <td className="p-3 text-sm text-gray-300 font-medium text-center">
                      {poc.email}
                    </td>

                    <td className="p-3 text-sm text-gray-300 font-medium text-end">
                      {poc.phoneNumber}
                    </td>
                    <td className="p-3 text-sm text-gray-300 font-medium text-end">
                      {poc.designation}
                    </td>
                    <td className="py-3 text-sm text-gray-300 font-medium text-end">
                      <button
                        onClick={() => handleEditButtonClick(poc.id)}
                        className="bg-slate-700 hover:bg-slate-600  text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer   hover:text-white transition duration-200 ease-in-out"
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
              <Button
                onClick={handleAddButtonClick}
                style={{
                  backgroundColor: '#1565c0',
                  borderRadius: '25px', // Adjust the pixel value for the desired border radius
                }}
                variant="contained"
                endIcon={<IconChevronUpRight />}
              >
                Add poc
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
                  className="py-1    w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
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
              <Button
                onClick={submitEditedPOC}
                style={{
                  backgroundColor: '#1565c0',
                  borderRadius: '25px', // Adjust the pixel value for the desired border radius
                }}
                variant="contained"
                endIcon={<IconChevronUpRight />}
              >
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
              <div className="my-2 py-1 relative">
                <input
                  onChange={handleChange}
                  value={userData['email'] || ''}
                  name="email"
                  placeholder="Email"
                  className="py-1    w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
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
            {pocDetails && pocDetails.length > 0 && (
              <div className="flex  justify-center pt-8">
                <Button
                  onClick={submitAddedPOC}
                  style={{
                    backgroundColor: '#1565c0',
                    borderRadius: '25px',
                  }}
                  variant="contained"
                  endIcon={<IconChevronUpRight />}
                >
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
              <button
                onClick={() => handleNextButtonClick()}
                className="bg-[#1565c0] text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer  hover:bg-[#2680e6] hover:text-white transition duration-200 ease-in-out"
              >
                Next
              </button>
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
