import { useState, useEffect } from 'react';
import { invoicesAPI } from '../services/api';
import { FileText, Search, Eye, X, DollarSign, CheckCircle } from 'lucide-react';

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await invoicesAPI.getAll();
            setInvoices(response.data);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (invoice) => {
        try {
            const response = await invoicesAPI.getById(invoice.invoiceId);
            setSelectedInvoice(response.data);
            setShowDetailsModal(true);
        } catch (error) {
            console.error('Error fetching invoice details:', error);
        }
    };

    const handleUpdatePayment = async (invoiceId) => {
        try {
            await invoicesAPI.updatePayment(invoiceId, {
                paymentStatus: 'Paid',
                paidAmount: selectedInvoice.totalAmount,
                paidDate: new Date().toISOString()
            });
            fetchInvoices();
            const response = await invoicesAPI.getById(invoiceId);
            setSelectedInvoice(response.data);
            alert('Payment updated successfully!');
        } catch (error) {
            console.error('Error updating payment:', error);
            alert('Failed to update payment');
        }
    };

    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch = invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.customer?.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = statusFilter === 'All' || invoice.paymentStatus === statusFilter;
        return matchesSearch && matchesFilter;
    });

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Paid': return 'badge-success';
            case 'Pending': return 'badge-warning';
            case 'Overdue': return 'badge-danger';
            case 'Cancelled': return 'badge-secondary';
            default: return 'badge-secondary';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const isOverdue = (invoice) => {
        if (invoice.paymentStatus === 'Paid') return false;
        return new Date(invoice.dueDate) < new Date();
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <FileText className="page-icon" />
                        Invoices Management
                    </h1>
                    <p className="page-subtitle">Track payments and billing</p>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="search-box">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search by invoice number or customer..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label style={{ marginRight: '0.5rem', color: 'var(--text-secondary)' }}>Status:</label>
                        <select
                            className="form-input"
                            style={{ width: 'auto', minWidth: '150px' }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Overdue">Overdue</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-spinner">Loading invoices...</div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Invoice #</th>
                                    <th>Customer</th>
                                    <th>Shipment #</th>
                                    <th>Invoice Date</th>
                                    <th>Due Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInvoices.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                            No invoices found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInvoices.map((invoice) => (
                                        <tr key={invoice.invoiceId} style={isOverdue(invoice) ? { background: 'rgba(239, 68, 68, 0.05)' } : {}}>
                                            <td>
                                                <strong>{invoice.invoiceNumber}</strong>
                                            </td>
                                            <td>{invoice.customer?.customerName || '-'}</td>
                                            <td>{invoice.shipment?.shipmentNumber || '-'}</td>
                                            <td>{formatDate(invoice.invoiceDate)}</td>
                                            <td>
                                                {formatDate(invoice.dueDate)}
                                                {isOverdue(invoice) && (
                                                    <span style={{ marginLeft: '0.5rem', color: 'var(--danger)', fontSize: '0.75rem' }}>
                                                        (Overdue)
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <strong>{formatCurrency(invoice.totalAmount)}</strong>
                                            </td>
                                            <td>
                                                <span className={`badge ${getStatusBadgeClass(isOverdue(invoice) && invoice.paymentStatus === 'Pending' ? 'Overdue' : invoice.paymentStatus)}`}>
                                                    {isOverdue(invoice) && invoice.paymentStatus === 'Pending' ? 'Overdue' : invoice.paymentStatus}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn-icon btn-icon-primary"
                                                    onClick={() => handleViewDetails(invoice)}
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="card-footer">
                    <p className="text-secondary">
                        Showing {filteredInvoices.length} of {invoices.length} invoices
                    </p>
                </div>
            </div>

            {/* Invoice Details Modal */}
            {showDetailsModal && selectedInvoice && (
                <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Invoice Details</h2>
                            <button className="modal-close" onClick={() => setShowDetailsModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body">
                            {/* Invoice Header */}
                            <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--primary)' }}>
                                            {selectedInvoice.invoiceNumber}
                                        </h3>
                                        <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)' }}>
                                            Invoice Date: {formatDate(selectedInvoice.invoiceDate)}
                                        </p>
                                    </div>
                                    <span className={`badge ${getStatusBadgeClass(selectedInvoice.paymentStatus)}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                                        {selectedInvoice.paymentStatus}
                                    </span>
                                </div>
                            </div>

                            {/* Customer & Shipment Info */}
                            <div className="detail-grid" style={{ marginBottom: '2rem' }}>
                                <div className="detail-item">
                                    <label>Customer</label>
                                    <strong>{selectedInvoice.customer?.customerName}</strong>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                                        {selectedInvoice.customer?.email}
                                    </p>
                                </div>
                                <div className="detail-item">
                                    <label>Shipment Number</label>
                                    <p>{selectedInvoice.shipment?.shipmentNumber}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Due Date</label>
                                    <p>{formatDate(selectedInvoice.dueDate)}</p>
                                    {isOverdue(selectedInvoice) && selectedInvoice.paymentStatus !== 'Paid' && (
                                        <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>Overdue</span>
                                    )}
                                </div>
                                {selectedInvoice.paidDate && (
                                    <div className="detail-item">
                                        <label>Paid Date</label>
                                        <p>{formatDate(selectedInvoice.paidDate)}</p>
                                    </div>
                                )}
                            </div>

                            {/* Amount Breakdown */}
                            <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-primary)' }}>
                                    Amount Breakdown
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>Subtotal:</span>
                                        <span style={{ color: 'var(--text-primary)' }}>{formatCurrency(selectedInvoice.subTotal)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>Tax (18% GST):</span>
                                        <span style={{ color: 'var(--text-primary)' }}>{formatCurrency(selectedInvoice.taxAmount)}</span>
                                    </div>
                                    <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }}></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem' }}>
                                        <strong style={{ color: 'var(--text-primary)' }}>Total Amount:</strong>
                                        <strong style={{ color: 'var(--primary)' }}>{formatCurrency(selectedInvoice.totalAmount)}</strong>
                                    </div>
                                    {selectedInvoice.paidAmount > 0 && (
                                        <>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'var(--text-secondary)' }}>Paid Amount:</span>
                                                <span style={{ color: 'var(--success)' }}>{formatCurrency(selectedInvoice.paidAmount)}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'var(--text-secondary)' }}>Balance:</span>
                                                <span style={{ color: selectedInvoice.totalAmount - selectedInvoice.paidAmount > 0 ? 'var(--danger)' : 'var(--success)' }}>
                                                    {formatCurrency(selectedInvoice.totalAmount - selectedInvoice.paidAmount)}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Payment Action */}
                            {selectedInvoice.paymentStatus !== 'Paid' && selectedInvoice.paymentStatus !== 'Cancelled' && (
                                <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                                    <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Mark as Paid</h3>
                                    <button
                                        className="btn-primary"
                                        onClick={() => handleUpdatePayment(selectedInvoice.invoiceId)}
                                    >
                                        <CheckCircle size={16} />
                                        Confirm Payment Received
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowDetailsModal(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Invoices;
