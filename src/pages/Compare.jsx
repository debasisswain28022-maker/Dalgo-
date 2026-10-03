import React, { useState, useEffect } from 'react';
import { ALGORITHMS } from '../data/algorithms';
import ComplexityTable from '../components/ComplexityTable';
import ArrayBars from '../components/ArrayBars';
import { runSortingAlgorithm } from '../algorithms';
import { Play, Pause, RotateCcw, Shuffle, GitCompare, Zap, CheckCircle2, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function Compare({ onSelectAlgorithm, onNavigate }) {
  // Selected algorithm IDs for side-by-side benchmarking (default: Merge Sort vs Quick Sort vs Heap Sort)
  const [selectedAlgoIds, setSelectedAlgoIds] = useState(['merge-sort', 'quick-sort', 'heap-sort']);
  
  // Shared benchmark array
  const [benchmarkSize, setBenchmarkSize] = useState(25);
  const [sharedArray, setSharedArray] = useState([]);
  
  // Benchmark runners state: { algoId: { steps: [], currentIdx: 0, isDone: false } }
  const [runnerState, setRunnerState] = useState({});
  const [isComparing, setIsComparing] = useState(false);
  const [speed, setSpeed] = useState(150);

  // Generate new shared array
  const generateNewSharedArray = (size = benchmarkSize) => {
    const newArr = Array.from({ length: size }, () => Math.floor(Math.random() * 85) + 10);
    setSharedArray(newArr);
    setIsComparing(false);
  };

  useEffect(() => {
    generateNewSharedArray(benchmarkSize);
  }, [benchmarkSize]);

  // Compute steps for all selected algorithms whenever array or selection changes
  useEffect(() => {
    if (sharedArray.length === 0) return;

    const newState = {};
    selectedAlgoIds.forEach(id => {
      const { steps } = runSortingAlgorithm(id, sharedArray);
      newState[id] = {
        steps,
        currentIdx: 0,
        isDone: false
      };
    });

    setRunnerState(newState);
    setIsComparing(false);
  }, [selectedAlgoIds, sharedArray]);

  // Simultaneous animation loop
  useEffect(() => {
    if (!isComparing) return;

    let allDone = true;

    const timer = setTimeout(() => {
      setRunnerState(prev => {
        const nextState = { ...prev };

        Object.keys(nextState).forEach(id => {
          const runner = nextState[id];
          if (runner.currentIdx < runner.steps.length - 1) {
            runner.currentIdx++;
            allDone = false;
          } else {
            runner.isDone = true;
          }
        });

        if (allDone) {
          setIsComparing(false);
        }

        return { ...nextState };
      });
    }, speed);

    return () => clearTimeout(timer);
  }, [isComparing, runnerState, speed]);

  const toggleAlgoSelection = (id) => {
    if (selectedAlgoIds.includes(id)) {
      if (selectedAlgoIds.length > 2) {
        setSelectedAlgoIds(selectedAlgoIds.filter(item => item !== id));
      }
    } else {
      if (selectedAlgoIds.length < 4) {
        setSelectedAlgoIds([...selectedAlgoIds, id]);
      }
    }
  };

  const handleReset = () => {
    setIsComparing(false);
    setRunnerState(prev => {
      const reset = { ...prev };
      Object.keys(reset).forEach(id => {
        reset[id] = { ...reset[id], currentIdx: 0, isDone: false };
      });
      return reset;
    });
  };

  return (
    <div className="compare-page-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Algorithm Comparison Matrix</h1>
        <p className="page-subtitle">
          Compare theoretical complexity stats and run side-by-side simultaneous sorting benchmarks on identical array data.
        </p>
      </div>

      {/* 1. Multi-Runner Benchmark Section */}
      <section className="compare-section">
        <div className="section-header">
          <h2 className="section-title">
            <GitCompare className="w-5 h-5 text-indigo-400 inline mr-2" />
            Side-by-Side Simultaneous Execution Benchmark
          </h2>
          <p className="section-subtitle">Select up to 4 algorithms to execute concurrently on the exact same array.</p>
        </div>

        {/* Algorithm Selector Pills */}
        <div className="compare-algo-selector">
          <span className="selector-label">Select Algorithms (2-4):</span>
          <div className="algo-pills-row">
            {ALGORITHMS.map(a => {
              const isSelected = selectedAlgoIds.includes(a.id);
              return (
                <button
                  key={a.id}
                  className={`compare-pill ${isSelected ? 'active' : ''}`}
                  onClick={() => toggleAlgoSelection(a.id)}
                >
                  {a.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Benchmark Toolbar */}
        <div className="benchmark-toolbar">
          <button onClick={() => generateNewSharedArray()} className="btn btn-secondary">
            <Shuffle className="w-4 h-4 mr-1.5" /> Generate Shared Array
          </button>

          <button 
            onClick={() => setIsComparing(!isComparing)}
            className={`btn ${isComparing ? 'btn-warning' : 'btn-primary'}`}
          >
            {isComparing ? <Pause className="w-4 h-4 mr-1.5" /> : <Play className="w-4 h-4 mr-1.5" />}
            {isComparing ? 'Pause All' : 'Run Benchmark'}
          </button>

          <button onClick={handleReset} className="btn btn-icon">
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="benchmark-size-slider">
            <span className="text-xs font-semibold text-slate-300">Size: {benchmarkSize}</span>
            <input 
              type="range"
              min="10"
              max="50"
              value={benchmarkSize}
              onChange={(e) => setBenchmarkSize(Number(e.target.value))}
              className="range-slider"
            />
          </div>
        </div>

        {/* Simultaneous Bars Grid */}
        <div className="benchmark-grid">
          {selectedAlgoIds.map(id => {
            const algo = ALGORITHMS.find(a => a.id === id);
            const runner = runnerState[id];
            const currentFrame = runner?.steps[runner.currentIdx] || null;

            // Calculate live comparisons & swaps
            let comps = 0;
            let swaps = 0;
            if (runner && runner.steps) {
              for (let i = 0; i <= runner.currentIdx && i < runner.steps.length; i++) {
                if (runner.steps[i].type === 'compare') comps++;
                if (['swap', 'heap_swap', 'shift', 'overwrite'].includes(runner.steps[i].type)) swaps++;
              }
            }

            return (
              <div key={id} className="benchmark-card">
                <div className="benchmark-card-header">
                  <h3 className="card-algo-title">{algo.name}</h3>
                  <span className={`category-badge badge-${algo.category.toLowerCase()}`}>
                    {algo.category}
                  </span>
                </div>

                <div className="benchmark-bars-area">
                  <ArrayBars 
                    array={currentFrame ? currentFrame.array : sharedArray}
                    currentStep={currentFrame}
                    showValues={benchmarkSize <= 30}
                  />
                </div>

                {/* Runner Stats */}
                <div className="runner-stats-row">
                  <div className="runner-stat">
                    <span className="stat-name">Comparisons</span>
                    <span className="stat-val text-amber-400">{comps}</span>
                  </div>
                  <div className="runner-stat">
                    <span className="stat-name">Swaps / Writes</span>
                    <span className="stat-val text-rose-400">{swaps}</span>
                  </div>
                  <div className="runner-stat">
                    <span className="stat-name">Total Steps</span>
                    <span className="stat-val text-cyan-400">{runner?.steps?.length || 0}</span>
                  </div>
                </div>

                {runner?.isDone && (
                  <div className="runner-completed-badge font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 inline mr-1" /> Finished in {runner.steps.length} steps!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Side-by-Side Metadata Feature Matrix */}
      <section className="compare-section">
        <div className="section-header">
          <h2 className="section-title">Technique & Use-Case Comparison</h2>
        </div>

        <div className="feature-matrix-grid">
          {selectedAlgoIds.map(id => {
            const algo = ALGORITHMS.find(a => a.id === id);
            return (
              <div key={id} className="matrix-card">
                <h3 className="matrix-title">{algo.name}</h3>
                
                <div className="matrix-row">
                  <span className="matrix-label">Avg Complexity</span>
                  <span className="matrix-val font-mono text-amber-400 font-bold">{algo.complexity.average}</span>
                </div>

                <div className="matrix-row">
                  <span className="matrix-label">Space Complexity</span>
                  <span className="matrix-val font-mono text-cyan-400">{algo.complexity.space}</span>
                </div>

                <div className="matrix-row">
                  <span className="matrix-label">Stability</span>
                  <span className="matrix-val">
                    {algo.stable ? (
                      <span className="text-emerald-400 font-medium"><ShieldCheck className="w-3.5 h-3.5 inline mr-1" /> Stable</span>
                    ) : (
                      <span className="text-rose-400 font-medium"><ShieldAlert className="w-3.5 h-3.5 inline mr-1" /> Unstable</span>
                    )}
                  </span>
                </div>

                <div className="matrix-row">
                  <span className="matrix-label">In-Place</span>
                  <span className="matrix-val font-medium">{algo.inPlace ? 'Yes' : 'No'}</span>
                </div>

                <div className="matrix-row">
                  <span className="matrix-label">Technique</span>
                  <span className="matrix-val text-slate-300">{algo.technique}</span>
                </div>

                <div className="matrix-row usecase-row">
                  <span className="matrix-label">Best Use Case</span>
                  <p className="matrix-usecase-text">{algo.bestUseCase}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Global Complexity Table */}
      <section className="compare-section">
        <ComplexityTable 
          onSelectAlgorithm={(id) => {
            onSelectAlgorithm(id);
            onNavigate('algorithm-details');
          }}
          onVisualizeAlgorithm={(id) => {
            onSelectAlgorithm(id);
            onNavigate('visualizer');
          }}
        />
      </section>
    </div>
  );
}
