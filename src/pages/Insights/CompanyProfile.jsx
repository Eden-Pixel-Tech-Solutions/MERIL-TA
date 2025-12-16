import React, { useState } from 'react';
import '../../assets/css/CompanyProfile.css';

const TenderSystem = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedTender, setSelectedTender] = useState(null);
  const [activeFilter, setActiveFilter] = useState('participated');
  const [dateFrom, setDateFrom] = useState('2014-09-01');
  const [dateTo, setDateTo] = useState('2023-08-31');
  const [likedTenders, setLikedTenders] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    tenderDetails: false,
    datesValue: false,
    bidders: false,
    documents: false,
    biddersReport: false,
    similarResult: false,
    disclaimer: false
  });

  const allTenderData = [
    {
      id: 'D95695',
      title: 'Custom Bid For Services - Implementation Of Online Post Contract Monitoring Cum Bill Processing System',
      location: 'Kolkata, West Bengal',
      ministry: 'Ministry Of Defence',
      govType: 'Central Government',
      stage: 'Financial',
      stageLabel: 'Refer To Document',
      date: '2023-06-23',
      displayDate: '23-06-2023',
      estimatedValue: 'Refer To Documents',
      contractor: 'J.V.Gokal And Company Private Limited',
      contractValue: '₹ 29,00,30,04,211.00',
      relatedKeywords: ['Dumper', 'Machinery Spares', 'Consumable Item']
    },
    {
      id: '831573',
      title: 'Custom Bid For Services - Engagement Of Service Provider For Providing E-Procurement Services',
      location: 'Bangalore, Karnataka',
      ministry: 'Ministry Of Petroleum And Natural Gas',
      govType: 'Central Government',
      stage: 'Technical',
      stageLabel: 'Refer To Document',
      date: '2023-06-05',
      displayDate: '05-06-2023',
      estimatedValue: 'Refer To Documents',
      contractor: 'Tech Solutions India Pvt Ltd',
      contractValue: '₹ 15,50,00,00,000.00',
      relatedKeywords: ['E-Procurement', 'Software Services', 'Technical Support']
    }
  ];

  const filteredTenderData = allTenderData.filter(tender => {
    const tenderDate = new Date(tender.date);
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    return tenderDate >= fromDate && tenderDate <= toDate;
  });

  const toggleLike = (tenderId) => {
    setLikedTenders(prev => 
      prev.includes(tenderId) 
        ? prev.filter(id => id !== tenderId)
        : [...prev, tenderId]
    );
  };

  const downloadCSV = (tender) => {
    const csvContent = [
      ['Field', 'Value'],
      ['Result ID', tender.id],
      ['Title', tender.title],
      ['Location', tender.location],
      ['Ministry', tender.ministry],
      ['Government Type', tender.govType],
      ['Stage', tender.stage],
      ['Date', tender.displayDate],
      ['Estimated Value', tender.estimatedValue],
      ['Contractor', tender.contractor],
      ['Contract Value', tender.contractValue],
      ['Keywords', tender.relatedKeywords.join(', ')]
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tender_${tender.id}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = (tender) => {
    const url = `${window.location.origin}?tender=${tender.id}`;
    setShareUrl(url);
    setShowShareModal(true);
  };

  const shareToSocial = (platform) => {
    const text = `Check out this tender: ${selectedTender?.title || 'Tender Details'}`;
    const url = shareUrl;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      email: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleViewMore = (tender) => {
    setSelectedTender(tender);
    setCurrentView('detail');
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedTender(null);
    setExpandedSections({
      tenderDetails: false,
      datesValue: false,
      bidders: false,
      documents: false,
      biddersReport: false,
      similarResult: false,
      disclaimer: false
    });
  };

  if (currentView === 'detail' && selectedTender) {
    return (
      <div className="tender-page">
        <div className="tender-header">
          <button className="btn-back" onClick={handleBack}>
            ← Back to List
          </button>
          <h2>Tender Detail</h2>
          <div className="date-badge">{dateFrom.split('-').reverse().join('/')} → {dateTo.split('-').reverse().join('/')}</div>
        </div>

        <div className="detail-layout">
          <div className="detail-main">
            <div className="accordion-card">
              <div 
                className={`accordion-header ${expandedSections.tenderDetails ? 'active' : ''}`}
                onClick={() => toggleSection('tenderDetails')}
              >
                <span>Tender Details</span>
                <span className="accordion-toggle">{expandedSections.tenderDetails ? '−' : '+'}</span>
              </div>
              {expandedSections.tenderDetails && (
                <div className="accordion-body">
                  <div className="info-row">
                    <span className="info-label">Result ID:</span>
                    <span className="info-value">{selectedTender.id}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Title:</span>
                    <span className="info-value">{selectedTender.title}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Location:</span>
                    <span className="info-value">{selectedTender.location}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Ministry:</span>
                    <span className="info-value">{selectedTender.ministry}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="accordion-card">
              <div 
                className={`accordion-header ${expandedSections.datesValue ? 'active' : ''}`}
                onClick={() => toggleSection('datesValue')}
              >
                <span>Dates & Value</span>
                <span className="accordion-toggle">{expandedSections.datesValue ? '−' : '+'}</span>
              </div>
              {expandedSections.datesValue && (
                <div className="accordion-body">
                  <div className="info-row">
                    <span className="info-label">Date:</span>
                    <span className="info-value">{selectedTender.displayDate}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Estimated Value:</span>
                    <span className="info-value">{selectedTender.estimatedValue}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Stage:</span>
                    <span className="info-value">
                      <span className="stage-tag">{selectedTender.stage}</span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="accordion-card">
              <div 
                className={`accordion-header ${expandedSections.bidders ? 'active' : ''}`}
                onClick={() => toggleSection('bidders')}
              >
                <span>List Of Bidders</span>
                <span className="accordion-toggle">{expandedSections.bidders ? '−' : '+'}</span>
              </div>
              {expandedSections.bidders && (
                <div className="accordion-body">
                  <p>Total bidders information available in documents section.</p>
                </div>
              )}
            </div>

            <div className="accordion-card">
              <div 
                className={`accordion-header ${expandedSections.documents ? 'active' : ''}`}
                onClick={() => toggleSection('documents')}
              >
                <span>Result Document Download</span>
                <span className="accordion-toggle">{expandedSections.documents ? '−' : '+'}</span>
              </div>
              {expandedSections.documents && (
                <div className="accordion-body">
                  <button className="btn-download">Download Tender Documents</button>
                </div>
              )}
            </div>

            <div className="accordion-card">
              <div 
                className={`accordion-header ${expandedSections.biddersReport ? 'active' : ''}`}
                onClick={() => toggleSection('biddersReport')}
              >
                <span>Bidders Report</span>
                <span className="accordion-toggle">{expandedSections.biddersReport ? '−' : '+'}</span>
              </div>
              {expandedSections.biddersReport && (
                <div className="accordion-body">
                  <p>Detailed bidders report available upon request.</p>
                </div>
              )}
            </div>

            <div className="accordion-card">
              <div 
                className={`accordion-header ${expandedSections.similarResult ? 'active' : ''}`}
                onClick={() => toggleSection('similarResult')}
              >
                <span>Similar Result</span>
                <span className="accordion-toggle">{expandedSections.similarResult ? '−' : '+'}</span>
              </div>
              {expandedSections.similarResult && (
                <div className="accordion-body">
                  <p>No similar results found at this time.</p>
                </div>
              )}
            </div>

            <div className="accordion-card">
              <div 
                className={`accordion-header ${expandedSections.disclaimer ? 'active' : ''}`}
                onClick={() => toggleSection('disclaimer')}
              >
                <span>Disclaimer</span>
                <span className="accordion-toggle">{expandedSections.disclaimer ? '−' : '+'}</span>
              </div>
              {expandedSections.disclaimer && (
                <div className="accordion-body">
                  <p>All information provided is for reference purposes only. Please verify details from official sources.</p>
                </div>
              )}
            </div>
          </div>

          <div className="detail-sidebar">
            <div className="contractor-box">
              <div className="trophy">🏆</div>
              <h3>Contractor Details</h3>
              <p className="contractor-name">{selectedTender.contractor}</p>
              <p className="contractor-amount">{selectedTender.contractValue}</p>
            </div>

            <div className="keywords-box">
              <h4>Related Keywords</h4>
              <ul className="keywords">
                {selectedTender.relatedKeywords.map((keyword, index) => (
                  <li key={index}>{keyword}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tender-page">
      <div className="tender-header">
        <h2>Company Profile</h2>
        <div className="date-filter">
          <input 
            type="date" 
            value={dateFrom} 
            onChange={(e) => setDateFrom(e.target.value)}
            className="date-input"
          />
          <span>→</span>
          <input 
            type="date" 
            value={dateTo} 
            onChange={(e) => setDateTo(e.target.value)}
            className="date-input"
          />
        </div>
      </div>

      <div className="filter-bar">
        <span className="filter-label">Filter By:</span>
        <button 
          className={`filter-tab ${activeFilter === 'participated' ? 'active' : ''}`}
          onClick={() => setActiveFilter('participated')}
        >
          Participated Tenders (10)
        </button>
        <button 
          className={`filter-tab ${activeFilter === 'awarded' ? 'active' : ''}`}
          onClick={() => setActiveFilter('awarded')}
        >
          Awarded Tenders
        </button>
        <button 
          className={`filter-tab ${activeFilter === 'lost' ? 'active' : ''}`}
          onClick={() => setActiveFilter('lost')}
        >
          Lost Tenders
        </button>
        <button 
          className={`filter-tab ${activeFilter === 'result' ? 'active' : ''}`}
          onClick={() => setActiveFilter('result')}
        >
          Result TBA
        </button>
      </div>

      <div className="info-box">
        Result which are under evaluation of search company profile
      </div>

      <div className="tender-list">
        {filteredTenderData.length === 0 ? (
          <div className="no-data">No tenders found in the selected date range.</div>
        ) : (
          filteredTenderData.map((tender, index) => (
            <div key={tender.id} className="tender-item">
              <div className="tender-top">
                <div className="tender-id-section">
                  <span className="tender-label">{index + 1}) Result ID:</span>
                  <span className="tender-id">{tender.id}</span>
                </div>
                <div className="tender-badges">
                  <span className={`stage-badge stage-${tender.stage.toLowerCase()}`}>
                    Stage: {tender.stage}
                  </span>
                  <span className="stage-note">({tender.stageLabel})</span>
                  <span className="tender-date">{tender.displayDate}</span>
                </div>
              </div>

              <h3 className="tender-title">{tender.title}</h3>

              <div className="tender-details">
                <div className="detail-item">
                  <span className="detail-icon">📍</span>
                  <span>{tender.location}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🏛️</span>
                  <span>{tender.ministry}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🏢</span>
                  <span>{tender.govType}</span>
                </div>
              </div>

              <div className="tender-bottom">
                <button className="link-button">👥 List Of Bidders</button>
                <div className="bottom-right">
                  <span className="estimated">
                    Estimated Value<br/>
                    <strong>{tender.estimatedValue}</strong>
                  </span>
                  <div className="action-btns">
                    <button 
                      className={`icon-button ${likedTenders.includes(tender.id) ? 'liked' : ''}`}
                      onClick={() => toggleLike(tender.id)}
                      title="Like"
                    >
                      ♥
                    </button>
                    <button 
                      className="icon-button" 
                      onClick={() => downloadCSV(tender)}
                      title="Save as CSV"
                    >
                      💾
                    </button>
                    <button 
                      className="icon-button" 
                      onClick={() => handleShare(tender)}
                      title="Share"
                    >
                      📤
                    </button>
                    <button 
                      className="btn-view-more"
                      onClick={() => handleViewMore(tender)}
                    >
                      View More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Share Tender</h3>
              <button className="modal-close" onClick={() => setShowShareModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="share-link">
                <input type="text" value={shareUrl} readOnly />
                <button onClick={copyToClipboard}>Copy</button>
              </div>
              <div className="social-buttons">
                <button className="social-btn facebook" onClick={() => shareToSocial('facebook')}>
                  📘 Facebook
                </button>
                <button className="social-btn twitter" onClick={() => shareToSocial('twitter')}>
                  🐦 Twitter
                </button>
                <button className="social-btn linkedin" onClick={() => shareToSocial('linkedin')}>
                  💼 LinkedIn
                </button>
                <button className="social-btn whatsapp" onClick={() => shareToSocial('whatsapp')}>
                  💬 WhatsApp
                </button>
                <button className="social-btn telegram" onClick={() => shareToSocial('telegram')}>
                  ✈️ Telegram
                </button>
                <button className="social-btn email" onClick={() => shareToSocial('email')}>
                  ✉️ Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenderSystem;