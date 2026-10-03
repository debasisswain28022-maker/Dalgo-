import React, { useState } from 'react';
import { BarChart3, BookOpen, Layers, GitCompare, HelpCircle, Menu, X, Search } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { ALGORITHMS } from '../data/algorithms';

export default function Navbar({ activeTab, setActiveTab, onSelectAlgorithm }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const filteredAlgorithms = searchQuery.trim()
    ? ALGORITHMS.filter(algo => 
        algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        algo.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSearchResult = (algoId) => {
    onSelectAlgorithm(algoId);
    setActiveTab('algorithm-details');
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
                  {filteredAlgorithms.length > 0 ? (
                    filteredAlgorithms.map(algo => (
                      <div 
                        key={algo.id}
                        className="search-item"
                        onClick={() => handleSelectSearchResult(algo.id)}
                      >
                        <div className="search-item-title">{algo.name}</div>
                        <div className="search-item-badge">{algo.category}</div>
                      </div>
                    ))
                  ) : searchQuery.trim() ? (
                    <div className="search-no-results">No algorithm found</div>
                  ) : (
                    <div className="search-hint">Type algorithm name</div>
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
