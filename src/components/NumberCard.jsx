import React from 'react';
import './NumberCard.css';

const NumberCard = ({ item, onAddToCart, onBuyNow, isInCart, index, onCompareToggle, isCompared }) => {
  // Calculate Numerology Scores
  const rawDigits = (item.number || '').replace(/\D/g, '');
  const totalScore = rawDigits.split('').reduce((sum, d) => sum + parseInt(d), 0);
  
  // Single Digit Reduction (Digital Root)
  const singleDigitSum = totalScore === 0 ? 0 : (totalScore - 1) % 9 + 1;

  const operator = item.operator || 'Airtel';

  // Parsing trailing fancy digits for gold highlight and dimming rest of the digits
  const formatNumberWithHighlight = (numString) => {
    if (!numString) return '';
    const cleanNum = numString.replace(/[-\s]/g, '');
    const len = cleanNum.length;
    if (len < 5) return numString;
    
    let highlightCount = 3; // Default highlight last 3 digits
    
    // 1. Check for 00X00 pattern (like 00500)
    const doubleZeroPattern = /00\d00$/;
    if (doubleZeroPattern.test(cleanNum)) {
      highlightCount = 5;
    } else {
      // 2. Check for repeating ending digits (e.g. 777, 8888)
      let repeatCount = 1;
      const lastChar = cleanNum[len - 1];
      for (let i = len - 2; i >= 0; i--) {
        if (cleanNum[i] === lastChar) {
          repeatCount++;
        } else {
          break;
        }
      }
      if (repeatCount >= 3) {
        highlightCount = repeatCount;
      } else if (cleanNum.endsWith('786')) {
        // 3. Check for 786 ending
        highlightCount = 3;
      }
    }
    
    // Split based on highlightCount from back
    let digitCount = 0;
    let splitIndex = numString.length;
    for (let i = numString.length - 1; i >= 0; i--) {
      if (/\d/.test(numString[i])) {
        digitCount++;
        if (digitCount === highlightCount) {
          splitIndex = i;
          break;
        }
      }
    }
    
    const normalPart = numString.substring(0, splitIndex);
    const highlightPart = numString.substring(splitIndex);
    
    return (
      <>
        <span className="dim-digits">{normalPart}</span>
        <span className="fancy-highlight">{highlightPart}</span>
      </>
    );
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const shareMessage = encodeURIComponent(`Check out this VIP Number: ${item.number} \nPrice: ₹${(item.offerPrice || item.price).toLocaleString()} \nView more at: ${window.location.origin}`);
    window.open(`https://wa.me/?text=${shareMessage}`, '_blank');
  };

  const handleWhatsAppInquiry = (e) => {
    e.stopPropagation();
    const phoneNumber = "919855598544";
    const text = encodeURIComponent(`Hi VipNumberGarage! I am interested in purchasing this VIP number: ${item.number} (listed for ₹${(item.offerPrice || item.price).toLocaleString()}). Let me know the porting process.`);
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  };

  return (
    <div 
      className="number-card" 
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="card-top-bar">
        <label className={`compare-checkbox-label ${isCompared ? 'checked' : ''}`} onClick={(e) => e.stopPropagation()}>
          <input 
            type="checkbox" 
            checked={isCompared} 
            onChange={(e) => onCompareToggle(item, e.target.checked)} 
          />
          <span className="compare-checkbox-custom"></span>
          <span className="compare-text">{isCompared ? 'Added to Compare' : 'Compare'}</span>
        </label>
      </div>
      <div className="card-header">
        <div className="badge-container">
          <span className="category-badge">{item.category}</span>
          <span className={`carrier-badge ${operator.toLowerCase()}`}>{operator}</span>
          {item.isSold && <span className="category-badge" style={{ backgroundColor: '#ff3b3b', color: 'white', fontWeight: 'bold' }}>SOLD</span>}
        </div>
        <div className="card-header-right">
          <button className="share-btn" onClick={handleShare} title="Share on WhatsApp" disabled={item.isSold}>
            <svg viewBox="0 0 24 24" className="share-icon-svg">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z" fill="currentColor"/>
            </svg>
          </button>
          <div className="numerology-container">
            <div className="numerology-badge" title="Sum of all digits">
              Total=<strong>{totalScore}</strong>
            </div>
            <div className="numerology-badge single" title="Single digit reduction">
              Sum=<strong>{singleDigitSum}</strong>
            </div>
          </div>
        </div>
      </div>
      <h2 className="display-number" style={{ opacity: item.isSold ? 0.5 : 1 }}>{formatNumberWithHighlight(item.number)}</h2>
      <p className="description" style={{ opacity: item.isSold ? 0.6 : 1 }}>{item.description}</p>
      <div className="card-footer">
        <div className="price-container" style={{ opacity: item.isSold ? 0.5 : 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {item.offerPrice && <span className="original-price">₹{item.price.toLocaleString()}</span>}
            <span className="price">₹{(item.offerPrice || item.price).toLocaleString()}</span>
          </div>
        </div>
        <div className="card-actions">
          {item.isSold ? (
            <button className="buy-btn" disabled style={{ backgroundColor: '#333', color: '#777', cursor: 'not-allowed', width: '100%', border: '1px solid #444' }}>
              SOLD OUT
            </button>
          ) : (
            <>
              <button 
                className={`cart-btn ${isInCart ? 'in-cart' : ''}`} 
                onClick={() => onAddToCart(item)}
                disabled={isInCart}
              >
                {isInCart ? 'In Cart' : 'Cart'}
              </button>
              <button className="buy-btn" onClick={() => onBuyNow(item)}>
                Buy
              </button>
              <button className="whatsapp-btn" onClick={handleWhatsAppInquiry} title="Inquire on WhatsApp">
                💬 Chat
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NumberCard;
