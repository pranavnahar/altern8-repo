"use client";
import React, { useState, ChangeEvent } from "react";
import { Button } from "../ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "../ui/input";
import { motion } from "framer-motion";
import AnimatedLogo from "../Header/AnimatedLogo";
import { create } from "./ServerActions";
import { useRouter } from "next/navigation";

export interface UserCredentials {
  phoneNumber: number;
  password: string;
}

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formFields, setFormFeilds] = useState<UserCredentials>({
    phoneNumber: 0,
    password: "",
  });
  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: keyof UserCredentials
  ) => {
    setFormFeilds((prev) => ({
      ...prev,
      [type]: e.target.value,
    }));
  };

  const handleLogin = async () => {
    const cokkieStatus = await create(formFields);

    if (cokkieStatus === "success") {
      router.push("/");
    }
  };

  return (
    <motion.div className="flex flex-col justify-center items-center min-h-screen">
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="visible"
        // animate={mainControls}
        transition={{ duration: 0.7, delay: 0.3 }}
        whileHover={{ scale: 1.03, opacity: 1 }}
        className="h-[75vh] w-full rounded-3xl py-10 px-8 flex flex-col justify-around max-w-sm [background:linear-gradient(269.75deg,_#011049,_#19112f_25.75%,_#251431_51.79%,_#301941_64.24%,_#6e3050)] shadow-md"
      >
        <AnimatedLogo />

        <div className="h-[65%] flex flex-col justify-between">
          <div className="mb-5">
            <label className="block text-sm font-medium  text-white mb-1">
              Phone Number
            </label>
            <Input
              type="number"
              placeholder="Phone Number"
              name="phonenumber"
              className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              onChange={(e) => handleChange(e, "phoneNumber")}
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-white mb-1">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                className=""
                onChange={(e) => handleChange(e, "password")}
              />
              <div
                className="absolute top-0 bottom-0 m-auto right-2 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm mb-4">
            <a href="#" className="text-blue-600 hover:underline">
              Login with OTP
            </a>
            <a href="#" className="text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
            size="lg"
            onClick={handleLogin}
          >
            LOGIN
          </Button>

          <div className="mt-4 text-center text-white text-sm">
            <span>Not registered yet? </span>
            <a href="/register" className="text-blue-600 hover:underline">
              Register Here
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;
