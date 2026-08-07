"use client";

const suppliers = [
  "Hydro One",
  "Toronto Hydro",
  "Alectra Utilities",
  "Elexicon Energy",
  "Enbridge",
  "Other",
];

const preferences = [
  "Lowest Cost",
  "Fixed Rate",
  "Renewable Energy",
  "Flexible Plan",
  "No Preference",
];

export default function EnergyProfileForm({
  formData,
  handleChange,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">

      <h2 className="text-2xl font-bold mb-8">
        Energy Profile
      </h2>

      {/* Current Supplier */}

      <div className="mb-6">

        <label className="block mb-2 font-semibold">
          Current Electricity Supplier
        </label>

        <select
          name="c_electric_supplier"
          value={formData.c_electric_supplier}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
        >
          <option value="">
            Select Supplier
          </option>

          {suppliers.map((supplier) => (
            <option
              key={supplier}
              value={supplier}
            >
              {supplier}
            </option>
          ))}

        </select>

      </div>

      {/* Supplier Preference */}

      <div>

        <label className="block mb-2 font-semibold">
          Supplier Preference
        </label>

        <select
          name="d_supplier_preference"
          value={formData.d_supplier_preference}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
        >
          <option value="">
            Select Preference
          </option>

          {preferences.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}

        </select>

      </div>

    </div>
  );
}