// src/pages/Insights/BOQInsights.jsx
// Route: /insights/boq-insights

import React, { useState } from 'react';
import '../../assets/css/BOQInsights.css';

const BOQInsights = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplexity, setSelectedComplexity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const boqData = [
    {
      id: 1,
      tenderName: 'AIIMS Delhi - Medical Equipment Supply',
      totalItems: 45,
      matchedItems: 42,
      unmatchedItems: 3,
      complexity: 'Medium',
      estimatedTotal: '₹52,00,000',
      keyInsight: '93% items matched - strong coverage',
      icon: '📋'
    },
    {
      id: 2,
      tenderName: 'Max Hospital - Surgical Consumables',
      totalItems: 78,
      matchedItems: 65,
      unmatchedItems: 13,
      complexity: 'High',
      estimatedTotal: '₹38,50,000',
      keyInsight: '83% coverage - consider partnerships for gaps',
      icon: '📊'
    },
    {
      id: 3,
      tenderName: 'Apollo Hospitals - Orthopedic Bundle',
      totalItems: 32,
      matchedItems: 32,
      unmatchedItems: 0,
      complexity: 'Low',
      estimatedTotal: '₹41,00,000',
      keyInsight: '100% match - excellent bid opportunity',
      icon: '✅'
    },
    {
      id: 4,
      tenderName: 'Fortis Healthcare - Cardiac Care Package',
      totalItems: 56,
      matchedItems: 48,
      unmatchedItems: 8,
      complexity: 'Medium',
      estimatedTotal: '₹67,00,000',
      keyInsight: '86% items matched - good opportunity',
      icon: '💼'
    },
    {
      id: 5,
      tenderName: 'Safdarjung Hospital - ICU Setup',
      totalItems: 92,
      matchedItems: 71,
      unmatchedItems: 21,
      complexity: 'High',
      estimatedTotal: '₹89,00,000',
      keyInsight: '77% coverage - review unmatched items urgently',
      icon: '🏥'
    }
  ];

  const InsightCard = ({ boq }) => {
    const getMatchPercentage = () => {
      return Math.round((boq.matchedItems / boq.totalItems) * 100);
    };

    const getComplexityColor = (complexity) => {
      if (complexity === 'Low') return 'low';
      if (complexity === 'Medium') return 'medium';
      return 'high';
    };

    return (
      <div className="boq-card">
        <div className="card-header">
          <span className="card-icon">{boq.icon}</span>
          <div className="card-title-section">
            <h3>{boq.tenderName}</h3>
            <span className={`complexity-badge ${getComplexityColor(boq.complexity)}`}>
              {boq.complexity} Complexity
            </span>
          </div>
        </div>
        <div className="card-body">
          <div className="match-visualization">
            <div className="match-bar">
              <div 
                className="match-fill"
                style={{ width: `${getMatchPercentage()}%` }}
              ></div>
            </div>
            <span className="match-percentage">{getMatchPercentage()}% Items Matched</span>
          </div>
          <div className="boq-stats">
            <div className="stat-item">
              <span className="stat-label">Total Items</span>
              <span className="stat-value">{boq.totalItems}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Matched</span>
              <span className="stat-value matched">{boq.matchedItems}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Unmatched</span>
              <span className="stat-value unmatched">{boq.unmatchedItems}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Est. Total</span>
              <span className="stat-value">{boq.estimatedTotal}</span>
            </div>
          </div>
          <div className="insight-box">
            <span className="insight-label">Key Insight:</span>
            <p>{boq.keyInsight}</p>
          </div>
        </div>
        <div className="card-footer">
          <button 
            className="view-details-btn"
            onClick={() => console.log('Viewing BOQ details:', boq.tenderName)}
          >
            View Full BOQ
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="boq-insights-page">
      <div className="page-header">
        <h1>BOQ Insights</h1>
        <p className="page-description">
          Detailed Bill of Quantities analysis showing item-level matching with your product catalog, 
          helping identify coverage gaps and optimization opportunities.
        </p>
      </div>

      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search tenders by name or hospital..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filters-bar">
        <select 
          className="filter-dropdown"
          value={selectedComplexity}
          onChange={(e) => setSelectedComplexity(e.target.value)}
        >
          <option value="all">All Complexity Levels</option>
          <option value="low">Low Complexity</option>
          <option value="medium">Medium Complexity</option>
          <option value="high">High Complexity</option>
        </select>

        <select 
          className="filter-dropdown"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All Match Rates</option>
          <option value="excellent">Excellent (90%+)</option>
          <option value="good">Good (80-89%)</option>
          <option value="average">Average (70-79%)</option>
          <option value="poor">Below Average (&lt;70%)</option>
        </select>

        <button 
          className="filter-btn"
          onClick={() => console.log('Applying filters:', { selectedComplexity, selectedStatus })}
        >
          Apply Filters
        </button>
      </div>

      <div className="insights-grid">
        {boqData.map((boq) => (
          <InsightCard key={boq.id} boq={boq} />
        ))}
      </div>
    </div>
  );
};

export default BOQInsights;