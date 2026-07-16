import React from 'react';
import './VideoSection.css';

const VideoSection = () => {
  return (
    <section className="video-section">
      <div className="section-title">
        <h2>Experience the Luxury</h2>
        <div className="title-underline"></div>
      </div>
      
      <div className="video-container">
        {/* Placeholder for the real video. You can replace the src later */}
        <div className="video-wrapper">
          <iframe 
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0" 
            title="VipNumberGarage Showcase"
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
        <div className="video-overlay-text">
          <h3>Your Identity, Our Mission</h3>
          <p>Watch how we deliver exclusive mobile numbers across India with 100% genuine trust.</p>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
