import React, { useState, useRef } from 'react';
import Footer from '../../components/Footer';
import Message from '../../components/Message';
import '../../styles/TrackQueryPage.css';
import { toast } from 'react-toastify';


const TrackQueryPage = () => {
  const footerRef = useRef(null);
  const [formData, setFormData] = useState({
    queryId: '',
    email: ''
  });

  const [queryDetails, setQueryDetails] = useState(null);
  const [followUpMessage, setFollowUpMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusCheck = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setQueryDetails(null);

    try {
      const response = await fetch(import.meta.env.VITE_BASE_URL + `/api/queries/status?queryId=${formData.queryId}&email=${formData.email}`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      const data = await response.json();
      if (!data) {
        throw new Error('Invalid response from server');
      }
      setQueryDetails(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleFollowUp = async (e) => {
    e.preventDefault();
    if (!followUpMessage.trim() && selectedFiles.length === 0) return;

    try {
      if (!queryDetails || !queryDetails.queryId) {
        throw new Error('Query details not found');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('queryId', queryDetails.queryId);
      formDataToSend.append('email', queryDetails.email);
      formDataToSend.append('message', followUpMessage);

      
      selectedFiles.forEach(file => {
        formDataToSend.append('files', file);
      });

      const response = await fetch(import.meta.env.VITE_BASE_URL + `/api/queries/follow-up/${queryDetails.queryId}`, {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to send follow-up');
      }

      const data = await response.json();
      setQueryDetails(data);
      setFollowUpMessage('');
      setSelectedFiles([]);
      toast.success('Follow-up sent successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to send follow-up. Please try again.');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Resolved':
        return 'status-resolved';
      case 'In Progress':
        return 'status-in-progress';
      default:
        return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const scrollToInstructions = () => {
    footerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="track-query-page">
      <div className="header">
        <h1>Track Your Query</h1>
        <button 
          className="instructions-btn"
          onClick={scrollToInstructions}
        >
          Read Instructions
        </button>
      </div>

      {/* Status Check Form */}
      <form onSubmit={handleStatusCheck} className="status-form">
        <div className="form-group">
          <label htmlFor="queryId">Query ID</label>
          <input
            type="text"
            id="queryId"
            name="queryId"
            value={formData.queryId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="check-status-btn" disabled={isLoading}>
          {isLoading ? 'Checking...' : 'Check Status'}
        </button>
      </form>


      {/* Query Details Section */}
      {queryDetails && (
        <div className="query-details">
          <div className="query-info-grid">
            <div className="info-card">
              <div className="info-header">
                <h3>{queryDetails.title}</h3>
                <div className={`status-badge ${getStatusClass(queryDetails.status)}`}>
                  {queryDetails.status}
                </div>
              </div>
              <div className="info-content">
                <div className="info-item">
                  <span className="info-label">Department:</span>
                  <span className="info-value">{queryDetails.department}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Submitted:</span>
                  <span className="info-value">{formatDate(queryDetails.createdAt)}</span>
                </div>
                <div className="info-item description">
                  <div className="info-label">Description:</div>
                  <div className="info-value" style={{marginLeft: "0px"}}>{queryDetails.description}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="timeline">
            <div className={`timeline-step ${queryDetails.status === 'Submitted' ? 'active' : 'completed'}`}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>Submitted</h4>
                <p>{formatDate(queryDetails.createdAt)}</p>
              </div>
            </div>

            <div className={`timeline-step ${queryDetails.status === 'In Progress' ? 'active' : queryDetails.status === 'Resolved' ? 'completed' : ''}`}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>In Progress</h4>
                {queryDetails.updatedAt && <p>{formatDate(queryDetails.updatedAt)}</p>}
              </div>
            </div>

            <div className={`timeline-step ${queryDetails.status === 'Resolved' ? 'active' : ''}`}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>Resolved</h4>
                {queryDetails.resolvedAt && <p>{formatDate(queryDetails.resolvedAt)}</p>}
              </div>
            </div>
          </div>

          {/* Conversation Thread */}
          <div className="conversation-thread">
            <h3>Conversation</h3>
            <div className="messages">
              {queryDetails.conversationHistory.map((message, index) => (
                <Message 
                  key={index} 
                  message={message} 
                  queryId={queryDetails.queryId} 
                />
              ))}
            </div>
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
              <small>Accepted formats: PDF, JPG, JPEG, PNG, DOC, DOCX (Max 5MB each)</small>
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
            

          {/* Follow-up Form */}
          <form onSubmit={handleFollowUp} className="follow-up-form">
            <textarea
              value={followUpMessage}
              onChange={(e) => setFollowUpMessage(e.target.value)}
              placeholder="Type your follow-up message here..."
              required
            />
            
            <button type="submit" className="submit-follow-up-btn" disabled={!followUpMessage.trim() && selectedFiles.length === 0}>
              Send Follow-up
            </button>
          </form>
        </div>
      )}

      <Footer ref={footerRef} pageType="track" />
    </div>
  );
};

export default TrackQueryPage; 