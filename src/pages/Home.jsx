import React, { useState, useEffect } from 'react';
import { Play, BookOpen, Eye, Cpu, MousePointer, HelpCircle, ArrowRight, Sparkles, Zap, CheckCircle } from 'lucide-react';
import { ALGORITHMS } from '../data/algorithms';
import ArrayBars from '../components/ArrayBars';
import { runSortingAlgorithm } from '../algorithms';

export default function Home({ onNavigate, onSelectAlgorithm }) {
  // Live Mini-Preview State
  const [previewAlgo, setPreviewAlgo] = useState('bubble-sort');
  const [previewArray, setPreviewArray] = useState([45, 12, 85, 32, 67, 19, 90, 54, 28, 71]);
  const [previewStepIdx, setPreviewStepIdx] = useState(0);
  const [previewSteps, setPreviewSteps] = useState([]);
  const [isLooping, setIsLooping] = useState(true);

  useEffect(() => {
    const res = runSortingAlgorithm(previewAlgo, previewArray);
    setPreviewSteps(res.steps);
    setPreviewStepIdx(0);
  }, [previewAlgo]);

  useEffect(() => {
    if (!isLooping || previewSteps.length === 0) return;

    const timer = setInterval(() => {
      setPreviewStepIdx((prev) => {
        if (prev >= previewSteps.length - 1) {
          return 0; // Loop back to start
        }
        return prev + 1;
      });
    }, 350);

    return () => clearInterval(timer);
  }, [isLooping, previewSteps]);

  const currentFrame = previewSteps[previewStepIdx] || null;

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <Sparkles className="w-4 h-4 text-amber-400 mr-1.5 animate-pulse" />
          <span>Interactive Algorithm Learning Platform</span>
        </div>

        <h1 className="hero-title">
          D<span className="gradient-text">Algo</span>
        </h1>

        <p className="hero-subtitle">
          Visualize • Understand • Master Algorithms
        </p>

        <p className="hero-description">
          DAlgo is an interactive platform to visualize, understand, and learn algorithms. Watch every single comparison, swap, and recursion step happen in real time.
        </p>

        <div className="hero-cta-group">
          <button 
            onClick={() => onNavigate('visualizer')} 
            className="btn btn-lg btn-primary shadow-glow"
          >
            <Play className="w-5 h-5 mr-2" /> Start Visualizer
          </button>
          <button 
            onClick={() => onNavigate('algorithms')} 
            className="btn btn-lg btn-outline"
          >
            <BookOpen className="w-5 h-5 mr-2" /> Explore Algorithms
          </button>
        </div>

        {/* Live Interactive Preview Box */}
        <div className="hero-preview-wrapper">
          <div className="preview-header">
            <div className="preview-title font-semibold text-slate-200">
              <Zap className="w-4 h-4 text-amber-400 inline mr-1.5" />
              Live Animation Preview
            </div>
            <div className="preview-selector-pills">
              {['bubble-sort', 'quick-sort', 'merge-sort'].map((id) => (
                <button
                  key={id}
                  className={`pill-btn ${previewAlgo === id ? 'active' : ''}`}
                  onClick={() => setPreviewAlgo(id)}
                >
                  {ALGORITHMS.find(a => a.id === id)?.name}
                </button>
              ))}
            </div>
          </div>

          <div className="preview-bars-box">
            <ArrayBars 
              array={currentFrame ? currentFrame.array : previewArray} 
              currentStep={currentFrame}
              showValues={true}
            />
          </div>

          <div className="preview-footer">
            <div className="preview-explanation">
              <strong>Step {previewStepIdx + 1}/{previewSteps.length}:</strong> {currentFrame?.description || 'Sorting in progress...'}
            </div>
          </div>
        </div>
      </section>

      {/* Why Visualize Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Visualize Algorithms?</h2>
          <p className="section-subtitle">
            Reading pseudocode alone can be abstract. Visualizing operations builds intuitive mental models.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-box bg-blue-500/10 text-blue-400">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="feature-title">See Every Step</h3>
            <p className="feature-desc">
              Watch pointers shift, pivots separate array partitions, and elements swap in color-coded real time.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box bg-purple-500/10 text-purple-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="feature-title">Understand Complexity</h3>
            <p className="feature-desc">
              Compare O(n²) quadratic algorithms against O(n log n) divide-and-conquer methods visually.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box bg-emerald-500/10 text-emerald-400">
              <MousePointer className="w-6 h-6" />
            </div>
            <h3 className="feature-title">Learn Interactively</h3>
            <p className="feature-desc">
              Control playback speeds, pause at crucial steps, step backwards/forwards, or test your own custom arrays.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box bg-amber-500/10 text-amber-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="feature-title">Practice with Quizzes</h3>
            <p className="feature-desc">
              Reinforce your knowledge with interactive multiple-choice quizzes and detailed explanations.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Algorithms Showcase Grid */}
      <section className="catalog-preview-section">
        <div className="section-header">
          <h2 className="section-title">10 Essential Sorting Algorithms</h2>
          <p className="section-subtitle">Categorized from beginner foundations to advanced non-comparison algorithms</p>
        </div>

        <div className="categories-preview-grid">
          {['Beginner', 'Intermediate', 'Advanced'].map((cat) => (
            <div key={cat} className="category-column">
              <div className="category-col-header">
                <span className={`category-badge badge-${cat.toLowerCase()}`}>{cat}</span>
                <span className="category-count">{ALGORITHMS.filter(a => a.category === cat).length} Algorithms</span>
              </div>
              <ul className="category-item-list">
                {ALGORITHMS.filter(a => a.category === cat).map((algo) => (
                  <li 
                    key={algo.id}
                    className="category-item-row"
                    onClick={() => {
                      onSelectAlgorithm(algo.id);
                      onNavigate('algorithm-details');
                    }}
                  >
                    <div className="algo-item-info">
                      <span className="algo-item-name">{algo.name}</span>
                      <span className="algo-item-complexity">{algo.complexity.average}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
