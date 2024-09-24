// // this is the last step of registration where user submitted all the Details
// // but his  profile is pending for approval
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { parseCookies, destroyCookie } from "nookies";
import HelpAndLogin from "../Step-Component/HelpAndLogin";

const colors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
];

const Balloon = ({ color }: { color: string }) => (
  <motion.div
    className={`absolute w-16 h-20 ${color} rounded-full`}
    initial={{ y: "100vh", x: Math.random() * 100 - 50 }}
    animate={{
      y: "-100vh",
      x: Math.random() * 200 - 100,
    }}
    transition={{
      duration: Math.random() * 5 + 10,
      ease: "easeOut",
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: Math.random() * 2,
    }}
  >
    <div className="w-1 h-24 bg-gray-300 mx-auto mt-20" />
  </motion.div>
);

export default function Pending() {
  const [balloons, setBalloons] = useState<JSX.Element[]>([]);
  useEffect(() => {
    const removeTokenFromCookies = () => {
      const cookies = parseCookies();
      const accessTokenForRegister = cookies.accessTokenForRegister;

      // Check if there is a token in cookies
      if (accessTokenForRegister) {
        // Delete the token from cookies
        destroyCookie(null, "accessTokenForRegister");
        console.log("Token removed from cookies.");
      }
    };

    // Call the function
    removeTokenFromCookies();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (balloons.length < 20) {
        setBalloons((prev) => [
          ...prev,
          <Balloon
            key={Date.now()}
            color={colors[Math.floor(Math.random() * colors.length)]}
          />,
        ]);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [balloons]);

  return (
    <>
      <div className="min-h-96 bg-transparent flex flex-col items-center justify-center overflow-hidden relative text-white">
        <motion.h1
          className="text-2xl md:text-3xl font-bold text-center text-gray-200 mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className=" flex justify-center items-center">
            <div className="mx-3">
              <img className="w-[30px]" alt="" src="/ballons.png" />
            </div>
            Congratulations!
            <div className="mx-3">
              <img className="w-[30px]" alt="" src="/ballons.png" />
            </div>
          </div>
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-center text-gray-300 max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Your Details has been submitted for approval.
          <br />
          You will get notified by email once approved.
        </motion.p>
        {balloons}
      </div>
      <HelpAndLogin />
    </>
  );
}
