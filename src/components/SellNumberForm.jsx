import React, { useState, useEffect } from 'react';
import './SellNumberForm.css';

const SellNumberForm = ({ onSubmit, user, onLoginClick }) => {
  const [sellRequest, setSellRequest] = useState({ name: '', phone: '', numberToSell: '', price: '' });
  const [errors, setErrors] = useState({ name: '', phone: '', numberToSell: '', price: '' });
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

  const validate = () => {
    let tempErrors = { name: '', phone: '', numberToSell: '', price: '' };
    let isValid = true;

    if (!sellRequest.name.trim() || sellRequest.name.trim().length < 2) {
      tempErrors.name = "Name must be at least 2 characters.";
      isValid = false;
    }

    const phoneDigits = sellRequest.phone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
      tempErrors.phone = "Enter a valid 10-digit contact number.";
      isValid = false;
    }

    const numberToSellClean = sellRequest.numberToSell.replace(/\D/g, '');
    if (numberToSellClean.length < 10) {
      tempErrors.numberToSell = "Enter a valid 10-digit VIP number.";
      isValid = false;
    }

    if (!sellRequest.price || isNaN(Number(sellRequest.price)) || Number(sellRequest.price) <= 0) {
      tempErrors.price = "Enter a valid positive price.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first to submit your VIP number for sale.");
      onLoginClick();
      return;
    }
    if (validate()) {
      onSubmit(sellRequest);
      setSent(true);
      setSellRequest({ name: user.name || '', phone: user.phone || '', numberToSell: '', price: '' });
      setErrors({ name: '', phone: '', numberToSell: '', price: '' });
    }
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
              onChange={(e) => {
                setSellRequest({...sellRequest, name: e.target.value});
                if (errors.name) setErrors({...errors, name: ''});
              }}
              className={errors.name ? 'error-border' : ''}
            />
            {errors.name && <span className="field-error-text">{errors.name}</span>}
          </div>
          <div className="input-group">
            <label>Contact Number</label>
            <input 
              type="tel" placeholder="Mobile Number" required 
              value={sellRequest.phone}
              onChange={(e) => {
                setSellRequest({...sellRequest, phone: e.target.value});
                if (errors.phone) setErrors({...errors, phone: ''});
              }}
              className={errors.phone ? 'error-border' : ''}
            />
            {errors.phone && <span className="field-error-text">{errors.phone}</span>}
          </div>
          <div className="input-group">
            <label>VIP Number to Sell</label>
            <input 
              type="text" placeholder="e.g. 99999-XXXXX" required 
              value={sellRequest.numberToSell}
              onChange={(e) => {
                setSellRequest({...sellRequest, numberToSell: e.target.value});
                if (errors.numberToSell) setErrors({...errors, numberToSell: ''});
              }}
              className={errors.numberToSell ? 'error-border' : ''}
            />
            {errors.numberToSell && <span className="field-error-text">{errors.numberToSell}</span>}
          </div>
          <div className="input-group">
            <label>Expected Price (₹)</label>
            <input 
              type="number" placeholder="Expected Price" required 
              value={sellRequest.price}
              onChange={(e) => {
                setSellRequest({...sellRequest, price: e.target.value});
                if (errors.price) setErrors({...errors, price: ''});
              }}
              className={errors.price ? 'error-border' : ''}
            />
            {errors.price && <span className="field-error-text">{errors.price}</span>}
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
