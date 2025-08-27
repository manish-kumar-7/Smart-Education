import React, { useState, useEffect } from "react";
import axios from "axios";
import { handleError, handleSuccess } from "../util";
import { ToastContainer } from "react-toastify";

export default function QuizGame() {
  const [showInstructions, setShowInstructions] = useState(true); 
  const [category, setCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (!category) return;

    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://the-trivia-api.com/v2/questions", {
          params: {
            categories: category.toLowerCase(),
            limit: 10,
          },
        });

        const formatted = res.data.map((q) => ({
          q: q.question.text,
          options: [...q.incorrectAnswers, q.correctAnswer].sort(
            () => Math.random() - 0.5
          ),
          answer: q.correctAnswer,
        }));

        setQuestions(formatted);
        setIndex(0);
        setScore(0);
        setTimeLeft(20);
      } catch (err) {
        
        handleError("Error fetching questions:")
      }
      setLoading(false);
    };

    fetchQuestions();
  }, [category]);

 
  useEffect(() => {
    if (!category || index >= questions.length || selected) return;
    if (timeLeft === 0) {
      nextQuestion();
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, category, index, selected, questions.length]);

  const handleAnswer = (opt) => {
    setSelected(opt);
    if (opt === questions[index].answer) setScore(score + 1);
  };

  const nextQuestion = () => {
    setSelected(null);
    setIndex((prev) => prev + 1);
    setTimeLeft(20);
  };

  const restart = () => {
    setCategory(null);
    setQuestions([]);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setTimeLeft(20);
    setShowInstructions(true); 
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
     
      {showInstructions ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">📘 How to Play</h1>
          <ul className="text-left list-disc list-inside space-y-2 mb-6">
            <li>Choose a category to start the quiz.</li>
            <li>You’ll get <b>10 questions</b> per game.</li>
            <li>You have <b>10 seconds</b> to answer each question.</li>
            <li>Correct answers give you +1 point.</li>
            <li>After finishing, you’ll see your score.</li>
          </ul>
          <button
            onClick={() => setShowInstructions(false)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            OK, Let’s Start 🎮
          </button>
        </div>
      ) : !category ? (
        <>
          <h1 className="text-2xl font-bold text-center mb-4">
            🎯 Choose a Category
          </h1>
          <div className="flex flex-wrap gap-3 justify-center">
            {["General", "Science", "Geography", "History", "Tech"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                {cat}
              </button>
            ))}
          </div>
        </>
      ) : loading ? (
        <p className="text-center">⏳ Loading 10 questions...</p>
      ) : index < questions.length ? (
        <>
          {/* Progress */}
          <div className="flex justify-between mb-4">
            <span>
              Question {index + 1}/{questions.length}
            </span>
            <span className="font-semibold">⏳ {timeLeft}s</span>
          </div>

          {/* Question */}
          <h2 className="text-xl font-semibold mb-3">{questions[index].q}</h2>

          {/* Options */}
          <div className="grid gap-3">
            {questions[index].options.map((opt) => {
              const isCorrect = opt === questions[index].answer;
              const isSelected = selected === opt;

              return (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!selected}
                  className={`p-3 rounded-xl border transition-all
                    ${
                      selected
                        ? isCorrect
                          ? "bg-green-500 text-white"
                          : isSelected
                          ? "bg-red-500 text-white"
                          : "opacity-70"
                        : "hover:bg-blue-100"
                    }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          {selected && (
            <button
              onClick={nextQuestion}
              className="mt-5 w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Next →
            </button>
          )}
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold"> Quiz Finished!</h2>
          
          <p className="mt-2 text-lg">
            Score: <span className="font-bold">{score}</span> / {questions.length}
          </p>
          <p className="mt-1">
            {score === questions.length
              ? " Perfect!"
              : score >= questions.length / 2
              ? " Good Job!"
              : " Keep Practicing!"}
          </p>
          <button
            onClick={restart}
            className="mt-5 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
          >
            Play Again
          </button>
        </div>
      )}
      <ToastContainer/>
    </div>
  );
}
