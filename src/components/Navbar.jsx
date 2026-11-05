import React, { useState } from 'react';
import { BarChart3, BookOpen, Layers, GitCompare, HelpCircle, Menu, X, Search, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { ALGORITHMS } from '../data/algorithms';
import { GREEDY_DP_ALGORITHMS } from '../greedy-dp/data/algorithmsData';

export default function Navbar({ activeTab, setActiveTab, onSelectAlgorithm, onSelectGreedyAlgorithm }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const lowerQuery = searchQuery.trim().toLowerCase();

  const filteredSortingAlgos = lowerQuery
    ? ALGORITHMS.filter(algo => 
        algo.name.toLowerCase().includes(lowerQuery) ||
        algo.category.toLowerCase().includes(lowerQuery)
      ).map(a => ({ ...a, type: 'sorting' }))
    : [];

  const filteredGreedyDpAlgos = lowerQuery
    ? GREEDY_DP_ALGORITHMS.filter(algo =>
        algo.name.toLowerCase().includes(lowerQuery) ||
        algo.category.toLowerCase().includes(lowerQuery) ||
        algo.tagline.toLowerCase().includes(lowerQuery)
      ).map(a => ({ ...a, type: 'greedy-dp' }))
    : [];

  const allSearchResults = [...filteredSortingAlgos, ...filteredGreedyDpAlgos];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSearchResult = (algo) => {
    if (algo.type === 'greedy-dp') {
      if (onSelectGreedyAlgorithm) onSelectGreedyAlgorithm(algo.id);
      setActiveTab('greedy-dp');
    } else {
      onSelectAlgorithm(algo.id);
      setActiveTab('algorithm-details');
    }
    setSearchOpen(false);
    setSearchQuery('');
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => handleNavClick('home')}>
          <div className="logo-icon-wrapper">
            <BarChart3 className="logo-icon" />
          </div>
          <div className="brand-text-container">
            <span className="brand-title">D<span className="gradient-text">Algo</span></span>
            <span className="brand-subtitle">Algorithm Visualizer</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <button 
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            Home
          </button>
          <button 
            className={`nav-link ${activeTab === 'algorithms' || activeTab === 'algorithm-details' ? 'active' : ''}`}
            onClick={() => handleNavClick('algorithms')}
          >
            <BookOpen className="nav-icon" />
            Algorithms
          </button>
          <button 
            className={`nav-link ${activeTab === 'greedy-dp' ? 'active' : ''}`}
            onClick={() => handleNavClick('greedy-dp')}
          >
            <Sparkles className="nav-icon text-amber-400" />
            Greedy & DP
          </button>
          <button 
            className={`nav-link ${activeTab === 'visualizer' ? 'active' : ''}`}
            onClick={() => handleNavClick('visualizer')}
          >
            <Layers className="nav-icon" />
            Visualizer
          </button>
          <button 
            className={`nav-link ${activeTab === 'compare' ? 'active' : ''}`}
            onClick={() => handleNavClick('compare')}
          >
            <GitCompare className="nav-icon" />
            Compare
          </button>
          <button 
            className={`nav-link ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => handleNavClick('quiz')}
          >
            <HelpCircle className="nav-icon" />
            Quiz
          </button>
        </nav>

        {/* Right Action Items */}
        <div className="navbar-actions">
          {/* Search Trigger */}
          <div className="search-wrapper">
            <button 
              className="search-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              title="Search Algorithms"
            >
              <Search className="w-4 h-4" />
              <span className="search-placeholder">Search algorithm...</span>
            </button>

            {searchOpen && (
              <div className="search-dropdown">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Type Bubble, Quick, Merge..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <div className="search-results">
                  {allSearchResults.length > 0 ? (
                    allSearchResults.map(algo => (
                      <div 
                        key={`${algo.type}-${algo.id}`}
                        className="search-item"
                        onClick={() => handleSelectSearchResult(algo)}
                      >
                        <div className="search-item-title">{algo.name}</div>
                        <div className="search-item-badge">
                          {algo.type === 'greedy-dp' ? (algo.category || 'Greedy & DP') : algo.category}
                        </div>
                      </div>
                    ))
                  ) : searchQuery.trim() ? (
                    <div className="search-no-results">No algorithm found</div>
                  ) : (
                    <div className="search-hint">Type algorithm name (e.g. Knapsack, Huffman, Quick)</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <button 
            className={`mobile-nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            Home
          </button>
          <button 
            className={`mobile-nav-link ${activeTab === 'algorithms' ? 'active' : ''}`}
            onClick={() => handleNavClick('algorithms')}
          >
            Algorithms Catalog
          </button>
          <button 
            className={`mobile-nav-link ${activeTab === 'greedy-dp' ? 'active' : ''}`}
            onClick={() => handleNavClick('greedy-dp')}
          >
            Greedy & DP Algorithms
          </button>
          <button 
            className={`mobile-nav-link ${activeTab === 'visualizer' ? 'active' : ''}`}
            onClick={() => handleNavClick('visualizer')}
          >
            Interactive Visualizer
          </button>
          <button 
            className={`mobile-nav-link ${activeTab === 'compare' ? 'active' : ''}`}
            onClick={() => handleNavClick('compare')}
          >
            Algorithm Compare Matrix
          </button>
          <button 
            className={`mobile-nav-link ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => handleNavClick('quiz')}
          >
            Knowledge Quiz
          </button>
        </div>
      )}
    </header>
  );
}
