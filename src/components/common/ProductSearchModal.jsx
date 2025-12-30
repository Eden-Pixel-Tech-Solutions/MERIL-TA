import React, { useState } from 'react';

const ProductSearchModal = ({ onClose, onSelect }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_BASE_URL}/tenders/products/search?q=${encodeURIComponent(query)}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setResults(data.data);
            }
        } catch (err) {
            console.error("Search failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1002 }}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', height: '500px', display: 'flex', flexDirection: 'column' }}>
                <div className="modal-header">
                    <h2>Add Product</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <div className="modal-body" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search by code, title or type..."
                            style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        />
                        <button
                            onClick={handleSearch}
                            style={{ padding: '8px 16px', background: '#084f9a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Search
                        </button>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {loading ? <p>Searching...</p> : (
                            <table className="products-table">
                                <tbody>
                                    {results.map((p, i) => (
                                        <tr key={i} style={{ cursor: 'pointer' }} onClick={() => onSelect(p)}>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{p.product_code}</div>
                                                <div style={{ fontSize: '12px' }}>{p.title}</div>
                                                <div style={{ fontSize: '11px', color: '#666' }}>{p.category}</div>
                                            </td>
                                            <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                                <div style={{ fontSize: '12px', marginBottom: '4px' }}>{p.specification}</div>
                                                <button style={{ padding: '4px 8px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Select</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {results.length === 0 && query && !loading && <p>No results found.</p>}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductSearchModal;
