import React, { useState } from "react";
import { NavLink, useNavigate, Outlet, useLocation } from "react-router-dom";
import { handleError, handleSuccess } from "../util";
import { ToastContainer } from "react-toastify";
import axios from "axios";

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    title: "",
    tags: "",
    description: "",
    thumbnail: null,
    video: null,
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/logout", {
        method: "GET",
        credentials: "include",
      });

      const { message, success } = await response.json();

      if (success) {
        localStorage.removeItem("user");
        handleSuccess(message);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        handleError(message);
      }
    } catch {
      handleError("Logout failed");
    }
  };

  const isOnDashboardRoot = location.pathname === "/admindashboard";

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [id]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const form = new FormData();
      form.append("title", formData.title);
      form.append("tags", formData.tags);
      form.append("description", formData.description);
      if (formData.thumbnail) form.append("thumbnail", formData.thumbnail);
      if (formData.video) form.append("video", formData.video);

      const res = await axios.post("http://localhost:8000/uploadVideo", form, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          }
        },
      });

      if (res.data.success) {
        handleSuccess("Video uploaded successfully!");
        setFormData({
          title: "",
          tags: "",
          description: "",
          thumbnail: null,
          video: null,
        });
        setUploadProgress(0);
      } else {
        handleError(res.data.message || "Upload failed");
      }
    } catch (err) {
      handleError("Upload error: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-cyan-700 to-teal-600 flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-opacity-95 backdrop-blur-lg shadow-2xl z-50 flex justify-between items-center px-14 h-16 text-white font-semibold tracking-wide select-none">
        <div
          
          className="text-2xl font-extrabold text-yellow-400 flex items-center gap-2 "
        >
          Admin Dashboard
        </div>
       
        <div className="flex items-center space-x-12 text-lg">
           <div
          onClick={() => navigate("/admindashboard")}
          className="text-2xl font-extrabold text-green-400 flex items-center gap-2 cursor-pointer"
        >
          Home
        </div>
          <NavLink
            to="account"
            className={({ isActive }) =>
              isActive
                ? "text-yellow-400 border-b-2 border-yellow-400 pb-1 transition"
                : "hover:text-yellow-300 transition"
            }
          >
            Account
          </NavLink>
          <NavLink
            to="videos"
            className={({ isActive }) =>
              isActive
                ? "text-yellow-400 border-b-2 border-yellow-400 pb-1 transition"
                : "hover:text-yellow-300 transition"
            }
          >
            Videos
          </NavLink>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 transition font-semibold cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="flex-grow pt-24 px-8 max-w-5xl mx-auto w-full">
        {isOnDashboardRoot && (
          <section className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-3xl p-14 shadow-3xl border border-yellow-400/40">
            <h2 className="text-4xl font-extrabold mb-12 text-center text-yellow-400 tracking-widest drop-shadow-lg">
              Upload a New Video
            </h2>

            <form
              className="grid grid-cols-1 sm:grid-cols-2 gap-12"
              onSubmit={handleSubmit}
            >
              {/* Title */}
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full bg-transparent border border-yellow-400/40 rounded-xl px-6 pt-8 pb-3 text-yellow-100 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition shadow-lg"
                  required
                />
                <label
                  htmlFor="title"
                  className="absolute left-6 top-4 text-yellow-400 text-sm peer-placeholder-shown:top-7 peer-placeholder-shown:text-base peer-placeholder-shown:text-yellow-300 transition-all pointer-events-none select-none"
                >
                  Video Title
                </label>
              </div>

              {/* Tags */}
              <div className="relative">
                <input
                  type="text"
                  id="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full bg-transparent border border-yellow-400/40 rounded-xl px-6 pt-8 pb-3 text-yellow-100 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition shadow-lg"
                />
                <label
                  htmlFor="tags"
                  className="absolute left-6 top-4 text-yellow-400 text-sm peer-placeholder-shown:top-7 peer-placeholder-shown:text-base peer-placeholder-shown:text-yellow-300 transition-all pointer-events-none select-none"
                >
                  Tags (comma-separated)
                </label>
              </div>

              {/* Description */}
              <div className="relative sm:col-span-2">
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder=" "
                  className="peer w-full bg-transparent border border-yellow-400/40 rounded-xl px-6 pt-8 pb-3 text-yellow-100 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition resize-none shadow-lg"
                ></textarea>
                <label
                  htmlFor="description"
                  className="absolute left-6 top-4 text-yellow-400 text-sm peer-placeholder-shown:top-7 peer-placeholder-shown:text-base peer-placeholder-shown:text-yellow-300 transition-all pointer-events-none select-none"
                >
                  Video Description
                </label>
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-teal-400 font-semibold mb-4 text-lg">
                  Thumbnail Image
                </label>
                <div className="group relative rounded-xl border-2 border-teal-400/70 bg-teal-700/20 backdrop-blur-md p-12 text-center cursor-pointer hover:shadow-[0_0_15px_rgba(20,178,204,0.85)] hover:border-teal-300 transition">
                  <input
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    onChange={handleChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />

                  {formData.thumbnail ? (
                    <div className="flex flex-col items-center">
                      {/* Thumbnail Preview */}
                      <img
                        src={URL.createObjectURL(formData.thumbnail)}
                        alt="Thumbnail Preview"
                        className="w-28 h-28 object-cover rounded-lg border-2 border-teal-400 mb-3 shadow-md"
                      />
                      <p className="text-teal-300 text-sm font-medium">
                        {formData.thumbnail.name}
                      </p>
                    </div>
                  ) : (
                    <p className="text-teal-300 group-hover:text-teal-400 text-lg font-semibold select-none">
                      Click or drag to upload thumbnail
                    </p>
                  )}
                </div>
              </div>

              {/* Video */}
              {/* Video */}
              <div>
                <label className="block text-teal-400 font-semibold mb-4 text-lg">
                  Video File
                </label>
                <div className="group relative rounded-xl border-2 border-teal-400/70 bg-teal-700/20 backdrop-blur-md p-12 text-center cursor-pointer hover:shadow-[0_0_15px_rgba(20,178,204,0.85)] hover:border-teal-300 transition">
                  <input
                    type="file"
                    id="video"
                    accept="video/*"
                    onChange={handleChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />

                  {formData.video ? (
                    <div className="flex flex-col items-center">
                      <span className="text-5xl mb-3">👍</span>

                      <p className="text-teal-300 text-sm font-medium">
                        {formData.video.name}
                      </p>

                      <p className="text-teal-400 text-xs mt-1">
                        {(formData.video.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <p className="text-teal-300 group-hover:text-teal-400 text-lg font-semibold select-none">
                      Click or drag to upload video
                    </p>
                  )}
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="sm:col-span-2">
                  <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-yellow-400 h-4 transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-yellow-300 mt-2 text-center">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}

              {/* Submit */}
              <div className="sm:col-span-2 text-center mt-10">
                <button
                  type="submit"
                  disabled={isUploading}
                  className={`px-16 py-4 rounded-full shadow-2xl font-bold tracking-widest transition ${
                    isUploading
                      ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-gray-900 hover:shadow-3xl hover:scale-105"
                  }`}
                >
                  {isUploading ? "Uploading..." : "Upload Video"}
                </button>
              </div>
            </form>
          </section>
        )}

        {!isOnDashboardRoot && <Outlet />}
      </main>

      <ToastContainer />
    </div>
  );
}

export default AdminDashboard;
