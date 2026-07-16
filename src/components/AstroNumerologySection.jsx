import React, { useState } from 'react';
import './AstroNumerologySection.css';

const NUMEROLOGY_INFO = {
  1: {
    title: "The Leader",
    desc: "Independent, pioneering, creative, and strong-willed. You thrive when you take charge and manifest new ideas.",
    lucky: [1, 3, 5, 9]
  },
  2: {
    title: "The Peacemaker",
    desc: "Intuitive, cooperative, diplomatic, and supportive. You bring balance, harmony, and understanding to those around you.",
    lucky: [2, 4, 6, 8]
  },
  3: {
    title: "The Creative",
    desc: "Expressive, artistic, optimistic, and highly social. Your imagination and communication are your key strengths.",
    lucky: [1, 3, 5, 7]
  },
  4: {
    title: "The Builder",
    desc: "Practical, disciplined, orderly, and highly reliable. You build solid foundations and value stability and hard work.",
    lucky: [2, 4, 6, 8]
  },
  5: {
    title: "The Adventurer",
    desc: "Versatile, freedom-loving, energetic, and curious. You embrace change and seek new experiences and adventures.",
    lucky: [1, 5, 6, 9]
  },
  6: {
    title: "The Nurturer",
    desc: "Responsible, loving, compassionate, and family-oriented. You are the ultimate caregiver and find joy in helping others.",
    lucky: [2, 5, 6, 8]
  },
  7: {
    title: "The Seeker",
    desc: "Analytical, spiritual, reserved, and wisdom-seeking. You seek truth, enjoy solitude, and dive deep into mysteries.",
    lucky: [3, 7, 9]
  },
  8: {
    title: "The Powerhouse",
    desc: "Goal-oriented, authoritative, strong, and material-focused. You excel in business, finance, and leading large projects.",
    lucky: [2, 4, 6, 8]
  },
  9: {
    title: "The Philanthropist",
    desc: "Compassionate, generous, humanitarian, and creative. You are motivated by helping others and global awareness.",
    lucky: [1, 3, 7, 9]
  }
};

