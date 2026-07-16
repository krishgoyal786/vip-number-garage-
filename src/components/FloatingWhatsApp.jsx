import React from 'react';
import './FloatingWhatsApp.css';

const FloatingWhatsApp = () => {
  const phoneNumber = "919855598544"; // Your real business number
  const message = encodeURIComponent("Hello VipNumberGarage! I have a query regarding a VIP mobile number.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a 
      href={whatsappUrl} 
      className="whatsapp-float" 
      target="_blank" 
      rel="noopener noreferrer"
      title="Chat with us on WhatsApp"
    >
      <div className="whatsapp-icon">
        <svg viewBox="0 0 32 32" className="whatsapp-svg">
          <path d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 2.293 5.491 2.293 5.491l-2.293 8.509 8.509-2.293s2.666 2.293 5.491 2.293c8.837 0 16-7.163 16-16s-7.163-16-16-16z" fill="#25d366" />
          <path d="M21.9 19.3c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.2-.2.3-.8 1.1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.5-1-1-1.6-1.9-1.8-2.3-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4-.1-.5s-.7-1.8-1-2.4c-.3-.7-.6-.7-.9-.7h-.7c-.3 0-.7.1-.9.4-.3.3-1.1 1.1-1.1 2.7s.8 3.1.9 3.3c.1.2 1.6 2.5 3.9 3.5.5.2 1 .4 1.4.5.6.2 1.1.2 1.6.1.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3z" fill="#fff" />
        </svg>
      </div>
      <span className="whatsapp-text">Chat with Us</span>
    </a>
  );
};

export default FloatingWhatsApp;
