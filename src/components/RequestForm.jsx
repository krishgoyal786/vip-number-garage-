import React, { useState } from 'react';
import './RequestForm.css';

const RequestForm = ({ onSubmit, user, onLoginClick }) => {
  const [request, setRequest] = useState({ name: '', phone: '', pattern: '', budget: '' });
  const [errors, setErrors] = useState({ name: '', phone: '', pattern: '', budget: '' });
  const [sent, setSent] = useState(false);

  const validate = () => {
    let tempErrors = { name: '', phone: '', pattern: '', budget: '' };
    let isValid = true;

    if (!request.name.trim() || request.name.trim().length < 2) {
      tempErrors.name = "Name must be at least 2 characters.";
      isValid = false;
    }

    const phoneDigits = request.phone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
      tempErrors.phone = "Enter a valid 10-digit mobile number.";
      isValid = false;
    }

    if (!request.pattern.trim()) {
      tempErrors.pattern = "Pattern description is required.";
      isValid = false;
    }

    const budgetClean = request.budget.replace(/[^0-9]/g, '');
    if (!budgetClean || isNaN(Number(budgetClean)) || Number(budgetClean) <= 0) {
      tempErrors.budget = "Enter a valid budget amount.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first to submit a number request.");
      onLoginClick();
      return;
    }
    if (validate()) {
      onSubmit(request);
      setSent(true);
      setRequest({ name: '', phone: '', pattern: '', budget: '' });
      setErrors({ name: '', phone: '', pattern: '', budget: '' });
    }
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
          <div className="input-field-group">
            <input 
              type="text" placeholder="Full Name" required 
              value={request.name}
              onChange={(e) => {
                setRequest({...request, name: e.target.value});
                if (errors.name) setErrors({...errors, name: ''});
              }}
              className={errors.name ? 'error-border' : ''}
            />
            {errors.name && <span className="field-error-text">{errors.name}</span>}
          </div>
          <div className="input-field-group">
            <input 
              type="tel" placeholder="Mobile Number" required 
              value={request.phone}
              onChange={(e) => {
                setRequest({...request, phone: e.target.value});
                if (errors.phone) setErrors({...errors, phone: ''});
              }}
              className={errors.phone ? 'error-border' : ''}
            />
            {errors.phone && <span className="field-error-text">{errors.phone}</span>}
          </div>
          <div className="input-field-group">
            <input 
              type="text" placeholder="Desired Pattern (e.g. 00007, 786...)" required 
              value={request.pattern}
              onChange={(e) => {
                setRequest({...request, pattern: e.target.value});
                if (errors.pattern) setErrors({...errors, pattern: ''});
              }}
              className={errors.pattern ? 'error-border' : ''}
            />
            {errors.pattern && <span className="field-error-text">{errors.pattern}</span>}
          </div>
          <div className="input-field-group">
            <input 
              type="text" placeholder="Your Budget (₹)" required 
              value={request.budget}
              onChange={(e) => {
                setRequest({...request, budget: e.target.value});
                if (errors.budget) setErrors({...errors, budget: ''});
              }}
              className={errors.budget ? 'error-border' : ''}
            />
            {errors.budget && <span className="field-error-text">{errors.budget}</span>}
          </div>
        </div>
        <button type="submit" className="request-submit-btn">
          {user ? "Send My Request" : "Login to Send Request"}
        </button>
      </form>
    </div>
  );
};

export default RequestForm;
