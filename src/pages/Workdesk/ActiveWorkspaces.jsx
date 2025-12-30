// src/pages/Workdesk/ActiveWorkspaces.jsx
// Route: /workdesk/active-workspaces

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import "../../assets/css/ActiveWorkspaces.css";
import WorkspaceOverview from "./WorkspaceOverview";


const WorkdeskCard = ({ workspace }) => {
  return (
    <div className="workspace-card">
      <div className="workspace-header">
        <h3 className="workspace-id">{workspace.tenderId}</h3>
        <span className={`status-badge ${workspace.status}`}>
          {workspace.status}
        </span>
      </div>
      <h4 className="workspace-title">{workspace.title}</h4>
      <div className="workspace-details">
        <div className="detail-item">
          <span className="detail-label">Deadline:</span>
          <span className="detail-value">{workspace.deadline}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Team:</span>
          <span className="detail-value">{workspace.team}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Progress:</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${workspace.progress}%` }}
            ></div>
          </div>
          <span className="progress-text">{workspace.progress}%</span>
        </div>
      </div>
      <div className="workspace-actions">
        <button
          className="btn-primary"
          onClick={() =>
            window.open(`/workspace/${workspace.tenderId}`, "_blank")
          }
        >
          Open Workspace
        </button>

        <button
          className="btn-secondary"
          onClick={() => console.log("View details", workspace.tenderId)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

const ActiveWorkspaces = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");

  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/tender-status-history",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          // Map history items to workspace format
          const mappedWorkspaces = response.data.data.map((item) => ({
            tenderId: item.bid_number,
            title: item.remarks || `Tender ${item.bid_number}`,
            deadline: "N/A", // Placeholder
            team: "Unassigned", // Placeholder
            status: item.status || "active",
            progress: 0, // Placeholder
          }));
          setWorkspaces(mappedWorkspaces);
        } else {
          setError("Failed to fetch workspaces");
        }
      } catch (err) {
        console.error("Error fetching active workspaces:", err);
        setError("Failed to load workspaces");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  const filteredWorkspaces = workspaces.filter((ws) => {
    const matchesSearch =
      ws.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ws.tenderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ws.status === statusFilter;
    const matchesTeam = teamFilter === "all" || ws.team === teamFilter;
    return matchesSearch && matchesStatus && matchesTeam;
  });

  return (
    <div className="active-workspaces-page">
      <div className="page-header">
        <h1>Active Workspaces</h1>
        <p className="page-description">
          View and manage all ongoing tender workspaces. Track progress,
          deadlines, and team assignments in real-time.
        </p>
      </div>

      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by tender ID or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="urgent">Urgent</option>
            <option value="review">In Review</option>
          </select>
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
          >
            <option value="all">All Teams</option>
            <option value="Team Alpha">Team Alpha</option>
            <option value="Team Beta">Team Beta</option>
            <option value="Team Gamma">Team Gamma</option>
            <option value="Team Delta">Team Delta</option>
          </select>
        </div>
      </div>

      <div className="workspaces-grid">
        {filteredWorkspaces.map((workspace, index) => (
          <WorkdeskCard key={index} workspace={workspace} />
        ))}
      </div>

      {filteredWorkspaces.length === 0 && (
        <div className="no-results">
          <p>No workspaces found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

export default ActiveWorkspaces;
