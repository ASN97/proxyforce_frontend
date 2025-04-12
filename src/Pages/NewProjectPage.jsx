"use client"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Calendar,
  Clock,
  DollarSign,
  Code,
  Users,
  Mail,
  Briefcase,
  AlertTriangle,
  HelpCircle,
  X,
  Plus,
} from "lucide-react"

const NewProjectPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const role = queryParams.get("role") || "pm"
  const tier = queryParams.get("tier") || "1"

  // Form state
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    deadline: "",
    budget: "",
    budgetUsed: "0",
    currentStage: "initial",
    teamMembers: [{ name: "", email: "", skills: "", hoursPerWeek: "", hourlyWage: "" }],
    stakeholders: [{ name: "", email: "", role: "" }],
    techStack: "",
    buffer: "",
    risks: [{ description: "", impact: "medium", mitigation: "" }],
    objectives: "",
    successCriteria: "",
  })

  // Tooltip state
  const [activeTooltip, setActiveTooltip] = useState(null)

  // Role-specific theming
  const roleThemes = {
    pm: {
      color: "#3B82F6", // blue
      gradient: "from-blue-900 to-blue-700",
      light: "bg-blue-400",
      name: "Project Manager",
      glow: "bg-blue-600",
      title: "Project Manager",
    },
    sales: {
      color: "#EF4444", // red
      gradient: "from-red-900 to-red-700",
      light: "bg-red-400",
      name: "Sales Executive",
      glow: "bg-red-600",
      title: "Sales Executive",
    },
    marketing: {
      color: "#22C55E", // green
      gradient: "from-green-900 to-green-700",
      light: "bg-green-400",
      name: "Marketing Analyst",
      glow: "bg-green-600",
      title: "Marketing Analyst",
    },
  }

  const roleTheme = roleThemes[role] || roleThemes.pm

  // Convert tier to title
  const tierToTitle = {
    1: "Apprentice",
    2: "Adept",
    3: "Master",
  }
  const tierTitle = tierToTitle[tier] || "Apprentice"

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleTeamMemberChange = (index, field, value) => {
    const updatedTeamMembers = [...formData.teamMembers]
    updatedTeamMembers[index] = {
      ...updatedTeamMembers[index],
      [field]: value,
    }
    setFormData((prev) => ({
      ...prev,
      teamMembers: updatedTeamMembers,
    }))
  }

  const addTeamMember = () => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: "", email: "", skills: "", hoursPerWeek: "", hourlyWage: "" }],
    }))
  }

  const removeTeamMember = (index) => {
    const updatedTeamMembers = [...formData.teamMembers]
    updatedTeamMembers.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      teamMembers: updatedTeamMembers,
    }))
  }

  const handleStakeholderChange = (index, field, value) => {
    const updatedStakeholders = [...formData.stakeholders]
    updatedStakeholders[index] = {
      ...updatedStakeholders[index],
      [field]: value,
    }
    setFormData((prev) => ({
      ...prev,
      stakeholders: updatedStakeholders,
    }))
  }

  const addStakeholder = () => {
    setFormData((prev) => ({
      ...prev,
      stakeholders: [...prev.stakeholders, { name: "", email: "", role: "" }],
    }))
  }

  const removeStakeholder = (index) => {
    const updatedStakeholders = [...formData.stakeholders]
    updatedStakeholders.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      stakeholders: updatedStakeholders,
    }))
  }

  const handleRiskChange = (index, field, value) => {
    const updatedRisks = [...formData.risks]
    updatedRisks[index] = {
      ...updatedRisks[index],
      [field]: value,
    }
    setFormData((prev) => ({
      ...prev,
      risks: updatedRisks,
    }))
  }

  const addRisk = () => {
    setFormData((prev) => ({
      ...prev,
      risks: [...prev.risks, { description: "", impact: "medium", mitigation: "" }],
    }))
  }

  const removeRisk = (index) => {
    const updatedRisks = [...formData.risks]
    updatedRisks.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      risks: updatedRisks,
    }))
  }

  const nextStep = () => {
    setStep(step + 1)
    window.scrollTo(0, 0)
  }

  const prevStep = () => {
    setStep(step - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, you would send this data to your backend
    console.log("Project data:", formData)

    // Navigate to a success page or project dashboard
    navigate(`/project-success?role=${role}&tier=${tier}`)
  }

  const goBack = () => {
    navigate(`/projects?role=${role}&tier=${tier}`)
  }

  const showTooltip = (id) => {
    setActiveTooltip(id)
  }

  const hideTooltip = () => {
    setActiveTooltip(null)
  }

  // Render form steps
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-amber-400">Project Basics</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Project Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 min-h-[100px]"
                  placeholder="Describe your project goals and objectives"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Project Objectives
                  <button
                    className="ml-2 text-amber-500/70 hover:text-amber-500"
                    onMouseEnter={() => showTooltip("objectives")}
                    onMouseLeave={hideTooltip}
                  >
                    <HelpCircle size={16} />
                  </button>
                </label>
                {activeTooltip === "objectives" && (
                  <div className="absolute bg-[#151528] border border-amber-500/30 rounded-lg p-3 shadow-lg max-w-xs z-10">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-amber-500">Project Objectives</span>
                      <button onClick={hideTooltip} className="text-gray-400 hover:text-white">
                        <X size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-300">
                      Clearly define what the project aims to achieve. Specific, measurable objectives help your AI
                      Project Manager track progress effectively.
                    </p>
                  </div>
                )}
                <textarea
                  name="objectives"
                  value={formData.objectives}
                  onChange={handleChange}
                  className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 min-h-[80px]"
                  placeholder="List specific, measurable objectives for this project"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Success Criteria
                  <button
                    className="ml-2 text-amber-500/70 hover:text-amber-500"
                    onMouseEnter={() => showTooltip("success")}
                    onMouseLeave={hideTooltip}
                  >
                    <HelpCircle size={16} />
                  </button>
                </label>
                {activeTooltip === "success" && (
                  <div className="absolute bg-[#151528] border border-amber-500/30 rounded-lg p-3 shadow-lg max-w-xs z-10">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-amber-500">Success Criteria</span>
                      <button onClick={hideTooltip} className="text-gray-400 hover:text-white">
                        <X size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-300">
                      Define how success will be measured. These criteria will help your AI Project Manager determine
                      when project goals have been achieved.
                    </p>
                  </div>
                )}
                <textarea
                  name="successCriteria"
                  value={formData.successCriteria}
                  onChange={handleChange}
                  className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 min-h-[80px]"
                  placeholder="Define how project success will be measured"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 h-5 w-5" />
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Deadline</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 h-5 w-5" />
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Current Stage</label>
                <select
                  name="currentStage"
                  value={formData.currentStage}
                  onChange={handleChange}
                  className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  required
                >
                  <option value="initial">Initial Planning</option>
                  <option value="notStarted">Not Started Yet</option>
                  <option value="inProgress">In Progress</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-amber-400">Team Members</h2>
            <p className="text-gray-400 mb-4">
              Add team members who will be working on this project. Your AI {roleTheme.title} will use this information
              to assign tasks and manage workloads.
            </p>

            {formData.teamMembers.map((member, index) => (
              <div key={index} className="bg-[#0B0B19]/50 rounded-lg p-4 border border-amber-500/20 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium flex items-center">
                    <Users className="h-4 w-4 text-amber-500 mr-2" />
                    Team Member {index + 1}
                  </h3>
                  {formData.teamMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTeamMember(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleTeamMemberChange(index, "name", e.target.value)}
                      className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      placeholder="Team member name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 h-5 w-5" />
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => handleTeamMemberChange(index, "email", e.target.value)}
                        className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Skills
                    <button
                      className="ml-2 text-amber-500/70 hover:text-amber-500"
                      onMouseEnter={() => showTooltip(`skills-${index}`)}
                      onMouseLeave={hideTooltip}
                    >
                      <HelpCircle size={16} />
                    </button>
                  </label>
                  {activeTooltip === `skills-${index}` && (
                    <div className="absolute bg-[#151528] border border-amber-500/30 rounded-lg p-3 shadow-lg max-w-xs z-10">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-amber-500">Team Member Skills</span>
                        <button onClick={hideTooltip} className="text-gray-400 hover:text-white">
                          <X size={14} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-300">
                        List specific skills this team member possesses. Your AI Project Manager will use this to assign
                        appropriate tasks. Separate multiple skills with commas.
                      </p>
                    </div>
                  )}
                  <input
                    type="text"
                    value={member.skills}
                    onChange={(e) => handleTeamMemberChange(index, "skills", e.target.value)}
                    className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    placeholder="e.g. UI Design, Frontend Development, Project Management"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Hours per Week</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 h-5 w-5" />
                      <input
                        type="number"
                        value={member.hoursPerWeek}
                        onChange={(e) => handleTeamMemberChange(index, "hoursPerWeek", e.target.value)}
                        className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        placeholder="40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Hourly Wage ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 h-5 w-5" />
                      <input
                        type="number"
                        value={member.hourlyWage}
                        onChange={(e) => handleTeamMemberChange(index, "hourlyWage", e.target.value)}
                        className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        placeholder="25"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addTeamMember}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 py-2 px-4 rounded-lg border border-amber-500/30 transition-colors w-full flex items-center justify-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Team Member
            </button>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-amber-400">Stakeholders</h2>
            <p className="text-gray-400 mb-4">
              Add key stakeholders involved in this project. Your AI {roleTheme.title} will keep them informed about
              project progress.
            </p>

            {formData.stakeholders.map((stakeholder, index) => (
              <div key={index} className="bg-[#0B0B19]/50 rounded-lg p-4 border border-amber-500/20 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium flex items-center">
                    <Briefcase className="h-4 w-4 text-amber-500 mr-2" />
                    Stakeholder {index + 1}
                  </h3>
                  {formData.stakeholders.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStakeholder(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                    <input
                      type="text"
                      value={stakeholder.name}
                      onChange={(e) => handleStakeholderChange(index, "name", e.target.value)}
                      className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      placeholder="Stakeholder name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 h-5 w-5" />
                      <input
                        type="email"
                        value={stakeholder.email}
                        onChange={(e) => handleStakeholderChange(index, "email", e.target.value)}
                        className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                  <input
                    type="text"
                    value={stakeholder.role}
                    onChange={(e) => handleStakeholderChange(index, "role", e.target.value)}
                    className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    placeholder="e.g. Client, Executive Sponsor, Department Head"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addStakeholder}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 py-2 px-4 rounded-lg border border-amber-500/30 transition-colors w-full flex items-center justify-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Stakeholder
            </button>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-amber-400">Project Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Total Budget ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 h-5 w-5" />
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    placeholder="10000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Budget Used ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 h-5 w-5" />
                  <input
                    type="number"
                    name="budgetUsed"
                    value={formData.budgetUsed}
                    onChange={handleChange}
                    className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Buffer (days)
                <button
                  className="ml-2 text-amber-500/70 hover:text-amber-500"
                  onMouseEnter={() => showTooltip("buffer")}
                  onMouseLeave={hideTooltip}
                >
                  <HelpCircle size={16} />
                </button>
              </label>
              {activeTooltip === "buffer" && (
                <div className="absolute bg-[#151528] border border-amber-500/30 rounded-lg p-3 shadow-lg max-w-xs z-10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-amber-500">Time Buffer</span>
                    <button onClick={hideTooltip} className="text-gray-400 hover:text-white">
                      <X size={14} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-300">
                    Additional days added to the project timeline to account for unexpected delays. Your AI Project
                    Manager will factor this into planning.
                  </p>
                </div>
              )}
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 h-5 w-5" />
                <input
                  type="number"
                  name="buffer"
                  value={formData.buffer}
                  onChange={handleChange}
                  className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="7"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Tech Stack</label>
              <div className="relative">
                <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 h-5 w-5" />
                <input
                  type="text"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleChange}
                  className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="e.g. React, Node.js, MongoDB"
                />
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-medium text-amber-400 mb-3 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Risk Assessment
              </h3>
              <p className="text-gray-400 mb-4 text-sm">
                Identify potential risks that could impact your project. Your AI {roleTheme.title} will monitor these
                and suggest mitigation strategies.
              </p>

              {formData.risks.map((risk, index) => (
                <div key={index} className="bg-[#0B0B19]/50 rounded-lg p-4 border border-amber-500/20 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium flex items-center">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                      Risk {index + 1}
                    </h3>
                    {formData.risks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRisk(index)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <input
                      type="text"
                      value={risk.description}
                      onChange={(e) => handleRiskChange(index, "description", e.target.value)}
                      className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      placeholder="Describe the potential risk"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Impact Level</label>
                      <select
                        value={risk.impact}
                        onChange={(e) => handleRiskChange(index, "impact", e.target.value)}
                        className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Mitigation Strategy</label>
                      <input
                        type="text"
                        value={risk.mitigation}
                        onChange={(e) => handleRiskChange(index, "mitigation", e.target.value)}
                        className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        placeholder="How to mitigate this risk"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addRisk}
                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 py-2 px-4 rounded-lg border border-amber-500/30 transition-colors w-full flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Risk
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
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
          <span>Return to Projects</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
            <p className="text-gray-400">
              Provide details about your project to help your {tierTitle} {roleTheme.title} get started
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= stepNumber ? "bg-gradient-to-r from-amber-500 to-amber-700" : "bg-gray-800 text-gray-500"
                    }`}
                  >
                    {stepNumber}
                  </div>
                  <span className="text-xs mt-2 text-gray-400">
                    {stepNumber === 1
                      ? "Basics"
                      : stepNumber === 2
                        ? "Team"
                        : stepNumber === 3
                          ? "Stakeholders"
                          : "Details"}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 h-1 bg-gray-800 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-700 rounded-full transition-all duration-300"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-[#151528]/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-amber-500/20 p-6 mb-6">
              {renderStep()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-800 hover:bg-gray-700 text-white py-3 px-6 rounded-lg flex items-center transition-colors"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Previous
                </button>
              ) : (
                <div></div>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white py-3 px-6 rounded-lg flex items-center transition-colors"
                >
                  Next
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white py-3 px-6 rounded-lg flex items-center transition-colors"
                >
                  <Save className="mr-2 h-5 w-5" />
                  Create Project
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewProjectPage
