const TaskItem = ({ task }) => {
    return (
      <tr className="border-t border-gray-800">
        <td className="py-3">{task.name}</td>
        <td className="py-3">{task.assignee}</td>
        <td className="py-3">
          {new Date(task.deadline).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </td>
        <td className="py-3">
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              task.priority === "high"
                ? "bg-red-900/30 text-red-400"
                : task.priority === "medium"
                  ? "bg-amber-900/30 text-amber-400"
                  : "bg-blue-900/30 text-blue-400"
            }`}
          >
            {task.priority}
          </span>
        </td>
        <td className="py-3">
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              task.status === "completed"
                ? "bg-green-900/30 text-green-400"
                : task.status === "in-progress"
                  ? "bg-blue-900/30 text-blue-400"
                  : "bg-gray-800 text-gray-400"
            }`}
          >
            {task.status === "completed" ? "Completed" : task.status === "in-progress" ? "In Progress" : "Not Started"}
          </span>
        </td>
      </tr>
    )
  }
  
  export default TaskItem
  