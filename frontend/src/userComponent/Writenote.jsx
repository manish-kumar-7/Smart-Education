import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../util";

function Writenote() {
  const [notes, setNotes] = useState({
    title: "",
    content: "",
  });
  const [allNotes, setAllNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  const setTitle = (e) => setNotes({ ...notes, title: e.target.value });
  const setContent = (e) => setNotes({ ...notes, content: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    const { title, content } = notes;

    if (!title || !content) return handleError("You must provide all fields");

    try {
      const url = "http://localhost:8000/profile/id";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(notes),
      });

      const data = await response.json();
      setNotes({ title: "", content: "" });

      if (data.success) {
        handleSuccess(data.message);
        fetchNotes();
      } else {
        handleError(data.message);
      }
    } catch (error) {
      handleError(error.message);
    }
  };

  const fetchNotes = async () => {
    try {
      const url = "http://localhost:8000/profile/file";
      const response = await fetch(url, { method: "GET", credentials: "include" });
      const data = await response.json();

      if (data.success) {
        setAllNotes(data.file || []);
      } else {
        handleError(data.message || "Something went wrong");
      }
    } catch (error) {
      handleError(error.message);
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const url = `http://localhost:8000/profile/file/${noteId}`;
      const response = await fetch(url, { method: "DELETE", credentials: "include" });
      const data = await response.json();

      if (data.success) {
        handleSuccess("Note deleted successfully");
        setSelectedNote(null);
        fetchNotes();
      } else {
        handleError(data.message || "Failed to delete note");
      }
    } catch (error) {
      handleError(error.message);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex flex-col items-center p-6">
      
      
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-6 mb-10 border border-white/20">
        <h1 className="text-3xl font-bold text-white mb-6 text-center drop-shadow">
           Write a Note
        </h1>

        <input
          type="text"
          value={notes.title}
          onChange={setTitle}
          placeholder="Enter File Name .."
          className="w-full bg-white/20 text-white placeholder-gray-200 border border-white/30 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />

        <textarea
          value={notes.content}
          onChange={setContent}
          placeholder="Write your note here..."
          rows="6"
          className="w-full bg-white/20 text-white placeholder-gray-200 border border-white/30 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-300"
        ></textarea>

        <div className="flex justify-between">
          <button
            onClick={() => setNotes({ title: "", content: "" })}
            className="px-6 py-2 bg-white/20 text-white rounded-lg shadow hover:bg-red-500/80 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow hover:opacity-90 transition"
          >
            Save Note
          </button>
        </div>
      </div>

      
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg shadow-lg rounded-2xl p-6 border border-white/20">
        <h2 className="text-2xl font-semibold text-white mb-4 text-center drop-shadow">
           Saved Notes
        </h2>

        {allNotes.length === 0 ? (
          <p className="text-gray-200 text-center">No notes saved yet.</p>
        ) : (
          <ul className="space-y-2">
            {allNotes.map((note) => (
              <li
                key={note._id}
                className="flex justify-between items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition cursor-pointer"
              >
                <span
                  className="text-white font-medium"
                  onClick={() => setSelectedNote(note)}
                >
                  {note.title}
                </span>

                <button
                  onClick={() => handleDelete(note._id)}
                  className="px-3 py-1.5 bg-red-500/70 text-white text-sm font-semibold rounded-md shadow hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

       
        {selectedNote && (
          <div className="mt-6 p-4 bg-white/10 rounded-lg border-t border-white/30">
            <h3 className="text-xl font-bold text-pink-200 mb-2">
              {selectedNote.title}
            </h3>
            <p className="whitespace-pre-wrap text-gray-100">
              {selectedNote.content}
            </p>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default Writenote;
