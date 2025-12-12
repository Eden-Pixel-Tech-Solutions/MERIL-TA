// src/pages/Insights/CompetitorAnalysis.jsx
// Route: /insights/competitor-analysis

import React, { useState } from 'react';
import '../../assets/css/CompetitorAnalysis.css';

const CompetitorAnalysis = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  const competitors = [
    {
      id: 1,
      name: 'MedTech Solutions Pvt Ltd',
      category: 'Cardiac Devices',
      marketShare: 34,
      avgBidPrice: '₹42,00,000',
      winRate: 68,
      activeTenders: 12,
      strengths: 'Strong pricing, established relationships',
      icon: '🏢'
    },
    {
      id: 2,
      name: 'BioMed Industries',
      category: 'Orthopedic Implants',
      marketShare: 28,
      avgBidPrice: '₹38,50,000',
      winRate: 72,
      activeTenders: 9,
      strengths: 'Premium quality, innovative products',
      icon: '🏭'
    },
    {
      id: 3,
      name: 'HealthCare Distributors',
      category: 'Surgical Equipment',
      marketShare: 22,
      avgBidPrice: '₹31,00,000',
      winRate: 55,
      activeTenders: 15,
      strengths: 'Wide distribution network',
      icon: '🏪'
    },
    {
      id: 4,
      name: 'Advanced Medical Corp',
      category: 'Diagnostic Systems',
      marketShare: 41,
      avgBidPrice: '₹65,00,000',
      winRate: 79,
      activeTenders: 7,
      strengths: 'Technology leadership, R&D capabilities',
      icon: '🔬'
    },
    {
      id: 5,
      name: 'PharmaSupply Co',
      category: 'Medical Consumables',
      marketShare: 19,
      avgBidPrice: '₹22,00,000',
      winRate: 61,
      activeTenders: 18,
      strengths: 'Cost efficiency, bulk supply',
      icon: '📦'
    }
  ];

  const InsightCard = ({ competitor }) => {
    return (
      <div className="competitor-card">
        <div className="card-header">
          <span className="card-icon">{competitor.icon}</span>
          <div className="card-title-section">
            <h3>{competitor.name}</h3>
            <span className="category-badge">{competitor.category}</span>
          </div>
        </div>
        <div className="card-body">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Market Share</span>
              <span className="stat-value">{competitor.marketShare}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Win Rate</span>
              <span className="stat-value">{competitor.winRate}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Avg Bid Price</span>
              <span className="stat-value">{competitor.avgBidPrice}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active Tenders</span>
              <span className="stat-value">{competitor.activeTenders}</span>
            </div>
          </div>
          <div className="strengths-box">
            <span className="strengths-label">Key Strengths:</span>
            <p>{competitor.strengths}</p>
          </div>
        </div>
        <div className="card-footer">
          <button 
            className="view-details-btn"
            onClick={() => console.log('Viewing competitor:', competitor.name)}
          >
            View Full Analysis
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="competitor-analysis-page">
      <div className="page-header">
        <h1>Competitor Analysis</h1>
        <p className="page-description">
          Comprehensive insights into competitor performance, pricing strategies, and market positioning 
          to help you make informed bidding decisions.
        </p>
      </div>

      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search competitors by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filters-bar">
        <select 
          className="filter-dropdown"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="cardiac">Cardiac Devices</option>
          <option value="orthopedic">Orthopedic Implants</option>
          <option value="surgical">Surgical Equipment</option>
          <option value="diagnostic">Diagnostic Systems</option>
        </select>

        <select 
          className="filter-dropdown"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
          <option value="2years">Last 2 Years</option>
        </select>

        <button 
          className="filter-btn"
          onClick={() => console.log('Applying filters:', { selectedCategory, selectedPeriod })}
        >
          Apply Filters
        </button>
      </div>

      <div className="insights-grid">
        {competitors.map((competitor) => (
          <InsightCard key={competitor.id} competitor={competitor} />
        ))}
      </div>
    </div>
  );
};

export default CompetitorAnalysis;