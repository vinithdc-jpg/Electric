"use client";

import { useState } from "react";
import PersonalForm from "@/components/PersonalForm";
import LocationForm from "@/components/LocationForm";
import EnergyProfileForm from "@/components/EnergyProfileForm";
import ReviewForm from "@/components/ReviewForm";
import Stepper from "@/components/Stepper";
import { useRouter } from "next/navigation";

const initialState = {
  full_name: "",
  age: "",
  phone_number: "",
  email: "",
  password: "",

  address: "",
  city: "",
  province: "",

  c_electric_supplier: "",
  d_supplier_preference: "",

  avg_monthly_consumption: "",
  avg_monthly_bill: ""
};

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const [formData, setFormData] = useState(initialState);

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="max-w-4xl mx-auto py-8 px-4 md:py-10 md:px-0">

      <Stepper currentStep={step} />

      {step === 1 && (
        <PersonalForm
          formData={formData}
          handleChange={handleChange}
        />
      )}

      {step === 2 && (
        <LocationForm
          formData={formData}
          handleChange={handleChange}
        />
      )}

      {step === 3 && (
        <EnergyProfileForm
          formData={formData}
          handleChange={handleChange}
        />
      )}

      {step === 4 && (
        <ReviewForm
          formData={formData}
          handleChange={handleChange}
        />
      )}

      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between mt-8 md:mt-10">

        {step > 1 && (
          <button
            onClick={previousStep}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 order-2 sm:order-1"
          >
            Back
          </button>
        )}

        {step < 4 ? (
          <button
            onClick={nextStep}
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 sm:ml-auto order-1 sm:order-2"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 sm:ml-auto order-1 sm:order-2"
          >
            Complete Registration
          </button>
        )}

      </div>

    </main>
  );
}