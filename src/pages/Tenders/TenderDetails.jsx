// src/pages/Tenders/TenderDetails.jsx
// Route: /tenders/tenderdetails/:id

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../../assets/css/TenderDetails.css';

// Integration tip: in TendersPage.jsx wrap each tender row with Link to `/tenders/tenderdetails/${tender.id}`
// e.g. <Link to={`/tenders/tenderdetails/${tender.id}`}> ...row content... </Link>

const TenderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy tender data
  const tenders = [
    {
      id: 'T111',
      name: 'Supply of Cardiac Stents and Surgical Equipment',
      tenderId: 'TN2024-CARD-001',
      state: 'Tamil Nadu',
      referenceNumber: 'REF/TNMSC/2024/12345',
      description: 'Procurement of high-quality cardiac stents, surgical sutures, and related cardiovascular equipment for government hospitals across Tamil Nadu. The tender includes delivery, installation, and training requirements.',
      totalQuantity: '5000 units',
      type: 'Medical Equipment',
      category: 'Cardiovascular',
      department: 'Tamil Nadu Medical Services Corporation',
      location: 'Chennai, Tamil Nadu',
      emdValue: '₹2,50,000',
      estimatedCost: '₹1,25,00,000',
      lastDate: '2025-01-15',
      openingDate: '2025-01-16',
      preBidDate: '2024-12-20',
      authority: 'TNMSC',
      documents: [
        { name: 'Notice Inviting Tender (NIT).pdf', size: '2.3 MB' },
        { name: 'Bill of Quantities (BOQ).xlsx', size: '856 KB' },
        { name: 'Technical Specifications.pdf', size: '4.1 MB' },
        { name: 'Terms and Conditions.pdf', size: '1.2 MB' }
      ],
      requiredDocs: [
        'Company Registration Certificate',
        'GST Registration Certificate',
        'Technical Bid Document',
        'Financial Bid Document',
        'Experience Certificate (Last 3 Years)',
        'ISO Certification',
        'Product Sample Declaration'
      ],
      eligibility: [
        'Minimum annual turnover of ₹50 lakhs in the last 3 financial years',
        'At least 2 years of experience in medical equipment supply',
        'Valid manufacturing license or authorized distributor certificate',
        'ISO 13485 certification for medical devices',
        'No blacklisting by any government organization'
      ]
    },
    {
      id: '2',
      name: 'Orthopedic Implants and Instruments',
      tenderId: 'TN2024-ORTH-002',
      state: 'Karnataka',
      referenceNumber: 'REF/KMSCL/2024/67890',
      description: 'Supply of orthopedic implants including hip and knee replacements, bone screws, plates, and surgical instruments for district hospitals.',
      totalQuantity: '3000 units',
      type: 'Medical Equipment',
      category: 'Orthopedics',
      department: 'Karnataka Medical Supplies Corporation',
      location: 'Bangalore, Karnataka',
      emdValue: '₹1,80,000',
      estimatedCost: '₹90,00,000',
      lastDate: '2025-01-10',
      openingDate: '2025-01-11',
      preBidDate: '2024-12-18',
      authority: 'KMSCL',
      documents: [
        { name: 'Tender Notice.pdf', size: '1.8 MB' },
        { name: 'BOQ.xlsx', size: '642 KB' },
        { name: 'Product Specifications.pdf', size: '3.5 MB' }
      ],
      requiredDocs: [
        'Company Registration Certificate',
        'GST Certificate',
        'Technical Bid',
        'Financial Bid',
        'Experience Proof'
      ],
      eligibility: [
        'Minimum turnover of ₹40 lakhs',
        'Experience in orthopedic supplies',
        'Valid certifications'
      ]
    }
  ];

  const tender = tenders.find(t => t.id === id);

  const [isInterested, setIsInterested] = useState(false);
  const [tenderStatus, setTenderStatus] = useState('Not Set');
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [reminderData, setReminderData] = useState({ date: '', time: '', notes: '' });
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  if (!tender) {
    return (
      <div className="tender-not-found">
        <div className="not-found-content">
          <h2>Tender Not Found</h2>
          <p>The tender you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/tenders')} className="btn-back">
            ← Back to Tenders
          </button>
        </div>
      </div>
    );
  }

  const calculateDaysLeft = (dateString) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysLeft = calculateDaysLeft(tender.lastDate);

  const handleInterestToggle = () => {
    const newState = !isInterested;
    setIsInterested(newState);
    console.log('toggle interested', id, newState);
  };

  const handleReminderSave = () => {
    console.log('Reminder saved:', { tenderId: id, ...reminderData });
    setToastMessage('Reminder set successfully!');
    setShowToast(true);
    setShowReminderModal(false);
    setReminderData({ date: '', time: '', notes: '' });
  };

  const handleStatusChange = (status) => {
    setTenderStatus(status);
    setShowStatusMenu(false);
    setToastMessage(`Status changed to: ${status}`);
    setShowToast(true);
    console.log('Status changed:', { tenderId: id, status });
  };

  const handleDocumentDownload = (docName) => {
    console.log('Download document:', docName);
  };

  const handleDownloadAll = () => {
    console.log('Download all documents:', tender.documents.map(d => d.name));
    setToastMessage('Downloading all documents...');
    setShowToast(true);
  };

  const handleDocUpload = (docName) => {
    console.log('Upload document:', docName);
    setUploadedDocs(prev => ({ ...prev, [docName]: true }));
  };

  const handleMarkAllReady = () => {
    const allDocs = {};
    tender.requiredDocs.forEach(doc => {
      allDocs[doc] = true;
    });
    setUploadedDocs(allDocs);
    setToastMessage('All documents marked as ready!');
    setShowToast(true);
  };

  const handleCheckEligibility = () => {
    console.log('Checking eligibility for tender:', id);
    setToastMessage('Eligibility check: All criteria met ✓');
    setShowToast(true);
  };

  const handleQuickAction = (action) => {
    console.log('Quick action:', action);
    setToastMessage(`Action: ${action}`);
    setShowToast(true);
  };

  return (
    <div className="tender-details-page">
      {/* Header */}
      <div className="tender-header">
        <div className="header-left">
          <button onClick={() => navigate(-1)} className="btn-back" aria-label="Go back to tenders list">
            ← Back
          </button>
          <div className="header-title">
            <h1>Tender Details</h1>
            <p className="tender-subtitle">{tender.name}</p>
          </div>
        </div>
      
      </div>

      {/* Main Content */}
      <div className="tender-content">
        <div className="main-column">
          {/* General Details */}
          <div className="card">
            <h2>General Details</h2>
            <div className="details-grid">
              <div className="detail-item">
                <label>Tender ID</label>
                <span>{tender.tenderId}</span>
              </div>
              <div className="detail-item">
                <label>State</label>
                <span>{tender.state}</span>
              </div>
              <div className="detail-item">
                <label>Reference Number</label>
                <span>{tender.referenceNumber}</span>
              </div>
              <div className="detail-item">
                <label>Type / Category</label>
                <span>{tender.type} / {tender.category}</span>
              </div>
              <div className="detail-item full-width">
                <label>Description</label>
                <span>{tender.description}</span>
              </div>
              <div className="detail-item">
                <label>Total Quantity</label>
                <span>{tender.totalQuantity}</span>
              </div>
              <div className="detail-item">
                <label>Department</label>
                <span>{tender.department}</span>
              </div>
              <div className="detail-item">
                <label>Location</label>
                <span>{tender.location}</span>
              </div>
            </div>
          </div>

          {/* Key Dates & Values */}
          <div className="card">
            <h2>Key Dates & Values</h2>
            <div className="key-info-grid">
              <div className="key-section">
                <h3>Key Values</h3>
                <div className="key-items">
                  <div className="key-item">
                    <label>EMD Value</label>
                    <span className="value">{tender.emdValue}</span>
                  </div>
                  <div className="key-item">
                    <label>Estimated Cost</label>
                    <span className="value highlight">{tender.estimatedCost}</span>
                  </div>
                </div>
              </div>
              <div className="key-section">
                <h3>Key Dates</h3>
                <div className="key-items">
                  <div className="key-item">
                    <label>Pre-bid Meeting</label>
                    <span className="value">{new Date(tender.preBidDate).toLocaleDateString('en-GB')}</span>
                  </div>
                  <div className="key-item">
                    <label>Last Date for Submission</label>
                    <span className="value">{new Date(tender.lastDate).toLocaleDateString('en-GB')}</span>
                  </div>
                  <div className="key-item">
                    <label>Opening Date</label>
                    <span className="value">{new Date(tender.openingDate).toLocaleDateString('en-GB')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Suggested Products */}
          <div className="card">
            <h2>Suggested Products</h2>
            <div className="suggested-products">
              <ul>
                <li>Recommend <strong>Meril Sutures V3</strong> for cardiovascular procedures — quantity estimate based on tender value and typical usage patterns.</li>
                <li>Consider <strong>Premium Cardiac Stents</strong> with drug-eluting coating for improved patient outcomes.</li>
                <li>Include <strong>Surgical Kit Bundle</strong> containing essential instruments for complete cardiovascular procedures.</li>
              </ul>
              <div className="product-actions">
                <button className="btn-primary" onClick={() => handleQuickAction('Add to Catalog')}>
                  Add to Catalog
                </button>
                <Link to="#" className="link-secondary">View Product Suggestions →</Link>
              </div>
            </div>
          </div>

          {/* Tender Documents */}
          <div className="card">
            <h2>Tender Documents</h2>
            <div className="documents-list" role="table" aria-label="Tender documents">
              {tender.documents.map((doc, index) => (
                <div key={index} className="document-item" role="row">
                  <span className="doc-icon" aria-hidden="true">📄</span>
                  <div className="doc-info">
                    <span className="doc-name">{doc.name}</span>
                    <span className="doc-size">{doc.size}</span>
                  </div>
                  <div className="doc-actions">
                    <button
                      onClick={() => handleDocumentDownload(doc.name)}
                      className="btn-link"
                      aria-label={`Download ${doc.name}`}
                    >
                      Download
                    </button>
                    <button
                      onClick={() => window.open('#', '_blank')}
                      className="btn-link"
                      aria-label={`View ${doc.name}`}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-secondary" onClick={handleDownloadAll}>
              Download All Documents
            </button>
          </div>

          {/* Documents Required */}
          <div className="card">
            <h2>Documents Required to Participate</h2>
            <div className="required-docs-list">
              {tender.requiredDocs.map((doc, index) => (
                <div key={index} className="required-doc-item">
                  <input
                    type="checkbox"
                    id={`doc-${index}`}
                    checked={uploadedDocs[doc] || false}
                    onChange={() => setUploadedDocs(prev => ({ ...prev, [doc]: !prev[doc] }))}
                    aria-label={`Mark ${doc} as ready`}
                  />
                  <label htmlFor={`doc-${index}`}>{doc}</label>
                  <button
                    className="btn-upload"
                    onClick={() => handleDocUpload(doc)}
                    aria-label={`Upload ${doc}`}
                  >
                    Upload
                  </button>
                </div>
              ))}
            </div>
            <button className="btn-secondary" onClick={handleMarkAllReady}>
              Mark All Ready
            </button>
          </div>

          {/* Eligibility Criteria */}
          <div className="card">
            <h2>Eligibility Criteria</h2>
            <ul className="eligibility-list">
              {tender.eligibility.map((criterion, index) => (
                <li key={index}>{criterion}</li>
              ))}
            </ul>
            <button className="btn-secondary" onClick={handleCheckEligibility}>
              Check Eligibility
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-title">TENDER FEATURES</h3>
            <div className="sidebar-actions">
              <button
                className={`sidebar-action ${isInterested ? 'active' : ''}`}
                onClick={handleInterestToggle}
              >
                <span className="icon">{isInterested ? '❤️' : '🤍'}</span>
                <span>Interested</span>
              </button>
              <button className="sidebar-action" onClick={() => setShowReminderModal(true)}>
                <span className="icon">🔔</span>
                <span>Set Reminder</span>
              </button>
              <button className="sidebar-action" onClick={() => handleQuickAction('Download NIT')}>
                <span className="icon">📥</span>
                <span>Download NIT</span>
              </button>
              <button className="sidebar-action" onClick={() => handleQuickAction('View BOQ')}>
                <span className="icon">📊</span>
                <span>View BOQ</span>
              </button>
              <button className="sidebar-action" onClick={() => handleQuickAction('Share')}>
                <span className="icon">🔗</span>
                <span>Share</span>
              </button>
            </div>
            <div className="sidebar-summary">
              <div className="summary-item">
                <label>Estimated Cost</label>
                <span className="value">{tender.estimatedCost}</span>
              </div>
              <div className="summary-item">
                <label>Days Left</label>
                <span className="value days">{daysLeft} days</span>
              </div>
              <div className="summary-item">
                <label>Tender Authority</label>
                <span className="value">{tender.authority}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="modal-overlay" onClick={() => setShowReminderModal(false)}>
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-labelledby="reminder-modal-title"
            aria-modal="true"
          >
            <h3 id="reminder-modal-title">Set Reminder</h3>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="reminder-date">Date</label>
                <input
                  type="date"
                  id="reminder-date"
                  value={reminderData.date}
                  onChange={e => setReminderData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="reminder-time">Time</label>
                <input
                  type="time"
                  id="reminder-time"
                  value={reminderData.time}
                  onChange={e => setReminderData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="reminder-notes">Notes</label>
                <textarea
                  id="reminder-notes"
                  rows="3"
                  value={reminderData.notes}
                  onChange={e => setReminderData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes..."
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowReminderModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleReminderSave}>
                Save Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="toast" role="alert" aria-live="polite">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default TenderDetails;