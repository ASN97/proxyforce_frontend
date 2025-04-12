"use client"

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Send, ArrowLeft, Clock, Calendar, FileText } from "lucide-react"

export default function ChatPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search)
  const role = queryParams.get("role") || "pm"
  const tier = queryParams.get("tier") || "1"

  // Convert tier to years of experience
  const tierToYears = {
    1: "2",
    2: "5",
    3: "10",
  }
  const experience = tierToYears[tier] || "2"

  // Role-based theming - matching your existing role codes
  const themeConfig = {
    pm: {
      primary: "bg-blue-600",
      secondary: "bg-blue-100",
      text: "text-blue-600",
      border: "border-blue-300",
      hover: "hover:bg-blue-700",
      light: "bg-blue-50",
      name: "Alex Morgan",
      title: "Project Manager",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      bgColor: "#3B82F6",
    },
    sales: {
      primary: "bg-red-600",
      secondary: "bg-red-100",
      text: "text-red-600",
      border: "border-red-300",
      hover: "hover:bg-red-700",
      light: "bg-red-50",
      name: "Jordan Smith",
      title: "Sales Executive",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      bgColor: "#EF4444",
    },
    marketing: {
      primary: "bg-green-600",
      secondary: "bg-green-100",
      text: "text-green-600",
      border: "border-green-300",
      hover: "hover:bg-green-700",
      light: "bg-green-50",
      name: "Taylor Reed",
      title: "Marketing Analyst",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      bgColor: "#22C55E",
    },
  }

  const theme = themeConfig[role] || themeConfig["pm"]

  // Initial greeting message based on role
  useEffect(() => {
    const greetings = {
      pm: `Hi there! I'm ${theme.name}, your AI Project Manager with ${experience} years of experience. I can help you organize tasks, track deadlines, and manage resources. What project are you working on today?`,
      sales: `Hello! I'm ${theme.name}, your AI Sales Executive with ${experience} years of experience. I can help with lead generation, sales strategies, and closing deals. What sales challenges are you facing?`,
      marketing: `Hey! I'm ${theme.name}, your AI Marketing Analyst with ${experience} years of experience. I can help with market research, campaign analysis, and growth strategies. What marketing goals are you working towards?`,
    }

    const initialMessage = {
      id: "1",
      content: greetings[role] || greetings["pm"],
      sender: "ai",
      timestamp: new Date(),
    }

    setMessages([initialMessage])
  }, [role, experience, theme.name])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responseMessages = {
        pm: [
          "I'll help you organize that project. Let's break it down into milestones and tasks first.",
          "Based on your timeline, I recommend using a Gantt chart to visualize dependencies.",
          "I've seen similar projects succeed with weekly sprints and daily stand-ups. Would you like me to outline a process?",
        ],
        sales: [
          "That's a challenging sales target. Let's develop a multi-channel approach to reach those prospects.",
          "Based on market trends, I'd recommend focusing on solution selling rather than feature selling for this client.",
          "I can draft a follow-up sequence that typically increases conversion by 15-20% in similar scenarios.",
        ],
        marketing: [
          "Looking at these metrics, your campaign's CTR is above industry average, but conversion is lagging. Let's optimize the landing page.",
          "I recommend A/B testing these three headline variations to improve engagement.",
          "Based on the demographic data, we should shift budget allocation to platforms with higher Gen Z presence.",
        ],
      }

      const responses = responseMessages[role] || responseMessages["pm"]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const aiMessage = {
        id: Date.now().toString(),
        content: randomResponse,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const goBack = () => {
    navigate(`/experience?role=${role}`)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className={`${theme.primary} text-white p-4 shadow-md`}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={goBack} className="p-2 rounded-full hover:bg-white/20 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                <img src={theme.avatar || "/placeholder.svg"} alt={theme.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <h1 className="font-bold text-lg">{theme.name}</h1>
                <p className="text-xs opacity-80">
                  {theme.title} • {experience} years experience
                </p>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
              <Clock size={20} />
            </button>
            <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
              <Calendar size={20} />
            </button>
            <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
              <FileText size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="container mx-auto max-w-4xl">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.sender === "user" ? `${theme.primary} text-white` : `${theme.light} ${theme.border} border`
                }`}
              >
                <p>{message.content}</p>
                <p className={`text-xs mt-1 ${message.sender === "user" ? "text-white/70" : "text-gray-500"}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start mb-4">
              <div className={`${theme.light} ${theme.border} border rounded-2xl p-4 max-w-[80%]`}>
                <div className="flex space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${theme.primary} animate-bounce`}
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className={`w-2 h-2 rounded-full ${theme.primary} animate-bounce`}
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className={`w-2 h-2 rounded-full ${theme.primary} animate-bounce`}
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className={`border-t ${theme.border} p-4 bg-white`}>
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center space-x-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${theme.name}...`}
              className="flex-1 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none"
              rows={1}
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || loading}
              className={`${theme.primary} ${theme.hover} text-white p-3 rounded-xl disabled:opacity-50 transition-colors`}
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            ProxyForce AI • {theme.title} • {experience} years experience
          </p>
        </div>
      </div>
    </div>
  )
}
