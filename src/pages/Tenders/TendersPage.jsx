// src/pages/Tenders/TendersPage.jsx
// Usage:
// import TendersPage from 'src/pages/Tenders/TendersPage';
// <Route path="/tenders" element={<TendersPage/>} />

import React, { useState, useMemo } from 'react';
import '../../assets/css/TendersPage.css';

const DUMMY_TENDERS = [
  { T_ID: 'T001', title: 'Construction of Municipal Building', startDate: '2024-01-15', endDate: '2025-01-30', department: 'PWD', location: 'Mumbai', state: 'Maharashtra', value: 41600, emd: 10000000, qty: 1, status: 'Open', interested: false },
  { T_ID: 'T002', title: 'Road Infrastructure Development Project', startDate: '2024-02-01', endDate: '2025-02-15', department: 'Roads', location: 'Delhi', state: 'Delhi', value: 28500, emd: 5000000, qty: 5, status: 'Open', interested: false },
  { T_ID: 'T003', title: 'Water Supply Pipeline Installation', startDate: '2024-01-20', endDate: '2025-01-25', department: 'Water Board', location: 'Bangalore', state: 'Karnataka', value: 15200, emd: 3000000, qty: 10, status: 'Open', interested: false },
  { T_ID: 'T004', title: 'Hospital Equipment Procurement', startDate: '2024-03-01', endDate: '2025-03-10', department: 'Health', location: 'Chennai', state: 'Tamil Nadu', value: 9800, emd: 2000000, qty: 50, status: 'Open', interested: false },
  { T_ID: 'T005', title: 'School Building Renovation', startDate: '2024-02-10', endDate: '2025-02-20', department: 'Education', location: 'Kolkata', state: 'West Bengal', value: 6500, emd: 1500000, qty: 3, status: 'Open', interested: false },
  { T_ID: 'T006', title: 'Bridge Construction and Maintenance', startDate: '2024-01-25', endDate: '2025-02-05', department: 'PWD', location: 'Hyderabad', state: 'Telangana', value: 55000, emd: 12000000, qty: 2, status: 'Open', interested: false },
  { T_ID: 'T007', title: 'Street Lighting Installation', startDate: '2024-03-05', endDate: '2025-03-15', department: 'Municipal', location: 'Pune', state: 'Maharashtra', value: 3200, emd: 800000, qty: 200, status: 'Open', interested: false },
  { T_ID: 'T008', title: 'IT Infrastructure Upgrade', startDate: '2024-02-15', endDate: '2025-02-25', department: 'Technology', location: 'Ahmedabad', state: 'Gujarat', value: 12000, emd: 2500000, qty: 1, status: 'Open', interested: false },
  { T_ID: 'T009', title: 'Public Transport Bus Procurement', startDate: '2024-01-30', endDate: '2025-02-10', department: 'Transport', location: 'Jaipur', state: 'Rajasthan', value: 45000, emd: 9000000, qty: 25, status: 'Open', interested: false },
  { T_ID: 'T010', title: 'Waste Management System', startDate: '2024-03-10', endDate: '2025-03-20', department: 'Environment', location: 'Surat', state: 'Gujarat', value: 8700, emd: 1800000, qty: 8, status: 'Open', interested: false },
  { T_ID: 'T011', title: 'Solar Panel Installation Project', startDate: '2024-02-20', endDate: '2025-03-01', department: 'Energy', location: 'Lucknow', state: 'Uttar Pradesh', value: 22000, emd: 4500000, qty: 100, status: 'Open', interested: false },
  { T_ID: 'T012', title: 'Sports Complex Development', startDate: '2024-03-15', endDate: '2025-03-25', department: 'Sports', location: 'Kanpur', state: 'Uttar Pradesh', value: 18500, emd: 3800000, qty: 1, status: 'Open', interested: false }
];

