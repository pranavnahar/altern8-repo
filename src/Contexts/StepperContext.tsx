'use client';
import { apiUrl } from '../utils/auth';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import { createContext, useContext, useState, ReactNode } from 'react';

interface StepperContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  steps: string[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  showHelpPage: boolean;
  setShowHelpPage: (show: boolean) => void;
  handleClickHelp: () => void;
  getRegistrationState: (stateName?: string, currentPage?: string) => void;
  apiFailedIcon: boolean;
  setApiFailedIcon: (failed: boolean) => void;
}

// Create a default context value
const defaultStepperContext: StepperContextType = {
  currentStep: 0,
  setCurrentStep: () => {},
  steps: [],
  loading: false,
  setLoading: () => {},
  showHelpPage: false,
  setShowHelpPage: () => {},
  handleClickHelp: () => {},
  getRegistrationState: () => {},
  apiFailedIcon: false,
  setApiFailedIcon: () => {},
};

export const StepperContext = createContext<StepperContextType>(defaultStepperContext);

export const useStepperContext = () => useContext(StepperContext);

interface StepperProviderProps {
  children: ReactNode;
}

export const StepperProvider = ({ children }: StepperProviderProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHelpPage, setShowHelpPage] = useState(false);
  const [apiFailedIcon, setApiFailedIcon] = useState(false);
  const router = useRouter();

  const handleClickHelp = () => {
    setShowHelpPage(true);
  };

  const setRegistrationState = async (stateName?: string, currentPage?: string) => {
    if (stateName === 'selectedPages') {
      const selectedPages = JSON.parse(localStorage.getItem('selectedPages')!);
      if (selectedPages && currentPage) {
        const currentPageIndex = selectedPages.indexOf(currentPage);
        const nextPage = selectedPages[currentPageIndex + 1];

        if (nextPage) {
          return setRegistrationState(nextPage);
        } else {
          return setRegistrationState('Final');
        }
      }
    }

    let accessToken = parseCookies().altern8_useraccessForRegister;
    if (!accessToken || accessToken.length < 5) {
      setCurrentStep(1);
    } else {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/user-api/states/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 401) {
          router.push('/login');
        }

        if (response.ok) {
          let server_message = await response.json();
          const registration_step = server_message.user_state;
          console.log(`user step fetched successfully! ${registration_step}`, server_message);
          setRegistrationState(registration_step);
          console.log(registration_step);
        } else {
          let server_error = await response.json();
          console.error(`Failed to fetch user state from backend`, server_error);
        }
      } catch (error) {
        console.error(`Failed to fetch user state from backend`, error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getRegistrationState = async (stateName?: string, currentPage?: string) => {
    await setRegistrationState(stateName, currentPage);
  };

  return (
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
      {children}
    </StepperContext.Provider>
  );
};
