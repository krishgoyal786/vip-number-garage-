import React from 'react';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
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
    <section className="why-choose-us-section">
      <div className="why-choose-us-box">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="title-underline"></div>
        <p className="why-choose-us-intro">
          We pride ourselves on offering the highest quality service, transparency, and absolute safety for your transactions.
        </p>

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
    </section>
  );
};

export default WhyChooseUs;
