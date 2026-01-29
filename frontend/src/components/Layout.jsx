import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Truck,
    Package,
    FileText,
    LogOut,
    Menu,
    X
} from 'lucide-react';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = React.useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/customers', icon: Users, label: 'Customers' },
        { path: '/vendors', icon: Truck, label: 'Vendors' },
        { path: '/shipments', icon: Package, label: 'Shipments' },
        { path: '/invoices', icon: FileText, label: 'Invoices' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside style={{
                width: sidebarOpen ? '250px' : '0',
                background: 'var(--gray-900)',
                color: 'white',
                transition: 'width 0.3s ease',
                overflow: 'hidden',
                position: 'fixed',
                height: '100vh',
                zIndex: 1000
            }}>
                <div style={{ padding: '1.5rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '2rem'
                    }}>
                        <Package size={28} />
                        <h1 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Freight ERP</h1>
                    </div>

                    <nav>
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.75rem 1rem',
                                        borderRadius: 'var(--radius-md)',
                                        marginBottom: '0.5rem',
                                        background: isActive ? 'var(--primary)' : 'transparent',
                                        color: 'white',
                                        textDecoration: 'none',
                                        transition: 'background 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '1.5rem',
                    borderTop: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>Logged in as</div>
                        <div style={{ fontWeight: '600' }}>{user?.fullName}</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{user?.role}</div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn btn-danger"
                        style={{ width: '100%' }}
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div style={{
                flex: 1,
                marginLeft: sidebarOpen ? '250px' : '0',
                transition: 'margin-left 0.3s ease'
            }}>
                {/* Header */}
                <header style={{
                    background: 'white',
                    borderBottom: '1px solid var(--gray-200)',
                    padding: '1rem 1.5rem',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="btn btn-outline"
                        style={{ padding: '0.5rem' }}
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: 'var(--gray-900)'
                    }}>
                        {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                    </div>

                    <div style={{ width: '40px' }}></div>
                </header>

                {/* Page Content */}
                <main style={{ padding: '1.5rem' }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
