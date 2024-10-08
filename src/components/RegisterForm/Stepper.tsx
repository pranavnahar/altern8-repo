// for register page
// control the top register page element

import React, { useState, useRef, useEffect, useContext } from "react";
import { StepperContext } from "../../contexts/StepperContext";
import AnimatedLogo from "../Header/AnimatedLogo";

const Stepper = () => {
  const { currentStep, steps, apiFailedIcon } = useContext(StepperContext);
  const [newStep, setNewStep] = useState<
    {
      highlighted: boolean;
      apiFailed: boolean;
      selected: boolean;
      completed: boolean;
      description: string;
    }[]
  >([]);
  const [finalStep, setFinalStep] = useState<
    {
      description: string;
      highlighted: boolean;
      apiFailed: boolean;
      selected: boolean;
      completed: boolean;
    }[]
  >([]);
  const stepRef: React.MutableRefObject<
    {
      highlighted: boolean;
      apiFailed: boolean;
      selected: boolean;
      completed: boolean;
      description: string;
    }[]
  > = useRef([
    {
      highlighted: false,
      apiFailed: false,
      selected: false,
      completed: false,
      description: "",
    },
  ]);

  // to update the register step
  const updateStep = (
    stepNumber: number,
    steps: {
      highlighted: boolean;
      apiFailed: boolean;
      selected: boolean;
      completed: boolean;
      description: string;
    }[]
  ) => {
    const newSteps = [...steps];

    let count = 0;
    while (count < newSteps.length) {
      // current step
      if (count === stepNumber) {
        // if in some step api failed then show cross
        if (apiFailedIcon) {
          newSteps[count] = {
            ...newSteps[count],
            highlighted: true,
            apiFailed: true,
            selected: true,
            completed: true,
          };
        } else {
          newSteps[count] = {
            ...newSteps[count],
            highlighted: true,
            apiFailed: false,
            selected: true,
            completed: true,
          };
        }

        count++;
      }
      // step completed
      else if (count < stepNumber) {
        newSteps[count] = {
          ...newSteps[count],
          highlighted: false,
          apiFailed: false,
          selected: true,
          completed: true,
        };
        count++;
      }

      // step pending
      else {
        newSteps[count] = {
          ...newSteps[count],
          highlighted: false,
          apiFailed: false,
          selected: false,
          completed: false,
        };
        count++;
      }
    }
    return newSteps;
  };
  useEffect(() => {
    const stepsState = steps.map((step, index) =>
      Object.assign(
        {},
        {
          description: step,
          completed: false,
          apiFailed: false,
          highlighted: index === 0 ? true : false,
          selected: index === 0 ? true : false,
        }
      )
    );

    stepRef.current = stepsState;
    const current = updateStep(currentStep - 1, stepRef.current);
    setNewStep(current);
  }, [steps, currentStep]);

  // we created one final step
  // so that user only see first half of step initially
  useEffect(() => {
    const middleStep = Math.floor(steps.length / 2);
    if (currentStep > middleStep) {
      setFinalStep(newStep.slice(middleStep, steps.length));
    } else {
      setFinalStep(newStep.slice(0, middleStep));
    }
  }, [newStep]);

  const displaySteps = finalStep.map((step, index) => {
    return (
      <div
        key={index}
        className={
          index !== finalStep.length - 1
            ? "w-full flex items-center"
            : "flex items-center"
        }
      >
        <div className="relative flex flex-col items-center text-gray-200">
          <div
            className={`rounded-full transition duration-500 ease-in-out border-2 border-gray-300 h-12 w-12 flex items-center justify-center py-3 ${
              step.selected && !step.apiFailed
                ? "bg-[#1565c0] text-white font-bold border border-[#1565c0]"
                : ""
            } `}
          >
            {!step.apiFailed &&
              (step.completed ? (
                <span className="text-xl font-bold text-white"> &#10003;</span>
              ) : (
                index + 1
              ))}

            {step.apiFailed &&
              (step.completed ? (
                <span className="text-xl font-bold text-red-700">
                  {" "}
                  &#10539;
                </span>
              ) : (
                index + 1
              ))}
          </div>
          <div
            className={`absolute top-0 text-center  mt-16 w-20 overflow-hidden text-xs font-medium uppercase ${
              step.highlighted
                ? "text-purple-600 font-semibold"
                : "text-gray-200"
            }`}
          >
            {step.description}
          </div>
        </div>
        <div
          className={`flex-auto border-t-2 transition duration-500 ease-in-out ${
            step.completed ? "border-[#1565c0]" : "border-gray-300"
          }`}
        ></div>
      </div>
    );
  });

  return (
    <div className="items-center ">
      <div className="flex justify-center items-center pt-3 pb-8 text-5xl text-center sm:text-10xl font-exo lg:text-20xl text-white-font letter-spacing-2">
        <AnimatedLogo />
      </div>
      <div className="flex items-center justify-between p-4 mx-4">
        {displaySteps}
      </div>
    </div>
  );
};

export default Stepper;
