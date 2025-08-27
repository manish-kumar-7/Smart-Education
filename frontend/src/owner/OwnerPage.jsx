import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate ,Outlet} from "react-router-dom";
import { handleError, handleSuccess } from "../util";
import { ToastContainer } from "react-toastify";

function OwnerPage() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalVideo, setModalVideo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const BASE_URL = "http://localhost:8000";

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/alluser`, { withCredentials: true });
        if (res.data.success) {
          setAdmins(res.data.alladmin);
          setUsers(res.data.alluser);
          setNotes(res.data.allnote);
          const videosWithFullUrl = res.data.allvideo.map(video => ({
            ...video,
            videoUrl: `${BASE_URL}${video.videoUrl}`,
            thumbnailUrl: `${BASE_URL}${video.thumbnailUrl}`,
          }));
          setVideos(videosWithFullUrl);
        } else {
          setError(res.data.message || "Failed to fetch data");
        }
      } catch (err) {
        console.error(err);
        setError("Server error while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);
  const handleAddAdmin=()=>{
    navigate("/AddAdmin");
  }
  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/logout`, {
        method: "GET",
        credentials: "include",
      });
      const answer = await response.json();
      if (answer.success) {
        localStorage.removeItem("user");
        handleSuccess(answer.message);
        setTimeout(() => navigate("/Login"), 1500);
      } else {
        handleError(answer.message);
      }
    } catch (err) {
      handleError("Logout failed");
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    setIsProcessing(true);
    try {
      const res = await axios.delete(`${BASE_URL}/deleteVid`, {
        withCredentials: true,
        data: { videoId },
      });

      if (res.data.success) {
        setVideos(prev => prev.filter(v => v._id !== videoId));
        setAdmins(prevAdmins =>
          prevAdmins.map(admin => ({
            ...admin,
            videoes: admin.videoes.filter(id => id !== videoId)
          }))
        );
        handleSuccess(res.data.message);
      } else {
        handleError("Failed to delete: " + res.data.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
      handleError("Error deleting video");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setIsProcessing(true);
    try {
      const res = await axios.delete(`${BASE_URL}/deleteUser`, {
        withCredentials: true,
        data: { userId },
      });

      if (res.data.success) {
        setUsers(prev => prev.filter(u => u._id !== userId));
        handleSuccess(res.data.message);
      } else {
        handleError("Failed to delete: " + res.data.message);
      }
    } catch (err) {
      console.error("Delete user error:", err);
      handleError("Error deleting user");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    setIsProcessing(true);
    try {
      const res = await axios.delete(`${BASE_URL}/deleteAdmin`, {
        withCredentials: true,
        data: { adminId },
      });

      if (res.data.success) {
        setAdmins(prev => prev.filter(a => a._id !== adminId));
        handleSuccess(res.data.message);
      } else {
        handleError("Failed to delete: " + res.data.message);
      }
    } catch (err) {
      console.error("Delete admin error:", err);
      handleError("Error deleting admin");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <p className="text-center mt-10 text-white text-xl">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500 text-xl">{error}</p>;

  const filteredAdmins = admins.filter(
    a => a.username.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase())
  );
  const filteredUsers = users.filter(
    u => u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 min-h-screen">

      
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
  <input
    type="text"
    placeholder="Search Admin or User..."
    value={search}
    onChange={e => setSearch(e.target.value)}
    className="w-full sm:max-w-md px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-md transition"
  />

  <div className="flex gap-3">
    <button
      onClick={handleAddAdmin}
      className="px-6 py-2.5 rounded-full bg-gradient-to-r to-pink-500 from-green-500 text-white font-semibold hover:opacity-90 transition duration-200 shadow-md"
    >
      Add Admin
    </button>

    <button
  onClick={() => navigate("/notifications")}
  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:opacity-90 transition duration-200 shadow-md"
>
  Admin Requests
</button>


    <button
      onClick={handleLogout}
      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gray-700 to-red-600 text-white font-semibold hover:opacity-90 transition duration-200 shadow-md"
    >
      Logout
    </button>
  </div>
</div>


    
      <section>
        <h2 className="text-3xl font-bold mb-6 text-white">Admins & Videos</h2>
        <div className="space-y-6">
          {filteredAdmins.length > 0 ? filteredAdmins.map(admin => {
            const adminVideos = videos.filter(v => admin.videoes.includes(v._id));
            return (
              <div key={admin._id} className="p-6 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-white font-semibold">{admin.username} ({admin.email})</p>
                  <button
                    disabled={isProcessing}
                    onClick={() => handleDeleteAdmin(admin._id)}
                    className="ml-4 px-3 py-1 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition"
                  >
                    {isProcessing ? "Deleting..." : "Delete Admin"}
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {adminVideos.length > 0 ? adminVideos.map(video => (
                    <div
                      key={video._id}
                      className="p-4 bg-white/20 backdrop-blur-md rounded-2xl shadow-md border border-white/30 flex justify-between items-start hover:scale-105 transition-transform"
                    >
                      <div onClick={() => setModalVideo(video)} className="cursor-pointer">
                        <p className="text-white font-medium">{video.title}</p>
                        <p className="text-white text-sm">{video.description}</p>
                        {video.thumbnailUrl && (
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-40 h-24 object-cover rounded-lg border border-white/30 shadow-lg mt-1"
                          />
                        )}
                      </div>
                      <button
                        disabled={isProcessing}
                        onClick={() => handleDeleteVideo(video._id)}
                        className="ml-4 px-3 py-1 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition"
                      >
                        {isProcessing ? "Deleting..." : "Delete This Video"}
                      </button>
                    </div>
                  )) : <p className="text-white text-sm">No videos uploaded</p>}
                </div>
              </div>
            );
          }) : <p className="text-white">No admins match your search</p>}
        </div>
      </section>

     
      <section>
        <h2 className="text-3xl font-bold mb-6 text-white">Users & Notes</h2>
        <div className="space-y-6">
          {filteredUsers.length > 0 ? filteredUsers.map(user => {
            const userNotes = notes.filter(n => user.notes.includes(n._id));
            return (
              <div key={user._id} className="p-6 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20">
                <div className="flex justify-between items-start">
                  <p className="text-white font-semibold mb-2">{user.username} ({user.email})</p>
                  <button
                    disabled={isProcessing}
                    onClick={() => handleDeleteUser(user._id)}
                    className="ml-4 px-3 py-1 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition"
                  >
                    {isProcessing ? "Deleting..." : "Delete this User"}
                  </button>
                </div>
                  {user.profilepic && (
                  <img
                    src={`${BASE_URL}${user.profilepic}`}
                    alt={user.username}
                    className="w-20 h-20 mt-2 rounded-full object-cover border border-white/30 shadow-lg"
                  />
                )}
                <div className="mt-4 space-y-3">
                  Notes:
                  {userNotes.length > 0 ? userNotes.map(note => (
                    <div key={note._id} className="p-4 bg-white/20 backdrop-blur-md rounded-2xl shadow-md border border-white/30">
                      
                      <p className="text-white font-medium">{note.title}</p>
                      {/* <p className="text-white text-sm">{note.content}</p> */}
                    </div>
                  )) : <p className="text-white text-sm">No notes available</p>}
                </div>
                {/* {user.profilepic && (
                  <img
                    src={`${BASE_URL}${user.profilepic}`}
                    alt={user.username}
                    className="w-20 h-20 mt-2 rounded-full object-cover border border-white/30 shadow-lg"
                  />
                )} */}
              </div>
            );
          }) : <p className="text-white">No users match your search</p>}
        </div>
      </section>

  
      {modalVideo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl shadow-2xl w-full max-w-2xl relative">
            <button
              className="absolute top-4 right-4 text-white text-xl font-bold"
              onClick={() => setModalVideo(null)}
            >
              ✕
            </button>
            <p className="text-white text-2xl font-bold mb-4">{modalVideo.title}</p>
            <p className="text-white mb-2">{modalVideo.description}</p>
            <video
              src={modalVideo.videoUrl}
              controls
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
      <Outlet />
      <ToastContainer />
    </div>
  );
}

export default OwnerPage;
