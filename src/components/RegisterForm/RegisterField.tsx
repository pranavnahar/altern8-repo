// get phone number and password and register the user

import React, { useContext, useState } from "react";
import { StepperContext } from "../../Contexts/StepperContext";
//import HelpAndLogin from "./stepsComponents/HelpAndLogin";
//import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { Button } from "@mui/material";
import { showToast } from "../../Utils/showToast";
import { useSearchParams, useRouter } from "next/navigation";

const Register = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const entityType = [
    "Company",
    "Partnership",
    "Sole Proprietorship",
    "Individual",
    "Trust",
  ];
  const [userData, setUserData] = useState({
    firstName: "",
    phoneNumber: "",
    password: "",
    password2: "",
    referredBy: "",
    entityType: "",
  });
  const { currentStep, steps, setLoading, getRegistrationState } =
    useContext(StepperContext);
  const search = useSearchParams();
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password2Visible, setPassword2Visible] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showWarningText, setShowWarningText] = useState(false);
  const [currentEntity, setCurrentEntity] = useState("");
  const router = useRouter();
  //getting referral code from url
  userData.referredBy = search.get("referal_code")!;
  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleNoButtonClick = () => {
    setShowConfirmationModal(false);
    if (userData.phoneNumber) {
      setUserData((prevUserData) => ({
        ...prevUserData,
        phoneNumber: "",
      }));
    }
    setShowWarningText(true);
  };

  const handleYesButtonClick = async () => {
    setShowConfirmationModal(false);
    await handleSubmission("next");
  };

  const handleSubmission = async (direction?: string) => {
    if (direction !== "next") {
      router.push("/");
    } else if (direction === "next") {
      const updatedRecord = {
        first_name: userData.firstName ? userData.firstName.trim() : "",
        phone_number: userData.phoneNumber ? userData.phoneNumber.trim() : "",
        password: userData.password ? userData.password.trim() : "",
        reenter_password: userData.password2 ? userData.password2.trim() : "",
        referred_by: userData.referredBy ? userData.referredBy.trim() : "",
        entity_type: currentEntity ? currentEntity.trim() : "",
      };

      // password validation
      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#:])[A-Za-z\d@$!%*?&#:]{8,}$/;
      const isValidPassword = passwordRegex.test(updatedRecord.password);

      if (updatedRecord.first_name.length < 3) {
        showToast(`Please enter a valid name`, "info");
        return;
      }
      if (updatedRecord.phone_number.length !== 10) {
        showToast(`Phone number must be a 10-digit number`, "info");
        setUserData((prevUserData) => ({
          ...prevUserData,
          phoneNumber: "",
        }));
        return;
      }
      if (!updatedRecord.entity_type)
        return showToast("Select entity type", "info");
      if (!isValidPassword) {
        showToast(
          `Password must be at least 8 characters long and include at least one letter, one digit, and one special character. Allowed special characters are: @$!%*?&#:`,
          "info"
        );
        return;
      }
      if (updatedRecord.password !== updatedRecord.reenter_password) {
        showToast(`Both password should match`, "info");
        return;
      }
      if (!termsAccepted) {
        showToast(`You must accept the terms and conditions`, "info");
        return;
      }

      try {
        const body = updatedRecord;
        setLoading(true);
        const response = await fetch(`${apiUrl}/user-api/register/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        // if phone number is already registered
        if (response.status === 409) {
          showToast(`Phone number is already registered. Please login`, "info");

          // Hold for 3 seconds before redirecting to /login
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } else if (response.ok) {
          let serverMessage = await response.json();
          console.log(
            `Register Form data submitted successfully!-- ${currentStep}`,
            serverMessage
          );

          showToast(`Submission Successful`, "info");

          let data = serverMessage;

          // Set the access token in a cookie
          Cookies.set("accessTokenForRegister", data.access, {
            expires: 30,
          });

          getRegistrationState();
        } else {
          let server_error = await response.json();
          console.error(
            `Failed to submit register form data.-- ${currentStep}`,
            server_error
          );

          console.log(server_error.message);
          showToast(`${server_error.message.phone_number[0]}`, "info");

          if (!server_error.message.phone_number) {
            showToast(`Submission Failed`, "info");
          }
        }
      } catch (error) {
        console.error(
          `Error submitting register form data, Error in fetching api (${currentStep}) :`,
          error
        );
        showToast(`Submission failed, system error!`, "info");
      } finally {
        setLoading(false);
      }
    }
  };

  // handle password visibility
  const handleShowPassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  // handle password visibility
  const handleShowPassword2 = () => {
    setPassword2Visible(!password2Visible);
  };

  const handleConfirmButtonClick = async () => {
    if (
      userData.phoneNumber &&
      userData.phoneNumber.length == 10 &&
      userData.entityType &&
      userData.password &&
      userData.password2
    ) {
      setShowConfirmationModal(true);
    } else {
      await handleSubmission("next");
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    // console.log("jo", value);

    setCurrentEntity(value);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center font-medium text-gray-200 text-xl">
        <div className="flex items-center">
          <div className="mx-3">
            <img className="w-[30px]" alt="" src="/ballons.png" />
          </div>
          <div className="mx-3">
            <img className="w-[30px]" alt="" src="/ballons.png" />
          </div>
        </div>
      </div>
      <div className="w-full mx-2 flex-1">
        <div className="font-semibold h-6 mt-3 text-gray-300 text-sm leading-8 uppercase">
          First Name
        </div>
        <div className="mt-2 py-1 flex text-gray-200">
          <input
            onChange={handleChange}
            value={userData.firstName || ""}
            name="firstName"
            placeholder="First Name"
            className="py-1  w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
            type="text"
            autoComplete="new-password"
            required
          />
        </div>
      </div>
      {/* phone number field  */}
      <div className="w-full mx-2 flex-1">
        <div className="font-semibold h-6 mt-3 text-gray-300 text-sm leading-8 uppercase">
          Phone Number
        </div>
        <div className="mt-2 py-1 flex text-gray-200">
          <input
            onChange={handleChange}
            value={userData.phoneNumber || ""}
            name="phoneNumber"
            placeholder="Phone Number"
            className="py-1  w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
            type="text"
            autoComplete="new-password"
            required
          />
        </div>
      </div>
      {/* warning text  */}
      {!showWarningText && (
        <div className="text-gray-300 mx-2 text-sm">
          Please input mobile number connected with PAN of the entity requesting
          Invoice Discounting
        </div>
      )}
      {showWarningText && (
        <div className="text-yellow-600 mx-2 text-sm">
          Please input mobile number connected with PAN of the entity requesting
          Invoice Discounting
        </div>
      )}
      <div className="text-gray-300 mx-2 text-sm">
        <ul>
          <li>Please keep this mobile number accessible for OTPs</li>
        </ul>
      </div>

      <div className="flex py-1 my-2 ml-2 ">
        <select
          onChange={handleSelectChange}
          value={currentEntity || ""}
          name="primary account"
          className="w-full py-1 text-gray-100 transition-colors bg-transparent border-b-2 outline-none focus:outline-none focus:border-purple-600"
          required
        >
          <option
            className="bg-[#2c173c] text-gray-100 w-full rounded-md outline-none hover:bg-[#602b4c]"
            value=""
            disabled
          >
            Select an Entity
          </option>
          {entityType.map((item, index) => (
            <option
              className="bg-[#2c173c] text-gray-100 tracking-wider rounded-md outline-none hover:bg-[#602b4c]"
              key={index}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* password field  */}
      <div className="w-full mx-2 flex-1">
        <div className="font-semibold h-6 mt-3 text-gray-300 text-sm leading-8 uppercase">
          Password
        </div>
        <div className="my-2 py-1 relative">
          <input
            onChange={handleChange}
            value={userData.password || ""}
            name="password"
            placeholder="Password"
            className="py-1    w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
            type={passwordVisible ? "text" : "password"}
            autoComplete="new-password"
            required
          />
          {passwordVisible && (
            <svg
              className="w-6 h-6 absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
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
              className="w-6 h-6 absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
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

      {/* re enter password  */}
      <div className="w-full mx-2 flex-1">
        <div className="font-semibold text-sm h-6 mt-3 text-gray-300 leading-8 uppercase">
          Re-enter Password
        </div>
        <div className="mt-2 py-1 relative">
          <input
            onChange={handleChange}
            value={userData.password2 || ""}
            name="password2"
            placeholder="Password"
            className="py-1    w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
            type={password2Visible ? "text" : "password"}
            autoComplete="new-password"
            required
          />
          {password2Visible && (
            <svg
              className="w-6 h-6 absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
              aria-hidden="true"
              onClick={handleShowPassword2}
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

          {!password2Visible && (
            <svg
              className="w-6 h-6 absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
              aria-hidden="true"
              onClick={handleShowPassword2}
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
      <div className="text-gray-300 mb-2 mx-2 text-sm">
        Password must be at least 8 characters long and include at least one
        letter, one digit, and one special character. Allowed special characters
        are: @$!%*?&#:
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="mt-1 py-1 flex text-gray-200">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-indigo-500"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
            />
            <span className="ml-2 text-gray-300">
              I agree to the{" "}
              <a
                href="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-500"
              >
                terms and conditions
              </a>{" "}
              and{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-500"
              >
                privacy policy
              </a>
            </span>
          </label>
        </div>
      </div>

      {/* Navigation controls  */}
      {currentStep !== steps.length && (
        <div className="container flex flex-col ">
          <div className="flex justify-around mt-6 mb-8">
            {/* back button  */}
            <button
              onClick={() => handleSubmission()}
              className="bg-white text-slate-600 uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer border-2 border-slate-300 hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out ${
                            "
            >
              Back
            </button>

            {!showConfirmationModal && (
              //  popup confirmation button
              <button
                onClick={() => handleConfirmButtonClick()}
                className="bg-[#1565c0] text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer  hover:bg-[#2680e6] hover:text-white transition duration-200 ease-in-out"
              >
                Confirm
              </button>
            )}
            {showConfirmationModal && (
              // next button
              <button
                onClick={() => handleSubmission("next")}
                className="bg-[#1565c0] text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer  hover:bg-[#2680e6] hover:text-white transition duration-200 ease-in-out"
              >
                Next
              </button>
            )}

            {showConfirmationModal && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50  flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                <div className="relative w-3/4 max-w-lg  mx-auto my-6">
                  {/* Modal content */}
                  <div className="relative flex flex-col   rounded-lg shadow-lg outline-none focus:outline-none [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212]">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5  rounded-t">
                      <div className="text-2xl  font-semibold text-gray-300">
                        Confirmation
                      </div>
                      <button
                        className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                        onClick={() => {
                          setShowConfirmationModal(false);
                        }}
                      >
                        <span className="bg-transparent text-gray-200 h-6 w-6 text-2xl block outline-none focus:outline-none">
                          ×
                        </span>
                      </button>
                    </div>
                    {/* Body */}
                    <div className="underline border-b-2 mx-5 border-gray-400"></div>
                    <div className="relative p-6 flex-auto">
                      <div className="text-gray-300 text-base2">
                        Is {userData.phoneNumber} connected with PAN of the
                        entity requesting Discounting ?
                      </div>
                    </div>
                    {/* Footer */}
                    <div className="flex items-center justify-end p-6  rounded-b">
                      <div>
                        <Button
                          style={{
                            backgroundColor: "#1565c0",
                            borderRadius: "25px", // Adjust the pixel value for the desired border radius
                            marginRight: "20px",
                          }}
                          variant="contained"
                          onClick={handleNoButtonClick}
                        >
                          No
                        </Button>
                      </div>
                      <div>
                        <Button
                          style={{
                            backgroundColor: "#1565c0",
                            borderRadius: "25px",
                            marginRight: "20px",
                          }}
                          variant="contained"
                          onClick={handleYesButtonClick}
                        >
                          Yes
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* <HelpAndLogin /> */}
        </div>
      )}
    </div>
  );
};

export default Register;
