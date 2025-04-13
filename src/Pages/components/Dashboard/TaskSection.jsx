import { useState, useEffect } from "react";
import TaskModal from "../TaskModal"; // optional if you still use modal

const TaskSection = ({ projectId, tasks = [] }) => {
  const [taskList, setTaskList] = useState(tasks);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newTask, setNewTask] = useState({
    name: "",
    assignee: "",
    deadline: "",
    priority: "medium",
    description: "",
    status: "not-started",
  });

  useEffect(() => {
    setTaskList(tasks);
  }, [tasks]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:8000/projects/${projectId}/add-task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      const data = await res.json();
      setTaskList((prev) => [...prev, data]);
      setShowModal(false);
    } catch (err) {
      console.error("Add task failed", err);
    } finally {
      setIsSubmitting(false);
      setNewTask({
        name: "",
        assignee: "",
        deadline: "",
        priority: "medium",
        description: "",
        status: "not-started",
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-white">Task Allocation</h2>
        <button
          onClick={() => setShowModal(true)}
          className="text-sm bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-lg"
        >
        
        </button>
      </div>

      <div className="overflow-y-auto flex-1 border border-amber-500/20 rounded-lg">
        <table className="w-full text-sm text-white table-auto">
          <thead className="bg-[#0B0B19] text-amber-400 uppercase">
            <tr>
              <th className="px-4 py-2 text-left">Task</th>
              <th className="px-4 py-2 text-left">Assignee</th>
              <th className="px-4 py-2 text-left">Due Date</th>
              <th className="px-4 py-2 text-left">Priority</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {taskList.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-amber-400">
                  No tasks available.
                </td>
              </tr>
            ) : (
              taskList.map((task, index) => (
                <tr key={task.id || index} className="border-t border-amber-500/10 hover:bg-[#1F1F2F]">
                  <td className="px-4 py-2">{task.name}</td>
                  <td className="px-4 py-2">{task.assignee || "—"}</td>
                  <td className="px-4 py-2">
                    {new Date(task.end || task.deadline).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 capitalize">{task.priority || "Medium"}</td>
                  <td className="px-4 py-2 capitalize">{task.status || "Not Started"}</td>
                </tr>
              ))
            )}
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
        />
      )}
    </div>
  );
};

export default TaskSection;
