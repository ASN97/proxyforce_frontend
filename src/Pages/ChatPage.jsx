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
  const [aiAssistant, setAiAssistant] = useState(null)
  const [theme, setTheme] = useState(null)

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search)
  const role = queryParams.get("role") || "project-manager" 
  const tier = queryParams.get("tier") || "1"

  // Fetch AI assistant data and theme
  useEffect(() => {
    const fetchAiAssistantData = async () => {
      try {
        const [assistantRes, themeRes] = await Promise.all([
          fetch(`http://localhost:8000/api/ai-assistant?role=${role}&tier=${tier}`),
          fetch(`http://localhost:8000/api/theme/${role}`)
        ])

        const assistantData = await assistantRes.json()
        const themeData = await themeRes.json()

        setAiAssistant(assistantData)
        setTheme(themeData)

        // Set initial greeting message
        const initialMessage = {
          id: "1",
          content: assistantData.greeting,
          sender: "ai",
          timestamp: new Date()
        }
        setMessages([initialMessage])

      } catch (error) {
        console.error("Error fetching AI assistant data:", error)
      }
    }

    fetchAiAssistantData()
  }, [role, tier])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: input,
      sender: "user", 
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: input,
          role,
          tier
        })
      })

      const aiResponse = await response.json()

      const aiMessage = {
        id: Date.now().toString(),
        content: aiResponse.message,
        sender: "ai",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error("Error getting AI response:", error)
    } finally {
      setLoading(false)
    }
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

  if (!theme || !aiAssistant) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
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
                <img src={aiAssistant.avatar} alt={aiAssistant.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <h1 className="font-bold text-lg">{aiAssistant.name}</h1>
                <p className="text-xs opacity-80">
                  {aiAssistant.title} • {aiAssistant.experience} years experience
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
              placeholder={`Message ${aiAssistant.name}...`}
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
            ProxyForce AI • {aiAssistant.title} • {aiAssistant.experience} years experience
          </p>
        </div>
      </div>
    </div>
  )
}
