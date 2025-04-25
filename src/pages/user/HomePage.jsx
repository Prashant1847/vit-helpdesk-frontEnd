import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/HomePage.css';
import FeatureCard from '../../components/home/FeatureCard';
import { FaQuestionCircle, FaChartLine, FaHistory, FaSearch, FaEnvelope, FaEdit, FaPaperclip, FaLightbulb } from 'react-icons/fa';


const whatCanYouDoHereData = [
  {
    Icon: FaQuestionCircle,
    title: 'Submit a Query',
    description: 'Send your concerns directly to the right department',
    iconColor: '#4361ee' // Bright Blue
  },
  {
    Icon: FaChartLine,
    title: 'Track Progress',
    description: 'Monitor your query status and responses',
    iconColor: '#3a0ca3' // Deep Purple
  },
  {
    Icon: FaHistory,
    title: 'View History',
    description: 'Access your complete conversation history',
    iconColor: '#7209b7' // Vibrant Purple
  },
  {
    Icon: FaSearch,
    title: 'Public Queries',
    description: 'Find answers in shared queries and FAQs',
    iconColor: '#f72585' // Hot Pink
  }
];


const quickStartOptionsData = [
  {
    Icon: FaEdit,
    title: 'Post a Query',
    description: 'Ask your question to the right department',
    link: '/post-query',
    iconColor: '#4361ee' // Bright Blue
  },
  {
    Icon: FaHistory,
    title: 'My Queries',
    description: 'Check the status of your queries',
    link: '/track-query',
    iconColor: '#3a0ca3' // Deep Purple
  },
  {
    Icon: FaSearch,
    title: 'Public Queries',
    description: 'Find solutions to common problems',
    link: '/public-queries',
    iconColor: '#7209b7' // Vibrant Purple
  },
  {
    Icon: FaQuestionCircle,
    title: 'FAQs',
    description: 'Learn how the system works',
    link: '/faq',
    iconColor: '#f72585' // Hot Pink
  }
];


const tipsData = [
  {
    Icon: FaEnvelope,
    description: 'Use your official VIT email for everything',
    iconColor: '#f72585' // Hot Pink
  },
  {
    Icon: FaEdit,
    description: 'Keep your query title short and clear',
    iconColor: '#3a0ca3' // Deep purple
  },
  {
    Icon: FaPaperclip,
    description: 'Attach screenshots or documents when needed',
    iconColor: '#7209b7' // Vibrant purple
  },
  {
    Icon: FaLightbulb,
    description: "No issue is too small — we're here to help",
    iconColor: '#f9c74f' // Warm yellow
  }
];


const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <h1>🎯 What Is This Help Desk?</h1>
        <p>Got a problem with fees, Wi-Fi, hostel, or academics? This platform helps you raise your concern directly with the right department — no waiting in lines, no email confusion. Just post, track, and get it resolved.</p>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2>🛠️ What Can You Do Here?</h2>
        <p className="section-subtitle">This isn't just a contact form — it's a full support space:</p>
        <div className="features-grid">

          {whatCanYouDoHereData.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}

        </div>
      </div>

      {/* Process Section */}
      <div className="process-section">
        <h2>🕒 How It Works</h2>
        <div className="process-steps">
          <div className="process-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Submit Your Query</h3>
              <p>Select the right department and describe your issue</p>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '25%' }}></div>
            </div>
          </div>
          <div className="process-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Get Notified</h3>
              <p>Receive email updates when someone responds</p>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '50%' }}></div>
            </div>
          </div>
          <div className="process-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Follow Up</h3>
              <p>Reply in the same thread if needed</p>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '75%' }}></div>
            </div>
          </div>
          <div className="process-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Resolution</h3>
              <p>Query is closed once resolved</p>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Section */}
      <div className="features-section">
        <h2>🧭 Not Sure Where to Start?</h2>
        <div className="features-grid">

          {quickStartOptionsData.map((option, index) => (
            <Link to={option.link} key={index}>
              <FeatureCard key={index} {...option} />
            </Link>
          ))}

        </div>
      </div>

      {/* Tips Section */}
      <div className="features-section">
        <h2>Quick Tips for Smooth Experience</h2>
        <div className="features-grid">
          {tipsData.map((tip, index) => (
            <FeatureCard key={index} {...tip} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage; 