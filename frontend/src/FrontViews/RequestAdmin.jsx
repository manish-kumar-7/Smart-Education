import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../util";

const BASE_URL = "http://localhost:8000"; 

function RequestAdmin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    profession: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, phone, profession } = formData;

    if (!username || !email || !phone || !profession) {
      return handleError("Please fill in all fields");
    }

    try {
      const response = await fetch(`${BASE_URL}/adminAccess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
       
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setFormData({
        username: "",
        email: "",
        phone: "",
        profession: "",
      });
        handleSuccess("Request submitted successfully!");
        setTimeout(() => navigate("/signup"), 2000);
      } else {
        handleError(result.message || "Something went wrong.");
      }
    } catch (error) {
      handleError("Failed to submit request.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
      style={{ backgroundImage: "url('/image1.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="w-full max-w-md relative bg-white/20 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/30 p-8">
        <h1 className="text-3xl font-extrabold text-center text-white drop-shadow mb-6">
          Request Admin Access
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="text"
            name="profession"
            placeholder="Profession"
            value={formData.profession}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white font-semibold py-3 rounded-lg shadow-lg transition"
          >
            Submit Request
          </button>
        </form>

        <p className="mt-6 text-center text-gray-200 text-sm">
          <button
            onClick={() => navigate(-1)}
            className="underline hover:text-pink-400"
          >
            Go Back
          </button>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
}

export default RequestAdmin;
