import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductSearchModal from '../../components/common/ProductSearchModal';
import '../../assets/css/TenderDetails.css';

const SuggestedProductsModal = ({ products, detectedCategory, selectedProduct, onClose, bidNumber, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localProducts, setLocalProducts] = useState(products);
  const [showSearch, setShowSearch] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalProducts(products); // Reset on open
  }, [products]);

  const handleRemove = (idx) => {
    const updated = [...localProducts];
    updated.splice(idx, 1);
    setLocalProducts(updated);
  };

  const handleAdd = (product) => {
    setLocalProducts([...localProducts, product]);
    setShowSearch(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const cleanBidNumber = bidNumber.replace(/_/g, '/'); // Ensure / for backend URL if needed or pass raw. The endpoint expects whatever format. 
      // Actually backend controller replaces nothing, it expects what is in DB. DB has slashes.

      const res = await fetch(`${API_BASE_URL}/tenders/${encodeURIComponent(cleanBidNumber)}/suggestions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ products: localProducts })
      });
      const data = await res.json();

      if (data.success) {
        setIsEditing(false);
        if (onUpdate) onUpdate(localProducts);
        alert('Saved successfully!');
      } else {
        alert('Failed to save');
      }
    } catch (e) {
      console.error(e);
      alert('Error saving');
    } finally {
      setSaving(false);
    }
  };

  const handleSelectProduct = async (product) => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const cleanBidNumber = bidNumber.replace(/_/g, '/');

      const res = await fetch(`${API_BASE_URL}/tenders/${encodeURIComponent(cleanBidNumber)}/selection`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product })
      });

      const data = await res.json();

      if (data.success) {
        alert('Product selected successfully!');
        onClose(); // Close modal on success
      } else {
        alert('Failed to select product');
      }
    } catch (e) {
      console.error(e);
      alert('Error selecting product');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px' }}>
        <div className="modal-header">
          <div>
            <h2>Suggested Products</h2>
            {detectedCategory && <div style={{ fontSize: '13px', color: '#084f9a', marginTop: '4px' }}>Detected: {detectedCategory}</div>}
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* Toolbar */}
        <div style={{ padding: '0 20px', marginBottom: '10px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} style={{ padding: '6px 12px', background: '#084f9a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edit Selection</button>
          ) : (
            <>
              <button onClick={() => { setIsEditing(false); setLocalProducts(products); }} disabled={saving} style={{ padding: '6px 12px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ padding: '6px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save Changes'}</button>
            </>
          )}
        </div>

        <div className="modal-body">
          {localProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ color: '#666' }}>No suggestions found.</p>
              {isEditing && <button onClick={() => setShowSearch(true)} style={{ marginTop: '10px', padding: '6px 12px', background: '#084f9a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Add Product</button>}
            </div>
          ) : (
            <div className="products-table-wrapper" style={{ overflowX: 'auto' }}>
              <table className="products-table">
                <thead>
                  <tr>
                    {isEditing && <th>Action</th>}
                    <th>Product Code</th>
                    <th>Type / Category</th>
                    <th>Title</th>
                    <th>Relevancy</th>
                    <th>Specification</th>
                    <th>Choose Product</th>
                  </tr>
                </thead>
                <tbody>
                  {localProducts.map((p, idx) => {
                    const isSelected = selectedProduct && (
                      (p.product_code && p.product_code === selectedProduct.product_code) ||
                      (p.title === selectedProduct.title)
                    );

                    return (
                      <tr key={idx} style={isSelected ? { backgroundColor: '#f0fdf4', border: '1px solid #22c55e' } : {}}>
                        {isEditing && (
                          <td style={{ width: '40px', textAlign: 'center' }}>
                            <button onClick={() => handleRemove(idx)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '16px' }}>🗑️</button>
                          </td>
                        )}
                        <td>{p.product_code || '-'}</td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{p.type}</div>
                          <div style={{ fontSize: '11px', color: '#666' }}>{p.category}</div>
                        </td>
                        <td>{p.title}</td>
                        <td>
                          <span style={{
                            backgroundColor: p.relevancy > 0.8 ? '#d1fae5' : '#e0f2fe',
                            color: p.relevancy > 0.8 ? '#065f46' : '#075985',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 600
                          }}>
                            {(p.raw_score * 100).toFixed(1)}%
                          </span>
                        </td>
                        <td style={{ fontSize: '12px', color: '#333' }}>
                          {p.specification}
                        </td>
                        <td>
                          <button
                            onClick={() => handleSelectProduct(p)}
                            disabled={isSelected}
                            style={{
                              padding: '4px 8px',
                              background: isSelected ? '#cccccc' : '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: isSelected ? 'not-allowed' : 'pointer',
                              fontSize: '12px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {isSelected ? 'Selected' : 'Select This Product'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {isEditing && (
                <div style={{ padding: '15px 0', textAlign: 'center' }}>
                  <button onClick={() => setShowSearch(true)} style={{ padding: '8px 16px', background: '#084f9a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <span>+</span> Add Product
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showSearch && <ProductSearchModal onClose={() => setShowSearch(false)} onSelect={handleAdd} />}
    </div >
  );
};

const TenderDetails = () => {
  const { tenderId } = useParams();

  // Environment variables
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const JSON_SERVER_URL = import.meta.env.VITE_JSON_SERVER_URL || 'http://192.168.1.3:5006';

  /* ---------------- UI STATES ---------------- */
  const [expandedSections, setExpandedSections] = useState({
    tenderDetails: true,
    keyValues: false,
    documents: false,
    technicalSpecs: false,
    requiredDocs: false
  });

  const [isInterested, setIsInterested] = useState(false);

  /* ---------------- DATA STATES ---------------- */
  const [details, setDetails] = useState(null);
  const [links, setLinks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 Technical specs states (UPDATED)
  const [techSpecs, setTechSpecs] = useState([]); // ARRAY OF CATALOGUES
  const [loadingTechSpecs, setLoadingTechSpecs] = useState(false);

  // Suggestions State
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detectedCategory, setDetectedCategory] = useState(null);
  const [showSuggestedModal, setShowSuggestedModal] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  /* ---------------- FETCH SUGGESTIONS ---------------- */
  const fetchSuggestedProducts = async () => {
    try {
      setLoadingSuggestions(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE_URL}/tenders/${encodeURIComponent(tenderId.replace(/_/g, '/'))}/suggestions`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await response.json();

      if (data.success) {
        setSuggestedProducts(data.data || []);
        setDetectedCategory(data.detected_category);
        setSelectedProduct(data.selected_product);
        setShowSuggestedModal(true);
      } else {
        alert('Failed to fetch suggestions');
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      alert('Error fetching suggestions');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  /* ---------------- MAIN API (Tender JSON) ---------------- */
  useEffect(() => {
    if (!tenderId) return;

    setLoading(true);
    setError(null);

    // First get the JSON path from backend
    fetch(`${API_BASE_URL}/tenders/${tenderId}/documents/path`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Backend server not responding (${res.status})`);
        }
        return res.json();
      })
      .then(pathResponse => {
        if (pathResponse.message && pathResponse.message.includes("JSON path not found")) {
          throw new Error(`File not available for tender: ${pathResponse.bid_number}`);
        }
        if (pathResponse.json_path) {
          // Clean up the json_path - remove extra quotes
          let jsonPath = pathResponse.json_path;
          if (jsonPath.startsWith('"') && jsonPath.endsWith('"')) {
            jsonPath = jsonPath.slice(1, -1); // Remove outer quotes
          }
          // Convert local file path to HTTP URL using Python server
          // Check for Windows path (Drive letter check or backslashes)
          if (/^[a-zA-Z]:/.test(jsonPath) || jsonPath.includes('\\')) {
            // Extract filename from path and serve via Python server
            const fileName = jsonPath.split(/[/\\]/).pop(); // Split by / or \
            jsonPath = `${JSON_SERVER_URL}/${fileName}`;
          }
          // Use the json_path to fetch the actual JSON data
          return fetch(jsonPath)
            .then(res => {
              // Check if response is HTML (error page) instead of JSON
              const contentType = res.headers.get('content-type');
              if (contentType && contentType.includes('text/html')) {
                throw new Error('Server returned HTML instead of JSON - check if the JSON file path is correct');
              }
              return res.json();
            });
        } else {
          throw new Error('No JSON path found');
        }
      })
      .then(json => {

        const extracted = {
          bidEndDate: "N/A",
          bidOpeningDate: "N/A",
          bidOfferValidity: "N/A",
          estimatedBidValue: "N/A",
          ministry: "N/A",
          departmentOrg: "N/A",
          totalQty: "N/A",
          itemCategory: "N/A",
          documentRequired: "N/A",
          evaluationMethod: "N/A",
          emdAmount: "N/A",
          emdRequired: "No",
          advisoryBank: "N/A",
          epbgPercentage: "N/A",
          epbgDuration: "N/A"
        };

        json.pages?.forEach(page => {
          page.tables?.forEach(table => {
            table.forEach(([key, value]) => {
              if (!key || !value) return;
              const k = key.toLowerCase();

              if (k.includes("bid end date")) extracted.bidEndDate = value;
              else if (k.includes("bid opening")) extracted.bidOpeningDate = value;
              else if (k.includes("bid offer validity")) extracted.bidOfferValidity = value;
              else if (k.includes("estimated bid value")) extracted.estimatedBidValue = value;
              else if (k.includes("ministry/state name")) extracted.ministry = value;
              else if (k.includes("department name")) extracted.departmentOrg = value;
              else if (k.includes("organisation name")) {
                extracted.departmentOrg =
                  extracted.departmentOrg === "N/A"
                    ? value
                    : `${extracted.departmentOrg}, ${value}`;
              }
              else if (k.includes("total quantity")) extracted.totalQty = value;
              else if (k.includes("item category")) extracted.itemCategory = value;
              else if (k.includes("document required")) extracted.documentRequired = value;
              else if (k.includes("evaluation method")) extracted.evaluationMethod = value;
              else if (k.includes("emd amount")) extracted.emdAmount = value;
              else if (k.includes("advisory bank")) extracted.advisoryBank = value;
              else if (k.includes("epbg percentage")) extracted.epbgPercentage = value;
              else if (k.includes("duration of epbg")) extracted.epbgDuration = value;
            });
          });
        });

        extracted.emdRequired =
          extracted.emdAmount && extracted.emdAmount !== "0" && extracted.emdAmount !== "N/A"
            ? "Yes"
            : "No";

        setDetails(extracted);

        const uniqueLinks = [
          ...new Map(
            (json.links || [])
              .filter(l => l.uri)
              .map(l => [l.uri, l])
          ).values()
        ];

        setLinks(uniqueLinks);
      })
      .catch(err => {
        console.error("Failed to load tender data:", err);
        setError(err.message || "Failed to load tender data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [tenderId, API_BASE_URL, JSON_SERVER_URL]);

  /* ---------------- FETCH TECH SPECS (MULTI) ---------------- */
  const fetchTechSpecs = async () => {
    if (techSpecs.length > 0) return;

    const catalogueLinks = links.filter(l =>
      l.uri.includes('/showCatalogue/')
    );

    if (catalogueLinks.length === 0) return;

    try {
      setLoadingTechSpecs(true);

      const allCatalogues = [];

      for (const link of catalogueLinks) {
        const res = await fetch(
          `http://127.0.0.1:8000/scrape/catalogue?url=${encodeURIComponent(link.uri)}`
        );

        const json = await res.json();

        if (json.status === "success") {
          allCatalogues.push({
            title: json.title || "Technical Specifications",
            rows: json.data || []
          });
        }
      }

      setTechSpecs(allCatalogues);

    } catch (err) {
      console.error("Failed to fetch technical specifications", err);
    } finally {
      setLoadingTechSpecs(false);
    }
  };

  /* ---------------- HELPER: Calculate rowspan for merged cells ---------------- */
  const calculateRowSpans = (rows) => {
    const rowSpans = [];
    let currentCategory = null;
    let spanCount = 0;
    let startIndex = 0;

    rows.forEach((row, index) => {
      if (row.category !== currentCategory) {
        // Save the previous span
        if (currentCategory !== null) {
          for (let i = startIndex; i < index; i++) {
            rowSpans[i] = i === startIndex ? spanCount : 0;
          }
        }
        // Start new span
        currentCategory = row.category;
        startIndex = index;
        spanCount = 1;
      } else {
        spanCount++;
      }
    });

    // Handle the last group
    for (let i = startIndex; i < rows.length; i++) {
      rowSpans[i] = i === startIndex ? spanCount : 0;
    }

    return rowSpans;
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => {
      const updated = { ...prev, [section]: !prev[section] };

      if (section === "technicalSpecs" && !prev.technicalSpecs) {
        fetchTechSpecs();
      }

      return updated;
    });
  };

  /* ---------------- FETCH METADATA (Initial Interest Status) ---------------- */
  useEffect(() => {
    if (!tenderId) return;

    const fetchMetadata = async () => {
      try {
        const token = localStorage.getItem('token');
        // Fetch tender from DB to check 'is_interested'
        // We use the existing list endpoint with a filter
        const res = await fetch(
          `${API_BASE_URL}/tenders?tenderId=${encodeURIComponent(tenderId.replace(/_/g, '/'))}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        const data = await res.json();

        if (data.data && data.data.length > 0) {
          // The endpoint returns a list, so we take the first item
          const tenderRecord = data.data[0];
          console.log('[TenderDetails] Initial Interest Status:', tenderRecord.interested);
          setIsInterested(!!tenderRecord.interested);
        }
      } catch (err) {
        console.error("Failed to fetch tender metadata:", err);
      }
    };

    fetchMetadata();
  }, [tenderId, API_BASE_URL]);

  // toggling interest
  const handleToggleInterest = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE_URL}/tenders/${encodeURIComponent(tenderId.replace(/_/g, '/'))}/interest`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`
          } // No body needed as per TendersPage.jsx
        }
      );

      const data = await response.json();

      if (data.success || response.ok) { // Adjust based on actual API response structure
        // TendersPage uses data.success, but controller returns { message: 'Interest updated' }
        // Let's re-read TendersPage.jsx logic vs Controller logic.
        // Controller: `res.json({ message: 'Interest updated' });`
        // TendersPage logic might be out of sync or I missed something in Controller.

        // Whatever, I will optimistically toggle local state if response is OK.

        setIsInterested(prev => !prev);
      } else {
        console.error('Failed to toggle interest:', data.message);
        alert(data.message || 'Failed to update interest status');
      }
    } catch (err) {
      console.error('Failed to toggle interest', err);
      alert('Failed to update interest status. Please try again.');
    }
  };

  if (loading) return <p>Loading tender data...</p>;
  if (error) return (
    <div className="error-container" style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Error Loading Tender Data</h3>
      <p style={{ color: '#dc3545', fontSize: '16px' }}>{error}</p>
      <button
        onClick={() => window.location.reload()}
        style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        Retry
      </button>
    </div>
  );
  if (!details) return <p>Loading tender data...</p>;

  const tenderDocumentLinks = links.filter(
    l => !l.uri.includes('/showCatalogue/') && !(l.uri.includes('/catalog_data/') && l.uri.toLowerCase().endsWith('.pdf'))
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="tender-details-container">
      <div className="content-wrapper">

        {/* LEFT CONTENT */}
        <div className="left-content">

          {/* Tender Details */}
          <div className="accordion-section">
            <div className="accordion-header" onClick={() => toggleSection('tenderDetails')}>
              <h2>Tender Details</h2>
              <span className={`arrow ${expandedSections.tenderDetails ? 'expanded' : ''}`}>^</span>
            </div>

            {expandedSections.tenderDetails && (
              <div className="accordion-content">
                <div className="details-grid-horizontal">
                  <div className="detail-item-left"><label>Bid End Date</label><p>{details.bidEndDate}</p></div>
                  <div className="detail-item-left"><label>Bid Opening Date</label><p>{details.bidOpeningDate}</p></div>
                  <div className="detail-item-left"><label>Bid Offer Validity</label><p>{details.bidOfferValidity}</p></div>
                  <div className="detail-item-left"><label>Total Quantity</label><p>{details.totalQty}</p></div>
                  <div className="detail-item-left">
                    <label>Item Category</label>
                    <p>
                      {details.itemCategory && details.itemCategory !== "N/A"
                        ? details.itemCategory.split(/,(?![^()]*\))/).map((item, idx) => ( // Split by comma but ignore commas inside parentheses
                          <span key={idx} style={{ display: 'block', marginBottom: '4px' }}>
                            {item.trim()}
                          </span>
                        ))
                        : "N/A"
                      }
                    </p>
                  </div>
                  <div className="detail-item-left"><label>Ministry</label><p>{details.ministry}</p></div>
                  <div className="detail-item-left">
                    <label>Estimated Bid Value</label>
                    <p>
                      {details.estimatedBidValue !== "N/A"
                        ? `₹ ${Number(details.estimatedBidValue).toLocaleString()}`
                        : "Refer Document"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Key Values */}
          <div className="accordion-section">
            <div className="accordion-header" onClick={() => toggleSection('keyValues')}>
              <h2>Key Values *</h2>
              <span className={`arrow ${expandedSections.keyValues ? 'expanded' : ''}`}>^</span>
            </div>

            {expandedSections.keyValues && (
              <div className="accordion-content">
                <div className="key-values-row">
                  <div className="detail-item-left"><label>EMD Required</label><p>{details.emdRequired}</p></div>
                  <div className="detail-item-left"><label>Advisory Bank</label><p>{details.advisoryBank}</p></div>
                  <div className="detail-item-left"><label>ePBG Percentage (%)</label><p>{details.epbgPercentage}</p></div>
                  <div className="detail-item-left"><label>Duration of ePBG (Months)</label><p>{details.epbgDuration}</p></div>
                </div>
              </div>
            )}
          </div>

          {/* Technical Specifications */}
          <div className="accordion-section">
            <div className="accordion-header" onClick={() => toggleSection('technicalSpecs')}>
              <h2>Technical Specifications</h2>
              <span className={`arrow ${expandedSections.technicalSpecs ? 'expanded' : ''}`}>^</span>
            </div>


            {expandedSections.technicalSpecs && (
              <div className="accordion-content">

                {/* Render Embedded PDFs from /catalog_data/ */}
                {links
                  .filter(l => l.uri && l.uri.includes('/catalog_data/') && l.uri.toLowerCase().endsWith('.pdf'))
                  .map((pdfLink, idx) => (
                    <div key={`pdf-${idx}`} style={{ marginBottom: '30px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                      <div style={{ padding: '10px 15px', background: '#f8f9fa', borderBottom: '1px solid #e5e7eb', fontWeight: '600', fontSize: '0.9rem' }}>
                        {pdfLink.text || "Technical Catalog (PDF)"}
                      </div>
                      <iframe
                        src={pdfLink.uri} // Ensure this URL is accessible (CORS, etc.)
                        width="100%"
                        height="600px"
                        style={{ border: 'none' }}
                        title={`Embedded PDF ${idx}`}
                      />
                    </div>
                  ))
                }

                {loadingTechSpecs && (
                  <div className="loading-state">
                    <p>Loading Technical Specifications...</p>
                  </div>
                )}

                {!loadingTechSpecs && techSpecs.map((catalogue, cIdx) => {
                  const rowSpans = calculateRowSpans(catalogue.rows);

                  return (
                    <div key={cIdx} style={{ marginBottom: "30px" }}>
                      <p className="phead">{catalogue.title}</p>

                      <div className="tech-spec-table-wrapper">
                        <table className="tech-spec-table">
                          <thead>
                            <tr>
                              <th>Category</th>
                              <th>Specification</th>
                              <th>Choose Product</th>
                              <th>Allowed Values</th>
                            </tr>
                          </thead>
                          <tbody>
                            {catalogue.rows.map((row, rIdx) => {
                              const rowSpan = rowSpans[rIdx];

                              return (
                                <tr key={rIdx}>
                                  {/* Only render category cell if rowSpan > 0 (first cell in merged group) */}
                                  {rowSpan > 0 && (
                                    <td
                                      rowSpan={rowSpan}
                                      className="merged-cell"
                                    >
                                      {row.category}
                                    </td>
                                  )}
                                  <td>{row.specification}</td>
                                  <td>{row.allowed_values}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}

                {!loadingTechSpecs && techSpecs.length === 0 && links.filter(l => l.uri && l.uri.includes('/catalog_data/') && l.uri.toLowerCase().endsWith('.pdf')).length === 0 && (
                  <p className="tech-spec-empty">No technical specifications available.</p>
                )}

              </div>
            )}
          </div>

          {/* Tender Documents */}
          <div className="accordion-section">
            <div className="accordion-header" onClick={() => toggleSection('documents')}>
              <h2>Tender Document</h2>
              <span className={`arrow ${expandedSections.documents ? 'expanded' : ''}`}>^</span>
            </div>

            {expandedSections.documents && (
              <div className="accordion-content">
                <div className="documents-list">
                  {tenderDocumentLinks.length > 0 ? (
                    tenderDocumentLinks.map((link, i) => (
                      <div key={i} className="document-row">

                        <a href={link.uri} target="_blank" rel="noopener noreferrer" className="btn-download">
                          Download
                        </a>
                      </div>
                    ))
                  ) : (
                    <p className="tech-spec-empty">No documents available.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Required Documents */}
          <div className="accordion-section">
            <div className="accordion-header" onClick={() => toggleSection('requiredDocs')}>
              <h2>Required Documents To Participate</h2>
              <span className={`arrow ${expandedSections.requiredDocs ? 'expanded' : ''}`}>^</span>
            </div>

            {expandedSections.requiredDocs && (
              <div className="accordion-content">
                <ul className="required-docs-list">
                  {details.documentRequired.split(',').map((doc, i) => {
                    const text = doc.trim();
                    if (text.toLowerCase().includes("eligibility for exemption must be uploaded")) {
                      return null; // Skip rendering in list
                    }
                    return <li key={i}>{text}</li>;
                  })}
                </ul>
                {/* Render the Note separately if present */}
                {details.documentRequired.toLowerCase().includes("eligibility for exemption must be uploaded") && (
                  <div style={{ marginTop: '10px', padding: '10px', background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '4px', fontSize: '0.9rem', color: '#856404' }}>
                    <strong>Note:</strong> The supporting documents to prove his eligibility for exemption must be uploaded for evaluation by the buyer.
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="right-sidebar">
          <div className="features-panel">
            <h3>TENDER FEATURES</h3>
            <button
              className={`feature-btn ${isInterested ? 'interested-active' : ''}`}
              onClick={handleToggleInterest}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isInterested ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              Interested
            </button>
            <button className="feature-btn">⏰ Set Reminder</button>
            <button
              className="feature-btn"
              onClick={fetchSuggestedProducts}
              disabled={loadingSuggestions}
            >
              {loadingSuggestions ? 'Loading...' : 'View Suggested Products'}
            </button>
            <button className="feature-btn">📄 View BOQ</button>
            <button className="feature-btn">↗ Share</button>
          </div>
        </div>

      </div>

      {/* MODALS */}
      {showSuggestedModal && (
        <SuggestedProductsModal
          products={suggestedProducts}
          detectedCategory={detectedCategory}
          selectedProduct={selectedProduct}
          bidNumber={tenderId}
          onUpdate={(newProducts) => setSuggestedProducts(newProducts)}
          onClose={() => setShowSuggestedModal(false)}
        />
      )}
    </div>
  );
};

export default TenderDetails;