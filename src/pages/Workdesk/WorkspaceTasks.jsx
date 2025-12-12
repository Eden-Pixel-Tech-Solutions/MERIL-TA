// WorkspaceTasks.jsx
import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

const WorkspaceTasks = ({ departments, tasks }) => {
  
  // Flatten tasks with department info
  const allTasks = Object.entries(tasks).flatMap(([deptId, list]) =>
    list.map(task => ({
      ...task,
      deptId: parseInt(deptId),
      department: departments.find(d => d.id === parseInt(deptId)),
    }))
  );

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "10px",
        padding: "1.5rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
      }}
    >
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "700",
          color: "#1f2937",
          margin: "0 0 1rem 0",
        }}
      >
        All Tasks
      </h2>
      <p style={{ color: "#6b7280", margin: 0 }}>
        Consolidated view of all tasks across departments
      </p>

      <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {allTasks.length === 0 && (
          <p style={{ textAlign: "center", padding: "2rem 0", color: "#9ca3af" }}>
            No tasks found
          </p>
        )}

        {allTasks.map((task) => (
          <div
            key={task.id}
            style={{
              padding: "1rem",
              borderRadius: "8px",
              background: "#f8fafc",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f8fafc")}
          >
            {/* LEFT SIDE TASK DETAILS */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {task.status === "done" ? (
                <CheckCircle2 style={{ width: "1.25rem", height: "1.25rem", color: "#059669" }} />
              ) : (
                <Circle style={{ width: "1.25rem", height: "1.25rem", color: "#9ca3af" }} />
              )}

              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: "500",
                    textDecoration: task.status === "done" ? "line-through" : "none",
                    color: task.status === "done" ? "#6b7280" : "#1f2937",
                  }}
                >
                  {task.title}
                </p>

                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8rem", color: "#6b7280" }}>
                  Created: {task.createdAt}
                </p>
              </div>
            </div>

            {/* RIGHT SIDE DEPARTMENT TAG */}
            {task.department && (
              <span
                style={{
                  padding: "0.35rem 0.75rem",
                  background: task.department.color + "22",
                  color: task.department.color,
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                }}
              >
                {task.department.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkspaceTasks;
