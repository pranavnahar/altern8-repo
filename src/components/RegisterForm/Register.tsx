"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";
import AnimatedLogo from "../Header/AnimatedLogo";
import Stepper from "./Stepper";
import RegisterField from "./RegisterField";

const Register = () => {
  return (
    <motion.div className="flex flex-col justify-center items-center min-h-screen ">
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
        className="m-5 min-h-screen rounded-3xl py-10 px-8 flex flex-col w-[750px] justify-around [background:linear-gradient(269.75deg,_#011049,_#19112f_25.75%,_#251431_51.79%,_#301941_64.24%,_#6e3050)] shadow-md"
      >
        <AnimatedLogo />
        <Stepper currentStep={1} />
        <RegisterField />
      </motion.div>
    </motion.div>
  );
};

export default Register;
