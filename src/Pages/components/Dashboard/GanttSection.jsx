import React, { useState } from "react";
import GanttChart from "./GanttChart";
import TaskSection from "./TaskSection";

const GanttSection = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/projects/${projectId}/generate-gantt`, {
        method: "POST",
      });
      const raw = await res.json();
      const clean = raw.gantt.replace(/```(?:json)?|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setTasks(parsed.tasks || []);
    } catch (err) {
      console.error("Failed to load tasks:", err);
      alert("GPT failed to generate tasks.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <TaskSection projectId={projectId} tasks={tasks} />

      <div className="bg-[#151528] border border-amber-500/20 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-white text-lg font-bold">Project Timeline</h2>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-1 rounded text-sm"
          >
            {isLoading ? "Loading..." : "Generate Gantt Chart"}
          </button>
        </div>
        <GanttChart tasks={tasks} />
      </div>
    </div>
  );
};

export default GanttSection;
