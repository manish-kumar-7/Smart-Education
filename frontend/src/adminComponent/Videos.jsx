import React, { useEffect, useState } from "react";
import axios from "axios";
import { handleError, handleSuccess } from "../util";
import { ToastContainer, toast } from "react-toastify";
import { MessageCircle, X } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

export default function VideoGallery({ isAdmin = true }) {
  const [videos, setVideos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", tags: "", description: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [commentInputs, setCommentInputs] = useState({});
  const [selectedVideo, setSelectedVideo] = useState(null);

  const BASE_URL = "http://localhost:8000";

  // ✅ Fetch videos initially
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/fetchVideos`, { withCredentials: true });
      if (res.data.success) setVideos(res.data.videos);
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

  // ✅ Delete video
  const handleDelete = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    setIsProcessing(true);
    try {
      const res = await axios.delete(`${BASE_URL}/deleteVideo`, {
        withCredentials: true,
        data: { videoId },
      });
      if (res.data.success) {
        setVideos((prev) => prev.filter((v) => v._id !== videoId));
        handleSuccess(res.data.message);
      } else {
        handleError("Failed to delete: " + res.data.message);
      }
    } catch (err) {
      console.error(err);
      handleError("Error deleting video");
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ Edit video
  const startEdit = (video) => {
    setEditingId(video._id);
    setEditForm({
      title: video.title,
      tags: video.tags.join(", "),
      description: video.description,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: "", tags: "", description: "" });
  };

  const saveEdit = async (videoId) => {
    setIsProcessing(true);
    try {
      const res = await axios.put(
        `${BASE_URL}/editVideo`,
        {
          videoId,
          title: editForm.title,
          tags: editForm.tags.split(",").map((tag) => tag.trim()),
          description: editForm.description,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setVideos((prev) =>
          prev.map((v) => (v._id === videoId ? { ...v, ...res.data.video } : v))
        );
        handleSuccess(res.data.message);
        cancelEdit();
      } else {
        handleError("Failed to update: " + res.data.message);
      }
    } catch (err) {
      console.error(err);
      handleError("Error updating video");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add Comment
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
        const newComment = res.data.comment;

        setVideos((prev) =>
          prev.map((v) =>
            v._id === videoId ? { ...v, comments: [...(v.comments || []), newComment] } : v
          )
        );

        if (selectedVideo && selectedVideo._id === videoId) {
          setSelectedVideo((prev) => ({
            ...prev,
            comments: [...(prev.comments || []), newComment],
          }));
        }

        setCommentInputs((prev) => ({ ...prev, [videoId]: "" }));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
    }
  };

  // 🕒 Time formatting
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
    if (months > 0) return months === 1 ? "1 month ago" : `${months} months ago`;
    if (days > 0) return days === 1 ? "1 day ago" : `${days} days ago`;
    if (hours > 0) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    if (minutes > 0) return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    return "just now";
  };

  return (
    <>
      {/* 🔍 Search */}
      <div className="px-5 pb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, tag, or description..."
          className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />
      </div>

      {/* 🎥 Video Grid */}
      <div className="max-w-screen-2xl mx-auto p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos
          .filter((video) => {
            const q = searchQuery.toLowerCase();
            return (
              video.title.toLowerCase().includes(q) ||
              video.description.toLowerCase().includes(q) ||
              video.tags.some((tag) => tag.toLowerCase().includes(q))
            );
          })
          .map((video) => (
            <div
              key={video._id}
              className="relative rounded-2xl overflow-hidden shadow-xl transition hover:scale-[1.03] hover:shadow-2xl"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              {/* Video */}
              <video
                src={`${BASE_URL}${video.videoUrl}`}
                controls
                poster={`${BASE_URL}${video.thumbnailUrl}`}
                className="w-full h-36 object-cover rounded-t-2xl bg-black border-b border-gray-600"
              />

              <div className="p-5 text-white">
                {/* ✏️ Edit Form */}
                {editingId === video._id ? (
                  <>
                    <input
                      name="title"
                      value={editForm.title}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 mb-2 rounded-lg bg-white/20 text-white"
                      placeholder="Title"
                    />
                    <input
                      name="tags"
                      value={editForm.tags}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 mb-2 rounded-lg bg-white/20 text-white"
                      placeholder="Tags (comma-separated)"
                    />
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 mb-2 rounded-lg bg-white/20 text-white resize-none"
                      placeholder="Description"
                    />
                    <div className="flex justify-end space-x-2 mt-3">
                      <button
                        onClick={() => saveEdit(video._id)}
                        disabled={isProcessing}
                        className="px-5 py-2 rounded-lg bg-green-500 hover:bg-green-600 font-semibold"
                      >
                        {isProcessing ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-5 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold mb-1 hover:text-yellow-400">
                      {video.title}
                    </h2>
                    <p className="text-gray-300 text-sm mb-2 line-clamp-3">
                      {video.description}
                    </p>

                    {/* ✅ Show Views */}
                    <p className="text-gray-200 text-sm mb-1">
                      👁️ {video.views || 0} Views
                    </p>

                    {/* ✅ Like count */}
                    <p className="text-gray-200 text-sm mb-3">
                      👍 {video.likes?.length || 0} Likes
                    </p>

                    {/* 💬 Comment modal trigger */}
                    <button
                      onClick={() => setSelectedVideo(video)}
                      className="flex items-center gap-1 text-gray-200 hover:text-yellow-400 text-sm mb-3"
                    >
                      <MessageCircle size={18} />
                      <span>{video.comments?.length || 0}</span>
                    </button>

                    {/* Tags */}
                    {video.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {video.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-block bg-blue-500/30 text-blue-200 text-xs px-2 py-0.5 rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Meta */}
                    <p className="text-xs text-black mb-1">
                      By:{" "}
                      <span className="font-medium">
                        {video.uploadedBy?.username || "Unknown"}
                      </span>
                    </p>
                    <p className="text-xs text-black mb-3">
                      Uploaded: {new Date(video.uploadedAt).toLocaleDateString()}
                    </p>

                    {/* Admin Controls */}
                    {isAdmin && (
                      <div className="mt-3 flex justify-between">
                        <button
                          onClick={() => startEdit(video)}
                          className="text-sm px-4 py-2 rounded-lg bg-yellow-300 hover:bg-yellow-600 text-black font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(video._id)}
                          disabled={isProcessing}
                          className="text-sm px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-black font-semibold"
                        >
                          {isProcessing ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* ✅ Comment Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-2xl w-11/12 md:w-2/3 lg:w-1/2 max-h-[85vh] shadow-2xl p-6 relative flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <h2 className="text-lg md:text-xl font-semibold mb-2 text-white flex items-center gap-2">
              💬 Comments for <span className="text-blue-400">{selectedVideo.title}</span>
            </h2>

            {/* ✅ Show views inside modal */}
            <p className="text-gray-300 text-sm mb-4">
              👁️ {selectedVideo.views || 0} total views
            </p>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto pr-2">
              {selectedVideo.comments?.length > 0 ? (
                <div className="space-y-4">
                  {selectedVideo.comments.map((c, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 pb-4 border-b border-neutral-800"
                    >
                      {/* Avatar */}
                      {c.user?.profilepic ? (
                        <img
                          src={`${BASE_URL}${c.user.profilepic}`}
                          alt="profile"
                          className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                          {c.user?.username?.charAt(0).toUpperCase() ||
                            c.admin?.username?.charAt(0).toUpperCase() ||
                            "A"}
                        </div>
                      )}

                      {/* Comment Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">
                            {c.user?.username || c.admin?.username || "Anonymous"}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatCommentDate(c.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-200 mt-1">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No comments yet...</p>
              )}
            </div>

            {/* Add Comment */}
            <div className="mt-5 flex items-center gap-2">
              <input
                type="text"
                value={commentInputs[selectedVideo._id] || ""}
                onChange={(e) =>
                  setCommentInputs((prev) => ({
                    ...prev,
                    [selectedVideo._id]: e.target.value,
                  }))
                }
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2 text-sm rounded-full bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleAddComment(selectedVideo._id)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white text-sm font-medium transition"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
}
