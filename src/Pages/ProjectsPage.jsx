"use client"
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Plus, Folder, Clock, Users, ArrowRight } from "lucide-react"

const ProjectsPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const role = queryParams.get("role") || "pm"
  const tier = queryParams.get("tier") || "1"

  const [projects, setProjects] = useState([])
  const [roleTheme, setRoleTheme] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tierInfo, setTierInfo] = useState({
    experience: "",
    title: ""
  })

  useEffect(() => {
    const fetchRoleTheme = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/roles/${role}/theme`)
        const data = await response.json()
        setRoleTheme(data)
      } catch (err) {
        setError("Failed to load role theme")
        console.error("Error fetching role theme:", err)
      }
    }

    const fetchTierInfo = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/tiers/${tier}`)
        const data = await response.json()
        setTierInfo({
          experience: data.years,
          title: data.title
        })
      } catch (err) {
        setError("Failed to load tier information")
        console.error("Error fetching tier info:", err)
      }
    }

    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/projects')
        const data = await response.json()
        setProjects(data)
      } catch (err) {
        setError("Failed to load projects")
        console.error("Error fetching projects:", err)
      } finally {
        setLoading(false)
      }
    }

    Promise.all([fetchRoleTheme(), fetchTierInfo(), fetchProjects()])
  }, [role, tier])

  const handleCreateProject = () => {
    navigate("/new-project")
  }

  const handleSelectProject = (projectId) => {
    navigate(`/project/${projectId}?role=${role}&tier=${tier}`)
  }

  const goBack = () => {
    navigate(`/experience?role=${role}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B19] text-white flex items-center justify-center">
        <div className="text-amber-500">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0B19] text-white flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0B19] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[#0B0B19]">
          {/* Dragon scale pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          ></div>

          {/* Magical glow effects */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-700 opacity-20 blur-[100px] animate-pulse"></div>
          <div
            className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-700 opacity-20 blur-[100px] animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
      </div>

      {/* Back Button */}
      <div className="relative z-10 container mx-auto px-6 pt-8">
        <button onClick={goBack} className="flex items-center text-amber-500 hover:text-amber-400 transition-colors">
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span>Return to Experience Selection</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <div className="flex items-center mb-2">
              <div
                className={`bg-gradient-to-r ${roleTheme.gradient} w-10 h-10 rounded-full flex items-center justify-center mr-3`}
              >
                <Users className="h-5 w-5" />
              </div>
              <h1 className="text-3xl font-bold">Your Projects</h1>
            </div>
            <p className="text-gray-400">
              Select an existing project or create a new one to add your {tierInfo.title} {roleTheme.title}
            </p>
          </div>

          <button
            onClick={handleCreateProject}
            className="mt-4 md:mt-0 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50 flex items-center"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create New Project
          </button>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleSelectProject(project.id)}
                className="group relative cursor-pointer"
              >
                {/* Card glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-700 rounded-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300 blur-md"></div>

                {/* Card content */}
                <div className="relative bg-[#151528]/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-amber-500/10 group-hover:border-amber-500/50 transition-all duration-300 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="bg-amber-500/20 p-2 rounded-lg mr-3">
                        <Folder className="h-6 w-6 text-amber-500" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{project.name}</h3>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === "Completed"
                          ? "bg-green-900/50 text-green-400"
                          : project.status === "In Progress"
                            ? "bg-blue-900/50 text-blue-400"
                            : "bg-amber-900/50 text-amber-400"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <p className="text-gray-400 mb-6">{project.description}</p>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-amber-500">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-700"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-400">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        Due:{" "}
                        {new Date(project.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{project.teamSize} members</span>
                    </div>
                  </div>

                  {/* Select button that appears on hover */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#151528] to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 w-full py-2 rounded-full font-medium transition-all duration-300 shadow-lg shadow-amber-900/30 flex items-center justify-center">
                      <span>Add {roleTheme.title} to Project</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#151528]/50 backdrop-blur-sm rounded-xl p-10 border border-amber-500/20 text-center">
            <Folder className="h-16 w-16 text-amber-500/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Projects Yet</h3>
            <p className="text-gray-400 mb-6">Create your first project to add your AI teammate</p>
            <button
              onClick={handleCreateProject}
              className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50 flex items-center mx-auto"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create New Project
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectsPage
