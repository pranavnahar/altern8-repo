"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { parseCookies, destroyCookie } from "nookies";
import HelpAndLogin from "../Step-Component/HelpAndLogin";
import confetti from "canvas-confetti";

type Props = {
  demo: boolean
}

const Pending = ({ demo }: Props) => {
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
    if (!demo) {
      removeTokenFromCookies();
    }
  }, [demo]);

  useEffect(() => {
    const duration = 3000; // 3 seconds
    const interval = 500; // Interval between confetti bursts
    let timer: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const startConfetti = () => {
      intervalId = setInterval(handleClick, interval);
    };

    const stopConfetti = () => {
      clearInterval(intervalId);
    };

    timer = setTimeout(stopConfetti, duration);
    startConfetti();

    return () => {
      clearTimeout(timer);
      clearInterval(intervalId);
    };
  }, []);

  const handleClick = () => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

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
          className="text-balance md:text-lg text-center text-gray-300 max-w-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Your registration has been received by us and we are processing it, once confirmed you will receive a mail regarding the same.
          <br />
          <br />
          We usually take around 48 hours to process it.
        </motion.p>
      </div>
      <HelpAndLogin />
    </>
  );
}

export default Pending;
