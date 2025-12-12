// src/pages/Insights/RiskScore.jsx
// Route: /insights/risk-score

import React, { useState } from 'react';
import '../../assets/css/RiskScore.css';

const RiskScore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const riskAssessments = [
    {
      id: 1,
      tenderName: 'AIIMS Delhi - Cardiac Stents Procurement',
      overallRisk: 25,
      riskLevel: 'Low',
      factors: {
        payment: 15,
        competition: 35,
        compliance: 20,
        delivery: 30
      },
      keyRisks: ['High competition', 'Tight delivery schedule'],
      mitigations: 'Strong relationship with client, proven track record',
      icon: '🟢'
    },
    {
      id: 2,
      tenderName: 'Max Hospital - Orthopedic Implants',
      overallRisk: 58,
      riskLevel: 'Medium',
      factors: {
        payment: 45,
        competition: 60,
        compliance: 55,
        delivery: 72
      },
      keyRisks: ['Payment delays history', 'Complex logistics', 'Multiple competitors'],
      mitigations: 'Consider payment guarantees, partner with logistics provider',
      icon: '🟡'
    },
    {
      id: 3,
      tenderName: 'Apollo Hospitals - Surgical Equipment',
      overallRisk: 18,
      riskLevel: 'Low',
      factors: {
        payment: 10,
        competition: 25,
        compliance: 15,
        delivery: 22
      },
      keyRisks: ['Standard compliance requirements'],
      mitigations: 'Strong position - minimal risk factors identified',
      icon: '🟢'
    },
    {
      id: 4,
      tenderName: 'Fortis Healthcare - Diagnostic Systems',
      overallRisk: 72,
      riskLevel: 'High',
      factors: {
        payment: 80,
        competition: 75,
        compliance: 65,
        delivery: 68
      },
      keyRisks: ['Payment uncertainty', 'Aggressive competitors', 'Stringent compliance', 'Complex installation'],
      mitigations: 'Require advance payment, strengthen technical proposal, allocate extra resources',
      icon: '🔴'
    },
    {
      id: 5,
      tenderName: 'Safdarjung Hospital - ICU Consumables',
      overallRisk: 42,
      riskLevel: 'Medium',
      factors: {
        payment: 35,
        competition: 50,
        compliance: 40,
        delivery: 45
      },
      keyRisks: ['Government tender complexity', 'Moderate competition'],
      mitigations: 'Ensure documentation completeness, competitive pricing strategy',
      icon: '🟡'
    }
  ];

  const InsightCard = ({ assessment }) => {
    const getRiskColor = (level) => {
      if (level === 'Low') return 'low';
      if (level === 'Medium') return 'medium';
      return 'high';
    };

    return (
      <div className="risk-card">
        <div className="card-header">
          <span className="card-icon">{assessment.icon}</span>
          <div className="card-title-section">
            <h3>{assessment.tenderName}</h3>
            <span className={`risk-badge ${getRiskColor(assessment.riskLevel)}`}>
              {assessment.riskLevel} Risk
            </span>
          </div>
        </div>
        <div className="card-body">
          <div className="risk-score-section">
            <div className="risk-circle">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={assessment.riskLevel === 'Low' ? '#10b981' : assessment.riskLevel === 'Medium' ? '#f59e0b' : '#ef4444'}
                  strokeWidth="8"
                  strokeDasharray={`${(assessment.overallRisk / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="risk-score-text">
                <span className="risk-number">{assessment.overallRisk}</span>
                <span className="risk-label">Risk Score</span>
              </div>
            </div>
          </div>
          <div className="factors-grid">
            <div className="factor-item">
              <span className="factor-label">Payment Risk</span>
              <div className="factor-bar">
                <div className="factor-fill" style={{ width: `${assessment.factors.payment}%` }}></div>
              </div>
              <span className="factor-value">{assessment.factors.payment}%</span>
            </div>
            <div className="factor-item">
              <span className="factor-label">Competition Risk</span>
              <div className="factor-bar">
                <div className="factor-fill" style={{ width: `${assessment.factors.competition}%` }}></div>
              </div>
              <span className="factor-value">{assessment.factors.competition}%</span>
            </div>
            <div className="factor-item">
              <span className="factor-label">Compliance Risk</span>
              <div className="factor-bar">
                <div className="factor-fill" style={{ width: `${assessment.factors.compliance}%` }}></div>
              </div>
              <span className="factor-value">{assessment.factors.compliance}%</span>
            </div>
            <div className="factor-item">
              <span className="factor-label">Delivery Risk</span>
              <div className="factor-bar">
                <div className="factor-fill" style={{ width: `${assessment.factors.delivery}%` }}></div>
              </div>
              <span className="factor-value">{assessment.factors.delivery}%</span>
            </div>
          </div>
          <div className="risks-box">
            <span className="risks-label">Key Risks:</span>
            <ul>
              {assessment.keyRisks.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
          </div>
          <div className="mitigation-box">
            <span className="mitigation-label">Mitigation Strategy:</span>
            <p>{assessment.mitigations}</p>
          </div>
        </div>
        <div className="card-footer">
          <button 
            className="view-details-btn"
            onClick={() => console.log('Viewing risk details:', assessment.tenderName)}
          >
            View Risk Report
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="risk-score-page">
      <div className="page-header">
        <h1>Risk Score</h1>
        <p className="page-description">
          Comprehensive risk assessment for each tender opportunity, analyzing payment, competition, 
          compliance, and delivery factors to help you make informed bidding decisions.
        </p>
      </div>

      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search by tender name or hospital..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filters-bar">
        <select 
          className="filter-dropdown"
          value={selectedRisk}
          onChange={(e) => setSelectedRisk(e.target.value)}
        >
          <option value="all">All Risk Levels</option>
          <option value="low">Low Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="high">High Risk</option>
        </select>

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
         <button 
      className="filter-btn"
      onClick={() => console.log('Applying filters:', { selectedRisk, selectedCategory })}
    >
      Apply Filters
    </button>
  </div>

  <div className="insights-grid">
    {riskAssessments.map((assessment) => (
      <InsightCard key={assessment.id} assessment={assessment} />
    ))}
  </div>
</div>
);
};
export default RiskScore;