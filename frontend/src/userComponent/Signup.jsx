import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../util";

function Signup() {
  const navigate = useNavigate();


   
   
  
useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (user && user.role) {
      // Redirect based on role
      switch (user.role) {
        case "user":
          navigate("/profile", { replace: true });
          break;
        case "admin":
          navigate("/admindashboard", { replace: true });
          break;
        case "owner":
          navigate("/alluser", { replace: true });
          break;
        default:
          localStorage.removeItem("user"); // unexpected role
          break;
      }
    }
  }, []);

  const [signupInfo, setSignupInfo] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { username, email, password } = signupInfo;

    if (!username || !email || !password) {
      return handleError("Please enter all fields");
    }

    try {
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(signupInfo),
      });

      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => navigate("/login"), 2000);
      } else if (error) {
        const detail = error?.details?.[0]?.message;
        handleError(detail);
      } else {
        handleError(message);
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      handleError("Signup failed. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/image1.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="w-full max-w-md relative bg-white/20 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/30 p-8">
        <h1 className="text-3xl font-extrabold text-center text-white drop-shadow mb-2">
          Create User Account
        </h1>
        <p className="text-center text-gray-200 mb-6 text-sm">
          Sign up to get started
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            onChange={handleChange}
            type="text"
            name="username"
            value={signupInfo.username}
            placeholder="Username"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <input
            onChange={handleChange}
            type="email"
            name="email"
            value={signupInfo.email}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
          />



<div className="relative w-full">
    <input
      onChange={handleChange}
      type={showPassword ? 'text' : 'password'}
      name="password"
      value={signupInfo.password}
      placeholder="Password"
      className="w-full px-4 py-3 pr-10 rounded-lg bg-white/10 border border-white/30 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/5 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-sm transition-all duration-200"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? '🙈' : '👀'}
    </button>
  </div>






          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white font-semibold py-3 rounded-lg shadow-lg transition"
          >
            Sign Up
          </button>
        </form>

        {/* ✅ Admin Access Request Link — aligned to right */}
        <div className="mt-4 text-right">
          <Link
            to="/request-admin"
            className="text-sm text-pink-400 hover:underline"
          >
            Do you want to be an admin? Ask for permission.
          </Link>
        </div>

        {/* Navigation options */}
        <p className="mt-8 text-center text-gray-200 text-sm space-x-2">
          <Link
            to="/FrontPage"
            className="ml-2 px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-xl font-semibold shadow-md hover:opacity-90 transition-all duration-300"
          >
            Go Back
          </Link>

          <span className="text-gray-300">|</span>

          <span className="text-gray-300">Already have an account?</span>

          <Link
            to="/login"
            className="ml-2 px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-xl font-semibold shadow-md hover:opacity-90 transition-all duration-300"
          >
            Login
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Signup;
