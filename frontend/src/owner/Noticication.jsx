import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { handleError, handleSuccess } from "../util";
import { ToastContainer } from "react-toastify";


const BASE_URL = "http://localhost:8000"; 

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; 
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [updateError, setUpdateError] = useState({});

  const fetchNotifications = async (date) => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/notification`, {
        params: { date },
        withCredentials: true,
      });

      const result = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setNotifications(result);
      setError("");
    } catch (err) {
      setNotifications([]);
      setError("Failed to fetch notifications.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    fetchNotifications(selectedDate);
  }, [selectedDate]);


  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredNotifications(notifications);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();

    const filtered = notifications.filter((notif) => {
      return (
        notif.username?.toLowerCase().includes(lowerSearchTerm) ||
        notif.email?.toLowerCase().includes(lowerSearchTerm) ||
        notif.phone?.toLowerCase().includes(lowerSearchTerm) ||
        notif.profession?.toLowerCase().includes(lowerSearchTerm)
      );
    });

    setFilteredNotifications(filtered);
  }, [notifications, searchTerm]);

  const updateStatus = async (id, newStatus) => {
    setUpdatingStatusId(id);
    setUpdateError((prev) => ({ ...prev, [id]: "" }));
    try {
      await axios.patch(
        `${BASE_URL}/status`,
        { id, status: newStatus },
        { withCredentials: true }
      );

      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, status: newStatus } : notif
        )
      );

      handleSuccess("Status updated successfully");
    } catch (err) {
      setUpdateError((prev) => ({
        ...prev,
        [id]: "Failed to update status. Please try again.",
      }));
      handleError("Failed to update status. Please try again.");
      console.error(err);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  return (
    <div
      className="min-h-screen p-6 bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white flex flex-col items-center"
      style={{
        backgroundAttachment: "fixed",
      }}
    >
       
      <NavLink
        to="/alluser"
        className="self-start mb-4 px-4 py-2 rounded-md bg-green-500 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
      >
         Back
      </NavLink>
      <h1 className="text-4xl font-extrabold mb-8 drop-shadow-lg">
        Admin Access Requests
      </h1>

      
      <div
        className="w-full max-w-3xl p-6 mb-8 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg flex flex-col items-center"
        style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)" }}
      >
        {/* Date Picker */}
        <div className="mb-6 w-full flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6">
          <label className="font-semibold text-lg" htmlFor="datePicker">
            Select Date:
          </label>
          <input
            id="datePicker"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-white/30 text-gray-900 px-4 py-2 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-filter backdrop-blur-sm"
          />
        </div>

        {/* Search Bar */}
        <h2 className="text-xl font-semibold mb-3 text-white/90">
          Search Only On Selected Date
        </h2>
        <input
          type="text"
          placeholder="Search by username, email, phone, or profession"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xl px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-filter backdrop-blur-sm"
        />
      </div>

      {/* Loading / Error / No data states */}
      {loading && (
        <p className="text-white text-center text-lg font-semibold mb-8">
          Loading...
        </p>
      )}
      {error && (
        <p className="text-red-500 text-center text-lg font-semibold mb-8">
          {error}
        </p>
      )}
      {!loading && filteredNotifications.length === 0 && !error && (
        <p className="text-gray-400 text-center text-lg font-semibold mb-8">
          No admin requests found matching your criteria.
        </p>
      )}

      {/* Notifications List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">

        {filteredNotifications.map((request) => (
          <div
            key={request._id}
            className="bg-white/10 rounded-xl shadow-lg p-6 backdrop-blur-md border border-white/20 hover:scale-[1.02] transform transition-transform duration-300"
            style={{
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            }}
          >
            <div className="mb-3">
              <span className="font-semibold text-purple-300">Username:</span>{" "}
              {request.username}
            </div>
            <div className="mb-3">
              <span className="font-semibold text-purple-300">Email:</span>{" "}
              {request.email}
            </div>
            <div className="mb-3">
              <span className="font-semibold text-purple-300">Phone:</span>{" "}
              {request.phone}
            </div>
            <div className="mb-3">
              <span className="font-semibold text-purple-300">Profession:</span>{" "}
              {request.profession}
            </div>
            <div className="mb-3 flex items-center space-x-3">
              <span className="font-semibold text-purple-300">Status:</span>
              <select
                disabled={updatingStatusId === request._id}
                value={request.status}
                onChange={(e) => updateStatus(request._id, e.target.value)}
                className="bg-white/30 text-gray-900 px-3 py-1 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-filter backdrop-blur-sm"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            {updateError[request._id] && (
              <p className="text-red-500 mt-1">{updateError[request._id]}</p>
            )}
            <div>
              <span className="font-semibold text-purple-300">Requested At:</span>{" "}
              {new Date(request.createdAt).toLocaleString()}
            </div>
            <div className="mb-3">
  <span className="font-semibold text-purple-300">Email:</span>{" "}
  {request.email}{" "}
  <a
    href="https://mail.google.com"
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-400 underline ml-2 hover:text-blue-300 transition"
  >
    send Gmail
  </a>
</div>

          </div>
        ))}
      </div>

      {/* Toast container to show success/error toasts */}
      <ToastContainer/>
    </div>
  );
}

export default Notification;
