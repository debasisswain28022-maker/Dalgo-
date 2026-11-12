import React, { useState, useEffect } from 'react';
import { GREEDY_DP_ALGORITHMS } from './data/algorithmsData';
import KnapsackVisualizer from './fractional-knapsack/KnapsackVisualizer';
import HuffmanVisualizer from './huffman-coding/HuffmanVisualizer';
import ActivityVisualizer from './activity-selection/ActivityVisualizer';
import LcsVisualizer from './lcs/LcsVisualizer';
import EducationalSection from './common/EducationalSection';
import './styles/greedy-dp.css';

import {
  Package,
  Binary,
  Calendar,
  Grid,
  Sparkles,
  BookOpen,
  Eye,
  ChevronRight
} from 'lucide-react';

export default function GreedyDPPage({ selectedAlgoId, onSelectAlgoId, onNavigate }) {
  const [activeAlgoId, setActiveAlgoId] = useState(() => {
    return GREEDY_DP_ALGORITHMS.some((a) => a.id === selectedAlgoId)
      ? selectedAlgoId
      : 'fractional-knapsack';
  });
  const [activeViewMode, setActiveViewMode] = useState('visualizer'); // 'visualizer' | 'theory'

  useEffect(() => {
    if (selectedAlgoId) {
      if (GREEDY_DP_ALGORITHMS.some((a) => a.id === selectedAlgoId)) {
        setActiveAlgoId(selectedAlgoId);
        setActiveViewMode('visualizer');
      }
    }
  }, [selectedAlgoId]);

  const handleSelectAlgo = (id) => {
    setActiveAlgoId(id);
    if (onSelectAlgoId) onSelectAlgoId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentAlgo = GREEDY_DP_ALGORITHMS.find((a) => a.id === activeAlgoId) || GREEDY_DP_ALGORITHMS[0];

  const getAlgoIcon = (id) => {
    switch (id) {
      case 'fractional-knapsack':
        return Package;
      case 'huffman-coding':
        return Binary;
      case 'activity-selection':
        return Calendar;
      case 'longest-common-subsequence':
        return Grid;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="gdp-page-container">
      {/* Category Header */}
      <div className="gdp-page-header">
        <div className="gdp-header-badge">
          <Sparkles className="w-4 h-4 text-amber-400 mr-1.5" />
          <span>New Algorithmic Paradigm</span>
        </div>

        <h1 className="gdp-page-title">
          Greedy Algorithms & <span className="gradient-text">Dynamic Programming</span>
        </h1>

        <p className="gdp-page-subtitle">
          Explore interactive, step-by-step visualizations for optimization algorithms. Watch every greedy ratio choice, frequency merge, activity interval, and 2D DP cell recurrence execute live.
        </p>

        {/* Algorithm Tabs Bar */}
        <div className="gdp-algo-tabs">
          {GREEDY_DP_ALGORITHMS.map((algo) => {
            const Icon = getAlgoIcon(algo.id);
            const isSelected = algo.id === activeAlgoId;
            return (
              <button
                key={algo.id}
                onClick={() => handleSelectAlgo(algo.id)}
                className={`gdp-algo-tab-btn ${isSelected ? 'active' : ''}`}
              >
                <div className="gdp-algo-tab-icon-wrap">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="gdp-algo-tab-info">
                  <span className="gdp-algo-tab-name">{algo.name}</span>
                  <span className="gdp-algo-tab-badge">{algo.badge}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Algorithm Hero Bar */}
      <div className="gdp-algo-hero-card">
        <div className="gdp-hero-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="gdp-hero-category-tag">{currentAlgo.category}</span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-indigo-300 font-mono">Time: {currentAlgo.complexity.timeAverage}</span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-cyan-300 font-mono">Space: {currentAlgo.complexity.space}</span>
          </div>
          <h2 className="gdp-hero-title">{currentAlgo.name}</h2>
          <p className="gdp-hero-tagline">{currentAlgo.tagline}</p>
        </div>

        {/* View Mode Switcher (Visualizer vs Educational Guide) */}
        <div className="gdp-view-mode-toggle">
          <button
            onClick={() => setActiveViewMode('visualizer')}
            className={`gdp-view-btn ${activeViewMode === 'visualizer' ? 'active' : ''}`}
          >
            <Eye className="w-4 h-4 mr-1.5" />
            <span>Interactive Visualizer</span>
          </button>
          <button
            onClick={() => setActiveViewMode('theory')}
            className={`gdp-view-btn ${activeViewMode === 'theory' ? 'active' : ''}`}
          >
            <BookOpen className="w-4 h-4 mr-1.5" />
            <span>Educational Guide & Code</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="gdp-main-content">
        {activeViewMode === 'visualizer' ? (
          <div className="gdp-visualizer-container animate-fadeIn">
            {activeAlgoId === 'fractional-knapsack' && <KnapsackVisualizer />}
            {activeAlgoId === 'huffman-coding' && <HuffmanVisualizer />}
            {activeAlgoId === 'activity-selection' && <ActivityVisualizer />}
            {activeAlgoId === 'longest-common-subsequence' && <LcsVisualizer />}

            {/* Quick Link to Educational Section Below Visualizer */}
            <div className="gdp-visualizer-footer-card">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Want to master the theory, proofs, and multi-language code?</h4>
                  <p className="text-xs text-slate-400">Explore complete pseudocode, mathematical formulas, and C, C++, Java, and Python implementations.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveViewMode('theory');
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="gdp-btn gdp-btn-primary gdp-btn-sm"
              >
                <span>Read Full Theory</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        ) : (
          <div className="gdp-theory-container animate-fadeIn">
            <EducationalSection algorithm={currentAlgo} />
          </div>
        )}
      </div>
    </div>
  );
}
