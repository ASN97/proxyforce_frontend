"use client"
import { useNavigate } from "react-router-dom"
import { ArrowRight, Users, Zap, Shield, Clock } from 'lucide-react'
import { useEffect, useState } from "react"

const LandingPage = () => {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleGetStarted = () => {
    navigate("/roles")
  }

  return (
    <div className="min-h-screen bg-[#0B0B19] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[#0B0B19]">
          {/* Dragon scale pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
          
          {/* Magical glow effects */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-700 opacity-20 blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-700 opacity-20 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-2/3 left-1/3 w-64 h-64 rounded-full bg-emerald-700 opacity-20 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0B0B19]/90 backdrop-blur-md shadow-lg' : ''}`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative">
              <Zap className="h-8 w-8 text-amber-500" />
              <div className="absolute inset-0 text-amber-500 animate-ping opacity-30">
                <Zap className="h-8 w-8" />
              </div>
            </div>
            <span className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">ProxyForce</span>
          </div>
          <button
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 px-5 py-2 rounded-full font-medium transition-all duration-300 shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50"
          >
            Summon Your Team
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 container mx-auto px-6 pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
            <div className="relative inline-block mb-4">
              <span className="text-sm font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600 uppercase">Unleash the power</span>
              <div className="h-px w-20 bg-gradient-to-r from-amber-400 to-transparent absolute -bottom-1 left-0"></div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Command Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">Legendary</span> AI Team
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-lg mx-auto md:mx-0">
              ProxyForce empowers visionaries to scale their ambitions with AI teammates forged for greatness. Your digital dynasty awaits.
            </p>
            
            <button
              onClick={handleGetStarted}
              className="group bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50 flex items-center mx-auto md:mx-0"
            >
              Forge Your Team Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              {/* Dragon-inspired frame */}
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-2xl opacity-70 blur-md"></div>
              
              {/* Main content card with dragon scale pattern */}
              <div className="relative bg-[#151528]/80 backdrop-blur-md rounded-2xl p-8 border border-amber-500/30 shadow-2xl overflow-hidden">
                {/* Dragon scale pattern inside card */}
                <div className="absolute inset-0 opacity-5" style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '30px 30px'
                }}></div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl p-4 text-white transform transition-transform hover:scale-105 shadow-lg shadow-blue-900/50">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-blue-400 rounded-full opacity-30 blur-sm"></div>
                      <img
                        src="https://randomuser.me/api/portraits/women/44.jpg"
                        alt="Project Manager"
                        className="w-16 h-16 rounded-full mx-auto mb-2 ring-2 ring-blue-400 relative z-10"
                      />
                    </div>
                    <p className="text-center font-medium">Project Manager</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-900 to-red-700 rounded-xl p-4 text-white transform transition-transform hover:scale-105 shadow-lg shadow-red-900/50">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-red-400 rounded-full opacity-30 blur-sm"></div>
                      <img
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        alt="Sales Executive"
                        className="w-16 h-16 rounded-full mx-auto mb-2 ring-2 ring-red-400 relative z-10"
                      />
                    </div>
                    <p className="text-center font-medium">Sales Executive</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-900 to-green-700 rounded-xl p-4 text-white transform transition-transform hover:scale-105 shadow-lg shadow-green-900/50">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-green-400 rounded-full opacity-30 blur-sm"></div>
                      <img
                        src="https://randomuser.me/api/portraits/women/65.jpg"
                        alt="Marketing Analyst"
                        className="w-16 h-16 rounded-full mx-auto mb-2 ring-2 ring-green-400 relative z-10"
                      />
                    </div>
                    <p className="text-center font-medium">Marketing Analyst</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-xl p-4 text-white transform transition-transform hover:scale-105 shadow-lg shadow-purple-900/50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-dashed border-purple-400 flex items-center justify-center">
                        <span className="text-2xl">+</span>
                      </div>
                      <p className="font-medium">More Coming</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">ProxyForce</span> Advantage</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-transparent mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-[#151528]/50 backdrop-blur-sm rounded-xl p-8 border border-amber-500/20 shadow-xl hover:shadow-amber-900/20 transition-all hover:-translate-y-1 group">
              <div className="bg-gradient-to-br from-blue-900 to-blue-700 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-blue-200" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-amber-400">Dragon-Tier AI Roles</h3>
              <p className="text-gray-300">
                Summon AI teammates with specialized skills, each crafted to dominate their domain with unparalleled expertise.
              </p>
            </div>

            <div className="bg-[#151528]/50 backdrop-blur-sm rounded-xl p-8 border border-amber-500/20 shadow-xl hover:shadow-amber-900/20 transition-all hover:-translate-y-1 group">
              <div className="bg-gradient-to-br from-red-900 to-red-700 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-red-200" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-amber-400">Legendary Experience</h3>
              <p className="text-gray-300">
                Choose the caliber of your AI allies, from emerging talents to battle-hardened veterans with decades of wisdom.
              </p>
            </div>

            <div className="bg-[#151528]/50 backdrop-blur-sm rounded-xl p-8 border border-amber-500/20 shadow-xl hover:shadow-amber-900/20 transition-all hover:-translate-y-1 group">
              <div className="bg-gradient-to-br from-green-900 to-green-700 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="h-8 w-8 text-green-200" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-amber-400">Timeless Efficiency</h3>
              <p className="text-gray-300">
                Conquer more with less effort as your AI team handles the mundane, freeing you to focus on your empire's vision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Creators Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">Architects</span></h2>
            <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-transparent mx-auto"></div>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-10">
            <div className="bg-[#151528]/50 backdrop-blur-sm rounded-xl p-8 border border-amber-500/20 shadow-xl max-w-xs text-center transform transition-transform hover:scale-105">
              <div className="relative mb-6">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full opacity-70 blur-md"></div>
                <img
                  src="https://randomuser.me/api/portraits/men/85.jpg"
                  alt="Creator 1"
                  className="w-24 h-24 rounded-full mx-auto relative z-10 ring-2 ring-amber-500"
                />
              </div>
              <h3 className="text-xl font-bold mb-1 text-amber-400">Alex Johnson</h3>
              <p className="text-gray-400 mb-3">Visionary & Developer</p>
              <p className="text-gray-300">
                Master craftsman of code who breathes life into digital realms, forging the backbone of ProxyForce with uncompromising precision.
              </p>
            </div>

            <div className="bg-[#151528]/50 backdrop-blur-sm rounded-xl p-8 border border-amber-500/20 shadow-xl max-w-xs text-center transform transition-transform hover:scale-105">
              <div className="relative mb-6">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full opacity-70 blur-md"></div>
                <img
                  src="https://randomuser.me/api/portraits/women/79.jpg"
                  alt="Creator 2"
                  className="w-24 h-24 rounded-full mx-auto relative z-10 ring-2 ring-amber-500"
                />
              </div>
              <h3 className="text-xl font-bold mb-1 text-amber-400">Sarah Chen</h3>
              <p className="text-gray-400 mb-3">Enchantress of Design</p>
              <p className="text-gray-300">
                Weaver of visual magic whose designs transcend mere aesthetics, creating experiences that captivate the senses and inspire loyalty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          {/* Dragon-inspired decorative element */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-20">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-700 mask-image-dragon opacity-70 blur-sm"></div>
          </div>
          
          <div className="bg-[#151528]/50 backdrop-blur-sm rounded-xl p-10 border border-amber-500/30 shadow-2xl relative overflow-hidden">
            {/* Dragon scale pattern */}
            <div className="absolute inset-0 opacity-5" style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}></div>
            
            {/* Glowing orbs */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-amber-600 opacity-20 blur-[50px]"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-amber-600 opacity-20 blur-[50px]"></div>
            
            <div className="text-center relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Claim Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">Digital Dynasty</span></h2>
              <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-300">
                The future belongs to those bold enough to seize it. Your AI team stands ready to transform your vision into reality.
              </p>
              <button
                onClick={handleGetStarted}
                className="group bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50 flex items-center mx-auto"
              >
                Forge Your Team Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 border-t border-amber-900/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Zap className="h-6 w-6 text-amber-500" />
              <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">ProxyForce</span>
            </div>
            <div className="text-amber-500/70 text-sm">© {new Date().getFullYear()} ProxyForce. Forged in digital fire.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

