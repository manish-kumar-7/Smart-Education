import React, { useEffect, useState } from "react";
import { handleError, handleSuccess } from "../util";
import { ToastContainer } from "react-toastify";

function AdminAccount() {
  const [admin, setAdmin] = useState(null);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoTitles, setVideoTitles] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch("http://localhost:8000/adminDashboard/account", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        console.log(data);

        if (data.success) {
          setAdmin(data.admin);
          setVideoTitles(data.titles || []);
          setFormData({
            username: data.admin.username,
            email: data.admin.email,
          });
        } else {
          handleError(data.message || "Failed to fetch admin info");
        }
      } catch (error) {
        handleError("Error fetching admin data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const res = await fetch("http://localhost:8000/Adminprofile/update", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!data.success) {
        return handleError(data.message || "Update failed");
      }

      setAdmin(data.user);
      setIsEditing(false);
      handleSuccess("Profile updated successfully!");
    } catch (error) {
      handleError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-900 via-indigo-900 to-purple-900 text-white text-xl">
        Loading admin info...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-sky-900 via-indigo-900 to-purple-900">
      <div className="w-full max-w-xl rounded-3xl p-8 backdrop-blur-2xl bg-white/10 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-white space-y-10">

        {/* Admin Info */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-extrabold tracking-wide text-indigo-200">
            👤 Account Information
          </h2>

          <div className="bg-white/5 border border-white/20 rounded-xl p-6 shadow-inner space-y-3">
            <div>
              <label className="block text-indigo-100 text-sm mb-1">Username</label>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg bg-white/20 text-white outline-none"
                />
              ) : (
                <p className="text-white">{admin.username}</p>
              )}
            </div>

            <div>
              <label className="block text-indigo-100 text-sm mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg bg-white/20 text-white outline-none"
                />
              ) : (
                <p className="text-white">{admin.email}</p>
              )}
            </div>
          </div>
        </div>

                {/* Buttons */}
        <div className="flex justify-center gap-5">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveChanges}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition font-semibold text-white shadow-md"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 transition font-semibold text-white shadow-md"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition font-semibold text-white shadow-md"
            >
              Edit
            </button>
          )}
        </div>
        {/* Videos Created Section */}
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold text-indigo-300">🎬 Videos Created</h3>

          <div
            className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-white/20 border border-white/25 shadow-lg text-white text-3xl font-extrabold"
            title={`${videoTitles.length} videos created`}
          >
            {videoTitles.length}
          </div>

          {/* List of Video Titles */}
          {videoTitles.length > 0 && (
            <div className="text-left mt-4 max-h-52 overflow-y-auto bg-white/10 border border-white/20 rounded-xl p-4 space-y-2 shadow-inner">
              <h4 className="text-sm text-indigo-200 font-semibold mb-2">Titles:</h4>
              <ul className="list-disc list-inside text-white text-sm space-y-1">
                {videoTitles.map((title, index) => (
                  <li key={index}>{title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        
      </div>
      <ToastContainer />
    </div>
  );
}

export default AdminAccount;
