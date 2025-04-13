const MilestoneItem = ({ milestone }) => {
  return (
    <div className="bg-[#0B0B19]/50 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium">{milestone.name}</h3>
          <p className="text-sm text-gray-400">
            Due:{" "}
            {new Date(milestone.deadline).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            milestone.status === "completed"
              ? "bg-green-900/50 text-green-400"
              : milestone.status === "in-progress"
                ? "bg-blue-900/50 text-blue-400"
                : "bg-amber-900/50 text-amber-400"
          }`}
        >
          {milestone.status === "completed"
            ? "Completed"
            : milestone.status === "in-progress"
              ? "In Progress"
              : "Not Started"}
        </span>
      </div>

      <div className="mt-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-400">Progress</span>
          <span className="text-amber-500">{milestone.progress}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${
              milestone.status === "completed" ? "bg-green-600" : "bg-gradient-to-r from-amber-500 to-amber-700"
            }`}
            style={{ width: `${milestone.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default MilestoneItem
