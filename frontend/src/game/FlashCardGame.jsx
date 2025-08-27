import React, { useEffect, useState } from "react";
import { handleError, handleSuccess } from "../util";
import { ToastContainer } from "react-toastify";
export default function FlashcardQuiz() {
  const [showInstructions, setShowInstructions] = useState(true); // 👈 Instructions
  const [flashcards, setFlashcards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch 10 questions from Trivia API
  useEffect(() => {
    if (showInstructions) return; // wait until user starts
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://the-trivia-api.com/v2/questions?limit=10&categories=science,technology"
        );
        const data = await res.json();

        // format data into {question, answer}
        const formatted = data.map((q) => ({
          question: q.question.text,
          answer: q.correctAnswer,
        }));

        setFlashcards(formatted);
        setIndex(0);
        setFlipped(false);
      } catch (err) {
        
        handleError("Error fetching flashcards:")
      }
      setLoading(false);
    };

    fetchData();
  }, [showInstructions]);

  const nextCard = () => {
    setFlipped(false);
    setIndex((prev) => prev + 1);
  };

  const restart = () => {
    setShowInstructions(true);
    setFlashcards([]);
    setIndex(0);
    setFlipped(false);
  };

  // ✅ Instructions Screen
  if (showInstructions) {
    return (
      <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">📘 Flashcard Quiz</h1>
        <ul className="text-left list-disc list-inside space-y-2 mb-6">
          <li>You will get <b>10 flashcards</b> from Science & Technology.</li>
          <li>Click a card to <b>flip</b> between Question and Answer.</li>
          <li>Click "Next" to move to the next card.</li>
          <li>After the last card, you can restart.</li>
        </ul>
        <button
          onClick={() => setShowInstructions(false)}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          Start Quiz 🎮
        </button>
      </div>
    );
  }

  if (loading) {
    return <p className="text-center mt-10">⏳ Loading flashcards...</p>;
  }

  if (flashcards.length === 0) {
    return <p className="text-center mt-10">⚠️ No flashcards found.</p>;
  }

  return (
    <div className="flex flex-col items-center gap-6 mt-10">
      {/* Flashcard */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="w-96 h-56 flex items-center justify-center text-xl font-bold bg-blue-200 rounded-xl shadow-lg cursor-pointer transition-transform transform hover:scale-105 p-4 text-center"
      >
        {flipped ? flashcards[index].answer : flashcards[index].question}
      </div>

      {/* Next / Restart Button */}
      {index < flashcards.length - 1 ? (
        <button
          onClick={nextCard}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          Next →
        </button>
      ) : (
        
        <button
          onClick={restart}
          className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
        >
           
          Restart ↻
        </button>
      )}

      {/* Progress */}
      <p>
        Card {index + 1} / {flashcards.length}
      </p>
      <ToastContainer/>
    </div>
  );
}
