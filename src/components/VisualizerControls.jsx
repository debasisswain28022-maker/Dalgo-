import React, { useState, useRef, useEffect } from 'react';
import {
  Play, Pause, SkipForward, SkipBack, RotateCcw, Shuffle,
  Volume2, VolumeX, Settings, X, Sun, Moon, ChevronDown
} from 'lucide-react';
import { ALGORITHMS } from '../data/algorithms';

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
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inputError, setInputError] = useState('');
  const settingsPanelRef = useRef(null);
  const settingsBtnRef = useRef(null);

  // Cap array size for algorithms with constrained visualizers
  const maxArraySize = algoId === 'heap-sort' ? 15 : (algoId === 'quick-sort' || algoId === 'merge-sort') ? 20 : 80;
  const sizeCapped = maxArraySize < 80;

  // Close settings when clicking outside
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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [settingsOpen]);

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
      {/* ── MAIN TOOLBAR ROW ── */}
      <div className="controls-toolbar">

        {/* Algorithm selector */}
        <div className="ctrl-algo-group">
          <label htmlFor="algo-select" className="ctrl-micro-label">Algorithm</label>
          <div className="ctrl-select-wrapper">
            <select
              id="algo-select"
              value={selectedAlgo}
              onChange={(e) => onSelectAlgo(e.target.value)}
              className="algo-dropdown"
            >
              <optgroup label="Beginner">
                {ALGORITHMS.filter(a => a.category === 'Beginner').map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </optgroup>
              <optgroup label="Intermediate">
                {ALGORITHMS.filter(a => a.category === 'Intermediate').map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </optgroup>
              <optgroup label="Advanced">
                {ALGORITHMS.filter(a => a.category === 'Advanced').map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </optgroup>
            </select>
            <ChevronDown className="ctrl-select-chevron" />
          </div>
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
            disabled={isCompleted && !isPlaying}
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="ctrl-btn-label">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={onStepForward}
            className="btn btn-icon ctrl-btn"
            disabled={isPlaying || isCompleted}
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
                      className={`ctrl-preset-pill ${presetType === type ? 'active' : ''}`}
                      onClick={() => onPresetChange(type)}
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
                    placeholder="e.g. 5, 2, 8, 1, 4"
                    value={customInput}
                    onChange={(e) => onCustomInputChange(e.target.value)}
                    className="ctrl-custom-input"
                    aria-label="Custom array values"
                  />
                  <button type="submit" className="btn btn-sm btn-accent">Apply</button>
                </form>
                {inputError && <p className="ctrl-panel-error">{inputError}</p>}
              </div>

              {/* Divider */}
              <div className="ctrl-panel-divider" />

              {/* Sound & Theme Row */}
              <div className="ctrl-panel-section ctrl-panel-toggles">
                {/* Sound toggle */}
                <div className="ctrl-toggle-item">
                  <span className="ctrl-panel-label">Sound</span>
                  <button
                    onClick={onToggleSound}
                    className={`ctrl-toggle-btn ${soundEnabled ? 'ctrl-toggle-on' : 'ctrl-toggle-off'}`}
                    title={soundEnabled ? 'Mute audio' : 'Enable audio'}
                  >
                    {soundEnabled
                      ? <Volume2 className="w-4 h-4" />
                      : <VolumeX className="w-4 h-4" />
                    }
                    <span>{soundEnabled ? 'On' : 'Off'}</span>
                  </button>
                </div>

                {/* Viz theme toggle */}
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
      </div>
    </div>
  );
}
