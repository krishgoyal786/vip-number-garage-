import React, { useState, useEffect } from 'react';
import './Hero.css';

const slides = [
  {
    image: '/banner-exclusive.jpg',
    title: "INDIA'S #1 VIP NUMBER STORE",
    subtitle: 'Over 19 Years of Trust & 2 Lakhs+ Happy Customers. Search premium patterns, double-triplets, & royalty sequences instantly.',
    buttonText: 'Search VIP Numbers',
    targetId: 'our-products'
  },
  {
    image: '/banner-numerology.jpg',
    title: 'LUCKY ASTRO-NUMEROLOGY',
    subtitle: 'Find numbers harmonized with your birth date. Calculate your single-digit destiny sum and invite wealth & prosperity.',
    buttonText: 'Check Destiny Sum',
    targetId: 'numerology-consultation'
  },
  {
    image: '/banner-security.jpg',
    title: 'COMPATIBLE WITH ALL OPERATORS',
    subtitle: 'Get instant Unique Porting Codes (UPC) for Jio, Airtel, Vi, or BSNL with 100% secure escrow and money-back assurance.',
    buttonText: 'Request Custom Number',
    targetId: 'request-number'
  }
];

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const handleDotClick = (index) => {
    if (isAnimating || index === activeIndex) return;
    setIsAnimating(true);
    setActiveIndex(index);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80; // Offset for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="hero-slider-container">
      <div className="hero-slides-wrapper">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={index}
              className={`hero-slide ${isActive ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Dark overlay for rich styling and text legibility */}
              <div className="hero-slide-overlay"></div>
              
              <div className="hero-slide-content">
                <h1 className="hero-slide-title">{slide.title}</h1>
                <p className="hero-slide-subtitle">{slide.subtitle}</p>
                <button
                  className="hero-slide-cta"
                  onClick={() => scrollToSection(slide.targetId)}
                >
                  {slide.buttonText}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button 
        className="slider-arrow arrow-left" 
        onClick={handlePrev} 
        aria-label="Previous Slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <button 
        className="slider-arrow arrow-right" 
        onClick={handleNext} 
        aria-label="Next Slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="slider-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`slider-dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>

      {/* Bottom Trust/Stats bar, integrated elegantly */}
      <div className="hero-floating-stats">
        <div className="stat-item">
          <span className="stat-icon">👑</span>
          <span className="stat-text">Premium Patterns</span>
        </div>
        <div className="stat-divider">|</div>
        <div className="stat-item">
          <span className="stat-icon">🔒</span>
          <span className="stat-text">Secure Escrow Transfer</span>
        </div>
        <div className="stat-divider">|</div>
        <div className="stat-item">
          <span className="stat-icon">⚡</span>
          <span className="stat-text">Instant Activation</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
