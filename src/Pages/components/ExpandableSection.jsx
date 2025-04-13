"use client"

import { ChevronDown, ChevronUp } from "lucide-react"

const ExpandableSection = ({ title, icon, isExpanded, onToggle, children }) => {
  return (
    <div className="bg-[#151528]/80 backdrop-blur-sm rounded-xl border border-amber-500/20 overflow-hidden">
      <div className="flex justify-between items-center p-4 cursor-pointer" onClick={onToggle}>
        <h2 className="text-lg font-bold flex items-center">
          {icon}
          {title}
        </h2>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </div>

      {isExpanded && <div className="p-4 pt-0">{children}</div>}
    </div>
  )
}

export default ExpandableSection
