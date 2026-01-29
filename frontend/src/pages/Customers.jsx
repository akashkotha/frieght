import React, { useEffect, useState } from 'react';
import { customersAPI } from '../services/api';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: ''
    });

    useEffect(() => {
        loadCustomers();
    }, [search]);

    const loadCustomers = async () => {
        try {
            const response = await customersAPI.getAll({ search });
            setCustomers(response.data);
        } catch (error) {
            console.error('Error loading customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await customersAPI.create(formData);
            setShowForm(false);
            setFormData({
                customerName: '',
                contactPerson: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                country: ''
            });
            loadCustomers();
        } catch (error) {
            console.error('Error creating customer:', error);
            alert('Failed to create customer');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await customersAPI.delete(id);
                loadCustomers();
            } catch (error) {
                console.error('Error deleting customer:', error);
            }
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <div className="loading-spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }}></div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search
                        size={20}
                        style={{
                            position: 'absolute',
                            left: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--gray-400)'
                        }}
                    />
                    <input
                        type="text"
                        className="input"
                        placeholder="Search customers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ paddingLeft: '2.5rem' }}
                    />
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    <Plus size={20} />
                    Add Customer
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="card mb-4">
                    <h3 className="text-lg font-semibold mb-4">New Customer</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2">
                            <div className="form-group">
                                <label className="label">Customer Name *</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.customerName}
                                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">Contact Person</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.contactPerson}
                                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">Email</label>
                                <input
                                    type="email"
                                    className="input"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">Phone</label>
                                <input
                                    type="tel"
                                    className="input"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">City</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">Country</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="label">Address</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" className="btn btn-primary">Create Customer</button>
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Customers Table */}
            <div className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Contact Person</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Location</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-500)' }}>
                                    No customers found
                                </td>
                            </tr>
                        ) : (
                            customers.map((customer) => (
                                <tr key={customer.customerId}>
                                    <td className="font-semibold">{customer.customerName}</td>
                                    <td>{customer.contactPerson}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.phone}</td>
                                    <td>{customer.city}, {customer.country}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }}>
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                style={{ padding: '0.25rem 0.5rem' }}
                                                onClick={() => handleDelete(customer.customerId)}
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
        </div>
    );
};

export default Customers;
