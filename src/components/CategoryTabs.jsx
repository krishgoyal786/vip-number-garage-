import React from 'react';
import './CategoryTabs.css';

const CategoryTabs = ({ activeCategory, onCategoryChange, categories }) => {
  return (
    <div className="category-tabs-container">
      <div className="category-scroll">
        <button
          className={`category-tab ${activeCategory === 'All' ? 'active' : ''}`}
          onClick={() => onCategoryChange('All')}
        >
          All
        </button>
        <button
          className={`category-tab offer-zone-tab ${activeCategory === 'Offer Zone' ? 'active' : ''}`}
          onClick={() => onCategoryChange('Offer Zone')}
        >
          🔥 Offer Zone
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            className={`category-tab ${activeCategory === cat.name ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat.name)}
            style={{ textTransform: 'capitalize' }}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
