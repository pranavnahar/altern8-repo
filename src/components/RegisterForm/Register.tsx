'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { StepperContext } from '../../contexts/StepperContext';
import Stepper from '../../components/RegisterForm/Stepper';
import RegisterField from '../../components/RegisterForm/RegisterField';
import SelectPrimaryBankAccount from '../../components/Steps/SelectPrimaryBankAccount';
import ITR from '../../components/Steps/ITR';
import PAN from '../../components/Steps/Pan';
import GST from '../../components/Steps/GST';
import { motion } from 'framer-motion'; // for animation
import { parseCookies } from 'nookies';
import LinearBuffer from '../../components/LinearBuffer'; //for progress animation
import POC from '../Steps/POC';
import BureauReport from '../Steps/BereauReport';
import AuthorizationCompliance from '../Steps/AuthorizationCompliance';
import UploadContract from '../Steps/UploadContract';
import BankDetails from '../Steps/BankDetails';
import HelpPage from '../../app/(dashboard)/help/page';
import Accounting from '../Steps/Accounting';
import RERA from '../Steps/RERA';
import Udyam from '../Steps/Udyam';
import Pending from '../Steps/Pending';
import { useRouter, useSearchParams } from 'next/navigation';

type Props = {
  demo: boolean;
};

const Register = ({ demo }: Props) => {
  const [currentStep, setCurrentStep] = useState(1); // to handle multiple registration steps
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [apiFailedIcon, setApiFailedIcon] = useState(false); //to display cross instead of tick in stepper , where any api failed and manually upload require
  const [showHelpPage, setShowHelpPage] = useState(false); // display help page
  const [loading, setLoading] = useState(false); //for loading animation;
  const [pageLoading, setPageLoading] = useState(true);
  console.log(pageLoading);
  const router = useRouter();
  const searchParams = useSearchParams();

  const steps = [
    'Register',
    'POC',
    'Bank Details',
    'Select Bank',
    'PAN',
    'ITR',
    'Bureau Report',
    'GST',
    'Accounting Data',
    'RERA',
    'Udyam',
    'Upload Contract',
    'Authorization Compliance',
    'Pending',
  ]; //registration steps

  // set current page state if stepName is provided
  const setRegistrationState = async (stateName: string, currentPage?: string) => {
    const registrationStepIndex = steps.indexOf(stateName);
    if (registrationStepIndex !== -1) {
      setCurrentStep(registrationStepIndex + 1);
    } else {
      console.log('got invalid state name', stateName);
      if (stateName === 'Pending for Maker' || stateName === 'Pending for Checker') {
        setCurrentStep(steps.length);
      } else {
        setCurrentStep(1);
      }
    }
  };

  // get seller registration state from backend
  const getRegistrationState = async (stateName?: string, currentPage?: string) => {
    let accessToken = parseCookies().altern8_useraccess;
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
          if (!demo && response.status === 401) {
            return router.push('/login');
          }

          if (response.ok) {
            let server_message = await response.json();
            const registration_step = server_message.user_state;
            if (registration_step === 'Approved') return router.push('/dashboard');
            console.log(`Seller step fetched successfully! ${registration_step}`, server_message);
            setRegistrationState(registration_step);
          } else {
            let server_error = await response.json();
            console.error(`Failed to fetch seller state from backend`, server_error);
          }
        } catch (error) {
          console.error(`Failed to fetch seller state from backend`, error);
        } finally {
          setLoading(false);
          setPageLoading(false);
        }
      }
    }
  };

  // check for previous user state
  useEffect(() => {
    if (!demo) {
      getRegistrationState();
    }
  }, []);

  useEffect(() => {
    const demo = searchParams.get('demo');
    const step = searchParams.get('step');

    if (demo === 'true' && step) {
      const stepNumber = parseInt(step, 10);

      if (!isNaN(stepNumber)) {
        setCurrentStep(stepNumber);
      }
    }
  }, [searchParams]);

  // to manage the different registration steps
  const displayStep = (step: number) => {
    switch (step) {
      case 1:
        return (
          <Suspense>
            <RegisterField demo={demo} />
          </Suspense>
        );
      case 2:
        return <POC demo={demo} />;
      case 3:
        return <BankDetails demo={demo} />;
      case 4:
        return <SelectPrimaryBankAccount demo={demo} />;
      case 5:
        return <PAN demo={demo} />;
      case 6:
        return <ITR demo={demo} />;
      case 7:
        return <BureauReport demo={demo} />;
      case 8:
        return <GST demo={demo} />;
      case 9:
        return <Accounting demo={demo} />;
      case 10:
        return <RERA demo={demo} />;
      case 11:
        return <Udyam demo={demo} />;
      case 12:
        return <UploadContract demo={demo} />;
      case 13:
        return <AuthorizationCompliance demo={demo} />;
      case 14:
        return <Pending demo={demo} />;
      default:
        // when there is no step or undefined step
        setCurrentStep(1);
        return <RegisterField demo={demo} />;
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
