import React from "react";

const Stepper: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const steps = [
    "REGISTER",
    "POC",
    "QUESTIONS",
    "BANK DETAILS",
    "SELECT BANK",
    "PAN",
    "ITR",
    "BUREAU REPORT",
    "GST",
  ];
  return (
    <div>
      <div className="flex items-center justify-between p-4 w-full my-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center w-full">
            <div className="relative flex flex-col items-center text-gray-200">
              <div
                className={`rounded-full transition duration-500 ease-in-out border-2 h-12 w-12 flex items-center justify-center py-3 ${
                  currentStep === index + 1
                    ? "bg-[#1565c0] text-white font-bold border-[#1565c0]"
                    : "border-gray-300"
                }`}
              >
                {currentStep > index + 1 ? (
                  <span className="text-xl font-bold text-white">
                    {" "}
                    &#10003;
                  </span>
                ) : (
                  index + 1
                )}
              </div>
              <div
                className={`absolute top-0 text-center mt-16 w-20 overflow-hidden text-xs font-medium uppercase ${
                  currentStep === index + 1
                    ? "text-purple-600 font-semibold"
                    : "text-gray-200"
                }`}
              >
                {step}
              </div>
            </div>
            {index !== steps.length - 1 && (
              <div
                className={`flex-auto border-t-2 transition duration-500 ease-in-out ${
                  currentStep > index + 1
                    ? "border-[#1565c0]"
                    : "border-gray-300"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
