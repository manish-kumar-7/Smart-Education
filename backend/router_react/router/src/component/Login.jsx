import React from 'react';
import { Link } from 'react-router-dom'; // <-- Import Link

function Login() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Login</h2>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              type="text" 
              placeholder="Your Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gmail</label>
            <input 
              type="email" 
              placeholder="your@gmail.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition"
          >
            Submit
          </button>
        </form>

        {/* 🔁 Updated to use React Router Link */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? 
          <Link to="/signup" className="ml-1 text-indigo-600 hover:text-indigo-500 font-medium">SignUp</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
