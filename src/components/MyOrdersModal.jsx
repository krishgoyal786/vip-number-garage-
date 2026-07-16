import React from 'react';
import './MyOrdersModal.css';

const MyOrdersModal = ({ isOpen, onClose, orders = [] }) => {
  if (!isOpen) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  return (
    <div className="orders-modal-overlay">
      <div className="orders-modal-container">
        <div className="orders-modal-header">
          <h2>🛍️ My Purchases & Porting Codes</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="orders-modal-content">
          {orders.length === 0 ? (
            <div className="no-orders-box">
              <p>You have not placed any orders yet.</p>
              <small>If you just placed an order, please ensure you are logged in using the same phone number or email.</small>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-item-card">
                  <div className="order-item-header">
                    <div>
                      <span className="order-id">Order ID: <small className="gold-text">{order._id}</small></span>
                      <span className="order-date">{order.date}</span>
                    </div>
                    <span className={`status-badge-cust ${order.status?.toLowerCase() || 'pending'}`}>
                      {order.status || 'Pending'}
                    </span>
                  </div>

                  <div className="order-item-body">
                    <h4>Purchased VIP Numbers:</h4>
                    <div className="numbers-grid">
                      {(order.items || []).map((item, idx) => (
                        <div key={idx} className="purchased-number-row">
                          <span className="vip-num-display">{item.number}</span>
                          <span className="vip-num-price">₹{(item.price || 0).toLocaleString()}</span>
                          
                          <div className="upc-delivery-section">
                            {order.status === 'Delivered' ? (
                              item.upcCode ? (
                                <div className="upc-box-active">
                                  <span>UPC Code: <strong>{item.upcCode}</strong></span>
                                  <button className="copy-code-btn" onClick={() => handleCopy(item.upcCode)}>
                                    📋 Copy Code
                                  </button>
                                </div>
                              ) : (
                                <span className="upc-pending-note">UPC generation in progress...</span>
                              )
                            ) : (
                              <span className="upc-pending-note">Pending Payment/Verification</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="order-summary-row">
                      <span>Total Amount Paid:</span>
                      <strong className="gold-text">₹{(order.total || 0).toLocaleString()}</strong>
                    </div>

                    {order.status === 'Delivered' && (
                      <div className="porting-instructions">
                        <h5>How to claim and port your VIP number(s):</h5>
                        <ol>
                          <li>Send an SMS from your current mobile phone: <strong>PORT &lt;Your Purchased VIP Number&gt;</strong> to <strong>1900</strong>.</li>
                          <li>You will receive a Unique Porting Code (UPC) message from your carrier. If we have provided a UPC above, you can use that directly for ownership transfer.</li>
                          <li>Go to any mobile shop or operator gallery (Airtel, Jio, VI) near you with the UPC code and your Aadhar Card/ID.</li>
                          <li>Tell them you want to port this number. The transfer process usually takes 3 to 5 working days.</li>
                        </ol>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersModal;
