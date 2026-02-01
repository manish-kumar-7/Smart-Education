import React, { useEffect, useState } from "react";

const EMOJIS = ["🎈", "💖", "🌟", "🔥", "🍀", "😊", "😎", "💎"];

const createEmoji = (maxSize) => ({
  id: crypto.randomUUID(),
  emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
  left: Math.random() * 85,
  size: Math.random() * maxSize + 40,
  speed: Math.random() * 1 + 1.5, // slower speed
});

export default function GentleEmojiDrop() {
  const [emojis, setEmojis] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [playing, setPlaying] = useState(false);

  const [maxSize, setMaxSize] = useState(50);
  const [spawnSpeed, setSpawnSpeed] = useState(1000); // slower spawn

  // Spawn emojis slowly
  useEffect(() => {
    if (!playing) return;

    const interval = setInterval(() => {
      setEmojis((prev) => [...prev, createEmoji(maxSize)]);
    }, spawnSpeed);

    return () => clearInterval(interval);
  }, [playing, spawnSpeed, maxSize]);

  // Move emojis slowly
  useEffect(() => {
    if (!playing) return;

    const fall = setInterval(() => {
      setEmojis((prev) =>
        prev
          .map((e) => ({ ...e, top: (e.top || 0) + e.speed }))
          .filter((e) => {
            if (e.top > 100) {
              setLives((l) => l - 1);
              return false;
            }
            return true;
          })
      );
    }, 150); // slower update for gentle movement

    return () => clearInterval(fall);
  }, [playing]);

  const popEmoji = (id) => {
    setEmojis((e) => e.filter((x) => x.id !== id));
    setScore((s) => s + 10);
  };

  const startGame = () => {
    setScore(0);
    setLives(5);
    setEmojis([]);
    setPlaying(true);
  };

  useEffect(() => {
    if (lives <= 0) setPlaying(false);
  }, [lives]);

  return (
    <div className="relative h-[500px] max-w-md mx-auto bg-gradient-to-br from-pink-300 via-purple-400 to-blue-400 rounded-3xl overflow-hidden shadow-xl">

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between text-white font-semibold z-10">
        <span>🎯 Score: {score}</span>
        <span>❤️ Lives: {lives}</span>
      </div>

      {/* Emojis */}
      {emojis.map((e) => (
        <div
          key={e.id}
          onClick={() => popEmoji(e.id)}
          className="absolute cursor-pointer select-none transition-transform hover:scale-125"
          style={{
            left: `${e.left}%`,
            top: `${e.top || 0}%`,
            fontSize: e.size,
          }}
        >
          {e.emoji}
        </div>
      ))}

      {/* Start / Game Over */}
      {!playing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white backdrop-blur-md px-6">
          <h2 className="text-4xl font-extrabold mb-3">🎈 Gentle Emoji Drop</h2>
          <p className="mb-4 opacity-90">Tap the falling emojis before they escape!</p>
          {lives === 0 && <p className="mb-4 text-lg font-semibold">Final Score: {score}</p>}
          <button
            onClick={startGame}
            className="px-8 py-3 bg-white text-indigo-600 rounded-full font-bold shadow-lg hover:scale-110 transition"
          >
            {lives === 0 ? "Play Again" : "Start Game"}
          </button>
        </div>
      )}
    </div>
  );
}
