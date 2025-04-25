import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/AnnouncementManagement.css';
import AdminHeading from '../../../components/ui/AdminHeading';

import { toast } from 'react-toastify';

const AnnouncementManagement = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedAnnouncement, setExpandedAnnouncement] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch(import.meta.env.VITE_BASE_URL + '/api/admin/announcements', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch announcements');
      }
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      setError('Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {

    try {
      const response = await fetch(import.meta.env.VITE_BASE_URL + `/api/admin/announcements/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete announcement');
      }
      setAnnouncements(prev => prev.filter(announcement => announcement._id !== id));
      toast.success('Announcement deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete announcement');
    }
  };

  const toggleAnnouncement = (id) => {
    setExpandedAnnouncement(expandedAnnouncement === id ? null : id);
  };

  if (loading && !announcements.length) {
    return <div className="loading">Loading announcements...</div>;
  }

  return (
    <div className="announcement-management">
      <AdminHeading 
      title="Announcement Management" 
     /> 

      <div className="create-announcement-section">
          <button 
            className="create-announcement-btn"
            onClick={() => navigate('/admin/announcements/new')}
          >
            Create New Announcement
          </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="announcements-list">
        {announcements.length === 0 ? (
          <div className="no-announcements">No announcements found</div>
        ) : (
          <ul className="announcement-items">
            {announcements.map(announcement => (
              <li key={announcement._id} className="announcement-item">
                <div className="announcement-header">
                  <div className="announcement-title">
                    <h3>{announcement.title}</h3>
                    <span className={`priority-badge ${announcement.priority}`}>
                      {announcement.priority}
                    </span>
                    <span className="department-tag">{announcement.department}</span>
                  </div>
                  <div className="announcement-actions">
                    <button
                      className="action-btn"
                      onClick={() => navigate(`/admin/announcements/${announcement._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => handleDelete(announcement._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="action-btn expand-btn"
                      onClick={() => toggleAnnouncement(announcement._id)}
                    >
                      {expandedAnnouncement === announcement._id ? '−' : '+'}
                    </button>
                  </div>
                </div>

                {expandedAnnouncement === announcement._id && (
                  <div className="announcement-content">
                    <div className="announcement-description">
                      <p>{announcement.description}</p>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AnnouncementManagement; 