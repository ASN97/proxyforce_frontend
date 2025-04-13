"use client"

import { ArrowLeft } from "lucide-react"

const ProjectHeader = ({ projectName, projectDescription, daysRemaining, progress, onBack }) => {
  return (
    <header className="relative z-10 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-white/20 transition-colors mr-3">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">{projectName}</h1>
              <p className="text-sm opacity-80">{projectDescription}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm">{daysRemaining} days remaining</div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm">{progress}% complete</div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default ProjectHeader
