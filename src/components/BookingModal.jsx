import React, { useState, useEffect } from 'react';
import './BookingModal.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const getTodayDateString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (month, year) => {
  return new Date(year, month, 1).getDay();
};

const formatDateString = (day, month, year) => {
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
};

const isDateInPast = (day, month, year) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(year, month, day);
  return checkDate < today;
};

const BookingModal = ({ isOpen, onClose, onBook, user }) => {
  const [step, setStep] = useState(1);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    bookingDate: getTodayDateString(), // Pre-set to today
    bookingSlot: ''
  });

  // Fetch already booked slots when modal opens
  useEffect(() => {
    if (isOpen) {
      fetch(`${API_BASE_URL}/consultations/booked-slots`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setBookedSlots(data);
          }
        })
        .catch(err => console.error("Error fetching booked slots:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const timeSlots = [
    "10:00 AM - 10:30 AM",
    "10:30 AM - 11:00 AM",
    "11:00 AM - 11:30 AM",
    "11:30 AM - 12:00 PM",
    "12:00 PM - 12:30 PM",
    "12:30 PM - 01:00 PM",
    "02:00 PM - 02:30 PM",
    "02:30 PM - 03:00 PM",
    "03:00 PM - 03:30 PM",
    "03:30 PM - 04:00 PM",
    "04:00 PM - 04:30 PM",
    "04:30 PM - 05:00 PM",
    "05:00 PM - 05:30 PM",
    "05:30 PM - 06:00 PM"
  ];

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    
    // Pad previous month days
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const isSlotInPast = (dateStr, slotStr) => {
    if (!dateStr) return false;
    const todayStr = getTodayDateString();
    if (dateStr < todayStr) return true; 
    if (dateStr > todayStr) return false; 

    // Selected date is today: check if time has already passed
    try {
      const startTimePart = slotStr.split(' - ')[0]; // E.g., "10:30 AM"
      const [time, modifier] = startTimePart.split(' '); 
      let [hours, minutes] = time.split(':').map(Number);
      
      if (modifier === 'PM' && hours < 12) {
        hours += 12;
      }
      if (modifier === 'AM' && hours === 12) {
        hours = 0;
      }

      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      if (currentHours > hours) return true;
      if (currentHours === hours && currentMinutes >= minutes) return true;
      return false;
    } catch (e) {
      return false;
    }
  };

  const isSlotBooked = (dateStr, slotStr) => {
    if (!dateStr || !slotStr || !bookedSlots.length) return false;
    return bookedSlots.some(b => {
      if (!b.bookingDate) return false;
      const dbDate = b.bookingDate.split('T')[0];
      return dbDate === dateStr && b.bookingSlot === slotStr;
    });
  };

  const isSlotUnavailable = (dateStr, slotStr) => {
    return isSlotInPast(dateStr, slotStr) || isSlotBooked(dateStr, slotStr);
  };

  const getSelectedDateLabel = () => {
    if (!formData.bookingDate) return 'No Date Selected';
    try {
      return new Date(formData.bookingDate).toLocaleDateString('en-IN', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short',
        year: 'numeric'
      });
    } catch(e) {
      return formData.bookingDate;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'bookingDate') {
      // If user selected slot is now unavailable under the new date, clear it
      if (formData.bookingSlot && isSlotUnavailable(value, formData.bookingSlot)) {
        setFormData({ ...formData, bookingDate: value, bookingSlot: '' });
        return;
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.customerName || !formData.phone || !formData.email || !formData.dateOfBirth || !formData.timeOfBirth || !formData.placeOfBirth) {
        alert("Please fill all birth and contact details.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.bookingDate || !formData.bookingSlot) {
        alert("Please choose an available date and a time slot.");
        return;
      }
      if (isSlotUnavailable(formData.bookingDate, formData.bookingSlot)) {
        alert("The selected slot is no longer available. Please choose another slot.");
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onBook(formData);
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal-content">
        <button className="close-modal-btn" onClick={onClose}>&times;</button>
        
        <div className="booking-header">
          <h2>🔮 VIP Astro-Numerology</h2>
          <p className="offer-badge-limited">Limited Launch Offer - 50% OFF</p>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1<span className="step-label">Birth Details</span></div>
          <div className="step-line"></div>
          <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2<span className="step-label">Schedule Slot</span></div>
          <div className="step-line"></div>
          <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3<span className="step-label">Confirm</span></div>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          {step === 1 && (
            <div className="step-content animate-fade">
              <h3>Enter Birth & Contact Details</h3>
              <p className="step-description">Our astrologer will use this information to calculate your destiny charts before the scheduled call.</p>
              
              <div className="input-group-row">
                <div className="input-field-wrapper">
                  <label>Full Name</label>
                  <input type="text" name="customerName" value={formData.customerName} onChange={handleInputChange} required placeholder="Enter full name" />
                </div>
                <div className="input-field-wrapper">
                  <label>WhatsApp Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="E.g. 9855598544" />
                </div>
              </div>

              <div className="input-field-wrapper">
                <label>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="name@email.com" />
              </div>

              <div className="input-group-row">
                <div className="input-field-wrapper">
                  <label>Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required />
                </div>
                <div className="input-field-wrapper">
                  <label>Time of Birth</label>
                  <input type="time" name="timeOfBirth" value={formData.timeOfBirth} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="input-field-wrapper">
                <label>Place of Birth</label>
                <input type="text" name="placeOfBirth" value={formData.placeOfBirth} onChange={handleInputChange} required placeholder="City, State (e.g. Bathinda, Punjab)" />
              </div>

              <button type="button" className="booking-next-btn" onClick={handleNext}>Continue to Schedule →</button>
            </div>
          )}

          {step === 2 && (
            <div className="step-content animate-fade">
              <h3>Schedule Your 30-Minute Consultation</h3>
              <p className="step-description">Select a date from the calendar and choose an available time slot.</p>

              <div className="scheduler-layout">
                {/* Left Column: Premium Calendar */}
                <div className="custom-calendar-card">
                  <div className="calendar-controls">
                    <button type="button" className="cal-control-btn" onClick={prevMonth}>&larr;</button>
                    <span className="calendar-current-month">{monthNames[currentMonth]} {currentYear}</span>
                    <button type="button" className="cal-control-btn" onClick={nextMonth}>&rarr;</button>
                  </div>
                  <div className="calendar-weekdays">
                    <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                  </div>
                  <div className="calendar-days-grid">
                    {generateCalendarDays().map((day, idx) => {
                      if (day === null) return <div key={`empty-${idx}`} className="empty-day-cell"></div>;
                      
                      const dateStr = formatDateString(day, currentMonth, currentYear);
                      const isPast = isDateInPast(day, currentMonth, currentYear);
                      const isSelected = formData.bookingDate === dateStr;
                      
                      return (
                        <button
                          key={`day-${day}`}
                          type="button"
                          className={`calendar-day-btn ${isSelected ? 'selected' : ''} ${isPast ? 'past' : ''}`}
                          disabled={isPast}
                          onClick={() => setFormData({ ...formData, bookingDate: dateStr, bookingSlot: '' })}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Time Slots */}
                <div className="time-slots-card">
                  <h4 className="slots-date-header">
                    Available Slots for <span className="gold-text">{getSelectedDateLabel()}</span>
                  </h4>
                  <div className="slots-grid flex-slots">
                    {timeSlots.map((slot) => {
                      const isBooked = isSlotBooked(formData.bookingDate, slot);
                      const isPast = isSlotInPast(formData.bookingDate, slot);
                      const unavailable = isBooked || isPast;
                      return (
                        <button
                          key={slot}
                          type="button"
                          className={`slot-option-btn ${formData.bookingSlot === slot ? 'selected' : ''} ${unavailable ? 'unavailable' : ''}`}
                          onClick={() => {
                            if (!unavailable) {
                              setFormData({ ...formData, bookingSlot: slot });
                            }
                          }}
                          disabled={unavailable}
                        >
                          {slot}
                          {isBooked ? ' (Booked)' : isPast ? ' (Past)' : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="booking-actions-row">
                <button type="button" className="booking-back-btn" onClick={handleBack}>&larr; Back</button>
                <button type="button" className="booking-next-btn" onClick={handleNext}>Confirm Details &rarr;</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content animate-confirm">
              <h3>Confirm Booking & Payout</h3>
              <p className="step-description">Please double-check your consultation details before checking out.</p>

              <div className="summary-card">
                <div className="summary-item"><strong>Client:</strong> <span>{formData.customerName} (+91 {formData.phone})</span></div>
                <div className="summary-item"><strong>Birth Chart:</strong> <span>{formData.dateOfBirth} | {formData.timeOfBirth} | {formData.placeOfBirth}</span></div>
                <div className="summary-item"><strong>Appointment:</strong> <span className="gold-text"><strong>{formData.bookingDate}</strong> at <strong>{formData.bookingSlot}</strong></span></div>
                <div className="summary-item"><strong>Platform:</strong> <span>WhatsApp Call/Video Call</span></div>
              </div>

              <div className="billing-box">
                <div className="billing-row">
                  <span>Regular Consulting Fee:</span>
                  <span style={{ textDecoration: 'line-through', color: '#555' }}>₹999</span>
                </div>
                <div className="billing-row">
                  <span>Launch Discount (50% OFF):</span>
                  <span className="gold-text">-₹500</span>
                </div>
                <hr className="billing-divider" />
                <div className="billing-row total">
                  <span>Total Amount (Pay to Astrologer):</span>
                  <span className="price-tag-gold">₹499</span>
                </div>
                
                <div className="payment-note" style={{ 
                  marginTop: '15px', 
                  backgroundColor: 'rgba(212, 175, 55, 0.1)', 
                  border: '1px solid var(--primary-gold)', 
                  borderRadius: '8px', 
                  padding: '12px', 
                  fontSize: '0.85rem', 
                  lineHeight: '1.4', 
                  color: 'var(--text-gray)',
                  textAlign: 'left'
                }}>
                  ℹ️ <strong>Direct Payment Notice:</strong> We do not collect any payments on our website. You will pay the consulting fee of <strong>₹499</strong> directly to our team.
                  <span style={{ color: '#ff5252', fontWeight: 'bold', display: 'block', marginTop: '8px' }}>
                    ⚠️ SECURITY DISCLAIMER: We only deal from our two official numbers: +91 98555-98544 and +91 76900-00070. Please do not transfer any payments to anyone without getting direct verification and confirmation from these two official numbers.
                  </span>
                </div>
              </div>

              <div className="booking-actions-row">
                <button type="button" className="booking-back-btn" onClick={handleBack} disabled={isSubmitting}>&larr; Back</button>
                <button type="submit" className="booking-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting Booking..." : "Confirm & Reserve Slot"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
