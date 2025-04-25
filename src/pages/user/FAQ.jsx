import React, { useState} from 'react';
import '../../styles/FAQ.css';
import useFetch from '../../hooks/useFetch';

const FAQ = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const { data: faqs, loading, error } = useFetch(import.meta.env.VITE_BASE_URL + '/api/faqs');

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const filteredFaqs = departmentFilter === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.department === departmentFilter);

  if (loading && !faqs.length) {
    return <div className="loading">Loading FAQs...</div>;
  }

  return (
    <div className="faq-page">
      <div className="header">
        <h1>Frequently Asked Questions</h1>
      </div>

      <div className="filter-section">
        <select 
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="department-filter"
        >
          <option value="all">All Departments</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="General">General</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="faqs-list">
        {filteredFaqs.length === 0 ? (
          <div className="no-faqs">No FAQs found</div>
        ) : (
          filteredFaqs.map(faq => (
            <div key={faq._id} className="faq-item">
              <div 
                className="faq-question"
                onClick={() => toggleFaq(faq._id)}
              >
                <h3>{faq.question}</h3>
                <button
                  className={`expand-button ${expandedFaq === faq._id ? 'expanded' : ''}`}
                  aria-label="Toggle answer"
                >
                  <span className="expand-icon"></span>
                </button>
              </div>

              {expandedFaq === faq._id && (
                <div className="faq-content">
                  <div className="faq-meta">
                    <span className="department">{faq.department}</span>
                  </div>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FAQ; 