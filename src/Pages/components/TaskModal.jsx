"use client"

import { X, Loader } from "lucide-react"

const TaskModal = ({ newTask, setNewTask, onClose, onSubmit, isSubmitting, teamMembers }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-[#151528] rounded-xl border border-amber-500/30 p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Create New Task</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Task Name</label>
            <input
              type="text"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              placeholder="Enter task name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Assignee</label>
            <select
              value={newTask.assignee}
              onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
              className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <option value="">Select team member</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.name}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
            <input
              type="date"
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 min-h-[80px]"
              placeholder="Task description"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-gray-300 hover:text-white">
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white px-4 py-2 rounded-lg flex items-center"
          >
            {isSubmitting ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : null}
            Create Task
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskModal
