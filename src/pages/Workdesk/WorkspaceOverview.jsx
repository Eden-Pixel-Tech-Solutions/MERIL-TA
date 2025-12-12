import React from "react";
import {
  BarChart3,
  FileText,
  CheckCircle2,
  FolderOpen,
  Users,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const WorkspaceOverview = () => {
  // Dummy analytics data
  const taskTrend = [
    { month: "Jan", tasks: 14 },
    { month: "Feb", tasks: 18 },
    { month: "Mar", tasks: 22 },
    { month: "Apr", tasks: 28 },
    { month: "May", tasks: 31 },
    { month: "Jun", tasks: 38 },
  ];

  const fileSummary = [
    { name: "Engineering", value: 12 },
    { name: "Finance", value: 18 },
    { name: "Legal", value: 22 },
    { name: "Operations", value: 14 },
    { name: "HR", value: 8 },
    { name: "Marketing", value: 19 },
  ];

  const COLORS = ["#2563eb", "#059669", "#7c3aed", "#dc2626", "#db2777", "#0891b2"];

  return (
    <div style={{ minHeight: "100vh", background: "#f3f6fb", padding: "2rem" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>

        {/* ---------------- PAGE HEADER ---------------- */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <BarChart3 size={32} color="#2563eb" />
          <h1 style={{ margin: 0, fontWeight: "700", color: "#1f2937" }}>
            Project Overview
          </h1>
        </div>

        {/* ---------------- TENDER DETAILS ---------------- */}
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 3px 6px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ marginTop: 0, color: "#1f2937", fontWeight: 600 }}>
            Tender Details
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
              marginTop: "1rem",
            }}
          >
            <DetailItem label="Tender ID" value="TND-2024-001" color="#2563eb" />
            <DetailItem label="Status" value="In Progress" color="#059669" />
            <DetailItem label="Deadline" value="Dec 31, 2025" color="#dc2626" />
            <DetailItem label="Budget" value="$2,500,000" color="#7c3aed" />
          </div>
        </div>

        {/* ---------------- SUMMARY CARDS ---------------- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.25rem",
          }}
        >
          <SummaryCard
            label="Total Departments"
            value="6"
            icon={<Users size={28} />}
            color="#2563eb"
          />

          <SummaryCard
            label="Total Tasks"
            value="72"
            icon={<CheckCircle2 size={28} />}
            color="#059669"
          />

          <SummaryCard
            label="Total Files"
            value="93"
            icon={<FileText size={28} />}
            color="#7c3aed"
          />

          <SummaryCard
            label="Workspace Overview"
            value="Active"
            icon={<FolderOpen size={28} />}
            color="#db2777"
          />
        </div>

        {/* ---------------- TREND CHART ---------------- */}
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 3px 6px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ margin: 0, marginBottom: "1rem", fontWeight: 600 }}>
            Monthly Task Trend
          </h2>

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={taskTrend}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="tasks" stroke="#2563eb" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ---------------- FILE DISTRIBUTION PIE CHART ---------------- */}
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 3px 6px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ margin: 0, marginBottom: "1rem", fontWeight: 600 }}>
            File Distribution by Department
          </h2>

          <div style={{ width: "100%", height: 350 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={fileSummary}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >
                  {fileSummary.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ---------------- PERFORMANCE INDICATORS ---------------- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          <TrendCard label="Task Completion Rate" value="74%" trend="+6.2%" />
          <TrendCard label="File Upload Growth" value="89%" trend="+8.1%" />
          <TrendCard label="Team Activity Score" value="92%" trend="+3.8%" />
        </div>
      </div>
    </div>
  );
};

/* ---------------- REUSABLE COMPONENTS ---------------- */

const SummaryCard = ({ label, value, icon, color }) => (
  <div
    style={{
      background: "white",
      padding: "1.25rem",
      borderRadius: "10px",
      border: "1px solid #e5e7eb",
      boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    }}
  >
    <div style={{ background: color + "20", padding: "0.75rem", borderRadius: "10px", color }}>
      {icon}
    </div>
    <div>
      <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280" }}>{label}</p>
      <p style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700 }}>{value}</p>
    </div>
  </div>
);

const DetailItem = ({ label, value, color }) => (
  <div style={{ borderLeft: `4px solid ${color}`, paddingLeft: "1rem" }}>
    <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280" }}>{label}</p>
    <p style={{ margin: "0.25rem 0 0 0", fontSize: "1rem", fontWeight: 600 }}>{value}</p>
  </div>
);

const TrendCard = ({ label, value, trend }) => (
  <div
    style={{
      background: "white",
      padding: "1.5rem",
      borderRadius: "12px",
      border: "1px solid #e5e7eb",
      boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    }}
  >
    <p style={{ margin: 0, fontSize: "0.9rem", color: "#6b7280" }}>{label}</p>
    <p style={{ margin: "0.3rem 0 0 0", fontSize: "2rem", fontWeight: 700 }}>{value}</p>

    <p
      style={{
        margin: "0.2rem 0 0 0",
        color: "#059669",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: "0.3rem",
      }}
    >
      <TrendingUp size={18} /> {trend}
    </p>
  </div>
);

export default WorkspaceOverview;
