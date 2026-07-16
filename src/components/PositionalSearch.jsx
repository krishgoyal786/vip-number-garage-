import React, { useState, useEffect } from 'react';
import './PositionalSearch.css';

const PositionalSearch = ({ searchCriteria, onSearch }) => {
  const [digits, setDigits] = useState(Array(10).fill(''));
  const [budget, setBudget] = useState({ min: '', max: '' });
  const [sort, setSort] = useState('none');
  const [carrier, setCarrier] = useState('all');
  const [numerologySum, setNumerologySum] = useState('');
  const [excludeDigits, setExcludeDigits] = useState('');

  useEffect(() => {
    if (!searchCriteria) return;
    setDigits(searchCriteria.digits || Array(10).fill(''));
    setBudget(searchCriteria.budget || { min: '', max: '' });
    setSort(searchCriteria.sort || 'none');
    setCarrier(searchCriteria.carrier || 'all');
    setNumerologySum(searchCriteria.numerologySum || '');
    setExcludeDigits(searchCriteria.excludeDigits || '');
  }, [searchCriteria]);

  const handleChange = (index, value) => {
    if (value.length > 1) return; 
    if (value !== '' && !/^\d$/.test(value)) return; 

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value !== '' && index < 9) {
      const nextInput = document.getElementById(`digit-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'ArrowRight' && index < 9) {
      const nextInput = document.getElementById(`digit-${index + 1}`);
      if (nextInput) nextInput.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.getElementById(`digit-${index - 1}`);
      if (prevInput) prevInput.focus();
    } else if (e.key === 'Enter') {
      if (index < 9) {
        const nextInput = document.getElementById(`digit-${index + 1}`);
        if (nextInput) nextInput.focus();
      } else {
        handleSearch();
      }
    } else if (e.key === 'Backspace') {
      if (digits[index] === '' && index > 0) {
        const prevInput = document.getElementById(`digit-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
          const newDigits = [...digits];
          newDigits[index - 1] = '';
          setDigits(newDigits);
        }
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
      }
    }
  };

  const handleSearch = () => {
    onSearch({ digits, budget, sort, carrier, numerologySum, excludeDigits });
  };

  const handleClear = () => {
    const emptyDigits = Array(10).fill('');
    const emptyBudget = { min: '', max: '' };
    setDigits(emptyDigits);
    setBudget(emptyBudget);
    setSort('none');
    setCarrier('all');
    setNumerologySum('');
    setExcludeDigits('');
    onSearch({ 
      digits: emptyDigits, 
      budget: emptyBudget, 
      sort: 'none', 
      carrier: 'all', 
      numerologySum: '', 
      excludeDigits: '' 
    });
  };

  return (
    <div id="positional-search-section" className="positional-search-container">
      <h2 className="search-title">Find Your Identity</h2>
      
      <div className="search-instruction-box">
        <h3>How to use Search?</h3>
        <p>
          Enter digits at their <strong>exact positions</strong> and/or set your <strong>budget range</strong>. 
          Click <strong>'Search Now'</strong> to find your matching VIP numbers.
        </p>
      </div>

      <div className="budget-row">
        <div className="budget-input-group">
          <label>Min Price (₹)</label>
          <input 
            type="text" 
            placeholder="Min Price" 
            value={budget.min}
            onChange={(e) => setBudget({...budget, min: e.target.value.replace(/\D/g, '')})}
          />
        </div>
        <div className="budget-input-group">
          <label>Max Price (₹)</label>
          <input 
            type="text" 
            placeholder="Max Price" 
            value={budget.max}
            onChange={(e) => setBudget({...budget, max: e.target.value.replace(/\D/g, '')})}
          />
        </div>
        <div className="budget-input-group">
          <label>Sort By Price</label>
          <select 
            className="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="none">Default</option>
            <option value="low-high">Low to High</option>
            <option value="high-low">High to Low</option>
          </select>
        </div>
      </div>

      <div className="premium-filters-row">
        <div className="budget-input-group">
          <label>Network Carrier</label>
          <select 
            className="sort-select"
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
          >
            <option value="all">All Operators</option>
            <option value="airtel">Airtel</option>
            <option value="jio">Jio</option>
            <option value="vi">Vi</option>
            <option value="bsnl">BSNL</option>
          </select>
        </div>
        <div className="budget-input-group">
          <label>Numerology Total (1-9)</label>
          <select 
            className="sort-select"
            value={numerologySum}
            onChange={(e) => setNumerologySum(e.target.value)}
          >
            <option value="">Any Sum</option>
            {[1,2,3,4,5,6,7,8,9].map(n => (
              <option key={n} value={n}>Total Sum = {n}</option>
            ))}
          </select>
        </div>
        <div className="budget-input-group">
          <label>Exclude Digits (e.g. 4,8)</label>
          <input 
            type="text" 
            placeholder="Digits to hide"
            value={excludeDigits}
            onChange={(e) => setExcludeDigits(e.target.value.replace(/[^0-9,]/g, ''))}
          />
        </div>
      </div>

      <div className="digit-inputs">
        {digits.map((digit, index) => (
          <div key={index} className="digit-box-container">
            <input
              id={`digit-${index}`}
              type="text"
              className="digit-input"
              value={digit}
              placeholder="*"
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              maxLength={1}
            />
          </div>
        ))}
      </div>
      <div className="search-actions-row">
        <button className="search-now-btn" onClick={handleSearch}>Search Now</button>
        <button className="clear-search-btn" onClick={handleClear}>Clear Search</button>
      </div>
    </div>
  );
};

export default PositionalSearch;
