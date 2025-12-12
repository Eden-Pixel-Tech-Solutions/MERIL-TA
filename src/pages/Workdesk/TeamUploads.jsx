// src/pages/Workdesk/TeamUploads.jsx
// Route: /workdesk/team-uploads

import React, { useState } from 'react';
import '../../assets/css/TeamUploads.css';

const WorkdeskCard = ({ upload }) => {
  return (
    <div className="upload-card">
      <div className="upload-header">
        <div className="uploader-info">
          <div className="avatar">{upload.uploader[0]}</div>
          <div>
            <h4 className="uploader-name">{upload.uploader}</h4>
            <p className="upload-time">{upload.timeAgo}</p>
          </div>
        </div>
        <span className={`department-badge ${upload.department.toLowerCase()}`}>
          {upload.department}
        </span>
      </div>
      <h3 className="upload-title">{upload.fileName}</h3>
      <div className="upload-details">
        <span className="detail-badge">
          <strong>Tender:</strong> {upload.tenderId}
        </span>
        <span className="detail-badge">
          <strong>Size:</strong> {upload.fileSize}
        </span>
        <span className="detail-badge">
          <strong>Type:</strong> {upload.fileType}
        </span>
      </div>
      <div className="upload-actions">
        <button className="btn-view" onClick={() => console.log('View', upload.fileName)}>
          View File
        </button>
        <button className="btn-download" onClick={() => console.log('Download', upload.fileName)}>
          Download
        </button>
        <button className="btn-approve" onClick={() => console.log('Approve', upload.fileName)}>
          Approve
        </button>
      </div>
    </div>
  );
};

const TeamUploads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const uploads = [
    {
      uploader: 'Rajesh Kumar',
      department: 'Finance',
      fileName: 'Financial Statement Q4 2024.pdf',
      tenderId: 'TND-2024-001',
      fileSize: '2.4 MB',
      fileType: 'PDF',
      timeAgo: '2 hours ago'
    },
    {
      uploader: 'Priya Sharma',
      department: 'Technical',
      fileName: 'Technical Specifications v3.docx',
      tenderId: 'TND-2024-002',
      fileSize: '1.8 MB',
      fileType: 'DOCX',
      timeAgo: '4 hours ago'
    },
    {
      uploader: 'Amit Patel',
      department: 'Documentation',
      fileName: 'Product Catalog 2024.pdf',
      tenderId: 'TND-2024-003',
      fileSize: '5.6 MB',
      fileType: 'PDF',
      timeAgo: '1 day ago'
    },
    {
      uploader: 'Sunita Reddy',
      department: 'Management',
      fileName: 'ISO 9001 Certificate.pdf',
      tenderId: 'TND-2024-001',
      fileSize: '850 KB',
      fileType: 'PDF',
      timeAgo: '1 day ago'
    },
    {
      uploader: 'Vikram Singh',
      department: 'Technical',
      fileName: 'Quality Assurance Plan.xlsx',
      tenderId: 'TND-2024-004',
      fileSize: '3.2 MB',
      fileType: 'XLSX',
      timeAgo: '2 days ago'
    },
    {
      uploader: 'Meera Krishnan',
      department: 'Finance',
      fileName: 'Tax Compliance Documents.zip',
      tenderId: 'TND-2024-002',
      fileSize: '4.1 MB',
      fileType: 'ZIP',
      timeAgo: '3 days ago'
    },
    {
      uploader: 'Arjun Desai',
      department: 'Technical',
      fileName: 'Installation Guide & Manual.pdf',
      tenderId: 'TND-2024-005',
      fileSize: '6.8 MB',
      fileType: 'PDF',
      timeAgo: '3 days ago'
    }
  ];

  const filteredUploads = uploads.filter(upload => {
    const matchesSearch = upload.fileName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          upload.uploader.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          upload.tenderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || upload.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="team-uploads-page">
      <div className="page-header">
        <h1>Team Uploads</h1>
        <p className="page-description">
          Monitor and manage document uploads from all departments. Review submissions from Finance, Technical, Documentation, and Management teams.
        </p>
      </div>

      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by file name, uploader, or tender ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
            <option value="all">All Departments</option>
            <option value="Finance">Finance</option>
            <option value="Technical">Technical</option>
            <option value="Documentation">Documentation</option>
            <option value="Management">Management</option>
          </select>
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

        <div className="uploads-grid">
    {filteredUploads.map((upload, index) => (
      <WorkdeskCard key={index} upload={upload} />
    ))}
  </div>

  {filteredUploads.length === 0 && (
    <div className="no-results">
      <p>No uploads found matching your filters.</p>
    </div>
  )}
</div>
);
};
export default TeamUploads;

