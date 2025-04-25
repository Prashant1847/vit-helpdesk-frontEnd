import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { QUERY_STATUS_LIST } from '../../constants/constants';
import '../../styles/QueryDetail.css';
import ForwardingHistoryCard from '../../components/queryDetails/ForwardingHistoryCard';
import Message from '../../components/Message';
import { DEPARTMENT_LIST } from '../../constants/constants';

import { toast } from 'react-toastify';


const QueryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingResponse, setSendingResponse] = useState(false);
  const [response, setResponse] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [forwardingNote, setForwardingNote] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');


  useEffect(() => {
    fetchQueryDetails();
  }, [id]);

  const fetchQueryDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(import.meta.env.VITE_BASE_URL + `/api/admin/queries/${id}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error fetching query details');
      }
      setQuery(data.query);
      setSelectedStatus(data.query.status);

    } catch (error) {
      setError(error.message || 'An error occurred while fetching query details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusSelect = (newStatus) => {
    setSelectedStatus(newStatus);
  };

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!response.trim() && selectedFiles.length === 0) return;
    
    setSendingResponse(true);
    try {
      const formData = new FormData();
      formData.append('queryId', query.queryId);
      formData.append('message', response);
      formData.append('status', selectedStatus);
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const fetchResponse = await fetch(import.meta.env.VITE_BASE_URL + `/api/admin/queries/respond/${id}`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!fetchResponse.ok) {
        const data = await fetchResponse.json();
        throw new Error(data.message || 'Failed to send response');
      }

      const data = await fetchResponse.json();
      setQuery(data);
      setResponse('');
      setSelectedFiles([]);
      toast.success('Response sent successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to send response. Please try again.');
    } finally {
      setSendingResponse(false);
    }
  };

  const handleForward = async () => {
  
    if (!selectedDepartment) {
      toast.error('Please select a department to forward to');
      return;
    }

    setSendingResponse(true);

    try {
      const response = await fetch(import.meta.env.VITE_BASE_URL + `/api/admin/queries/forward/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          toDepartment: selectedDepartment,
          note: forwardingNote
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to forward query');
      }

      navigate('/admin');
      toast.success('Query forwarded successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to forward query. Please try again.');
    } finally {
      setSendingResponse(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading query details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!query) {
    return <div className="not-found">Query not found</div>;
  }

  return (
    <div className="query-detail">
      <div className="query-header">
        <h1>Query Details</h1>
        <div className="query-meta">
          <span className="query-id">Query ID: {query.queryId}</span>
          <span className={`status-badge ${query.status.toLowerCase()}`}>
            {query.status}
          </span>
        </div>
      </div>

      <div className="query-info">
        <div className="info-group">
          <h3>Student Information</h3>
          <p><strong>Name:</strong> {query.name}</p>
          <p><strong>Email:</strong> {query.email}</p>
          <p><strong>Department:</strong> {query.department}</p>
        </div>

        <div className="info-group">
          <h3>Query Details</h3>
          <p><strong>Title:</strong> {query.title}</p>
            <p><strong>Created:</strong> {new Date(query.createdAt).toLocaleString()}</p>
          <p><strong>Last Updated:</strong> {new Date(query.updatedAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="status-controls">
        <h3>Select Status</h3>
        <div className="status-buttons">
          {QUERY_STATUS_LIST.map((status) => (
            <button
              key={status}
              className={`status-btn ${selectedStatus === status ? 'active' : ''}`}
              onClick={() => handleStatusSelect(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="conversation">
        <h3>Conversation History</h3>
        <div className="messages">
          {query.conversationHistory.map((message, index) => (
            <Message 
              key={index} 
              message={message} 
              queryId={query.queryId} 
            />
          ))}
        </div>

        <div className="file-upload">
            <label htmlFor="files">Attach Files (Optional)</label>
            <input
              type="file"
              id="files"
              name="files"
              onChange={handleFileChange}
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            <small>Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 5MB each)</small>
            {selectedFiles.length > 0 && (
              <div className="selected-files">
                <p>Selected files:</p>
                <ul>
                  {selectedFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        <form onSubmit={handleSubmit} className="response-form">
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Type your response here..."
            required
          />
        
          <div className="response-actions">
            <button type="submit" disabled={!response.trim() && selectedFiles.length === 0}>
              {sendingResponse ? 'Sending...' : 'Send Response'}
            </button>
            <span className="status-indicator">
              Status will be updated to: <strong>{selectedStatus}</strong>
            </span>
          </div>
        </form>
      </div>

      {query?.forwardingHistory && query.forwardingHistory.length > 0 && (
        <div className="forwarding-history">
          <h3>Forwarding History</h3>
          <div className="timeline-container">
            <div className="timeline-horizontal">
              {query.forwardingHistory.map((event, index) => (
                <ForwardingHistoryCard key={index} event={event} />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="forward-section">
        <h3>Forward Query</h3>
        <div className="forward-form-minimal">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="forward-select"
          >
            <option value="">Select Department</option>
            {DEPARTMENT_LIST
              .filter(dept => dept !== query?.department)
              .map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
          </select>
          <textarea
            value={forwardingNote}
            onChange={(e) => setForwardingNote(e.target.value)}
            placeholder="Add a note (optional)"
            className="forward-note"
          />
          <button 
            onClick={handleForward}
            className="forward-btn-minimal"
            disabled={!selectedDepartment}
          >
            {sendingResponse ? 'Forwarding...' : 'Forward Query'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueryDetail;   