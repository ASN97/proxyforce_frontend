import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import ChatSection from "./components/Dashboard/ChatSection";
import TaskSection from "./components/Dashboard/TaskSection";
import GanttChart from "./components/Dashboard/GanttChart";

const ProjectDashboard = () => {
  const { projectId } = useParams();
  const query = new URLSearchParams(useLocation().search);
  const role = query.get("role") || "pm";
  const tier = query.get("tier") || "1";

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ganttTasks, setGanttTasks] = useState([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/projects/${projectId}`);
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error("Failed to fetch project:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) fetchProject();
  }, [projectId]);

  const handleGenerateGantt = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/projects/${projectId}/generate-gantt`, {
        method: "POST",
      });
      const raw = await res.json();
      const clean = raw.gantt.replace(/```(?:json)?|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setGanttTasks(parsed.tasks || []);
    } catch (err) {
      console.error("Error generating Gantt chart:", err);
      alert("GPT failed to generate Gantt data.");
    }
  };

  if (isLoading) return <div className="text-white p-6">Loading project...</div>;
  if (!project) return <div className="text-white p-6">Project not found</div>;

  return (
    <div className="min-h-screen bg-[#0B0B19] text-white p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Left: Chat */}
      <div className="bg-[#151528]/80 p-4 rounded-xl border border-amber-500/20 h-[calc(100vh-48px)] overflow-hidden">
        <ChatSection
          projectId={projectId}
          role={role}
          tier={tier}
          initialMessages={project.chat_history || []}
        />
      </div>

      {/* Right: Task Table + Gantt */}
      <div className="flex flex-col gap-4 h-[calc(100vh-48px)]">
        {/* Top: Task Allocation Table */}
        <div className="flex-1 bg-[#151528]/80 p-4 rounded-xl border border-amber-500/20 overflow-auto">
          <TaskSection projectId={projectId} tasks={ganttTasks} />
        </div>

        {/* Bottom: Gantt Chart */}
        <div className="flex-1 bg-[#151528]/80 p-4 rounded-xl border border-amber-500/20 overflow-auto">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-white text-lg font-bold">Project Timeline</h2>
            <button
              onClick={handleGenerateGantt}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-1 rounded text-sm"
            >
              Generate Gantt Chart
            </button>
          </div>
          <GanttChart tasks={ganttTasks} />
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
