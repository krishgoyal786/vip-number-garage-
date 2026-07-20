import React from 'react';
import './BrowseCategories.css';

const BrowseCategories = ({ categories, onCategoryClick }) => {
  // Combine custom options like 'Offer Zone' with the fetched categories
  const displayCategories = [
    { _id: 'offer-zone', name: 'Offer Zone', icon: '🔥' },
    ...categories.map(cat => ({
      _id: cat._id,
      name: cat.name,
      icon: getCategoryIcon(cat.name)
    }))
  ];

  // Helper to assign a premium icon dynamically depending on the pattern type
  function getCategoryIcon(name) {
    const n = name.toLowerCase();
    if (n.includes('786')) return '☪️';
    if (n.includes('007')) return '🔫';
    if (n.includes('00')) return '💎';
    if (n.includes('xy')) return '🔢';
    if (n.includes('triple') || n.includes('triplet')) return '🌟';
    if (n.includes('tetra') || n.includes('quad')) return '👑';
    if (n.includes('penta') || n.includes('quint')) return '🦁';
    if (n.includes('mirror')) return '🔄';
    if (n.includes('double') || n.includes('pair')) return '👥';
    if (n.includes('lucky')) return '🍀';
    return '⭐';
  }

  return (
    <section className="browse-categories-section">
      <div className="categories-grid-box">
        <h2 className="section-title">Browse by VIP Pattern</h2>
        <div className="title-underline"></div>
        <p className="categories-intro">
          Explore premium numbers categorized by distinct mathematical patterns and lucky series.
        </p>

        <div className="categories-grid">
          {displayCategories.map((cat) => (
            <div 
              key={cat._id} 
              className="category-card-item"
              onClick={() => onCategoryClick(cat.name)}
            >
              <div className="cat-icon-wrapper">{cat.icon}</div>
              <h4 className="cat-name-text">{cat.name}</h4>
              <span className="cat-action-link">Explore Numbers →</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseCategories;
