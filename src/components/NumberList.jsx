import React from 'react';
import NumberCard from './NumberCard';
import './NumberList.css';

const NumberList = ({ numbers, onAddToCart, onBuyNow, cartItems, onCompareToggle, compareItems }) => {
  if (numbers.length === 0) {
    return (
      <div className="no-results-container">
        <div className="no-results">No VIP numbers found matching your search.</div>
      </div>
    );
  }

  return (
    <div className="number-list">
      {numbers.map((item, index) => (
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
  );
};

export default NumberList;
