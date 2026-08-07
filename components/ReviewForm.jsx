"use client";

export default function ReviewForm({
  formData,
  handleChange,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">

      <h2 className="text-2xl font-bold mb-8">
        Review & Monthly Usage
      </h2>

      {/* Monthly Information */}

      <div className="grid md:grid-cols-2 gap-6 mb-10">

        <div>
          <label className="block mb-2 font-semibold">
            Average Monthly Consumption (kWh)
          </label>

          <input
            type="number"
            name="avg_monthly_consumption"
            value={formData.avg_monthly_consumption}
            onChange={handleChange}
            placeholder="e.g. 350"
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Average Monthly Bill ($)
          </label>

          <input
            type="number"
            name="avg_monthly_bill"
            value={formData.avg_monthly_bill}
            onChange={handleChange}
            placeholder="e.g. 120"
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
          />
        </div>

      </div>

      <hr className="my-8" />

      <h3 className="text-xl font-semibold mb-6">
        Registration Summary
      </h3>

      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <p className="text-gray-500">Full Name</p>
          <p className="font-semibold">{formData.full_name}</p>
        </div>

        <div>
          <p className="text-gray-500">Age</p>
          <p className="font-semibold">{formData.age}</p>
        </div>

        <div>
          <p className="text-gray-500">Phone</p>
          <p className="font-semibold">{formData.phone_number}</p>
        </div>

        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-semibold">{formData.email}</p>
        </div>

        <div>
          <p className="text-gray-500">Address</p>
          <p className="font-semibold">{formData.address}</p>
        </div>

        <div>
          <p className="text-gray-500">City</p>
          <p className="font-semibold">{formData.city}</p>
        </div>

        <div>
          <p className="text-gray-500">Province</p>
          <p className="font-semibold">{formData.province}</p>
        </div>

        <div>
          <p className="text-gray-500">
            Current Supplier
          </p>
          <p className="font-semibold">
            {formData.c_electric_supplier}
          </p>
        </div>

        <div>
          <p className="text-gray-500">
            Supplier Preference
          </p>
          <p className="font-semibold">
            {formData.d_supplier_preference}
          </p>
        </div>

        <div>
          <p className="text-gray-500">
            Avg Monthly Consumption
          </p>
          <p className="font-semibold">
            {formData.avg_monthly_consumption} kWh
          </p>
        </div>

        <div>
          <p className="text-gray-500">
            Avg Monthly Bill
          </p>
          <p className="font-semibold">
            ${formData.avg_monthly_bill}
          </p>
        </div>

      </div>

    </div>
  );
}