
import React, { useEffect, useState } from "react";

const COLORS = [
  "bg-red-400",
  "bg-yellow-300",
  "bg-green-400",
  "bg-pink-400",
  "bg-purple-400",
  "bg-cyan-300",
];

const generateBubble = (maxSize) => {
  const minSize = 20;
  const size = Math.random() * (maxSize - minSize) + minSize;
  return {
    id: crypto.randomUUID(),
    left: Math.random() * 90,
    top: Math.random() * 90,
    size,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  };
};

export default function PopTheBubbles() {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);

  // Controls
  const [maxSize, setMaxSize] = useState(40);
  const [spawnSpeed, setSpawnSpeed] = useState(1);

  // Timer
  useEffect(() => {
    if (!running || paused) return;

    if (time > 0) {
      const timer = setTimeout(() => setTime((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setRunning(false);
      setBubbles([]);
    }
  }, [time, running, paused]);

  // Bubble generator
  useEffect(() => {
    if (!running || paused) return;

    const interval = setInterval(() => {
      setBubbles((prev) => [...prev, generateBubble(maxSize)]);
    }, 1000 / spawnSpeed);

    return () => clearInterval(interval);
  }, [running, paused, maxSize, spawnSpeed]);

  const popBubble = (id) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    setScore((s) => s + 1);
  };

  const startGame = () => {
    setScore(0);
    setTime(30);
    setBubbles([]);
    setPaused(false);
    setRunning(true);
  };

  return (
    <div className="flex justify-center items-start gap-4 mt-8">

      {/* Game Container */}
      <div className="relative h-[520px] w-[700px] overflow-hidden rounded-3xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 shadow-2xl">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 flex justify-between text-white font-semibold z-20">
          <span>🎯 Score: {score}</span>
          <span>⏱ {time}s</span>
        </div>

        {/* Bubbles */}
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            onClick={() => popBubble(bubble.id)}
            className={`absolute rounded-full cursor-pointer ${bubble.color} shadow-lg`}
            style={{
              left: `${bubble.left}%`,
              top: `${bubble.top}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
            }}
          />
        ))}

        {/* Start / End Screen */}
        {!running && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center backdrop-blur-md">
            <h2 className="text-4xl font-extrabold mb-3">🎈 Pop the Bubbles</h2>
            <p className="mb-4 opacity-90">
              Pop colorful bubbles anywhere on screen
            </p>

            {time === 0 && (
              <p className="mb-4 text-lg font-semibold">Final Score: {score}</p>
            )}

            <button
              onClick={startGame}
              className="px-8 py-3 bg-white text-indigo-600 rounded-full font-bold shadow-lg hover:scale-105 transition"
            >
              {time === 0 ? "Play Again" : "Start Game"}
            </button>
          </div>
        )}
      </div>

      {/* Control Panel - Right Side */}
      <div className="flex flex-col bg-white/20 backdrop-blur-md rounded-xl p-4 w-36 space-y-4">
        <div className="flex flex-col space-y-2">
          <label>Bubble Size</label>
          <input
            type="range"
            min="20"
            max="80"
            value={maxSize}
            onChange={(e) => setMaxSize(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label>Spawn Speed</label>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.1"
            value={spawnSpeed}
            onChange={(e) => setSpawnSpeed(Number(e.target.value))}
          />
        </div>

        <button
          onClick={() => setPaused((p) => !p)}
          className="py-1.5 bg-white text-indigo-600 rounded-lg font-semibold"
        >
          {paused ? "▶ Resume" : "⏸ Pause"}
        </button>
      </div>
    </div>
  );
}

