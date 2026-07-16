import React, { useState } from 'react';
import './FAQ.css';

const FAQ = ({ onSubmitQuery, user, onLoginClick }) => {
  const [feedback, setFeedback] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  
  const faqs = [
    { q: "How do I receive my VIP number?", a: "Once payment and KYC are verified, we provide you with a UPC code which you can use to port the number to any network provider of your choice." },
    { q: "Is the transfer process legal?", a: "Yes, 100%. We follow all TRAI guidelines and ensure the number is legally transferred to your name and ID." },
    { q: "Can I visit your office before buying?", a: "Absolutely! We encourage customers to visit our Bathinda office for peace of mind and personalized service." }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first to submit a query.");
      onLoginClick();
      return;
    }
    onSubmitQuery(feedback);
    setSubmitted(true);
    setFeedback({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="faq-section">
      <div className="section-title">
        <h2>FAQs & Feedback</h2>
        <div className="title-underline"></div>
      </div>

      <div className="faq-grid">
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <h4>Q: {faq.q}</h4>
              <p>A: {faq.a}</p>
            </div>
          ))}
        </div>

        <div className="feedback-form-container">
          <h3>Submit a Query / Feedback</h3>
          {submitted ? (
            <div className="success-msg">
              <h4 style={{ color: 'var(--primary-gold)' }}>Thank you!</h4>
              <p style={{ color: 'var(--text-gray)' }}>Your query has been submitted. Our team will contact you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="feedback-form">
              <input 
                type="text" 
                placeholder="Your Name" 
                value={feedback.name}
                onChange={(e) => setFeedback({...feedback, name: e.target.value})}
                required 
              />
              <input 
                type="email" 
                placeholder="Your Email" 
                value={feedback.email}
                onChange={(e) => setFeedback({...feedback, email: e.target.value})}
                required 
              />
              <textarea 
                placeholder="Your Query or Feedback" 
                rows="5"
                value={feedback.message}
                onChange={(e) => setFeedback({...feedback, message: e.target.value})}
                required
              ></textarea>
              <button type="submit" className="submit-btn">
                {user ? "Send Message" : "Login to Send Message"}
              </button>
            </form>
          )}
          <p className="backend-note">* Your data will be stored securely for our team to review.</p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
