import React from 'react';
import './Features.css';

const Features = () => {
  const features = [
    { title: "Safe & Secure", description: "100% secure number transfer process with full legal documentation." },
    { title: "Instant Activation", description: "Quick activation within 24-48 hours of purchase." },
    { title: "Lifetime Support", description: "Dedicated support for all your number-related queries." },
    { title: "Pan India Delivery", description: "We deliver SIM cards and NOCs across all Indian states." }
  ];

  return (
    <section className="features-section">
      <div className="section-title">
        <h2>Why Choose Us</h2>
        <div className="title-underline"></div>
      </div>
      <div className="features-grid">
        {features.map((f, i) => (
          <div key={i} className="feature-item">
            <div className="feature-icon">★</div>
            <h3>{f.title}</h3>
            <p>{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
