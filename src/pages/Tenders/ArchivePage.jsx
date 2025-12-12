// src/pages/Archive/ArchivePage.jsx
// Usage:
// import ArchivePage from 'src/pages/Archive/ArchivePage';
// <Route path="/archive" element={<ArchivePage/>} />

import React, { useState, useMemo } from 'react';
import '../../assets/css/ArchivePage.css';

const DUMMY_ARCHIVED_TENDERS = [
  { T_ID: 'T101', title: 'Highway Expansion Project Phase 2', startDate: '2023-06-15', endDate: '2024-01-30', department: 'PWD', location: 'Mumbai', state: 'Maharashtra', value: 65000, emd: 13000000, qty: 1, status: 'Closed', interested: false, archiveDate: '2024-02-01' },
  { T_ID: 'T102', title: 'Metro Rail Station Development', startDate: '2023-07-01', endDate: '2024-02-15', department: 'Transport', location: 'Delhi', state: 'Delhi', value: 95000, emd: 19000000, qty: 3, status: 'Awarded', interested: true, archiveDate: '2024-02-20' },
  { T_ID: 'T103', title: 'Smart City Infrastructure', startDate: '2023-05-20', endDate: '2024-01-25', department: 'Municipal', location: 'Bangalore', state: 'Karnataka', value: 42000, emd: 8500000, qty: 1, status: 'Closed', interested: false, archiveDate: '2024-01-28' },
  { T_ID: 'T104', title: 'Medical Equipment Supply for District Hospitals', startDate: '2023-08-01', endDate: '2024-03-10', department: 'Health', location: 'Chennai', state: 'Tamil Nadu', value: 18500, emd: 3700000, qty: 75, status: 'Awarded', interested: true, archiveDate: '2024-03-15' },
  { T_ID: 'T105', title: 'Heritage Building Restoration', startDate: '2023-04-10', endDate: '2024-02-20', department: 'Culture', location: 'Kolkata', state: 'West Bengal', value: 12000, emd: 2400000, qty: 2, status: 'Closed', interested: false, archiveDate: '2024-02-25' },
  { T_ID: 'T106', title: 'Flyover Construction Project', startDate: '2023-06-25', endDate: '2024-02-05', department: 'PWD', location: 'Hyderabad', state: 'Telangana', value: 78000, emd: 15600000, qty: 1, status: 'Awarded', interested: true, archiveDate: '2024-02-10' },
  { T_ID: 'T107', title: 'Public Park Development', startDate: '2023-09-05', endDate: '2024-03-15', department: 'Municipal', location: 'Pune', state: 'Maharashtra', value: 8500, emd: 1700000, qty: 5, status: 'Closed', interested: false, archiveDate: '2024-03-20' },
  { T_ID: 'T108', title: 'Government Office IT Modernization', startDate: '2023-07-15', endDate: '2024-02-25', department: 'Technology', location: 'Ahmedabad', state: 'Gujarat', value: 22000, emd: 4400000, qty: 1, status: 'Awarded', interested: false, archiveDate: '2024-03-01' },
  { T_ID: 'T109', title: 'Electric Bus Fleet Procurement', startDate: '2023-05-30', endDate: '2024-02-10', department: 'Transport', location: 'Jaipur', state: 'Rajasthan', value: 125000, emd: 25000000, qty: 50, status: 'Awarded', interested: true, archiveDate: '2024-02-15' },
  { T_ID: 'T110', title: 'Waste Treatment Plant', startDate: '2023-08-10', endDate: '2024-03-20', department: 'Environment', location: 'Surat', state: 'Gujarat', value: 35000, emd: 7000000, qty: 1, status: 'Closed', interested: false, archiveDate: '2024-03-25' },
  { T_ID: 'T111', title: 'Wind Energy Farm Development', startDate: '2023-07-20', endDate: '2024-03-01', department: 'Energy', location: 'Lucknow', state: 'Uttar Pradesh', value: 156000, emd: 31200000, qty: 10, status: 'Awarded', interested: true, archiveDate: '2024-03-05' },
  { T_ID: 'T112', title: 'Olympic Stadium Renovation', startDate: '2023-09-15', endDate: '2024-03-25', department: 'Sports', location: 'Kanpur', state: 'Uttar Pradesh', value: 48000, emd: 9600000, qty: 1, status: 'Closed', interested: false, archiveDate: '2024-03-30' }
];

