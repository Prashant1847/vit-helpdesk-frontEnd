import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../styles/AnnouncementForm.css';

import { toast } from 'react-toastify';

const AnnouncementForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchAnnouncement();
    }
  }, [id]);

  const fetchAnnouncement = async () => {
    try {
      setLoading(true);
      const response = await fetch(import.meta.env.VITE_BASE_URL + `/api/admin/announcements/${id}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch announcement');
      }
      const announcement = await response.json();
      setFormData({
        title: announcement.title,
        description: announcement.description,
        });
    } catch (error) {
      setError('Failed to fetch announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const url = id ? `/api/admin/announcements/${id}` : '/api/admin/announcements';
      const method = id ? 'PUT' : 'POST';
      
      const response = await fetch(baseUrl + url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save announcement');
      }

      navigate('/admin/announcements');
      toast.success('Announcement saved successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to save announcement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Working on it...</div>;
  }

  return (
    <div className="announcement-form-container">
      <div className="header">
        <h1>{id ? 'Edit Announcement' : 'Create New Announcement'}</h1>
      </div>
      
      <div className="form-container">
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/admin/announcements')}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementForm; 