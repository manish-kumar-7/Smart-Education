import React from "react";
import { Link } from "react-router-dom";
import {
  Video,
  FileText,
  History,
  User,
  Upload,
  Settings,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";

function Explore() {
  return (
    <div className="w-full text-gray-100 bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900">
      {/* Hero Section with Video Background */}
      <section className="relative h-[60vh] flex items-center justify-center text-center">
        <video
          autoPlay
          loop
          
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/jack.mp4" type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="relative z-10 px-6 max-w-3xl bg-black/30 backdrop-blur-[1px] p-10 rounded-3xl shadow-2xl">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
            Explore Smart Education
          </h1>
          <p className="mt-4 text-lg md:text-xl opacity-90">
            See how <span className="font-bold">Admins</span>,{" "}
            <span className="font-bold">Users</span>, and{" "}
            <span className="font-bold">Owner</span> work together on our
            platform.
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

      {/* Admin, Members & Users Panels */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          {/* Members Panel */}
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:scale-105 hover:bg-white/20 transition duration-300">
            <h2 className="text-3xl font-bold mb-6 text-center">Admin Panel</h2>
            <p className="text-gray-200 mb-6 text-center">
              Admins control their own content.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Upload className="w-6 h-6 text-purple-400" />
                Upload and manage videos with details.
              </li>
              <li className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-purple-400" />
                Edit or delete existing videos anytime.
              </li>
              <li className="flex items-center gap-3">
                <Video className="w-6 h-6 text-purple-400" />
                Categorize content by subjects.
              </li>
            </ul>
          </div>

          {/* Users Panel */}
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:scale-105 hover:bg-white/20 transition duration-300">
            <h2 className="text-3xl font-bold mb-6 text-center">Users Panel</h2>
            <p className="text-gray-200 mb-6 text-center">
              Users learn, track progress, and manage their own space.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Video className="w-6 h-6 text-indigo-400" />
                Watch subject-based videos.
              </li>
              <li className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-indigo-400" />
                Create, store, and delete personal notes.
              </li>
              <li className="flex items-center gap-3">
                <History className="w-6 h-6 text-indigo-400" />
                Track learning history and progress.
              </li>
              <li className="flex items-center gap-3">
                <User className="w-6 h-6 text-indigo-400" />
                Manage profile with username & picture.
              </li>
            </ul>
          </div>

          {/* Admin Panel */}
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:scale-105 hover:bg-white/20 transition duration-300">
            <h2 className="text-3xl font-bold mb-6 text-center">Owner Panel</h2>
            <p className="text-gray-200 mb-6 text-center">
              Owner have full control of the platform.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-red-400" />
                Manage entire website settings.
              </li>
              <li className="flex items-center gap-3">
                <Users className="w-6 h-6 text-red-400" />
                Add or remove members & users.
              </li>
              <li className="flex items-center gap-3">
                <Trash2 className="w-6 h-6 text-red-400" />
                Delete inappropriate or harmful content.
              </li>
              <li className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-red-400" />
                Monitor overall system performance & security.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl hover:scale-105 transition duration-300">
          <h2 className="text-4xl font-bold mb-4">
            Start Your Journey with Smart Education
          </h2>
          <p className="mb-6 text-lg opacity-90">
            Whether an Owner Manage Website, a Admins uploading videos, or a
            User learning from it — Smart Education makes the experience
            seamless.
          </p>
          <Link
            to="/FrontPage"
            className="inline-block mt-8 px-8 py-3 text-lg font-semibold 
                       bg-gradient-to-r from-indigo-500 to-purple-600 
                       rounded-xl shadow-lg hover:scale-105 hover:opacity-90 transition"
          >
            Go Back
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Explore;
