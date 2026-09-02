"use client";

const steps = ["Personal", "Location", "Energy Profile", "Review"];

export default function Stepper({ currentStep }) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8 md:mb-10">
      <h1 className="text-3xl md:text-4xl text-white font-bold text-center">
        Create Your Profile
      </h1>

      <p className="text-center text-white mt-2 mb-8 md:mb-10 text-sm md:text-base">
        Complete your registration to access real-time energy insights.
      </p>

      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;

          const completed = stepNumber < currentStep;
          const active = stepNumber === currentStep;

          return (
            <div key={step} className="flex-1 flex items-center min-w-0">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-semibold flex-shrink-0 transition-colors
                  ${
                    completed
                      ? "bg-green-600"
                      : active
                        ? "bg-slate-900"
                        : "bg-gray-300 text-black"
                  }`}
                >
                  {completed ? "✓" : stepNumber}
                </div>

                <span
                  className={`mt-2 text-xs md:text-sm text-center px-1
                  ${active ? "font-semibold text-slate-900" : "text-gray-500"}`}
                >
                  {step}
                </span>
              </div>

              {index !== steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-1 md:mx-2 transition-colors
                  ${completed ? "bg-green-600" : "bg-gray-300"}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
