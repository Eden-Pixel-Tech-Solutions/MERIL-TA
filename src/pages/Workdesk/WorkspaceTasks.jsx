import React, { useState } from 'react';
import { CheckCircle2, Circle, Search, Filter, Users, ClipboardList, Tag } from 'lucide-react';

const WorkspaceTask = ({ departments, tasks }) => {
  // ---------------- REAL DATA LOGIC ----------------

  // Flatten the nested tasks object { deptId: [tasks] } into a single array
  // and inject deptId into each task for filtering/display
  const allTasks = Object.entries(tasks).flatMap(([deptId, deptTasks]) =>
    deptTasks.map(task => ({ ...task, deptId: Number(deptId) }))
  );

  // ---------------- FILTER STATES ----------------
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // ---------------- FILTER LOGIC ----------------
  const filteredTasks = allTasks.filter(task => {
    const matchDept = filterDept === "all" || task.deptId === Number(filterDept);
    // Note: status is strictly "done" or "not-done" in Workspaces.jsx
    const matchStatus = filterStatus === "all" || task.status === filterStatus;
    const matchSearch = task.title.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchStatus && matchSearch;
  });

  const getDept = (id) => departments.find(d => d.id === id);

  const totalTasks = allTasks.length;
  const totalDone = allTasks.filter(t => t.status === "done").length;
  const totalPending = allTasks.filter(t => t.status !== "done").length;

  return (
    <div style={{ minHeight: "100vh", background: "#f3f6fb", padding: "2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* ---------------- PAGE HEADER ---------------- */}
        <h1 style={{
          fontSize: "1.8rem",
          fontWeight: "700",
          color: "#1f2937",
          marginBottom: "1.5rem"
        }}>
          All Tasks Overview
        </h1>

        {/* ---------------- SUMMARY CARDS ---------------- */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem"
        }}>

          {/* Total Tasks */}
          <div style={{
            background: "#2563eb",
            padding: "1.5rem",
            borderRadius: "10px",
            color: "white"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <p style={{ opacity: 0.8, margin: 0 }}>Total Tasks</p>
                <h2 style={{ margin: "0.5rem 0 0 0", fontSize: "2rem" }}>{totalTasks}</h2>
              </div>
              <ClipboardList size={40} />
            </div>
          </div>

          {/* Pending Tasks */}
          <div style={{
            background: "#dc2626",
            padding: "1.5rem",
            borderRadius: "10px",
            color: "white"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <p style={{ opacity: 0.8, margin: 0 }}>Pending</p>
                <h2 style={{ margin: "0.5rem 0 0 0", fontSize: "2rem" }}>{totalPending}</h2>
              </div>
              <Circle size={40} />
            </div>
          </div>

          {/* Completed Tasks */}
          <div style={{
            background: "#059669",
            padding: "1.5rem",
            borderRadius: "10px",
            color: "white"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <p style={{ opacity: 0.8, margin: 0 }}>Completed</p>
                <h2 style={{ margin: "0.5rem 0 0 0", fontSize: "2rem" }}>{totalDone}</h2>
              </div>
              <CheckCircle2 size={40} />
            </div>
          </div>

        </div>

        {/* ---------------- FILTER BAR ---------------- */}
        <div style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "10px",
          marginBottom: "1.5rem",
          boxShadow: "0 2px 4px rgba(0,0,0,0.08)"
        }}>

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            alignItems: "center"
          }}>

            {/* Search */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flex: 1,
              minWidth: "240px"
            }}>
              <Search size={18} color="#6b7280" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                  outline: "none"
                }}
              />
            </div>

            {/* Department Filter */}
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              style={{
                padding: "0.75rem",
                borderRadius: "6px",
                border: "1px solid #e5e7eb",
                minWidth: "180px"
              }}>
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: "0.75rem",
                borderRadius: "6px",
                border: "1px solid #e5e7eb",
                minWidth: "150px"
              }}>
              <option value="all">All Status</option>
              <option value="not-done">Pending</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        {/* ---------------- TASK LIST ---------------- */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}>
          {filteredTasks.length === 0 ? (
            <p style={{ textAlign: "center", color: "#9ca3af", padding: "2rem" }}>
              No tasks match the filters.
            </p>
          ) : (
            filteredTasks.map(task => {
              const dept = getDept(task.deptId);

              return (
                <div key={task.id} style={{
                  background: "white",
                  padding: "1rem",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.08)"
                }}>
                  {/* Task Left Section */}
                  <div>
                    <p style={{
                      margin: 0,
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: task.status === "done" ? "#059669" : "#1f2937",
                      textDecoration: task.status === "done" ? "line-through" : "none"
                    }}>
                      {task.title}
                    </p>

                    <p style={{ margin: "0.35rem 0 0 0", fontSize: "0.85rem", color: "#6b7280" }}>
                      {task.createdAt}
                    </p>

                    {task.tags && task.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                        {task.tags.map((tag, idx) => (
                          <span key={idx} style={{
                            fontSize: '0.7rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: '#e0f2fe',
                            color: '#0284c7',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}>
                            <Tag size={10} /> {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Department Badge */}
                    <span style={{
                      marginTop: "0.4rem",
                      display: "inline-block",
                      padding: "0.25rem 0.6rem",
                      background: dept.color + "20",
                      color: dept.color,
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: 600
                    }}>
                      {dept.name}
                    </span>

                    {/* Done Badge */}
                    {task.status === "done" && (
                      <span style={{
                        marginLeft: "0.5rem",
                        padding: "0.25rem 0.6rem",
                        background: "#d1fae5",
                        color: "#047857",
                        borderRadius: "999px",
                        fontSize: "0.75rem",
                        fontWeight: 600
                      }}>
                        ✓ Done
                      </span>
                    )}
                  </div>

                  {/* Status Icon */}
                  <div>
                    {task.status === "done" ? (
                      <CheckCircle2 size={24} color="#059669" />
                    ) : (
                      <Circle size={24} color="#9ca3af" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceTask;
