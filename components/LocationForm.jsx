"use client";

const provinces = [
  "Ontario",
  "Alberta",
  "British Columbia",
  "Manitoba",
  "Nova Scotia",
  "Quebec",
  "Saskatchewan",
];

export default function LocationForm({ formData, handleChange }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">

      <h2 className="text-2xl md:text-3xl font-bold mb-8">
        Operating Location
      </h2>

      {/* Address */}

      <div className="mb-6">

        <label className="block text-sm font-semibold mb-2 text-gray-700">
          Complete Address
        </label>

        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Building, Street Name"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all"
        />

      </div>

      {/* City & Province */}

      <div className="grid md:grid-cols-2 gap-6">

        <div>

          <label className="block text-sm font-semibold mb-2 text-gray-700">
            City / Municipality
          </label>

          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter City"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all"
          />

        </div>

        <div>

          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Province
          </label>

          <select
            name="province"
            value={formData.province}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all"
          >
            <option value="">
              Select Province
            </option>

            {provinces.map((province) => (
              <option
                key={province}
                value={province}
              >
                {province}
              </option>
            ))}

          </select>

        </div>

      </div>

    </div>
  );
}