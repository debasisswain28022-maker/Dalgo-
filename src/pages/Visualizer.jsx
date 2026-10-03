import React, { useState, useEffect } from 'react';
import VisualizerControls from '../components/VisualizerControls';
import ArrayBars from '../components/ArrayBars';
import HeapTreeView from '../components/HeapTreeView';
import MergeSortVisualizer from '../components/MergeSortVisualizer';
import QuickSortVisualizer from '../components/QuickSortVisualizer';
import HeapSortVisualizer from '../components/HeapSortVisualizer';
import { runSortingAlgorithm } from '../algorithms';
import { ALGORITHMS } from '../data/algorithms';
import { playTone } from '../utils/audio';
import { Clock, HardDrive, BarChart2, CheckCircle2, ShieldCheck, ShieldAlert, Layers, Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';

export default function Visualizer({ selectedAlgoId, onSelectAlgoId }) {
  const algoId = selectedAlgoId || 'bubble-sort';
  const currentAlgoData = ALGORITHMS.find(a => a.id === algoId) || ALGORITHMS[0];

  // Visualizer Configuration States
  const [arraySize, setArraySize] = useState(
    algoId === 'heap-sort' ? 5 : algoId === 'quick-sort' || algoId === 'merge-sort' ? 7 : 20
  );
  const [speed, setSpeed] = useState(300); // delay ms
  const [presetType, setPresetType] = useState('random');
  const [customInput, setCustomInput] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [pivotStrategy, setPivotStrategy] = useState('last'); // for quick sort

  // Playback & Step States
  const [array, setArray] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Function to generate initial array based on size & preset
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

  // Audio tone effect
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

  // Keyboard shortcut listener (Space = Play/Pause, ArrowRight = Next, ArrowLeft = Prev, R = Reset)
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

      // Spacebar: Play / Pause (or Restart if completed)
      if (key === ' ' || key === 'Spacebar' || code === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => {
          if (!prev && currentStepIdx >= steps.length - 1) {
            setCurrentStepIdx(0);
            return true;
          }
          return !prev;
        });
      }
      // ArrowRight: Next Step
      else if (key === 'ArrowRight' || code === 'ArrowRight') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIdx(prev => {
          if (prev >= steps.length - 1) return 0;
          return Math.min(steps.length - 1, prev + 1);
        });
      }
      // ArrowLeft: Previous Step
      else if (key === 'ArrowLeft' || code === 'ArrowLeft') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIdx(prev => Math.max(0, prev - 1));
      }
      // Key R / r: Reset Animation
      else if (key === 'r' || key === 'R' || code === 'KeyR') {
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

  const handleApplyCustomArray = (parsedArray) => {
    setArray(parsedArray);
    setArraySize(parsedArray.length);
    setPresetType('custom');
  };

  return (
    <div className="visualizer-page-container pb-24">
      {/* Header Info Banner */}
      <div className="visualizer-header">
        <div className="title-block">
          <h1 className="vis-title">{currentAlgoData.name} Visualizer</h1>
          <p className="vis-subtitle">{currentAlgoData.shortDescription}</p>
        </div>

        <div className="vis-complexity-cards">
          <div className="vis-comp-badge">
            <Clock className="w-3.5 h-3.5 text-amber-400 inline mr-1" />
            <span>Best: <strong>{currentAlgoData.complexity.best}</strong></span>
          </div>
          <div className="vis-comp-badge">
            <Clock className="w-3.5 h-3.5 text-rose-400 inline mr-1" />
            <span>Avg: <strong>{currentAlgoData.complexity.average}</strong></span>
          </div>
          <div className="vis-comp-badge">
            <HardDrive className="w-3.5 h-3.5 text-cyan-400 inline mr-1" />
            <span>Space: <strong>{currentAlgoData.complexity.space}</strong></span>
          </div>
          <div className="vis-comp-badge">
            {currentAlgoData.stable ? (
              <span className="text-emerald-400"><ShieldCheck className="w-3.5 h-3.5 inline mr-1" /> Stable</span>
            ) : (
              <span className="text-rose-400"><ShieldAlert className="w-3.5 h-3.5 inline mr-1" /> Unstable</span>
            )}
          </div>
        </div>
      </div>

      {/* Controls Bar */}
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

      {/* Workspace */}
      <div className="visualizer-workspace-card">
        {/* Dedicated Visualization Component */}
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

        {/* Non-Dedicated Auxiliary Views */}
        {algoId !== 'merge-sort' && algoId !== 'quick-sort' && algoId !== 'heap-sort' && (
          <>
            {currentFrame?.countArray && currentFrame.countArray.length > 0 && (
              <div className="count-array-view-box">
                <span className="count-title">Frequency Count Array:</span>
                <div className="count-values-row">
                  {currentFrame.countArray.slice(0, 15).map((c, idx) => (
                    <div key={idx} className="count-item">
                      <span className="c-idx">{idx + (currentFrame.minOffset || 0)}</span>
                      <span className="c-val">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentFrame?.buckets && currentFrame.buckets.length > 0 && (
              <div className="buckets-view-box">
                <span className="buckets-title">Floating Buckets:</span>
                <div className="buckets-grid">
                  {currentFrame.buckets.map((b, bIdx) => (
                    <div key={bIdx} className="bucket-card">
                      <span className="bucket-num">Bucket #{bIdx + 1}</span>
                      <span className="bucket-items">[{b.join(', ')}]</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="operation-banner">
              <div className="operation-text-box">
                <span className="op-label">Current Action:</span>
                <span className="op-text">{currentFrame?.description || 'Press Start to begin animation'}</span>
              </div>
              {currentFrame?.pass > 0 && (
                <span className="pass-badge">Pass {currentFrame.pass}</span>
              )}
            </div>

            <div className="vis-stats-bar">
              <div className="stat-pill">
                <BarChart2 className="w-4 h-4 text-amber-400 inline mr-1.5" />
                <span>Comparisons: <strong>{currentFrame?.comparisonsCount || 0}</strong></span>
              </div>
              <div className="stat-pill">
                <Layers className="w-4 h-4 text-rose-400 inline mr-1.5" />
                <span>Swaps / Writes: <strong>{currentFrame?.swapsCount || 0}</strong></span>
              </div>
              <div className="stat-pill">
                <span>Step Progress: <strong>{currentStepIdx + 1}</strong> / {steps.length}</span>
              </div>
              {isCompleted && (
                <div className="stat-pill completed-pill font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 inline mr-1" /> Array Sorted!
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Floating Quick Playback Controller Dock */}
      <div className="floating-playback-dock">
        <div className="dock-step-badge">
          Step <strong className="text-amber-400">{currentStepIdx + 1}</strong> / {steps.length || 1}
        </div>

        <div className="dock-buttons">
          <button 
            onClick={() => setCurrentStepIdx(p => Math.max(0, p - 1))}
            disabled={isPlaying || currentStepIdx === 0}
            className="dock-btn btn-secondary"
            title="Previous Step (Left Arrow)"
          >
            <SkipBack className="w-4 h-4 mr-1" /> Prev
          </button>

          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`dock-btn ${isPlaying ? 'btn-warning' : 'btn-primary'}`}
            disabled={isCompleted && !isPlaying}
            title={isPlaying ? "Pause (Spacebar)" : "Start (Spacebar)"}
          >
            {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isPlaying ? 'Pause' : 'Start'}
          </button>

          <button 
            onClick={() => setCurrentStepIdx(p => Math.min(steps.length - 1, p + 1))}
            disabled={isPlaying || isCompleted}
            className="dock-btn btn-accent"
            title="Next Step (Right Arrow)"
          >
            Next <SkipForward className="w-4 h-4 ml-1" />
          </button>

          <button 
            onClick={() => { setCurrentStepIdx(0); setIsPlaying(false); }}
            className="dock-btn btn-icon"
            title="Reset (Key R)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="dock-keyboard-tip hidden lg:flex">
          <span>Keyboard: <kbd className="dock-kbd">←</kbd> <kbd className="dock-kbd">→</kbd> <kbd className="dock-kbd">Space</kbd></span>
        </div>
      </div>
    </div>
  );
}

