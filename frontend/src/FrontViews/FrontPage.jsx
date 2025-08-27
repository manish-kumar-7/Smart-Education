import React from "react";

import { Link } from "react-router-dom";
function FrontPage() {
  return (
    <div className="w-full text-gray-100 bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900">
      {/* Hero Section with Video Background */}
      {/* Hero Section with Video Background */}
      {/* Hero Section with Video Background */}
      <section className="relative h-[80vh] flex items-center justify-center text-center" >
      <img
  src="/signup.jpg"
  alt="Background"
  className="absolute top-0 left-0 w-full h-full object-cover"
/>

        
        {/* Lighter overlay with minimal blur */}
        <div className="relative z-10 px-6 max-w-4xl bg-black/30 backdrop-blur-[1px] p-10 rounded-3xl shadow-2xl">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            Smart Education 
          </h1>
          <p className="mt-4 text-lg md:text-xl opacity-90">
            Redefining the way students learn through interactive videos,
            engaging quizzes, and keeps notes.
          </p>
          <Link
            to="/signup"
            className="inline-block mt-8 px-8 py-3 text-lg font-semibold 
                       bg-gradient-to-r from-indigo-500 to-purple-600 
                       rounded-xl shadow-lg hover:scale-105 hover:opacity-90 transition"
          >
            Get Started 
          </Link>
         
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">
            Why Choose Smart Education?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
               
                title: "Interactive Videos",
                desc: "Learn with engaging, high-quality videos for every subject.",
              },
              {
              
                title: "Quizzes & Practice",
                desc: "Instant feedback with quizzes, assignments, and challenges.",
              },
              {
                
                title: "Take Notes",
                desc: "Write, save, and organize your notes directly in the app.",
              },
              {
               
                title: "Personalized Learning",
                desc: "Smart suggestions based on your progress and performance.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl 
                           hover:scale-105 hover:bg-white/20 hover:shadow-2xl 
                           transition transform duration-300"
              >
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-200">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:scale-105 hover:bg-white/20 transition duration-300">
            <h2 className="text-3xl font-bold mb-6">
              Learn Smarter, Not Harder 
            </h2>
            <p className="text-gray-200 mb-4">
              Our platform is designed for students of all ages. Whether you are
              preparing for exams or exploring new skills, Smart Education has
              everything you need — from videos and quizzes to a simple notes
              system.
            </p>
            <p className="text-gray-200">
              Join thousands of learners who have transformed their learning
              journey with us.
            </p>
                  <Link
            to="/Explore"
            className="inline-block mt-8 px-8 py-3 text-lg font-semibold 
                       bg-gradient-to-r from-indigo-500 to-purple-600 
                       rounded-xl shadow-lg hover:scale-105 hover:opacity-90 transition"
          >
             Explore Now 
          </Link>
            
          </div>
          <div className="flex justify-center">
            <img
              src="/image.jpg"
              alt="Students learning"
              className="rounded-3xl shadow-2xl w-96 
                         hover:scale-105 hover:shadow-purple-500/40 
                         transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl hover:scale-105 transition duration-300">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Learning? 
          </h2>
          <p className="mb-6 text-lg opacity-90">
            Join Smart Education today and take the next step in your journey.
          </p>
            <Link
            to="/signup"
            className="inline-block mt-8 px-8 py-3 text-lg font-semibold 
                       bg-gradient-to-r from-indigo-500 to-purple-600 
                       rounded-xl shadow-lg hover:scale-105 hover:opacity-90 transition"
          >
            Get Started 
          </Link>
        </div>
      </section>
    </div>
  );
}

export default FrontPage; 