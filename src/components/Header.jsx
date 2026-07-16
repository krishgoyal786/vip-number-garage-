import { useState, useEffect, useRef } from 'react';
import './Header.css';

const Header = ({ onLoginClick, onCartClick, cartCount, user, onLogout, onNavigate, isAdmin, onDashboardClick, onMyOrdersClick }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user dropdown when clicking outside or scrolling
  useEffect(() => {
    const handleCloseMenu = (event) => {
      if (event.type === 'scroll') {
        setShowUserMenu(false);
        return;
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleCloseMenu);
    document.addEventListener('touchstart', handleCloseMenu);
    window.addEventListener('scroll', handleCloseMenu, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleCloseMenu);
      document.removeEventListener('touchstart', handleCloseMenu);
      window.removeEventListener('scroll', handleCloseMenu);
    };
  }, []);

  // Trigger pop-up animation when cartCount changes
  useEffect(() => {
    if (cartCount > 0) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 300); // Duration of animation
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  // Handle closing of mobile menu when clicking navigations
  const handleNavClick = (sectionId) => {
    onNavigate(sectionId);
    setIsMobileMenuOpen(false);
  };

  const displayCount = cartCount > 9 ? '9+' : cartCount;

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo-container" onClick={() => handleNavClick('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/logo.jpg" 
            alt="VNG Logo" 
            className="header-logo-img" 
            style={{ 
              width: '50px', 
              height: '50px', 
              borderRadius: '50%', 
              objectFit: 'cover', 
              border: '2px solid var(--primary-gold)',
              boxShadow: '0 0 12px rgba(212, 175, 55, 0.35)',
              transition: 'transform 0.3s ease'
            }} 
          />
          <div className="logo" style={{ margin: 0, lineHeight: '1.2' }}>
            VipNumber<span className="gold-text">Garage</span>
          </div>
        </div>
        
        <div className="header-right-side">
          {/* Overlay to close menu when clicking outside */}
          {isMobileMenuOpen && (
            <div className="menu-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
          )}

          {/* Navigation Links */}
          <nav className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>


            <ul>
              <li onClick={() => handleNavClick('home')}>Home</li>
              <li onClick={() => handleNavClick('our-products')}>Find Your Number</li>
              <li onClick={() => handleNavClick('numerology-consultation')}>Numerology</li>
              <li onClick={() => handleNavClick('sell-number')}>Sell Number</li>
              <li className="dropdown-li">
                About Us
                <div className="sub-menu">
                  <div onClick={() => handleNavClick('about-us')}>Our Story</div>
                  <div onClick={() => handleNavClick('about-why-us')}>Why Choose Us</div>
                  <div onClick={() => handleNavClick('faq-section')}>FAQs</div>
                  <div onClick={() => handleNavClick('partner-program')}>Partner Program</div>
                  <div onClick={() => handleNavClick('privacy-policy')}>Privacy Policy</div>
                  <div onClick={() => handleNavClick('terms-conditions')}>Terms & Conditions</div>
                </div>
              </li>
              <li onClick={() => handleNavClick('contact-us')}>Contact Us</li>
            </ul>
          </nav>

          {/* Action buttons */}
          <div className="header-actions">
            {isAdmin && (
              <button 
                className="dashboard-btn desktop-only" 
                onClick={() => {
                  onDashboardClick();
                  setIsMobileMenuOpen(false);
                }}
              >
                📊 Dashboard
              </button>
            )}
            <button className={`cart-icon-btn ${animateCart ? 'pop-anim' : ''}`} onClick={onCartClick}>
              🛒 <span className="cart-badge">{displayCount}</span>
            </button>
            
            {user ? (
              <div 
                className="user-menu-container"
                ref={userMenuRef}
                onMouseEnter={() => {
                  if (window.innerWidth > 1150) setShowUserMenu(true);
                }}
                onMouseLeave={() => {
                  if (window.innerWidth > 1150) setShowUserMenu(false);
                }}
              >
                <div className="user-profile" onClick={() => setShowUserMenu(!showUserMenu)}>
                  👤 {user.name.split(' ')[0]}
                </div>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="dropdown-item name"><strong>Name:</strong> {user.name}</div>
                    <div className="dropdown-item phone"><strong>Mobile:</strong> +91 {user.phone}</div>
                    <hr />
                    {!isAdmin && (
                      <>
                        <div 
                          className="dropdown-item orders-link" 
                          onClick={() => { onMyOrdersClick(); setShowUserMenu(false); }}
                          style={{ cursor: 'pointer', padding: '10px 15px', color: 'var(--primary-gold)', transition: 'background 0.2s', fontWeight: 'bold' }}
                        >
                          🛍️ My Orders & UPCs
                        </div>
                        <hr />
                      </>
                    )}
                    <button 
                      className="logout-btn" 
                      onClick={() => {
                        onLogout();
                        setShowUserMenu(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="login-btn" onClick={onLoginClick}>Login</button>
            )}

            {/* Hamburger Toggle */}
            <button 
              className={`menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
