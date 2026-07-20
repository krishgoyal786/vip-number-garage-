import React from 'react';
import './BrowseCategories.css';

const BrowseCategories = ({ categories, onCategoryClick }) => {
  // Combine custom options like 'Offer Zone' with the fetched categories
  const displayCategories = [
    { _id: 'offer-zone', name: 'Offer Zone' },
    ...categories.map(cat => ({
      _id: cat._id,
      name: cat.name
    }))
  ];

  return (
    <section className="browse-categories-section">
      <div className="categories-links-box">
        <h3 className="categories-title-small">Browse by VIP Pattern:</h3>
        <div className="categories-links-list">
          {displayCategories.map((cat, i) => (
            <React.Fragment key={cat._id}>
              {i > 0 && <span className="category-separator">•</span>}
              <button 
                className="category-text-link"
                onClick={() => onCategoryClick(cat.name)}
              >
                {cat.name}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseCategories;
