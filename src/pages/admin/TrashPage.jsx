import React, { useState, useEffect} from 'react';
import QueryFilters from '../../components/QueryFilters';
import '../../styles/Dashboard.css';
import AdminHeading from '../../components/ui/AdminHeading';

import { toast } from 'react-toastify';

const TrashPage = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    startDate: '',
    endDate: '',
    queryId: '',
    email: '',
    keyword: ''
  });

  useEffect(() => {
    fetchTrashedQueries();
  }, []);

  const fetchTrashedQueries = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      // Add all non-empty filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(import.meta.env.VITE_BASE_URL + `/api/admin/trash?${queryParams.toString()}`, {
        credentials: 'include',
      });
      
      const data = await response.json();
      if (response.ok) {
        setQueries(data);
      } else {
        console.error('Error fetching trashed queries:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    fetchTrashedQueries();
  };

  const handleReset = () => {
    setFilters({
      status: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      startDate: '',
      endDate: '',
      queryId: '',
      email: '',
      keyword: ''
    });
    fetchTrashedQueries();
  };


  //do indexing 
  const handleRestore = async (queryId) => {
    try {
      const response = await fetch(import.meta.env.VITE_BASE_URL + `/api/admin/trash/restore/${queryId}`, {
        method: 'PUT',
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to restore query');
      }

      // Remove the restored query from the list
      setQueries(queries.filter(query => query.queryId !== queryId));
      toast.success('Query restored successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to restore query');
    }
  };


  return (
    <div className="dashboard">
      <AdminHeading 
      title="Trash" 
     />

      <QueryFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onReset={handleReset}
        isAdminView={true}
      />

      <div className="queries-list">
        {loading ? (
          <div className="loading">Loading trashed queries...</div>
        ) : queries.length === 0 ? (
          <div className="no-queries">No trashed queries found</div>
        ) : (
          <table className="queries-table">
            <thead>
              <tr>
                <th>Query ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {queries.map((query) => (
                <tr key={query._id}>
                  <td>{query.queryId}</td>
                  <td>{query.title}</td>
                  <td>
                    <span className={`status-badge ${query.status.toLowerCase()}`}>
                      {query.status}
                    </span>
                  </td>
                  <td>{new Date(query.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(query.updatedAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <button 
                      className="restore-btn"
                      onClick={() => handleRestore(query.queryId)}
                    >
                      Restore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>

  );
};

export default TrashPage; 