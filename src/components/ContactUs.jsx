import React from 'react';
import './ContactUs.css';

const ContactUs = () => {
  return (
    <section className="contact-us-section">
      <div className="section-title">
        <h2>Contact & Visit Us</h2>
        <div className="title-underline"></div>
      </div>

      <div className="contact-grid">
        <div className="contact-info-card">
          <h3>Our Head Office</h3>
          <p className="address">
            <strong>VIP NUMBER GARAGE</strong><br />
            Hathi Mandir Street,<br />
            Near Fire Brigade Station,<br />
            Bathinda, Punjab - 151001<br />
            India
          </p>
          <div className="contact-details">
            <div className="detail-item" style={{ alignItems: 'flex-start' }}>
              <span className="icon" style={{ marginTop: '2px' }}>📞</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <a href="tel:+919855598544" className="contact-number-link">+91 98555-98544</a>
                <a href="tel:+917690000070" className="contact-number-link">+91 76900-00070</a>
              </div>
            </div>
            <div className="detail-item">
              <span className="icon">✉️</span>
              <span>support@vipnumbergarage.com</span>
            </div>
            <div className="detail-item">
              <span className="icon">⏰</span>
              <span>Mon - Sat: 10:00 AM - 7:00 PM</span>
            </div>
          </div>
        </div>

        <div className="map-card-wrapper">
          <iframe 
            src="https://maps.google.com/maps?q=Fire%20Brigade%20Station%20Mall%20Road%20Bathinda%20Punjab%20151001&t=&z=16&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            className="map-iframe-element" 
            allowFullScreen="" 
            loading="lazy"
            title="Bathinda Fire Station Map Location"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
