"use client"
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { CheckCircle, ArrowRight } from "lucide-react"

const ProjectSuccessPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const role = queryParams.get("role") || "pm"
  const tier = queryParams.get("tier") || "1"

  const [countdown, setCountdown] = useState(5)

  // Role-specific theming
  const roleThemes = {
    pm: {
      title: "Project Manager",
      color: "blue",
    },
    sales: {
      title: "Sales Executive",
      color: "red",
    },
    marketing: {
      title: "Marketing Analyst",
      color: "green",
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

  useEffect(() => {
    // Auto-redirect after countdown
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      navigate(`/projects?role=${role}&tier=${tier}`)
    }
  }, [countdown, navigate, role, tier])

  const handleContinue = () => {
    navigate(`/projects?role=${role}&tier=${tier}`)
  }

  return (
    <div className="min-h-screen bg-[#0B0B19] text-white flex items-center justify-center">
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

          {/* Success glow effect */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-600 opacity-20 blur-[100px] animate-pulse"></div>
        </div>
      </div>

      <div className="relative z-10 text-center px-6">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 opacity-30 blur-md animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-amber-500 to-amber-700 rounded-full p-5">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4">Project Created Successfully!</h1>

        <p className="text-xl text-gray-300 mb-6">
          Your {tierTitle} {roleTheme.title} has been added to your project
        </p>

        <div className="max-w-md mx-auto bg-[#151528]/80 backdrop-blur-sm rounded-xl p-6 border border-amber-500/30 mb-8">
          <p className="text-gray-300 mb-4">Your AI teammate is now analyzing your project details and preparing:</p>

          <ul className="text-left space-y-3">
            <li className="flex items-start">
              <div className="bg-amber-500/20 p-1 rounded-full mr-2 mt-0.5">
                <CheckCircle className="h-4 w-4 text-amber-500" />
              </div>
              <span>Project timeline with key milestones</span>
            </li>
            <li className="flex items-start">
              <div className="bg-amber-500/20 p-1 rounded-full mr-2 mt-0.5">
                <CheckCircle className="h-4 w-4 text-amber-500" />
              </div>
              <span>Task assignments based on team skills and availability</span>
            </li>
            <li className="flex items-start">
              <div className="bg-amber-500/20 p-1 rounded-full mr-2 mt-0.5">
                <CheckCircle className="h-4 w-4 text-amber-500" />
              </div>
              <span>Initial risk assessment and mitigation strategies</span>
            </li>
          </ul>
        </div>

        <button
          onClick={handleContinue}
          className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white py-3 px-8 rounded-full font-medium transition-all duration-300 shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50 flex items-center mx-auto"
        >
          Continue to Project Dashboard
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>

        <p className="text-gray-400 mt-4">Redirecting in {countdown} seconds...</p>
      </div>
    </div>
  )
}

export default ProjectSuccessPage
