// This is the main registration page for seller
// all the components for this page are located at ->
// ../components/register
"use client";
import React, { useState, useEffect } from "react";
import { StepperContext } from "../../Contexts/StepperContext";
import Stepper from "../../components/RegisterForm/Stepper";
import RegisterField from "../../components/RegisterForm/RegisterField";
//import POC from "../components/register/steps/POC";
//import AccountAggregator from "../components/register/steps/AccountAggregator";
import SelectPrimaryBankAccount from "../../components/Steps/SelectPrimaryBankAccount";
//import SelectInvoice from "../components/register/steps/SelectInvoice";
import ITR from "../../components/Steps/ITR";
import PAN from "../../components/Steps/Pan";
import GST from "../../components/Steps/GST";
//import { ToastContainer } from "react-toastify"; // for alert message
import { motion } from "framer-motion"; // for animation
import { parseCookies } from "nookies";
import LinearBuffer from "../../components/LinearBuffer"; //for progress animation
import POC from "../Steps/POC";
import BureauReport from "../Steps/BereauReport";
import AuthorizationCompliance from "../Steps/AuthorizationCompliance";
import UploadContract from "../Steps/UploadContract";
import BankDetails from "../Steps/BankDetails";
import HelpPage from "@/app/help/page";
import Accounting from "../Steps/Accounting";
import RERA from "../Steps/RERA";
import Udyam from "../Steps/Udyam";
import Pending from "../Steps/Pending";
import { useRouter } from "next/navigation";
//import HelpPage from "../components/help/HelpPage";
//import AuthorizationCompliance from "@/components/register/steps/AuthorizationCompliance";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1); // to handle multiple registration steps
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [apiFailedIcon, setApiFailedIcon] = useState(false); //to display cross instead of tick in stepper , where any api failed and manually upload require
  const [showHelpPage, setShowHelpPage] = useState(false); // display help page
  const [loading, setLoading] = useState(false); //for loading animation;
  const router = useRouter();

  const steps = [
    "Register",
    "POC",
    "Bank Details",
    "Select Bank",
    "PAN",
    "ITR",
    "Bureau Report",
    "GST",
    "Accounting Data",
    "RERA",
    "Udyam",
    "Upload Contract",
    "Authorization Compliance",
    "Pending",
  ]; //registration steps

  // set current page state if stepName is provided
  const setRegistrationState = async (
    stateName: string,
    currentPage?: string
  ) => {
    if (stateName === "selectedPages") {
      const selectedPages = JSON.parse(localStorage.getItem("selectedPages")!);
      if (selectedPages && currentPage) {
        const currentPageIndex = selectedPages.indexOf(currentPage);
        const nextPage = selectedPages[currentPageIndex + 1];

        if (nextPage) {
          return setRegistrationState(nextPage);
        } else {
          return setRegistrationState("Final");
        }
      }
    }

    //  check for registration_step in steps array
    const registrationStepIndex = steps.indexOf(stateName);

    console.log("registrationStepIndex", registrationStepIndex);
    if (registrationStepIndex !== -1) {
      // If "registration_step" is found in the steps array
      setCurrentStep(registrationStepIndex + 1);
    } else {
      // If "registration_step" is not found in the steps array
      console.log("got invalid state name", stateName);
      if (stateName === "Approved") {
        return router.push("/dashboard");
      }
      if (
        stateName === "Pending for Maker" ||
        stateName === "Pending for Checker"
      ) {
        setCurrentStep(steps.length);
      } else {
        setCurrentStep(1);
      }
    }
  };

  // get seller registration state from backend
  const getRegistrationState = async (
    stateName?: string,
    currentPage?: string
  ) => {
    let accessToken = parseCookies().accessTokenForRegister;
    // if the cookies don't have access token for register
    if (!accessToken || accessToken.length < 5) {
      setCurrentStep(1);
    } else {
      // get the registration state from backend

      if (stateName) {
        setRegistrationState(stateName, currentPage);
      } else {
        try {
          setLoading(true);
          const response = await fetch(`${apiUrl}/user-api/states/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          // if unauthorized then push to login page
          if (response.status === 401) {
            router.push("/login");
          }

          if (response.ok) {
            let server_message = await response.json();
            const registration_step = server_message.user_state;
            console.log(
              `Seller step fetched successfully! ${registration_step}`,
              server_message
            );
            if (registration_step === "Approved")
              return router.push("/dashboard");
            setRegistrationState(registration_step);
          } else {
            let server_error = await response.json();
            console.error(
              `Failed to fetch seller state from backend`,
              server_error
            );
          }
        } catch (error) {
          console.error(`Failed to fetch seller state from backend`, error);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  // check for previous user state
  useEffect(() => {
    getRegistrationState();
  }, []);

  // to manage the different registration steps
  const displayStep = (step: number) => {
    switch (step) {
      case 1:
        return <RegisterField />;
      case 2:
        return <POC />;
      case 3:
        return <BankDetails />;
      case 4:
        return <SelectPrimaryBankAccount />;
      case 5:
        return <PAN />;
      case 6:
        return <ITR />;
      case 7:
        return <BureauReport />;
      case 8:
        return <GST />;
      case 9:
        return <Accounting />;
      case 10:
        return <RERA />;
      case 11:
        return <Udyam />;
      case 12:
        return <UploadContract />;
      case 13:
        return <AuthorizationCompliance />;
      case 14:
        return <Pending />;
      default:
        // when there is no step or undefined step
        setCurrentStep(1);
        return <RegisterField />;
    }
  };

  const handleClickHelp = () => {
    setShowHelpPage(true);
  };

  // main return
  return (
    <div>
      {/* {!showHelpPage && ( */}
      <div className="min-h-screen flex justify-center items-center [background:linear-gradient(269.75deg,_#011049,_#19112f_25.75%,_#251431_51.79%,_#301941_64.24%,_#6e3050)]">
        {/* motion is the library for animation  */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 75 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate="visible"
          // animate={mainControls}
          transition={{ duration: 0.7, delay: 0.3 }}
          // whileHover={{ scale: 1.01, opacity: 1, duration: 0.5 }}
          className="m-5 w-11/12 lg:w-4/6 mx-auto shadow-xl rounded-2xl pb-2  [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212]"
        >
          <div className="mx-5 my-5  rounded-lg">
            {/* progress animation   */}
            {/* Show LinearProgress when loading is true */}
            {loading && <LinearBuffer />}
          </div>
          <StepperContext.Provider
            value={{
              currentStep,
              setCurrentStep,
              steps,
              loading,
              setLoading,
              showHelpPage,
              setShowHelpPage,
              handleClickHelp,
              getRegistrationState,
              apiFailedIcon,
              setApiFailedIcon,
            }}
          >
            <div className=" horizontal w-full  pt-10">
              <Stepper />

              {/* Display Components  */}
              <div className="my-8 p-8">
                {/* this is the particular registration step  */}
                {displayStep(currentStep)}
              </div>
            </div>
            {/* 
            <ToastContainer /> */}
          </StepperContext.Provider>
        </motion.div>
      </div>
      {/* )} */}

      {showHelpPage && (
        <HelpPage
        // showHelpPage={showHelpPage}
        // setShowHelpPage={setShowHelpPage}
        />
      )}
    </div>
  );
};

export default Register;
