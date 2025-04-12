"use client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProjectPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:8000/projects");
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
        // fallback: show an empty array or error message
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

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
          {projects.length > 0 ? (
            projects.map((project) => (
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
            ))
          ) : (
            <p className="text-gray-400">No projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
