import React, { useState, useEffect } from 'react';
import './SellNumberForm.css';

const SellNumberForm = ({ onSubmit, user, onLoginClick }) => {
  const [sellRequest, setSellRequest] = useState({ name: '', phone: '', numberToSell: '', price: '' });
  const [sent, setSent] = useState(false);

  // Auto-fill user details if logged in
  useEffect(() => {
    if (user) {
      setSellRequest(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first to submit your VIP number for sale.");
      onLoginClick();
      return;
    }
    onSubmit(sellRequest);
    setSent(true);
    setSellRequest({ name: user.name || '', phone: user.phone || '', numberToSell: '', price: '' });
  };

  if (sent) {
    return (
      <div className="sell-success">
        <span className="success-icon">💰</span>
        <h3>Listing Submitted!</h3>
        <p>Your VIP number has been submitted successfully. Our team will review your number and expected price, and contact you to list it on our garage.</p>
        <button onClick={() => setSent(false)} className="sell-again-btn">List Another Number</button>
      </div>
    );
  }

  return (
    <div className="sell-form-box">
      <div className="sell-header">
        <h3>Want to Sell Your VIP Number?</h3>
        <p>Earn premium value for your unique digits. Submit your details below, and we will list it for you!</p>
      </div>
      <form onSubmit={handleSubmit} className="sell-form">
        <div className="sell-grid">
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" placeholder="Full Name" required 
              value={sellRequest.name}
              onChange={(e) => setSellRequest({...sellRequest, name: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label>Contact Number</label>
            <input 
              type="tel" placeholder="Mobile Number" required 
              value={sellRequest.phone}
              onChange={(e) => setSellRequest({...sellRequest, phone: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label>VIP Number to Sell</label>
            <input 
              type="text" placeholder="e.g. 99999-XXXXX" required 
              value={sellRequest.numberToSell}
              onChange={(e) => setSellRequest({...sellRequest, numberToSell: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label>Expected Price (₹)</label>
            <input 
              type="number" placeholder="Expected Price" required 
              value={sellRequest.price}
              onChange={(e) => setSellRequest({...sellRequest, price: e.target.value})}
            />
          </div>
        </div>
        <button type="submit" className="sell-submit-btn">
          {user ? "List My VIP Number" : "Login to Submit Listing"}
        </button>
      </form>
    </div>
  );
};

export default SellNumberForm;
