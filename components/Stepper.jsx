"use client";

const steps = [
  "Personal",
  "Location",
  "Energy Profile",
  "Review",
];

export default function Stepper({ currentStep }) {
  return (
    <div className="w-full mb-10">

      <h1 className="text-4xl font-bold text-center">
        Create Your Profile
      </h1>

      <p className="text-center text-gray-500 mt-2 mb-10">
        Complete your registration to access real-time energy insights.
      </p>

      <div className="flex items-center justify-between">

        {steps.map((step, index) => {

          const stepNumber = index + 1;

          const completed = stepNumber < currentStep;
          const active = stepNumber === currentStep;

          return (
            <div
              key={step}
              className="flex-1 flex items-center"
            >
              <div className="flex flex-col items-center">

                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold
                  ${completed
                      ? "bg-green-600"
                      : active
                        ? "bg-slate-900"
                        : "bg-gray-300 text-black"
                    }`}
                >
                  {completed ? "✓" : stepNumber}
                </div>

                <span
                  className={`mt-2 text-sm
                  ${active
                      ? "font-semibold text-slate-900"
                      : "text-gray-500"
                    }`}
                >
                  {step}
                </span>

              </div>

              {index !== steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2
                  ${completed
                      ? "bg-green-600"
                      : "bg-gray-300"
                    }`}
                />
              )}

            </div>
          );
        })}

      </div>
    </div>
  );
}