import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function GameSection() {
  const games = [
    { name: "Quiz", path: "quiz" },
    { name: "Flashcards", path: "flash" },
    { name: "Memory", path: "memory" },
   
    
  ];

  return (
  <div  className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-6 font-sans">
      <h2 className="text-3xl font-bold text-center mb-6">
        🎮 Explore Learning Games
      </h2>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {games.map((game) => (
          <NavLink
            key={game.name}
            to={`./${game.path}`} // Use relative path
            className={({ isActive }) =>
              `px-6 py-3 rounded-full text-lg font-semibold transition shadow-md ${
                isActive
                  ? "bg-white text-indigo-600"
                  : "bg-indigo-700 hover:bg-indigo-800"
              }`
            }
          >
            {game.name}
          </NavLink>
        ))}
      </div>

      <div className="flex-grow text-gray-800 rounded-xl shadow-md max-w-3xl mx-auto p-6 w-full">
        <Outlet />
      </div>
    </div>
  );
}
