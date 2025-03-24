
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  steps: { title: string }[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 ${
                  index < currentStep
                    ? 'bg-agence-orange-500 border-agence-orange-500 text-white'
                    : index === currentStep
                    ? 'border-agence-orange-500 text-agence-orange-500'
                    : 'border-agence-gray-300 text-agence-gray-400'
                }`}
              >
                {index < currentStep ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs sm:text-sm font-medium ${
                  index <= currentStep
                    ? 'text-agence-gray-800'
                    : 'text-agence-gray-400'
                }`}
              >
                {step.title}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-auto">
                <div
                  className={`h-0.5 transition-all duration-500 ${
                    index < currentStep
                      ? 'bg-agence-orange-500'
                      : 'bg-agence-gray-300'
                  }`}
                ></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
