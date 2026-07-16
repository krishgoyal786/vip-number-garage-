import React, { useState } from 'react';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose, onLogin, onSendOtp }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Info, 2: OTP
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  React.useEffect(() => {
    let timer;
    if (resendCooldown > 0 && isOpen) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown, isOpen]);

  if (!isOpen) return null;

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (name.trim().length === 0) {
      alert("Please enter your full name.");
      return;
    }
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (phone.length !== 10) {
      alert("Please enter a 10-digit mobile number.");
      return;
    }

    setIsLoading(true);
    // Call backend OTP send
    const success = await onSendOtp(email);
    setIsLoading(false);
    
    if (success) {
      setStep(2);
      setResendCooldown(30);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setIsLoading(true);
    const success = await onSendOtp(email);
    setIsLoading(false);
    if (success) {
      setResendCooldown(30);
      alert("A new OTP has been sent to your email.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 4) {
      alert("Please enter the 4-digit OTP.");
      return;
    }

    setIsLoading(true);
    // Pass to App.jsx to verify with backend
    const success = await onLogin({ name, email, phone, otp });
    setIsLoading(false);
    
    if (success) {
      onClose();
      resetState();
    }
  };

  const resetState = () => {
    setStep(1);
    setName('');
    setEmail('');
    setPhone('');
    setOtp('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>{step === 1 ? 'Login / Sign Up' : 'Verify OTP'}</h2>
        <p>
          {step === 1 
            ? 'Enter your details to receive an email OTP' 
            : `Enter the 4-digit code sent to ${email}`
          }
        </p>

        {step === 2 && (
          <div className="spam-note" style={{ 
            backgroundColor: 'rgba(212, 175, 55, 0.08)', 
            border: '1px solid rgba(212, 175, 55, 0.2)',
            padding: '10px 14px', 
            borderRadius: '6px', 
            fontSize: '0.8rem', 
            color: '#ccc',
            lineHeight: '1.4',
            marginBottom: '15px',
            textAlign: 'left'
          }}>
            📧 <strong>Tip:</strong> If you don't receive the email in your main inbox within a few seconds, please check your <strong>Spam</strong>, <strong>Junk</strong>, or <strong>Promotions</strong> folders.
          </div>
        )}
        
        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <input 
              type="text" 
              placeholder="Your Full Name" 
              className="name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
            <input 
              type="email" 
              placeholder="Your Email Address" 
              className="name-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <div className="input-group">
              <span className="prefix">+91</span>
              <input 
                type="tel" 
                placeholder="Mobile Number (10 digits)" 
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                required 
              />
            </div>
            <button type="submit" className="action-btn" disabled={isLoading}>
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <input 
              type="text" 
              placeholder="Enter 4-digit OTP" 
              className="otp-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
              required 
            />
            <button type="submit" className="action-btn" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify & Login"}
            </button>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
              <button type="button" className="text-btn" onClick={() => setStep(1)} style={{ margin: 0 }}>Go Back</button>
              <button 
                type="button" 
                className="text-btn" 
                disabled={resendCooldown > 0 || isLoading}
                onClick={handleResendOtp}
                style={{ 
                  margin: 0, 
                  color: resendCooldown > 0 ? '#666' : '#d4af37', 
                  cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer' 
                }}
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
