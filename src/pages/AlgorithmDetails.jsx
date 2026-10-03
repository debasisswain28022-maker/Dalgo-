import React, { useState, useEffect } from 'react';
import { ALGORITHMS } from '../data/algorithms';
import ArrayBars from '../components/ArrayBars';
import CodeViewer from '../components/CodeViewer';
import Quiz from '../components/Quiz';
import { runSortingAlgorithm } from '../algorithms';
import MergeSortVisualizer from '../components/MergeSortVisualizer';
import QuickSortVisualizer from '../components/QuickSortVisualizer';
import HeapSortVisualizer from '../components/HeapSortVisualizer';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Clock, HardDrive, ShieldCheck, ShieldAlert, Check, X, ArrowLeft, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function AlgorithmDetails({ algorithmId, onNavigate, onSelectAlgorithm }) {
  const algo = ALGORITHMS.find(a => a.id === algorithmId) || ALGORITHMS[0];

  // Internal Visualizer State for the detail page
  const [array, setArray] = useState([4, 10, 3, 5, 1]);
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  const [pivotStrategy, setPivotStrategy] = useState('last');

  useEffect(() => {
    const res = runSortingAlgorithm(algo.id, array, { pivotStrategy });
    setSteps(res.steps);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [algo.id, array, pivotStrategy]);

  // Global Keyboard Shortcuts (Space: Play/Pause, ArrowRight: Next, ArrowLeft: Prev, R: Reset)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        document.activeElement && (
          document.activeElement.tagName === 'INPUT' ||
          document.activeElement.tagName === 'TEXTAREA' ||
          document.activeElement.tagName === 'SELECT' ||
          document.activeElement.isContentEditable
        )
      ) {
        return;
      }

      const key = e.key;
      const code = e.code;

      if (key === ' ' || key === 'Spacebar' || code === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => {
          if (!prev && currentStepIdx >= steps.length - 1) {
            setCurrentStepIdx(0);
            return true;
          }
          return !prev;
        });
      } else if (key === 'ArrowRight' || code === 'ArrowRight') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIdx(prev => {
          if (prev >= steps.length - 1) return 0;
          return Math.min(steps.length - 1, prev + 1);
        });
      } else if (key === 'ArrowLeft' || code === 'ArrowLeft') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIdx(prev => Math.max(0, prev - 1));
      } else if (key === 'r' || key === 'R' || code === 'KeyR') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIdx(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [steps.length, currentStepIdx]);

  // Playback timer effect
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;

    if (currentStepIdx >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStepIdx(prev => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIdx, steps, speed]);

  const currentFrame = steps[currentStepIdx] || null;
  const isCompleted = currentStepIdx >= steps.length - 1 && steps.length > 0;

  const handleReset = () => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  const handleGenerateNew = () => {
    const newArr = Array.from({ length: 5 }, () => Math.floor(Math.random() * 85) + 10);
    setArray(newArr);
  };

  return (
    <div className="algorithm-details-container">
      {/* Back Button */}
      <button onClick={() => onNavigate('algorithms')} className="back-link-btn">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Catalog
      </button>

      {/* A. Algorithm Header */}
      <div className="details-header-card">
        <div className="header-meta-row">
          <span className={`category-badge badge-${algo.category.toLowerCase()}`}>
            {algo.category}
          </span>
          {algo.stable ? (
            <span className="meta-tag tag-stable"><ShieldCheck className="w-3.5 h-3.5 inline mr-1" /> Stable</span>
          ) : (
            <span className="meta-tag tag-unstable"><ShieldAlert className="w-3.5 h-3.5 inline mr-1" /> Unstable</span>
          )}
          {algo.inPlace && <span className="meta-tag tag-inplace">In-Place</span>}
        </div>

        <h1 className="details-title">{algo.name}</h1>
        <p className="details-tagline">{algo.tagline}</p>
      </div>

      {/* B. Definition & Short Overview */}
      <section className="details-section">
        <h2 className="section-heading">Definition & Overview</h2>
        <div className="details-card-box">
          <p className="details-text">{algo.definition}</p>
        </div>
      </section>

      {/* C. How It Works */}
      <section className="details-section">
        <h2 className="section-heading">How It Works</h2>
        <div className="details-card-box">
          <ol className="how-it-works-list">
            {algo.howItWorks.map((stepText, idx) => (
              <li key={idx} className="how-step-item">
                <span className="how-step-num">{idx + 1}</span>
                <span className="how-step-text">{stepText}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* D. Interactive Visualization Player */}
      <section className="details-section">
        <h2 className="section-heading">Interactive Step-by-Step Visualizer</h2>
        <div className="embedded-visualizer-card">
          <div className="embedded-controls-bar">
            <button onClick={handleGenerateNew} className="btn btn-sm btn-outline">
              New Array
            </button>
            <div className="btn-group-primary">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`btn btn-sm ${isPlaying ? 'btn-warning' : 'btn-primary'}`}
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                {isPlaying ? 'Pause' : 'Start'}
              </button>
              <button 
                onClick={() => setCurrentStepIdx(p => Math.max(0, p - 1))}
                disabled={isPlaying || currentStepIdx === 0}
                className="btn btn-sm btn-icon"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentStepIdx(p => Math.min(steps.length - 1, p + 1))}
                disabled={isPlaying || currentStepIdx >= steps.length - 1}
                className="btn btn-sm btn-icon"
              >
                <SkipForward className="w-4 h-4" />
              </button>
              <button onClick={handleReset} className="btn btn-sm btn-icon">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            <button 
              onClick={() => {
                onSelectAlgorithm(algo.id);
                onNavigate('visualizer');
              }}
              className="btn btn-sm btn-accent"
            >
              Full Visualizer
            </button>
          </div>

          <div className="embedded-bars-area">
            {algo.id === 'heap-sort' ? (
              <HeapSortVisualizer 
                currentStep={currentFrame}
                originalArray={array}
              />
            ) : algo.id === 'quick-sort' ? (
              <QuickSortVisualizer 
                currentStep={currentFrame}
                pivotStrategy={pivotStrategy}
                onPivotStrategyChange={setPivotStrategy}
                originalArray={array}
              />
            ) : algo.id === 'merge-sort' ? (
              <MergeSortVisualizer 
                array={currentFrame ? currentFrame.arraySnapshot : array}
                currentStep={currentFrame}
              />
            ) : (
              <ArrayBars 
                array={currentFrame ? currentFrame.array : array} 
                currentStep={currentFrame}
                showValues={true}
              />
            )}
          </div>

          <div className="embedded-step-info">
            <span className="step-badge">Step {currentStepIdx + 1} / {steps.length}</span>
            <span className="step-desc-text">{currentFrame?.description || 'Ready to start'}</span>
          </div>
        </div>
      </section>

      {/* E. Code Implementation */}
      <section className="details-section">
        <h2 className="section-heading">Algorithm Implementation</h2>
        <CodeViewer 
          pseudocode={algo.pseudocode}
          javascriptCode={algo.javascriptCode}
        />
      </section>

      {/* F. Time & Space Complexity */}
      <section className="details-section">
        <h2 className="section-heading">Complexity Analysis</h2>
        <div className="complexity-cards-grid">
          <div className="comp-card">
            <Clock className="comp-icon text-emerald-400" />
            <span className="comp-label">Best Time</span>
            <span className="comp-value font-mono text-emerald-400">{algo.complexity.best}</span>
          </div>

          <div className="comp-card">
            <Clock className="comp-icon text-amber-400" />
            <span className="comp-label">Average Time</span>
            <span className="comp-value font-mono text-amber-400">{algo.complexity.average}</span>
          </div>

          <div className="comp-card">
            <Clock className="comp-icon text-rose-400" />
            <span className="comp-label">Worst Time</span>
            <span className="comp-value font-mono text-rose-400">{algo.complexity.worst}</span>
          </div>

          <div className="comp-card">
            <HardDrive className="comp-icon text-cyan-400" />
            <span className="comp-label">Space Complexity</span>
            <span className="comp-value font-mono text-cyan-400">{algo.complexity.space}</span>
          </div>
        </div>
      </section>

      {/* G. Advantages & Disadvantages */}
      <section className="details-section">
        <h2 className="section-heading">Pros & Cons</h2>
        <div className="pros-cons-grid">
          <div className="pros-card">
            <h3 className="pros-title"><ThumbsUp className="w-4 h-4 text-emerald-400 inline mr-2" /> Advantages</h3>
            <ul className="pros-list">
              {algo.advantages.map((adv, i) => (
                <li key={i}><Check className="w-4 h-4 text-emerald-400 inline mr-2 flex-shrink-0" /> {adv}</li>
              ))}
            </ul>
          </div>

          <div className="cons-card">
            <h3 className="cons-title"><ThumbsDown className="w-4 h-4 text-rose-400 inline mr-2" /> Disadvantages</h3>
            <ul className="cons-list">
              {algo.disadvantages.map((dis, i) => (
                <li key={i}><X className="w-4 h-4 text-rose-400 inline mr-2 flex-shrink-0" /> {dis}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* H. Quick Quiz */}
      <section className="details-section">
        <h2 className="section-heading">Test Your Understanding</h2>
        <Quiz filterAlgorithmId={algo.id} />
      </section>
    </div>
  );
}
