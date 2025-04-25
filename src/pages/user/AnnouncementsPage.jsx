import React, { useState} from 'react';
import '../../styles/AnnouncementsPage.css';
import useFetch from '../../hooks/useFetch';
import { DEPARTMENT_LIST } from '../../constants/constants';


const AnnouncementsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [expandedAnnouncement, setExpandedAnnouncement] = useState(null);
  

  const { data: announcements, loading, error } = useFetch(import.meta.env.VITE_BASE_URL + '/api/announcements');


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDepartmentFilter = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const toggleAnnouncement = (id) => {
    setExpandedAnnouncement(expandedAnnouncement === id ? null : id);
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || announcement.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading announcements...</div>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="announcements-page">
      <div className="header">
        <h1>Announcements</h1>
      </div>

      <div className="filters-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="filter-controls">
          <select
            value={selectedDepartment}
            onChange={handleDepartmentFilter}
          >
            <option value="all">All Departments</option>
            {DEPARTMENT_LIST.map((dept, index) => (
              <option key={index} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="announcements-list">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <div key={announcement._id} className="announcement-card">
              <div className="announcement-header">
                <div className="announcement-main">
                  <h3>{announcement.title}</h3>
                  <div className="announcement-meta">
                    <span className="department-tag">{announcement.department}</span>
                    <span className="date">{new Date(announcement.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  className={`expand-button ${expandedAnnouncement === announcement._id ? 'expanded' : ''}`}
                  onClick={() => toggleAnnouncement(announcement._id)}
                  aria-label="Toggle announcement details"
                >
                  <span className="expand-icon"></span>
                </button>
              </div>

              {expandedAnnouncement === announcement._id && (
                <div className="announcement-content">
                  <p className="announcement-description">{announcement.description}</p>
                  {announcement.attachments && announcement.attachments.length > 0 && (
                    <div className="attachments">
                      <h4>Attachments:</h4>
                      <ul>
                        {announcement.attachments.map((attachment, index) => (
                          <li key={index}>
                            <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                              {attachment.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No announcements found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage; 