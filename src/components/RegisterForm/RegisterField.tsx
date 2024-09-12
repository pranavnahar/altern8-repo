import { authTypes } from "@/Types/types";
import React, { useState } from "react";
import ToggleSVG from "./ToggleSVG";
import { Button } from "@/components/ui/button";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";

const RegisterField = () => {
  const [userData, setUserData] = useState<authTypes>({
    first_name: "",
    phone_number: "",
    password: "",
    password2: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password2Visible, setPassword2Visible] = useState(false);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="w-full mx-2 flex-1">
      <div className="font-semibold h-6 mt-3 text-gray-300 text-sm leading-8 uppercase">
        First Name
      </div>
      <div className="mt-2 py-1 flex text-gray-200">
        <input
          onChange={handleChange}
          value={userData["first_name"] || ""}
          name="first_name"
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
          value={userData["phone_number"] || ""}
          name="phone_number"
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
          I agree to the{" "}
          <span className=" text-indigo-600">terms and conditions</span> and{" "}
          <span className=" text-indigo-600"> privacy policy</span>
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
