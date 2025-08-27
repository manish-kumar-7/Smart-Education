import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { GraduationCap, BookOpen, PlayCircle, Gamepad2 } from "lucide-react";

function About() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?.username) {
      navigate("/login");
    }
  }, [user?.username, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-6 font-sans text-white">
      
     
      <section className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4 flex justify-center items-center gap-2 drop-shadow-lg">
          <GraduationCap size={40} className="text-pink-300" />
          About Smart Education
        </h1>
        <p className="text-lg leading-relaxed text-gray-100">
          <span className="font-bold text-white">Smart Education</span> is a concept that
          transforms learning in the digital age. It enables learners to study
          more <span className="text-pink-200 font-medium">effectively</span>,{" "}
          <span className="text-pink-200 font-medium">efficiently</span>,{" "}
          <span className="text-pink-200 font-medium">flexibly</span>, and{" "}
          <span className="text-pink-200 font-medium">comfortably</span>.
        </p>
        <div className="flex justify-center mt-8">
          <img
            src="../public/image.jpg"
            alt="Smart Education Illustration"
            className="rounded-2xl shadow-2xl w-full max-w-3xl border border-white/30"
          />
        </div>
      </section>

     
      <section className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8 mb-12">
        <h2 className="text-2xl font-bold mb-4 text-white">Our Mission</h2>
        <p className="leading-relaxed text-gray-100">
          This project was selected from the{" "}
          <span className="font-semibold text-pink-200">Smart India Hackathon (SIH)</span>{" "}
          under problem statement{" "}
          <span className="font-semibold text-pink-200">#1586 – Student Innovation</span>.
          It is guided by{" "}
          <span className="font-semibold text-pink-200">
            AICTE & Ministry of Education’s Innovation Cell (MIC)
          </span>.
          <br /> <br />
          Our mission is to revolutionize education by combining{" "}
          <span className="text-pink-200 font-medium">technology</span> and{" "}
          <span className="text-pink-200 font-medium">innovation</span> to
          make learning more interactive, personalized, and engaging for every
          student.
        </p>
      </section>

   
      <section className="max-w-6xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 drop-shadow-lg">
          What You Can Do with Smart Education
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-md hover:bg-white/20 transition">
            <PlayCircle className="text-pink-200 w-10 h-10 mb-3" />
            <h3 className="text-lg font-semibold text-white">Watch Videos</h3>
            <p className="text-sm text-gray-200 mt-2">
              Learn concepts easily with high-quality educational videos.
            </p>
          </div>
          <div className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-md hover:bg-white/20 transition">
            <Gamepad2 className="text-green-200 w-10 h-10 mb-3" />
            <h3 className="text-lg font-semibold text-white">Play Games</h3>
            <p className="text-sm text-gray-200 mt-2">
              Enjoy interactive, game-based learning that makes studying fun.
            </p>
          </div>
          <div className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-md hover:bg-white/20 transition">
            <BookOpen className="text-indigo-200 w-10 h-10 mb-3" />
            <h3 className="text-lg font-semibold text-white">Access Notes</h3>
            <p className="text-sm text-gray-200 mt-2">
              Get structured notes and resources anytime, anywhere.
            </p>
          </div>
          <div className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-md hover:bg-white/20 transition">
            <GraduationCap className="text-yellow-200 w-10 h-10 mb-3" />
            <h3 className="text-lg font-semibold text-white">Smart Learning</h3>
            <p className="text-sm text-gray-200 mt-2">
              Experience flexible, efficient, and personalized education.
            </p>
          </div>
        </div>
      </section>

      
      <section className="max-w-4xl mx-auto text-center bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg p-8">
        <p className="text-lg font-medium text-gray-100">
          With Smart Education, we believe in building{" "}
          <span className="text-pink-200">future-ready students</span> through
          innovation, technology, and creativity. Together, let’s make learning
          smarter!
        </p>
      </section>

      <ToastContainer />
    </div>
  );
}

export default About;
