import React, { useState, useEffect } from 'react';
import './PartnerProgram.css';

const PartnerProgram = ({ onSubmitQuery, user, showFormOnly = false, initialProgramType = 'influencer', onApplyClick, onBackClick }) => {
  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    email: '',
    phone: user ? user.phone : '',
    programType: initialProgramType, // 'influencer' or 'business'
    businessName: '',
    platformLink: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync pre-selected program type when changed in parent
  useEffect(() => {
    setFormData((prev) => ({ ...prev, programType: initialProgramType }));
  }, [initialProgramType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submissionData = {
      name: formData.name,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '')}@vipnumbergarage.partner`,
      phone: formData.phone,
      subject: `Partner Program Application (${formData.programType === 'influencer' ? 'Influencer' : 'Business Partner'})`,
      message: `
        Program Type: ${formData.programType.toUpperCase()}
        Phone: ${formData.phone}
        Business/Channel Name: ${formData.businessName || 'N/A'}
        Platform/Website Link: ${formData.platformLink || 'N/A'}
        Message: ${formData.message}
      `
    };

    try {
      await onSubmitQuery(submissionData);
      setIsSubmitted(true);
      setFormData({
        name: user ? user.name : '',
        email: '',
        phone: user ? user.phone : '',
        programType: 'influencer',
        businessName: '',
        platformLink: '',
        message: ''
      });
    } catch (err) {
      alert("Error submitting application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // If showFormOnly is true, render ONLY the form page view
  if (showFormOnly) {
    return (
      <section className="partner-container" style={{ minHeight: '80vh', padding: '40px 20px' }}>
        <button className="floating-back-btn" onClick={onBackClick}>← Back to Partners</button>
        <div className="application-form-container" style={{ marginTop: '40px' }}>
          <h3>Apply for Partner Program</h3>
          <p className="form-subtitle">Let us know which program suits you, and our team will get in touch within 24 hours.</p>
          
          {isSubmitted ? (
            <div className="success-msg animate-fade-in">
              <span className="success-icon">✓</span>
              <h4>Thank you for your interest!</h4>
              <p>Your partner application has been submitted successfully. Our partnership coordinator will contact you shortly.</p>
              <button onClick={() => { setIsSubmitted(false); onBackClick(); }} className="reset-btn">Return to Home</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="partner-form">
              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="programType">Choose Program *</label>
                  <select
                    id="programType"
                    name="programType"
                    value={formData.programType}
                    onChange={handleChange}
                    required
                  >
                    <option value="influencer">Influencer Program (Individuals/Content Creators)</option>
                    <option value="business">Business with Us (Affiliates/Corporate/Dealers)</option>
                  </select>
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="partner-name">Full Name *</label>
                  <input
                    type="text"
                    id="partner-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="partner-phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="partner-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="partner-email">Email Address *</label>
                  <input
                    type="email"
                    id="partner-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="businessName">
                    {formData.programType === 'influencer' ? 'Social Channel Name *' : 'Company / Business Name *'}
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder={formData.programType === 'influencer' ? 'e.g. Instagram Handle' : 'e.g. VIP Mobile Shop LLC'}
                    required
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="platformLink">
                    {formData.programType === 'influencer' ? 'Channel Link / Profile URL *' : 'Website / Storefront Link'}
                  </label>
                  <input
                    type="url"
                    id="platformLink"
                    name="platformLink"
                    value={formData.platformLink}
                    onChange={handleChange}
                    placeholder="https://..."
                    required={formData.programType === 'influencer'}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="partner-message">Why do you want to partner with us? (Optional)</label>
                <textarea
                  id="partner-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell us about your audience or business model..."
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-partner-btn" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    );
  }

  // Home Page View (without embedded form, but with action buttons)
  return (
    <section className="partner-container">
      <div className="partner-box">
        <h2 className="section-title">Partner Programs</h2>
        <div className="title-underline"></div>
        <p className="partner-intro">
          Grow with us! Join the <strong>VipNumberGarage Partner Network</strong>. Whether you are an influencer with a loyal audience or a business seeking mutually beneficial alliances, we have customized programs to reward your influence and integration.
        </p>

        <div className="programs-grid">
          {/* Influencer Program Card */}
          <div className="program-card influencer-card">
            <div className="card-badge">INFLUENCER</div>
            <h3>Influencer Program</h3>
            <p className="card-tagline">Monetize your reach by sharing premium numbers.</p>
            <ul className="benefits-list">
              <li>
                <span className="bullet">✦</span> 
                <strong>Custom Coupon Code</strong>: Get a unique coupon code (e.g., <code>VIPINFLUENCER10</code>) to share with your audience.
              </li>
              <li>
                <span className="bullet">✦</span> 
                <strong>Audience Discount</strong>: Your followers receive an instant discount on any VIP number they purchase.
              </li>
              <li>
                <span className="bullet">✦</span> 
                <strong>Influencer Rewards</strong>: Earn attractive cash payouts or platform credits for every transaction made with your code.
              </li>
              <li>
                <span className="bullet">✦</span> 
                <strong>Dashboard Tracking</strong>: Real-time insights into your coupon usage and earnings.
              </li>
            </ul>
            <button className="apply-card-btn gold-apply-btn" onClick={() => onApplyClick('influencer')}>Apply Now →</button>
          </div>

          {/* Business Program Card */}
          <div className="program-card business-card">
            <div className="card-badge gold-badge">BUSINESS PARTNER</div>
            <h3>Business with Us</h3>
            <p className="card-tagline">Incorporate premium mobile numbers into your service portfolio.</p>
            <ul className="benefits-list">
              <li>
                <span className="bullet">✦</span> 
                <strong>Affiliate API & Tools</strong>: Offer VIP numbers to your existing client base under your own brand or as an affiliate.
              </li>
              <li>
                <span className="bullet">✦</span> 
                <strong>Shared Coupon Incentives</strong>: Provide exclusive discounts to your corporate clients or network.
              </li>
              <li>
                <span className="bullet">✦</span> 
                <strong>High Margin Returns</strong>: Secure special dealer pricing and high-percentage referral commissions.
              </li>
              <li>
                <span className="bullet">✦</span> 
                <strong>Legal & Transfer Support</strong>: We handle all registration and transfer logistics, while you focus on sales.
              </li>
            </ul>
            <button className="apply-card-btn gold-apply-btn" onClick={() => onApplyClick('business')}>Apply Now →</button>
          </div>
        </div>

        {/* How It Works Visual Flow */}
        <div className="flow-section">
          <h3>How It Works</h3>
          <div className="flow-steps">
            <div className="step">
              <div className="step-num">1</div>
              <h4>Join the Network</h4>
              <p>Apply online. We will review your profile/business and issue a customized coupon code.</p>
            </div>
            <div className="step-arrow">➔</div>
            <div className="step">
              <div className="step-num">2</div>
              <h4>Promote & Share</h4>
              <p>Share your coupon code on social media, websites, or directly with your clients.</p>
            </div>
            <div className="step-arrow">➔</div>
            <div className="step">
              <div className="step-num">3</div>
              <h4>Earn Benefits</h4>
              <p>Your users get discounts instantly, and you receive automated payouts or credits per purchase.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerProgram;
