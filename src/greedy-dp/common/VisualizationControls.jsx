import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Sparkles,
  Gauge,
  CheckCircle2,
  Info
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
  stepType = 'info'
}) {
  const isStarted = currentStepIdx > 0;
  const isCompleted = totalSteps > 0 && currentStepIdx >= totalSteps - 1;

  // Type badge styling helper
  const getBadgeStyle = (type) => {
    switch (type) {
      case 'compare':
      case 'eval':
        return 'gdp-badge-amber';
      case 'swap':
      case 'merge':
        return 'gdp-badge-purple';
      case 'select':
      case 'take_full':
      case 'match':
        return 'gdp-badge-emerald';
      case 'take_partial':
        return 'gdp-badge-cyan';
      case 'reject':
      case 'mismatch':
        return 'gdp-badge-rose';
      case 'complete':
        return 'gdp-badge-emerald';
      default:
        return 'gdp-badge-blue';
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

        {/* Speed Slider */}
        <div className="gdp-speed-group">
          <Gauge className="w-4 h-4 text-indigo-400" />
          <span className="gdp-speed-label">Speed:</span>
          <input
            type="range"
            min="100"
            max="1500"
            step="50"
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="gdp-speed-slider"
            title={`${speed}ms delay`}
          />
          <span className="gdp-speed-val">
            {speed <= 250 ? 'Fast' : speed <= 700 ? 'Normal' : 'Slow'} ({speed}ms)
          </span>
        </div>
      </div>

      {/* Main Buttons Bar */}
      <div className="gdp-controls-main">
        <div className="gdp-btn-group">
          {/* Start / Reset Button */}
          {!isStarted ? (
            <button
              onClick={onStart}
              className="gdp-btn gdp-btn-primary"
              title="Start algorithm visualization"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start</span>
            </button>
          ) : (
            <button
              onClick={onReset}
              className="gdp-btn gdp-btn-outline"
              title="Reset to initial state"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          )}

          {/* Previous Step */}
          <button
            onClick={onPrev}
            disabled={currentStepIdx <= 0}
            className="gdp-btn gdp-btn-secondary"
            title="Step back to previous state"
          >
            <SkipBack className="w-4 h-4" />
            <span>Prev Step</span>
          </button>

          {/* Play / Pause Toggle */}
          {isPlaying ? (
            <button
              onClick={onPause}
              className="gdp-btn gdp-btn-warning"
              title="Pause automatic playback"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={onPlay}
              disabled={isCompleted}
              className="gdp-btn gdp-btn-primary"
              title="Auto-play all steps"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Play</span>
            </button>
          )}

          {/* Next Step */}
          <button
            onClick={onNext}
            disabled={isCompleted}
            className="gdp-btn gdp-btn-secondary"
            title="Advance one step"
          >
            <span>Next Step</span>
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="gdp-step-counter">
          <span className="gdp-step-current">
            {totalSteps > 0 ? currentStepIdx + 1 : 0}
          </span>
          <span className="gdp-step-slash">/</span>
          <span className="gdp-step-total">{totalSteps}</span>
          <span className="gdp-step-text">Steps</span>
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
            <span className="gdp-banner-badge">{stepType.toUpperCase().replace('_', ' ')}</span>
            <span className="gdp-banner-progress">
              {isCompleted ? 'Algorithm Completed' : `Executing Step ${currentStepIdx + 1}`}
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
