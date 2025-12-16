// src/pages/Orders/GEMContracts.jsx
// Route: /orders/gem-contracts

import React, { useState, useMemo } from 'react';
import '../../assets/css/GEMContracts.css';

// Dummy data
const INITIAL_CONTRACTS = [
  {
    id: 1,
    month: 'Jan 2024',
    contractNo: 'GEM/2024/B/4567890',
    contractDate: '2024-01-15',
    zonalHead: 'North Zone',
    hospitalName: 'AIIMS Delhi',
    hospitalState: 'Delhi',
    sellerName: 'Meril Medical Solutions',
    sellerState: 'Gujarat',
    category: 'Cardiology',
    decode: 'Stents - Drug Eluting',
    merilOthers: 'MERIL',
    companyName: 'Meril Life Sciences',
    orderedQty: 500,
    unitPrice: 25000,
    contractValue: 12500000,
    referenceNo: 'REF2024001',
    city: 'New Delhi',
    department: 'Cardiology Dept',
    status: 'Awarded',
    tenderId: 'TID001',
    website: 'gem.gov.in',
    closingDate: '2024-01-10',
    ownership: 'Government',
    preBidDate: '2024-01-05',
    mailType: 'Email',
    lastUpdated: '2024-01-20',
    isGem: true,
    isMsme: true,
    isStartup: false,
    isManualEntry: false
  },
  {
    id: 2,
    month: 'Feb 2024',
    contractNo: 'GEM/2024/B/4567891',
    contractDate: '2024-02-20',
    zonalHead: 'South Zone',
    hospitalName: 'Apollo Hospital',
    hospitalState: 'Tamil Nadu',
    sellerName: 'Endologix India',
    sellerState: 'Maharashtra',
    category: 'Orthopedics',
    decode: 'Joint Replacement',
    merilOthers: 'OTHERS',
    companyName: 'Endologix Medical',
    orderedQty: 300,
    unitPrice: 45000,
    contractValue: 13500000,
    referenceNo: 'REF2024002',
    city: 'Chennai',
    department: 'Ortho Dept',
    status: 'Open',
    tenderId: 'TID002',
    website: 'gem.gov.in',
    closingDate: '2024-02-15',
    ownership: 'Private',
    preBidDate: '2024-02-10',
    mailType: 'Portal',
    lastUpdated: '2024-02-25',
    isGem: true,
    isMsme: false,
    isStartup: true,
    isManualEntry: false
  },
  {
    id: 3,
    month: 'Mar 2024',
    contractNo: 'GEM/2024/B/4567892',
    contractDate: '2024-03-10',
    zonalHead: 'West Zone',
    hospitalName: 'Kokilaben Hospital',
    hospitalState: 'Maharashtra',
    sellerName: 'Sahajanand Medical',
    sellerState: 'Gujarat',
    category: 'Cardiology',
    decode: 'Angioplasty Balloons',
    merilOthers: 'MERIL',
    companyName: 'Sahajanand Medical Tech',
    orderedQty: 750,
    unitPrice: 15000,
    contractValue: 11250000,
    referenceNo: 'REF2024003',
    city: 'Mumbai',
    department: 'Interventional Cardiology',
    status: 'Closed',
    tenderId: 'TID003',
    website: 'gem.gov.in',
    closingDate: '2024-03-05',
    ownership: 'Private',
    preBidDate: '2024-02-28',
    mailType: 'Email',
    lastUpdated: '2024-03-15',
    isGem: false,
    isMsme: true,
    isStartup: false,
    isManualEntry: true
  },
  {
    id: 4,
    month: 'Apr 2024',
    contractNo: 'GEM/2024/B/4567893',
    contractDate: '2024-04-18',
    zonalHead: 'East Zone',
    hospitalName: 'Medical College Kolkata',
    hospitalState: 'West Bengal',
    sellerName: 'Translumina Medical',
    sellerState: 'Karnataka',
    category: 'Neurology',
    decode: 'Neurovascular Devices',
    merilOthers: 'OTHERS',
    companyName: 'Translumina Therapeutics',
    orderedQty: 200,
    unitPrice: 85000,
    contractValue: 17000000,
    referenceNo: 'REF2024004',
    city: 'Kolkata',
    department: 'Neurosurgery',
    status: 'Awarded',
    tenderId: 'TID004',
    website: 'gem.gov.in',
    closingDate: '2024-04-12',
    ownership: 'Government',
    preBidDate: '2024-04-05',
    mailType: 'Portal',
    lastUpdated: '2024-04-22',
    isGem: true,
    isMsme: false,
    isStartup: false,
    isManualEntry: false
  },
  {
    id: 5,
    month: 'May 2024',
    contractNo: 'GEM/2024/B/4567894',
    contractDate: '2024-05-22',
    zonalHead: 'North Zone',
    hospitalName: 'PGI Chandigarh',
    hospitalState: 'Chandigarh',
    sellerName: 'Meril Medical Solutions',
    sellerState: 'Gujarat',
    category: 'Cardiology',
    decode: 'PTCA Guide Wires',
    merilOthers: 'MERIL',
    companyName: 'Meril Life Sciences',
    orderedQty: 1000,
    unitPrice: 8000,
    contractValue: 8000000,
    referenceNo: 'REF2024005',
    city: 'Chandigarh',
    department: 'Cath Lab',
    status: 'Open',
    tenderId: 'TID005',
    website: 'gem.gov.in',
    closingDate: '2024-05-30',
    ownership: 'Government',
    preBidDate: '2024-05-15',
    mailType: 'Email',
    lastUpdated: '2024-05-25',
    isGem: true,
    isMsme: true,
    isStartup: true,
    isManualEntry: false
  },
  {
    id: 6,
    month: 'Jun 2024',
    contractNo: 'GEM/2024/B/4567895',
    contractDate: '2024-06-08',
    zonalHead: 'South Zone',
    hospitalName: 'Manipal Hospital',
    hospitalState: 'Karnataka',
    sellerName: 'Vascular Concepts',
    sellerState: 'Tamil Nadu',
    category: 'Vascular Surgery',
    decode: 'Peripheral Stents',
    merilOthers: 'OTHERS',
    companyName: 'Vascular Concepts Ltd',
    orderedQty: 400,
    unitPrice: 32000,
    contractValue: 12800000,
    referenceNo: 'REF2024006',
    city: 'Bangalore',
    department: 'Vascular Surgery',
    status: 'Closed',
    tenderId: 'TID006',
    website: 'eprocure.gov.in',
    closingDate: '2024-06-03',
    ownership: 'Private',
    preBidDate: '2024-05-28',
    mailType: 'Portal',
    lastUpdated: '2024-06-12',
    isGem: false,
    isMsme: false,
    isStartup: false,
    isManualEntry: false
  },
  {
    id: 7,
    month: 'Jul 2024',
    contractNo: 'GEM/2024/B/4567896',
    contractDate: '2024-07-15',
    zonalHead: 'West Zone',
    hospitalName: 'Jaslok Hospital',
    hospitalState: 'Maharashtra',
    sellerName: 'Meril Medical Solutions',
    sellerState: 'Gujarat',
    category: 'Cardiology',
    decode: 'Bioresorbable Stents',
    merilOthers: 'MERIL',
    companyName: 'Meril Life Sciences',
    orderedQty: 600,
    unitPrice: 55000,
    contractValue: 33000000,
    referenceNo: 'REF2024007',
    city: 'Mumbai',
    department: 'Cardiology',
    status: 'Awarded',
    tenderId: 'TID007',
    website: 'gem.gov.in',
    closingDate: '2024-07-10',
    ownership: 'Private',
    preBidDate: '2024-07-05',
    mailType: 'Email',
    lastUpdated: '2024-07-18',
    isGem: true,
    isMsme: true,
    isStartup: false,
    isManualEntry: false
  },
  {
    id: 8,
    month: 'Aug 2024',
    contractNo: 'GEM/2024/B/4567897',
    contractDate: '2024-08-20',
    zonalHead: 'East Zone',
    hospitalName: 'Fortis Hospital',
    hospitalState: 'West Bengal',
    sellerName: 'Intact Vascular',
    sellerState: 'Delhi',
    category: 'Radiology',
    decode: 'Imaging Contrast',
    merilOthers: 'OTHERS',
    companyName: 'Intact Medical',
    orderedQty: 250,
    unitPrice: 12000,
    contractValue: 3000000,
    referenceNo: 'REF2024008',
    city: 'Kolkata',
    department: 'Radiology Dept',
    status: 'Open',
    tenderId: 'TID008',
    website: 'gem.gov.in',
    closingDate: '2024-08-28',
    ownership: 'Private',
    preBidDate: '2024-08-15',
    mailType: 'Portal',
    lastUpdated: '2024-08-22',
    isGem: true,
    isMsme: false,
    isStartup: true,
    isManualEntry: true
  },
  {
    id: 9,
    month: 'Sep 2024',
    contractNo: 'GEM/2024/B/4567898',
    contractDate: '2024-09-12',
    zonalHead: 'North Zone',
    hospitalName: 'Max Hospital',
    hospitalState: 'Delhi',
    sellerName: 'SMT Medical',
    sellerState: 'Gujarat',
    category: 'Orthopedics',
    decode: 'Trauma Implants',
    merilOthers: 'OTHERS',
    companyName: 'SMT Healthcare',
    orderedQty: 800,
    unitPrice: 18000,
    contractValue: 14400000,
    referenceNo: 'REF2024009',
    city: 'New Delhi',
    department: 'Trauma Center',
    status: 'Awarded',
    tenderId: 'TID009',
    website: 'gem.gov.in',
    closingDate: '2024-09-08',
    ownership: 'Private',
    preBidDate: '2024-09-01',
    mailType: 'Email',
    lastUpdated: '2024-09-15',
    isGem: false,
    isMsme: true,
    isStartup: false,
    isManualEntry: false
  },
  {
    id: 10,
    month: 'Oct 2024',
    contractNo: 'GEM/2024/B/4567899',
    contractDate: '2024-10-25',
    zonalHead: 'South Zone',
    hospitalName: 'CMC Vellore',
    hospitalState: 'Tamil Nadu',
    sellerName: 'Meril Medical Solutions',
    sellerState: 'Gujarat',
    category: 'Cardiology',
    decode: 'Rotablation Devices',
    merilOthers: 'MERIL',
    companyName: 'Meril Life Sciences',
    orderedQty: 150,
    unitPrice: 95000,
    contractValue: 14250000,
    referenceNo: 'REF2024010',
    city: 'Vellore',
    department: 'Cardiology',
    status: 'Closed',
    tenderId: 'TID010',
    website: 'gem.gov.in',
    closingDate: '2024-10-20',
    ownership: 'Government',
    preBidDate: '2024-10-12',
    mailType: 'Portal',
    lastUpdated: '2024-10-28',
    isGem: true,
    isMsme: true,
    isStartup: false,
    isManualEntry: false
  },
  {
    id: 11,
    month: 'Nov 2024',
    contractNo: 'GEM/2024/B/4567900',
    contractDate: '2024-11-05',
    zonalHead: 'West Zone',
    hospitalName: 'Ruby Hall Clinic',
    hospitalState: 'Maharashtra',
    sellerName: 'Cordis Medical',
    sellerState: 'Karnataka',
    category: 'Neurology',
    decode: 'Flow Diverters',
    merilOthers: 'OTHERS',
    companyName: 'Cordis Healthcare',
    orderedQty: 180,
    unitPrice: 125000,
    contractValue: 22500000,
    referenceNo: 'REF2024011',
    city: 'Pune',
    department: 'Neuro Intervention',
    status: 'Open',
    tenderId: 'TID011',
    website: 'gem.gov.in',
    closingDate: '2024-11-15',
    ownership: 'Private',
    preBidDate: '2024-10-30',
    mailType: 'Email',
    lastUpdated: '2024-11-08',
    isGem: true,
    isMsme: false,
    isStartup: false,
    isManualEntry: false
  },
  {
    id: 12,
    month: 'Dec 2024',
    contractNo: 'GEM/2024/B/4567901',
    contractDate: '2024-12-01',
    zonalHead: 'North Zone',
    hospitalName: 'Safdarjung Hospital',
    hospitalState: 'Delhi',
    sellerName: 'Meril Medical Solutions',
    sellerState: 'Gujarat',
    category: 'Cardiology',
    decode: 'IVUS Systems',
    merilOthers: 'MERIL',
    companyName: 'Meril Life Sciences',
    orderedQty: 50,
    unitPrice: 450000,
    contractValue: 22500000,
    referenceNo: 'REF2024012',
    city: 'New Delhi',
    department: 'Cardiac Cath Lab',
    status: 'Awarded',
    tenderId: 'TID012',
    website: 'gem.gov.in',
    closingDate: '2024-11-25',
    ownership: 'Government',
    preBidDate: '2024-11-18',
    mailType: 'Portal',
    lastUpdated: '2024-12-03',
    isGem: true,
    isMsme: true,
    isStartup: true,
    isManualEntry: false
  }
];

