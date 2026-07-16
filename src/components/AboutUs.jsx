import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-hero">
        <h1>About VipNumberGarage</h1>
        <p>Premium Numbers, Genuine Trust, Best Price Guaranteed.</p>
      </div>
      
      <div className="about-content">
        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            Established in 2025, <strong>VipNumberGarage</strong> was born out of a simple vision: 
            to make exclusive mobile identity accessible to everyone with transparency and 
            unmatched trust. Starting our journey in <strong>Bathinda</strong>, we recognized that 
            a VIP number is more than just digits—it's a statement of identity and a valuable asset 
            for both individuals and businesses.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Philosophy</h2>
          <p>
            We don't promise the "fastest" transfer in the world, but we do promise the 
            <strong> most genuine</strong> one. Our business is built on the foundation of 
            authenticity. When you deal with us, you are dealing with a professional team that 
            values your investment. We offer a <strong>Best Price Guarantee</strong>, ensuring 
            that you get the most premium patterns at the most competitive rates in the market.
          </p>
        </section>

        <section className="about-section">
          <h2>Why Choose VipNumberGarage?</h2>
          <ul>
            <li><strong>Physical Presence:</strong> Unlike many online-only sellers, we have a physical office in Bathinda where you can connect with us.</li>
            <li><strong>Expert Team:</strong> A dedicated team of professionals manages our systems to ensure your data and transactions are handled with care.</li>
            <li><strong>Dedicated Support:</strong> Our customer support is always ready to guide you through the KYC and porting process step-by-step.</li>
            <li><strong>Genuine Transfers:</strong> We follow every legal protocol to ensure the number is transferred to your name safely and permanently.</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Visit Us</h2>
          <p>
            Feel free to visit our office in <strong>Bathinda</strong> to discuss your requirements 
            in person. We are committed to building long-term relationships with our clients 
            through honesty and superior service.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
