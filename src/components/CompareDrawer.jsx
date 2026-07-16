import React, { useState } from 'react';
import './CompareDrawer.css';

const CompareDrawer = ({ compareItems, onRemoveFromCompare, onClearCompare, onAddToCart, onBuyNow, cartItems }) => {
  const [isOpen, setIsOpen] = useState(false); // Modal state for detailed comparison

  if (compareItems.length === 0) return null;

  const handleCompareClick = () => {
    setIsOpen(true);
  };

  const getSingleDigitSum = (numberStr) => {
    const raw = numberStr.replace(/\D/g, '');
    if (!raw) return 0;
    const sum = raw.split('').reduce((acc, d) => acc + parseInt(d), 0);
    return sum === 0 ? 0 : (sum - 1) % 9 + 1;
  };

  const getDigitSumTotal = (numberStr) => {
    const raw = numberStr.replace(/\D/g, '');
    return raw.split('').reduce((sum, d) => sum + parseInt(d), 0);
  };

  return (
    <>
      {/* Floating Bottom Drawer */}
      <div className="compare-drawer">
        <div className="compare-drawer-content">
          <div className="compare-drawer-header">
            <h4>Compare VIP Numbers ({compareItems.length}/3)</h4>
            <button className="clear-all-compare-btn" onClick={onClearCompare}>Clear All</button>
          </div>
          <div className="compare-items-row">
            {compareItems.map(item => (
              <div key={item._id} className="compare-mini-card">
                <span className="mini-card-number">{item.number}</span>
                <span className="mini-card-price">₹{(item.offerPrice || item.price).toLocaleString()}</span>
                <button className="remove-mini-card-btn" onClick={() => onRemoveFromCompare(item._id)} title="Remove">✕</button>
              </div>
            ))}
            {compareItems.length < 3 && Array(3 - compareItems.length).fill(null).map((_, idx) => (
              <div key={idx} className="compare-mini-card empty-slot">
                <span>Select number...</span>
              </div>
            ))}
          </div>
          <div className="compare-actions">
            <button 
              className="compare-now-btn" 
              onClick={handleCompareClick}
              disabled={compareItems.length < 2}
            >
              Compare {compareItems.length >= 2 ? 'Now' : '(Select at least 2)'}
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {isOpen && (
        <div className="compare-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="compare-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-compare-modal" onClick={() => setIsOpen(false)}>✕</button>
            <h2 className="compare-modal-title">VIP Number Comparison</h2>
            <div className="compare-table-wrapper">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>Specification</th>
                    {compareItems.map(item => (
                      <th key={item._id}>
                        <div className="compare-col-header">
                          <span className="compare-header-category">{item.category}</span>
                          <span className="compare-header-number">{item.number}</span>
                          <span className="compare-header-price">₹{(item.offerPrice || item.price).toLocaleString()}</span>
                          {item.offerPrice && <span className="compare-header-original-price">₹{item.price.toLocaleString()}</span>}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="row-title">Price</td>
                    {compareItems.map(item => (
                      <td key={item._id} className="price-val">
                        ₹{(item.offerPrice || item.price).toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-title">Carrier Operator</td>
                    {compareItems.map(item => (
                      <td key={item._id}>
                        <span className={`compare-carrier-badge ${(item.operator || 'Airtel').toLowerCase()}`}>
                          {item.operator || 'Airtel'}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-title">Total Sum (Numerology)</td>
                    {compareItems.map(item => (
                      <td key={item._id}>
                        <strong>{getDigitSumTotal(item.number)}</strong>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-title">Lucky Single Digit</td>
                    {compareItems.map(item => (
                      <td key={item._id}>
                        <span className="lucky-digit-circle">
                          {getSingleDigitSum(item.number)}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-title">Category / Pattern</td>
                    {compareItems.map(item => (
                      <td key={item._id}>
                        <span className="compare-cat-badge">{item.category}</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-title">Description</td>
                    {compareItems.map(item => (
                      <td key={item._id} className="desc-val">
                        {item.description || 'Premium VIP Number'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-title">Action</td>
                    {compareItems.map(item => {
                      const isInCart = cartItems.some(cartItem => cartItem._id === item._id);
                      return (
                        <td key={item._id}>
                          <div className="compare-row-actions">
                            <button 
                              className={`compare-cart-btn ${isInCart ? 'in-cart' : ''}`}
                              onClick={() => onAddToCart(item)}
                              disabled={isInCart}
                            >
                              {isInCart ? 'In Cart' : 'Add to Cart'}
                            </button>
                            <button className="compare-buy-btn" onClick={() => {
                              onBuyNow(item);
                              setIsOpen(false);
                            }}>
                              Buy Now
                            </button>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompareDrawer;
