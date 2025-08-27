import React, { useState ,useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../util";

function Login() {
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
  
 const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError("Please enter all fields");
    }

    try {
      const url =
        role === "admin"
          ? "http://localhost:8000/admin/login"
          : "http://localhost:8000/login";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginInfo),
      });

      const result = await response.json();
      const { success, message, error, username } = result;

      localStorage.setItem("user", JSON.stringify({
  email: result.email,
  username: result.username,
  role: result.role,
}));


      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          if(role=="owner"){
            navigate("/alluser");
          }
           else if (role === "admin") {
            navigate("/admindashboard");
          } else {
            navigate("/profile", { state: { username, role } });
          }
        }, 2000);
      } else if (error) {
        const detail = error?.details?.[0]?.message;
        handleError(detail);
      } else {
        handleError(message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
      style={{
        backgroundImage: "url('./public/image1.jpg')",
      }}
    >
     
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative w-full max-w-md bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl p-8">
        
        <h1 className="text-3xl font-extrabold text-center text-white drop-shadow mb-2">
          Welcome Back 👋
        </h1>
        <p className="text-center text-gray-200 mb-6 text-sm">
          Login to continue
        </p>

        
        <div className="flex justify-center mb-6">
          <div className="flex border border-white/40 rounded-full overflow-hidden">
            <button
              type="button"
              onClick={() => handleRoleChange("user")}
              className={`px-5 py-2 text-sm font-medium transition ${
                role === "user"
                 ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
    : "bg-white/30 text-gray-200"
              }`}
            >
              User
            </button>
            
            <button
              type="button"
              onClick={() => handleRoleChange("admin")}
             className={`px-5 py-2 text-sm font-medium transition ${
  role === "admin"
    ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
    : "bg-white/30 text-gray-200"
}`}



            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("owner")}
              className={`px-5 py-2 text-sm font-medium transition ${
                role === "owner"
                 ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
    : "bg-white/30 text-gray-200"
              }`}
            >
              Owner
            </button>
          </div>
        </div>

       
        <form onSubmit={handleLogin} className="space-y-4">
         
          <div>
            <input
              type="email"
              onChange={handleChange}
              name="email"
              value={loginInfo.email}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          
          <div className="relative w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              onChange={handleChange}
              name="password"
              value={loginInfo.password}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
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
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white font-semibold py-3 rounded-lg transition transform hover:scale-[1.02]"
          >
            Login
          </button>
        </form>

       
        <p className="mt-6 text-center text-gray-200 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-pink-400 font-medium hover:underline"
          >
            Signup
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
