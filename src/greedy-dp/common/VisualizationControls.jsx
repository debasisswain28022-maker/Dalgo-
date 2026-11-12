import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Sparkles,
  Gauge,
  CheckCircle2,
  Download,
  FileImage,
  Code2,
  ChevronDown,
  Info,
  Film
} from 'lucide-react';

export default function VisualizationControls({
  currentStepIdx,
  totalSteps,
  isPlaying,
  speed,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onReset,
  onStart,
  onSpeedChange,
  onStepSelect,
  samples = [],
  currentSampleName = '',
  onSelectSample,
  stepDescription = '',
  stepType = 'info',
  onExport
}) {
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setExportOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isStarted = currentStepIdx > 0;
  const isCompleted = totalSteps > 0 && currentStepIdx >= totalSteps - 1;

  // Type badge styling helper
  const getBadgeStyle = (type) => {
    switch (type) {
      case 'compare':
      case 'eval':
      case 'sort_compare':
      case 'eval_activity':
        return 'gdp-badge-amber';
      case 'swap':
      case 'merge':
      case 'sort_swap':
      case 'merge_nodes':
        return 'gdp-badge-purple';
      case 'select':
      case 'take_full':
      case 'match':
      case 'cell_match':
      case 'activity_selected':
      case 'select_first':
      case 'backtrack_match':
        return 'gdp-badge-emerald';
      case 'take_partial':
      case 'calc_ratio':
      case 'ratio_computed':
        return 'gdp-badge-cyan';
      case 'reject':
      case 'mismatch':
      case 'cell_mismatch':
      case 'activity_rejected':
      case 'knapsack_reject':
        return 'gdp-badge-rose';
      case 'complete':
      case 'tree_complete':
      case 'table_complete':
        return 'gdp-badge-emerald';
      default:
        return 'gdp-badge-blue';
    }
  };

  const handlePlayClick = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  return (
    <div className="gdp-controls-container">
      {/* Top Bar: Sample presets & Speed slider */}
      <div className="gdp-controls-top">
        {/* Sample Selectors */}
        {samples.length > 0 && (
          <div className="gdp-sample-group">
            <span className="gdp-sample-label">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Presets:</span>
            </span>
            <div className="gdp-sample-pills">
              {samples.map((sample) => (
                <button
                  key={sample.name}
                  onClick={() => onSelectSample(sample)}
                  className={`gdp-sample-pill ${currentSampleName === sample.name ? 'active' : ''}`}
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Speed Controls with Presets & Slider */}
        <div className="gdp-speed-group">
          <Gauge className="w-4 h-4 text-indigo-400" />
          <span className="gdp-speed-label">Speed:</span>
          
          <div className="flex items-center gap-1">
            {[
              { label: '0.5x', val: 1200 },
              { label: '1x', val: 600 },
              { label: '2x', val: 300 },
              { label: '4x', val: 120 }
            ].map(preset => (
              <button
                key={preset.label}
                onClick={() => onSpeedChange(preset.val)}
                className={`px-2 py-0.5 rounded text-xs font-mono font-semibold transition-colors ${
                  speed === preset.val 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <input
            type="range"
            min="80"
            max="1500"
            step="40"
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="gdp-speed-slider"
            title={`${speed}ms delay`}
          />
          <span className="gdp-speed-val">
            {speed}ms
          </span>
        </div>
      </div>

      {/* Main Buttons Bar */}
      <div className="gdp-controls-main">
        <div className="gdp-btn-group">
          {/* 1. Start Button: Starts or restarts from beginning */}
          <button
            onClick={onStart}
            className="gdp-btn gdp-btn-primary"
            title="Start algorithm visualization from beginning"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start</span>
          </button>

          {/* 2. Previous Step */}
          <button
            onClick={onPrev}
            disabled={currentStepIdx <= 0}
            className="gdp-btn gdp-btn-secondary"
            title="Step back to previous state (←)"
          >
            <SkipBack className="w-4 h-4" />
            <span>Prev Step</span>
          </button>

          {/* 3. Play / Pause Button */}
          {isPlaying ? (
            <button
              onClick={handlePlayClick}
              className="gdp-btn gdp-btn-warning"
              title="Pause automatic playback (Space)"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={handlePlayClick}
              className="gdp-btn gdp-btn-success"
              title="Auto-play all steps (Space)"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isCompleted ? 'Replay' : 'Play'}</span>
            </button>
          )}

          {/* 4. Next Step */}
          <button
            onClick={onNext}
            className="gdp-btn gdp-btn-secondary"
            title="Advance one step (→)"
          >
            <span>Next Step</span>
            <SkipForward className="w-4 h-4" />
          </button>

          {/* 5. Reset Button */}
          <button
            onClick={onReset}
            className="gdp-btn gdp-btn-outline"
            title="Reset to initial state (R)"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>

          {/* 6. Skip to Result Button */}
          {totalSteps > 1 && (
            <button
              onClick={() => {
                onStepSelect(totalSteps - 1);
              }}
              className="gdp-btn gdp-btn-outline border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10"
              title="Jump directly to final result"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Result</span>
            </button>
          )}

          {/* 7. Export Diagram Dropdown */}
          <div className="relative inline-block" ref={exportRef}>
            <button
              onClick={() => setExportOpen(prev => !prev)}
              className="gdp-btn gdp-btn-outline border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10"
              title="Export visualization as PNG or SVG diagram"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export</span>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
            </button>

            {exportOpen && (
              <div className="gdp-export-dropdown-menu" style={{ width: 250, padding: '0.45rem' }}>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Full Execution Trace
                </div>
                <button
                  onClick={() => {
                    setExportOpen(false);
                    if (onExport) onExport('all_png');
                  }}
                  className="gdp-export-item"
                >
                  <Film className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-bold text-slate-200 text-xs">All Steps Storyboard (PNG)</div>
                    <div className="text-[11px] text-slate-400">Complete multi-step diagram (.png)</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setExportOpen(false);
                    if (onExport) onExport('all_svg');
                  }}
                  className="gdp-export-item"
                >
                  <Code2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-bold text-slate-200 text-xs">All Steps Storyboard (SVG)</div>
                    <div className="text-[11px] text-slate-400">Scalable vector diagram (.svg)</div>
                  </div>
                </button>

                <div className="border-t border-slate-800 my-1"></div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Single Snapshot
                </div>
                <button
                  onClick={() => {
                    setExportOpen(false);
                    if (onExport) onExport('single_png');
                  }}
                  className="gdp-export-item"
                >
                  <FileImage className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-bold text-slate-200 text-xs">Current Frame (PNG)</div>
                    <div className="text-[11px] text-slate-400">Active visualization screen (.png)</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setExportOpen(false);
                    if (onExport) onExport('single_svg');
                  }}
                  className="gdp-export-item"
                >
                  <Code2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-bold text-slate-200 text-xs">Current Frame (SVG)</div>
                    <div className="text-[11px] text-slate-400">Vector snapshot (.svg)</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Step Indicator & Keyboard Hints */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <span>Keys:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Space</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">←</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">→</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">R</kbd>
          </div>

          <div className="gdp-step-counter">
            <span className="gdp-step-current">
              {totalSteps > 0 ? currentStepIdx + 1 : 0}
            </span>
            <span className="gdp-step-slash">/</span>
            <span className="gdp-step-total">{totalSteps}</span>
            <span className="gdp-step-text">Steps</span>
          </div>
        </div>
      </div>

      {/* Scrubber Progress Track */}
      {totalSteps > 1 && (
        <div className="gdp-scrubber-track">
          <input
            type="range"
            min="0"
            max={totalSteps - 1}
            value={currentStepIdx}
            onChange={(e) => onStepSelect(Number(e.target.value))}
            className="gdp-scrubber-input"
          />
        </div>
      )}

      {/* Step Description Banner */}
      <div className={`gdp-step-banner ${getBadgeStyle(stepType)}`}>
        <div className="gdp-banner-icon">
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <Info className="w-5 h-5 text-indigo-400" />
          )}
        </div>
        <div className="gdp-banner-content">
          <div className="gdp-banner-header">
            <span className="gdp-banner-badge">{stepType.toUpperCase().replace(/_/g, ' ')}</span>
            <span className="gdp-banner-progress">
              {isCompleted ? 'Optimal Solution Reached' : `Step ${currentStepIdx + 1} of ${totalSteps}`}
            </span>
          </div>
          <p className="gdp-banner-desc">
            {stepDescription || 'Click Start or Next Step to begin the visual walkthrough.'}
          </p>
        </div>
      </div>
    </div>
  );
}
