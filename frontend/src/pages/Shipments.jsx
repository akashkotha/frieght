import { useState, useEffect } from 'react';
import { shipmentsAPI, customersAPI, vendorsAPI } from '../services/api';
import { Package, Search, Plus, Eye, X, TrendingUp, Plane, Ship, Truck as TruckIcon } from 'lucide-react';

const Shipments = () => {
    const [shipments, setShipments] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [formData, setFormData] = useState({
        customerId: '',
        vendorId: '',
        originCity: '',
        originCountry: '',
        destinationCity: '',
        destinationCountry: '',
        transportMode: 'Air',
        weight: '',
        volume: '',
        cargoDescription: '',
        expectedDeliveryDate: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [shipmentsData, customersData, vendorsData] = await Promise.all([
                shipmentsAPI.getAll(),
                customersAPI.getAll(),
                vendorsAPI.getAll()
            ]);
            setShipments(shipmentsData.data);
            setCustomers(customersData.data);
            setVendors(vendorsData.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                ...formData,
                customerId: parseInt(formData.customerId),
                vendorId: parseInt(formData.vendorId),
                weight: parseFloat(formData.weight),
                volume: parseFloat(formData.volume),
                expectedDeliveryDate: new Date(formData.expectedDeliveryDate).toISOString()
            };
            await shipmentsAPI.create(submitData);
            fetchData();
            resetForm();
            alert('Shipment created successfully!');
        } catch (error) {
            console.error('Error creating shipment:', error);
            alert('Failed to create shipment');
        }
    };

    const handleViewDetails = async (shipment) => {
        try {
            const response = await shipmentsAPI.getById(shipment.shipmentId);
            setSelectedShipment(response.data);
            setShowDetailsModal(true);
        } catch (error) {
            console.error('Error fetching shipment details:', error);
        }
    };

    const handleUpdateStatus = async (shipmentId, newStatus) => {
        try {
            await shipmentsAPI.updateStatus(shipmentId, {
                status: newStatus,
                remarks: `Status updated to ${newStatus}`
            });
            fetchData();
            if (selectedShipment && selectedShipment.shipmentId === shipmentId) {
                const response = await shipmentsAPI.getById(shipmentId);
                setSelectedShipment(response.data);
            }
            alert('Status updated successfully!');
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const resetForm = () => {
        setFormData({
            customerId: '',
            vendorId: '',
            originCity: '',
            originCountry: '',
            destinationCity: '',
            destinationCountry: '',
            transportMode: 'Air',
            weight: '',
            volume: '',
            cargoDescription: '',
            expectedDeliveryDate: ''
        });
        setShowCreateModal(false);
    };

    const filteredShipments = shipments.filter(shipment => {
        const matchesSearch = shipment.shipmentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shipment.customer?.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = statusFilter === 'All' || shipment.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Delivered': return 'badge-success';
            case 'In Transit': return 'badge-info';
            case 'Booked': return 'badge-warning';
            case 'Cancelled': return 'badge-danger';
            default: return 'badge-secondary';
        }
    };

    const getTransportIcon = (mode) => {
        switch (mode) {
            case 'Air': return <Plane size={16} />;
            case 'Sea': return <Ship size={16} />;
            case 'Road': return <TruckIcon size={16} />;
            default: return <Package size={16} />;
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
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <Package className="page-icon" />
                        Shipments Tracking
                    </h1>
                    <p className="page-subtitle">Monitor and manage all shipments</p>
                </div>
                <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                    <Plus size={20} />
                    Create Shipment
                </button>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="search-box">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search by shipment number or customer..."
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
                            <option value="Booked">Booked</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-spinner">Loading shipments...</div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Shipment #</th>
                                    <th>Customer</th>
                                    <th>Route</th>
                                    <th>Mode</th>
                                    <th>Status</th>
                                    <th>Expected Delivery</th>
                                    <th>Est. Cost</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredShipments.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                            No shipments found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredShipments.map((shipment) => (
                                        <tr key={shipment.shipmentId}>
                                            <td>
                                                <strong>{shipment.shipmentNumber}</strong>
                                            </td>
                                            <td>{shipment.customer?.customerName || '-'}</td>
                                            <td>
                                                <div style={{ fontSize: '0.875rem' }}>
                                                    <div>{shipment.originCity}, {shipment.originCountry}</div>
                                                    <div style={{ color: 'var(--text-secondary)' }}>↓</div>
                                                    <div>{shipment.destinationCity}, {shipment.destinationCountry}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    {getTransportIcon(shipment.transportMode)}
                                                    {shipment.transportMode}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${getStatusBadgeClass(shipment.status)}`}>
                                                    {shipment.status}
                                                </span>
                                            </td>
                                            <td>{formatDate(shipment.expectedDeliveryDate)}</td>
                                            <td>{formatCurrency(shipment.estimatedCost)}</td>
                                            <td>
                                                <button
                                                    className="btn-icon btn-icon-primary"
                                                    onClick={() => handleViewDetails(shipment)}
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
                        Showing {filteredShipments.length} of {shipments.length} shipments
                    </p>
                </div>
            </div>

            {/* Create Shipment Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Create New Shipment</h2>
                            <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Customer *</label>
                                        <select
                                            className="form-input"
                                            value={formData.customerId}
                                            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Customer</option>
                                            {customers.map(customer => (
                                                <option key={customer.customerId} value={customer.customerId}>
                                                    {customer.customerName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Vendor *</label>
                                        <select
                                            className="form-input"
                                            value={formData.vendorId}
                                            onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Vendor</option>
                                            {vendors.map(vendor => (
                                                <option key={vendor.vendorId} value={vendor.vendorId}>
                                                    {vendor.vendorName} ({vendor.serviceType})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Origin City *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.originCity}
                                            onChange={(e) => setFormData({ ...formData, originCity: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Origin Country *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.originCountry}
                                            onChange={(e) => setFormData({ ...formData, originCountry: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Destination City *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.destinationCity}
                                            onChange={(e) => setFormData({ ...formData, destinationCity: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Destination Country *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.destinationCountry}
                                            onChange={(e) => setFormData({ ...formData, destinationCountry: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Transport Mode *</label>
                                        <select
                                            className="form-input"
                                            value={formData.transportMode}
                                            onChange={(e) => setFormData({ ...formData, transportMode: e.target.value })}
                                            required
                                        >
                                            <option value="Air">Air</option>
                                            <option value="Sea">Sea</option>
                                            <option value="Road">Road</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Weight (kg) *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-input"
                                            value={formData.weight}
                                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Volume (CBM) *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-input"
                                            value={formData.volume}
                                            onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Expected Delivery *</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={formData.expectedDeliveryDate}
                                            onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                        <label>Cargo Description</label>
                                        <textarea
                                            className="form-input"
                                            rows="3"
                                            value={formData.cargoDescription}
                                            onChange={(e) => setFormData({ ...formData, cargoDescription: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={resetForm}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Create Shipment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Shipment Details Modal */}
            {showDetailsModal && selectedShipment && (
                <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Shipment Details</h2>
                            <button className="modal-close" onClick={() => setShowDetailsModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <label>Shipment Number</label>
                                    <strong>{selectedShipment.shipmentNumber}</strong>
                                </div>
                                <div className="detail-item">
                                    <label>Status</label>
                                    <span className={`badge ${getStatusBadgeClass(selectedShipment.status)}`}>
                                        {selectedShipment.status}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <label>Customer</label>
                                    <p>{selectedShipment.customer?.customerName}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Vendor</label>
                                    <p>{selectedShipment.vendor?.vendorName}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Origin</label>
                                    <p>{selectedShipment.originCity}, {selectedShipment.originCountry}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Destination</label>
                                    <p>{selectedShipment.destinationCity}, {selectedShipment.destinationCountry}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Transport Mode</label>
                                    <p>{selectedShipment.transportMode}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Weight</label>
                                    <p>{selectedShipment.weight} kg</p>
                                </div>
                                <div className="detail-item">
                                    <label>Volume</label>
                                    <p>{selectedShipment.volume} CBM</p>
                                </div>
                                <div className="detail-item">
                                    <label>Booking Date</label>
                                    <p>{formatDate(selectedShipment.bookingDate)}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Expected Delivery</label>
                                    <p>{formatDate(selectedShipment.expectedDeliveryDate)}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Actual Delivery</label>
                                    <p>{formatDate(selectedShipment.actualDeliveryDate)}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Estimated Cost</label>
                                    <strong>{formatCurrency(selectedShipment.estimatedCost)}</strong>
                                </div>
                                <div className="detail-item">
                                    <label>Actual Cost</label>
                                    <strong>{selectedShipment.actualCost > 0 ? formatCurrency(selectedShipment.actualCost) : '-'}</strong>
                                </div>
                                {selectedShipment.cargoDescription && (
                                    <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                                        <label>Cargo Description</label>
                                        <p>{selectedShipment.cargoDescription}</p>
                                    </div>
                                )}
                            </div>

                            {selectedShipment.status !== 'Delivered' && selectedShipment.status !== 'Cancelled' && (
                                <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                                    <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Update Status</h3>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {selectedShipment.status === 'Booked' && (
                                            <button
                                                className="btn-primary"
                                                onClick={() => handleUpdateStatus(selectedShipment.shipmentId, 'In Transit')}
                                            >
                                                <TrendingUp size={16} />
                                                Mark In Transit
                                            </button>
                                        )}
                                        {selectedShipment.status === 'In Transit' && (
                                            <button
                                                className="btn-primary"
                                                onClick={() => handleUpdateStatus(selectedShipment.shipmentId, 'Delivered')}
                                            >
                                                <Package size={16} />
                                                Mark Delivered
                                            </button>
                                        )}
                                        <button
                                            className="btn-secondary"
                                            onClick={() => handleUpdateStatus(selectedShipment.shipmentId, 'Cancelled')}
                                        >
                                            Cancel Shipment
                                        </button>
                                    </div>
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

export default Shipments;
