import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  const points = [
    {
      title: "Physical Office in Bathinda",
      desc: "Unlike many online-only sellers, we have a physical office in Bathinda where you can connect with us, verify our authenticity, and discuss your needs in person."
    },
    {
      title: "Best Price Guarantee",
      desc: "We offer a Best Price Guarantee, ensuring you get the most premium mobile patterns at the most competitive and genuine rates in the market."
    },
    {
      title: "Genuine Transfers",
      desc: "With a start in 2025, our philosophy centers on genuine transactions. We follow every legal protocol to ensure the number is transferred to your name safely."
    },
    {
      title: "Expert Dedicated Team",
      desc: "A professional team manages our systems and is always ready to guide you through the KYC and porting process step-by-step."
    }
  ];

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
              <strong> most genuine</strong> one. Our business is built on the foundation of 
              authenticity. When you deal with us, you are dealing with a professional team that 
              values your investment. We prioritize legal guidelines, secure data handling, and direct user support.
            </p>
          </div>
        </div>

        <div className="about-why-us" id="about-why-us">
          <h3>Why Choose Us?</h3>
          <div className="why-us-grid">
            {points.map((p, i) => (
              <div key={i} className="why-us-card">
                <div className="why-icon">✦</div>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="about-visit">
          <h3>Visit Our Office</h3>
          <p>
            Feel free to visit our office in <strong>Bathinda</strong> to discuss your requirements in person. 
            We are committed to building long-term relationships with our clients through honesty, transparency, and superior service.
          </p>
          <address className="office-address">
            <strong>VIP NUMBER GARAGE</strong><br />
            Hathi Mandir Street, Near Fire Brigade Station,<br />
            Bathinda, Punjab - 151001, India
          </address>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
