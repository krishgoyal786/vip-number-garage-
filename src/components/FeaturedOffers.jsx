import React from 'react';
import NumberCard from './NumberCard';
import './FeaturedOffers.css';

const FeaturedOffers = ({ inventory, onAddToCart, onBuyNow, cartItems, onCompareToggle, compareItems }) => {
  const offerNumbers = inventory.filter(item => item.offerPrice > 0 && !item.isSold).slice(0, 15);

  if (offerNumbers.length === 0) return null;

  return (
    <div className="featured-offers-section">
      <div className="offer-header">
        <span className="fire-icon">🔥</span>
        <h2>Hot Deals of the Day</h2>
        <span className="offer-tag">Limited Time Only</span>
      </div>
      <div className="offers-grid">
        {offerNumbers.map((item, index) => (
          <NumberCard 
            key={item._id} 
            item={item} 
            onAddToCart={onAddToCart}
            onBuyNow={onBuyNow}
            isInCart={cartItems.some(cartItem => cartItem._id === item._id)}
            index={index}
            onCompareToggle={onCompareToggle}
            isCompared={compareItems ? compareItems.some(compareItem => compareItem._id === item._id) : false}
          />
        ))}
      </div>
      <div className="offer-divider"></div>
    </div>
  );
};

export default FeaturedOffers;
