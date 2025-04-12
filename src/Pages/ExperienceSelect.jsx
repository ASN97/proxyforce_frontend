"use client"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Star, Shield, Crown } from "lucide-react"

const tiers = [
  {
    label: "Apprentice",
    years: "2 Years of Experience",
    desc: "Eager to serve — quick to learn, focused on fundamentals",
    level: 1,
    icon: <Star className="w-6 h-6" />,
  },
  {
    label: "Adept",
    years: "5 Years of Experience",
    desc: "Battle-tested — confident in approach, consistent in execution",
    level: 2,
    icon: <Shield className="w-6 h-6" />,
  },
  {
    label: "Master",
    years: "10 Years of Experience",
    desc: "Legendary strategist — commanding presence, unmatched wisdom",
    level: 3,
    icon: <Crown className="w-6 h-6" />,
  },
]

const roleThemes = {
  pm: {
    color: "#3B82F6", // blue
    gradient: "from-blue-900 to-blue-700",
    light: "bg-blue-400",
    name: "Project Manager",
    glow: "bg-blue-600",
  },
  sales: {
    color: "#EF4444", // red
    gradient: "from-red-900 to-red-700",
    light: "bg-red-400",
    name: "Sales Executive",
    glow: "bg-red-600",
  },
  marketing: {
    color: "#22C55E", // green
    gradient: "from-green-900 to-green-700",
    light: "bg-green-400",
    name: "Marketing Analyst",
    glow: "bg-green-600",
  },
}

const ExperienceSelect = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const role = queryParams.get("role") || "pm"
  const roleTheme = roleThemes[role] || roleThemes.pm

  const handleSelect = (tier) => {
    navigate(`/chat?role=${role}&tier=${tier}`)
  }

  const goBack = () => {
    navigate("/roles")
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

          {/* Role-specific glow effect */}
          <div
            className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full ${roleTheme.glow} opacity-20 blur-[100px] animate-pulse`}
          ></div>
          <div
            className={`absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full ${roleTheme.glow} opacity-15 blur-[100px] animate-pulse`}
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>
      </div>

      {/* Back Button */}
      <div className="relative z-10 container mx-auto px-6 pt-8">
        <button onClick={goBack} className="flex items-center text-amber-500 hover:text-amber-400 transition-colors">
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span>Return to Champions</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-[calc(100vh-80px)] flex items-center justify-center py-10 px-4">
        <div className="backdrop-blur-md bg-[#151528]/50 rounded-3xl p-10 border border-amber-500/30 shadow-2xl max-w-4xl w-full text-center">
          {/* Role indicator */}
          <div className={`inline-block bg-gradient-to-r ${roleTheme.gradient} px-4 py-1 rounded-full mb-6`}>
            <p className="text-sm font-medium text-white">{roleTheme.name} Champion</p>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Choose Your Champion's{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">Mastery</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10">The greater the experience, the mightier the ally</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
            {tiers.map((tier, idx) => (
              <div key={idx} onClick={() => handleSelect(tier.level)} className="group relative cursor-pointer">
                {/* Card glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-700 rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-300 blur-md"></div>

                {/* Card content */}
                <div className="relative bg-[#151528]/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-amber-500/10 group-hover:border-amber-500/50 transition-all duration-300 p-6 flex flex-col items-center">
                  {/* Tier icon with role-specific color */}
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${roleTheme.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    {tier.icon}
                  </div>

                  {/* Tier name with decorative line */}
                  <div className="relative mb-3">
                    <h3 className="text-xl font-bold text-amber-400">{tier.label}</h3>
                    <div className="h-px w-12 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-1"></div>
                  </div>

                  {/* Years of experience */}
                  <p className="text-white font-medium mb-2">{tier.years}</p>

                  {/* Description */}
                  <p className="text-gray-400 text-sm">{tier.desc}</p>

                  {/* Select button that appears on hover */}
                  <div className="mt-4 w-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className={`bg-gradient-to-r ${roleTheme.gradient} hover:brightness-110 w-full py-2 rounded-full font-medium transition-all duration-300 shadow-lg`}
                    >
                      Select {tier.label}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExperienceSelect
