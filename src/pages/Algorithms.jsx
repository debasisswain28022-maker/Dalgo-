import React, { useState } from 'react';
import { ALGORITHMS } from '../data/algorithms';
import { GREEDY_DP_ALGORITHMS } from '../greedy-dp/data/algorithmsData';
import AlgorithmCard from '../components/AlgorithmCard';
import { Search, Sparkles, Layers, BookOpen, Clock, HardDrive, ArrowRight, Play } from 'lucide-react';

export default function Algorithms({ onNavigate, onSelectAlgorithm, onSelectGreedyAlgorithm }) {
  const [mainCategory, setMainCategory] = useState('sorting'); // 'sorting' | 'greedy-dp'
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const sortingCategories = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const greedyDpCategories = ['All', 'Greedy Algorithm', 'Dynamic Programming'];

  const filteredSortingAlgorithms = ALGORITHMS.filter(algo => {
    const matchesCategory = activeCategory === 'All' || algo.category === activeCategory;
    const matchesSearch = algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          algo.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          algo.technique.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredGreedyDpAlgorithms = GREEDY_DP_ALGORITHMS.filter(algo => {
    const matchesCategory = activeCategory === 'All' || algo.category === activeCategory;
    const matchesSearch = algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          algo.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          algo.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLearnSorting = (id) => {
    onSelectAlgorithm(id);
    onNavigate('algorithm-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVisualizeSorting = (id) => {
    onSelectAlgorithm(id);
    onNavigate('visualizer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLearnGreedy = (id) => {
    if (onSelectGreedyAlgorithm) onSelectGreedyAlgorithm(id);
    onNavigate('greedy-dp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVisualizeGreedy = (id) => {
    if (onSelectGreedyAlgorithm) onSelectGreedyAlgorithm(id);
    onNavigate('greedy-dp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="algorithms-page-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Algorithms Catalog</h1>
        <p className="page-subtitle">
          {mainCategory === 'sorting'
            ? 'Explore comprehensive guides, complexity statistics, and visualizations for all 10 sorting algorithms.'
            : 'Interactive step-by-step visualizers and educational guides for Greedy Algorithms & Dynamic Programming.'}
        </p>

        {/* Major Category Selector */}
        <div className="flex justify-center mt-6">
          <div className="inline-flex p-1.5 rounded-xl bg-slate-900/60 border border-slate-800 gap-1.5 shadow-md">
            <button
              onClick={() => {
                setMainCategory('sorting');
                setActiveCategory('All');
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                mainCategory === 'sorting'
                  ? 'bg-indigo-600 text-white shadow-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Sorting Algorithms (10)</span>
            </button>
            <button
              onClick={() => {
                setMainCategory('greedy-dp');
                setActiveCategory('All');
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                mainCategory === 'greedy-dp'
                  ? 'bg-indigo-600 text-white shadow-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Greedy & Dynamic Programming (4)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="catalog-toolbar">
        {/* Search Input */}
        <div className="search-bar-wrapper">
          <Search className="search-bar-icon" />
          <input 
            type="text"
            placeholder={mainCategory === 'sorting' ? "Search by name, category, or technique..." : "Search Knapsack, Huffman, Activity, LCS..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar-input"
          />
        </div>

        {/* Category Pills */}
        <div className="category-pills-bar">
          {(mainCategory === 'sorting' ? sortingCategories : greedyDpCategories).map(cat => (
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
      {mainCategory === 'sorting' ? (
        filteredSortingAlgorithms.length > 0 ? (
          <div className="algorithms-grid">
            {filteredSortingAlgorithms.map(algo => (
              <AlgorithmCard 
                key={algo.id}
                algorithm={algo}
                onLearn={handleLearnSorting}
                onVisualize={handleVisualizeSorting}
              />
            ))}
          </div>
        ) : (
          <div className="no-results-box">
            <h3>No sorting algorithms found</h3>
            <p>Try adjusting your search query or category filter.</p>
          </div>
        )
      ) : (
        filteredGreedyDpAlgorithms.length > 0 ? (
          <div className="algorithms-grid">
            {filteredGreedyDpAlgorithms.map(algo => (
              <div key={algo.id} className="algorithm-card">
                <div className="card-top-row">
                  <h3 className="card-title">{algo.name}</h3>
                  <span className="category-badge badge-advanced">
                    {algo.badge}
                  </span>
                </div>

                <p className="card-description">{algo.shortDescription}</p>

                {/* Complexity Badges */}
                <div className="card-complexity-grid">
                  <div className="complexity-item" title="Time Complexity">
                    <Clock className="complexity-icon" />
                    <div className="complexity-info">
                      <span className="complexity-label">Avg Time</span>
                      <span className="complexity-val">{algo.complexity.timeAverage}</span>
                    </div>
                  </div>

                  <div className="complexity-item" title="Space Complexity">
                    <HardDrive className="complexity-icon" />
                    <div className="complexity-info">
                      <span className="complexity-label">Space</span>
                      <span className="complexity-val">{algo.complexity.space}</span>
                    </div>
                  </div>
                </div>

                <div className="card-meta-row">
                  <span className="meta-tag tag-stable">
                    {algo.category}
                  </span>
                  <span className="meta-tag tag-inplace">
                    Interactive Steps
                  </span>
                </div>

                {/* Card Actions */}
                <div className="card-actions">
                  <button 
                    onClick={() => handleLearnGreedy(algo.id)} 
                    className="btn btn-sm btn-outline"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Learn</span>
                  </button>
                  <button 
                    onClick={() => handleVisualizeGreedy(algo.id)} 
                    className="btn btn-sm btn-primary"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Visualize</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results-box">
            <h3>No algorithms found</h3>
            <p>Try adjusting your search query or category filter.</p>
          </div>
        )
      )}
    </div>
  );
}
