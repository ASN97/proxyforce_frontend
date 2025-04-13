// Base API URL - replace with your actual backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"


// Helper function for making API requests
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultHeaders = {
    "Content-Type": "application/json",
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API request failed with status ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API request error: ${error.message}`)
    throw error
  }
}

// Projects API
export const projectsAPI = {
  getProjects: async () => {
    return fetchAPI("/projects")
  },

  getProjectById: async (projectId) => {
    return fetchAPI(`/projects/${projectId}`)
  },

  createProject: async (projectData) => {
    return fetchAPI("/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    })
  },

  updateProject: async (projectId, projectData) => {
    return fetchAPI(`/projects/${projectId}`, {
      method: "PUT",
      body: JSON.stringify(projectData),
    })
  },

  deleteProject: async (projectId) => {
    return fetchAPI(`/projects/${projectId}`, {
      method: "DELETE",
    })
  },
}

// Tasks API
export const tasksAPI = {
  getProjectTasks: async (projectId) => {
    return fetchAPI(`/projects/${projectId}/tasks`)
  },

  createTask: async (projectId, taskData) => {
    return fetchAPI(`/projects/${projectId}/tasks`, {
      method: "POST",
      body: JSON.stringify(taskData),
    })
  },

  updateTask: async (projectId, taskId, taskData) => {
    return fetchAPI(`/projects/${projectId}/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(taskData),
    })
  },

  deleteTask: async (projectId, taskId) => {
    return fetchAPI(`/projects/${projectId}/tasks/${taskId}`, {
      method: "DELETE",
    })
  },
}

// Team Members API
export const teamAPI = {
  getTeamMembers: async (projectId) => {
    return fetchAPI(`/projects/${projectId}/team`)
  },

  addTeamMember: async (projectId, memberData) => {
    return fetchAPI(`/projects/${projectId}/team`, {
      method: "POST",
      body: JSON.stringify(memberData),
    })
  },
}

// Chat API
export const chatAPI = {
  getMessages: async (role, experience) => {
    return fetchAPI(`/chat?role=${role}&experience=${experience}`)
  },

  sendMessage: async (role, experience, message) => {
    return fetchAPI("/chat", {
      method: "POST",
      body: JSON.stringify({
        role,
        experience,
        message,
      }),
    })
  },

  getProjectMessages: async (projectId) => {
    return fetchAPI(`/projects/${projectId}/chat`)
  },

  sendProjectMessage: async (projectId, message) => {
    return fetchAPI(`http://localhost:8000/projects/${projectId}/chat`, {
      method: "POST",
      body: JSON.stringify({ message }),
    })
  },
}

// Risk Analysis API
export const riskAPI = {
  getProjectRisks: async (projectId) => {
    return fetchAPI(`/projects/${projectId}/risks`)
  },

  generateRiskReport: async (projectId) => {
    return fetchAPI(`/projects/${projectId}/risks/report`)
  },
}

// Email API
export const emailAPI = {
  generateEmailTemplate: async (projectId, templateData) => {
    return fetchAPI(`/projects/${projectId}/email/template`, {
      method: "POST",
      body: JSON.stringify(templateData),
    })
  },

  sendEmail: async (projectId, emailData) => {
    return fetchAPI(`/projects/${projectId}/email/send`, {
      method: "POST",
      body: JSON.stringify(emailData),
    })
  },
}

// Timeline API
export const timelineAPI = {
  getProjectTimeline: async (projectId) => {
    return fetchAPI(`/projects/${projectId}/timeline`)
  },

  generateWeeklyPlan: async (projectId) => {
    return fetchAPI(`/projects/${projectId}/timeline/weekly-plan`, {
      method: "POST",
    })
  },
}
