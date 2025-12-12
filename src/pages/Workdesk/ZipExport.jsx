// src/pages/Workdesk/ZipExport.jsx
// Route: /workdesk/zip-export

import React, { useMemo, useState } from 'react';
import '../../assets/css/ZipExport.css';

const WorkdeskCard = ({ tender }) => {
  const allComponentsReady = tender.components.every((c) => c.status === 'ready');

  return (
    <div className="export-card" role="region" aria-labelledby={`${tender.tenderId}-title`}>
      <div className="export-header">
        <div>
          <h3 id={`${tender.tenderId}-title`} className="tender-id">
            {tender.tenderId}
          </h3>
          <p className="tender-title">{tender.title}</p>
        </div>

        <span
          className={`ready-badge ${allComponentsReady ? 'ready' : 'not-ready'}`}
          aria-live="polite"
        >
          {allComponentsReady ? 'Ready to Export' : 'Incomplete'}
        </span>
      </div>

      <div className="components-list">
        {tender.components.map((component, index) => (
          <div key={index} className="component-item">
            <div className="component-info">
              <span className={`status-icon ${component.status}`} aria-hidden>
                {component.status === 'ready' ? '✓' : '⚠'}
              </span>
              <span className="component-name">{component.name}</span>
            </div>

            <div className="component-meta">
              <span className="file-count">{component.fileCount} files</span>
              <span className="file-size">{component.size}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="export-summary">
        <div className="summary-item">
          <span className="summary-label">Total Files:</span>
          <span className="summary-value">{tender.totalFiles}</span>
        </div>

        <div className="summary-item">
          <span className="summary-label">Total Size:</span>
          <span className="summary-value">{tender.totalSize}</span>
        </div>

        <div className="summary-item">
          <span className="summary-label">Last Updated:</span>
          <span className="summary-value">{tender.lastUpdated}</span>
        </div>
      </div>

      <div className="export-actions">
        <button
          className="btn-validate"
          onClick={() => console.log('Validate', tender.tenderId)}
          type="button"
        >
          Validate Submission
        </button>

        <button
          className={`btn-export ${!allComponentsReady ? 'disabled' : ''}`}
          onClick={() => console.log('Export', tender.tenderId)}
          disabled={!allComponentsReady}
          aria-disabled={!allComponentsReady}
          type="button"
        >
          Generate ZIP
        </button>
      </div>
    </div>
  );
};

const ZipExport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const tenders = useMemo(
    () => [
      {
        tenderId: 'TND-2024-001',
        title: 'Medical Equipment Supply',
        totalFiles: 24,
        totalSize: '45.2 MB',
        lastUpdated: '2 hours ago',
        components: [
          { name: 'Technical Documents', fileCount: 8, size: '12.4 MB', status: 'ready' },
          { name: 'Financial Documents', fileCount: 6, size: '8.6 MB', status: 'ready' },
          { name: 'Compliance Certificates', fileCount: 5, size: '15.2 MB', status: 'ready' },
          { name: 'Product Specifications', fileCount: 5, size: '9.0 MB', status: 'ready' }
        ]
      },
      {
        tenderId: 'TND-2024-002',
        title: 'Surgical Instruments Procurement',
        totalFiles: 18,
        totalSize: '32.8 MB',
        lastUpdated: '5 hours ago',
        components: [
          { name: 'Technical Documents', fileCount: 6, size: '10.2 MB', status: 'ready' },
          { name: 'Financial Documents', fileCount: 4, size: '6.4 MB', status: 'pending' },
          { name: 'Compliance Certificates', fileCount: 3, size: '8.8 MB', status: 'pending' },
          { name: 'Product Specifications', fileCount: 5, size: '7.4 MB', status: 'ready' }
        ]
      },
      {
        tenderId: 'TND-2024-003',
        title: 'Diagnostic Devices Supply',
        totalFiles: 32,
        totalSize: '68.5 MB',
        lastUpdated: '1 day ago',
        components: [
          { name: 'Technical Documents', fileCount: 12, size: '22.3 MB', status: 'ready' },
          { name: 'Financial Documents', fileCount: 8, size: '14.6 MB', status: 'ready' },
          { name: 'Compliance Certificates', fileCount: 7, size: '18.4 MB', status: 'ready' },
          { name: 'Product Specifications', fileCount: 5, size: '13.2 MB', status: 'ready' }
        ]
      },
      {
        tenderId: 'TND-2024-004',
        title: 'Cardiac Care Equipment',
        totalFiles: 21,
        totalSize: '41.7 MB',
        lastUpdated: '1 day ago',
        components: [
          { name: 'Technical Documents', fileCount: 7, size: '14.2 MB', status: 'ready' },
          { name: 'Financial Documents', fileCount: 5, size: '9.3 MB', status: 'ready' },
          { name: 'Compliance Certificates', fileCount: 4, size: '10.6 MB', status: 'pending' },
          { name: 'Product Specifications', fileCount: 5, size: '7.6 MB', status: 'ready' }
        ]
      },
      {
        tenderId: 'TND-2024-005',
        title: 'Emergency Medical Supplies',
        totalFiles: 16,
        totalSize: '28.4 MB',
        lastUpdated: '2 days ago',
        components: [
          { name: 'Technical Documents', fileCount: 5, size: '8.7 MB', status: 'ready' },
          { name: 'Financial Documents', fileCount: 4, size: '6.2 MB', status: 'pending' },
          { name: 'Compliance Certificates', fileCount: 3, size: '7.1 MB', status: 'ready' },
          { name: 'Product Specifications', fileCount: 4, size: '6.4 MB', status: 'ready' }
        ]
      }
    ],
    []
  );

  const filteredTenders = useMemo(() => {
    const searchLower = searchTerm.trim().toLowerCase();

    return tenders.filter((tender) => {
      const matchesSearch =
        tender.tenderId.toLowerCase().includes(searchLower) ||
        tender.title.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      if (statusFilter === 'all') return true;

      const allReady = tender.components.every((c) => c.status === 'ready');

      if (statusFilter === 'ready') return allReady;
      if (statusFilter === 'incomplete') return !allReady;

      return true;
    });
  }, [tenders, searchTerm, statusFilter]);

  return (
    <div className="zip-export-page">
      <div className="page-header">
        <h1>Final ZIP Export</h1>
        <p className="page-description">
          Validate and export complete tender submissions. Generate ZIP archives containing all
          required documents for final submission.
        </p>
      </div>

      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by tender ID or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search tenders"
          />
        </div>

        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter tenders by status"
          >
            <option value="all">All Tenders</option>
            <option value="ready">Ready to Export</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>
      </div>

      <div className="export-grid">
        {filteredTenders.map((tender) => (
          <WorkdeskCard key={tender.tenderId} tender={tender} />
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

export default ZipExport;
