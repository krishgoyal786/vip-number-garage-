import React from 'react';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  const points = [
    {
      title: "Physical Office in Bathinda",
      desc: "We aren't just a website. You can visit our physical office in Bathinda to verify our authenticity and discuss your needs in person."
    },
    {
      title: "Best Price Guarantee",
      desc: "We promise the most competitive rates for premium VIP numbers. If you find a better price for the same pattern, we'll match it."
    },
    {
      title: "Genuine Trust",
      desc: "With a start in 2025, our core value has always been transparency. We handle the entire legal transfer process for you."
    },
    {
      title: "Expert Dedicated Team",
      desc: "A professional team works behind our systems to ensure that your transactions and data are handled with the highest care."
    }
  ];

  return (
    <section className="why-choose-us-container">
      <div className="why-us-box">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="title-underline"></div>
        
        <div className="why-us-grid">
          {points.map((p, i) => (
            <div key={i} className="why-us-card">
              <div className="gold-bullet">★</div>
              <div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
