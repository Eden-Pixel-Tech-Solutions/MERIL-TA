// src/pages/Archive/ArchivePage.jsx

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/TendersPage.css';

const ITEMS_PER_PAGE = 20;

const DUMMY_STATUS_HISTORY = [
  { status: 'Proceed', remarks: 'Initial review completed', createdDate: '2025-01-15', updatedDate: '2025-01-15' },
  { status: 'Win', remarks: 'Tender awarded successfully', createdDate: '2025-02-10', updatedDate: '2025-02-10' },
  { status: 'On-Hold', remarks: 'Awaiting documentation', createdDate: '2025-01-20', updatedDate: '2025-01-22' },
];

const TenderStatusModal = ({ tender, onClose }) => {
  const [formData, setFormData] = useState({
    status: 'proceed',
    remark: ''
  });
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch status history on component mount
  useEffect(() => {
    const fetchStatusHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/tenders/${encodeURIComponent(tender.T_ID)}/status/history`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = await response.json();

        if (data.success) {
          setStatusHistory(data.data || []);
        } else {
          setError(data.message || 'Failed to fetch status history');
        }
      } catch (err) {
        console.error('Error fetching status history:', err);
        setError('Failed to fetch status history');
      } finally {
        setLoading(false);
      }
    };

    if (tender?.T_ID) {
      fetchStatusHistory();
    }
  }, [tender?.T_ID]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tenders/${encodeURIComponent(tender.T_ID)}/status`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            status: formData.status,
            remarks: formData.remark
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        // Add the new status to the history
        setStatusHistory(prev => [data.data, ...prev]);

        // Reset form
        setFormData({ status: 'proceed', remark: '' });

        alert(`Status updated successfully for Tender ${tender.T_ID}`);
      } else {
        setError(data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Tender Status - {tender.T_ID}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="status-form">
          {error && (
            <div className="error-message" style={{ color: '#dc3545', marginBottom: '15px', padding: '10px', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="tender-status">Tender Status:</label>
            <select
              id="tender-status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="form-select"
              disabled={submitting}
            >
              <option value="proceed">Proceed</option>
              <option value="win">Win</option>
              <option value="lose">Lose</option>
              <option value="on-hold">On-Hold</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="remark">Remark:</label>
            <textarea
              id="remark"
              value={formData.remark}
              onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
              className="form-textarea"
              rows="4"
              placeholder="Enter your remarks here..."
              disabled={submitting}
            />
          </div>

          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        <div className="status-history">
          <h3>Status History</h3>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>Loading status history...</div>
          ) : statusHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No status history available</div>
          ) : (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Tender Status</th>
                  <th>Remarks</th>
                  <th>Created Date</th>
                  <th>Updated Date</th>
                </tr>
              </thead>
              <tbody>
                {statusHistory.map((record, idx) => (
                  <tr key={idx}>
                    <td><span className={`status-badge ${record.status.toLowerCase()}`}>{record.status}</span></td>
                    <td>{record.remarks || '-'}</td>
                    <td>{new Date(record.created_date).toLocaleDateString()}</td>
                    <td>{new Date(record.updated_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const TenderRow = ({ tender, serialNumber, onAction, onToggleInterest }) => {
  const calculateDaysLeft = (endDateStr) => {
    if (!endDateStr) return 0;

    // Parse "DD-MM-YYYY hh:mm AM/PM"
    const match = endDateStr.match(
      /(\d{2})-(\d{2})-(\d{4}) (\d{1,2}):(\d{2}) (AM|PM)/i
    );

    if (!match) return 0;

    let [, dd, mm, yyyy, hh, min, meridian] = match;

    dd = Number(dd);
    mm = Number(mm) - 1;
    yyyy = Number(yyyy);
    hh = Number(hh);
    min = Number(min);

    if (meridian.toUpperCase() === "PM" && hh !== 12) hh += 12;
    if (meridian.toUpperCase() === "AM" && hh === 12) hh = 0;

    // End date in IST
    const endDate = new Date(Date.UTC(yyyy, mm, dd, hh - 5, min - 30));

    // Current date in IST
    const now = new Date();
    const nowIST = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));

    // Zero out time for day comparison
    const startOfTodayIST = new Date(
      nowIST.getFullYear(),
      nowIST.getMonth(),
      nowIST.getDate()
    );

    const startOfEndDayIST = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );

    const diffMs = startOfEndDayIST - startOfTodayIST;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };


  const formatValue = (value) => {
    if (typeof value !== 'number' || isNaN(value)) return `₹ ${value}`;
    if (value >= 100) return `₹ ${(value / 100).toFixed(2)} CR.`;
    return `₹ ${value.toFixed(2)} L.`;
  };

  const daysLeft = calculateDaysLeft(tender.endDate);

  const toTenderUrlId = (tenderId) => {
    return (tenderId || '').split('/').join('_');
  };

  return (
    <div className="tender-row-compact">

      <div className="tender-main-info">
        <div className="tender-header-line">
          <b><div className="tender-serial" style={{ fontSize: "12pt" }}>{serialNumber}.</div></b>

          <span className="tender-id-bold" style={{ fontSize: "12pt" }}>Tender Id: {tender.T_ID}</span>
          <span className="tender-value-bold" style={{ fontSize: "12pt" }}>{formatValue(tender.value)}</span>
          <b><span className="tender-date" style={{ fontSize: "12pt" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            {tender.endDate} <span className="days-left-badge" style={{ fontSize: "8pt" }}>{daysLeft} Days Left</span>
          </span></b>
          <b><span className="tender-emd" style={{ fontSize: "11pt" }}>EMD: ₹ {tender.emd.toLocaleString()}</span></b>
        </div>
        <span style={{ height: "2pt" }}></span>
        <Link
          to={`/tenders/tenderdetails/${encodeURIComponent(toTenderUrlId(tender.T_ID))}`}
          className="tender-title-link" style={{ fontSize: "11.8pt", color: 'black' }}
        >
          {tender.title}
        </Link>
        <span style={{ height: "2pt" }}></span>

        <div className="tender-location-line" style={{
          fontWeight: 755,
          fontSize: '12pt',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '8px',
          color: '#084f9a'
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          {tender.department}
        </div>
      </div>

      <div className="tender-actions-compact">
        <button
          onClick={(e) => { e.stopPropagation(); onAction('info', tender.T_ID); }}
          aria-label="Additional info"
          title="Additional info"
          className="action-icon-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onAction('boq', tender.T_ID); }}
          aria-label="BOQ details"
          title="BOQ details"
          className="action-icon-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
          </svg>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onAction('status', tender); }}
          aria-label="Tender status"
          title="Tender status"
          className="action-icon-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onToggleInterest(tender.T_ID); }}
          aria-label="Mark interested"
          title="Mark interested"
          className={`action-icon-btn ${tender.interested ? 'interested-active' : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={tender.interested ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onAction('assign', tender.T_ID); }}
          aria-label="Assign tender"
          title="Assign tender"
          className="action-icon-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onAction('download', tender); }}
          aria-label="Download"
          title="Download"
          className="action-icon-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="archive-pagination">
      <button
        className="pagination-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ◀ Previous
      </button>

      {getPages().map(page => (
        <button
          key={page}
          className={`pagination-btn ${page === currentPage ? 'active' : ''
            }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="pagination-btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next ▶
      </button>
    </div>
  );
};

const TenderSkeleton = () => {
  return (
    <div className="tender-row-compact shimmer">
      <div className="shimmer-line title"></div>
      <div className="shimmer-line short"></div>
      <div className="shimmer-line"></div>
    </div>
  );
};

export default function ArchivePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('desc');
  const [tenders, setTenders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedTender, setSelectedTender] = useState(null);

  // Filter states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [city, setCity] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [tenderId, setTenderId] = useState('');
  const [quantityOperator, setQuantityOperator] = useState('>=');
  const [quantityValue, setQuantityValue] = useState('');
  const [valueOperator, setValueOperator] = useState('=');
  const [valueFrom, setValueFrom] = useState('');
  const [valueTo, setValueTo] = useState('');
  const [valueUnit, setValueUnit] = useState('Lakh');
  const scrapedQueriesRef = useRef(new Set());

  useEffect(() => {
    const fetchTenders = async (isRetry = false) => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        const params = new URLSearchParams({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          sort: sortOrder,
          archived: 'true',
          search: searchKeyword,
          referenceNumber: referenceNumber,
          city: city,
          departmentName: departmentName,
          tenderId: tenderId,
          quantityOperator: quantityOperator,
          quantityValue: quantityValue,
          valueOperator: valueOperator,
          valueFrom: valueFrom,
          valueTo: valueTo,
          valueUnit: valueUnit
        });

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/tenders?${params.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = await res.json();

        // Fallback Scraping Logic
        if (
          (!data.data || data.data.length === 0) && // No results found
          searchKeyword &&                          // User is searching for something
          !scrapedQueriesRef.current.has(searchKeyword) && // We haven't scraped this yet
          !isRetry                                  // Not a retry call
        ) {
          console.log(`No results found for "${searchKeyword}". Attempting fallback scrape...`);

          try {
            const SCRAPER_API = import.meta.env.VITE_SCRAPER_API || 'http://localhost:8007';

            const scrapeRes = await fetch(`${SCRAPER_API}/scrape`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                query: searchKeyword.trim()
              })
            });

            const scrapeData = await scrapeRes.json();

            if (scrapeRes.ok && scrapeData.status === 'success') {
              console.log('Scraping completed:', scrapeData.message);

              scrapedQueriesRef.current.add(searchKeyword);

              await fetchTenders(true);
              return;
            } else {
              console.warn('Scraping failed:', scrapeData);
            }


            if (scrapeRes.ok) {
              console.log("Scraping successful. Retrying fetch...");
              scrapedQueriesRef.current.add(searchKeyword);
              await fetchTenders(true);
              return;
            } else {
              console.warn("Scraping failed with status:", scrapeRes.status);
            }
          } catch (scrapeErr) {
            console.error("Failed to call scraping service:", scrapeErr);
          }
        }

        setTenders(
          (data.data || []).map(t => ({
            T_ID: t.T_ID,
            title: t.title,
            department: t.department,
            startDate: t.start_date,
            endDate: t.end_date,
            qty: Number(t.qty) || 0,
            value: Number(t.value) || 0,
            interested: t.interested,
            detail_url: t.detail_url, // ✅ REQUIRED FOR DOWNLOAD
            location: '—',
            state: '—',
            emd: 0,
            status: 'Closed'
          }))
        );

        setTotalPages(
          data.totalPages || Math.ceil((data.total || 0) / ITEMS_PER_PAGE)
        );
      } catch (err) {
        console.error('Failed to fetch tenders', err);
      } finally {
        if (!isRetry) {
          setLoading(false);
        }
      }
    };

    fetchTenders();
  }, [currentPage, sortOrder, searchKeyword, referenceNumber, city, departmentName, tenderId, quantityOperator, quantityValue, valueOperator, valueFrom, valueTo, valueUnit]);

  const sortedTenders = useMemo(() => {
    const sorted = [...tenders].sort((a, b) => {
      return sortOrder === 'asc' ? a.value - b.value : b.value - a.value;
    });
    return sorted;
  }, [tenders, sortOrder]);

  const handleAction = (action, tender) => {
    if (action === 'download') {
      if (tender.detail_url) {
        window.open(tender.detail_url, '_blank', 'noopener,noreferrer');
      } else {
        alert('Detail URL not available');
      }
      return;
    }

    if (action === 'status') {
      setSelectedTender(tender);
      setShowStatusModal(true);
      return;
    }

    console.log(`Action: ${action}`, tender);
  };


  const handleToggleInterest = async (tid) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tenders/${encodeURIComponent(tid)}/interest`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update the local state with the new interest status
        setTenders(prev =>
          prev.map(t =>
            t.T_ID === tid ? { ...t, interested: data.data.is_interested === 1 } : t
          )
        );

        // Show success message
        console.log(data.message);
      } else {
        // Show error message
        console.error('Failed to toggle interest:', data.message);
        alert(data.message || 'Failed to update interest status');
      }
    } catch (err) {
      console.error('Failed to toggle interest', err);
      alert('Failed to update interest status. Please try again.');
    }
  };


  const handleClearFilters = () => {
    setSearchKeyword('');
    setReferenceNumber('');
    setSelectedState('');
    setCity('');
    setDepartmentName('');
    setTenderId('');
    setQuantityOperator('>=');
    setQuantityValue('');
    setValueOperator('=');
    setValueFrom('');
    setValueTo('');
    setValueUnit('Lakh');
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };



  return (
    <div className="archive-page">
      <header className="archive-page-header">
        <h1>Active Tenders</h1>
      </header>

      <div className="archive-search-filter-section">
        <div className="archive-search-bar-container">
          <div className="archive-search-input-wrapper">
            <svg className="archive-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Active Tenders Filter"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="archive-main-search-input"
            />
          </div>

          <button
            className="archive-filter-toggle-btn"
            onClick={() => setShowFilters(prev => !prev)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        <div className={`archive-filters-panel ${showFilters ? 'show' : ''}`}>
          <div className="archive-filters-grid">
            <input type="text" placeholder="Search By Keywords" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} className="archive-filter-input" />
            <input type="text" placeholder="Reference Number" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} className="archive-filter-input" />
            <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="archive-filter-select">
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
            <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="archive-filter-input" />
            <input type="text" placeholder="Department Name" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} className="archive-filter-input" />
            <select className="archive-filter-select"><option value="">Assign By</option></select>
            <select className="archive-filter-select"><option value="">Assign To</option></select>
            <input type="text" placeholder="Tender Id" value={tenderId} onChange={(e) => setTenderId(e.target.value)} className="archive-filter-input" />
            <input type="text" placeholder="Website" className="archive-filter-input" />
            <div className="archive-filter-input date-range"><input type="text" placeholder="Closing From → Closing To" /></div>
            <select className="archive-filter-select"><option value="">Ownership</option></select>
            <div className="archive-filter-input date-range"><input type="text" placeholder="Pre-bid From → Pre-bid To" /></div>
            <select className="archive-filter-select"><option value="">Select Mail Type</option></select>
            <input type="text" placeholder="Last Updated Date" className="archive-filter-input" />
          </div>

          <div className="archive-filters-row">
            <div className="archive-filter-group">
              <span className="archive-filter-label">Quantity:</span>
              <select value={quantityOperator} onChange={(e) => setQuantityOperator(e.target.value)} className="archive-filter-select-sm">
                <option value=">=">&gt;=</option>
                <option value="<=">&lt;=</option>
                <option value="=">=</option>
              </select>
              <input type="number" placeholder="Enter Quantity" value={quantityValue} onChange={(e) => setQuantityValue(e.target.value)} className="archive-filter-input-sm" />
            </div>

            <div className="archive-filter-group">
              <span className="archive-filter-label">Tender Value:</span>
              <select value={valueOperator} onChange={(e) => setValueOperator(e.target.value)} className="archive-filter-select-sm">
                <option value="=">=</option>
                <option value=">=">&gt;=</option>
                <option value="<=">&lt;=</option>
              </select>
              <input type="number" placeholder="Value" value={valueFrom} onChange={(e) => setValueFrom(e.target.value)} className="archive-filter-input-sm" />
              <select value={valueUnit} onChange={(e) => setValueUnit(e.target.value)} className="archive-filter-select-sm">
                <option value="Lakh">Lakh</option>
                <option value="Crore">Crore</option>
              </select>
              <input type="number" placeholder="To" value={valueTo} onChange={(e) => setValueTo(e.target.value)} className="archive-filter-input-sm" />
              <select className="archive-filter-select-sm"><option value="Lakh">Lakh</option><option value="Crore">Crore</option></select>
            </div>
          </div>

          <div className="archive-filters-row">
            <div className="archive-filter-group">
              <span className="archive-filter-label">GeM / Non GeM:</span>
              <label className="archive-radio-label"><input type="radio" name="gem" defaultChecked /><span>All</span></label>
              <label className="archive-radio-label"><input type="radio" name="gem" /><span>GeM</span></label>
              <label className="archive-radio-label"><input type="radio" name="gem" /><span>Non GeM</span></label>
            </div>
            <div className="archive-filter-group">
              <span className="archive-filter-label">MSME Exemption:</span>
              <label className="archive-checkbox-label"><input type="checkbox" /></label>
            </div>
            <div className="archive-filter-group">
              <span className="archive-filter-label">Startup Exemption:</span>
              <label className="archive-radio-label"><input type="radio" name="startup" defaultChecked /><span>All</span></label>
              <label className="archive-radio-label"><input type="radio" name="startup" /><span>Yes</span></label>
              <label className="archive-radio-label"><input type="radio" name="startup" /><span>No</span></label>
            </div>
            <div className="archive-filter-group">
              <span className="archive-filter-label">Manual Entry:</span>
              <label className="archive-checkbox-label"><input type="checkbox" /></label>
            </div>
          </div>

          <div className="archive-filters-actions">
            <button className="archive-btn-search" onClick={handleSearch}>Search</button>
            <button className="archive-btn-clear" onClick={handleClearFilters}>Clear</button>
          </div>
        </div>
      </div>

      <div className="archive-sort-section">
        <div className="archive-results-count">{sortedTenders.length} Active tenders found</div>
        <div className="archive-sort-controls">
          <label htmlFor="archive-sort-select">Sort by Value:</label>
          <select id="archive-sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="archive-sort-select">
            <option value="desc">Highest First</option>
            <option value="asc">Lowest First</option>
          </select>
        </div>
      </div>

      <div className="tenders-list-compact">
        {loading
          ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <TenderSkeleton key={i} />
          ))
          : sortedTenders.map((tender, index) => (
            <TenderRow
              key={tender.T_ID}
              tender={tender}
              serialNumber={(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
              onAction={handleAction}
              onToggleInterest={handleToggleInterest}
            />
          ))}
      </div>


      {sortedTenders.length === 0 && (
        <div className="archive-no-results">No archived tenders found matching your filters.</div>
      )}

      {sortedTenders.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(Math.min(Math.max(1, p), totalPages))}
        />
      )}

      {showStatusModal && selectedTender && (
        <TenderStatusModal
          tender={selectedTender}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedTender(null);
          }}
        />
      )}
    </div>
  );
}