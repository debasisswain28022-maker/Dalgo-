import React, { useState, useEffect } from 'react';
import VisualizerControls from '../components/VisualizerControls';
import ArrayBars from '../components/ArrayBars';
import MergeSortVisualizer from '../components/MergeSortVisualizer';
import QuickSortVisualizer from '../components/QuickSortVisualizer';
import HeapSortVisualizer from '../components/HeapSortVisualizer';
import StepActionPanel from '../components/StepActionPanel';
import PseudocodeHighlight from '../components/PseudocodeHighlight';
import { runSortingAlgorithm } from '../algorithms';
import { ALGORITHMS } from '../data/algorithms';
import { playTone } from '../utils/audio';
import {
  Clock, HardDrive, BarChart2, CheckCircle2, ShieldCheck, ShieldAlert,
  Layers, Play, Pause, SkipForward, SkipBack, RotateCcw
} from 'lucide-react';

// Algorithms that have their own dedicated visualizers (with built-in panels)
const DEDICATED_VIS_ALGOS = new Set(['heap-sort', 'quick-sort', 'merge-sort']);

export default function Visualizer({ selectedAlgoId, onSelectAlgoId }) {
  const algoId = selectedAlgoId || 'bubble-sort';
  const currentAlgoData = ALGORITHMS.find(a => a.id === algoId) || ALGORITHMS[0];

  const [arraySize, setArraySize] = useState(
    algoId === 'heap-sort' ? 5 : algoId === 'quick-sort' || algoId === 'merge-sort' ? 7 : 20
  );
  const [speed, setSpeed] = useState(300);
  const [presetType, setPresetType] = useState('random');
  const [customInput, setCustomInput] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [pivotStrategy, setPivotStrategy] = useState('last');

  const [array, setArray] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateNewArray = (size = arraySize, preset = presetType) => {
    let newArr = [];
    if (preset === 'random') {
      newArr = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    } else if (preset === 'nearly-sorted') {
      newArr = Array.from({ length: size }, (_, i) => Math.floor(10 + (i / size) * 80));
      for (let k = 0; k < Math.floor(size / 6); k++) {
        const idx = Math.floor(Math.random() * (size - 1));
        [newArr[idx], newArr[idx + 1]] = [newArr[idx + 1], newArr[idx]];
      }
    } else if (preset === 'reversed') {
      newArr = Array.from({ length: size }, (_, i) => Math.floor(90 - (i / size) * 80));
    } else if (preset === 'few-unique') {
      const values = [20, 45, 70, 95];
      newArr = Array.from({ length: size }, () => values[Math.floor(Math.random() * values.length)]);
    }
    setArray(newArr);
    setIsPlaying(false);
  };

  useEffect(() => {
    generateNewArray(arraySize, presetType);
  }, [arraySize, presetType]);

  useEffect(() => {
    if (array.length > 0) {
      const { steps: generatedSteps } = runSortingAlgorithm(algoId, array, { pivotStrategy });
      setSteps(generatedSteps);
      setCurrentStepIdx(0);
      setIsPlaying(false);
    }
  }, [algoId, array, pivotStrategy]);

  useEffect(() => {
    if (soundEnabled && isPlaying && steps[currentStepIdx]) {
      const step = steps[currentStepIdx];
      if (step.indices && step.indices.length > 0) {
        const idx = step.indices[0];
        const val = (step.array || step.arraySnapshot)[idx] || 50;
        playTone(val, 10, 100, Math.min(speed, 60));
      }
    }
  }, [currentStepIdx, isPlaying, soundEnabled, speed, steps]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        document.activeElement && (
          document.activeElement.tagName === 'INPUT' ||
          document.activeElement.tagName === 'TEXTAREA' ||
          document.activeElement.tagName === 'SELECT' ||
          document.activeElement.isContentEditable
        )
      ) return;

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
  const isDedicatedVis = DEDICATED_VIS_ALGOS.has(algoId);

  const handleApplyCustomArray = (parsedArray) => {
    setArray(parsedArray);
    setArraySize(parsedArray.length);
    setPresetType('custom');
  };

  return (
    <div className="vis-page-root">

      {/* ── TOP CONTROLS ── */}
      <VisualizerControls
        selectedAlgo={algoId}
        onSelectAlgo={onSelectAlgoId}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onStepForward={() => setCurrentStepIdx(p => Math.min(steps.length - 1, p + 1))}
        onStepBackward={() => setCurrentStepIdx(p => Math.max(0, p - 1))}
        onReset={() => { setCurrentStepIdx(0); setIsPlaying(false); }}
        onGenerateArray={() => generateNewArray()}
        speed={speed}
        onSpeedChange={setSpeed}
        arraySize={arraySize}
        onArraySizeChange={setArraySize}
        customInput={customInput}
        onCustomInputChange={setCustomInput}
        onApplyCustomArray={handleApplyCustomArray}
        presetType={presetType}
        onPresetChange={setPresetType}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        isCompleted={isCompleted}
      />

      {/* ── ALGORITHM HEADER STRIP ── */}
      <div className="vis-algo-header-strip">
        <div className="vis-algo-title-block">
          <h1 className="vis-algo-name">{currentAlgoData.name}</h1>
          <p className="vis-algo-desc">{currentAlgoData.shortDescription}</p>
        </div>
        <div className="vis-complexity-row">
          <div className="vis-comp-chip chip-best">
            <Clock className="w-3.5 h-3.5" />
            <span>Best <strong>{currentAlgoData.complexity.best}</strong></span>
          </div>
          <div className="vis-comp-chip chip-avg">
            <Clock className="w-3.5 h-3.5" />
            <span>Avg <strong>{currentAlgoData.complexity.average}</strong></span>
          </div>
          <div className="vis-comp-chip chip-space">
            <HardDrive className="w-3.5 h-3.5" />
            <span>Space <strong>{currentAlgoData.complexity.space}</strong></span>
          </div>
          <div className="vis-comp-chip">
            {currentAlgoData.stable
              ? <span className="chip-stable"><ShieldCheck className="w-3.5 h-3.5" /> Stable</span>
              : <span className="chip-unstable"><ShieldAlert className="w-3.5 h-3.5" /> Unstable</span>
            }
          </div>
        </div>
      </div>

      {/* ── MAIN SINGLE-SCREEN GRID ── */}
      <div className={`vis-main-grid ${isDedicatedVis ? 'vis-grid-full' : 'vis-grid-split'}`}>

        {/* LEFT / MAIN: Visualization Area */}
        <div className="vis-viz-column">

          {/* The actual visualization */}
          <div className="vis-canvas-card">
            {algoId === 'heap-sort' ? (
              <HeapSortVisualizer
                currentStep={currentFrame}
                originalArray={array}
              />
            ) : algoId === 'quick-sort' ? (
              <QuickSortVisualizer
                currentStep={currentFrame}
                pivotStrategy={pivotStrategy}
                onPivotStrategyChange={setPivotStrategy}
                originalArray={array}
              />
            ) : algoId === 'merge-sort' ? (
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

          {/* Auxiliary data views — counting/bucket/etc — for non-dedicated algos */}
          {!isDedicatedVis && (
            <>
              {currentFrame?.countArray && currentFrame.countArray.length > 0 && (
                <div className="vis-aux-card">
                  <span className="vis-aux-title">Frequency Count Array</span>
                  <div className="vis-count-row">
                    {currentFrame.countArray.slice(0, 15).map((c, idx) => (
                      <div key={idx} className="vis-count-cell">
                        <span className="vis-count-idx">{idx + (currentFrame.minOffset || 0)}</span>
                        <span className="vis-count-val">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentFrame?.buckets && currentFrame.buckets.length > 0 && (
                <div className="vis-aux-card">
                  <span className="vis-aux-title">Buckets</span>
                  <div className="vis-buckets-grid">
                    {currentFrame.buckets.map((b, bIdx) => (
                      <div key={bIdx} className="vis-bucket-chip">
                        <span className="vis-bucket-num">#{bIdx + 1}</span>
                        <span className="vis-bucket-vals">[{b.join(', ')}]</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* RIGHT: Interactive Step Panel (only for non-dedicated algos) */}
        {!isDedicatedVis && (
          <div className="vis-side-column">

            {/* Step Action Panel */}
            <StepActionPanel
              currentStep={currentFrame}
              currentStepIdx={currentStepIdx}
              totalSteps={steps.length}
              algoName={currentAlgoData.name}
            />

            {/* Pseudocode with live highlighting */}
            <PseudocodeHighlight
              algoId={algoId}
              currentStep={currentFrame}
            />

            {/* Stats card */}
            <div className="vis-stats-card">
              <div className="vis-stat-row">
                <BarChart2 className="w-4 h-4 text-amber-400" />
                <span className="vis-stat-label">Comparisons</span>
                <strong className="vis-stat-val text-amber-400">{currentFrame?.comparisonsCount || 0}</strong>
              </div>
              <div className="vis-stat-row">
                <Layers className="w-4 h-4 text-rose-400" />
                <span className="vis-stat-label">Swaps / Writes</span>
                <strong className="vis-stat-val text-rose-400">{currentFrame?.swapsCount || 0}</strong>
              </div>
              <div className="vis-stat-row">
                <span className="vis-stat-label">Step Progress</span>
                <strong className="vis-stat-val">{currentStepIdx + 1} / {steps.length}</strong>
              </div>
              {currentFrame?.pass > 0 && (
                <div className="vis-stat-row">
                  <span className="vis-stat-label">Current Pass</span>
                  <strong className="vis-stat-val text-cyan-400">{currentFrame.pass}</strong>
                </div>
              )}
              {isCompleted && (
                <div className="vis-completed-banner">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Array Sorted!</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── FLOATING PLAYBACK DOCK ── */}
      <div className="vis-playback-dock">
        <div className="dock-step-info">
          Step <strong className="text-amber-400">{currentStepIdx + 1}</strong> / {steps.length || 1}
        </div>

        <div className="dock-btns">
          <button
            onClick={() => setCurrentStepIdx(p => Math.max(0, p - 1))}
            disabled={isPlaying || currentStepIdx === 0}
            className="dock-btn btn-secondary"
            title="Previous Step (←)"
          >
            <SkipBack className="w-4 h-4 mr-1" /> Prev
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`dock-btn ${isPlaying ? 'btn-warning' : 'btn-primary'}`}
            disabled={isCompleted && !isPlaying}
            title={isPlaying ? 'Pause (Space)' : 'Start (Space)'}
          >
            {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isPlaying ? 'Pause' : 'Start'}
          </button>

          <button
            onClick={() => setCurrentStepIdx(p => Math.min(steps.length - 1, p + 1))}
            disabled={isPlaying || isCompleted}
            className="dock-btn btn-accent"
            title="Next Step (→)"
          >
            Next <SkipForward className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={() => { setCurrentStepIdx(0); setIsPlaying(false); }}
            className="dock-btn btn-icon"
            title="Reset (R)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="dock-keys hidden lg:flex">
          <span>
            <kbd className="dock-kbd">←</kbd>
            <kbd className="dock-kbd">→</kbd>
            <kbd className="dock-kbd">Space</kbd>
            <kbd className="dock-kbd">R</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
