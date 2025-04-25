import React, { useState } from 'react'; // 👈 add useState
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../styles/AdminLayout.css';
import vitLogo from '../assets/vit-logo.png';
import { FaTrash } from 'react-icons/fa';

import { toast } from 'react-toastify';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 👈 add sidebar toggle state

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/public-queries', label: 'Public Queries', icon: '🌐' },
    { path: '/admin/faqs', label: 'FAQ Management', icon: '❓' },
    { path: '/admin/announcements', label: 'Announcements', icon: '📢' },
    { path: '/admin/analytics', label: 'Analytics & Reports', icon: '📈' },
    { path: '/admin/trash', label: 'Trash', icon: <FaTrash /> },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BASE_URL + '/api/admin/logout', {
        credentials: 'include'
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to logout');
      }
      navigate('/admin/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to logout');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="admin-layout">
      <aside className={`sidebar ${isSidebarOpen ? 'active' : ''}`}> {/* 👈 toggled class */}
        <div className="sidebar-header">
          <img src={vitLogo} alt="VIT Logo" className="sidebar-logo" />
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsSidebarOpen(false)} // auto-close on click
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="mobile-header">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <i className="bi bi-list">☰</i>
          </button>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
