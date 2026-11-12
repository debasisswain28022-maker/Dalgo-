import React, { useState, useEffect, useMemo } from 'react';
import VisualizationControls from '../common/VisualizationControls';
import AlgorithmExecutionPanel from '../common/AlgorithmExecutionPanel';
import { generateLcsSteps } from './logic';
import {
  Grid,
  Sparkles,
  GitCommit
} from 'lucide-react';

const SAMPLES = [
  {
    name: 'Prompt Example (ABCDGH vs AEDFHR)',
    s1: 'ABCDGH',
    s2: 'AEDFHR'
  },
  {
    name: 'DNA Sequences (AGGTAB vs GXTXAYB)',
    s1: 'AGGTAB',
    s2: 'GXTXAYB'
  },
  {
    name: 'Substrings (LONGEST vs STONE)',
    s1: 'LONGEST',
    s2: 'STONE'
  },
  {
    name: 'Classic (ALGORITHM vs LOGARITHM)',
    s1: 'ALGORITHM',
    s2: 'LOGARITHM'
  }
];

export default function LcsVisualizer() {
  const [selectedSampleName, setSelectedSampleName] = useState(SAMPLES[0].name);
  const [s1, setS1] = useState('ABCDGH');
  const [s2, setS2] = useState('AEDFHR');

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(250);

  // Generate steps
  const { steps } = useMemo(() => {
    return generateLcsSteps(s1, s2);
  }, [s1, s2]);

  const currentFrame = steps[currentStepIdx] || steps[0];

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStepIdx >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStepIdx((prev) => Math.min(prev + 1, steps.length - 1));
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIdx, steps.length, speed]);

  // Sample selector
  const handleSelectSample = (sample) => {
    setIsPlaying(false);
    setSelectedSampleName(sample.name);
    setS1(sample.s1);
    setS2(sample.s2);
    setCurrentStepIdx(0);
  };

  // Controls
  const handlePlay = () => {
    if (currentStepIdx >= steps.length - 1) {
      setCurrentStepIdx(0);
    }
    setIsPlaying(true);
  };

  const handleStart = () => {
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepIdx >= steps.length - 1) {
      setCurrentStepIdx(0);
    } else {
      setCurrentStepIdx((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStepIdx((prev) => Math.max(prev - 1, 0));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        document.activeElement && (
          document.activeElement.tagName === 'INPUT' ||
          document.activeElement.tagName === 'TEXTAREA' ||
          document.activeElement.tagName === 'SELECT'
        )
      ) return;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => {
          if (!prev && currentStepIdx >= steps.length - 1) {
            setCurrentStepIdx(0);
            return true;
          }
          return !prev;
        });
      } else if (e.key === 'ArrowRight' || e.code === 'ArrowRight') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIdx((prev) => Math.min(prev + 1, steps.length - 1));
      } else if (e.key === 'ArrowLeft' || e.code === 'ArrowLeft') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIdx((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'r' || e.key === 'R' || e.code === 'KeyR') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIdx(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIdx, steps.length]);

  // Cell state resolver
  const getCellClass = (r, c) => {
    const active = currentFrame.activeCell;
    const isCurrent = active && active[0] === r && active[1] === c;
    const isReferenced = currentFrame.referencedCells?.some(([cr, cc]) => cr === r && cc === c);
    const isPath = currentFrame.backtrackPath?.some(([pr, pc]) => pr === r && pc === c);
    const isMatched = currentFrame.matchedCell && currentFrame.matchedCell[0] === r && currentFrame.matchedCell[1] === c;

    if (isPath) return 'gdp-cell-path';
    if (isCurrent) return 'gdp-cell-active';
    if (isMatched) return 'gdp-cell-match';
    if (isReferenced) return 'gdp-cell-referenced';
    if (r === 0 || c === 0) return 'gdp-cell-base';
    return '';
  };

  const m = currentFrame.s1.length;
  const n = currentFrame.s2.length;

  return (
    <div className="gdp-vis-wrapper">
      {/* String Configuration Card */}
      <div className="gdp-config-card">
        <div className="gdp-config-header">
          <div className="gdp-config-title">
            <Grid className="w-5 h-5 text-indigo-400" />
            <span>LCS Input Strings Configuration</span>
          </div>
          <div className="text-xs text-slate-400">
            Compare any two strings (maximum recommended 10–12 characters for optimal matrix readability).
          </div>
        </div>

        <div className="gdp-lcs-inputs-grid">
          <div className="gdp-lcs-input-group">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              String 1 (Rows / Vertical):
            </label>
            <input
              type="text"
              maxLength={12}
              value={s1}
              onChange={(e) => {
                setIsPlaying(false);
                setS1(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''));
                setCurrentStepIdx(0);
              }}
              className="gdp-input font-mono font-bold tracking-widest text-indigo-300 text-lg"
              placeholder="e.g. ABCDGH"
            />
          </div>

          <div className="gdp-lcs-input-group">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              String 2 (Columns / Horizontal):
            </label>
            <input
              type="text"
              maxLength={12}
              value={s2}
              onChange={(e) => {
                setIsPlaying(false);
                setS2(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''));
                setCurrentStepIdx(0);
              }}
              className="gdp-input font-mono font-bold tracking-widest text-cyan-300 text-lg"
              placeholder="e.g. AEDFHR"
            />
          </div>
        </div>
      </div>

      {/* Common Controls */}
      <VisualizationControls
        currentStepIdx={currentStepIdx}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        speed={speed}
        onPlay={handlePlay}
        onPause={() => setIsPlaying(false)}
        onNext={handleNext}
        onPrev={handlePrev}
        onReset={handleReset}
        onStart={handleStart}
        onSpeedChange={setSpeed}
        onStepSelect={(idx) => {
          setIsPlaying(false);
          setCurrentStepIdx(idx);
        }}
        samples={SAMPLES}
        currentSampleName={selectedSampleName}
        onSelectSample={handleSelectSample}
        stepDescription={currentFrame.description}
        stepType={currentFrame.type}
      />

      {/* Main Dynamic Programming Stage */}
      <div className="gdp-stage-grid">
        {/* Left Side: 2D Matrix View */}
        <div className="gdp-stage-card">
          <div className="gdp-stage-card-title">
            <Grid className="w-4 h-4 text-cyan-400" />
            <span>2D Dynamic Programming Table (DP Matrix)</span>
          </div>

          {/* Matrix Formula Bar */}
          <div className="gdp-matrix-formula-bar">
            <Sparkles className="w-4 h-4 text-amber-400 mr-2 flex-shrink-0" />
            <span className="font-mono text-xs text-slate-200">
              {currentFrame.formulaText}
            </span>
          </div>

          {/* 2D Matrix Table */}
          <div className="gdp-matrix-wrapper">
            <table className="gdp-matrix-table">
              <thead>
                {/* Header Row: Indices & String 2 chars */}
                <tr>
                  <th className="gdp-th-corner">i \ j</th>
                  <th className="gdp-th-char gdp-th-empty">Ø (0)</th>
                  {currentFrame.s2.split('').map((char, j) => {
                    const isColActive = currentFrame.activeCell && currentFrame.activeCell[1] === j + 1;
                    return (
                      <th
                        key={j}
                        className={`gdp-th-char ${isColActive ? 'th-char-active' : ''}`}
                      >
                        <div className="text-xs font-normal text-slate-400">{j + 1}</div>
                        <div className="text-cyan-300 font-bold">{char}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {/* Row 0: Empty prefix Ø */}
                <tr>
                  <th className="gdp-th-row-char gdp-th-empty">
                    <span>Ø</span>
                    <span className="text-xs font-normal text-slate-400 ml-1">0</span>
                  </th>
                  {Array.from({ length: n + 1 }, (_, c) => {
                    const cellVal = currentFrame.dp[0][c];
                    const cellClass = getCellClass(0, c);
                    return (
                      <td key={c} className={`gdp-matrix-cell ${cellClass}`}>
                        {cellVal !== null ? cellVal : ''}
                      </td>
                    );
                  })}
                </tr>

                {/* Rows 1..m */}
                {currentFrame.s1.split('').map((char1, r) => {
                  const rowIndex = r + 1;
                  const isRowActive = currentFrame.activeCell && currentFrame.activeCell[0] === rowIndex;
                  return (
                    <tr key={rowIndex}>
                      <th className={`gdp-th-row-char ${isRowActive ? 'th-char-active' : ''}`}>
                        <span className="text-indigo-300 font-bold">{char1}</span>
                        <span className="text-xs font-normal text-slate-400 ml-1">{rowIndex}</span>
                      </th>
                      {Array.from({ length: n + 1 }, (_, c) => {
                        const cellVal = currentFrame.dp[rowIndex][c];
                        const cellClass = getCellClass(rowIndex, c);
                        return (
                          <td key={c} className={`gdp-matrix-cell ${cellClass}`}>
                            {cellVal !== null ? (
                              <span className="gdp-cell-val animate-popIn">{cellVal}</span>
                            ) : (
                              <span className="text-slate-600">·</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Matrix Legend */}
          <div className="gdp-matrix-legend">
            <div className="gdp-legend-item">
              <span className="gdp-legend-box gdp-box-active"></span>
              <span>Current Cell DP[i][j]</span>
            </div>
            <div className="gdp-legend-item">
              <span className="gdp-legend-box gdp-box-ref"></span>
              <span>Referenced (Diagonal / Top / Left)</span>
            </div>
            <div className="gdp-legend-item">
              <span className="gdp-legend-box gdp-box-path"></span>
              <span>Backtracking Optimal LCS Path</span>
            </div>
            <div className="gdp-legend-item">
              <span className="gdp-legend-box gdp-box-base"></span>
              <span>Base Case Zeros</span>
            </div>
          </div>
        </div>

        {/* Right Side: Backtracking Path & Results */}
        <div className="gdp-stage-card">
          <div className="gdp-stage-card-title">
            <GitCommit className="w-4 h-4 text-emerald-400" />
            <span>Subsequence Results & Reconstruction</span>
          </div>

          {/* Result Dashboard */}
          <div className="gdp-knapsack-metrics">
            <div className="gdp-metric-card">
              <div className="gdp-metric-label">String 1 Length</div>
              <div className="gdp-metric-val text-indigo-400">{m} chars</div>
            </div>
            <div className="gdp-metric-card">
              <div className="gdp-metric-label">String 2 Length</div>
              <div className="gdp-metric-val text-cyan-400">{n} chars</div>
            </div>
            <div className="gdp-metric-card">
              <div className="gdp-metric-label">LCS Length</div>
              <div className="gdp-metric-val text-emerald-400">
                {currentFrame.dp[m][n] !== null ? currentFrame.dp[m][n] : '...'}
              </div>
            </div>
            <div className="gdp-metric-card">
              <div className="gdp-metric-label">Subproblems Solved</div>
              <div className="gdp-metric-val text-amber-400">
                {(m + 1) * (n + 1)}
              </div>
            </div>
          </div>

          {/* Subsequence Display Banner */}
          <div className="gdp-lcs-result-banner">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Reconstructed Longest Common Subsequence:
            </div>
            <div className="gdp-lcs-chars-display">
              {currentFrame.lcsString ? (
                currentFrame.lcsString.split('').map((char, idx) => (
                  <span key={idx} className="gdp-lcs-char-token animate-popIn">
                    {char}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 italic text-sm">
                  {currentFrame.type.includes('backtrack') || currentFrame.type === 'complete'
                    ? 'Reconstructing...'
                    : 'Awaiting Backtracking Phase'}
                </span>
              )}
            </div>
          </div>

          {/* Backtracking Steps Log */}
          <div className="gdp-backtrack-log-container">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Backtracking Path Steps:
            </div>
            <div className="gdp-backtrack-log-list">
              {currentFrame.backtrackPath.length > 0 ? (
                currentFrame.backtrackPath.map(([r, c], idx) => {
                  const isMatch = r > 0 && c > 0 && currentFrame.s1[r - 1] === currentFrame.s2[c - 1];
                  return (
                    <div
                      key={idx}
                      className={`gdp-backtrack-log-item ${isMatch ? 'log-match' : 'log-step'}`}
                    >
                      <span className="font-mono text-xs font-bold text-slate-300">
                        Step {idx + 1}: Cell ({r}, {c})
                      </span>
                      {isMatch ? (
                        <span className="text-xs text-emerald-300 font-bold ml-2">
                          Match '{currentFrame.s1[r - 1]}' ⟹ Added to LCS
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 ml-2">
                          Value = {currentFrame.dp[r][c]}
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-slate-500 italic">
                  Backtracking begins after all matrix cells are filled.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Live Algorithm Execution & Pseudocode Panel */}
      <AlgorithmExecutionPanel
        algoId="longest-common-subsequence"
        currentStep={currentFrame}
      />
    </div>
  );
}
