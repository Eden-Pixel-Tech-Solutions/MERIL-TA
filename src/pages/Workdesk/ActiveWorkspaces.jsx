// src/pages/Workdesk/ActiveWorkspaces.jsx
// Route: /workdesk/active-workspaces

import React, { useState } from 'react';
import '../../assets/css/ActiveWorkspaces.css';

const WorkdeskCard = ({ workspace }) => {
  return (
    <div className="workspace-card">
      <div className="workspace-header">
        <h3 className="workspace-id">{workspace.tenderId}</h3>
        <span className={`status-badge ${workspace.status}`}>{workspace.status}</span>
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
            <div className="progress-fill" style={{ width: `${workspace.progress}%` }}></div>
          </div>
          <span className="progress-text">{workspace.progress}%</span>
        </div>
      </div>
      <div className="workspace-actions">
        <button className="btn-primary" onClick={() => console.log('Open workspace', workspace.tenderId)}>
          Open Workspace
        </button>
        <button className="btn-secondary" onClick={() => console.log('View details', workspace.tenderId)}>
          View Details
        </button>
      </div>
    </div>
  );
};

const ActiveWorkspaces = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');

  const workspaces = [
    {
      tenderId: 'TND-2024-001',
      title: 'Medical Equipment Supply - Government Hospital Network',
      deadline: '2024-12-30',
      team: 'Team Alpha',
      status: 'active',
      progress: 75
    },
    {
      tenderId: 'TND-2024-002',
      title: 'Surgical Instruments Procurement - State Medical Services',
      deadline: '2024-12-25',
      team: 'Team Beta',
      status: 'urgent',
      progress: 45
    },
    {
      tenderId: 'TND-2024-003',
      title: 'Diagnostic Devices & Laboratory Equipment Supply',
      deadline: '2025-01-15',
      team: 'Team Gamma',
      status: 'active',
      progress: 90
    },
    {
      tenderId: 'TND-2024-004',
      title: 'Cardiac Care Equipment - Multi-Hospital Tender',
      deadline: '2024-12-28',
      team: 'Team Alpha',
      status: 'review',
      progress: 60
    },
    {
      tenderId: 'TND-2024-005',
      title: 'Emergency Medical Supplies - Annual Contract',
      deadline: '2025-01-05',
      team: 'Team Delta',
      status: 'active',
      progress: 85
    },
    {
      tenderId: 'TND-2024-006',
      title: 'Orthopedic Implants & Instruments Supply',
      deadline: '2024-12-22',
      team: 'Team Beta',
      status: 'urgent',
      progress: 35
    }
  ];

  const filteredWorkspaces = workspaces.filter(ws => {
    const matchesSearch = ws.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ws.tenderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ws.status === statusFilter;
    const matchesTeam = teamFilter === 'all' || ws.team === teamFilter;
    return matchesSearch && matchesStatus && matchesTeam;
  });

  return (
    <div className="active-workspaces-page">
      <div className="page-header">
        <h1>Active Workspaces</h1>
        <p className="page-description">
          View and manage all ongoing tender workspaces. Track progress, deadlines, and team assignments in real-time.
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
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="urgent">Urgent</option>
            <option value="review">In Review</option>
          </select>
          <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)}>
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