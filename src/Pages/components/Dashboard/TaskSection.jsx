// TaskSection.jsx
import { useState } from "react"
import TaskItem from "../TaskItem"
import TaskModal from "../TaskModal"

const TaskSection = ({ projectId, tasks, team }) => {
  const [showModal, setShowModal] = useState(false)
  const [taskList, setTaskList] = useState(tasks)
  const [newTask, setNewTask] = useState({ name: "", assignee: "", deadline: "", priority: "medium", description: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`http://localhost:8000/projects/${projectId}/add-task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      })
      const data = await res.json()
      setTaskList((prev) => [...prev, data])
      setShowModal(false)
    } catch (err) {
      console.error("Failed to add task", err)
    } finally {
      setIsSubmitting(false)
      setNewTask({ name: "", assignee: "", deadline: "", priority: "medium", description: "" })
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Task Allocation</h2>
        <button
          onClick={() => setShowModal(true)}
          className="text-sm bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-lg"
        >
          + Add Task
        </button>
      </div>
      <div className="overflow-y-auto flex-1">
        <table className="w-full text-sm">
          <thead className="text-gray-400">
            <tr>
              <th className="pb-2 text-left">Task</th>
              <th className="pb-2 text-left">Assignee</th>
              <th className="pb-2 text-left">Due Date</th>
              <th className="pb-2 text-left">Priority</th>
              <th className="pb-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {taskList.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <TaskModal
          newTask={newTask}
          setNewTask={setNewTask}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          teamMembers={team}
        />
      )}
    </div>
  )
}

export default TaskSection
