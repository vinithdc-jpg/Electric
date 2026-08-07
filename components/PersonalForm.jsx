"use client";

export default function PersonalForm({ formData, handleChange }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">

      <h2 className="text-2xl font-bold mb-8">
        Personal Information
      </h2>

      {/* Full Name */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">
          Full Name
        </label>

        <input
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          placeholder="Enter your full name"
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      {/* Age & Phone */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">

        <div>
          <label className="block text-sm font-semibold mb-2">
            Age
          </label>

          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Mobile Number
          </label>

          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="+63 900 000 0000"
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

      </div>

      {/* Email */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">
          Email Address
        </label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@gmail.com"
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      {/* Password */}
      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <label className="block text-sm font-semibold mb-2">
            Password
          </label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Confirm Password
          </label>

          <input
            type="password"
            name="confirm_password"
            value={formData.confirm_password || ""}
            onChange={handleChange}
            placeholder="********"
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

      </div>

    </div>
  );
}