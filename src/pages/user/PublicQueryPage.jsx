import React, { useState, useEffect} from 'react';
import '../../styles/PublicQueryPage.css';
import useFetch from '../../hooks/useFetch';
import '../../styles/AnnouncementsPage.css'; // 👈 Add this line

import { DEPARTMENT_LIST } from '../../constants/constants';

const PublicQueryPage = () => {
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [expandedQuery, setExpandedQuery] = useState(null);

  
  const { data: queries, loading, error } = useFetch(import.meta.env.VITE_BASE_URL + '/api/public/queries');

  useEffect(() => {
    filterQueries(searchTerm, selectedDepartment, sortBy);
  }, [queries]);


  const handleSearch = (value) => {
    setSearchTerm(value);
    filterQueries(value, selectedDepartment, sortBy);
  };

  const handleSort = (value) => {
    setSortBy(value);
    filterQueries(searchTerm, selectedDepartment, value);
  };

  const handleDepartmentFilter = (value) => {
    setSelectedDepartment(value);
    filterQueries(searchTerm, value, sortBy);
  };

  const filterQueries = (search, department, sort) => {
    let filtered = [...queries];

    // Apply search filter
    if (search) {
      filtered = filtered.filter(query =>
        query.title.toLowerCase().includes(search.toLowerCase()) ||
        query.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply department filter
    if (department !== 'all') {
      filtered = filtered.filter(query => query.department === department);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.updatedAt);
      const dateB = new Date(b.updatedAt);
      return sort === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredQueries(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading public queries...</div>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="public-queries-page">
      <div className="header" style={{display: 'block'}}>
        <h1>Public Queries</h1>
        <p className="header-subtitle">The Public Query page shows recently asked and commonly shared questions along with their answers, approved by the Help Desk.</p>
      </div>

      <div className="filters-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search queries..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="newest">Newest Resolved</option>
            <option value="oldest">Oldest Resolved</option>
          </select>

          <select
            value={selectedDepartment}
            onChange={(e) => handleDepartmentFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            {DEPARTMENT_LIST.map((dept, index) => (
              <option key={index} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="queries-list">
        {filteredQueries.length > 0 ? (
          filteredQueries.map((query) => (
            <div key={query._id} className="announcement-card">
              <div className="announcement-header">
                <div className="announcement-main">
                  <h3>{query.public.title}</h3>
                  <p className="announcement-description">{query.public.description}</p>
                  <div className="announcement-meta">
                    <span className="department-tag">{query.department}</span>
                    <span className="date">Posted: {formatDate(query.createdAt)}</span>
                    <span className="date">Updated: {formatDate(query.updatedAt)}</span>
                  </div>
                </div>
                <button
                  className={`expand-button ${expandedQuery === query._id ? 'expanded' : ''}`}
                  onClick={() => setExpandedQuery(expandedQuery === query._id ? null : query._id)}
                  aria-label="Toggle admin response"
                >
                  <span className="expand-icon"></span>
                </button>
              </div>
          
              {expandedQuery === query._id && (
                <div className="admin-response">
                  <h4>Admin Response</h4>
                  <p>{query.public.response}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No public queries found matching your criteria.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default PublicQueryPage; 