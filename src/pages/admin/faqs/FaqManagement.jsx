import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/FAQManagement.css';
import AdminHeading from '../../../components/ui/AdminHeading';

import { toast } from 'react-toastify';

const FAQManagement = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);


  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await fetch(import.meta.env.VITE_BASE_URL + '/api/admin/faqs', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch FAQs');
      }
      const data = await response.json();
      setFaqs(data);
    } catch (error) {
      setError('Failed to fetch FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {

    try {
      const response = await fetch(import.meta.env.VITE_BASE_URL + `/api/admin/faqs/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete FAQ');
      }
      setFaqs(prev => prev.filter(faq => faq._id !== id));
      toast.success('FAQ deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete FAQ');
    }
  };

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  if (loading && !faqs.length) {
    return <div className="loading">Loading FAQs...</div>;
  }

  return (
    <div className="faq-management">
      <AdminHeading 
      title="FAQ Management" 
     />

      <div className="create-faq-section">
          <button 
            className="create-faq-btn"
            onClick={() => navigate('/admin/faqs/new')}
          >
            Create New FAQ
          </button>
        </div>

      {error && <div className="error-message">{error}</div>}

      <div className="faqs-list">
        {faqs.length === 0 ? (
          <div className="no-faqs">No FAQs found</div>
        ) : (
          <ul className="faq-items">
            {faqs.map(faq => (
              <li key={faq._id} className="faq-item">
                <div className="faq-header">
                  <div className="faq-title">
                    <h3>{faq.question}</h3>
                    <span className="department-tag">{faq.department}</span>
                  </div>
                  <div className="faq-actions">
                    <button
                      className="action-btn"
                      onClick={() => navigate(`/admin/faqs/${faq._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => handleDelete(faq._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="action-btn expand-btn"
                      onClick={() => toggleFaq(faq._id)}
                    >
                      {expandedFaq === faq._id ? '−' : '+'}
                    </button>
                  </div>
                </div>

                {expandedFaq === faq._id && (
                  <div className="faq-content">
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
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

export default FAQManagement; 