import { useState, useEffect } from 'react';
import { vendorsAPI } from '../services/api';
import { Truck, Search, Plus, Edit2, Trash2, X } from 'lucide-react';

const Vendors = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [serviceTypeFilter, setServiceTypeFilter] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);
    const [formData, setFormData] = useState({
        vendorName: '',
        serviceType: 'Air',
        contactPerson: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            setLoading(true);
            const response = await vendorsAPI.getAll();
            setVendors(response.data);
        } catch (error) {
            console.error('Error fetching vendors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingVendor) {
                await vendorsAPI.update(editingVendor.vendorId, formData);
            } else {
                await vendorsAPI.create(formData);
            }
            fetchVendors();
            resetForm();
        } catch (error) {
            console.error('Error saving vendor:', error);
            alert('Failed to save vendor');
        }
    };

    const handleEdit = (vendor) => {
        setEditingVendor(vendor);
        setFormData({
            vendorName: vendor.vendorName,
            serviceType: vendor.serviceType,
            contactPerson: vendor.contactPerson,
            email: vendor.email,
            phone: vendor.phone,
            address: vendor.address
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this vendor?')) {
            try {
                await vendorsAPI.delete(id);
                fetchVendors();
            } catch (error) {
                console.error('Error deleting vendor:', error);
                alert('Failed to delete vendor');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            vendorName: '',
            serviceType: 'Air',
            contactPerson: '',
            email: '',
            phone: '',
            address: ''
        });
        setEditingVendor(null);
        setShowForm(false);
    };

    const filteredVendors = vendors.filter(vendor => {
        const matchesSearch = vendor.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (vendor.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
        const matchesFilter = serviceTypeFilter === 'All' || vendor.serviceType === serviceTypeFilter;
        return matchesSearch && matchesFilter;
    });

    const getServiceTypeIcon = (type) => {
        switch (type) {
            case 'Air': return '✈️';
            case 'Sea': return '🚢';
            case 'Road': return '🚛';
            default: return '📦';
        }
    };

    const getServiceTypeBadgeClass = (type) => {
        switch (type) {
            case 'Air': return 'badge-primary';
            case 'Sea': return 'badge-info';
            case 'Road': return 'badge-warning';
            default: return 'badge-secondary';
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <Truck className="page-icon" />
                        Vendors Management
                    </h1>
                    <p className="page-subtitle">Manage logistics service providers</p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? 'Cancel' : 'Add Vendor'}
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                        {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Vendor Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.vendorName}
                                    onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Service Type *</label>
                                <select
                                    className="form-input"
                                    value={formData.serviceType}
                                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                                    required
                                >
                                    <option value="Air">Air</option>
                                    <option value="Sea">Sea</option>
                                    <option value="Road">Road</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Contact Person</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.contactPerson}
                                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Address</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                {editingVendor ? 'Update Vendor' : 'Create Vendor'}
                            </button>
                            <button type="button" className="btn-secondary" onClick={resetForm}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card">
                <div className="card-header">
                    <div className="search-box">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search vendors..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label style={{ marginRight: '0.5rem', color: 'var(--text-secondary)' }}>Filter:</label>
                        <select
                            className="form-input"
                            style={{ width: 'auto', minWidth: '150px' }}
                            value={serviceTypeFilter}
                            onChange={(e) => setServiceTypeFilter(e.target.value)}
                        >
                            <option value="All">All Services</option>
                            <option value="Air">Air</option>
                            <option value="Sea">Sea</option>
                            <option value="Road">Road</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-spinner">Loading vendors...</div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Vendor Name</th>
                                    <th>Service Type</th>
                                    <th>Contact Person</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredVendors.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                            No vendors found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredVendors.map((vendor) => (
                                        <tr key={vendor.vendorId}>
                                            <td>
                                                <strong>{vendor.vendorName}</strong>
                                            </td>
                                            <td>
                                                <span className={`badge ${getServiceTypeBadgeClass(vendor.serviceType)}`}>
                                                    {getServiceTypeIcon(vendor.serviceType)} {vendor.serviceType}
                                                </span>
                                            </td>
                                            <td>{vendor.contactPerson || '-'}</td>
                                            <td>{vendor.email || '-'}</td>
                                            <td>{vendor.phone || '-'}</td>
                                            <td>
                                                <span className={`badge ${vendor.isActive ? 'badge-success' : 'badge-danger'}`}>
                                                    {vendor.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn-icon btn-icon-primary"
                                                        onClick={() => handleEdit(vendor)}
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        className="btn-icon btn-icon-danger"
                                                        onClick={() => handleDelete(vendor.vendorId)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
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
                        Showing {filteredVendors.length} of {vendors.length} vendors
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Vendors;
