import { createContext, useContext, useState, ReactNode } from "react";

interface StepperContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  steps: string[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  showHelpPage: boolean;
  setShowHelpPage: (show: boolean) => void;
  handleClickHelp: () => void;
  getRegistrationState: () => void;
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

export const StepperContext = createContext<StepperContextType>(
  defaultStepperContext
);

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

  const handleClickHelp = () => {
    // Your logic for handling help click
  };

  const getRegistrationState = () => {
    // Your logic for getting registration state
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
