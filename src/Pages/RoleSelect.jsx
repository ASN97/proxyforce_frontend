"use client"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

const roles = [
  {
    name: "Project Manager",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    role: "pm",
    color: "blue",
    description: "Break down projects, assign tasks, and track timelines.",
    gradient: "from-blue-900 to-blue-700",
    glow: "bg-blue-400",
    ring: "ring-blue-400",
    icon: "🛡️",
  },
  {
    name: "Sales Executive",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "sales",
    color: "red",
    description: "Engage leads, draft cold emails, and log CRM updates.",
    gradient: "from-red-900 to-red-700",
    glow: "bg-red-400",
    ring: "ring-red-400",
    icon: "🔥",
  },
  {
    name: "Marketing Analyst",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
    role: "marketing",
    color: "green",
    description: "Create campaigns, generate SEO content, and analyze trends.",
    gradient: "from-green-900 to-green-700",
    glow: "bg-green-400",
    ring: "ring-green-400",
    icon: "📊",
  },
]

const RoleSelect = () => {
  const navigate = useNavigate()

  const handleSelect = (role) => {
    navigate(`/experience?role=${role}`)
  }

  const goBack = () => {
    navigate("/")
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
          <div
            className="absolute top-2/3 left-1/3 w-64 h-64 rounded-full bg-emerald-700 opacity-20 blur-[100px] animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
      </div>

      {/* Back Button */}
      <div className="relative z-10 container mx-auto px-6 pt-8">
        <button onClick={goBack} className="flex items-center text-amber-500 hover:text-amber-400 transition-colors">
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span>Return to Kingdom</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-[calc(100vh-80px)] flex items-center justify-center py-10 px-4">
        <div className="backdrop-blur-md bg-[#151528]/50 rounded-3xl p-10 border border-amber-500/30 shadow-2xl max-w-5xl w-full text-center">
          {/* Dragon-inspired decorative element */}
          <div className="relative mb-10">
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-16 w-32 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">
              Choose Your{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
                Champion
              </span>
            </h1>
            <p className="text-gray-400 text-lg">Select the AI ally that will serve your quest</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {roles.map((r, idx) => (
              <div key={idx} onClick={() => handleSelect(r.role)} className="group relative cursor-pointer">
                {/* Card glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-700 rounded-3xl opacity-0 group-hover:opacity-70 transition-opacity duration-300 blur-md"></div>

                {/* Card content */}
                <div className="relative bg-[#151528]/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-amber-500/10 group-hover:border-amber-500/50 transition-all duration-300 flex flex-col items-center p-8">
                  {/* Role icon */}
                  <div className="absolute top-4 right-4 text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                    {r.icon}
                  </div>

                  {/* Avatar with glow */}
                  <div className="relative mb-6 transform group-hover:scale-105 transition-transform duration-300">
                    <div
                      className={`absolute -inset-2 ${r.glow} rounded-full opacity-30 blur-md group-hover:opacity-60 transition-opacity`}
                    ></div>
                    <img
                      src={r.img || "/placeholder.svg"}
                      alt={r.name}
                      className={`w-32 h-32 object-cover rounded-full ${r.ring} ring-4 relative z-10`}
                    />
                  </div>

                  {/* Role name with gradient */}
                  <div className={`bg-gradient-to-r ${r.gradient} px-4 py-1 rounded-full mb-4`}>
                    <p className="text-lg font-bold text-white">{r.name}</p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-center">{r.description}</p>

                  {/* Select button that appears on hover */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#151528] to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 w-full py-2 rounded-full font-medium transition-all duration-300 shadow-lg shadow-amber-900/30">
                      Select Champion
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

export default RoleSelect
