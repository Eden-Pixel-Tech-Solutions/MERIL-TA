// src/pages/Insights/WinningProbability.jsx
// Route: /insights/winning-probability

import React, { useState } from 'react';
import '../../assets/css/WinningProbability.css';

const WinningProbability = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedRange, setSelectedRange] = useState('all');

  const insights = [
    {
      id: 1,
      title: 'AIIMS Delhi - Cardiac Stents Procurement',
      department: 'Cardiology',
      probability: 87,
      value: '₹45,00,000',
      factors: 'Strong past performance, competitive pricing',
      icon: '🎯'
    },
    {
      id: 2,
      title: 'Safdarjung Hospital - Orthopedic Implants',
      department: 'Orthopedics',
      probability: 72,
      value: '₹32,00,000',
      factors: 'Good product match, moderate competition',
      icon: '📊'
    },
    {
      id: 3,
      title: 'Apollo Hospital - Surgical Instruments',
      department: 'Surgery',
      probability: 65,
      value: '₹28,50,000',
      factors: 'High competition, average pricing',
      icon: '⚕️'
    },
    {
      id: 4,
      title: 'Max Healthcare - Diagnostic Equipment',
      department: 'Radiology',
      probability: 91,
      value: '₹78,00,000',
      factors: 'Excellent track record, unique product advantage',
      icon: '🏆'
    },
    {
      id: 5,
      title: 'Fortis Hospital - ICU Consumables',
      department: 'Critical Care',
      probability: 58,
      value: '₹19,00,000',
      factors: 'New client, pricing challenges',
      icon: '📈'
    }
  ];

  const InsightCard = ({ insight }) => {
    const getProbabilityColor = (prob) => {
      if (prob >= 80) return 'high';
      if (prob >= 60) return 'medium';
      return 'low';
    };

    return (
      <div className="insight-card">
        <div className="card-header">
          <span className="card-icon">{insight.icon}</span>
          <div className="card-title-section">
            <h3>{insight.title}</h3>
            <span className="department-badge">{insight.department}</span>
          </div>
        </div>
        <div className="card-body">
          <div className="probability-section">
            <div className="probability-meter">
              <div 
                className={`probability-fill ${getProbabilityColor(insight.probability)}`}
                style={{ width: `${insight.probability}%` }}
              ></div>
            </div>
            <span className="probability-text">{insight.probability}% Win Probability</span>
          </div>
          <div className="info-row">
            <div className="info-item">
              <span className="info-label">Tender Value</span>
              <span className="info-value">{insight.value}</span>
            </div>
          </div>
          <div className="factors">
            <span className="factors-label">Key Factors:</span>
            <p>{insight.factors}</p>
          </div>
        </div>
        <div className="card-footer">
          <button 
            className="view-details-btn"
            onClick={() => console.log('Viewing details for:', insight.title)}
          >
            View Details
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="winning-probability-page">
      <div className="page-header">
        <h1>Winning Probability</h1>
        <p className="page-description">
          AI-powered analysis predicting your chances of winning each tender based on historical data, 
          competitor analysis, and market conditions.
        </p>
      </div>

      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search tenders by name, department, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filters-bar">
        <select 
          className="filter-dropdown"
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
        >
          <option value="all">All Departments</option>
          <option value="cardiology">Cardiology</option>
          <option value="orthopedics">Orthopedics</option>
          <option value="surgery">Surgery</option>
          <option value="radiology">Radiology</option>
        </select>

        <select 
          className="filter-dropdown"
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
        >
          <option value="all">All Probabilities</option>
          <option value="high">High (80%+)</option>
          <option value="medium">Medium (60-79%)</option>
          <option value="low">Low (&lt;60%)</option>
        </select>

        <button 
          className="filter-btn"
          onClick={() => console.log('Applying filters:', { selectedDept, selectedRange })}
        >
          Apply Filters
        </button>
      </div>

      <div className="insights-grid">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
};

export default WinningProbability;