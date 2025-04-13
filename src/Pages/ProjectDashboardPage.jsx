// ProjectDashboard.jsx
"use client"

import { useEffect, useState } from "react"
import { useParams, useLocation } from "react-router-dom"
import ChatSection from "./components/Dashboard/ChatSection"
import TaskSection from "./components/Dashboard/TaskSection"
import TimelineSection from "./components/Dashboard/TimelineSection"

const ProjectDashboard = () => {
  const { projectId } = useParams()
  const query = new URLSearchParams(useLocation().search)
  const role = query.get("role") || "pm"
  const tier = query.get("tier") || "1"

  const [project, setProject] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/projects/${projectId}`)
        const data = await res.json()
        setProject(data)
      } catch (err) {
        console.error("Failed to fetch project:", err)
      } finally {
        setIsLoading(false)
      }
    }

    if (projectId) fetchProject()
  }, [projectId])

  if (isLoading) return <div className="text-white p-6">Loading project...</div>
  if (!project) return <div className="text-white p-6">Project not found</div>

  return (
    <div className="min-h-screen bg-[#0B0B19] text-white p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Left: Chat */}
      <div className="bg-[#151528]/80 p-4 rounded-xl border border-amber-500/20 h-[calc(100vh-48px)] overflow-hidden">
        <ChatSection projectId={projectId} role={role} tier={tier} initialMessages={project.chat_history || []} />
      </div>

      {/* Right: Top = Tasks, Bottom = Timeline */}
      <div className="flex flex-col gap-4 h-[calc(100vh-48px)]">
        <div className="flex-1 bg-[#151528]/80 p-4 rounded-xl border border-amber-500/20 overflow-auto">
          <TaskSection projectId={projectId} tasks={project.tasks || []} team={project.team_members || []} />
        </div>
        <div className="flex-1 bg-[#151528]/80 p-4 rounded-xl border border-amber-500/20 overflow-auto">
          <TimelineSection milestones={project.milestones || []} />
        </div>
      </div>
    </div>
  )
}

export default ProjectDashboard