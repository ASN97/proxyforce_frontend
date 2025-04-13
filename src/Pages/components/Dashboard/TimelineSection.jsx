// TimelineSection.jsx
import { Calendar } from "lucide-react"

const TimelineSection = ({ milestones }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-bold">Project Timeline</h2>
      </div>
      <div className="overflow-y-auto space-y-4">
        {milestones?.length ? (
          milestones.map((m) => (
            <div
              key={m.id}
              className="bg-[#0B0B19]/60 p-4 rounded-lg border border-amber-500/20"
            >
              <div className="flex justify-between">
                <h3 className="font-medium">{m.name}</h3>
                <span className="text-xs text-gray-400">
                  {new Date(m.deadline).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-amber-500">{m.progress}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      m.status === "completed"
                        ? "bg-green-600"
                        : "bg-gradient-to-r from-amber-500 to-amber-700"
                    }`}
                    style={{ width: `${m.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400">No milestones yet.</p>
        )}
      </div>
    </div>
  )
}

export default TimelineSection
