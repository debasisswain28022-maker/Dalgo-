import React, { useState } from 'react';
import { ALGORITHMS } from '../data/algorithms';
import AlgorithmCard from '../components/AlgorithmCard';
import { Search, Filter } from 'lucide-react';

export default function Algorithms({ onNavigate, onSelectAlgorithm }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredAlgorithms = ALGORITHMS.filter(algo => {
    const matchesCategory = activeCategory === 'All' || algo.category === activeCategory;
    const matchesSearch = algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          algo.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          algo.technique.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLearn = (id) => {
    onSelectAlgorithm(id);
    onNavigate('algorithm-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVisualize = (id) => {
    onSelectAlgorithm(id);
    onNavigate('visualizer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="algorithms-page-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Algorithms Catalog</h1>
        <p className="page-subtitle">
          Explore comprehensive guides, complexity statistics, and visualizations for all 10 sorting algorithms.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="catalog-toolbar">
        {/* Search Input */}
        <div className="search-bar-wrapper">
          <Search className="search-bar-icon" />
          <input 
            type="text"
            placeholder="Search by name, category, or technique..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar-input"
          />
        </div>

        {/* Category Pills */}
        <div className="category-pills-bar">
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      {filteredAlgorithms.length > 0 ? (
        <div className="algorithms-grid">
          {filteredAlgorithms.map(algo => (
            <AlgorithmCard 
              key={algo.id}
              algorithm={algo}
              onLearn={handleLearn}
              onVisualize={handleVisualize}
            />
          ))}
        </div>
      ) : (
        <div className="no-results-box">
          <h3>No algorithms found</h3>
          <p>Try adjusting your search query or category filter.</p>
        </div>
      )}
    </div>
  );
}
