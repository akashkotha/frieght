import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../services/api';
import {
    Package,
    TrendingUp,
    AlertTriangle,
    DollarSign,
    FileText
} from 'lucide-react';
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const [revenueTrend, setRevenueTrend] = useState([]);
    const [shipmentsByMode, setShipmentsByMode] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);
    const [delayedShipments, setDelayedShipments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [summaryRes, trendRes, modeRes, customersRes, delayedRes] = await Promise.all([
                dashboardAPI.getSummary(),
                dashboardAPI.getRevenueTrend(),
                dashboardAPI.getShipmentsByMode(),
                dashboardAPI.getTopCustomers(),
                dashboardAPI.getDelayedShipments(),
            ]);

            setSummary(summaryRes.data);
            setRevenueTrend(trendRes.data);
            setShipmentsByMode(modeRes.data);
            setTopCustomers(customersRes.data);
            setDelayedShipments(delayedRes.data);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#1e40af', '#0891b2', '#10b981', '#f59e0b', '#ef4444'];

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <div className="loading-spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }}></div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-4 mb-4">
                <div className="card">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-sm text-gray-600">Total Shipments</div>
                            <div className="text-2xl font-bold">{summary?.totalShipmentsThisMonth || 0}</div>
                            <div className="text-sm text-gray-600">This Month</div>
                        </div>
                        <div style={{
                            background: '#dbeafe',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-lg)'
                        }}>
                            <Package size={24} color="#1e40af" />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-sm text-gray-600">Active Shipments</div>
                            <div className="text-2xl font-bold">{summary?.activeShipments || 0}</div>
                            <div className="text-sm text-gray-600">In Progress</div>
                        </div>
                        <div style={{
                            background: '#d1fae5',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-lg)'
                        }}>
                            <TrendingUp size={24} color="#10b981" />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-sm text-gray-600">Delayed Shipments</div>
                            <div className="text-2xl font-bold" style={{ color: 'var(--danger)' }}>
                                {summary?.delayedShipments || 0}
                            </div>
                            <div className="text-sm text-gray-600">Needs Attention</div>
                        </div>
                        <div style={{
                            background: '#fee2e2',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-lg)'
                        }}>
                            <AlertTriangle size={24} color="#ef4444" />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-sm text-gray-600">Revenue (Month)</div>
                            <div className="text-2xl font-bold">
                                ₹{summary?.totalRevenueThisMonth?.toLocaleString() || 0}
                            </div>
                            <div className="text-sm text-gray-600">
                                {summary?.pendingInvoices || 0} Pending
                            </div>
                        </div>
                        <div style={{
                            background: '#fef3c7',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-lg)'
                        }}>
                            <DollarSign size={24} color="#f59e0b" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-2 mb-4">
                {/* Revenue Trend */}
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Revenue Trend (Last 6 Months)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#1e40af"
                                strokeWidth={2}
                                name="Revenue"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Shipments by Mode */}
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Shipments by Transport Mode</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={shipmentsByMode}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ transportMode, percentage }) =>
                                    `${transportMode}: ${percentage.toFixed(1)}%`
                                }
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {shipmentsByMode.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Tables Row */}
            <div className="grid grid-cols-2">
                {/* Top Customers */}
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Top Customers by Revenue</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Shipments</th>
                                <th>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topCustomers.map((customer) => (
                                <tr key={customer.customerId}>
                                    <td>{customer.customerName}</td>
                                    <td>{customer.shipmentCount}</td>
                                    <td>₹{customer.totalRevenue.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Delayed Shipments */}
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle size={20} color="#ef4444" />
                            Delayed Shipments
                        </div>
                    </h3>
                    {delayedShipments.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '2rem',
                            color: 'var(--gray-500)'
                        }}>
                            No delayed shipments
                        </div>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Shipment #</th>
                                    <th>Customer</th>
                                    <th>Days Delayed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {delayedShipments.slice(0, 5).map((shipment) => (
                                    <tr key={shipment.shipmentId}>
                                        <td>{shipment.shipmentNumber}</td>
                                        <td>{shipment.customerName}</td>
                                        <td>
                                            <span className="badge badge-danger">
                                                {shipment.daysDelayed} days
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
