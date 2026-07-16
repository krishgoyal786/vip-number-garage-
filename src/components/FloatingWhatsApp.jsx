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
        <svg viewBox="0 0 24 24" className="whatsapp-svg" fill="currentColor">
          <path d="M12.01 0C5.38 0 0 5.38 0 12.01c0 2.12.55 4.18 1.61 6.01L0 24l6.16-1.61c1.78 1.03 3.82 1.57 5.85 1.57 6.63 0 12.01-5.38 12.01-12.01C24.02 5.38 18.64 0 12.01 0zm0 21.99c-1.8 0-3.56-.48-5.11-1.39l-.37-.22-3.8 1 1.02-3.7-.24-.38c-.99-1.58-1.52-3.41-1.52-5.29C2.99 7.04 7.04 2.99 12.01 2.99s9.02 4.05 9.02 9.02-4.05 9.02-9.02 9.02zm4.98-6.81c-.27-.14-1.61-.79-1.86-.88-.25-.09-.43-.14-.61.14-.18.27-.69.88-.85 1.06-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.19-1.35-.81-.72-1.35-1.61-1.51-1.88-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.02-.22-.53-.45-.46-.61-.47h-.53c-.18 0-.48.07-.73.34-.25.27-.97.95-.97 2.32s1 2.68 1.14 2.87c.14.18 1.96 2.99 4.75 4.19.66.28 1.18.46 1.58.59.66.21 1.27.18 1.75.11.53-.08 1.61-.66 1.84-1.29.23-.63.23-1.18.16-1.29-.07-.12-.25-.18-.53-.32z" />
        </svg>
      </div>
      <span className="whatsapp-text">Chat with Us</span>
    </a>
  );
};

export default FloatingWhatsApp;
