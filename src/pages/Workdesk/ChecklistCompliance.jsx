// src/pages/Workdesk/ChecklistCompliance.jsx
// Route: /workdesk/checklist-compliance

import React, { useState } from 'react';
import '../../assets/css/ChecklistCompliance.css';

const WorkdeskCard = ({ tender }) => {
  const totalItems = tender.checklistItems.length;
  const completedItems = tender.checklistItems.filter(item => item.completed).length;
  const complianceScore = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="compliance-card">
      <div className="compliance-header">
        <div>
          <h3 className="tender-id">{tender.tenderId}</h3>
          <p className="tender-title">{tender.title}</p>
        </div>
        <div className="compliance-score">
          <div className={`score-circle ${complianceScore === 100 ? 'complete' : complianceScore >= 70 ? 'good' : 'warning'}`}>
            <span className="score-value">{complianceScore}%</span>
          </div>
          <p className="score-label">Compliance</p>
        </div>
      </div>
      <div className="checklist-items">
        {tender.checklistItems.map((item, index) => (
          <div key={index} className="checklist-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => console.log('Toggle', item.name)}
              />
              <span className="checkbox-custom"></span>
              <span className={`item-name ${item.completed ? 'completed' : ''}`}>
                {item.name}
              </span>
            </label>
            <span className={`item-status ${item.status}`}>{item.statusText}</span>
          </div>
        ))}
      </div>
      <div className="compliance-actions">
        <button className="btn-view" onClick={() => console.log('View details', tender.tenderId)}>
          View Details
        </button>
        <button className="btn-report" onClick={() => console.log('Generate report', tender.tenderId)}>
          Generate Report
        </button>
      </div>
    </div>
  );
};

const ChecklistCompliance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const tenders = [
    {
      tenderId: 'TND-2024-001',
      title: 'Medical Equipment Supply',
      checklistItems: [
        { name: 'Technical specifications submitted', completed: true, status: 'verified', statusText: 'Verified' },
        { name: 'Financial documents uploaded', completed: true, status: 'verified', statusText: 'Verified' },
        { name: 'Quality certificates provided', completed: true, status: 'verified', statusText: 'Verified' },
        { name: 'Delivery timeline confirmed', completed: false, status: 'pending', statusText: 'Pending' },
        { name: 'Pricing breakdown approved', completed: true, status: 'verified', statusText: 'Verified' }
      ]
    },
    {
      tenderId: 'TND-2024-002',
      title: 'Surgical Instruments Procurement',
      checklistItems: [
        { name: 'Product catalog submitted', completed: true, status: 'verified', statusText: 'Verified' },
        { name: 'ISO certification uploaded', completed: false, status: 'missing', statusText: 'Missing' },
        { name: 'Tax clearance certificate', completed: false, status: 'missing', statusText: 'Missing' },
        { name: 'Warranty terms documented', completed: true, status: 'verified', statusText: 'Verified' },
        { name: 'Installation plan provided', completed: false, status: 'pending', statusText: 'Pending' }
      ]
    },
    {
      tenderId: 'TND-2024-003',
      title: 'Diagnostic Devices Supply',
      checklistItems: [
        { name: 'Technical specifications submitted', completed: true, status: 'verified', statusText: 'Verified' },
        { name: 'Financial compliance verified', completed: true, status: 'verified', statusText: 'Verified' },
        { name: 'Quality assurance plan', completed: true, status: 'verified', statusText: 'Verified' },
        { name: 'Training materials provided', completed: true, status: 'verified', statusText: 'Verified' },
        { name: 'Support contract signed', completed: true, status: 'verified', statusText: 'Verified' }
      ]
    },
    {
      tenderId: 'TND-2024-004',
      title: 'Cardiac Care Equipment',
      checklistItems: [
        { name: 'Product specifications approved', completed: true, status: 'verified', statusText: 'Verified' },
        { name: 'Financial documents complete', completed: true, status: 'verified', statusText: 'Verified' },
        { name: 'Regulatory approvals obtained', completed: false, status: 'pending', statusText: 'Pending' },
        { name: 'Maintenance plan submitted', completed: false, status: 'missing', statusText: 'Missing' },
        { name: 'Delivery schedule confirmed', completed: true, status: 'verified', statusText: 'Verified' }
      ]
    },
    {
      tenderId: 'TND-2024-005',
      title: 'Emergency Medical Supplies',
      checklistItems: [
        { name: 'Product list verified', completed: true, status: 'verified', statusText: 'Verified' },
        { name: 'Pricing approved', completed: true, status: 'verified', statusText: 'Verified' },
        { name: 'Storage requirements documented', completed: false, status: 'pending', statusText: 'Pending' },
        { name: 'Quality certificates uploaded', completed: true, status: 'verified', statusText: 'Verified' },
        { name: 'Distribution plan finalized', completed: false, status: 'pending', statusText: 'Pending' }
      ]
    }
  ];

  const filteredTenders = tenders.filter(tender => {
    const matchesSearch = tender.tenderId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tender.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    
    const completedItems = tender.checklistItems.filter(item => item.completed).length;
    const complianceScore = (completedItems / tender.checklistItems.length) * 100;
    
    if (statusFilter === 'complete' && complianceScore === 100) return matchesSearch;
    if (statusFilter === 'incomplete' && complianceScore < 100) return matchesSearch;
    
    return false;
  });

  return (
    <div className="checklist-compliance-page">
      <div className="page-header">
        <h1>Checklist & Compliance</h1>
        <p className="page-description">
          Monitor compliance status for all tender submissions. Track completion of required checklist items and ensure regulatory requirements are met.
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
            <option value="complete">100% Complete</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>
      </div>

      <div className="compliance-grid">
        {filteredTenders.map((tender, index) => (
          <WorkdeskCard key={index} tender={tender} />
        ))}
      </div>

      {filteredTenders.length === 0 && (
        <div className="no-results">
          <p>No tenders found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

export default ChecklistCompliance;