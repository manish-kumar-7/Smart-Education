import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, Outlet, useMatch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const BASE_URL = "http://localhost:8000";

  const matchProfile = useMatch("/profile");

  useEffect(() => {
    if (!user?.username) {
      navigate("/login");
    }
  }, [user?.username, navigate]);

  useEffect(() => {
    if (matchProfile) fetchVideos();
  }, [matchProfile]);

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/profileVideo`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setVideos(res.data.videos);
      } else {
        console.error("Failed to fetch videos:", res.data.message);
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

  const filteredVideos = videos.filter((video) => {
    const search = searchTerm.toLowerCase();
    return (
      video.title.toLowerCase().includes(search) ||
      video.description.toLowerCase().includes(search) ||
      video.uploadedBy?.username.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-6 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-lg shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">
              <span className="text-pink-200">Smart Education Page</span>
            </h1>

            <ul className="flex-1 flex justify-evenly ml-10 font-medium">
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive
                      ? "text-pink-300  underline-offset-4"
                      : "text-gray-200 hover:text-white transition"
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="personal"
                  className={({ isActive }) =>
                    isActive
                      ? "text-pink-300 underline underline-offset-4"
                      : "text-gray-200 hover:text-white transition"
                  }
                >
                  Account
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="About"
                  className={({ isActive }) =>
                    isActive
                      ? "text-pink-300 underline underline-offset-4"
                      : "text-gray-200 hover:text-white transition"
                  }
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="game"
                  className={({ isActive }) =>
                    isActive
                      ? "text-pink-300 underline underline-offset-4"
                      : "text-gray-200 hover:text-white transition"
                  }
                >
                  Game
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="history"
                  className={({ isActive }) =>
                    isActive
                      ? "text-pink-300 underline underline-offset-4"
                      : "text-gray-200 hover:text-white transition"
                  }
                >
                  History
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="Writenote"
                  className={({ isActive }) =>
                    isActive
                      ? "text-pink-300 underline underline-offset-4"
                      : "text-gray-200 hover:text-white transition"
                  }
                >
                  Write Note
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {matchProfile && (
        <div className="pt-24 space-y-8">
          {/* Search Bar */}
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Search by title, description, or uploader..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 rounded-md border border-white/30 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Video Grid */}
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video) => (
                <div
                  key={video._id}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 flex flex-col"
                >
                  {/* Video */}
                  <div className="relative w-full h-48 bg-black">
                    <video
                      src={`${BASE_URL}${video.videoUrl}`}
                      controls
                      poster={`${BASE_URL}${video.thumbnailUrl}`}
                      className="w-full h-full object-cover"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  {/* Details */}
                  <div className="p-4 flex flex-col flex-grow text-white">
                    <h3 className="text-lg font-semibold mb-1 line-clamp-2">
                      {video.title}
                    </h3>

                    <p className="text-gray-300 text-sm line-clamp-3 mb-2">
                      {video.description}
                    </p>

                    {video.tags && video.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {video.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-500/30 text-blue-100 text-xs px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto flex justify-between items-center text-xs text-gray-300">
                      <span>
                        By:{" "}
                        <span className="text-white font-medium">
                          {video.uploadedBy?.username || "Unknown"}
                        </span>
                      </span>
                      <span>
                        {new Date(video.uploadedAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center">
                <video
                  src="/jack.mp4" 
                  controls
                  className="w-full max-w-md rounded-lg shadow-lg"
                >
                  Your browser does not support the video tag.
                </video>
                <p className="text-white text-lg mt-4">
                  No videos found — enjoy this while you search!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Nested Routes */}
      <div className="flex flex-col items-center pt-8">
        <Outlet />
      </div>

      <ToastContainer />
    </div>
  );
}

export default Profile;
