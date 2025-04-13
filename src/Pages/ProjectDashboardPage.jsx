"use client"
import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Calendar,
  Users,
  DollarSign,
  BarChart2,
  CheckCircle,
  AlertTriangle,
  FileText,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Plus,
  Mail,
  Clock,
  Download,
  Edit,
  Trash2,
  PieChart,
  ArrowRight,
  X,
  Send,
  Loader,
} from "lucide-react"
import { projectsAPI, tasksAPI, chatAPI, riskAPI, emailAPI, timelineAPI } from "../services/api"

const ProjectDashboardPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { projectId } = useParams()
  const queryParams = new URLSearchParams(location.search)
  const role = queryParams.get("role") || "pm"
  const tier = queryParams.get("tier") || "1"
  const timelineRef = useRef(null)
  const chatContainerRef = useRef(null)

  // State for project data
  const [project, setProject] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // State for chat
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isSendingMessage, setIsSendingMessage] = useState(false)

  // State for active tab
  const [activeTab, setActiveTab] = useState("overview")

  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    milestones: true,
    tasks: true,
    team: true,
    risks: true,
  })

  // State for timeline view
  const [timelineView, setTimelineView] = useState("gantt")
  const [timelineData, setTimelineData] = useState(null)
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(false)

  // State for task creation modal
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [newTask, setNewTask] = useState({
    name: "",
    assignee: "",
    deadline: "",
    priority: "medium",
    description: "",
  })
  const [isSubmittingTask, setIsSubmittingTask] = useState(false)

  // State for email generation
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailTemplate, setEmailTemplate] = useState({
    recipient: "all",
    subject: "",
    content: "",
    includeTimeline: true,
    includeTaskSummary: true,
  })
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  // Fetch project data
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch project details
        const projectData = await projectsAPI.getProjectById(projectId)
        setProject(projectData)

        // Initialize email template with project name
        setEmailTemplate((prev) => ({
          ...prev,
          subject: `${projectData.name} - Status Update`,
        }))

        // Fetch initial chat messages
        const chatMessages = await chatAPI.getProjectMessages(projectId)
        setMessages(chatMessages)
      } catch (err) {
        console.error("Failed to fetch project data:", err)
        setError("Failed to load project data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    if (projectId) {
      fetchProjectData()
    }
  }, [projectId])

  // Fetch timeline data when timeline tab is active
  useEffect(() => {
    const fetchTimelineData = async () => {
      if (activeTab === "timeline" && projectId) {
        try {
          setIsLoadingTimeline(true)
          const data = await timelineAPI.getProjectTimeline(projectId)
          setTimelineData(data)
        } catch (err) {
          console.error("Failed to fetch timeline data:", err)
        } finally {
          setIsLoadingTimeline(false)
        }
      }
    }

    fetchTimelineData()
  }, [activeTab, projectId])

  // Draw timeline on component mount and when tab changes
  useEffect(() => {
    if (activeTab === "timeline" && timelineRef.current && timelineData && !isLoadingTimeline) {
      drawTimeline()
    }
  }, [activeTab, timelineView, timelineData, isLoadingTimeline])

  // Auto-scroll chat to bottom when new messages are added
  useEffect(() => {
    if (activeTab === "chat" && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, activeTab])

  // Generate email content when modal is opened
  useEffect(() => {
    if (showEmailModal && project) {
      generateEmail()
    }
  }, [showEmailModal, project])

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isSendingMessage) return

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsSendingMessage(true)

    try {
      // Send message to API
      const response = await chatAPI.sendProjectMessage(projectId, input)

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          id: response.id || Date.now().toString(),
          content: response.content,
          sender: "ai",
          timestamp: new Date(),
        },
      ])

      // Handle any special actions from the response
      if (response.action) {
        handleChatAction(response.action)
      }
    } catch (err) {
      console.error("Failed to send message:", err)

      // Add error message
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        content: "Sorry, I encountered an error processing your request. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
      }])
    } finally {
      setIsSendingMessage(false)
    }
  }

  const handleChatAction = (action) => {
    // Handle special actions from chat responses
    switch (action.type) {
      case "switchTab":
        setActiveTab(action.tab)
        break
      case "toggleSection":
        setExpandedSections((prev) => ({
          ...prev,
          [action.section]: true,
        }))
        break
      case "showEmailModal":
        setShowEmailModal(true)
        break
      case "generateRiskReport":
        generateRiskReport()
        break
      default:
        break
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const goBack = () => {
    navigate(`/projects?role=${role}&tier=${tier}`)
  }

  // Calculate days remaining
  const calculateDaysRemaining = () => {
    if (!project) return 0

    const deadline = new Date(project.deadline)
    const today = new Date()
    const diffTime = deadline - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const daysRemaining = project ? calculateDaysRemaining() : 0

  // Draw timeline visualization
  const drawTimeline = () => {
    if (!timelineRef.current || !timelineData) return

    const canvas = timelineRef.current
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas dimensions
    canvas.width = canvas.parentElement.clientWidth
    canvas.height = 300

    if (timelineView === "gantt") {
      drawGanttChart(ctx, canvas.width, canvas.height)
    } else {
      drawCalendarView(ctx, canvas.width, canvas.height)
    }
  }

  const drawGanttChart = (ctx, width, height) => {
    if (!project || !timelineData) return

    const startDate = new Date(project.startDate)
    const endDate = new Date(project.deadline)
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))

    const padding = 60
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2
    const dayWidth = chartWidth / totalDays

    // Draw background
    ctx.fillStyle = "#151528"
    ctx.fillRect(0, 0, width, height)

    // Draw title
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "16px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Project Timeline - Gantt Chart", width / 2, 30)

    // Draw timeline axis
    ctx.strokeStyle = "#666666"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Draw date markers
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentDate = new Date(startDate)
    ctx.fillStyle = "#AAAAAA"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"

    while (currentDate <= endDate) {
      const daysPassed = Math.ceil((currentDate - startDate) / (1000 * 60 * 60 * 24))
      const x = padding + daysPassed * dayWidth

      // Draw marker for first day of month
      if (currentDate.getDate() === 1 || currentDate.getTime() === startDate.getTime()) {
        ctx.beginPath()
        ctx.moveTo(x, height - padding)
        ctx.lineTo(x, height - padding + 10)
        ctx.stroke()

        ctx.fillText(`${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}`, x, height - padding + 25)
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Draw today marker
    const today = new Date()
    if (today >= startDate && today <= endDate) {
      const daysPassed = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24))
      const x = padding + daysPassed * dayWidth

      ctx.strokeStyle = "#FF0000"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, height - padding)
      ctx.stroke()

      ctx.fillStyle = "#FF0000"
      ctx.fillText("Today", x, padding - 10)
    }

    // Draw milestones
    const milestones = timelineData.milestones || []
    const milestoneHeight = chartHeight / (milestones.length + 1)

    milestones.forEach((milestone, index) => {
      const milestoneDate = new Date(milestone.deadline)
      const daysPassed = Math.ceil((milestoneDate - startDate) / (1000 * 60 * 60 * 24))
      const x = padding + daysPassed * dayWidth
      const y = padding + (index + 1) * milestoneHeight

      // Draw milestone bar
      const startDaysPassed =
        index === 0 ? 0 : Math.ceil((new Date(milestones[index - 1].deadline) - startDate) / (1000 * 60 * 60 * 24))
      const startX = padding + startDaysPassed * dayWidth
      const barWidth = x - startX

      // Choose color based on status
      let barColor
      switch (milestone.status) {
        case "completed":
          barColor = "#22C55E"
          break
        case "in-progress":
          barColor = "#3B82F6"
          break
        default:
          barColor = "#9CA3AF"
      }

      ctx.fillStyle = barColor
      ctx.fillRect(startX, y - milestoneHeight / 3, barWidth, milestoneHeight / 3)

      // Draw milestone label
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "14px Arial"
      ctx.textAlign = "left"
      ctx.fillText(milestone.name, padding, y)

      // Draw progress indicator
      ctx.fillStyle = "#AAAAAA"
      ctx.font = "12px Arial"
      ctx.fillText(`${milestone.progress}%`, startX + barWidth + 5, y)
    })
  }

  const drawCalendarView = (ctx, width, height) => {
    // Implementation of calendar view visualization
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "16px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Calendar View - Coming Soon", width / 2, height / 2)
  }

  // Handle task creation
  const handleCreateTask = () => {
    setShowTaskModal(true)
  }

  const handleTaskSubmit = async () => {
    if (isSubmittingTask) return

    try {
      setIsSubmittingTask(true)

      // Submit new task to API
      const taskData = {
        name: newTask.name,
        assignee: newTask.assignee,
        deadline: newTask.deadline,
        priority: newTask.priority,
        description: newTask.description,
      }

      const response = await tasksAPI.createTask(projectId, taskData)

      // Update project tasks
      setProject((prev) => ({
        ...prev,
        tasks: [...prev.tasks, response],
      }))

      // Reset form and close modal
      setNewTask({
        name: "",
        assignee: "",
        deadline: "",
        priority: "medium",
        description: "",
      })
      setShowTaskModal(false)

      // Show confirmation message in chat
      const aiMessage = {
        id: Date.now().toString(),
        content: `I've added the new task "${response.name}" and assigned it to ${response.assignee}. Based on their current workload and skills, this is an appropriate assignment. The task has been scheduled for completion by ${new Date(response.deadline).toLocaleDateString()}.`,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      console.error("Failed to create task:", err)
      alert("Failed to create task. Please try again.")
    } finally {
      setIsSubmittingTask(false)
    }
  }

  // Handle email generation
  const generateEmail = async () => {
    if (!project || isGeneratingEmail) return

    try {
      setIsGeneratingEmail(true)

      // Generate email content from API
      const templateData = {
        recipient: emailTemplate.recipient,
        includeTimeline: emailTemplate.includeTimeline,
        includeTaskSummary: emailTemplate.includeTaskSummary,
      }

      const response = await emailAPI.generateEmailTemplate(projectId, templateData)

      setEmailTemplate((prev) => ({
        ...prev,
        content: response.content,
        subject: response.subject || prev.subject,
      }))
    } catch (err) {
      console.error("Failed to generate email:", err)
    } finally {
      setIsGeneratingEmail(false)
    }
  }

  const handleSendEmail = async () => {
    if (isSendingEmail) return

    try {
      setIsSendingEmail(true)

      // Send email via API
      await emailAPI.sendEmail(projectId, emailTemplate)

      setShowEmailModal(false)

      // Show confirmation message in chat
      const aiMessage = {
        id: Date.now().toString(),
        content: `I've sent the project update email to ${emailTemplate.recipient === "all" ? "all stakeholders" : emailTemplate.recipient}. The email includes the current project status, milestone progress, and task summary as requested.`,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      console.error("Failed to send email:", err)
      alert("Failed to send email. Please try again.")
    } finally {
      setIsSendingEmail(false)
    }
  }

  // Generate weekly task assignments
  const generateWeeklyTasks = async () => {
    try {
      const response = await timelineAPI.generateWeeklyPlan(projectId)

      // Show response in chat
      const aiMessage = {
        id: Date.now().toString(),
        content: response.message || `I've analyzed team member skills and availability to create this week's task assignments:\n\n${response.assignments.map((a, i) => `${i + 1}. ${a.member} (${a.role}): ${a.tasks.join(", ")}`).join("\n")}\n\nThis distribution balances workload based on each member's capacity and optimizes for their skill strengths.`,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      console.error("Failed to generate weekly tasks:", err)

      // Show error message
      const aiMessage = {
        id: Date.now().toString(),
        content: "I encountered an error while generating the weekly task assignments. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    }
  }

  // Generate risk analysis report
  const generateRiskReport = async () => {
    try {
      const response = await riskAPI.generateRiskReport(projectId)

      // Show response in chat
      const aiMessage = {
        id: Date.now().toString(),
        content: response.report || "📊 **Risk Analysis Report**\n\nI've analyzed the project risks and here's my assessment:\n\n" +
          response.risks
            .map(
              (risk, i) =>
                `${i + 1}. **${risk.description}** (${risk.impact} Impact)\n   - Probability: ${risk.probability}%\n   - Mitigation: ${risk.mitigation}\n   - Contingency: ${risk.contingency}`,
            )
            .join("\n\n") +
          `\n\nBased on Monte Carlo simulation, there's a ${response.completionProbability}% chance of completing the project on time with current mitigations in place.`,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      console.error("Failed to generate risk report:", err)

      // Show error message
      const aiMessage = {
        id: Date.now().toString(),
        content: "I encountered an error while generating the risk analysis report. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B19] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-xl">Loading project data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0B19] text-white flex items-center justify-center">
        <div className="bg-[#151528]/80 backdrop-blur-sm rounded-xl border border-amber-500/30 p-8 max-w-md text-center">
          <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Error Loading Project</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-[#0B0B19] hover:bg-gray-900 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
            <button
              onClick={goBack}
              className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white px-4 py-2 rounded-lg"
            >
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0B0B19] text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <p className="text-xl">Project not found</p>
          <button
            onClick={goBack}
            className="mt-4 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white px-4 py-2 rounded-lg"
          >
            Back to Projects
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0B19] text-white">
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

      {/* Header */}
      <header className={`${role} relative z-10 shadow-lg`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <button onClick={goBack} className="p-2 rounded-full hover:bg-white/20 transition-colors mr-3">
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">{project.name}</h1>
                <p className="text-sm opacity-80">{project.description}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm">{daysRemaining} days remaining</div>
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm">{project.progress}% complete</div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="relative z-10 bg-[#151528]/80 backdrop-blur-sm border-b border-amber-500/20">
        <div className="container mx-auto px-6">
          <div className="flex overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "overview"
                  ? "border-b-2 border-amber-500 text-amber-500"
                  : "text-gray-400 hover:text-amber-400"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("timeline")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "timeline"
                  ? "border-b-2 border-amber-500 text-amber-500"
                  : "text-gray-400 hover:text-amber-400"
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveTab("tasks")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "tasks"
                  ? "border-b-2 border-amber-500 text-amber-500"
                  : "text-gray-400 hover:text-amber-400"
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "team"
                  ? "border-b-2 border-amber-500 text-amber-500"
                  : "text-gray-400 hover:text-amber-400"
              }`}
            >
              Team
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "chat"
                  ? "border-b-2 border-amber-500 text-amber-500"
                  : "text-gray-400 hover:text-amber-400"
              }`}
            >
              Chat with {role}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Stats */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#151528]/80 backdrop-blur-sm rounded-xl p-4 border border-amber-500/20">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="text-gray-400 text-sm">Timeline</span>
                  </div>
                  <p className="text-2xl font-bold">{daysRemaining} days</p>
                  <p className="text-xs text-gray-400">remaining</p>
                </div>

                <div className="bg-[#151528]/80 backdrop-blur-sm rounded-xl p-4 border border-amber-500/20">
                  <div className="flex items-center mb-2">
                    <DollarSign className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="text-gray-400 text-sm">Budget</span>
                  </div>
                  <p className="text-2xl font-bold">${(project.budget - project.budgetUsed).toLocaleString()}</p>
                  <p className="text-xs text-gray-400">remaining</p>
                </div>

                <div className="bg-[#151528]/80 backdrop-blur-sm rounded-xl p-4 border border-amber-500/20">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="text-gray-400 text-sm">Team</span>
                  </div>
                  <p className="text-2xl font-bold">{project.teamMembers?.length || 0}</p>
                  <p className="text-xs text-gray-400">members</p>
                </div>

                <div className="bg-[#151528]/80 backdrop-blur-sm rounded-xl p-4 border border-amber-500/20">
                  <div className="flex items-center mb-2">
                    <BarChart2 className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="text-gray-400 text-sm">Progress</span>
                  </div>
                  <p className="text-2xl font-bold">{project.progress}%</p>
                  <p className="text-xs text-gray-400">completed</p>
                </div>
              </div>

              {/* Milestones Section */}
              <div className="bg-[#151528]/80 backdrop-blur-sm rounded-xl border border-amber-500/20 overflow-hidden">
                <div
                  className="flex justify-between items-center p-4 cursor-pointer"
                  onClick={() => toggleSection("milestones")}
                >
                  <h2 className="text-lg font-bold flex items-center">
                    <Calendar className="h-5 w-5 text-amber-500 mr-2" />
                    Milestones
                  </h2>
                  {expandedSections.milestones ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                {expandedSections.milestones && (
                  <div className="p-4 pt-0">
                    <div className="space-y-4">
                      {project.milestones?.map((milestone) => (
                        <div key={milestone.id} className="bg-[#0B0B19]/50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{milestone.name}</h3>
                              <p className="text-sm text-gray-400">
                                Due:{" "}
                                {new Date(milestone.deadline).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                milestone.status === "completed"
                                  ? "bg-green-900/50 text-green-400"
                                  : milestone.status === "in-progress"
                                    ? "bg-blue-900/50 text-blue-400"
                                    : "bg-amber-900/50 text-amber-400"
                              }`}
                            >
                              {milestone.status === "completed"
                                ? "Completed"
                                : milestone.status === "in-progress"
                                  ? "In Progress"
                                  : "Not Started"}
                            </span>
                          </div>

                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-400">Progress</span>
                              <span className="text-amber-500">{milestone.progress}%</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  milestone.status === "completed"
                                    ? "bg-green-600"
                                    : "bg-gradient-to-r from-amber-500 to-amber-700"
                                }`}
                                style={{ width: `${milestone.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tasks Section */}
              <div className="bg-[#151528]/80 backdrop-blur-sm rounded-xl border border-amber-500/20 overflow-hidden">
                <div
                  className="flex justify-between items-center p-4 cursor-pointer"
                  onClick={() => toggleSection("tasks")}
                >
                  <h2 className="text-lg font-bold flex items-center">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-2" />
                    Recent Tasks
                  </h2>
                  {expandedSections.tasks ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                {expandedSections.tasks && (
                  <div className="p-4 pt-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-gray-400 text-sm">
                            <th className="pb-2">Task</th>
                            <th className="pb-2">Assignee</th>
                            <th className="pb-2">Due Date</th>
                            <th className="pb-2">Priority</th>
                            <th className="pb-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {project.tasks?.map((task) => (
                            <tr key={task.id} className="border-t border-gray-800">
                              <td className="py-3">{task.name}</td>
                              <td className="py-3">{task.assignee}</td>
                              <td className="py-3">
                                {new Date(task.deadline).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </td>
                              <td className="py-3">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    task.priority === "high"
                                      ? "bg-red-900/30 text-red-400"
                                      : task.priority === "medium"
                                        ? "bg-amber-900/30 text-amber-400"
                                        : "bg-blue-900/30 text-blue-400"
                                  }`}
                                >
                                  {task.priority}
                                </span>
                              </td>
                              <td className="py-3">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    task.status === "completed"
                                      ? "bg-green-900/30 text-green-400"
                                      : task.status === "in-progress"
                                        ? "bg-blue-900/30 text-blue-400"
                                        : "bg-gray-800 text-gray-400"
                                  }`}
                                >
                                  {task.status === "completed"
                                    ? "Completed"
                                    : task.status === "in-progress"
                                      ? "In Progress"
                                      : "Not Started"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={handleCreateTask}
                        className="text-amber-500 hover:text-amber-400 text-sm flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add New Task
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Risks Section */}
              <div className="bg-[#151528]/80 backdrop-blur-sm rounded-xl border border-amber-500/20 overflow-hidden">
                <div
                  className="flex justify-between items-center p-4 cursor-pointer"
                  onClick={() => toggleSection("risks")}
                >
                  <h2 className="text-lg font-bold flex items-center">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                    Risk Analysis
                  </h2>
                  {expandedSections.risks ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                {expandedSections.risks && (
                  <div className="p-4 pt-0">
                    <div className="space-y-4">
                      {project.risks?.map((risk) => (
                        <div key={risk.id} className="bg-[#0B0B19]/50 rounded-lg p-4">
                          <div className="flex items-start mb-2">
                            <div
                              className={`p-1 rounded-full mr-2 ${
                                risk.impact === "high"
                                  ? "bg-red-900/30 text-red-400"
                                  : risk.impact === "medium"
                                    ? "bg-amber-900/30 text-amber-400"
                                    : "bg-blue-900/30 text-blue-400"
                              }`}
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </div>
                            <div>
                              <h3 className="font-medium">{risk.description}</h3>
                              <p className="text-sm text-gray-400 mt-1">
                                <span className="font-medium">Mitigation:</span> {risk.mitigation}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex justify-center space-x-4">
                      <button
                        onClick={generateRiskReport}
                        className="text-amber-500 hover:text-amber-400 text-sm flex items-center"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Generate Risk Report
                      </button>
                      <button className="text-amber-500 hover:text-amber-400 text-sm flex items-center">
                        <Plus className="h-4 w-4 mr-1" />
                        Add New Risk
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - AI Assistant & Team */}
            <div className="space-y-6">
              {/* AI Assistant Card */}
              <div className="bg-[#151528]/80 backdrop-blur-sm rounded-xl border border-amber-500/20 p-4">
                <div className="flex items-center mb-4">
                  <div className="relative mr-3">
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full opacity-50 blur-sm"></div>
                    <img
                      src={role|| "/placeholder.svg"}
                      alt={role}
                      className="w-12 h-12 rounded-full relative z-10 ring-2 ring-amber-500"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold">{role}</h3>
                    <p className="text-xs text-gray-400">
                      {tier} {role} • {role.experience} years experience
                    </p>
                  </div>
                </div>

                <div className="bg-[#0B0B19]/50 rounded-lg p-3 mb-4">
                  <p className="text-sm">
                    {messages.length > 0 && messages[messages.length - 1].sender === "ai"
                      ? messages[messages.length - 1].content.substring(0, 120) +
                        (messages[messages.length - 1].content.length > 120 ? "..." : "")
                      : "I've analyzed your project timeline. The design phase might need an extra week based on the complexity of the requirements."}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab("chat")}
                    className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white py-2 px-4 rounded-lg text-sm flex-1 flex items-center justify-center"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat Now
                  </button>
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="bg-[#0B0B19] hover:bg-gray-900 text-white py-2 px-4 rounded-lg text-sm flex items-center justify-center"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Update
                  </button>
                </div>
              </div>

              {/* Team Members */}
              <div className="bg-[#151528]/80 backdrop-blur-sm rounded-xl border border-amber-500/20 overflow-hidden">
                <div
                  className="flex justify-between items-center p-4 cursor-pointer"
                  onClick={() => toggleSection("team")}
                >
                  <h2 className="text-lg font-bold flex items-center">
                    <Users className="h-5 w-5 text-amber-500 mr-2" />
                    Team Members
                  </h2>
                  {expandedSections.team ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                {expandedSections.team && (
                  <div className="p-4 pt-0">
                    <div className="space-y-3">
                      {project.teamMembers?.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between bg-[#0B0B19]/50 rounded-lg p-3"
                        >
                          <div className="flex items-center">
                            <img
                              src={member.avatar || "/placeholder.svg"}
                              alt={member.name}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                              <h3 className="font-medium">{member.name}</h3>
                              <p className="text-xs text-gray-400">{member.role}</p>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {member.completed}/{member.tasks} tasks
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={generateWeeklyTasks}
                        className="text-amber-500 hover:text-amber-400 text-sm flex items-center"
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Generate Weekly Assignments
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-[#151528]/80 backdrop-blur-sm rounded-xl border border-amber-500/20 p-4">
                <h2 className="text-lg font-bold mb-3 flex items-center">
                  <Clock className="h-5 w-5 text-amber-500 mr-2" />
                  Quick Actions
                </h2>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab("timeline")}
                    className="w-full bg-[#0B0B19] hover:bg-gray-900 text-white py-2 px-4 rounded-lg text-sm flex items-center justify-between"
                  >
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      View Timeline
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleCreateTask}
                    className="w-full bg-[#0B0B19] hover:bg-gray-900 text-white py-2 px-4 rounded-lg text-sm flex items-center justify-between"
                  >
                    <span className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Task
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="w-full bg-[#0B0B19] hover:bg-gray-900 text-white py-2 px-4 rounded-lg text-sm flex items-center justify-between"
                  >
                    <span className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Status Update
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={generateRiskReport}
                    className="w-full bg-[#0B0B19] hover:bg-gray-900 text-white py-2 px-4 rounded-lg text-sm flex items-center justify-between"
                  >
                    <span className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Risk Analysis
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "timeline" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Project Timeline</h2>
                <p className="text-gray-400">Visualize project milestones and track progress</p>
              </div>

              <div className="flex space-x-2 mt-4 md:mt-0">
                <button
                  onClick={() => setTimelineView("gantt")}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    timelineView === "gantt"
                      ? "bg-gradient-to-r from-amber-500 to-amber-700 text-white"
                      : "bg-[#0B0B19] text-gray-400 hover:text-white"
                  }`}
                >
                  Gantt Chart
                </button>
                <button
                  onClick={() => setTimelineView("calendar")}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    timelineView === "calendar"
                      ? "bg-gradient-to-r from-amber-500 to-amber-700 text-white"
                      : "bg-[#0B0B19] text-gray-400 hover:text-white"
                  }`}
                >
                  Calendar View
                </button>
                <button className="bg-[#0B0B19] hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
              </div>
            </div>

            <div className="bg-[#151528]/80 backdrop-blur-sm rounded-xl border border-amber-500/20 p-6">
              {isLoadingTimeline ? (
                <div className="flex justify-center items-center h-[300px]">
                  <Loader className="h-8 w-8 text-amber-500 animate-spin" />
                  <span className="ml-2">Loading timeline data...</span>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Project Duration</h3>
                      <span className="text-sm text-gray-400">
                        {new Date(project.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} -
                        {new Date(project.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-700"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="border border-gray-800 rounded-lg overflow-hidden">
                    <canvas ref={timelineRef} className="w-full h-[300px]"></canvas>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#0B0B19]/50 rounded-lg p-4">
                      <h3 className="font-medium mb-3 flex items-center">
                        <Calendar className="h-4 w-4 text-amber-500 mr-2" />
                        Upcoming Milestones
                      </h3>
                      <ul className="space-y-2">
                        {project.milestones
                          ?.filter((m) => m.status !== "completed")
                          .map((milestone) => (
                            <li key={milestone.id} className="flex justify-between items-center text-sm">
                              <span>{milestone.name}</span>
                              <span className="text-gray-400">
                                {new Date(milestone.deadline).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>

                    <div className="bg-[#0B0B19]/50 rounded-lg p-4">
                      <h3 className="font-medium mb-3 flex items-center">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                        Timeline Insights
                      </h3>
                      <ul className="space-y-2 text-sm">
                        {timelineData?.insights?.map((insight, index) => (
                          <li key={index} className="flex items-start">
                            <div className={`bg-${insight.type}-500/20 p-1 rounded-full mr-2 mt-0.5`}>
                              {insight.type === "warning" ? (
                                <Clock className={`h-3 w-3 text-${insight.type}-500`} />
                              ) : insight.type === "success" ? (
                                <CheckCircle className={`h-3 w-3 text-${insight.type}-500`} />
                              ) : (
                                <Users className={`h-3 w-3 text-${insight.type}-500`} />
                              )}
                            </div>
                            <span>{insight.message}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Project Tasks</h2>
                <p className="text-gray-400">Manage and track tasks assigned to team members</p>
              </div>

              <div className="flex space-x-2 mt-4 md:mt-0">
                <button
                  onClick={handleCreateTask}
                  className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white px-4 py-2 rounded-lg text-sm flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </button>
                <button
                  onClick={generateWeeklyTasks}
                  className="bg-[#0B0B19] hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm flex items-center"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Generate Weekly Plan
                </button>
              </div>
            </div>

            <div className="bg-[#151528]/80 backdrop-blur-sm rounded-xl border border-amber-500/20 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#0B0B19]/50 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Completed</p>
                    <p className="text-2xl font-bold">
                      {project.tasks?.filter((t) => t.status === "completed").length || 0}
                    </p>
                  </div>
                  <div className="bg-green-900/30 p-3 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                </div>

                <div className="bg-[#0B0B19]/50 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">In Progress</p>
                    <p className="text-2xl font-bold">
                      {project.tasks?.filter((t) => t.status === "in-progress").length || 0}
                    </p>
                  </div>
                  <div className="bg-blue-900/30 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-blue-400" />
                  </div>
                </div>

                <div className="bg-[#0B0B19]/50 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Not Started</p>
                    <p className="text-2xl font-bold">
                      {project.tasks?.filter((t) => t.status === "not-started").length || 0}
                    </p>
                  </div>
                  <div className="bg-amber-900/30 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-amber-400" />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
                      <th className="pb-3 pl-4">Task</th>
                      <th className="pb-3">Assignee</th>
                      <th className="pb-3">Due Date</th>
                      <th className="pb-3">Priority</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.tasks?.map((task) => (
                      <tr key={task.id} className="border-b border-gray-800 hover:bg-[#0B0B19]/30">
                        <td className="py-4 pl-4">{task.name}</td>
                        <td className="py-4">{task.assignee}</td>
                        <td className="py-4">
                          {new Date(task.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              task.priority === "high"
                                ? "bg-red-900/30 text-red-400"
                                : task.priority === "medium"
                                  ? "bg-amber-900/30 text-amber-400"
                                  : "bg-blue-900/30 text-blue-400"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              task.status === "completed"
                                ? "bg-green-900/30 text-green-400"
                                : task.status === "in-progress"
                                  ? "bg-blue-900/30 text-blue-400"
                                  : "bg-gray-800 text-gray-400"
                            }`}
                          >
                            {task.status === "completed"
                              ? "Completed"
                              : task.status === "in-progress"
                                ? "In Progress"
                                : "Not Started"}
                          </span>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="flex space-x-2 justify-end">
                            <button className="p-1 text-gray-400 hover:text-white">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-400">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 bg-[#0B0B19]/50 rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center">
                  <PieChart className="h-4 w-4 text-amber-500 mr-2" />
                  Task Distribution by Team Member
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {project.teamMembers?.map((member) => (
                    <div key={member.id} className="flex items-center">
                      <img
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{member.name}</span>
                          <span className="text-gray-400">
                            {member.completed}/{member.tasks}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-700"
                            style={{ width: `${(member.completed / member.tasks) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "team" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Team Members</h2>
                <p className="text-gray-400">Manage team members and their assignments</p>
              </div>

              <div className="flex space-x-2 mt-4 md:mt-0">
                <button className="bg-[#0B0B19] hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </button>
                <button
                  onClick={generateWeeklyTasks}
                  className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white px-4 py-2 rounded-lg text-sm flex items-center"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Optimize Assignments
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {project.teamMembers?.map((member) => (
                <div
                  key={member.id}
                  className="bg-[#151528]/80 backdrop-blur-sm rounded-xl border border-amber-500/20 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                        className="w-16 h-16 rounded-full mr-4"
                      />
                      <div>
                        <h3 className="font-bold text-lg">{member.name}</h3>
                        <p className="text-gray-400">{member.role}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">Task Completion</span>
                          <span className="text-amber-500">
                            {member.completed}/{member.tasks}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-700"
                            style={{ width: `${(member.completed / member.tasks) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Current Tasks:</span>
                        <span>
                          {project.tasks?.filter((t) => t.assignee === member.name && t.status === "in-progress")
                            .length || 0}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Upcoming Tasks:</span>
                        <span>
                          {project.tasks?.filter((t) => t.assignee === member.name && t.status === "not-started")
                            .length || 0}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="bg-[#0B0B19] hover:bg-gray-900 text-white py-2 px-4 rounded-lg text-sm flex-1 flex items-center justify-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact
                      </button>
                      <button className="bg-[#0B0B19] hover:bg-gray-900 text-white py-2 px-4 rounded-lg text-sm flex items-center justify-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#0B0B19]/50 p-4 border-t border-gray-800">
                    <h4 className="font-medium mb-2">Current Assignments</h4>
                    <ul className="space-y-2 text-sm">
                      {project.tasks
                        ?.filter((t) => t.assignee === member.name && t.status === "in-progress")
                        .map((task) => (
                          <li key={task.id} className="flex justify-between">
                            <span>{task.name}</span>
                            <span className="text-gray-400">
                              {new Date(task.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          </li>
                        ))}
                      {project.tasks?.filter((t) => t.assignee === member.name && t.status === "in-progress").length ===
                        0 && <li className="text-gray-400">No current assignments</li>}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "chat" && (
          <div className="flex flex-col h-[calc(100vh-200px)]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatContainerRef}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
                >
                  {message.sender === "ai" && (
                    <div className="flex-shrink-0 mr-3">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full opacity-50 blur-sm"></div>
                        <img
                          src={role|| "/placeholder.svg"}
                          alt={role}
                          className="w-8 h-8 rounded-full relative z-10 ring-1 ring-amber-500"
                        />
                      </div>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.sender === "user"
                        ? `bg-gradient-to-r from-amber-700 to-amber-900 text-white border border-amber-500/30`
                        : `bg-[#151528]/80 backdrop-blur-sm border border-amber-500/20`
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.sender === "user" ? "text-amber-300/70" : "text-gray-400"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              {isSendingMessage && (
                <div className="flex justify-start mb-4">
                  <div className="flex-shrink-0 mr-3">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full opacity-50 blur-sm"></div>
                      <img
                        src={role || "/placeholder.svg"}
                        alt={role}
                        className="w-8 h-8 rounded-full relative z-10 ring-1 ring-amber-500"
                      />
                    </div>
                  </div>
                  <div className="bg-[#151528]/80 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-4 max-w-[80%]">
                    <div className="flex space-x-2">
                      <div
                        className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-amber-500/30 p-4 bg-[#151528]/80 backdrop-blur-md">
              <div className="flex items-center space-x-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask ${role} about your project...`}
                  className="flex-1 bg-[#0B0B19] border border-amber-500/30 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none text-white placeholder-gray-500"
                  rows={1}
                  style={{ minHeight: "44px", maxHeight: "120px" }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isSendingMessage}
                  className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white p-3 rounded-xl disabled:opacity-50 transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
              <p className="text-xs text-amber-500/70 mt-2 text-center">
                ProxyForce AI • {role} • {tier} • {role.experience} years experience
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Task Creation Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#151528] rounded-xl border border-amber-500/30 p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Create New Task</h3>
              <button onClick={() => setShowTaskModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Task Name</label>
                <input
                  type="text"
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="Enter task name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Assignee</label>
                <select
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="">Select team member</option>
                  {project.teamMembers?.map((member) => (
                    <option key={member.id} value={member.name}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 min-h-[80px]"
                  placeholder="Task description"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleTaskSubmit}
                disabled={isSubmittingTask}
                className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white px-4 py-2 rounded-lg flex items-center"
              >
                {isSubmittingTask ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : null}
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Generation Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#151528] rounded-xl border border-amber-500/30 p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Generate Status Update Email</h3>
              <button onClick={() => setShowEmailModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Recipient</label>
                <select
                  value={emailTemplate.recipient}
                  onChange={(e) => setEmailTemplate({ ...emailTemplate, recipient: e.target.value })}
                  className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="all">All Stakeholders</option>
                  {project.stakeholders &&
                    project.stakeholders.map((stakeholder, index) => (
                      <option key={index} value={stakeholder.name}>
                        {stakeholder.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={emailTemplate.subject}
                  onChange={(e) => setEmailTemplate({ ...emailTemplate, subject: e.target.value })}
                  className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeTimeline"
                    checked={emailTemplate.includeTimeline}
                    onChange={(e) => setEmailTemplate({ ...emailTemplate, includeTimeline: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="includeTimeline" className="text-sm text-gray-300">
                    Include Timeline
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeTaskSummary"
                    checked={emailTemplate.includeTaskSummary}
                    onChange={(e) => setEmailTemplate({ ...emailTemplate, includeTaskSummary: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="includeTaskSummary" className="text-sm text-gray-300">
                    Include Task Summary
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email Content</label>
                <div className="relative">
                  {isGeneratingEmail && (
                    <div className="absolute inset-0 bg-[#0B0B19]/70 flex items-center justify-center rounded-lg">
                      <Loader className="h-8 w-8 text-amber-500 animate-spin" />
                    </div>
                  )}
                  <textarea
                    value={emailTemplate.content}
                    onChange={(e) => setEmailTemplate({ ...emailTemplate, content: e.target.value })}
                    className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 min-h-[200px] font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={generateEmail}
                disabled={isGeneratingEmail}
                className="bg-[#0B0B19] hover:bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FileText className="h-4 w-4 mr-2" />
                Regenerate
              </button>
              <button
                onClick={handleSendEmail}
                disabled={isSendingEmail || isGeneratingEmail}
                className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white px-4 py-2 rounded-lg flex items-center"
              >
                {isSendingEmail ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectDashboardPage
