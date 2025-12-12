// src/pages/Workdesk/PendingDocuments.jsx
// Route: /workdesk/pending-documents

import React, { useState } from 'react';
import '../../assets/css/PendingDocuments.css';

const WorkdeskCard = ({ document }) => {
  return (
    <div className="document-card">
      <div className="document-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" />
          <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
      <div className="document-content">
        <h3 className="document-name">{document.name}</h3>
        <div className="document-meta">
          <span className="meta-item">
            <strong>Department:</strong> {document.department}
          </span>
          <span className="meta-item">
            <strong>Tender:</strong> {document.tenderId}
          </span>
          <span className="meta-item">
            <strong>Due:</strong> {document.dueDate}
          </span>
        </div>
        <div className="document-status">
          <span className={`status-indicator ${document.status}`}></span>
          <span className="status-text">{document.statusText}</span>
        </div>
      </div>
      <div className="document-actions">
        <button className="btn-upload" onClick={() => console.log('Upload', document.name)}>
          Upload Document
        </button>
        <button className="btn-info" onClick={() => console.log('Info', document.name)}>
          More Info
        </button>
      </div>
    </div>
  );
};

const PendingDocuments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const documents = [
    {
      name: 'Technical Specification Document',
      department: 'Technical',
      tenderId: 'TND-2024-001',
      dueDate: '2024-12-20',
      status: 'missing',
      statusText: 'Missing'
    },
    {
      name: 'Financial Compliance Certificate',
      department: 'Finance',
      tenderId: 'TND-2024-002',
      dueDate: '2024-12-18',
      status: 'incomplete',
      statusText: 'Incomplete'
    },
    {
      name: 'Quality Assurance Plan',
      department: 'Technical',
      tenderId: 'TND-2024-003',
      dueDate: '2024-12-22',
      status: 'missing',
      statusText: 'Missing'
    },
    {
      name: 'Tax Clearance Certificate',
      department: 'Finance',
      tenderId: 'TND-2024-001',
      dueDate: '2024-12-19',
      status: 'pending-review',
      statusText: 'Pending Review'
    },
    {
      name: 'Product Catalog & Brochures',
      department: 'Documentation',
      tenderId: 'TND-2024-004',
      dueDate: '2024-12-25',
      status: 'incomplete',
      statusText: 'Incomplete'
    },
    {
      name: 'ISO Certification Copy',
      department: 'Management',
      tenderId: 'TND-2024-002',
      dueDate: '2024-12-21',
      status: 'missing',
      statusText: 'Missing'
    },
    {
      name: 'Delivery Timeline Proposal',
      department: 'Technical',
      tenderId: 'TND-2024-005',
      dueDate: '2024-12-23',
      status: 'incomplete',
      statusText: 'Incomplete'
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.tenderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || doc.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <div className="pending-documents-page">
      <div className="page-header">
        <h1>Pending Documents</h1>
        <p className="page-description">
          Track and upload missing or incomplete tender documents. Ensure all required documentation is submitted before deadlines.
        </p>
      </div>

      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search documents or tender ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
            <option value="all">All Departments</option>
            <option value="Technical">Technical</option>
            <option value="Finance">Finance</option>
            <option value="Documentation">Documentation</option>
            <option value="Management">Management</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="missing">Missing</option>
            <option value="incomplete">Incomplete</option>
            <option value="pending-review">Pending Review</option>
          </select>
        </div>
      </div>

      <div className="documents-list">
        {filteredDocuments.map((document, index) => (
          <WorkdeskCard key={index} document={document} />
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="no-results">
          <p>No pending documents found.</p>
        </div>
      )}
    </div>
  );
};

export default PendingDocuments;