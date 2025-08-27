import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../util";
import { ToastContainer } from "react-toastify";

function Account() {
  const loginuser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(null);
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });

  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();

  const fetchAccount = async () => {
    try {
      const url = "http://localhost:8000/profile/user";
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      //console.log(data);
      if (!data.success) {
        handleError(data.message || "Failed to load profile");
        return;
      }

      setUser(data.user);
      setFormData({ username: data.user.username, email: data.user.email });
      setTitles(data.titles);
    } catch (error) {
      handleError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const url = "http://localhost:8000/logout";
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const answer = await response.json();
      const { message, success } = answer;

      if (success) {
        localStorage.removeItem("user");
        handleSuccess(message);
        setTimeout(() => {
          navigate("/Login");
        }, 1500);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError("Logout failed");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const url = "http://localhost:8000/profile/update";
      const res = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!data.success) return handleError(data.message);

      setUser(data.user);
      handleSuccess("Profile updated");
      setIsEditing(false);
    } catch (error) {
      handleError(error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUploadImage = async () => {
    if (!profilePic) return;

    const form = new FormData();
    form.append("image", profilePic);

    try {
      const res = await fetch("http://localhost:8000/profile/picUplode", {
        method: "POST",
        credentials: "include",
        body: form,
      });

      const data = await res.json();
      //console.log(data);
      if (!data.success) return handleError(data.message);

      handleSuccess("Profile picture uploaded");

      setUser((prev) => ({
        ...prev,
        profilepic: data.url,
      }));

      setPreview(null);
    } catch (error) {
      handleError(error.message);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
        <p className="text-white text-xl animate-pulse font-semibold tracking-wide">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
        <p className="text-red-300 text-xl font-semibold tracking-wide">
          Unable to load account info.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center px-6 py-12">
      <div className="backdrop-blur-md bg-white/20 border border-white/25 shadow-2xl rounded-3xl p-10 max-w-3xl w-full text-white space-y-10">
        
        <div className="flex flex-col items-center space-y-5">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-md flex items-center justify-center">
            {user?.profilepic ? (
              <img
                src={`http://localhost:8000${user.profilepic}`} 
                alt="Profile"
                className="w-full h-full object-cover object-center rounded-full"
              />
            ) : (
              <span className="text-4xl font-semibold uppercase text-white bg-purple-900  w-full h-full flex items-center justify-center rounded-full">
                {user.username?.[0]}
              </span>
            )}
          </div>

          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="block w-full max-w-xs text-sm text-gray-700
              file:mr-4 file:py-2.5 file:px-5
              file:rounded-md file:border-0
              file:bg-indigo-600 file:text-white
              file:font-medium file:cursor-pointer
              file:hover:bg-indigo-700 file:transition-colors
              file:duration-200 file:ease-in-out
              rounded-md border border-gray-300 bg-white
              focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
              shadow-sm"
          />

          <button
            onClick={handleUploadImage}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:to-purple-700 px-6 py-2 rounded-full text-white font-semibold shadow-md transition duration-300"
          >
            Upload Photo
          </button>
        </div>

       
        <div className="bg-white/10 rounded-xl p-8 shadow-lg border border-white/30">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold tracking-wide text-white drop-shadow-md">
              👤 Account Information
            </h2>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-full font-semibold shadow-lg transition duration-300"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-5 py-2 rounded-full shadow-lg text-sm transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="space-y-5 text-gray-200">
            {isEditing ? (
              <>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-white text-black placeholder:text-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  placeholder="Username"
                />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-white text-black placeholder:text-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  placeholder="Email"
                />
                <button
                  onClick={handleSaveChanges}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold shadow-md mt-4 transition duration-300"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <p className="text-xl">
                  <span className="font-semibold text-white">Username:</span>{" "}
                  {user.username}
                </p>
                <p className="text-xl">
                  <span className="font-semibold text-white">Email:</span>{" "}
                  {user.email}
                </p>
              </>
            )}
          </div>
        </div>

      
        <div className="bg-white/10 rounded-xl p-8 shadow-lg border border-white/25">
          <h2 className="text-2xl font-bold mb-6 tracking-wide text-white drop-shadow-md">
             My Notes
          </h2>
          {titles.length > 0 ? (
            <ul className="space-y-3 text-gray-300">
              {titles.map((title, index) => (
                <li
                  key={index}
                  className="bg-gradient-to-r from-purple-700 to-indigo-700 rounded-lg p-3 cursor-pointer hover:from-purple-800 hover:to-indigo-800 shadow-md transition duration-300"
                  title={title}
                >
                  {title.length > 60 ? title.slice(0, 57) + "..." : title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-indigo-300 text-lg font-medium">
              No notes found.
            </p>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Account;
