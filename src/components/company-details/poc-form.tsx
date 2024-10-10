// This is a dashboard page component getting point of contact person details

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import { showToast } from '../../Helpers/show-toasts';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import { getAccessToken } from '../../utils/auth';
import LoadingSpinner from '../../components/LoadingSpinner';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// main return page
const PocForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    designation: '',
    otp: '',
  });
  const [pocDetails, setPocDetails] = useState<
    {
      id: string;
      name: string;
      email: string;
      phone_number: string;
      designation: string;
      is_primary: string;
    }[]
  >([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [loadingSpinner, setLoadingSpinner] = useState(true);
  const [currentPrimaryPoc, setCurrentPrimaryPoc] = useState('');
  const router = useRouter();

  // Handle token
  let accessToken = parseCookies().accessToken;

  const ReplaceTokenOrRedirect = async () => {
    const token = await getAccessToken();
    if (!token) {
      router.push('/login');
    } else {
      accessToken = token;
    }
  };

  // handle form input for phone number and otp
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [name]: value });
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    setCurrentPrimaryPoc(value);
  };

  // get the POC detail from backend
  const GetPoc = async () => {
    try {
      if (!accessToken) {
        await ReplaceTokenOrRedirect();
      }

      let response = await fetch(`${apiUrl}/user-api/poc/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        await ReplaceTokenOrRedirect();
        response = await fetch(`${apiUrl}/user-api/poc/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }

      if (response.ok) {
        const responseData = await response.json();
        // console.log(responseData);
        const newPocDetails = responseData.map(
          (poc: {
            id: string;
            name: string;
            email: string;
            phone_number: string;
            designation: string;
            is_primary: string;
          }) => ({
            id: poc.id,
            name: poc.name,
            email: poc.email,
            phoneNumber: poc.phone_number,
            designation: poc.designation,
            isPrimary: poc.is_primary,
          }),
        );

        setPocDetails([...newPocDetails]);
      } else {
        console.log("user don't have any poc details");
      }
    } catch (error) {
      console.log("user don't have string any details", error);
    } finally {
      setLoadingSpinner(false);
    }
  };

  // use-effect to get poc details from backend
  useEffect(() => {
    GetPoc();
  }, []);

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

  const handleSendOtp = async () => {
    if (!validateName(formData.name)) {
      showToast(`Valid Name is required`, 'info');
      return;
    }

    if (!validateEmail(formData.email)) {
      showToast(`Invalid email address`, 'info');
      return;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      showToast(`Phone number must be a 10-digit number`, 'info');
      return;
    }

    if (formData.designation.length < 3) {
      showToast(`Please add valid designation`, 'info');
      return;
    }

    // trim the fields before send
    let newRecord = {
      phone_number: formData.phoneNumber.trim(),
    };

    try {
      setLoadingSpinner(true);

      let body = newRecord;
      console.log(body);
      let response = await fetch(`${apiUrl}/user-dashboard-api/generate-otp-poc/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },

        body: JSON.stringify(body),
      });

      if (response.status === 401) {
        await ReplaceTokenOrRedirect();
        response = await fetch(`${apiUrl}/user-dashboard-api/generate-otp-poc/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
      }

      if (response.ok) {
        await response.json();

        console.log('otp sent, get success');
        setOtpSent(true);
        formData.otp = '';
      } else {
        let server_error = await response.json();

        // temp
        // setOtpSent(true);

        // empty previous otp in login form field
        formData.otp = '';

        console.error('Failed to send otp', server_error);
        showToast(`${server_error.message}`, 'info');
      }
    } catch (error) {
      console.error('Server Connection Error during otp:', error);
      showToast(`Failed to send otp, system error`, 'info');
    } finally {
      setLoadingSpinner(false);
    }
  };

  // handle submission
  const handleSubmitOtp = async () => {
    if (!otpSent) {
      return;
    }
    if (formData.otp.length < 3) {
      showToast(`Please enter a valid otp`, 'info');
      return;
    }

    try {
      setLoadingSpinner(true);
      const bodyData = {
        otp_code: formData.otp.trim(),
        name: formData['name'].trim(),
        email: formData['email'].trim(),
        phone_number: formData['phoneNumber'].trim(),
        designation: formData['designation'].trim(),
      };
      console.log(bodyData);
      let response = await fetch(`${apiUrl}/user-dashboard-api/submit-poc/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      if (response.status === 401) {
        await ReplaceTokenOrRedirect();
        response = await fetch(`${apiUrl}/user-dashboard-api/submit-poc/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyData),
        });
      }

      if (response.ok) {
        console.log('poc details submitted successfully');
        showToast(`POC details submitted successfully`, 'info');
        GetPoc();
        setOtpSent(false);
        setFormData({ name: '', email: '', phoneNumber: '', designation: '', otp: '' });
      } else {
        let server_error = await response.json();
        console.log('poc details submission failed!', server_error);
        showToast(`'POC details submission failed, server error`, 'info');
      }
    } catch (error) {
      console.log('error during submitting poc details', error);
      showToast(`POC details submission failed, system error`, 'info');
    } finally {
      setLoadingSpinner(false);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (otpSent) {
      setOtpTimer(60);

      intervalId = setInterval(() => {
        setOtpTimer(prevTimer => {
          if (prevTimer === 1) {
            clearInterval(intervalId);
            setOtpSent(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [otpSent]);

  const handleChangePrimaryPOC = async () => {
    if (currentPrimaryPoc === '') {
      console.log('Please select a valid poc');
      showToast(`Please select a valid poc`, 'info');
      return;
    }

    let newRecord = {
      id: currentPrimaryPoc.trim(),
    };

    try {
      setLoadingSpinner(true);

      let body = newRecord;
      let response = await fetch(`${apiUrl}/user-dashboard-api/change-primary-poc/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },

        body: JSON.stringify(body),
      });

      if (response.status === 401) {
        await ReplaceTokenOrRedirect();
        response = await fetch(`${apiUrl}/user-dashboard-api/change-primary-poc/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },

          body: JSON.stringify(body),
        });
      }

      if (response.ok) {
        await response.json();
        await GetPoc();
        console.log('Primary poc updated successfully');
        showToast(`Primary POC updated successfully.`, 'info');
      } else {
        let server_error = await response.json();

        console.error('Failed to updated primary poc', server_error);

        showToast(`${server_error.message} `, 'info');
      }
    } catch (error) {
      console.error('Server Connection Error updating primary POC:', error);
      showToast(`Server Connection Error updating primary POC`, 'info');
    } finally {
      setLoadingSpinner(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      {loadingSpinner && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-600 bg-opacity-50 ">
          <div className="relative">
            <LoadingSpinner />
          </div>
        </div>
      )}

      {/* list poc details  */}
      <div className="mb-5 rounded-lg ">
        <div className="mb-3 font-medium text-center text-gray-200 text-base2">
          Point of contact details
        </div>
        <table className="w-full overflow-hidden rounded-lg">
          <thead className="overflow-hidden border-b-2 border-gray-400 rounded-lg ">
            <tr>
              <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-300">
                Name
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-300">
                Email
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-300">
                Phone Number
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-300">
                Primary POC
              </th>
            </tr>
          </thead>
          <tbody>
            {pocDetails.map((poc, index) => (
              <tr key={index} className="">
                <td className="p-3 text-sm font-medium text-gray-300">{poc.name}</td>
                <td className="p-3 text-sm font-medium text-gray-300 ">{poc.email}</td>

                <td className="p-3 text-sm font-medium text-gray-300">{poc.phone_number}</td>
                <td className="p-3 text-sm font-medium text-gray-300">{poc.designation}</td>
                <td className="p-3 text-sm font-medium text-center text-gray-300">
                  {poc.is_primary ? <span>&#10004;</span> : <span>&#10008;</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* change primary poc  */}
      {pocDetails.length !== 0 && (
        <div>
          <div className="mt-10 font-medium text-gray-200 text-base2 ">
            Change primary point of contact:
          </div>
          <div className="flex py-1 my-2 ">
            <select
              onChange={handleSelectChange}
              value={currentPrimaryPoc || ''}
              name="primary poc"
              className="w-full py-1 text-gray-100 transition-colors bg-transparent border-b-2 outline-none focus:outline-none focus:border-purple-600"
              required
            >
              <option
                className="bg-[#2c173c] text-gray-100 w-full rounded-md outline-none hover:bg-[#602b4c]"
                value=""
                disabled
              >
                Select a contact detail
              </option>
              {pocDetails
                .filter(poc => !poc.is_primary) // Filter out primary accounts
                .map((poc, index) => (
                  <option
                    className="bg-[#2c173c] text-gray-100 tracking-wider rounded-md outline-none hover:bg-[#602b4c]"
                    key={index}
                    value={poc.id}
                  >
                    {poc.name} - {poc.phone_number}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex justify-center pt-5">
            <Button
              onClick={handleChangePrimaryPOC}
              style={{
                backgroundColor: '#1565c0',
                borderRadius: '25px', // Adjust the pixel value for the desired border radius
              }}
              variant="contained"
              type="submit"
              endIcon={<ArrowForwardIcon />}
            >
              Proceed
            </Button>
          </div>
        </div>
      )}

      {/* add new poc details  */}
      {!otpSent && (
        <div className="pt-10 pb-8 mt-5 mb-4 rounded">
          <div className="font-medium text-gray-200  text-base2">
            Add new point of contact details:
          </div>
          {/* name field  */}
          <div className="flex-1 w-full">
            <div className="h-6 mt-3 text-xs font-bold leading-8 text-gray-400 uppercase">Name</div>
            <div className="flex py-1 my-2">
              <input
                onChange={handleChange}
                value={formData['name'] || ''}
                name="name"
                placeholder="Name"
                className="w-full py-1 text-gray-200 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
                type="text"
                required
              />
            </div>
          </div>

          {/* email field  */}
          <div className="flex-1 w-full">
            <div className="h-6 mt-3 text-xs font-bold leading-8 text-gray-400 uppercase">
              Email
            </div>
            <div className="flex py-1 my-2">
              <input
                onChange={handleChange}
                value={formData['email'] || ''}
                name="email"
                placeholder="Email"
                className="w-full py-1 text-gray-200 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
                type="email"
                required
              />
            </div>
          </div>

          {/* phone number field  */}
          <div className="flex-1 w-full">
            <div className="h-6 mt-3 text-xs font-bold leading-8 text-gray-400 uppercase">
              Phone Number
            </div>
            <div className="flex py-1 my-2">
              <input
                onChange={handleChange}
                value={formData['phoneNumber'] || ''}
                name="phoneNumber"
                placeholder="Phone Number"
                className="w-full py-1 text-gray-200 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
                type="text"
                required
              />
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="h-6 mt-3 text-xs font-bold leading-8 text-gray-400 uppercase">
              Designation
            </div>
            <div className="flex py-1 my-2">
              <input
                onChange={handleChange}
                value={formData['designation'] || ''}
                name="designation"
                placeholder="Designation"
                className="w-full py-1 text-gray-200 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
                type="text"
                required
              />
            </div>
          </div>

          {/* submit button  */}
          <div className="flex justify-center pt-8">
            <Button
              onClick={handleSendOtp}
              style={{
                backgroundColor: '#1565c0',
                borderRadius: '25px', // Adjust the pixel value for the desired border radius
              }}
              variant="contained"
              type="submit"
              endIcon={<ArrowUpwardOutlinedIcon />}
            >
              Add
            </Button>
          </div>
        </div>
      )}

      {otpSent && (
        <div className="pt-6 pb-8 mb-4 rounded ">
          <div className="font-medium text-center text-gray-200 text-base2">
            Add new point of contact details
          </div>
          {/* otp field */}
          <div className="flex-1 w-full mx-2">
            <div className="h-6 mt-3 text-xs font-bold leading-8 text-gray-300 uppercase ">OTP</div>
            <div className="flex py-1 my-2 ">
              <input
                onChange={handleInput}
                value={formData.otp || ''}
                name="otp"
                placeholder="OTP"
                className="w-full py-1 text-gray-100 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
                type="text"
                required
                autoComplete="new-password"
              />
            </div>
          </div>
          {/* send otp button  */}

          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center p-3 mt-5 font-medium text-gray-300 rounded-xl">
              OTP time left: {Math.floor(otpTimer / 60)}:
              {(otpTimer % 60).toLocaleString('en-US', {
                minimumIntegerDigits: 2,
              })}
            </div>
          </div>

          {/* submit button  */}
          <div className="flex justify-center pt-8">
            <Button
              onClick={handleSubmitOtp}
              style={{
                backgroundColor: '#1565c0',
                borderRadius: '25px', // Adjust the pixel value for the desired border radius
              }}
              variant="contained"
              type="submit"
              endIcon={<ArrowUpwardOutlinedIcon />}
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PocForm;