const TenderRow = ({ tender, onAction, onToggleInterest }) => {
  const calculateDaysLeft = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const formatValue = (value) => {
    if (value >= 100) return `₹ ${(value / 100).toFixed(2)} CR.`;
    return `₹ ${value.toFixed(2)} L.`;
  };

  const daysLeft = calculateDaysLeft(tender.endDate);

  return (
    <li className="tender-row">
      <div className="tender-content">
        <div className="tender-main">
          <h3 className="tender-title">{tender.title}</h3>
          <div className="tender-meta">
            <span>Start: {tender.startDate}</span>
            <span>End: {tender.endDate}</span>
            <span className="days-left">{daysLeft} Days Left</span>
          </div>
          <div className="tender-details">
            <span>{tender.department} - {tender.location}</span>
            <span className="tender-value">{formatValue(tender.value)}</span>
            <span>EMD: ₹ {tender.emd.toLocaleString()}</span>
            <span>Qty: {tender.qty}</span>
          </div>
        </div>
        <div className="tender-actions">
          <div className="tender-id">Tender Id - {tender.T_ID}</div>
          <div className="action-icons">
            <button onClick={() => onAction('info', tender.T_ID)} aria-label="Additional info" title="Additional info">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            </button>
            <button onClick={() => onAction('boq', tender.T_ID)} aria-label="BOQ details" title="BOQ details">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
            </button>
            <button onClick={() => onAction('status', tender.T_ID)} aria-label="Tender status" title="Tender status">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </button>
            <button 
              onClick={() => onToggleInterest(tender.T_ID)} 
              aria-label="Mark interested" 
              title="Mark interested"
              className={tender.interested ? 'interested-active' : ''}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={tender.interested ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
            <button onClick={() => onAction('assign', tender.T_ID)} aria-label="Assign tender" title="Assign tender">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
            <button onClick={() => onAction('download', tender.T_ID)} aria-label="Download" title="Download" className="download-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const remainingPages = Math.max(0, totalPages - currentPage);
  
  return (
    <div className="pagination">
      <div className="pagination-info">
        Page {currentPage} of {totalPages}
        <span className="remaining">Remaining pages: {remainingPages}</span>
      </div>
      <button 
        className="btn-next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
};

export default function TendersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('desc');
  const [tenders, setTenders] = useState(DUMMY_TENDERS);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [city, setCity] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [tenderStatus, setTenderStatus] = useState('');
  const [tenderId, setTenderId] = useState('');
  const [quantityOperator, setQuantityOperator] = useState('>=');
  const [quantityValue, setQuantityValue] = useState('');
  const [valueOperator, setValueOperator] = useState('=');
  const [valueFrom, setValueFrom] = useState('');
  const [valueTo, setValueTo] = useState('');
  const [valueUnit, setValueUnit] = useState('Lakh');
  
  const itemsPerPage = 10;

  const filteredTenders = useMemo(() => {
    return tenders.filter(tender => {
      // Search keyword
      if (searchKeyword && !tender.title.toLowerCase().includes(searchKeyword.toLowerCase()) &&
          !tender.T_ID.toLowerCase().includes(searchKeyword.toLowerCase())) {
        return false;
      }
      
      // Reference number (T_ID)
      if (referenceNumber && !tender.T_ID.toLowerCase().includes(referenceNumber.toLowerCase())) {
        return false;
      }
      
      // State
      if (selectedState && tender.state !== selectedState) {
        return false;
      }
      
      // City
      if (city && !tender.location.toLowerCase().includes(city.toLowerCase())) {
        return false;
      }
      
      // Department
      if (departmentName && !tender.department.toLowerCase().includes(departmentName.toLowerCase())) {
        return false;
      }
      
      // Tender Status
      if (tenderStatus && tender.status !== tenderStatus) {
        return false;
      }
      
      // Tender ID
      if (tenderId && !tender.T_ID.toLowerCase().includes(tenderId.toLowerCase())) {
        return false;
      }
      
      // Quantity filter
      if (quantityValue) {
        const qty = parseInt(quantityValue);
        if (!isNaN(qty)) {
          if (quantityOperator === '>=' && tender.qty < qty) return false;
          if (quantityOperator === '<=' && tender.qty > qty) return false;
          if (quantityOperator === '=' && tender.qty !== qty) return false;
        }
      }
      
      // Value filter
      if (valueFrom) {
        const multiplier = valueUnit === 'Lakh' ? 1 : 100;
        const fromVal = parseFloat(valueFrom) * multiplier;
        
        if (!isNaN(fromVal)) {
          if (valueOperator === '=' && tender.value !== fromVal) return false;
          if (valueOperator === '>=' && tender.value < fromVal) return false;
          if (valueOperator === '<=' && tender.value > fromVal) return false;
          
          if (valueTo && valueOperator === '=') {
            const toVal = parseFloat(valueTo) * multiplier;
            if (!isNaN(toVal) && (tender.value < fromVal || tender.value > toVal)) {
              return false;
            }
          }
        }
      }
      
      return true;
    });
  }, [tenders, searchKeyword, referenceNumber, selectedState, city, departmentName, tenderStatus, tenderId, quantityOperator, quantityValue, valueOperator, valueFrom, valueTo, valueUnit]);

  const sortedTenders = useMemo(() => {
    const sorted = [...filteredTenders].sort((a, b) => {
      return sortOrder === 'asc' ? a.value - b.value : b.value - a.value;
    });
    return sorted;
  }, [filteredTenders, sortOrder]);

  const totalPages = Math.ceil(sortedTenders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTenders = sortedTenders.slice(startIndex, startIndex + itemsPerPage);

  const handleAction = (action, tenderId) => {
    if (action === 'download') {
      alert(`Downloading tender ${tenderId}`);
      console.log(`Download Tender: ${tenderId}`);
    } else {
      console.log(`Action: ${action} on Tender: ${tenderId}`);
    }
  };

  const handleToggleInterest = (tenderId) => {
    setTenders(prevTenders =>
      prevTenders.map(t =>
        t.T_ID === tenderId ? { ...t, interested: !t.interested } : t
      )
    );
    console.log(`Toggled interest for Tender: ${tenderId}`);
  };

  const handleClearFilters = () => {
    setSearchKeyword('');
    setReferenceNumber('');
    setSelectedState('');
    setCity('');
    setDepartmentName('');
    setTenderStatus('');
    setTenderId('');
    setQuantityOperator('>=');
    setQuantityValue('');
    setValueOperator('=');
    setValueFrom('');
    setValueTo('');
    setValueUnit('Lakh');
  };

  const handleSearch = () => {
    setCurrentPage(1);
    console.log('Search executed with filters');
  };

  return (
    <div className="tenders-page">
      <header className="page-header">
        <h1>Active Tenders</h1>
      </header>

      <div className="search-filter-section">
        <div className="search-bar-container">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Tender Filter"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="main-search-input"
            />
          </div>
          <button 
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Toggle filters"
            aria-expanded={showFilters}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className={showFilters ? 'rotate-180' : ''}
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>

        <div className={`filters-panel ${showFilters ? 'show' : ''}`}>
          <div className="filters-grid">
            <input
              type="text"
              placeholder="Search By Keywords"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="filter-input"
            />
            
            <input
              type="text"
              placeholder="Reference Number"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="filter-input"
            />
            
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="filter-select"
            >
              <option value="">Select State</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Telangana">Telangana</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
            </select>
            
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="filter-input"
            />
            
            <input
              type="text"
              placeholder="Department Name"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              className="filter-input"
            />
            
            <select
              value={tenderStatus}
              onChange={(e) => setTenderStatus(e.target.value)}
              className="filter-select"
            >
              <option value="">Tender Status</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Awarded">Awarded</option>
            </select>
            
            <select className="filter-select">
              <option value="">Assign By</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
            
            <select className="filter-select">
              <option value="">Assign To</option>
              <option value="team1">Team 1</option>
              <option value="team2">Team 2</option>
            </select>
            
            <input
              type="text"
              placeholder="Tender Id"
              value={tenderId}
              onChange={(e) => setTenderId(e.target.value)}
              className="filter-input"
            />
            
            <input
              type="text"
              placeholder="Website"
              className="filter-input"
            />
            
            <div className="filter-input date-range">
              <input type="text" placeholder="Closing From → Closing To" />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            
            <select className="filter-select">
              <option value="">Ownership</option>
              <option value="government">Government</option>
              <option value="private">Private</option>
            </select>
            
            <div className="filter-input date-range">
              <input type="text" placeholder="Pre-bid From → Pre-bid To" />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            
            <select className="filter-select">
              <option value="">Select Mail Type</option>
              <option value="email">Email</option>
              <option value="physical">Physical</option>
            </select>
            
            <input
              type="text"
              placeholder="Last Updated Date"
              className="filter-input"
            />
          </div>

          <div className="filters-row">
            <div className="filter-group">
              <span className="filter-label">Quantity:</span>
              <select
                value={quantityOperator}
                onChange={(e) => setQuantityOperator(e.target.value)}
                className="filter-select-sm"
              >
                <option value=">=">&gt;=</option>
                <option value="<=">&lt;=</option>
                <option value="=">=</option>
              </select>
              <input
                type="number"
                placeholder="Enter Quantity"
                value={quantityValue}
                onChange={(e) => setQuantityValue(e.target.value)}
                className="filter-input-sm"
              />
            </div>

            <div className="filter-group">
              <span className="filter-label">Tender Value:</span>
              <select
                value={valueOperator}
                onChange={(e) => setValueOperator(e.target.value)}
                className="filter-select-sm"
              >
                <option value="=">=</option>
                <option value=">=">&gt;=</option>
                <option value="<=">&lt;=</option>
              </select>
              <input
                type="number"
                placeholder="Value"
                value={valueFrom}
                onChange={(e) => setValueFrom(e.target.value)}
                className="filter-input-sm"
              />
              <select
                value={valueUnit}
                onChange={(e) => setValueUnit(e.target.value)}
                className="filter-select-sm"
              >
                <option value="Lakh">Lakh</option>
                <option value="Crore">Crore</option>
              </select>
              <input
                type="number"
                placeholder="To"
                value={valueTo}
                onChange={(e) => setValueTo(e.target.value)}
                className="filter-input-sm"
              />
              <select className="filter-select-sm">
                <option value="Lakh">Lakh</option>
                <option value="Crore">Crore</option>
              </select>
            </div>
          </div>

          <div className="filters-row">
            <div className="filter-group">
              <span className="filter-label">GeM / Non GeM:</span>
              <label className="radio-label">
                <input type="radio" name="gem" value="all" defaultChecked />
                <span>All</span>
              </label>
              <label className="radio-label">
                <input type="radio" name="gem" value="gem" />
                <span>GeM</span>
              </label>
              <label className="radio-label">
                <input type="radio" name="gem" value="nongem" />
                <span>Non GeM</span>
              </label>
            </div>

            <div className="filter-group">
              <span className="filter-label">MSME Exemption:</span>
              <label className="checkbox-label">
                <input type="checkbox" />
              </label>
            </div>

            <div className="filter-group">
              <span className="filter-label">Startup Exemption:</span>
              <label className="radio-label">
                <input type="radio" name="startup" value="all" defaultChecked />
                <span>All</span>
              </label>
              <label className="radio-label">
                <input type="radio" name="startup" value="yes" />
                <span>Yes</span>
              </label>
              <label className="radio-label">
                <input type="radio" name="startup" value="no" />
                <span>No</span>
              </label>
            </div>

            <div className="filter-group">
              <span className="filter-label">Manual Entry:</span>
              <label className="checkbox-label">
                <input type="checkbox" />
              </label>
            </div>
          </div>

          <div className="filters-actions">
            <button className="btn-search" onClick={handleSearch}>
              Search
            </button>
            <button className="btn-clear" onClick={handleClearFilters}>
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="sort-section">
        <div className="results-count">{sortedTenders.length} tenders found</div>
        <div className="sort-controls">
          <label htmlFor="sort-select">Sort by Value:</label>
          <select 
            id="sort-select"
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-select"
          >
            <option value="desc">Highest First</option>
            <option value="asc">Lowest First</option>
          </select>
        </div>
      </div>

      <ul className="tenders-list">
        {currentTenders.map((tender) => (
          <TenderRow 
            key={tender.T_ID} 
            tender={tender} 
            onAction={handleAction}
            onToggleInterest={handleToggleInterest}
          />
        ))}
      </ul>

      {sortedTenders.length === 0 && (
        <div className="no-results">
          No tenders found matching your filters.
        </div>
      )}

      {sortedTenders.length > 0 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}