import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import PositionalSearch from './components/PositionalSearch';
import CategoryTabs from './components/CategoryTabs';
import NumberList from './components/NumberList';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import PartnerProgram from './components/PartnerProgram';
import FAQ from './components/FAQ';
import LoginModal from './components/LoginModal';
import Cart from './components/Cart';
import Dashboard from './components/Dashboard';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import RequestForm from './components/RequestForm';
import SellNumberForm from './components/SellNumberForm';
import FeaturedOffers from './components/FeaturedOffers';
import CheckoutForm from './components/CheckoutForm';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsConditions from './components/TermsConditions';
import AstroNumerologySection from './components/AstroNumerologySection';
import BookingModal from './components/BookingModal';
import CompareDrawer from './components/CompareDrawer';
import MyOrdersModal from './components/MyOrdersModal';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(18);
  const [categories, setCategories] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({ 
    digits: Array(10).fill(''), 
    budget: { min: '', max: '' },
    sort: 'none',
    carrier: 'all',
    numerologySum: '',
    excludeDigits: ''
  });
  const [view, setView] = useState('home'); 
  const [partnerProgramType, setPartnerProgramType] = useState('influencer');
  const [compareItems, setCompareItems] = useState([]); 
  
  // Data States
  const [inventory, setInventory] = useState([]);
  const [catalogNumbers, setCatalogNumbers] = useState([]);
  const [totalNumbers, setTotalNumbers] = useState(0);
  const [catalogPage, setCatalogPage] = useState(1);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [featuredNumbers, setFeaturedNumbers] = useState([]);
  const [queries, setQueries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [sellRequests, setSellRequests] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [activities, setActivities] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('vip_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('vip_cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Auth State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vip_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('vip_token'));

  const fetchCatalog = async (pageNumber = 1, append = false) => {
    setCatalogLoading(true);
    try {
      const { digits, budget, carrier, numerologySum, excludeDigits, sort } = searchCriteria;
      
      const params = new URLSearchParams({
        page: pageNumber,
        limit: 18,
        category: activeCategory,
        carrier: carrier,
        minPrice: budget.min,
        maxPrice: budget.max,
        excludeDigits: excludeDigits,
        numerologySum: numerologySum,
        sort: sort,
        searchDigits: digits.join(',')
      });

      const res = await fetch(`${API_BASE_URL}/numbers?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTotalNumbers(data.total);
        setCatalogPage(data.page);
        if (append) {
          setCatalogNumbers(prev => [...prev, ...data.numbers]);
        } else {
          setCatalogNumbers(data.numbers);
        }
      }
    } catch (err) {
      console.error("Error fetching catalog:", err);
    } finally {
      setCatalogLoading(false);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch categories and featured numbers (Hot Deals - category Offer Zone, limit 15)
      const [catsRes, featuredRes] = await Promise.all([
        fetch(`${API_BASE_URL}/categories`),
        fetch(`${API_BASE_URL}/numbers?category=Offer Zone&limit=15`)
      ]);
      
      if (!catsRes.ok || !featuredRes.ok) throw new Error("Connection failed.");
      
      setCategories(await catsRes.json());
      const featuredData = await featuredRes.json();
      setFeaturedNumbers(featuredData.numbers || []);

      // 2. Fetch full inventory for admin dashboard if user is admin
      if (token && user?.role === 'admin') {
        const [numsRes, queriesRes, ordersRes, reqsRes, activityRes, sellReqsRes, couponsRes, consultationsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/numbers?limit=100000&adminMode=true`),
          fetch(`${API_BASE_URL}/queries`, { headers: { 'x-auth-token': token } }),
          fetch(`${API_BASE_URL}/orders`, { headers: { 'x-auth-token': token } }),
          fetch(`${API_BASE_URL}/requests`, { headers: { 'x-auth-token': token } }),
          fetch(`${API_BASE_URL}/activities`, { headers: { 'x-auth-token': token } }),
          fetch(`${API_BASE_URL}/sell-requests`, { headers: { 'x-auth-token': token } }),
          fetch(`${API_BASE_URL}/coupons`, { headers: { 'x-auth-token': token } }),
          fetch(`${API_BASE_URL}/consultations`, { headers: { 'x-auth-token': token } })
        ]);
        
        if (numsRes.ok) {
          const allNums = await numsRes.json();
          setInventory(allNums.numbers || []);
        }
        if (queriesRes.ok) setQueries(await queriesRes.json());
        if (ordersRes.ok) setOrders(await ordersRes.json());
        if (reqsRes.ok) setRequests(await reqsRes.json());
        if (activityRes.ok) setActivities(await activityRes.json());
        if (sellReqsRes.ok) setSellRequests(await sellReqsRes.json());
        if (couponsRes.ok) setCoupons(await couponsRes.json());
        if (consultationsRes.ok) setConsultations(await consultationsRes.json());
      } else {
        setInventory([]);
        if (token) {
          try {
            const userOrdersRes = await fetch(`${API_BASE_URL}/orders/my`, { headers: { 'x-auth-token': token } });
            if (userOrdersRes.ok) {
              setOrders(await userOrdersRes.json());
            } else {
              setOrders([]);
            }
          } catch (err) {
            setOrders([]);
          }
        } else {
          setOrders([]);
        }
        setQueries([]);
        setRequests([]);
        setSellRequests([]);
        setActivities([]);
        setCoupons([]);
        setConsultations([]);
      }
    } catch (err) {
      setError("The Backend Server is not running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Fetch paginated catalog whenever filter criteria changes
  useEffect(() => {
    fetchCatalog(1, false);
  }, [activeCategory, searchCriteria]);

  useEffect(() => {
    setVisibleCount(18);
  }, [activeCategory, searchCriteria]);

  useEffect(() => {
    if (!token) return;

    // Inactivity timer check (2 hours = 7200000 ms)
    const updateActivity = () => {
      localStorage.setItem('vip_last_activity', Date.now().toString());
    };

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('touchstart', updateActivity);

    // Periodically check inactivity (every 30 seconds)
    const checkInterval = setInterval(() => {
      const lastActivity = localStorage.getItem('vip_last_activity');
      if (lastActivity && Date.now() - parseInt(lastActivity) > 2 * 60 * 60 * 1000) {
        handleLogout();
        alert("You have been logged out due to 2 hours of inactivity.");
      }
    }, 30000);

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('touchstart', updateActivity);
      clearInterval(checkInterval);
    };
  }, [token]);

  const logActivity = async (action, details = '') => {
    try {
      await fetch(`${API_BASE_URL}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: user ? { name: user.name, phone: user.phone } : undefined, action, details })
      });
    } catch (err) {}
  };

  const handleSendOtp = async (email) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.simulated && data.otp) {
          alert(`[Dev Mode] OTP sent to ${email}: ${data.otp}`);
        } else {
          alert(`OTP sent successfully to ${email}`);
        }
        return true;
      } else {
        alert(data.message || "Failed to send OTP.");
        return false;
      }
    } catch (err) {
      alert("Error connecting to server to send OTP.");
      return false;
    }
  };

  const handleLogin = async (loginData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData) 
      });
      if (res.ok) {
        const data = await res.json();
        // Clear cart if switching users
        if (user && user.email !== data.user.email) {
          setCartItems([]);
        }
        setAppliedCoupon(null); // Clear coupon
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('vip_user', JSON.stringify(data.user));
        localStorage.setItem('vip_token', data.token);
        localStorage.setItem('vip_login_time', Date.now().toString());
        localStorage.setItem('vip_last_activity', Date.now().toString());
        logActivity("Login Success", `User: ${data.user.name}`);
        return true;
      } else {
        const data = await res.json();
        alert(data.message || "Invalid OTP or login failed.");
        return false;
      }
    } catch (err) { 
      alert("Error connecting to server."); 
      return false;
    }
  };

  const handleLogout = () => {
    logActivity("Logout", `User: ${user?.name}`);
    setUser(null);
    setToken(null);
    setCartItems([]); // Clear the cart
    setAppliedCoupon(null); // Clear coupon
    setQueries([]);
    setOrders([]);
    setRequests([]);
    setSellRequests([]);
    setActivities([]);
    localStorage.removeItem('vip_user');
    localStorage.removeItem('vip_token');
    localStorage.removeItem('vip_login_time');
    localStorage.removeItem('vip_last_activity');
    setView('home');
  };

  const resetAllFilters = () => {
    setActiveCategory('All');
    setVisibleCount(20);
    setSearchCriteria({ 
      digits: Array(10).fill(''), 
      budget: { min: '', max: '' }, 
      sort: 'none',
      carrier: 'all',
      numerologySum: '',
      excludeDigits: ''
    });
  };

  const handleCompareToggle = (item, isChecked) => {
    if (isChecked) {
      if (compareItems.length >= 3) {
        alert("You can compare up to 3 VIP numbers at a time.");
        return;
      }
      setCompareItems(prev => [...prev, item]);
    } else {
      setCompareItems(prev => prev.filter(i => i._id !== item._id));
    }
  };

  const handleRemoveFromCompare = (id) => {
    setCompareItems(prev => prev.filter(i => i._id !== id));
  };

  const handleClearCompare = () => {
    setCompareItems([]);
  };

  const scrollToSection = (sectionId) => {
    if (sectionId === 'privacy-policy') {
      setView('privacy');
      window.scrollTo(0, 0);
      return;
    }
    if (sectionId === 'terms-conditions') {
      setView('terms');
      window.scrollTo(0, 0);
      return;
    }

    let targetId = sectionId;
    if (targetId === 'our-products') {
      targetId = 'positional-search-section';
    }

    if (view !== 'home') { 
      setView('home'); 
      setTimeout(() => executeScroll(targetId), 100); 
    } else { 
      executeScroll(targetId); 
    }
  };

  const executeScroll = (targetId, retries = 3) => {
    const element = document.getElementById(targetId);
    if (!element) {
      if (retries > 0) {
        setTimeout(() => executeScroll(targetId, retries - 1), 50);
      }
      return;
    }
    const headerOffset = 100; // Account for the height of the fixed header
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000; 
    let start = null;
    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        // Animation finished: focus on the first digit search input
        if (targetId === 'positional-search-section') {
          const firstInput = document.getElementById('digit-0');
          if (firstInput) {
            firstInput.focus();
          }
        }
      }
    };
    const ease = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };
    requestAnimationFrame(animation);
  };



  const addToCart = (item) => {
    if (item.isSold) {
      alert("This number has already been sold.");
      return;
    }
    if (!cartItems.find(i => i._id === item._id)) {
      setCartItems([...cartItems, item]);
      logActivity("Added to Cart", `Number: ${item.number}`);
    }
  };

  const handleBuyNow = (item) => { addToCart(item); if (!item.isSold) setIsCartOpen(true); logActivity("Clicked Buy Now", `Number: ${item.number}`); };
  const removeFromCart = (id) => { setCartItems(cartItems.filter(item => item._id !== id)); };

  const startCheckout = () => {
    if (!user || !token) {
      setIsCartOpen(false);
      setIsLoginOpen(true);
      alert("Please login first.");
      return;
    }

    const hasUnavailableItem = cartItems.some(item => {
      const dbItem = inventory.find(i => i._id === item._id);
      return !dbItem || dbItem.isSold;
    });

    if (hasUnavailableItem) {
      alert("One or more numbers in your cart are no longer available or have been sold. Please remove them from your cart to check out.");
      return;
    }

    // Security warning popup about official contact numbers
    alert("⚠️ IMPORTANT SECURITY WARNING:\n\nWe only deal from our two official numbers:\n📞 +91 98555-98544\n📞 +91 76900-00070\n\nPlease do not transfer any payments to anyone without getting direct verification and confirmation from these two official numbers!");

    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleFinalPayment = async (checkoutDetails) => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.offerPrice || item.price), 0);
    const discountPercentage = appliedCoupon ? appliedCoupon.discountPercentage : 0;
    const discountAmount = Math.round((subtotal * discountPercentage) / 100);
    const totalAmount = subtotal - discountAmount;

    const newOrder = {
      customer: { 
        name: checkoutDetails.name, 
        phone: checkoutDetails.phone,
        email: checkoutDetails.email,
        address: `${checkoutDetails.address}, ${checkoutDetails.city}, ${checkoutDetails.state} - ${checkoutDetails.pincode}`
      },
      items: cartItems.map(i => ({ number: i.number, price: i.offerPrice || i.price, category: i.category })),
      total: totalAmount
    };

    try {
      const saveRes = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(newOrder)
      });

      if (saveRes.ok) {
        const savedOrder = await saveRes.json();
        setOrders([savedOrder, ...orders]);
        setCartItems([]);
        setAppliedCoupon(null);
        setIsCheckoutOpen(false);
        // Refresh inventory to reflect sold numbers immediately
        const numsRes = await fetch(`${API_BASE_URL}/numbers`);
        if (numsRes.ok) setInventory(await numsRes.json());
        logActivity("Order Placed (Offline Booking)", `By: ${checkoutDetails.name}`);
        alert("Booking Placed Successfully! Our team will contact you in 24-48 hours.\n\n⚠️ IMPORTANT: We only deal from our two official numbers: +91 98555-98544 and +91 76900-00070. Do not transfer payment to anyone without getting confirmation from these numbers!");
      } else {
        const errData = await saveRes.json();
        alert(`Failed to place booking: ${errData.message || 'Check your submission details'}`);
      }
    } catch (err) {
      alert("Error connecting to server. Please try again.");
    }
  };

  const handleAddQuery = async (query) => {
    try {
      const res = await fetch(`${API_BASE_URL}/queries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query)
      });
      if (res.ok) {
        const savedQuery = await res.json();
        setQueries([savedQuery, ...queries]);
        logActivity("New Query Sent", `From: ${query.email}`);
      }
    } catch (err) {}
  };

  const handleRequestSubmit = async (request) => {
    try {
      const res = await fetch(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      if (res.ok) {
        const savedReq = await res.json();
        setRequests([savedReq, ...requests]);
        logActivity("Special Number Requested", `Pattern: ${request.pattern}`);
      }
    } catch (err) {}
  };

  const handleSellRequestSubmit = async (sellRequest) => {
    try {
      const res = await fetch(`${API_BASE_URL}/sell-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sellRequest)
      });
      if (res.ok) {
        const savedSellReq = await res.json();
        setSellRequests([savedSellReq, ...sellRequests]);
        logActivity("VIP Number Listed for Sale", `Number: ${sellRequest.numberToSell} for ₹${sellRequest.price}`);
      }
    } catch (err) {}
  };

  const handleDeleteSellRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sell request?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/sell-requests/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        setSellRequests(sellRequests.filter(sr => sr._id !== id));
        return true;
      }
    } catch (err) {}
    return false;
  };

  const handleApplyCoupon = async (code) => {
    try {
      const res = await fetch(`${API_BASE_URL}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      if (res.ok) {
        const data = await res.json();
        setAppliedCoupon(data);
        logActivity("Coupon Applied", `Code: ${code} (${data.discountPercentage}% discount)`);
        return true;
      }
    } catch (err) {}
    return false;
  };

  const handleRemoveCoupon = () => {
    if (appliedCoupon) {
      logActivity("Coupon Removed", `Code: ${appliedCoupon.code}`);
      setAppliedCoupon(null);
    }
  };

  const handleAddCoupon = async (newCoupon) => {
    try {
      const res = await fetch(`${API_BASE_URL}/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(newCoupon)
      });
      if (res.ok) {
        const savedCoupon = await res.json();
        setCoupons([savedCoupon, ...coupons]);
        return true;
      } else {
        const errorData = await res.json();
        alert(`Failed to add coupon: ${errorData.message || 'Check your data'}`);
      }
    } catch (err) { alert("Error connecting to server."); }
    return false;
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/coupons/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        setCoupons(coupons.filter(c => c._id !== id));
        return true;
      }
    } catch (err) {}
    return false;
  };

  const handleAddNumber = async (newNum) => {
    try {
      const res = await fetch(`${API_BASE_URL}/numbers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(newNum)
      });
      if (res.ok) {
        const savedNum = await res.json();
        setInventory([savedNum, ...inventory]);
        return true;
      } else {
        const errorData = await res.json();
        alert(`Failed to add number: ${errorData.message || 'Check your data'}`);
      }
    } catch (err) { alert("Error connecting to server."); }
    return false;
  };

  const handleBulkUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_BASE_URL}/numbers/bulk`, {
        method: 'POST',
        headers: { 'x-auth-token': token },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        let msg = `Bulk Upload Results:\n- Successfully Inserted: ${data.inserted} numbers\n- Skipped DB Duplicates: ${data.skippedDuplicates} numbers`;
        if (data.validationErrors && data.validationErrors.length > 0) {
          msg += `\n\nSkipped due to validation errors (${data.validationErrors.length} rows):\n` + data.validationErrors.slice(0, 5).join('\n');
          if (data.validationErrors.length > 5) {
            msg += `\n...and ${data.validationErrors.length - 5} more rows.`;
          }
        }
        alert(msg);
        fetchData();
        return true;
      } else {
        alert(data.message || "Upload failed. Please check file format.");
      }
    } catch (err) { alert("Upload error connecting to server."); }
    return false;
  };

  const handleDeleteNumber = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/numbers/${id}`, { method: 'DELETE', headers: { 'x-auth-token': token } });
      if (res.ok) { setInventory(inventory.filter(item => item._id !== id)); return true; }
    } catch (err) {}
    return false;
  };

  const handleAstroBooking = async (bookingDetails) => {
    const newBooking = {
      ...bookingDetails,
      paymentStatus: 'Pending Direct Pay',
      paymentId: `direct_pay_offline_${Date.now()}`,
      status: 'Scheduled',
      pricePaid: 499
    };

    try {
      const saveRes = await fetch(`${API_BASE_URL}/consultations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(newBooking)
      });

      if (saveRes.ok) {
        const savedBooking = await saveRes.json();
        setConsultations([savedBooking, ...consultations]);
        setIsBookingOpen(false);
        logActivity("Astro Booking Placed (Offline Direct Pay)", `For: ${bookingDetails.customerName}`);
        alert(`Booking Successful! Your slot is reserved for ${bookingDetails.bookingDate} at ${bookingDetails.bookingSlot}. Please note that we do not collect payments directly on the website. You will pay the consulting fee (₹499) directly to our team.\n\n⚠️ IMPORTANT: We only deal from our two official numbers: +91 98555-98544 and +91 76900-00070. Do not transfer payment to anyone without getting confirmation from these numbers!`);
      } else {
        const errData = await saveRes.json();
        alert(`Failed to save booking: ${errData.message || 'Check your details'}`);
      }
    } catch (err) {
      alert("Error booking session: " + err.message);
    }
  };

  const handleUpdateConsultation = async (id, updateData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/consultations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(updateData)
      });
      if (res.ok) {
        const updated = await res.json();
        setConsultations(consultations.map(c => c._id === id ? updated : c));
        return true;
      }
    } catch (err) {}
    return false;
  };

  const handleDeleteConsultation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/consultations/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        setConsultations(consultations.filter(c => c._id !== id));
        return true;
      }
    } catch (err) {}
    return false;
  };

  const handleAddCategory = async (catName) => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ name: catName })
      });
      if (res.ok) { const savedCat = await res.json(); setCategories([...categories, savedCat]); return true; }
    } catch (err) {}
    return false;
  };

  const handleDeleteCategory = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories/${id}`, { method: 'DELETE', headers: { 'x-auth-token': token } });
      if (res.ok) { setCategories(categories.filter(cat => cat._id !== id)); return true; }
    } catch (err) {}
    return false;
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ status })
      });
      if (res.ok) { 
        const updatedOrder = await res.json(); 
        setOrders(orders.map(o => o._id === id ? updatedOrder : o)); 
        // Refresh local inventory so status changes show instantly
        const numsRes = await fetch(`${API_BASE_URL}/numbers?limit=100000&adminMode=true`);
        if (numsRes.ok) {
          const data = await numsRes.json();
          setInventory(data.numbers || []);
        }
        return true; 
      }
    } catch (err) {}
    return false;
  };

  const handleDeliverOrder = async (id, updatedItems) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ status: 'Delivered', items: updatedItems })
      });
      if (res.ok) { 
        const updatedOrder = await res.json(); 
        setOrders(orders.map(o => o._id === id ? updatedOrder : o)); 
        // Refresh local inventory so status changes show instantly
        const numsRes = await fetch(`${API_BASE_URL}/numbers?limit=100000&adminMode=true`);
        if (numsRes.ok) {
          const data = await numsRes.json();
          setInventory(data.numbers || []);
        }
        return true; 
      }
    } catch (err) {}
    return false;
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${id}`, { method: 'DELETE', headers: { 'x-auth-token': token } });
      if (res.ok) { setOrders(orders.filter(o => o._id !== id)); return true; }
    } catch (err) {}
    return false;
  };

  const handleUpdateRequestStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setRequests(requests.map(r => r._id === id ? updated : r));
        return true;
      }
    } catch (err) {}
    return false;
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/requests/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        setRequests(requests.filter(r => r._id !== id));
        return true;
      }
    } catch (err) {}
    return false;
  };

  const handleUpdateQueryStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/queries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setQueries(queries.map(q => q._id === id ? updated : q));
        return true;
      }
    } catch (err) {}
    return false;
  };

  const handleDeleteQuery = async (id) => {
    if (!window.confirm("Are you sure you want to delete this query?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/queries/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        setQueries(queries.filter(q => q._id !== id));
        return true;
      }
    } catch (err) {}
    return false;
  };

  const handleUpdateOfferPrice = async (id, offerPrice) => {
    try {
      const res = await fetch(`${API_BASE_URL}/numbers/${id}/offer`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ offerPrice })
      });
      if (res.ok) { const updatedNum = await res.json(); setInventory(inventory.map(n => n._id === id ? updatedNum : n)); return true; }
    } catch (err) {}
    return false;
  };

  const handleToggleSoldStatus = async (id, isSold) => {
    try {
      const res = await fetch(`${API_BASE_URL}/numbers/${id}/toggle-sold`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ isSold })
      });
      if (res.ok) {
        const updatedNum = await res.json();
        setInventory(inventory.map(n => n._id === id ? updatedNum : n));
        return true;
      }
    } catch (err) {}
    return false;
  };

  const isAdmin = user && user.role === 'admin';

  if (isLoading) return <div className="loading-screen"><div className="loader"></div><p>Loading...</p></div>;
  if (error) return <div className="loading-screen"><h2>⚠️ {error}</h2><button onClick={fetchData}>Retry</button></div>;

  return (
    <div className="app-container">
      <Header onLoginClick={() => setIsLoginOpen(true)} onCartClick={() => setIsCartOpen(true)} cartCount={cartItems.length} user={user} onLogout={handleLogout} onNavigate={scrollToSection} isAdmin={isAdmin} onDashboardClick={() => setView('dashboard')} onMyOrdersClick={() => setIsMyOrdersOpen(true)} />
      <main>
        {view === 'home' ? (
          <>
            <div id="home"><Hero /></div>
            <div id="our-products" style={{ paddingTop: '40px' }}>
              <FeaturedOffers 
                inventory={featuredNumbers} 
                onAddToCart={addToCart} 
                onBuyNow={handleBuyNow} 
                cartItems={cartItems} 
                onCompareToggle={handleCompareToggle}
                compareItems={compareItems}
              />
              <AstroNumerologySection 
                onBookClick={() => setIsBookingOpen(true)} 
                onLoginClick={() => setIsLoginOpen(true)} 
                user={user} 
                onSelectLuckyDigit={(digit) => {
                  setSearchCriteria(prev => ({
                    ...prev,
                    numerologySum: String(digit)
                  }));
                  scrollToSection('our-products');
                }}
              />
              <PositionalSearch searchCriteria={searchCriteria} onSearch={setSearchCriteria} />
              <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} categories={categories} />
              {(activeCategory !== 'All' || 
                searchCriteria.digits.some(d => d !== '') || 
                searchCriteria.budget.min !== '' || 
                searchCriteria.budget.max !== '' ||
                searchCriteria.carrier !== 'all' ||
                searchCriteria.numerologySum !== '' ||
                searchCriteria.excludeDigits !== '') && (
                <div style={{ textAlign: 'center', marginBottom: '20px' }}><button onClick={resetAllFilters} className="clear-search-btn">Reset All Filters</button></div>
              )}
              <NumberList 
                numbers={catalogNumbers} 
                onAddToCart={addToCart} 
                onBuyNow={handleBuyNow} 
                cartItems={cartItems} 
                onCompareToggle={handleCompareToggle}
                compareItems={compareItems}
              />
              {catalogNumbers.length < totalNumbers && (
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                  <button 
                    onClick={() => fetchCatalog(catalogPage + 1, true)} 
                    className="dashboard-btn"
                    disabled={catalogLoading}
                  >
                    {catalogLoading ? 'Loading...' : 'Load More Numbers'}
                  </button>
                </div>
              )}
              <div id="request-number"><RequestForm onSubmit={handleRequestSubmit} user={user} onLoginClick={() => setIsLoginOpen(true)} /></div>
              <div id="sell-number"><SellNumberForm onSubmit={handleSellRequestSubmit} user={user} onLoginClick={() => setIsLoginOpen(true)} /></div>
            </div>
            <div id="partner-program">
              <PartnerProgram 
                onSubmitQuery={handleAddQuery} 
                user={user} 
                showFormOnly={false}
                onApplyClick={(type) => {
                  setPartnerProgramType(type);
                  setView('partner-apply');
                  window.scrollTo(0, 0);
                }}
              />
            </div>
            <div id="faq-section"><FAQ onSubmitQuery={handleAddQuery} user={user} onLoginClick={() => setIsLoginOpen(true)} /></div>
            <div id="about-us"><AboutUs /></div>
            <div id="contact-us"><ContactUs /></div>
          </>
        ) : view === 'dashboard' ? (
          <Dashboard 
            inventory={inventory} 
            categories={categories} 
            requests={requests} 
            sellRequests={sellRequests} 
            onDeleteSellRequest={handleDeleteSellRequest} 
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onDeleteRequest={handleDeleteRequest}
            coupons={coupons} 
            onAddCoupon={handleAddCoupon} 
            onDeleteCoupon={handleDeleteCoupon} 
            activities={activities} 
            onAddNumber={handleAddNumber} 
            onDeleteNumber={handleDeleteNumber} 
            onAddCategory={handleAddCategory} 
            onDeleteCategory={handleDeleteCategory} 
            onUpdateOrderStatus={handleUpdateOrderStatus} 
            onDeleteOrder={handleDeleteOrder} 
            onUpdateOfferPrice={handleUpdateOfferPrice} 
            onBulkUpload={handleBulkUpload} 
            queries={queries} 
            onUpdateQueryStatus={handleUpdateQueryStatus}
            onDeleteQuery={handleDeleteQuery}
            orders={orders} 
            consultations={consultations}
            onUpdateConsultation={handleUpdateConsultation}
            onDeleteConsultation={handleDeleteConsultation}
            onToggleSoldStatus={handleToggleSoldStatus}
            onDeliverOrder={handleDeliverOrder}
            onClose={() => setView('home')} 
          />
        ) : view === 'privacy' ? (
          <div style={{ position: 'relative', padding: '40px 20px', minHeight: '70vh' }}>
            <button className="floating-back-btn" onClick={() => setView('home')}>← Back to Home</button>
            <PrivacyPolicy />
          </div>
        ) : view === 'terms' ? (
          <div style={{ position: 'relative', padding: '40px 20px', minHeight: '70vh' }}>
            <button className="floating-back-btn" onClick={() => setView('home')}>← Back to Home</button>
            <TermsConditions />
          </div>
        ) : view === 'partner-apply' ? (
          <PartnerProgram 
            onSubmitQuery={handleAddQuery} 
            user={user} 
            showFormOnly={true} 
            initialProgramType={partnerProgramType} 
            onBackClick={() => {
              setView('home');
              setTimeout(() => {
                const element = document.getElementById('partner-program');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          />
        ) : null}
      </main>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleLogin} onSendOtp={handleSendOtp} />
      <MyOrdersModal isOpen={isMyOrdersOpen} onClose={() => setIsMyOrdersOpen(false)} orders={orders} />
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} onBook={handleAstroBooking} user={user} />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} onRemove={removeFromCart} onCheckout={startCheckout} appliedCoupon={appliedCoupon} onApplyCoupon={handleApplyCoupon} onRemoveCoupon={handleRemoveCoupon} />
      {isCheckoutOpen && (
        <CheckoutForm 
          user={user} 
          totalAmount={cartItems.reduce((sum, i) => sum + (i.offerPrice || i.price), 0) - Math.round((cartItems.reduce((sum, i) => sum + (i.offerPrice || i.price), 0) * (appliedCoupon ? appliedCoupon.discountPercentage : 0)) / 100)} 
          onSubmit={handleFinalPayment} 
          onCancel={() => setIsCheckoutOpen(false)} 
          onPrivacyClick={() => { setIsCheckoutOpen(false); setView('privacy'); window.scrollTo(0, 0); }}
          onTermsClick={() => { setIsCheckoutOpen(false); setView('terms'); window.scrollTo(0, 0); }}
        />
      )}
      <FloatingWhatsApp />
      <CompareDrawer 
        compareItems={compareItems} 
        onRemoveFromCompare={handleRemoveFromCompare} 
        onClearCompare={handleClearCompare} 
        onAddToCart={addToCart} 
        onBuyNow={handleBuyNow} 
        cartItems={cartItems} 
      />
      <footer>
        <div className="footer-container">
          <div className="footer-col footer-brand">
            <div className="footer-logo-container" onClick={() => scrollToSection('home')}>
              <img src="/logo.jpg" alt="VNG Logo" className="footer-logo-img" />
              <div className="footer-logo-text">
                VipNumber<span className="gold-text">Garage</span>
              </div>
            </div>
            <p className="footer-brand-desc">
              Your premier showroom for exclusive and prestigious VIP mobile numbers. Elevate your personal and business presence with our curated collection of elite digits.
            </p>
            <div className="footer-warning-box" style={{ 
              backgroundColor: 'rgba(234, 45, 45, 0.05)', 
              borderLeft: '3px solid #ff5252', 
              padding: '10px 14px', 
              borderRadius: '4px', 
              marginTop: '15px', 
              fontSize: '0.8rem', 
              lineHeight: '1.4',
              color: '#ccc'
            }}>
              <strong style={{ color: '#ff5252', display: 'block', marginBottom: '2px' }}>⚠️ SECURITY WARNING:</strong>
              We only deal from our two official numbers: <strong style={{ color: 'white' }}>+91 98555-98544</strong> and <strong style={{ color: 'white' }}>+91 76900-00070</strong>. Please do not transfer payments to anyone without confirmation from these numbers.
            </div>
          </div>
          
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul>
              <li onClick={() => scrollToSection('home')}>Home</li>
              <li onClick={() => scrollToSection('our-products')}>Find Your Number</li>
              <li onClick={() => scrollToSection('sell-number')}>Sell Number</li>
              <li onClick={() => scrollToSection('partner-program')}>Partner Program</li>
              <li onClick={() => scrollToSection('contact-us')}>Contact Us</li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h3>Support & Legal</h3>
            <ul>
              <li onClick={() => scrollToSection('about-us')}>About Us</li>
              <li onClick={() => scrollToSection('about-why-us')}>Why Choose Us</li>
              <li onClick={() => scrollToSection('faq-section')}>FAQs</li>
              <li onClick={() => scrollToSection('numerology-consultation')}>Numerology</li>
              <li onClick={() => { setView('privacy'); window.scrollTo(0, 0); }}>Privacy Policy</li>
              <li onClick={() => { setView('terms'); window.scrollTo(0, 0); }}>Terms & Conditions</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 VipNumberGarage. Powered by VNG Telecommunications. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