const AstroNumerologySection = ({ onBookClick, onLoginClick, user, onSelectLuckyDigit }) => {
  const [activeTab, setActiveTab] = useState('consult'); // 'consult' | 'calculator'
  const [calcName, setCalcName] = useState('');
  const [calcDob, setCalcDob] = useState('');
  const [calcResults, setCalcResults] = useState(null);

  const handleBookingTrigger = () => {
    if (!user) {
      alert("Please login to proceed with your booking.");
      onLoginClick();
      return;
    }
    onBookClick();
  };

  const reduceToSingleDigit = (num) => {
    if (num === 0) return 0;
    const reduced = (num - 1) % 9 + 1;
    return reduced;
  };

  const calculateExpressionNumber = (name) => {
    const mapping = {
      a: 1, j: 1, s: 1,
      b: 2, k: 2, t: 2,
      c: 3, l: 3, u: 3,
      d: 4, m: 4, v: 4,
      e: 5, n: 5, w: 5,
      f: 6, o: 6, x: 6,
      g: 7, p: 7, y: 7,
      h: 8, q: 8, z: 8,
      i: 9, r: 9
    };
    const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
    let sum = 0;
    for (let char of cleanName) {
      sum += mapping[char] || 0;
    }
    return reduceToSingleDigit(sum);
  };

  const calculateLifePathNumber = (dobStr) => {
    const cleanDob = dobStr.replace(/\D/g, '');
    let sum = 0;
    for (let digit of cleanDob) {
      sum += parseInt(digit);
    }
    return reduceToSingleDigit(sum);
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!calcName || !calcDob) return;

    const lifePath = calculateLifePathNumber(calcDob);
    const destiny = calculateExpressionNumber(calcName);

    const lifePathData = NUMEROLOGY_INFO[lifePath] || { title: "Standard", desc: "No description found", lucky: [lifePath] };
    const destinyData = NUMEROLOGY_INFO[destiny] || { title: "Standard", desc: "No description found", lucky: [destiny] };

    setCalcResults({
      name: calcName,
      lifePath,
      lifePathTitle: lifePathData.title,
      lifePathDesc: lifePathData.desc,
      destiny,
      destinyTitle: destinyData.title,
      destinyDesc: destinyData.desc,
      luckyDigits: lifePathData.lucky
    });
  };

  return (
    <div className="astro-section-wrapper" id="numerology-consultation">
      <div className="astro-container">
        
        {/* Text / Copy / Calculator Column */}
        <div className="astro-copy-col">
          <div className="astro-badge">🔮 Premium Service</div>
          <h2 className="astro-title">Royal Astro-Numerology</h2>
          <p className="astro-tagline">Align your mobile identity with your celestial destiny</p>
          
          <div className="astro-tabs-nav">
            <button 
              className={`astro-nav-tab-btn ${activeTab === 'consult' ? 'active' : ''}`}
              onClick={() => setActiveTab('consult')}
            >
              🔮 Astrologer Consultation
            </button>
            <button 
              className={`astro-nav-tab-btn ${activeTab === 'calculator' ? 'active' : ''}`}
              onClick={() => setActiveTab('calculator')}
            >
              🔢 Insta Lucky Calculator
            </button>
          </div>

          {activeTab === 'consult' ? (
            <>
              <p className="astro-desc">
                Your mobile number is a critical digital footprint. Don't guess your lucky numbers. 
                Connect with our certified Vedic Astrologers for a personal 30-minute consultation. 
                We analyze your birth chart (Kundli) and destiny numbers to match you with the ultimate 
                high-end VIP mobile numbers.
              </p>

              <div className="astro-features-list">
                <div className="astro-feat-item">
                  <span className="feat-bullet">✓</span>
                  <div>
                    <strong>30-Minute Live Consultation</strong>
                    <p>One-on-one phone call or video session directly with a professional astrologer.</p>
                  </div>
                </div>
                <div className="astro-feat-item">
                  <span className="feat-bullet">✓</span>
                  <div>
                    <strong>Handcrafted PDF Report on WhatsApp</strong>
                    <p>Receive your custom numerology and lucky digits analysis document automatically via WhatsApp.</p>
                  </div>
                </div>
                <div className="astro-feat-item">
                  <span className="feat-bullet">✓</span>
                  <div>
                    <strong>Name Correction & Sourcing Advice</strong>
                    <p>Get recommendations on name spelling corrections and tailored digits matching your birth chart.</p>
                  </div>
                </div>
              </div>

              <div className="astro-pricing-panel">
                <div className="pricing-left">
                  <div className="limited-period-alert">⚠️ Limited Period Launch Offer</div>
                  <div className="pricing-numbers-row">
                    <span className="original-price-strike">₹999</span>
                    <span className="active-price-deal">₹499</span>
                    <span className="percent-badge-gold">50% OFF</span>
                  </div>
                </div>
                <button className="book-session-btn" onClick={handleBookingTrigger}>
                  Book Your Slot Now
                </button>
              </div>
            </>
          ) : (
            <div className="astro-calculator-container">
              <p className="astro-desc">
                Calculate your personal Life Path and Destiny Numbers instantly using Vedic and Pythagorean numerology. Discover what digits are compatible with your birth chart.
              </p>
              
              {!calcResults ? (
                <form className="astro-calc-form" onSubmit={handleCalculate}>
                  <div className="calc-input-row">
                    <div className="calc-input-group">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. John Doe" 
                        value={calcName} 
                        onChange={(e) => setCalcName(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="calc-input-group">
                      <label>Date of Birth</label>
                      <input 
                        type="date" 
                        value={calcDob} 
                        onChange={(e) => setCalcDob(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                  <button type="submit" className="calc-submit-btn">Calculate Lucky Numbers</button>
                </form>
              ) : (
                <div className="astro-calc-results">
                  <div className="results-grid">
                    <div className="result-card path-card">
                      <span className="result-card-label">Life Path Number</span>
                      <div className="result-number-circle">{calcResults.lifePath}</div>
                      <strong>{calcResults.lifePathTitle}</strong>
                      <p>{calcResults.lifePathDesc}</p>
                    </div>
                    
                    <div className="result-card destiny-card">
                      <span className="result-card-label">Destiny Number</span>
                      <div className="result-number-circle destiny">{calcResults.destiny}</div>
                      <strong>{calcResults.destinyTitle}</strong>
                      <p>{calcResults.destinyDesc}</p>
                    </div>
                  </div>

                  <div className="lucky-compatibility-panel">
                    <h4>Lucky Compatibility for {calcResults.name}</h4>
                    <p>Vedic compatibility suggests VIP numbers that sum up to: <strong>{calcResults.luckyDigits.join(', ')}</strong></p>
                    <div className="lucky-digits-row">
                      {calcResults.luckyDigits.map(digit => {
                        const incompatible = {
                          1: '8',
                          2: '8,9',
                          3: '6',
                          4: '8',
                          5: '9',
                          6: '3',
                          7: '8',
                          8: '1,2,4',
                          9: '2'
                        };
                        return (
                          <button 
                            key={digit} 
                            className="lucky-digit-badge-btn" 
                            onClick={() => onSelectLuckyDigit(digit, incompatible[digit] || '')}
                            title={`Find numbers with sum = ${digit}`}
                          >
                            Find Sum {digit}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="calc-result-actions">
                    <button className="show-numbers-btn" onClick={() => {
                      const incompatible = {
                        1: '8',
                        2: '8,9',
                        3: '6',
                        4: '8',
                        5: '9',
                        6: '3',
                        7: '8',
                        8: '1,2,4',
                        9: '2'
                      };
                      onSelectLuckyDigit(calcResults.lifePath, incompatible[calcResults.lifePath] || '');
                    }}>
                      🔍 Search Matching VIP Numbers (Sum = {calcResults.lifePath})
                    </button>
                    <button className="recalculate-btn" onClick={() => setCalcResults(null)}>
                      🔄 Recalculate
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Graphics / Interactive Astrology Wheel Column */}
        <div className="astro-graphics-col">
          <div className="celestial-canvas">
            <div className="outer-star-ring"></div>
            <div className="astrology-chart-wheel">
              <div className="chart-sectors"></div>
              <div className="chart-sectors sector-rotated"></div>
              <div className="inner-zodiac-ring"></div>
              <div className="center-sun-core">
                <span className="mystical-rune">🔮</span>
              </div>
            </div>
            <div className="orbiting-nodes node-1">1</div>
            <div className="orbiting-nodes node-2">3</div>
            <div className="orbiting-nodes node-3">5</div>
            <div className="orbiting-nodes node-4">7</div>
            <div className="orbiting-nodes node-5">9</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AstroNumerologySection;
