'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { StepperContext } from '../../contexts/stepper-context';
import Stepper from '../../components/RegisterForm/Stepper';
import RegisterField from '../../components/RegisterForm/RegisterField';
import SelectPrimaryBankAccount from '../../components/Steps/SelectPrimaryBankAccount';
import ITR from '../../components/Steps/ITR';
import PAN from '../../components/Steps/Pan';
import GST from '../../components/Steps/GST';
import { motion } from 'framer-motion'; // for animation
import LinearBuffer from '../../components/LinearBuffer'; //for progress animation
import POC from '../Steps/POC';
import BureauReport from '../Steps/BereauReport';
import AuthorizationCompliance from '../Steps/AuthorizationCompliance';
import UploadContract from '../Steps/UploadContract';
import BankDetails from '../Steps/BankDetails';
import HelpPage from '../../app/(extra)/help/page';
import Accounting from '../Steps/Accounting';
import RERA from '../Steps/RERA';
import Udyam from '../Steps/Udyam';
import Pending from '../Steps/Pending';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuthToken, getRegistrationAuthToken } from '@/utils/auth-actions';

type Props = {
  demo: boolean;
};

const Register = ({ demo }: Props) => {
  const [currentStep, setCurrentStep] = useState(1);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [apiFailedIcon, setApiFailedIcon] = useState(false);
  const [showHelpPage, setShowHelpPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
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
  ];

  const setRegistrationState = async (stateName: string, currentPage?: string) => {
    const registrationStepIndex = steps.indexOf(stateName);
    console.log(stateName,registrationStepIndex);

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

  // const getRegistrationState = async (stateName?: string, currentPage?: string) => {
  //   const token = await getAuthToken()
  //   if (!token || token.length < 5) {
  //     setCurrentStep(1);
  //   } else {
  //     if (stateName) {
  //       setRegistrationState(stateName, currentPage);
  //     } else {
  //       try {
  //         setLoading(true);
  //         const response = await fetch(`${apiUrl}/user-api/states/`, {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         });
  //         if (!demo && response.status === 401) {
  //           return router.push('/login');
  //         }

  //         if (response.ok) {
  //           let server_message = await response.json();
  //           const registration_step = server_message.user_state;
  //           console.log(server_message,registration_step);

  //           if (registration_step === 'Approved') return router.push('/dashboard');
  //           console.log(`Seller step fetched successfully! ${registration_step}`, server_message);
  //           setRegistrationState(registration_step);
  //         } else {
  //           let server_error = await response.json();
  //           console.error(`Failed to fetch seller state from backend`, server_error);
  //         }
  //       } catch (error) {
  //         console.error(`Failed to fetch seller state from backend`, error);
  //       } finally {
  //         setLoading(false);
  //         setPageLoading(false);
  //       }
  //     }
  //   }
  // };
  const getRegistrationState = async (stateName?: string, currentPage?: string) => {
    try {
      // Use the new registration-specific auth token function
      const token = await getRegistrationAuthToken();
      
      // for the first step, allow access without token
      if (!token && currentStep === 1) {
        setPageLoading(false);
        return;
      }
  
      // for later steps, redirect if no token
      if (!token && currentStep > 1) {
        return router.push('/login');
      }
  
      if (stateName) {
        setRegistrationState(stateName, currentPage);
      } else {
        try {
          setLoading(true);
          const response = await fetch(`${apiUrl}/user-api/states/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (!demo && response.status === 401) {
            if (currentStep === 1) {
              setCurrentStep(1);
            } else {
              return router.push('/login');
            }
          }
  
          if (response.ok) {
            let server_message = await response.json();
            const registration_step = server_message.user_state;
            console.log(server_message,registration_step);

            if (registration_step === 'Approved') return router.push('/dashboard');
            console.log(`Seller step fetched successfully! ${registration_step}`, server_message);
            setRegistrationState(registration_step);
          } else {
            let server_error = await response.json();
            console.error(`Failed to fetch seller state from backend`, server_error);
          }
  
        } catch (error) {
          console.error(`Failed to fetch seller state from backend`, error);
          if (currentStep === 1) {
            setCurrentStep(1);
          }
        }
      }
    } finally {
      setLoading(false);
      setPageLoading(false);
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
        return <BankDetails demo={demo} />
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
        setCurrentStep(1);
        return <RegisterField demo={demo} />;
    }
  };

  const handleClickHelp = () => {
    setShowHelpPage(true);
  };

  return (
    <div>
      <div className="min-h-screen flex justify-center items-center [background:linear-gradient(269.75deg,_#011049,_#19112f_25.75%,_#251431_51.79%,_#301941_64.24%,_#6e3050)]">
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 75 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7, delay: 0.3 }}
          className="m-5 w-11/12 lg:w-[90%] mx-auto shadow-xl rounded-2xl pb-2  [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212]"
        >
          <div className=" rounded-lg">
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
              <div className="my-8 p-8">
                {displayStep(currentStep)}
              </div>
            </div>
          </StepperContext.Provider>
        </motion.div>
      </div>

      {showHelpPage && (
        <HelpPage
        />
      )}
    </div>
  );
};

export default Register;
