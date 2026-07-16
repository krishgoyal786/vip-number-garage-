import React, { useState } from 'react';
import './RequestForm.css';

const RequestForm = ({ onSubmit, user, onLoginClick }) => {
  const [request, setRequest] = useState({ name: '', phone: '', pattern: '', budget: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first to submit a number request.");
      onLoginClick();
      return;
    }
    onSubmit(request);
    setSent(true);
    setRequest({ name: '', phone: '', pattern: '', budget: '' });
  };

  if (sent) {
    return (
      <div className="request-success">
        <span className="success-icon">✨</span>
        <h3>Request Received!</h3>
        <p>Our team will search our offline database and contact you soon.</p>
        <button onClick={() => setSent(false)} className="request-again-btn">Request Another</button>
      </div>
    );
  }

  return (
    <div className="request-form-box">
      <div className="request-header">
        <h3>Can't find your dream number?</h3>
        <p>Tell us what you're looking for, and we'll find it for you!</p>
      </div>
      <form onSubmit={handleSubmit} className="request-form">
        <div className="request-grid">
          <input 
            type="text" placeholder="Full Name" required 
            value={request.name}
            onChange={(e) => setRequest({...request, name: e.target.value})}
          />
          <input 
            type="tel" placeholder="Mobile Number" required 
            value={request.phone}
            onChange={(e) => setRequest({...request, phone: e.target.value})}
          />
          <input 
            type="text" placeholder="Desired Pattern (e.g. 00007, 786...)" required 
            value={request.pattern}
            onChange={(e) => setRequest({...request, pattern: e.target.value})}
          />
          <input 
            type="text" placeholder="Your Budget (₹)" required 
            value={request.budget}
            onChange={(e) => setRequest({...request, budget: e.target.value})}
          />
        </div>
        <button type="submit" className="request-submit-btn">
          {user ? "Send My Request" : "Login to Send Request"}
        </button>
      </form>
    </div>
  );
};

export default RequestForm;
