import React, { useState } from 'react';
import './CheckoutForm.css';

const CheckoutForm = ({ user, totalAmount, onSubmit, onCancel, onPrivacyClick, onTermsClick }) => {
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const [details, setDetails] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const handlePincodeChange = async (e) => {
    const pin = e.target.value.replace(/\D/g, '').substring(0, 6);
    setDetails(prev => ({ ...prev, pincode: pin }));

    if (pin.length === 6) {
      setIsFetchingPincode(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
          const postOffice = data[0].PostOffice[0];
          setDetails(prev => ({
            ...prev,
            city: postOffice.District || prev.city,
            state: postOffice.State || prev.state
          }));
        }
      } catch (err) {
        console.error('Failed to auto-fetch city and state from pincode:', err);
      } finally {
        setIsFetchingPincode(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      alert("Please accept the Privacy Policy and Terms & Conditions to complete your purchase.");
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit(details);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-overlay">
      <div className="checkout-modal">
        <div className="checkout-header">
          <h2>Delivery & Billing Details</h2>
          <button className="close-btn" onClick={onCancel}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-grid">
              <input 
                type="text" placeholder="Full Name" 
                value={details.name} onChange={(e) => setDetails({...details, name: e.target.value})} 
                required 
              />
              <input 
                type="email" placeholder="Email Address" 
                value={details.email} onChange={(e) => setDetails({...details, email: e.target.value})} 
                required 
              />
              <input 
                type="tel" placeholder="Mobile Number" 
                value={details.phone} onChange={(e) => setDetails({...details, phone: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Shipping Address</h3>
            <textarea 
              placeholder="Full Address (House No, Street, Area)" 
              value={details.address} onChange={(e) => setDetails({...details, address: e.target.value})} 
              required
            ></textarea>
            <div className="form-grid">
              <input 
                type="text" placeholder="Pincode" 
                value={details.pincode} onChange={handlePincodeChange} 
                maxLength={6}
                required 
              />
              <input 
                type="text" placeholder={isFetchingPincode ? "Fetching City..." : "City"} 
                value={details.city} onChange={(e) => setDetails({...details, city: e.target.value})} 
                required 
              />
              <input 
                type="text" placeholder={isFetchingPincode ? "Fetching State..." : "State"} 
                value={details.state} onChange={(e) => setDetails({...details, state: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div className="security-disclaimer-box" style={{ 
            backgroundColor: 'rgba(234, 45, 45, 0.08)', 
            border: '1px solid rgba(234, 45, 45, 0.3)', 
            padding: '14px 18px', 
            borderRadius: '8px', 
            marginTop: '15px', 
            marginBottom: '15px', 
            fontSize: '0.82rem', 
            lineHeight: '1.5',
            color: '#ffcdd2'
          }}>
            <strong style={{ color: '#ff5252', display: 'block', marginBottom: '4px', fontSize: '0.9rem' }}>
              ⚠️ IMPORTANT SECURITY WARNING:
            </strong>
            We only deal from our two official numbers: <strong style={{ color: 'white' }}>+91 98555-98544</strong> and <strong style={{ color: 'white' }}>+91 76900-00070</strong>. 
            Do not transfer any payments to anyone without getting direct verification and confirmation from these two official numbers.
          </div>

          <div className="checkout-agreement-container">
            <input 
              type="checkbox" 
              id="checkout-terms-checkbox" 
              checked={agreed} 
              onChange={(e) => setAgreed(e.target.checked)} 
              className="checkout-checkbox-input"
              required 
            />
            <label htmlFor="checkout-terms-checkbox" className="checkout-checkbox-label">
              I agree to the{" "}
              <span className="gold-text-link" onClick={onPrivacyClick}>
                Privacy Policy
              </span>{" "}
              and{" "}
              <span className="gold-text-link" onClick={onTermsClick}>
                Terms & Conditions
              </span>
              .
            </label>
          </div>

          <div className="checkout-footer">
            <div className="total-box">
              <span>Total Price:</span>
              <strong>₹{totalAmount.toLocaleString()}</strong>
            </div>
            <button type="submit" className="pay-now-btn" disabled={isSubmitting}>
              {isSubmitting ? "Submitting Request..." : `Confirm Booking & Request Callback`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
