import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, Outlet, useMatch } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [viewedVideos, setViewedVideos] = useState(new Set());

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatOpen, setChatOpen] = useState(false); // Chat panel state
  const [fullScreenChat, setFullScreenChat] = useState(false); // Fullscreen chat state

  const BASE_URL = "http://localhost:8000";
  const matchProfile = useMatch("/profile");

  useEffect(() => {
    if (!user?.username) navigate("/login");
  }, [user?.username, navigate]);

  useEffect(() => {
    if (matchProfile) fetchVideos();
  }, [matchProfile]);

  const normalizeComment = (c) => {
    const actor =
      (c.user && typeof c.user === "object" && c.user) ||
      (c.admin && typeof c.admin === "object" && c.admin) ||
      {};

    return {
      _id: c._id || c.id,
      text: c.text,
      username: actor.username || "Unknown",
      profilepic: actor.profilepic ? `${BASE_URL}${actor.profilepic}` : null,
      createdAt: c.createdAt || new Date().toISOString(),
    };
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/profileVideo`, {
        withCredentials: true,
      });

      if (res.data.success) {
        const vids = res.data.videos.map((v) => ({
          ...v,
          likes: Array.isArray(v.likes) ? v.likes : [],
          comments: Array.isArray(v.comments)
            ? v.comments.map((c) => normalizeComment(c))
            : [],
          views: v.views || 0,
        }));
        setVideos(vids);
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (videoId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/videos/${videoId}/like`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setVideos((prev) =>
          prev.map((v) =>
            v._id === videoId
              ? {
                  ...v,
                  likes: v.likes.includes(user._id)
                    ? v.likes.filter((id) => id !== user._id)
                    : [...v.likes, user._id],
                }
              : v
          )
        );

        if (activeVideo?._id === videoId) {
          setActiveVideo((prev) => ({
            ...prev,
            likes: prev.likes.includes(user._id)
              ? prev.likes.filter((id) => id !== user._id)
              : [...prev.likes, user._id],
          }));
        }
      }
    } catch {
      toast.error("Failed to like video");
    }
  };

  const handleAddComment = async (videoId) => {
    const comment = commentInputs[videoId]?.trim();
    if (!comment) return;

    try {
      const res = await axios.post(
        `${BASE_URL}/videos/${videoId}/comment`,
        { text: comment },
        { withCredentials: true }
      );

      if (res.data.success) {
        const newComment = normalizeComment(res.data.comment);

        setVideos((prev) =>
          prev.map((v) =>
            v._id === videoId
              ? { ...v, comments: [...v.comments, newComment] }
              : v
          )
        );

        setCommentInputs((prev) => ({ ...prev, [videoId]: "" }));

        if (activeVideo?._id === videoId) {
          setActiveVideo((prev) => ({
            ...prev,
            comments: [...prev.comments, newComment],
          }));
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
    }
  };

  const handleView = async (videoId) => {
    if (viewedVideos.has(videoId)) return;
    try {
      const res = await axios.post(
        `${BASE_URL}/videos/${videoId}/view`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setVideos((prev) =>
          prev.map((v) =>
            v._id === videoId ? { ...v, views: res.data.views } : v
          )
        );
        setViewedVideos((prev) => new Set(prev).add(videoId));
      }
    } catch (err) {
      console.error("Failed to update views:", err);
    }
  };

  const formatCommentDate = (isoString) => {
    const createdDate = new Date(isoString);
    const now = new Date();

    const diffMs = now - createdDate;
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return years === 1 ? "1 year ago" : `${years} years ago`;
    if (months > 0)
      return months === 1 ? "1 month ago" : `${months} months ago`;
    if (days > 0) return days === 1 ? "1 day ago" : `${days} days ago`;
    if (hours > 0) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    if (minutes > 0)
      return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    return "just now";
  };

  const filteredVideos = videos.filter((video) => {
    const search = searchTerm.toLowerCase();
    return (
      video.title.toLowerCase().includes(search) ||
      video.description.toLowerCase().includes(search) ||
      video.uploadedBy?.username?.toLowerCase().includes(search)
    );
  });

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (sortBy === "newest")
      return new Date(b.uploadedAt) - new Date(a.uploadedAt);
    if (sortBy === "oldest")
      return new Date(a.uploadedAt) - new Date(b.uploadedAt);
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return 0;
  });

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");

    try {
      const res = await axios.post(
        `${BASE_URL}/api/chat`,
        { message: chatInput },
        { withCredentials: true }
      );
      if (res.data.reply) {
        const botMessage = { role: "bot", content: res.data.reply };
        setChatMessages((prev) => [...prev, botMessage]);
      }
    } catch (err) {
      toast.error("Failed to send message to bot");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 p-6 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50">
        <div className="mx-auto max-w-7xl px-6 py-3 relative">
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
              Smart Education Page
            </h1>
            <button
              className="text-white text-2xl md:hidden"
              onClick={() => setOpen(!open)}
            >
              ☰
            </button>
            <ul
              className={`md:flex md:gap-6 md:static absolute left-0 top-full w-full md:w-auto bg-black/40 md:bg-transparent backdrop-blur-lg md:backdrop-blur-none border-t md:border-none border-white/10 transition-all duration-300 overflow-hidden ${
                open ? "max-h-96 py-4" : "max-h-0 md:max-h-none"
              }`}
            >
              {[
                { to: "/profile", label: "Home" },
                { to: "personal", label: "Account" },
                { to: "About", label: "About" },
                { to: "game", label: "Game" },
              
                { to: "Writenote", label: "Write Note" },
              ].map(({ to, label }) => (
                <li key={to} className="px-6 md:px-0 py-2 md:py-0">
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `px-3 py-1 rounded-full transition ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "hover:bg-white/10 hover:text-white"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Profile content */}
      {matchProfile && (
        <div className="pt-28 space-y-8">
          {/* Search & Sort */}
          <div className="mx-auto max-w-7xl px-2">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="flex-1 flex items-center gap-3">
                <div className="relative w-full sm:max-w-md">
                  <input
                    type="text"
                    placeholder="Search videos, descriptions or users…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-3 py-2 rounded-xl bg-white/15 text-white placeholder:text-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
                  />
                </div>
              </div>
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-white/15 text-blue border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Video Grid */}
          <div className="mx-auto max-w-7xl px-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full text-center text-white/90">
                  ⏳ Loading…
                </div>
              ) : sortedVideos.length > 0 ? (
                sortedVideos.map((video) => {
                  const isLiked = video.likes.includes(user._id);
                  return (
                    <div
                      key={video._id}
                      className="group overflow-hidden rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition"
                    >
                      <video
                        src={`${BASE_URL}${video.videoUrl}`}
                        controls
                        poster={`${BASE_URL}${video.thumbnailUrl}`}
                        className="w-full h-56 object-cover bg-black"
                        onPlay={() => handleView(video._id)}
                      />
                      <div className="p-3 border-t border-white/20">
                        <h3 className="text-white font-semibold truncate">
                          {video.title}
                        </h3>
                        {video.uploadedBy?.username && (
                          <p className="text-xs text-white/70">
                            by {video.uploadedBy.username}
                          </p>
                        )}
                      </div>
                      <div className="px-3 pb-3">
                        <p className="text-sm text-gray-100/90 line-clamp-2 min-h-[2.5rem]">
                          {video.description}
                        </p>
                      </div>
                      <div className="p-3 flex items-center justify-between text-white text-sm">
                        <span>👁 {video.views} views</span>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <button
                          onClick={() => handleLike(video._id)}
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition border ${
                            isLiked
                              ? "bg-rose-500/90 hover:bg-rose-600 text-white border-rose-400/40"
                              : "bg-pink-500/90 hover:bg-pink-600 text-white border-pink-400/40"
                          }`}
                        >
                          {isLiked ? "👎" : "👍"}
                          <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                            {video.likes.length}
                          </span>
                        </button>
                        <button
                          onClick={() => setActiveVideo(video)}
                          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition bg-blue-500/90 hover:bg-blue-600 text-white border border-blue-400/40"
                        >
                          💬
                          <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                            {video.comments.length}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center text-white">
                  No videos found.
                   
       
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-black shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div>
                <h2 className="text-base font-semibold text-white">
                  {activeVideo.title}
                </h2>
                <p className="text-xs text-white">Comments</p>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="rounded-full px-3 py-1 text-sm bg-red-300 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="px-5 py-4 max-h-96 overflow-y-auto bg-black rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-white mb-4">
                Comments ({activeVideo.comments?.length || 0})
              </h3>
              {activeVideo.comments?.length > 0 ? (
                activeVideo.comments.map((c) => (
                  <div
                    key={c._id}
                    className="flex gap-3 mb-4 pb-3 border-b last:border-0 last:pb-0"
                  >
                    <div className="flex-shrink-0">
                      {c.profilepic ? (
                        <img
                          src={c.profilepic}
                          alt={c.username}
                          className="h-10 w-10 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                          {c.username.slice(0, 1).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-blue-500">
                          {c.username}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatCommentDate(c.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-white mt-1 leading-snug">
                        {c.text}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No comments yet. Be the first one!
                </p>
              )}
            </div>
            <div className="px-5 py-4 border-t bg-black">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={commentInputs[activeVideo._id] || ""}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({
                      ...prev,
                      [activeVideo._id]: e.target.value,
                    }))
                  }
                  placeholder="Write a comment…"
                  className="flex-1 rounded-xl border text-white border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleAddComment(activeVideo._id)}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium"
                >
                  Post
                </button>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="mt-3 w-full rounded-xl bg-green-500 hover:bg-gray-200 text-gray-800 px-4 py-2 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Icon */}
      <div
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 cursor-pointer"
        onClick={() => setChatOpen(true)}
      >
        <div className="rounded-full bg-blue-600 w-12 h-12 flex items-center justify-center shadow-lg text-white text-xl font-bold">
          💬
        </div>
        <span className="text-white font-semibold text-sm bg-black/40 px-3 py-1 rounded-full shadow-lg">
          Smart AI
        </span>
      </div>

      <div
        className={`fixed top-0 right-0 h-full bg-gray-700 shadow-2xl z-50 transform transition-transform duration-300 ${
          chatOpen ? "translate-x-0" : "translate-x-full"
        } ${fullScreenChat ? "w-full" : "w-96"} flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/20">
          <h2 className="text-lg font-semibold text-white">Smart AI</h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFullScreenChat(!fullScreenChat)}
              className="text-white hover:text-blue-400 text-sm px-2 py-1 border border-white/30 rounded"
            >
              {fullScreenChat ? "◻" : "⌞ ⌝"}
            </button>

            <button
              onClick={() => setChatOpen(false)}
              className="text-white text-xl hover:text-red-400"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 flex flex-col-reverse overflow-y-auto p-4 gap-2">
          {chatMessages
            .slice()
            .reverse()
            .map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-xl text-sm ${
                  m.role === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-black/50 text-white self-start"
                }`}
              >
                {m.content}
              </div>
            ))}
        </div>

        {/* Input */}
        <div className="flex gap-2 p-4 border-t border-white/20">
          <input
            type="text"
            placeholder="Type a message..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-1 rounded-xl px-3 py-2 text-sm text-white bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleSendMessage}
            className="rounded-xl px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
          >
            Send
          </button>
        </div>
      </div>

      <ToastContainer />
      <div className="mt-12">
        <Outlet />
      </div>
    </div>
  );
}

export default Profile;
