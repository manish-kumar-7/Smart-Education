// MemoryGame.jsx
import React, { useState, useEffect } from "react";
import { handleError, handleSuccess } from "../util";
import { ToastContainer } from "react-toastify";


// duplicate + shuffle cards
const initialCards = (() => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const selected = [];
  while (selected.length < 6) {
    const letter = alphabet[Math.floor(Math.random() * alphabet.length)];
    if (!selected.includes(letter)) selected.push(letter);
  }
  return selected;
})();

function shuffleCards() {
  return [...initialCards, ...initialCards].sort(() => Math.random() - 0.5);
}

export default function MemoryGame() {
  const [showInstructions, setShowInstructions] = useState(true);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [cards, setCards] = useState(shuffleCards());

  const handleFlip = (i) => {
    if (flipped.length === 2 || flipped.includes(i) || matched.includes(cards[i])) {
      handleError("In One Time Only 2 Card Is Fliped");
      return;
    }

    const newFlipped = [...flipped, i];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        setMatched((prev) => [...prev, cards[first]]);
        handleSuccess("Nice! You found a match.");
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  };

  useEffect(() => {
    if (matched.length === initialCards.length) {
      setTimeout(() => {
        handleSuccess("🎉 You Win! Restarting...");
        setCards(shuffleCards());
        setMatched([]);
        setFlipped([]);
      }, 500);
    }
  }, [matched]);

  return (
    <div className="max-w-md mx-auto mt-10">
      {showInstructions ? (
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4">🧠 Memory Game Instructions</h1>
          <ul className="text-left list-disc list-inside space-y-2 mb-6">
            <li>Flip two cards at a time.</li>
            <li>If they match, they stay revealed.</li>
            <li>Match all pairs to win.</li>
            <li>Game will restart automatically when you win.</li>
          </ul>
          <button
            onClick={() => setShowInstructions(false)}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
          >
            Start Game 🎮
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <div
              key={i}
              onClick={() => handleFlip(i)}
              className={`h-20 flex items-center justify-center rounded-xl cursor-pointer text-2xl font-bold transition-all
                ${
                  flipped.includes(i) || matched.includes(card)
                    ? "bg-green-400 text-white"
                    : "bg-blue-300 hover:bg-blue-400"
                }`}
            >
              {flipped.includes(i) || matched.includes(card) ? card : "❓"}
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
