import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Shuffle, Volume2, VolumeX, Sparkles, SlidersHorizontal } from 'lucide-react';
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
  isCompleted
}) {
  const [inputError, setInputError] = useState('');

  const handleApplyCustom = (e) => {
    e.preventDefault();
    setInputError('');
    if (!customInput.trim()) return;

    // Validate format like "5, 2, 8, 1, 4"
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
  };

  return (
    <div className="controls-card">
      {/* Top Bar: Algorithm Dropdown & Primary Play Controls */}
      <div className="controls-main-row">
        {/* Algorithm Select Dropdown */}
        <div className="control-group algo-select-group">
          <label htmlFor="algo-select" className="control-label">Algorithm</label>
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
        </div>

        {/* Action Buttons */}
        <div className="btn-group-primary">
          <button 
            onClick={onGenerateArray}
            className="btn btn-secondary"
            title="Generate Random Array"
          >
            <Shuffle className="w-4 h-4" />
            <span>Generate Array</span>
          </button>

          <button 
            onClick={onTogglePlay}
            className={`btn ${isPlaying ? 'btn-warning' : 'btn-primary'}`}
            disabled={isCompleted && !isPlaying}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Start</span>
              </>
            )}
          </button>

          <button 
            onClick={onStepBackward}
            className="btn btn-icon"
            disabled={isPlaying}
            title="Previous Step"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button 
            onClick={onStepForward}
            className="btn btn-icon"
            disabled={isPlaying || isCompleted}
            title="Next Step"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button 
            onClick={onReset}
            className="btn btn-icon btn-reset"
            title="Reset Animation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sliders & Presets Row */}
      <div className="controls-secondary-row">
        {/* Preset Selector */}
        <div className="control-group">
          <label className="control-label">Array Preset</label>
          <div className="preset-pill-group">
            {['random', 'nearly-sorted', 'reversed', 'few-unique'].map((type) => (
              <button
                key={type}
                className={`preset-pill ${presetType === type ? 'active' : ''}`}
                onClick={() => onPresetChange(type)}
              >
                {type.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Speed Slider */}
        <div className="control-group slider-group">
          <div className="slider-header">
            <span className="control-label">Speed</span>
            <span className="slider-value">{Math.round(1000 / speed)} steps/s</span>
          </div>
          <div className="slider-input-wrapper">
            <span className="slider-min-label">Slow</span>
            <input 
              type="range"
              min="10"
              max="800"
              step="10"
              // Invert value so slider right = faster (lower delay ms)
              value={810 - speed}
              onChange={(e) => onSpeedChange(810 - Number(e.target.value))}
              className="range-slider"
            />
            <span className="slider-max-label">Fast</span>
          </div>
        </div>

        {/* Size Slider */}
        <div className="control-group slider-group">
          <div className="slider-header">
            <span className="control-label">Array Size</span>
            <span className="slider-value">{arraySize} items</span>
          </div>
          <div className="slider-input-wrapper">
            <span className="slider-min-label">Small</span>
            <input 
              type="range"
              min="5"
              max="80"
              value={arraySize}
              onChange={(e) => onArraySizeChange(Number(e.target.value))}
              className="range-slider"
            />
            <span className="slider-max-label">Large</span>
          </div>
        </div>

        {/* Audio Toggle */}
        <div className="control-group sound-group">
          <label className="control-label">Audio</label>
          <button 
            onClick={onToggleSound}
            className={`btn-sound-toggle ${soundEnabled ? 'enabled' : 'disabled'}`}
            title={soundEnabled ? "Mute Tone Sound" : "Enable Pitch Tone Sound"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
            <span>{soundEnabled ? "Audio On" : "Muted"}</span>
          </button>
        </div>
      </div>

      {/* Custom Input Form Row */}
      <div className="controls-custom-input-row">
        <form onSubmit={handleApplyCustom} className="custom-input-form">
          <label htmlFor="custom-array-input" className="control-label font-medium">Custom Array Input:</label>
          <input 
            id="custom-array-input"
            type="text" 
            placeholder="e.g. 5, 2, 8, 1, 4"
            value={customInput}
            onChange={(e) => onCustomInputChange(e.target.value)}
            className="custom-text-input"
          />
          <button type="submit" className="btn btn-sm btn-accent">Apply Array</button>
        </form>
        {inputError && <div className="custom-input-error">{inputError}</div>}
      </div>
    </div>
  );
}