const STATES = [
  'All States', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Chandigarh'
];

const GEMContracts = () => {
  const [contracts] = useState(INITIAL_CONTRACTS);
  const [selectedContracts, setSelectedContracts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('contractDate-desc');

  // Search and filter states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filters, setFilters] = useState({
    referenceNo: '',
    state: 'All States',
    city: '',
    department: '',
    tenderStatus: 'All',
    assignBy: 'All',
    assignTo: 'All',
    tenderId: '',
    website: '',
    closingDateFrom: '',
    closingDateTo: '',
    ownership: 'All',
    preBidDateFrom: '',
    preBidDateTo: '',
    mailType: 'All',
    lastUpdated: '',
    qtyOperator: '>=',
    qtyValue: '',
    valueOperator: '>=',
    valueFrom: '',
    valueTo: '',
    valueUnit: 'Lakh',
    gemType: 'All',
    isMsme: false,
    startupType: 'All',
    isManualEntry: false
  });

  // Handle checkbox selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedContracts(filteredContracts.map(c => c.id));
    } else {
      setSelectedContracts([]);
    }
  };

  const handleSelectContract = (id) => {
    setSelectedContracts(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  // Filter logic
  const filteredContracts = useMemo(() => {
    let result = [...contracts];

    // Live search by keyword
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      result = result.filter(c =>
        c.contractNo.toLowerCase().includes(kw) ||
        c.companyName.toLowerCase().includes(kw) ||
        c.category.toLowerCase().includes(kw) ||
        c.decode.toLowerCase().includes(kw)
      );
    }

    // Advanced filters
    if (filters.referenceNo) {
      result = result.filter(c => c.referenceNo.toLowerCase().includes(filters.referenceNo.toLowerCase()));
    }
    if (filters.state !== 'All States') {
      result = result.filter(c => c.hospitalState === filters.state || c.sellerState === filters.state);
    }
    if (filters.city) {
      result = result.filter(c => c.city.toLowerCase().includes(filters.city.toLowerCase()));
    }
    if (filters.department) {
      result = result.filter(c => c.department.toLowerCase().includes(filters.department.toLowerCase()));
    }
    if (filters.tenderStatus !== 'All') {
      result = result.filter(c => c.status === filters.tenderStatus);
    }
    if (filters.tenderId) {
      result = result.filter(c => c.tenderId.toLowerCase().includes(filters.tenderId.toLowerCase()));
    }
    if (filters.website) {
      result = result.filter(c => c.website.toLowerCase().includes(filters.website.toLowerCase()));
    }
    if (filters.closingDateFrom) {
      result = result.filter(c => c.closingDate >= filters.closingDateFrom);
    }
    if (filters.closingDateTo) {
      result = result.filter(c => c.closingDate <= filters.closingDateTo);
    }
    if (filters.ownership !== 'All') {
      result = result.filter(c => c.ownership === filters.ownership);
    }
    if (filters.preBidDateFrom) {
      result = result.filter(c => c.preBidDate >= filters.preBidDateFrom);
    }
    if (filters.preBidDateTo) {
      result = result.filter(c => c.preBidDate <= filters.preBidDateTo);
    }
    if (filters.lastUpdated) {
      result = result.filter(c => c.lastUpdated.includes(filters.lastUpdated));
    }
    if (filters.qtyValue) {
      const qty = parseFloat(filters.qtyValue);
      if (!isNaN(qty)) {
        result = result.filter(c => {
          if (filters.qtyOperator === '>=') return c.orderedQty >= qty;
          if (filters.qtyOperator === '<=') return c.orderedQty <= qty;
          if (filters.qtyOperator === '=') return c.orderedQty === qty;
          return true;
        });
      }
    }
    if (filters.valueFrom) {
      const val = parseFloat(filters.valueFrom);
      const multiplier = filters.valueUnit === 'Crore' ? 10000000 : 100000;
      if (!isNaN(val)) {
        const minValue = val * multiplier;
        if (filters.valueOperator === '>=') {
          result = result.filter(c => c.contractValue >= minValue);
        } else if (filters.valueOperator === '<=') {
          result = result.filter(c => c.contractValue <= minValue);
        } else if (filters.valueOperator === '=') {
          result = result.filter(c => c.contractValue === minValue);
        }
      }
    }
    if (filters.valueTo && filters.valueOperator === '>=') {
      const val = parseFloat(filters.valueTo);
      const multiplier = filters.valueUnit === 'Crore' ? 10000000 : 100000;
      if (!isNaN(val)) {
        result = result.filter(c => c.contractValue <= val * multiplier);
      }
    }
    if (filters.gemType === 'GeM') {
      result = result.filter(c => c.isGem);
    } else if (filters.gemType === 'Non-GeM') {
      result = result.filter(c => !c.isGem);
    }
    if (filters.isMsme) {
      result = result.filter(c => c.isMsme);
    }
    if (filters.startupType === 'Yes') {
      result = result.filter(c => c.isStartup);
    } else if (filters.startupType === 'No') {
      result = result.filter(c => !c.isStartup);
    }
    if (filters.isManualEntry) {
      result = result.filter(c => c.isManualEntry);
    }

    return result;
  }, [contracts, searchKeyword, filters]);

  // Sorting
  const sortedContracts = useMemo(() => {
    const sorted = [...filteredContracts];
    const [field, order] = sortBy.split('-');
    sorted.sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];
      if (field === 'contractValue') {
        return order === 'asc' ? aVal - bVal : bVal - aVal;
      }
      if (field === 'contractDate') {
        return order === 'asc' ? new Date(aVal) - new Date(bVal) : new Date(bVal) - new Date(aVal);
      }
      return 0;
    });
    return sorted;
  }, [filteredContracts, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedContracts.length / rowsPerPage);
  const paginatedContracts = sortedContracts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSearch = () => {
    setCurrentPage(1);
    console.log('Filters applied:', filters);
  };

  const handleClearFilters = () => {
    setFilters({
      referenceNo: '',
      state: 'All States',
      city: '',
      department: '',
      tenderStatus: 'All',
      assignBy: 'All',
      assignTo: 'All',
      tenderId: '',
      website: '',
      closingDateFrom: '',
      closingDateTo: '',
      ownership: 'All',
      preBidDateFrom: '',
      preBidDateTo: '',
      mailType: 'All',
      lastUpdated: '',
      qtyOperator: '>=',
      qtyValue: '',
      valueOperator: '>=',
      valueFrom: '',
      valueTo: '',
      valueUnit: 'Lakh',
      gemType: 'All',
      isMsme: false,
      startupType: 'All',
      isManualEntry: false
    });
    setSearchKeyword('');
    setCurrentPage(1);
  };

  const handleExportToExcel = () => {
    console.log('Exporting to Excel:', paginatedContracts);
    // Generate CSV
    const headers = ['Month', 'Contract No', 'Contract Date', 'Zonal Head', 'Hospital Name', 
      'Hospital State', 'Seller Name', 'Seller State', 'Category', 'Decode', 'MERIL/OTHERS', 
      'Company Name', 'Ordered Qty', 'Unit Price', 'Contract Value'];
    const csv = [
      headers.join(','),
      ...paginatedContracts.map(c => [
        c.month, c.contractNo, c.contractDate, c.zonalHead, c.hospitalName, c.hospitalState,
        c.sellerName, c.sellerState, c.category, c.decode, c.merilOthers, c.companyName,
        c.orderedQty, c.unitPrice, c.contractValue
      ].join(','))
    ].join('\n');
    console.log(csv);
  };

  const handleView = (id) => console.log('View contract:', id);
  const handleEdit = (id) => console.log('Edit contract:', id);
  const handleCopy = (id) => console.log('Copy contract:', id);
  const handleDownload = (id) => console.log('Download contract:', id);

  return (
    <div className="gem-contracts-page">
      <div className="page-header">
        <h1>GeM Contracts</h1>
        <p>Manage and track all Government e-Marketplace contracts</p>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-card">
        <div className="search-row">
          <input
            type="text"
            className="search-input"
            placeholder="Search by Contract No, Company Name, Category, Decode..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            aria-label="Search contracts"
          />
          <div className="search-actions">
            <button 
              className="btn-toggle-filters" 
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Toggle filters"
            >
              {showFilters ? '▲' : '▼'} Filters
            </button>
            <button className="btn-export" onClick={handleExportToExcel}>
              Export to Excel
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {/* Advanced Filters Panel */}
<div className={`filters-panel ${showFilters ? 'show' : ''}`}>

  <div className="filters-grid">
    <div className="filter-group">
      <label>Reference Number</label>
      <input
        type="text"
        value={filters.referenceNo}
        onChange={(e) => setFilters({ ...filters, referenceNo: e.target.value })}
      />
    </div>

    <div className="filter-group">
      <label>State</label>
      <select
        value={filters.state}
        onChange={(e) => setFilters({ ...filters, state: e.target.value })}
      >
        {STATES.map(state => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>
    </div>

    <div className="filter-group">
      <label>City</label>
      <input
        type="text"
        value={filters.city}
        onChange={(e) => setFilters({ ...filters, city: e.target.value })}
      />
    </div>

    <div className="filter-group">
      <label>Department Name</label>
      <input
        type="text"
        value={filters.department}
        onChange={(e) => setFilters({ ...filters, department: e.target.value })}
      />
    </div>

    <div className="filter-group">
      <label>Tender Status</label>
      <select
        value={filters.tenderStatus}
        onChange={(e) => setFilters({ ...filters, tenderStatus: e.target.value })}
      >
        <option value="All">All</option>
        <option value="Open">Open</option>
        <option value="Closed">Closed</option>
        <option value="Awarded">Awarded</option>
      </select>
    </div>

    <div className="filter-group">
      <label>Tender ID</label>
      <input
        type="text"
        value={filters.tenderId}
        onChange={(e) => setFilters({ ...filters, tenderId: e.target.value })}
      />
    </div>

    <div className="filter-group">
      <label>Website</label>
      <input
        type="text"
        value={filters.website}
        onChange={(e) => setFilters({ ...filters, website: e.target.value })}
      />
    </div>

    <div className="filter-group">
      <label>Closing Date From</label>
      <input
        type="date"
        value={filters.closingDateFrom}
        onChange={(e) => setFilters({ ...filters, closingDateFrom: e.target.value })}
      />
    </div>

    <div className="filter-group">
      <label>Closing Date To</label>
      <input
        type="date"
        value={filters.closingDateTo}
        onChange={(e) => setFilters({ ...filters, closingDateTo: e.target.value })}
      />
    </div>

    <div className="filter-group">
      <label>Ownership</label>
      <select
        value={filters.ownership}
        onChange={(e) => setFilters({ ...filters, ownership: e.target.value })}
      >
        <option value="All">All</option>
        <option value="Government">Government</option>
        <option value="Private">Private</option>
      </select>
    </div>

    <div className="filter-group">
      <label>Pre-bid Date From</label>
      <input
        type="date"
        value={filters.preBidDateFrom}
        onChange={(e) => setFilters({ ...filters, preBidDateFrom: e.target.value })}
      />
    </div>

    <div className="filter-group">
      <label>Pre-bid Date To</label>
      <input
        type="date"
        value={filters.preBidDateTo}
        onChange={(e) => setFilters({ ...filters, preBidDateTo: e.target.value })}
      />
    </div>

    <div className="filter-group">
      <label>Last Updated Date</label>
      <input
        type="text"
        placeholder="YYYY-MM-DD"
        value={filters.lastUpdated}
        onChange={(e) => setFilters({ ...filters, lastUpdated: e.target.value })}
      />
    </div>

    <div className="filter-group">
      <label>Quantity</label>
      <div className="filter-compound">
        <select
          value={filters.qtyOperator}
          onChange={(e) => setFilters({ ...filters, qtyOperator: e.target.value })}
        >
          <option value=">=">&gt;=</option>
          <option value="<=">&lt;=</option>
          <option value="=">=</option>
        </select>
        <input
          type="number"
          placeholder="Value"
          value={filters.qtyValue}
          onChange={(e) => setFilters({ ...filters, qtyValue: e.target.value })}
        />
      </div>
    </div>

    <div className="filter-group">
      <label>Tender Value</label>
      <div className="filter-compound">
        <select
          value={filters.valueOperator}
          onChange={(e) => setFilters({ ...filters, valueOperator: e.target.value })}
        >
          <option value=">=">&gt;=</option>
          <option value="<=">&lt;=</option>
          <option value="=">=</option>
        </select>
        <input
          type="number"
          placeholder="From"
          value={filters.valueFrom}
          onChange={(e) => setFilters({ ...filters, valueFrom: e.target.value })}
        />
        <input
          type="number"
          placeholder="To"
          value={filters.valueTo}
          onChange={(e) => setFilters({ ...filters, valueTo: e.target.value })}
        />
        <select
          value={filters.valueUnit}
          onChange={(e) => setFilters({ ...filters, valueUnit: e.target.value })}
        >
          <option value="Lakh">Lakh</option>
          <option value="Crore">Crore</option>
        </select>
      </div>
    </div>
  </div>

  <div className="filters-row">
    <div className="filter-radio-group">
      <label>GeM / Non-GeM</label>
      <div className="radio-options">
        <label>
          <input
            type="radio"
            name="gemType"
            value="All"
            checked={filters.gemType === 'All'}
            onChange={(e) => setFilters({ ...filters, gemType: e.target.value })}
          /> All
        </label>
        <label>
          <input
            type="radio"
            name="gemType"
            value="GeM"
            checked={filters.gemType === 'GeM'}
            onChange={(e) => setFilters({ ...filters, gemType: e.target.value })}
          /> GeM
        </label>
        <label>
          <input
            type="radio"
            name="gemType"
            value="Non-GeM"
            checked={filters.gemType === 'Non-GeM'}
            onChange={(e) => setFilters({ ...filters, gemType: e.target.value })}
          /> Non-GeM
        </label>
      </div>
    </div>

    <div className="filter-checkbox-group">
      <label>
        <input
          type="checkbox"
          checked={filters.isMsme}
          onChange={(e) => setFilters({ ...filters, isMsme: e.target.checked })}
        /> MSME
      </label>
    </div>

    <div className="filter-radio-group">
      <label>Startup</label>
      <div className="radio-options">
        <label>
          <input
            type="radio"
            name="startupType"
            value="All"
            checked={filters.startupType === 'All'}
            onChange={(e) => setFilters({ ...filters, startupType: e.target.value })}
          /> All
        </label>
        <label>
          <input
            type="radio"
            name="startupType"
            value="Yes"
            checked={filters.startupType === 'Yes'}
            onChange={(e) => setFilters({ ...filters, startupType: e.target.value })}
          /> Yes
        </label>
        <label>
          <input
            type="radio"
            name="startupType"
            value="No"
            checked={filters.startupType === 'No'}
            onChange={(e) => setFilters({ ...filters, startupType: e.target.value })}
          /> No
        </label>
      </div>
    </div>

    <div className="filter-checkbox-group">
      <label>
        <input
          type="checkbox"
          checked={filters.isManualEntry}
          onChange={(e) => setFilters({ ...filters, isManualEntry: e.target.checked })}
        /> Manual Entry
      </label>
    </div>
  </div>

  <div className="filter-actions">
    <button className="btn-search" onClick={handleSearch}>Search</button>
    <button className="btn-clear" onClick={handleClearFilters}>Clear Filters</button>
  </div>

</div>

  </div>

  {/* Table Controls */}
  <div className="table-controls">
    <div className="table-controls-left">
      <label htmlFor="rowsPerPage">Show</label>
      <select
        id="rowsPerPage"
        value={rowsPerPage}
        onChange={(e) => {
          setRowsPerPage(Number(e.target.value));
          setCurrentPage(1);
        }}
      >
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
      </select>
      <span>rows</span>
    </div>
    <div className="table-controls-right">
      <label htmlFor="sortBy">Sort by:</label>
      <select
        id="sortBy"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="contractDate-desc">Contract Date (Newest)</option>
        <option value="contractDate-asc">Contract Date (Oldest)</option>
        <option value="contractValue-desc">Contract Value (High to Low)</option>
        <option value="contractValue-asc">Contract Value (Low to High)</option>
      </select>
    </div>
  </div>

  {/* Contracts Table */}
  <div className="table-wrapper">
    <table className="contracts-table" aria-label="GeM Contracts table">
      <thead>
        <tr>
          <th scope="col">
            <input
              type="checkbox"
              checked={selectedContracts.length === paginatedContracts.length && paginatedContracts.length > 0}
              onChange={handleSelectAll}
              aria-label="Select all contracts"
            />
          </th>
          <th scope="col">#</th>
          <th scope="col">Month</th>
          <th scope="col">Contract No</th>
          <th scope="col">Contract Date</th>
          <th scope="col">Zonal Head</th>
          <th scope="col">Hospital Name</th>
          <th scope="col">Hospital State</th>
          <th scope="col">Seller Name</th>
          <th scope="col">Seller State</th>
          <th scope="col">Category</th>
          <th scope="col">Decode</th>
          <th scope="col">MERIL/OTHERS</th>
          <th scope="col">Company Name</th>
          <th scope="col">Ordered Qty</th>
          <th scope="col">Unit Price</th>
          <th scope="col">Contract Value</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {paginatedContracts.map((contract, index) => (
          <tr key={contract.id}>
            <td>
              <input
                type="checkbox"
                checked={selectedContracts.includes(contract.id)}
                onChange={() => handleSelectContract(contract.id)}
                aria-label={`Select contract ${contract.contractNo}`}
              />
            </td>
            <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
            <td>{contract.month}</td>
            <td>{contract.contractNo}</td>
            <td>{contract.contractDate}</td>
            <td>{contract.zonalHead}</td>
            <td>{contract.hospitalName}</td>
            <td>{contract.hospitalState}</td>
            <td>{contract.sellerName}</td>
            <td>{contract.sellerState}</td>
            <td>{contract.category}</td>
            <td>{contract.decode}</td>
            <td>{contract.merilOthers}</td>
            <td>{contract.companyName}</td>
            <td>{contract.orderedQty}</td>
            <td>₹{contract.unitPrice.toLocaleString()}</td>
            <td>₹{contract.contractValue.toLocaleString()}</td>
            <td>
              <div className="action-buttons">
                <button 
                  className="btn-icon" 
                  onClick={() => handleView(contract.id)}
                  aria-label="View contract"
                  title="View"
                >
                  👁️
                </button>
                <button 
                  className="btn-icon" 
                  onClick={() => handleEdit(contract.id)}
                  aria-label="Edit contract"
                  title="Edit"
                >
                  ✏️
                </button>
                <button 
                  className="btn-icon" 
                  onClick={() => handleCopy(contract.id)}
                  aria-label="Copy contract"
                  title="Copy"
                >
                  📄
                </button>
                <button 
                  className="btn-icon" 
                  onClick={() => handleDownload(contract.id)}
                  aria-label="Download contract"
                  title="Download"
                >
                  ⬇️
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Pagination */}
  <div className="pagination">
    <div className="pagination-info">
      Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, sortedContracts.length)} of {sortedContracts.length} entries
    </div>
    <div className="pagination-controls">
      <button
        className="btn-page"
        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
          return (
            <button
              key={page}
              className={`btn-page ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          );
        } else if (page === currentPage - 2 || page === currentPage + 2) {
          return <span key={page}>...</span>;
        }
        return null;
      })}
      <button
        className="btn-page"
        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  </div>
</div>
);
};
export default GEMContracts;