const ArchiveTenderRow = ({ tender, onAction, onToggleInterest }) => {
  const formatValue = (value) => {
    if (value >= 100) return `₹ ${(value / 100).toFixed(2)} CR.`;
    return `₹ ${value.toFixed(2)} L.`;
  };

  return (
    <li className="archive-tender-row">
      <div className="archive-tender-content">
        <div className="archive-tender-main">
          <h3 className="archive-tender-title">{tender.title}</h3>
          <div className="archive-tender-meta">
            <span>Start: {tender.startDate}</span>
            <span>End: {tender.endDate}</span>
            <span className="archive-date">Archived: {tender.archiveDate}</span>
          </div>
          <div className="archive-tender-details">
            <span>{tender.department} - {tender.location}</span>
            <span className="archive-tender-value">{formatValue(tender.value)}</span>
            <span>EMD: ₹ {tender.emd.toLocaleString()}</span>
            <span>Qty: {tender.qty}</span>
            <span className={`archive-status ${tender.status.toLowerCase()}`}>{tender.status}</span>
          </div>
        </div>
        <div className="archive-tender-actions">
          <div className="archive-tender-id">Tender Id - {tender.T_ID}</div>
          <div className="archive-action-icons">
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
    <div className="archive-pagination">
      <div className="archive-pagination-info">
        Page {currentPage} of {totalPages}
        <span className="archive-remaining">Remaining pages: {remainingPages}</span>
      </div>
      <button 
        className="archive-btn-next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
};

export default function ArchivePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('desc');
  const [tenders, setTenders] = useState(DUMMY_ARCHIVED_TENDERS);
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
      alert(`Downloading archived tender ${tenderId}`);
      console.log(`Download Archived Tender: ${tenderId}`);
    } else {
      console.log(`Action: ${action} on Archived Tender: ${tenderId}`);
    }
  };

  const handleToggleInterest = (tenderId) => {
    setTenders(prevTenders =>
      prevTenders.map(t =>
        t.T_ID === tenderId ? { ...t, interested: !t.interested } : t
      )
    );
    console.log(`Toggled interest for Archived Tender: ${tenderId}`);
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
    console.log('Archive search executed with filters');
  };

  return (
    <div className="archive-page">
      <header className="archive-page-header">
        <h1>Archived Tenders</h1>
      </header>

      <div className="archive-search-filter-section">
        <div className="archive-search-bar-container">
          <div className="archive-search-input-wrapper">
            <svg className="archive-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Archive Filter"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="archive-main-search-input"
            />
          </div>
          <button 
            className="archive-filter-toggle-btn"
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

        <div className={`archive-filters-panel ${showFilters ? 'show' : ''}`}>
          <div className="archive-filters-grid">
            <input
              type="text"
              placeholder="Search By Keywords"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="archive-filter-input"
            />
            
            <input
              type="text"
              placeholder="Reference Number"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="archive-filter-input"
            />
            
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="archive-filter-select"
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
              className="archive-filter-input"
            />
            
            <input
              type="text"
              placeholder="Department Name"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              className="archive-filter-input"
            />
            
            <select
              value={tenderStatus}
              onChange={(e) => setTenderStatus(e.target.value)}
              className="archive-filter-select"
            >
              <option value="">Tender Status</option>
              <option value="Closed">Closed</option>
              <option value="Awarded">Awarded</option>
            </select>
            
            <select className="archive-filter-select">
              <option value="">Assign By</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
            
            <select className="archive-filter-select">
              <option value="">Assign To</option>
              <option value="team1">Team 1</option>
              <option value="team2">Team 2</option>
            </select>
            
            <input
              type="text"
              placeholder="Tender Id"
              value={tenderId}
              onChange={(e) => setTenderId(e.target.value)}
              className="archive-filter-input"
            />
            
            <input
              type="text"
              placeholder="Website"
              className="archive-filter-input"
            />
            
            <div className="archive-filter-input date-range">
              <input type="text" placeholder="Closing From → Closing To" />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            
            <select className="archive-filter-select">
              <option value="">Ownership</option>
              <option value="government">Government</option>
              <option value="private">Private</option>
            </select>
            
            <div className="archive-filter-input date-range">
              <input type="text" placeholder="Pre-bid From → Pre-bid To" />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            
            <select className="archive-filter-select">
              <option value="">Select Mail Type</option>
              <option value="email">Email</option>
              <option value="physical">Physical</option>
            </select>
            
            <input
              type="text"
              placeholder="Last Updated Date"
              className="archive-filter-input"
            />
          </div>

          <div className="archive-filters-row">
            <div className="archive-filter-group">
              <span className="archive-filter-label">Quantity:</span>
              <select
                value={quantityOperator}
                onChange={(e) => setQuantityOperator(e.target.value)}
                className="archive-filter-select-sm"
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
                className="archive-filter-input-sm"
              />
            </div>

            <div className="archive-filter-group">
              <span className="archive-filter-label">Tender Value:</span>
              <select
                value={valueOperator}
                onChange={(e) => setValueOperator(e.target.value)}
                className="archive-filter-select-sm"
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
                className="archive-filter-input-sm"
              />
              <select
                value={valueUnit}
                onChange={(e) => setValueUnit(e.target.value)}
                className="archive-filter-select-sm"
              >
                <option value="Lakh">Lakh</option>
                <option value="Crore">Crore</option>
              </select>
              <input
                type="number"
                placeholder="To"
                value={valueTo}
                onChange={(e) => setValueTo(e.target.value)}
                className="archive-filter-input-sm"
              />
              <select className="archive-filter-select-sm">
                <option value="Lakh">Lakh</option>
                <option value="Crore">Crore</option>
              </select>
            </div>
          </div>

          <div className="archive-filters-row">
            <div className="archive-filter-group">
              <span className="archive-filter-label">GeM / Non GeM:</span>
              <label className="archive-radio-label">
                <input type="radio" name="gem" value="all" defaultChecked />
                <span>All</span>
              </label>
              <label className="archive-radio-label">
                <input type="radio" name="gem" value="gem" />
                <span>GeM</span>
              </label>
              <label className="archive-radio-label">
                <input type="radio" name="gem" value="nongem" />
                <span>Non GeM</span>
              </label>
            </div>

            <div className="archive-filter-group">
              <span className="archive-filter-label">MSME Exemption:</span>
              <label className="archive-checkbox-label">
                <input type="checkbox" />
              </label>
            </div>

            <div className="archive-filter-group">
              <span className="archive-filter-label">Startup Exemption:</span>
              <label className="archive-radio-label">
                <input type="radio" name="startup" value="all" defaultChecked />
                <span>All</span>
              </label>
              <label className="archive-radio-label">
                <input type="radio" name="startup" value="yes" />
                <span>Yes</span>
              </label>
              <label className="archive-radio-label">
                <input type="radio" name="startup" value="no" />
                <span>No</span>
              </label>
            </div>

            <div className="archive-filter-group">
              <span className="archive-filter-label">Manual Entry:</span>
              <label className="archive-checkbox-label">
                <input type="checkbox" />
              </label>
            </div>
          </div>

          <div className="archive-filters-actions">
            <button className="archive-btn-search" onClick={handleSearch}>
              Search
            </button>
            <button className="archive-btn-clear" onClick={handleClearFilters}>
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="archive-sort-section">
        <div className="archive-results-count">{sortedTenders.length} archived tenders found</div>
        <div className="archive-sort-controls">
          <label htmlFor="archive-sort-select">Sort by Value:</label>
          <select 
            id="archive-sort-select"
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="archive-sort-select"
          >
            <option value="desc">Highest First</option>
            <option value="asc">Lowest First</option>
          </select>
        </div>
      </div>

      <ul className="archive-tenders-list">
        {currentTenders.map((tender) => (
          <ArchiveTenderRow 
            key={tender.T_ID} 
            tender={tender} 
            onAction={handleAction}
            onToggleInterest={handleToggleInterest}
          />
        ))}
      </ul>

      {sortedTenders.length === 0 && (
        <div className="archive-no-results">
          No archived tenders found matching your filters.
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