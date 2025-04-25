import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import HomePage from './pages/user/HomePage';
import PostQueryPage from './pages/user/PostQueryPage';
import TrackQueryPage from './pages/user/TrackQueryPage';
import PublicQueryPage from './pages/user/PublicQueryPage';
import FAQ from './pages/user/FAQ';
import AnnouncementsPage from './pages/user/AnnouncementsPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';


import AdminAnnouncementManagement from './pages/admin/announcements/AnnouncementManagement';
import AdminAnnouncementForm from './pages/admin/announcements/AnnouncementForm';

import AdminQueryDetail from './pages/admin/QueryDetail';

import AdminPublicQueryForm from './pages/admin/publicQueries/PublicQueryForm';
import PublicQueryManagement from './pages/admin/publicQueries/PublicQueryManagement';


import AdminFAQManagement from './pages/admin/faqs/FaqManagement';
import FAQForm from './pages/admin/faqs/FAQForm';

import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import TrashPage from './pages/admin/TrashPage';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';




const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Layout with Sidebar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/post-query" element={<PostQueryPage />} />
          <Route path="/track-query" element={<TrackQueryPage />} />
          <Route path="/public-queries" element={<PublicQueryPage />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
        </Route>

        {/* Admin Login Page — outside layout */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Layout */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />

          <Route path="faqs" element={<AdminFAQManagement />}/>
          <Route path="faqs/new" element={<FAQForm />} />
          <Route path="faqs/:id" element={<FAQForm />} />

          <Route path="announcements" element={<AdminAnnouncementManagement />} />
          <Route path="announcements/new" element={<AdminAnnouncementForm />} />
          <Route path="announcements/:id" element={<AdminAnnouncementForm />} />

          <Route path="queries/:id" element={<AdminQueryDetail />} />
          <Route path="queries/:id/public" element={<AdminPublicQueryForm />} />

          <Route path="analytics" element={<AnalyticsDashboard />} />

          <Route path="public-queries" element={<PublicQueryManagement />} />

          <Route path="trash" element={<TrashPage />} />
        </Route>
      </Routes>
      <ToastContainer
        position="bottom-center"
        // autoClose={4000}
        autoClose={false}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        limit={3}
      />
    </Router>
  );
};

export default App;
