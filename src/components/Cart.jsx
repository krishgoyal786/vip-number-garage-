import React, { useState } from 'react';
import './Cart.css';

const Cart = ({ isOpen, onClose, cartItems, onRemove, onCheckout, appliedCoupon, onApplyCoupon, onRemoveCoupon }) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.offerPrice || item.price), 0);
  const discountPercentage = appliedCoupon ? appliedCoupon.discountPercentage : 0;
  const discountAmount = Math.round((subtotal * discountPercentage) / 100);
  const finalTotal = subtotal - discountAmount;

  const handleApply = async () => {
    setCouponError('');
    if (!couponInput.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }
    const success = await onApplyCoupon(couponInput.trim());
    if (success) {
      setCouponInput('');
    } else {
      setCouponError('Invalid or expired coupon code.');
    }
  };

  const handleRemove = () => {
    onRemoveCoupon();
    setCouponError('');
  };

  return (
    <div className="cart-overlay">
      <div className="cart-drawer">
        <div className="cart-header">
          <h2>Your Cart ({cartItems.length})</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="empty-msg">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <div>
                  <h3 className="cart-item-num">{item.number}</h3>
                  <p className="cart-item-price">₹{(item.offerPrice || item.price).toLocaleString()}</p>
                </div>
                <button className="remove-btn" onClick={() => onRemove(item._id)}>Remove</button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            {/* Coupon Code Section */}
            <div className="coupon-section">
              {appliedCoupon ? (
                <div className="applied-coupon-box">
                  <span className="coupon-code">🎁 {appliedCoupon.code} ({appliedCoupon.discountPercentage}% OFF)</span>
                  <button className="remove-coupon-btn" onClick={handleRemove}>Remove</button>
                </div>
              ) : (
                <div className="coupon-input-box">
                  <input 
                    type="text" 
                    placeholder="Enter Coupon Code" 
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                  />
                  <button className="apply-coupon-btn" onClick={handleApply}>Apply</button>
                </div>
              )}
              {couponError && <p className="coupon-error-msg">{couponError}</p>}
            </div>

            <div className="cart-totals-summary">
              <div className="cart-total subtotal">
                <span>Subtotal:</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              {appliedCoupon && (
                <div className="cart-total discount">
                  <span>Discount ({appliedCoupon.discountPercentage}%):</span>
                  <span className="discount-amount">- ₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="cart-total final">
                <span>Total Amount:</span>
                <span className="total-price">₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <button className="checkout-btn" onClick={onCheckout}>
              Proceed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
