import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    { step: "01", title: "Select Your Number", desc: "Browse our premium inventory and pick the number that fits your style." },
    { step: "02", title: "Contact on WhatsApp", desc: "Click the buy button to discuss pricing and availability with our team." },
    { step: "03", title: "Payment & KYC", desc: "Complete the secure payment and provide necessary ID documents." },
    { step: "04", title: "Transfer & Delivery", desc: "We provide the UPC/NOC for porting or deliver the SIM to your doorstep." }
  ];

  return (
    <section className="how-it-works">
      <div className="section-title">
        <h2>How It Works</h2>
        <div className="title-underline"></div>
      </div>
      <div className="steps-container">
        {steps.map((s, i) => (
          <div key={i} className="step-card">
            <div className="step-number">{s.step}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
