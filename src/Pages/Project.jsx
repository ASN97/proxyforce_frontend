"use client"
import React from "react";
import { useNavigate } from "react-router-dom";

const dummyProjects = [
  {
    id: 1,
    title: "Website Redesign",
    description: "Complete overhaul of company website with new branding",
    due: "Dec 14",
    progress: 65,
    members: 4,
  },
  {
    id: 2,
    title: "Mobile App Development",
    description: "Creating a new customer-facing mobile application",
    due: "Feb 27",
    progress: 30,
    members: 6,
  },
];

const ProjectPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-scales text-white px-6 py-10 fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-white text-shadow-gold">Your Projects</h1>
          <button
            onClick={() => navigate("/project/create")}
            className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 px-6 py-2 rounded-full font-semibold shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50 hover-glow"
          >
            + Create New Project
          </button>
        </div>

        <div className="mb-8">
          <input
            placeholder="Search projects..."
            className="w-full max-w-md p-2 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-300 focus:outline-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {dummyProjects.map((project) => (
            <div
              key={project.id}
              className="bg-[#151528]/80 backdrop-blur-md rounded-2xl p-6 border border-amber-500/30 shadow-xl hover:shadow-amber-900/40 transition duration-300"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-white">{project.title}</h2>
                <span className="text-sm text-amber-400 font-semibold">In Progress</span>
              </div>
              <p className="text-sm text-gray-300 mb-4">{project.description}</p>

              <div className="w-full bg-gray-700 h-2 rounded overflow-hidden mb-2">
                <div
                  className="bg-amber-500 h-full animate-slow-pulse"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-sm text-gray-400">
                <span>📅 Due: {project.due}</span>
                <span>👥 {project.members} members</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
