import React, { useState } from 'react';
import '../../assets/css/TenderDetails.css';

const TenderDetails = () => {
  // Accordion states
  const [expandedSections, setExpandedSections] = useState({
    tenderDetails: true,
    keyValues: false,
    keyDates: false,
    eligibility: false,
    products: false,
    documents: false,
    requiredDocs: false
  });

  // Modal states
  const [showChangeProductModal, setShowChangeProductModal] = useState(false);
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Feature button states
  const [isInterested, setIsInterested] = useState(false);

  // Form states
  const [selectedProducts, setSelectedProducts] = useState([
    { id: 1, oldProduct: 'TMT Bars', newProduct: 'TMT Bars' },
    { id: 2, oldProduct: 'Cement', newProduct: 'Cement' },
    { id: 3, oldProduct: 'Sand', newProduct: 'Sand' }
  ]);

  const [documentName, setDocumentName] = useState('');
  const [department, setDepartment] = useState('');

  // Dummy data
  const tenderData = {
    id: 'T111',
    status: 'N/A',
    referenceNo: '12435',
    authority: 'Greater Hyderabad Municipal Corporation',
    brief: 'Construction Of 6 Lane Bi Directions Flyover Crossing Tkr College Junction, Gayathri Nagar Junction And Mandallammu Junction.'
  };

  const productsList = [
    'TMT Bars', 'Cement', 'Sand', 'Aggregates', 'Steel Pipes', 'Paint', 'Wood', 'Bricks', 'Tiles', 'Glass'
  ];

  const departments = [
    'Civil Engineering', 'Electrical', 'Mechanical', 'Architecture', 'Finance', 'Administration'
  ];

  const documents = [
    { name: 'NIT', link: '#' },
    { name: 'Technical Specifications', link: '#' },
    { name: 'Financial Bid Format', link: '#' },
    { name: 'Terms & Conditions', link: '#' }
  ];

  const eligibilityCriteria = [
    'The bidder should have completed similar works in last 5 years',
    'Minimum annual turnover of Rs. 50 Crores in last 3 financial years',
    'Valid contractor license and registration',
    'GST registration certificate',
    'Experience in flyover construction projects'
  ];

  // Toggle accordion sections
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle Proceed button
  const handleProceed = () => {
    setNotificationMessage('Products confirmed successfully');
    setShowSuccessNotification(true);
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 3000);
  };

  // Handle product change in modal
  const handleProductChange = (id, newProduct) => {
    setSelectedProducts(prev =>
      prev.map(p => p.id === id ? { ...p, newProduct } : p)
    );
  };

  // Save product changes
  const saveProductChanges = () => {
    setShowChangeProductModal(false);
    setNotificationMessage('Products updated successfully');
    setShowSuccessNotification(true);
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 3000);
  };

  // Handle document submission
  const handleAddDocument = () => {
    if (documentName && department) {
      setShowAddDocumentModal(false);
      setNotificationMessage('Document added successfully');
      setShowSuccessNotification(true);
      setDocumentName('');
      setDepartment('');
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);
    }
  };

  return (
    <div className="tender-details-container">
      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="success-notification">
          <span className="success-icon">✓</span>
          {notificationMessage}
        </div>
      )}

      

      <div className="content-wrapper">
        {/* Left Content */}
        <div className="left-content">
          
          {/* Tender Details Section */}
          <div className="accordion-section">
            <div 
              className="accordion-header"
              onClick={() => toggleSection('tenderDetails')}
            >
              <h2>Tender Details</h2>
              <span className={`arrow ${expandedSections.tenderDetails ? 'expanded' : ''}`}>
                ^
              </span>
            </div>
            {expandedSections.tenderDetails && (
              <div className="accordion-content">
                <div className="details-grid-horizontal">
                  <div className="detail-item-left">
                    <label>Tender ID</label>
                    <p>{tenderData.id}</p>
                  </div>
                  <div className="detail-item-left">
                    <label>Tender Status</label>
                    <p>{tenderData.status}</p>
                  </div>
                  <div className="detail-item-left">
                    <label>Reference No.</label>
                    <p>{tenderData.referenceNo || '-'}</p>
                  </div>
                  <div className="detail-item-left">
                    <label>Tender Authority</label>
                    <p>{tenderData.authority}</p>
                  </div>
                </div>
                <div className="detail-item-full">
                  <label>Website</label>
                  <p>Please Refer Tender Documents</p>
                </div>
                <div className="detail-item-full">
                  <label>Brief</label>
                  <p>{tenderData.brief}</p>
                </div>
              </div>
            )}
          </div>

          {/* Key Values Section */}
          <div className="accordion-section">
            <div 
              className="accordion-header"
              onClick={() => toggleSection('keyValues')}
            >
              <h2>Key Values *</h2>
              <span className={`arrow ${expandedSections.keyValues ? 'expanded' : ''}`}>
                ^
              </span>
            </div>
            {expandedSections.keyValues && (
              <div className="accordion-content">
                <div className="key-values-row">
                  <div className="detail-item-left">
                    <label>Document Fees</label>
                    <p>Refer Document</p>
                  </div>
                  <div className="detail-item-left">
                    <label>Earnest Money Deposit (EMD)</label>
                    <p>Refer Document</p>
                  </div>
                  <div className="detail-item-left">
                    <label>Estimated Cost</label>
                    <p>₹ 418.00 CR.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Key Dates Section */}
          <div className="accordion-section">
            <div 
              className="accordion-header"
              onClick={() => toggleSection('keyDates')}
            >
              <h2>Key Dates *</h2>
              <span className={`arrow ${expandedSections.keyDates ? 'expanded' : ''}`}>
                ^
              </span>
            </div>
            {expandedSections.keyDates && (
              <div className="accordion-content">
                <div className="details-grid-horizontal">
                  <div className="detail-item-left">
                    <label>Start Date Of Document Collection</label>
                    <p>Refer Document</p>
                  </div>
                  <div className="detail-item-left">
                    <label>Last Date For Submission</label>
                    <p>20-12-2025</p>
                  </div>
                  <div className="detail-item-left">
                    <label>Opening Date</label>
                    <p>20-12-2025</p>
                  </div>
                  <div className="detail-item-left">
                    <label>Pre Bid Date</label>
                    <p>Refer Document</p>
                  </div>
                </div>
                <div className="disclaimer">
                  *The Estimated Cost Value & Dates Are Indicative Only. Please Read Tender Document For Accurate Information.
                </div>
              </div>
            )}
          </div>

          {/* Eligibility Criteria Section */}
          <div className="accordion-section">
            <div 
              className="accordion-header"
              onClick={() => toggleSection('eligibility')}
            >
              <h2>Eligibility Criteria</h2>
              <span className={`arrow ${expandedSections.eligibility ? 'expanded' : ''}`}>
                ^
              </span>
            </div>
            {expandedSections.eligibility && (
              <div className="accordion-content">
                <ul className="eligibility-list">
                  {eligibilityCriteria.map((criteria, index) => (
                    <li key={index}>{criteria}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Suggested Products Section */}
          <div className="accordion-section">
            <div 
              className="accordion-header"
              onClick={() => toggleSection('products')}
            >
              <h2>Suggested Products</h2>
              <span className={`arrow ${expandedSections.products ? 'expanded' : ''}`}>
                ^
              </span>
            </div>
            {expandedSections.products && (
              <div className="accordion-content">
                <ul className="products-list">
                  {selectedProducts.map(product => (
                    <li key={product.id}>{product.newProduct}</li>
                  ))}
                </ul>
                <div className="products-actions-bottom">
                  <button className="btn-proceed" onClick={handleProceed}>
                    Proceed
                  </button>
                  <button 
                    className="btn-change" 
                    onClick={() => setShowChangeProductModal(true)}
                  >
                    Change Product
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tender Documents Section */}
          <div className="accordion-section">
            <div 
              className="accordion-header"
              onClick={() => toggleSection('documents')}
            >
              <h2>Tender Document</h2>
              <span className={`arrow ${expandedSections.documents ? 'expanded' : ''}`}>
                ^
              </span>
            </div>
            {expandedSections.documents && (
              <div className="accordion-content">
                <div className="documents-list">
                  {documents.map((doc, index) => (
                    <div key={index} className="document-row">
                      <span>{doc.name}</span>
                      <button className="btn-download">Download</button>
                    </div>
                  ))}
                </div>
                <a href="#" className="download-all-link">
                  Click Here (Download All Tender Documents)
                </a>
              </div>
            )}
          </div>

          {/* Required Documents Section */}
          <div className="accordion-section">
            <div 
              className="accordion-header"
              onClick={() => toggleSection('requiredDocs')}
            >
              <h2>Required Documents To Participate</h2>
              <span className={`arrow ${expandedSections.requiredDocs ? 'expanded' : ''}`}>
                ^
              </span>
            </div>
            {expandedSections.requiredDocs && (
              <div className="accordion-content">
                <div className="required-docs-header">
                  <button 
                    className="btn-add-document"
                    onClick={() => setShowAddDocumentModal(true)}
                  >
                    Add Document
                  </button>
                </div>
                <ul className="required-docs-list">
                  <li>Valid Contractor License</li>
                  <li>GST Registration Certificate</li>
                  <li>PAN Card</li>
                  <li>Company Registration Certificate</li>
                  <li>Previous Work Experience Certificates</li>
                </ul>
              </div>
            )}
          </div>

        </div>

        {/* Right Sidebar - Fixed */}
        <div className="right-sidebar">
          
          {/* Tender Features Panel */}
          <div className="features-panel">
            <h3>TENDER FEATURES</h3>
            <button 
              className={`feature-btn ${isInterested ? 'active' : ''}`}
              onClick={() => setIsInterested(!isInterested)}
            >
              <span className="icon">♡</span>
              Interested
            </button>
            <button className="feature-btn">
              <span className="icon">⏰</span>
              Set Reminder
            </button>
            <button className="feature-btn">
              <span className="icon">⬇</span>
              Download NIT
            </button>
            <button className="feature-btn">
              <span className="icon">📄</span>
              View BOQ
            </button>
            <button className="feature-btn">
              <span className="icon">↗</span>
              Share
            </button>
          </div>

          {/* Quick Info Panel */}
          <div className="quick-info-panel">
            <div className="info-item">
              <label>Estimated Cost</label>
              <p>₹ 418.00 CR.</p>
            </div>
            <div className="info-item">
              <label>Days Left</label>
              <p className="days-highlight">7 Days</p>
            </div>
          </div>

        </div>
      </div>

      {/* Change Product Modal */}
      {showChangeProductModal && (
        <div className="modal-overlay" onClick={() => setShowChangeProductModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Products</h2>
              <button 
                className="modal-close"
                onClick={() => setShowChangeProductModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Old Product</th>
                    <th>New Product</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((product, index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td>{product.oldProduct}</td>
                      <td>
                        <select
                          value={product.newProduct}
                          onChange={(e) => handleProductChange(product.id, e.target.value)}
                          className="product-select"
                        >
                          {productsList.map((p, i) => (
                            <option key={i} value={p}>{p}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn-save" onClick={saveProductChanges}>
                Save
              </button>
              <button 
                className="btn-cancel"
                onClick={() => setShowChangeProductModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {showAddDocumentModal && (
        <div className="modal-overlay" onClick={() => setShowAddDocumentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Document</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddDocumentModal(false)}
              >
                ×
              </button>
            </div>
            <div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Document Name *</label>
                  <input
                    type="text"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    placeholder="Enter document name"
                  />
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept, i) => (
                      <option key={i} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-save" onClick={handleAddDocument}>
                  Submit
                </button>
                <button 
                  className="btn-cancel"
                  onClick={() => setShowAddDocumentModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TenderDetails;