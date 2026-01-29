import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/vendors" element={<ComingSoon page="Vendors" />} />
                    <Route path="/shipments" element={<ComingSoon page="Shipments" />} />
                    <Route path="/invoices" element={<ComingSoon page="Invoices" />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Placeholder component for pages not yet implemented
const ComingSoon = ({ page }) => (
  <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
    <h2 className="text-2xl font-bold mb-4">{page} Page</h2>
    <p className="text-gray-600">
      This page is under construction. The backend API is ready and functional.
    </p>
    <p className="text-gray-600 mt-2">
      Similar to the Customers page, you can implement full CRUD operations here.
    </p>
  </div>
);

export default App;
