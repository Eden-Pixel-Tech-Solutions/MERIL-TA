import React, { useState } from 'react';
import "../../assets/css/CompareBidders.css";
import Select from 'react-select';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const CompareBidders = () => {
  const [dateRange, setDateRange] = useState({
    startDate: '2014-09-01',
    endDate: '2023-08-31'
  });
  
  const [filters, setFilters] = useState({
    company1: null,
    category1: null,
    state1: null,
    company2: null,
    category2: null,
    state2: null
  });

  const [showComparison, setShowComparison] = useState(false);

  // Sample data
  const companies = [
    { value: 'larsen', label: 'Larsen Toubro Limited' },
    { value: 'montecarlo', label: 'Montecarlo Limited' },
    { value: 'tata', label: 'Tata Projects Limited' }
  ];

  const categories = [
    { value: 'construction', label: 'Construction' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'energy', label: 'Energy' }
  ];

  const states = [
    { value: 'west-bengal', label: 'West Bengal' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'karnataka', label: 'Karnataka' }
  ];

  const comparisonData = {
    larsen: {
      name: 'Larsen Toubro Limited',
      participated: { count: 13, value: '₹ 1445.62 Cr' },
      awarded: { count: 4, value: '₹ 208.99 Cr' },
      lost: { count: 9, value: '₹ 688.37 Cr' },
      tba: { count: 0, value: '₹ 0' },
      ownership: [
        { name: 'Won', value: 53.8, color: '#10b981' },
        { name: 'Lost', value: 38.5, color: '#3b82f6' },
        { name: 'Pending', value: 7.7, color: '#f59e0b' }
      ],
      department: 'Indian Oil Corporation Limited',
      state: 'West Bengal',
      ownershipType: 'Public Sector Undertaking'
    },
    montecarlo: {
      name: 'Montecarlo Limited',
      participated: { count: 19, value: '₹ 16706.97 Cr' },
      awarded: { count: 2, value: '₹ 4800.38 Cr' },
      lost: { count: 17, value: '₹ 15174.15 Cr' },
      tba: { count: 0, value: '₹ 0' },
      ownership: [
        { name: 'Won', value: 47.4, color: '#10b981' },
        { name: 'Lost', value: 36.8, color: '#3b82f6' },
        { name: 'Other', value: 10.5, color: '#f59e0b' },
        { name: 'Pending', value: 5.3, color: '#ef4444' }
      ],
      department: 'Eastern Coal Fields Limited',
      state: 'West Bengal',
      ownershipType: 'Public Sector Undertaking'
    }
  };

  const handleCompare = () => {
    if (filters.company1 && filters.company2) {
      setShowComparison(true);
    }
  };

  const handleClear = () => {
    setFilters({
      company1: null,
      category1: null,
      state1: null,
      company2: null,
      category2: null,
      state2: null
    });
    setShowComparison(false);
  };

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      padding: '2px',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#2563eb'
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#eff6ff' : 'white',
      color: state.isSelected ? 'white' : '#1f2937',
      cursor: 'pointer'
    })
  };

  const company1Data = comparisonData[filters.company1?.value] || comparisonData.larsen;
  const company2Data = comparisonData[filters.company2?.value] || comparisonData.montecarlo;

  return (
    <div className="compare-bidders-page">
      {/* Header with Date Filter */}
      <div className="compare-header">
        <h1>Companies Compare</h1>
        <div className="date-filter">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
          />
          <span className="arrow">→</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
          />
          <button className="calendar-btn">📅</button>
        </div>
      </div>

      {!showComparison ? (
        <div className="comparison-setup">
          <div className="comparison-columns">
            {/* Company 1 */}
            <div className="comparison-column">
              <div className="company-select-card">
                <Select
                  value={filters.company1}
                  onChange={(val) => setFilters({ ...filters, company1: val })}
                  options={companies}
                  styles={customSelectStyles}
                  placeholder="Search Company"
                  isSearchable
                />
                <Select
                  value={filters.category1}
                  onChange={(val) => setFilters({ ...filters, category1: val })}
                  options={categories}
                  styles={customSelectStyles}
                  placeholder="Select Category"
                  className="mt-12"
                />
                <Select
                  value={filters.state1}
                  onChange={(val) => setFilters({ ...filters, state1: val })}
                  options={states}
                  styles={customSelectStyles}
                  placeholder="Select State"
                  className="mt-12"
                />
              </div>
            </div>

            {/* Company 2 */}
            <div className="comparison-column">
              <div className="company-select-card">
                <Select
                  value={filters.company2}
                  onChange={(val) => setFilters({ ...filters, company2: val })}
                  options={companies}
                  styles={customSelectStyles}
                  placeholder="Search Company"
                  isSearchable
                />
                <Select
                  value={filters.category2}
                  onChange={(val) => setFilters({ ...filters, category2: val })}
                  options={categories}
                  styles={customSelectStyles}
                  placeholder="Select Category"
                  className="mt-12"
                />
                <Select
                  value={filters.state2}
                  onChange={(val) => setFilters({ ...filters, state2: val })}
                  options={states}
                  styles={customSelectStyles}
                  placeholder="Select State"
                  className="mt-12"
                />
              </div>
            </div>
          </div>

          <div className="compare-button-wrapper">
            <button className="compare-now-btn" onClick={handleCompare}>
              Compare Now
            </button>
          </div>
        </div>
      ) : (
        <div className="comparison-results">
          {/* Individual Comparison Table */}
          <div className="results-card">
            <div className="results-header">
              <h2>Individual Comparison</h2>
              <button className="clear-btn" onClick={handleClear}>Clear Comparison</button>
            </div>
            
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>{company1Data.name}</th>
                    <th>{company2Data.name}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="metric-label">Tenders Participated</td>
                    <td>
                      <span className="count-badge">{company1Data.participated.count}</span>
                      <span className="value-text">{company1Data.participated.value}</span>
                    </td>
                    <td>
                      <span className="count-badge">{company2Data.participated.count}</span>
                      <span className="value-text">{company2Data.participated.value}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="metric-label">Tenders Awarded</td>
                    <td>
                      <span className="count-badge">{company1Data.awarded.count}</span>
                      <span className="value-text">{company1Data.awarded.value}</span>
                    </td>
                    <td>
                      <span className="count-badge">{company2Data.awarded.count}</span>
                      <span className="value-text">{company2Data.awarded.value}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="metric-label">Tenders Lost</td>
                    <td>
                      <span className="count-badge">{company1Data.lost.count}</span>
                      <span className="value-text">{company1Data.lost.value}</span>
                    </td>
                    <td>
                      <span className="count-badge">{company2Data.lost.count}</span>
                      <span className="value-text">{company2Data.lost.value}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="metric-label">Result TBA</td>
                    <td>
                      <span className="count-badge">{company1Data.tba.count}</span>
                      <span className="value-text">{company1Data.tba.value}</span>
                    </td>
                    <td>
                      <span className="count-badge">{company2Data.tba.count}</span>
                      <span className="value-text">{company2Data.tba.value}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="metric-label">Tender Ownership</td>
                    <td>
                      <div className="chart-container">
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={company1Data.ownership}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {company1Data.ownership.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}%`} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="chart-labels">
                          {company1Data.ownership.map((item, idx) => (
                            <div key={idx} className="chart-label-item">
                              <span className="label-dot" style={{ backgroundColor: item.color }}></span>
                              <span className="label-text">{item.name}: {item.value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="chart-container">
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={company2Data.ownership}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {company2Data.ownership.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}%`} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="chart-labels">
                          {company2Data.ownership.map((item, idx) => (
                            <div key={idx} className="chart-label-item">
                              <span className="label-dot" style={{ backgroundColor: item.color }}></span>
                              <span className="label-text">{item.name}: {item.value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Strong Areas Table */}
          <div className="results-card">
            <h2>Strong Areas Of Company</h2>
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>{company1Data.name}</th>
                    <th>{company2Data.name}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="metric-label">Department</td>
                    <td>{company1Data.department}</td>
                    <td>{company2Data.department}</td>
                  </tr>
                  <tr>
                    <td className="metric-label">State</td>
                    <td>{company1Data.state}</td>
                    <td>{company2Data.state}</td>
                  </tr>
                  <tr>
                    <td className="metric-label">Ownership</td>
                    <td>{company1Data.ownershipType}</td>
                    <td>{company2Data.ownershipType}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareBidders;