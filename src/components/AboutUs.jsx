import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <section className="about-us-section">
      <div className="about-us-box">
        <h2 className="section-title">About VIP Number Garage</h2>
        <div className="title-underline"></div>
        <p className="about-intro-text">
          Premium Numbers, Genuine Trust, Best Price Guaranteed.
        </p>

        <div className="about-story-row">
          <div className="story-col">
            <h3>Our Story</h3>
            <p>
              Established in 2025, <strong>VipNumberGarage</strong> was born out of a simple vision: 
              to make exclusive mobile identity accessible to everyone with transparency and 
              unmatched trust. Starting our journey in <strong>Bathinda, Punjab</strong>, we recognized that 
              a VIP number is more than just digits—it's a statement of identity and a valuable asset 
              for both personal branding and business growth.
            </p>
          </div>
          <div className="story-col">
            <h3>Our Philosophy</h3>
            <p>
              We don't promise the "fastest" transfer in the world, but we do promise the 
              <strong> most genuine</strong> one. Our philosophy is built on the foundation of 
              authenticity. When you deal with us, you are dealing with a professional team that 
              values your investment. We prioritize legal guidelines, secure data handling, and direct user support.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
