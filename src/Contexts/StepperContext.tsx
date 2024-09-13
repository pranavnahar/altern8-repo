import { createContext, useContext, useState, ReactNode } from "react";

interface StepperContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  steps: string[];
  setLoading: (loading: boolean) => void;
  //   getRegistrationState: () => any;
}

// Create a default context value
const defaultStepperContext: StepperContextType = {
  currentStep: 0,
  setCurrentStep: () => {},
  steps: [],
  setLoading: () => {},
  //   getRegistrationState: () => {},
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

  //   const getRegistrationState = () => {
  //     // Your logic here
  //   };
  console.log(loading);

  return (
    <StepperContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        steps,
        setLoading,
      }}
    >
      {children}
    </StepperContext.Provider>
  );
};
