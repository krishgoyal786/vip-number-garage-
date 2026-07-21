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

    // Helper algorithm to dynamically identify the length of a trailing VIP pattern (from longest to shortest)
    const getVipHighlightLength = () => {
      for (let L = 7; L >= 3; L--) {
        if (L > len) continue;
        const segment = cleanNum.substring(len - L);
        
        // A. Check for 786 ending
        if (L === 3 && segment === '786') return 3;

        // B. Check if it's a repeating digit (e.g. 555, 7777, 88888)
        const isRepeat = segment.split('').every(char => char === segment[0]);
        if (isRepeat && L >= 3) return L;

        // C. Check for zero-centric patterns (like 0001, 10001, 00500, 000012)
        // Must contain at least L-2 zeros, and L >= 4
        const zeroCount = (segment.match(/0/g) || []).length;
        if (L >= 4 && zeroCount >= L - 2 && zeroCount >= 3) {
          // If the segment starts with a non-zero digit, make sure all non-zero digits are the same.
          // Otherwise, it's likely a random leading digit (e.g. 6 in 6000900) instead of a cohesive pattern.
          if (segment[0] !== '0') {
            const nonZeros = segment.split('').filter(char => char !== '0');
            const allSameNonZero = nonZeros.every(char => char === nonZeros[0]);
            if (!allSameNonZero) continue;
          }
          return L;
        }

        // D. Check for step sequences (e.g., 1234, 56789, 9876)
        if (L >= 4) {
          let isUpStep = true;
          let isDownStep = true;
          for (let i = 1; i < L; i++) {
            const prev = parseInt(segment[i - 1]);
            const curr = parseInt(segment[i]);
            if (curr !== prev + 1) isUpStep = false;
            if (curr !== prev - 1) isDownStep = false;
          }
          if (isUpStep || isDownStep) return L;
        }

        // E. Check for repeating pairs / alternating (e.g., 1212, 123123)
        if (L >= 4 && L % 2 === 0) {
          const half = L / 2;
          const firstHalf = segment.substring(0, half);
          const secondHalf = segment.substring(half);
          if (firstHalf === secondHalf) return L;
        }

        // F. Check for double/triple pairs (e.g. 1122, 111222)
        if (L === 4 && segment[0] === segment[1] && segment[2] === segment[3]) return 4;
        if (L === 6 && segment[0] === segment[1] && segment[1] === segment[2] && segment[3] === segment[4] && segment[4] === segment[5]) return 6;

        // G. Check for palindromes / mirror sequences (e.g. 12321, 50905)
        if (L >= 5) {
          const reversed = segment.split('').reverse().join('');
          if (segment === reversed) return L;
        }
      }
      return 3; // Default fallback to highlight last 3 digits
    };

    const highlightCount = getVipHighlightLength();
    
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
