import { authTypes } from "@/Types/types";
import React, { useState } from "react";
import ToggleSVG from "./ToggleSVG";
import { Button } from "@/components/ui/button";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import {
  nameValidation,
  passwordValidation,
  validatePhoneNumber,
} from "@/Utils/Validators";
import { showToast } from "@/Utils/showToast";
//import { apiUrl } from "@/Utils/auth";

const RegisterField = () => {
  const [userData, setUserData] = useState<authTypes>({
    firstName: "",
    phoneNumber: "",
    password: "",
    password2: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password2Visible, setPassword2Visible] = useState(false);
  const [loading, Setloading] = useState<boolean>(false);
  console.log(loading);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handlesubmit = async () => {
    if (!nameValidation(userData.firstName))
      return showToast("Name not validated");
    if (!validatePhoneNumber(userData.phoneNumber))
      return showToast("Number must be of 10 digits");
    if (
      !passwordValidation(userData.password) &&
      !passwordValidation(userData.password2)
    )
      return showToast("Password is not validated");

    try {
      const body = {
        first_name: userData.firstName,
        phone_number: userData.phoneNumber,
        password: userData.password,
        reenter_password: userData.password2,
      };
      Setloading(true);
      const response = await fetch(`http://127.0.0.1:8000/user-api/register/`, {
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
          window.location.replace("/login");
        }, 3000);
      } else if (response.ok) {
        let server_message = await response.json();
        console.log(
          `Register Form data submitted successfully!`,
          server_message
        );

        showToast(`Submission Successful`, "info");
      } else {
        let server_error = await response.json();
        console.error(`Failed to submit register form data.`, server_error);

        console.log(server_error.message);
        showToast(`${server_error.message.phone_number[0]}`, "info");

        if (!server_error.message.phone_number) {
          showToast(`Submission Failed`, "info");
        }
      }
    } catch (error) {
      console.error(
        `Error submitting register form data, Error in fetching api) :`,
        error
      );
      showToast(`Submission failed, system error!`, "info");
    } finally {
      Setloading(false);
    }
  };

  return (
    <div className="w-full mx-2 flex-1">
      <div className="font-semibold h-6 mt-3 text-gray-300 text-sm leading-8 uppercase">
        First Name
      </div>
      <div className="mt-2 py-1 flex text-gray-200">
        <input
          onChange={handleChange}
          value={userData["firstName"] || ""}
          name="firstName"
          placeholder="First Name"
          className="py-1  w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
          type="text"
          required
        />
      </div>
      <div className="font-semibold h-6 mt-3 text-gray-300 text-sm leading-8 uppercase">
        Phone Number
      </div>
      <div className="mt-2 py-1 flex text-gray-200">
        <input
          onChange={handleChange}
          value={userData["phoneNumber"] || ""}
          name="phoneNumber"
          placeholder="Phone Number"
          className="py-1  w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
          type="text"
          required
        />
      </div>
      <div className=" text-gray-300 mt-2 flex flex-col  text-sm">
        Please input mobile number connected with PAN of the entity requesting
        Invoice Discounting.
        <span>Please keep this mobile number accessible for OTPs.</span>
      </div>
      <div className="my-2 py-1 relative">
        <div className="font-semibold h-6 mt-3 text-gray-300 text-sm leading-8 uppercase">
          Password
        </div>
        <div className="my-2 py-1 relative">
          <input
            onChange={handleChange}
            value={userData["password"] || ""}
            name="password"
            placeholder="Password"
            className="py-1 w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
            type={passwordVisible ? "text" : "password"}
            autoComplete="new-password"
            required
          />
        </div>
        <ToggleSVG
          showPassword={passwordVisible}
          setShowPassword={setPasswordVisible}
        />
      </div>
      <div className=" my-2 py-1 relative">
        <div className="font-semibold text-sm h-6 mt-3 text-gray-300 leading-8 uppercase">
          Re-enter Password
        </div>
        <div className="mt-2 py-1 relative">
          <input
            onChange={handleChange}
            value={userData["password2"] || ""}
            name="password2"
            placeholder="Password"
            className="py-1    w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
            type={password2Visible ? "text" : "password"}
            autoComplete="new-password"
            required
          />
        </div>
        <ToggleSVG
          showPassword={password2Visible}
          setShowPassword={setPassword2Visible}
        />
      </div>
      <div className="text-gray-300 mb-2 text-sm">
        Password must be at least 8 characters long and include at least one
        letter, one digit, and one special character. Allowed special characters
        are: @$!%*?&#:
      </div>
      <div className="flex items-center space-x-2 mt-5 text-gray-300">
        <Checkbox id="terms" />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to the
          <span className=" text-indigo-600">
            terms and conditions
          </span> and <span className=" text-indigo-600"> privacy policy</span>
        </label>
      </div>
      <div className=" flex justify-around items-center mt-2">
        <Button
          variant="secondary"
          className=" mt-4 bg-blue-500 hover:bg-blue-800 text-white"
        >
          BACK
        </Button>
        <Button
          variant="secondary"
          className=" mt-4 bg-blue-500 hover:bg-blue-800 text-white"
          onClick={() => handlesubmit()}
        >
          CONFIRM
        </Button>
      </div>
      <div className=" flex justify-between items-center text-gray-300 mt-5">
        <Link href={"/help"} className=" text-indigo-600">
          Need Help?
        </Link>
        <Link href={"/login"}>
          Already registered?{" "}
          <span className=" text-indigo-600">Login now</span>
        </Link>
      </div>
    </div>
  );
};

export default RegisterField;
