import React, { useMemo } from "react";
import { Chart } from "react-google-charts";

const GanttChart = ({ tasks }) => {
  const columns = [
    { type: "string", label: "Task ID" },
    { type: "string", label: "Task Name" },
    { type: "string", label: "Resource" },
    { type: "date", label: "Start Date" },
    { type: "date", label: "End Date" },
    { type: "number", label: "Duration" },
    { type: "number", label: "Percent Complete" },
    { type: "string", label: "Dependencies" },
  ];

  const formattedRows = useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    return tasks.map((task, i) => [
      task.id || `task${i + 1}`,
      task.name || `Task ${i + 1}`,
      task.assignee || "Unassigned",
      new Date(task.start),
      new Date(task.end),
      null,
      task.progress || 0,
      Array.isArray(task.dependencies) ? task.dependencies.join(",") : task.dependencies || null,
    ]);
  }, [tasks]);

  const data = [columns, ...formattedRows];

  const options = {
    height: 60 + tasks.length * 50,
    gantt: {
      trackHeight: 40,
      criticalPathEnabled: false,
    },
  };

  return (
    <div className="bg-white rounded p-2">
      <Chart chartType="Gantt" width="100%" height={`${options.height}px`} data={data} options={options} />
    </div>
  );
};

export default GanttChart;
