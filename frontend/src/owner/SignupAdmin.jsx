import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../util";

function SignupAdmin() {
  const navigate = useNavigate();

  const [signupInfo, setSignupInfo] = useState({
    username: "",
    email: "",
    password: "",
  });
 const [showPassword, setShowPassword] = useState(false);
  const [role] = useState("admin");

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
      const url = "http://localhost:8000/admin/signup";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(signupInfo),
      });

      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        // Clear form fields after successful signup
        setSignupInfo({ username: "", email: "", password: "" });
      } else if (error) {
        const detail = error?.details?.[0]?.message;
        handleError(detail);
      } else {
        handleError(message);
      }
    } catch (error) {
      handleError(error.message || error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/image1.jpg')",
      }}
    >
      {/* Go Back button positioned at top-right corner */}
<div className="absolute top-4 right-4 z-50">
  <Link
    to="/alluser"
    className="
      px-4 py-2
      bg-gradient-to-r from-pink-400 to-pink-600
      rounded-md
      text-white font-semibold
      hover:from-pink-500 hover:to-pink-700
      transition-colors duration-300
      shadow-md
    "
  >
    Go Back
  </Link>
</div>



      <div className="w-full max-w-md relative bg-white/20 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/30 p-8">
            <h1 className="text-3xl font-extrabold text-center text-green-500 drop-shadow mb-2">
  Add Admin 
</h1>


       

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            onChange={handleChange}
            type="text"
            value={signupInfo.username}
            name="username"
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
      </div>

      <ToastContainer />
    </div>
  );
}

export default SignupAdmin;
