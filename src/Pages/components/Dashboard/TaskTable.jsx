import React from "react";

const TaskTable = ({ tasks }) => {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return <p className="text-white text-sm">No tasks available.</p>;
  }

  return (
    <div className="bg-[#151528] border border-amber-500/20 rounded-lg overflow-x-auto">
      <table className="w-full text-sm text-white table-auto">
        <thead className="bg-[#0B0B19] text-amber-400 uppercase">
          <tr>
            <th className="px-4 py-2 text-left">Task</th>
            <th className="px-4 py-2 text-left">Assignee</th>
            <th className="px-4 py-2 text-left">Start Date</th>
            <th className="px-4 py-2 text-left">End Date</th>
            <th className="px-4 py-2 text-left">Dependencies</th>
            <th className="px-4 py-2 text-left">% Complete</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, i) => (
            <tr key={task.id || i} className="border-t border-amber-500/10 hover:bg-[#1F1F2F]">
              <td className="px-4 py-2">{task.name}</td>
              <td className="px-4 py-2">{task.assignee}</td>
              <td className="px-4 py-2">{new Date(task.start).toLocaleDateString()}</td>
              <td className="px-4 py-2">{new Date(task.end).toLocaleDateString()}</td>
              <td className="px-4 py-2">
                {Array.isArray(task.dependencies)
                  ? task.dependencies.join(", ")
                  : task.dependencies || "—"}
              </td>
              <td className="px-4 py-2">{task.progress || 0}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
