import React, { useState, useRef, useEffect } from 'react';
import {
  Play, Pause, SkipForward, SkipBack, RotateCcw, Shuffle,
  Volume2, VolumeX, Settings, X, Sun, Moon, ChevronDown,
  Download, FileImage, Code2, Film, Sparkles, ArrowUpDown
} from 'lucide-react';
import { ALGORITHMS } from '../data/algorithms';
import { GREEDY_DP_ALGORITHMS } from '../greedy-dp/data/algorithmsData';
import { MORE_SORTING_ALGORITHMS, DIVIDE_AND_CONQUER_ALGORITHMS, OTHER_MORE_ALGORITHMS } from '../data/moreAlgorithms';
import MoreAlgorithmsModal from './MoreAlgorithmsModal';

const QUICK_SORT_ALGOS = [
  { id: 'bubble-sort', label: 'Bubble' },
  { id: 'selection-sort', label: 'Selection' },
  { id: 'insertion-sort', label: 'Insertion' },
  { id: 'merge-sort', label: 'Merge' },
  { id: 'quick-sort', label: 'Quick' },
  { id: 'heap-sort', label: 'Heap' },
];

export default function VisualizerControls({
  selectedAlgo,
  onSelectAlgo,
  isPlaying,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  onReset,
  onGenerateArray,
  speed,
  onSpeedChange,
  arraySize,
  onArraySizeChange,
  customInput,
  onCustomInputChange,
  onApplyCustomArray,
  presetType,
  onPresetChange,
  soundEnabled,
  onToggleSound,
  isCompleted,
  algoId = '',
  vizTheme,
  onToggleVizTheme,
  onExport,
  sortOrder = 'asc',
  onOrderChange,
  lastStandardAlgo = 'bubble-sort'
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [moreModalOpen, setMoreModalOpen] = useState(false);
  const [inputError, setInputError] = useState('');
  const settingsPanelRef = useRef(null);
  const settingsBtnRef = useRef(null);
  const exportBtnRef = useRef(null);
  const exportPanelRef = useRef(null);

  const isMoreAlgo = MORE_SORTING_ALGORITHMS.some(a => a.id === selectedAlgo);
  const currentMoreAlgo = MORE_SORTING_ALGORITHMS.find(a => a.id === selectedAlgo);

  // Cap array size for algorithms with constrained visualizers
  const maxArraySize = algoId === 'heap-sort' ? 15 : (algoId === 'quick-sort' || algoId === 'merge-sort') ? 20 : 80;
  const sizeCapped = maxArraySize < 80;

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        settingsOpen &&
        settingsPanelRef.current &&
        !settingsPanelRef.current.contains(e.target) &&
        settingsBtnRef.current &&
        !settingsBtnRef.current.contains(e.target)
      ) {
        setSettingsOpen(false);
      }
      if (
        exportOpen &&
        exportPanelRef.current &&
        !exportPanelRef.current.contains(e.target) &&
        exportBtnRef.current &&
        !exportBtnRef.current.contains(e.target)
      ) {
        setExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [settingsOpen, exportOpen]);

  // Close settings on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && settingsOpen) setSettingsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settingsOpen]);

  const handleApplyCustom = (e) => {
    e.preventDefault();
    setInputError('');
    if (!customInput.trim()) return;

    const parsed = customInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(Number);

    if (parsed.some(isNaN)) {
      setInputError('Please enter valid comma-separated numbers (e.g. "5, 2, 8, 1, 4")');
      return;
    }
    if (parsed.length < 2 || parsed.length > 100) {
      setInputError('Array size must be between 2 and 100 numbers.');
      return;
    }
    onApplyCustomArray(parsed);
    setSettingsOpen(false);
  };

  const PRESET_LABELS = {
    'random': 'Random',
    'nearly-sorted': 'Nearly Sorted',
    'reversed': 'Reversed',
    'few-unique': 'Few Unique',
  };

  return (
    <div className="controls-card">
      {/* ── QUICK ALGORITHM BUTTONS ROW (Prompt: [ Bubble ] [ Selection ] [ Insertion ] [ Merge ] [ Quick ] [ Heap ] [ + More ]) ── */}
      <div className="ctrl-quick-algo-row">
        <div className="ctrl-quick-algo-list">
          {QUICK_SORT_ALGOS.map((algo) => {
            const isActive = selectedAlgo === algo.id;
            return (
              <button
                key={algo.id}
                type="button"
                onClick={() => onSelectAlgo(algo.id)}
                className={`ctrl-quick-pill ${isActive ? 'active' : ''}`}
              >
                {algo.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreModalOpen(true)}
            className={`ctrl-quick-pill ctrl-quick-more ${isMoreAlgo ? 'active-more' : ''}`}
            title="Explore 21 additional sorting algorithms (+ More)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>+ More</span>
          </button>
        </div>

        {/* If a "More" algorithm is active, show its dedicated badge with back button */}
        {isMoreAlgo && currentMoreAlgo && (
          <div className="ctrl-active-more-pill">
            <span className="ctrl-active-more-text">
              Active: <strong>{currentMoreAlgo.name}</strong>
              <span className="ctrl-active-more-diff">({currentMoreAlgo.difficulty})</span>
            </span>
            <button
              type="button"
              onClick={() => onSelectAlgo(lastStandardAlgo || 'bubble-sort')}
              className="ctrl-active-more-close"
              title="Return to standard sorting algorithm"
              aria-label="Return to standard algorithm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ── MAIN TOOLBAR ROW ── */}
      <div className="controls-toolbar">

        {/* Algorithm selector with + More button */}
        <div className="ctrl-algo-group">
          <label htmlFor="algo-select" className="ctrl-micro-label">Algorithm</label>
          <div className="flex items-center gap-1.5">
            <div className="ctrl-select-wrapper">
              <select
                id="algo-select"
                value={selectedAlgo}
                onChange={(e) => onSelectAlgo(e.target.value)}
                className="algo-dropdown"
              >
                <optgroup label="Divide & Conquer (12)">
                  {DIVIDE_AND_CONQUER_ALGORITHMS.map(a => (
                    <option key={`dc-${a.id}`} value={a.id}>{a.name} ({a.difficulty})</option>
                  ))}
                </optgroup>
                <optgroup label="Additional & Exotic Sorting (9)">
                  {OTHER_MORE_ALGORITHMS.map(a => (
                    <option key={`other-${a.id}`} value={a.id}>{a.name} ({a.difficulty})</option>
                  ))}
                </optgroup>
                <optgroup label="Standard Sorting (10)">
                  {ALGORITHMS.map(a => (
                    <option key={`std-${a.id}`} value={a.id}>{a.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Greedy & Dynamic Programming (4)">
                  {GREEDY_DP_ALGORITHMS.map(a => (
                    <option key={`gdp-${a.id}`} value={a.id}>{a.name}</option>
                  ))}
                </optgroup>
              </select>
              <ChevronDown className="ctrl-select-chevron" />
            </div>

            {/* "+ More" button beside algorithm selector */}
            <button
              type="button"
              onClick={() => setMoreModalOpen(true)}
              className={`btn ctrl-btn ctrl-more-btn ${isMoreAlgo ? 'btn-primary' : 'btn-secondary'}`}
              title="Open additional sorting algorithms dialog"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="ctrl-btn-label font-bold">+ More</span>
            </button>
          </div>
        </div>

        {/* Sorting Order Toggle (Ascending / Descending) */}
        <div className="ctrl-order-group">
          <label className="ctrl-micro-label">Order</label>
          <button
            type="button"
            onClick={() => onOrderChange && onOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="btn btn-secondary ctrl-btn ctrl-order-btn"
            title={`Sort direction: ${sortOrder === 'asc' ? 'Ascending (Min to Max)' : 'Descending (Max to Min)'}. Click to toggle.`}
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
            <span className="ctrl-btn-label">{sortOrder === 'asc' ? 'Asc ↑' : 'Desc ↓'}</span>
          </button>
        </div>

        {/* Speed slider (inline, compact) */}
        <div className="ctrl-speed-group">
          <div className="ctrl-speed-header">
            <label className="ctrl-micro-label">Speed</label>
            <span className="ctrl-speed-val">{Math.round(1000 / speed)}×</span>
          </div>
          <div className="ctrl-speed-row">
            <span className="ctrl-speed-end-label">Slow</span>
            <input
              type="range"
              min="10"
              max="800"
              step="10"
              value={810 - speed}
              onChange={(e) => onSpeedChange(810 - Number(e.target.value))}
              className="range-slider ctrl-range"
              title={`Animation speed: ${Math.round(1000 / speed)} steps/sec`}
            />
            <span className="ctrl-speed-end-label">Fast</span>
          </div>
        </div>

        {/* Playback controls */}
        <div className="ctrl-playback-group">
          <button
            onClick={onGenerateArray}
            className="btn btn-secondary ctrl-btn"
            title="Generate new random array (G)"
          >
            <Shuffle className="w-4 h-4" />
            <span className="ctrl-btn-label">New</span>
          </button>

          <button
            onClick={onStepBackward}
            className="btn btn-icon ctrl-btn"
            disabled={isPlaying}
            title="Step back (←)"
            aria-label="Step backward"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            className={`btn ctrl-btn ctrl-play-btn ${isPlaying ? 'btn-warning' : 'btn-primary'}`}
            title={isPlaying ? 'Pause (Space)' : isCompleted ? 'Replay (Space)' : 'Play (Space)'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="ctrl-btn-label">{isPlaying ? 'Pause' : isCompleted ? 'Replay' : 'Play'}</span>
          </button>

          <button
            onClick={onStepForward}
            className="btn btn-icon ctrl-btn"
            disabled={isPlaying}
            title="Step forward (→)"
            aria-label="Step forward"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={onReset}
            className="btn btn-icon ctrl-btn btn-reset"
            title="Reset (R)"
            aria-label="Reset animation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Settings gear button */}
        <div className="ctrl-settings-anchor">
          <button
            ref={settingsBtnRef}
            onClick={() => setSettingsOpen(prev => !prev)}
            className={`btn ctrl-btn ctrl-settings-btn ${settingsOpen ? 'active' : ''}`}
            title="Visualization settings"
            aria-expanded={settingsOpen}
            aria-haspopup="true"
          >
            <Settings className={`w-4 h-4 ${settingsOpen ? 'ctrl-gear-spin' : ''}`} />
            <span className="ctrl-btn-label">Settings</span>
          </button>

          {/* ── SETTINGS POPOVER ── */}
          {settingsOpen && (
            <div
              ref={settingsPanelRef}
              className="ctrl-settings-panel"
              role="dialog"
              aria-label="Visualization settings panel"
            >
              <div className="ctrl-panel-header">
                <span className="ctrl-panel-title">
                  <Settings className="w-3.5 h-3.5" />
                  Visualization Settings
                </span>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="ctrl-panel-close"
                  aria-label="Close settings"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Direction in Settings */}
              <div className="ctrl-panel-section">
                <div className="ctrl-panel-label-row">
                  <span className="ctrl-panel-label">Sort Direction</span>
                  <span className="ctrl-panel-value font-mono">{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
                </div>
                <div className="flex gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => onOrderChange && onOrderChange('asc')}
                    className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold border transition ${
                      sortOrder === 'asc'
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    Ascending (↑)
                  </button>
                  <button
                    type="button"
                    onClick={() => onOrderChange && onOrderChange('desc')}
                    className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold border transition ${
                      sortOrder === 'desc'
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    Descending (↓)
                  </button>
                </div>
              </div>

              {/* Array Size */}
              <div className="ctrl-panel-section">
                <div className="ctrl-panel-label-row">
                  <span className="ctrl-panel-label">Array Size</span>
                  <span className="ctrl-panel-value">{arraySize} items</span>
                </div>
                <div className="ctrl-panel-slider-row">
                  <span className="ctrl-speed-end-label">5</span>
                  <input
                    type="range"
                    min="5"
                    max={maxArraySize}
                    value={Math.min(arraySize, maxArraySize)}
                    onChange={(e) => onArraySizeChange(Number(e.target.value))}
                    className="range-slider ctrl-range"
                  />
                  <span className="ctrl-speed-end-label">{maxArraySize}</span>
                </div>
                {sizeCapped && (
                  <p className="ctrl-panel-hint">⚠ Limited to {maxArraySize} for {algoId === 'heap-sort' ? 'tree readability' : 'diagram clarity'}</p>
                )}
              </div>

              {/* Array Preset */}
              <div className="ctrl-panel-section">
                <span className="ctrl-panel-label">Array Pattern</span>
                <div className="ctrl-preset-grid">
                  {['random', 'nearly-sorted', 'reversed', 'few-unique'].map((type) => (
                    <button
                      key={type}
                      onClick={() => onPresetChange(type)}
                      className={`ctrl-preset-btn ${presetType === type ? 'active' : ''}`}
                    >
                      {PRESET_LABELS[type]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Array Input */}
              <div className="ctrl-panel-section">
                <span className="ctrl-panel-label">Custom Array</span>
                <form onSubmit={handleApplyCustom} className="ctrl-custom-form">
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => onCustomInputChange(e.target.value)}
                    placeholder="e.g. 45, 12, 89, 34, 67"
                    className="ctrl-custom-input"
                  />
                  <button type="submit" className="btn btn-primary ctrl-custom-btn">
                    Apply
                  </button>
                </form>
                {inputError && <p className="ctrl-input-error">{inputError}</p>}
                <p className="ctrl-panel-hint">Comma-separated numbers (2–100 elements)</p>
              </div>

              {/* Sound & Viz Theme toggles */}
              <div className="ctrl-panel-section ctrl-toggles-row">
                <div className="ctrl-toggle-item">
                  <span className="ctrl-panel-label">Audio</span>
                  <button
                    onClick={onToggleSound}
                    className={`ctrl-toggle-btn ${soundEnabled ? 'ctrl-toggle-on' : 'ctrl-toggle-off'}`}
                    title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    <span>{soundEnabled ? 'On' : 'Mute'}</span>
                  </button>
                </div>

                <div className="ctrl-toggle-item">
                  <span className="ctrl-panel-label">Viz Theme</span>
                  <button
                    onClick={onToggleVizTheme}
                    className={`ctrl-toggle-btn ${vizTheme === 'dark' ? 'ctrl-toggle-on' : 'ctrl-toggle-off'}`}
                    title={`Switch to ${vizTheme === 'dark' ? 'light' : 'dark'} visualization theme`}
                  >
                    {vizTheme === 'dark'
                      ? <Moon className="w-4 h-4" />
                      : <Sun className="w-4 h-4" />
                    }
                    <span>{vizTheme === 'dark' ? 'Dark' : 'Light'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Export button */}
        <div className="ctrl-settings-anchor">
          <button
            ref={exportBtnRef}
            onClick={() => setExportOpen(prev => !prev)}
            className={`btn ctrl-btn ctrl-settings-btn ${exportOpen ? 'active' : ''}`}
            title="Export visualization diagram"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span className="ctrl-btn-label">Export</span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          {exportOpen && (
            <div
              ref={exportPanelRef}
              className="ctrl-settings-panel"
              style={{ width: 250, right: 0, padding: '0.45rem' }}
            >
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

      {/* ── ADDITIONAL SORTING ALGORITHMS MODAL (+ MORE) ── */}
      <MoreAlgorithmsModal
        isOpen={moreModalOpen}
        onClose={() => setMoreModalOpen(false)}
        onSelectAlgo={onSelectAlgo}
        selectedAlgo={selectedAlgo}
        onBackToStandard={() => onSelectAlgo(lastStandardAlgo || 'bubble-sort')}
      />
    </div>
  );
}
