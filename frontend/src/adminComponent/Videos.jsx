import React, { useEffect, useState } from "react";
import axios from "axios";
import { handleError, handleSuccess } from "../util";
import { ToastContainer } from "react-toastify";

export default function VideoGallery({ isAdmin = true }) {
  const [videos, setVideos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", tags: "", description: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const BASE_URL = "http://localhost:8000";

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/fetchVideos`, { withCredentials: true });
      if (res.data.success) {
        setVideos(res.data.videos);
      } else {
        console.error("Failed to fetch videos:", res.data.message);
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

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
      console.error("Delete error:", err);
      handleError("Error deleting video");
    } finally {
      setIsProcessing(false);
    }
  };

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
      console.error("Update error:", err);
      handleError("Error updating video");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="px-5 pb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, tag, or description..."
          className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {videos
          .filter((video) => {
            const query = searchQuery.toLowerCase();
            return (
              video.title.toLowerCase().includes(query) ||
              video.description.toLowerCase().includes(query) ||
              video.tags.some((tag) => tag.toLowerCase().includes(query))
            );
          })
          .map((video) => (
            <div
              key={video._id}
              className="relative rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-[1.05] hover:shadow-3xl"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <video
                src={`${BASE_URL}${video.videoUrl}`}
                controls
                poster={`${BASE_URL}${video.thumbnailUrl}`}
                className="w-full h-48 object-cover rounded-t-2xl bg-black border-b border-gray-600"
              >
                Your browser does not support the video tag.
              </video>

              <div className="p-5 text-white">
                {editingId === video._id ? (
                  <>
                    <input
                      name="title"
                      value={editForm.title}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 mb-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                      placeholder="Title"
                    />
                    <input
                      name="tags"
                      value={editForm.tags}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 mb-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                      placeholder="Tags (comma-separated)"
                    />
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 mb-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none transition"
                      placeholder="Description"
                    />

                    <div className="flex justify-end space-x-2 mt-3">
                      <button
                        onClick={() => saveEdit(video._id)}
                        disabled={isProcessing}
                        className={`px-5 py-2 rounded-lg bg-green-500 hover:bg-green-600 transition font-semibold ${
                          isProcessing ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                      >
                        {isProcessing ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-5 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 transition font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold mb-1 hover:text-yellow-400 transition">{video.title}</h2>
                    <p className="text-gray-300 text-sm mb-2 line-clamp-3">{video.description}</p>
                    {video.tags && video.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {video.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-block bg-blue-500 bg-opacity-30 text-blue-200 text-xs px-2 py-0.5 rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-black text-xs mb-1">
                      By: <span className="text-black font-medium">{video.uploadedBy?.username || "Unknown"}</span>
                    </p>
                    <p className="text-black text-xs mb-3">
                      Uploaded:{" "}
                      {new Date(video.uploadedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>

                    {isAdmin && (
                      <div className="mt-3 flex justify-between">
                        <button
                          onClick={() => startEdit(video)}
                          className="text-sm px-4 py-2 rounded-lg bg-yellow-300 hover:bg-yellow-600 text-black font-semibold transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(video._id)}
                          disabled={isProcessing}
                          className={`text-sm px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-black font-semibold transition ${
                            isProcessing ? "opacity-60 cursor-not-allowed" : ""
                          }`}
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

      <ToastContainer />
    </>
  );
}
