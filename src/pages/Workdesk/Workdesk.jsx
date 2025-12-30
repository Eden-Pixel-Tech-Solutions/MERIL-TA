
import React, { useState, useEffect } from 'react';
import { Loader2, Briefcase } from 'lucide-react';
import axios from 'axios';

const Workdesk = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/tender-status-history', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setHistory(response.data.data);
                } else {
                    setError('Failed to fetch data');
                }
            } catch (err) {
                console.error('Error fetching workdesk data:', err);
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-500">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Briefcase className="h-6 w-6" />
                Workdesk
            </h1>

            <div className="bg-white rounded-lg border shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">Tender Status History</h3>
                </div>
                <div className="p-6 pt-0">
                    <div className="rounded-md border">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                        Bid Number
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {history.length === 0 ? (
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle text-center" colSpan={1}>
                                            No history found
                                        </td>
                                    </tr>
                                ) : (
                                    history.map((item, index) => (
                                        <tr key={index} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">
                                                {item.bid_number}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Workdesk;
