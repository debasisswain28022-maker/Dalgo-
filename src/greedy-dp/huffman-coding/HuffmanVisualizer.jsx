import React, { useState, useEffect, useMemo } from 'react';
import VisualizationControls from '../common/VisualizationControls';
import AlgorithmExecutionPanel from '../common/AlgorithmExecutionPanel';
import { generateHuffmanSteps, decodeHuffman } from './logic';
import {
  Binary,
  ListTree,
  KeyRound,
  Sparkles,
  Layers,
  Cpu,
  RefreshCw
} from 'lucide-react';

const SAMPLES = [
  {
    name: 'Prompt Example (A-F)',
    mode: 'manual',
    frequencies: [
      { char: 'A', freq: 5 },
      { char: 'B', freq: 9 },
      { char: 'C', freq: 12 },
      { char: 'D', freq: 13 },
      { char: 'E', freq: 16 },
      { char: 'F', freq: 45 }
    ]
  },
  {
    name: 'Text: "ABRACADABRA"',
    mode: 'text',
    text: 'ABRACADABRA'
  },
  {
    name: 'Text: "BEEP BOOP BEER"',
    mode: 'text',
    text: 'BEEP BOOP BEER'
  },
  {
    name: 'Text: "ALGORITHM"',
    mode: 'text',
    text: 'ALGORITHM'
  }
];

export default function HuffmanVisualizer() {
  const [inputMode, setInputMode] = useState('manual'); // 'text' | 'manual'
  const [textInput, setTextInput] = useState('ABRACADABRA');
  const [manualFrequencies, setManualFrequencies] = useState([
    { char: 'A', freq: 5 },
    { char: 'B', freq: 9 },
    { char: 'C', freq: 12 },
    { char: 'D', freq: 13 },
    { char: 'E', freq: 16 },
    { char: 'F', freq: 45 }
  ]);

  const [currentSampleName, setCurrentSampleName] = useState(SAMPLES[0].name);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);

  // Decoder state
  const [userBinaryInput, setUserBinaryInput] = useState('');

  // Generate steps
  const { steps, root, codes, encodedText } = useMemo(() => {
    if (inputMode === 'text') {
      return generateHuffmanSteps(textInput, true);
    } else {
      return generateHuffmanSteps(manualFrequencies, false);
    }
  }, [inputMode, textInput, manualFrequencies]);

  const currentFrame = steps[currentStepIdx] || steps[0];

  // Sync user binary input with encodedText when generated
  useEffect(() => {
    if (encodedText) {
      setUserBinaryInput(encodedText);
    }
  }, [encodedText]);

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
    setCurrentSampleName(sample.name);
    setInputMode(sample.mode);
    if (sample.mode === 'text') {
      setTextInput(sample.text);
    } else {
      setManualFrequencies(JSON.parse(JSON.stringify(sample.frequencies)));
    }
    setCurrentStepIdx(0);
  };

  const handleUpdateFreq = (idx, field, val) => {
    setIsPlaying(false);
    const updated = [...manualFrequencies];
    if (field === 'char') {
      updated[idx].char = (val || 'X').slice(-1).toUpperCase();
    } else {
      updated[idx].freq = Math.max(1, Number(val) || 1);
    }
    setManualFrequencies(updated);
    setCurrentStepIdx(0);
  };

  const handleAddManualRow = () => {
    if (manualFrequencies.length >= 8) return;
    setIsPlaying(false);
    const char = String.fromCharCode(65 + manualFrequencies.length);
    setManualFrequencies([...manualFrequencies, { char, freq: 10 }]);
    setCurrentStepIdx(0);
  };

  const handleRemoveManualRow = (idx) => {
    if (manualFrequencies.length <= 2) return;
    setIsPlaying(false);
    setManualFrequencies(manualFrequencies.filter((_, i) => i !== idx));
    setCurrentStepIdx(0);
  };

  // Interactive decoding
  const decodedResult = useMemo(() => {
    const activeTreeRoot = currentFrame.root || root;
    return decodeHuffman(userBinaryInput, activeTreeRoot);
  }, [userBinaryInput, currentFrame.root, root]);

  // Controls
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
    setCurrentStepIdx((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStepIdx((prev) => Math.max(prev - 1, 0));
  };

  // Render SVG Binary Tree helper
  const renderTreeEdges = (node) => {
    if (!node || node.isLeaf) return null;
    const edges = [];
    if (node.left) {
      edges.push(
        <g key={`edge-l-${node.id}`}>
          <line
            x1={`${node.x}%`}
            y1={node.y}
            x2={`${node.left.x}%`}
            y2={node.left.y}
            className="gdp-tree-edge"
          />
          <circle
            cx={`${(node.x + node.left.x) / 2}%`}
            cy={(node.y + node.left.y) / 2}
            r="11"
            className="gdp-edge-badge-bg"
          />
          <text
            x={`${(node.x + node.left.x) / 2}%`}
            y={(node.y + node.left.y) / 2 + 4}
            className="gdp-edge-label"
          >
            0
          </text>
          {renderTreeEdges(node.left)}
        </g>
      );
    }
    if (node.right) {
      edges.push(
        <g key={`edge-r-${node.id}`}>
          <line
            x1={`${node.x}%`}
            y1={node.y}
            x2={`${node.right.x}%`}
            y2={node.right.y}
            className="gdp-tree-edge"
          />
          <circle
            cx={`${(node.x + node.right.x) / 2}%`}
            cy={(node.y + node.right.y) / 2}
            r="11"
            className="gdp-edge-badge-bg"
          />
          <text
            x={`${(node.x + node.right.x) / 2}%`}
            y={(node.y + node.right.y) / 2 + 4}
            className="gdp-edge-label"
          >
            1
          </text>
          {renderTreeEdges(node.right)}
        </g>
      );
    }
    return edges;
  };

  const renderTreeNodes = (node) => {
    if (!node) return null;
    const isLeaf = node.isLeaf;
    return (
      <g key={`node-${node.id}`}>
        <circle
          cx={`${node.x}%`}
          cy={node.y}
          r={isLeaf ? 22 : 18}
          className={`gdp-tree-node-circle ${isLeaf ? 'node-leaf' : 'node-internal'}`}
        />
        <text
          x={`${node.x}%`}
          y={node.y - (isLeaf ? 2 : -4)}
          className={`gdp-tree-node-text ${isLeaf ? 'text-char' : 'text-freq'}`}
        >
          {isLeaf ? (node.char === ' ' ? '␣' : node.char) : node.freq}
        </text>
        {isLeaf && (
          <text x={`${node.x}%`} y={node.y + 12} className="gdp-tree-node-subtext">
            freq: {node.freq}
          </text>
        )}
        {/* Binary code tag below leaf node */}
        {isLeaf && node.code && (
          <g>
            <rect
              x={`calc(${node.x}% - 22px)`}
              y={node.y + 26}
              width="44"
              height="18"
              rx="4"
              className="gdp-code-tag-bg"
            />
            <text x={`${node.x}%`} y={node.y + 39} className="gdp-tree-node-code">
              {node.code}
            </text>
          </g>
        )}
        {renderTreeNodes(node.left)}
        {renderTreeNodes(node.right)}
      </g>
    );
  };

  const activeTree = currentFrame.root || root;

  return (
    <div className="gdp-vis-wrapper">
      {/* Configuration Card */}
      <div className="gdp-config-card">
        <div className="gdp-config-header">
          <div className="gdp-config-title">
            <Binary className="w-5 h-5 text-indigo-400" />
            <span>Huffman Coding Input Configuration</span>
          </div>
          {/* Mode Switcher */}
          <div className="gdp-mode-toggle">
            <button
              onClick={() => {
                setIsPlaying(false);
                setInputMode('manual');
                setCurrentStepIdx(0);
              }}
              className={`gdp-mode-btn ${inputMode === 'manual' ? 'active' : ''}`}
            >
              Manual Frequencies (Prompt A-F)
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                setInputMode('text');
                setCurrentStepIdx(0);
              }}
              className={`gdp-mode-btn ${inputMode === 'text' ? 'active' : ''}`}
            >
              Text String Mode
            </button>
          </div>
        </div>

        {/* Input Bodies */}
        {inputMode === 'text' ? (
          <div className="gdp-text-input-group">
            <label className="text-sm font-semibold text-slate-300">
              Input Text String to Compress:
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={textInput}
                onChange={(e) => {
                  setIsPlaying(false);
                  setTextInput(e.target.value.toUpperCase());
                  setCurrentStepIdx(0);
                }}
                placeholder="Type text e.g. ABRACADABRA..."
                className="gdp-input flex-1 font-mono text-lg tracking-wider"
              />
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIdx(0);
                }}
                className="gdp-btn gdp-btn-primary"
              >
                <RefreshCw className="w-4 h-4 mr-1.5" />
                Generate Tree
              </button>
            </div>
          </div>
        ) : (
          <div className="gdp-manual-freq-box">
            <div className="text-sm font-semibold text-slate-300 mb-2">
              Character Frequency Distribution Table:
            </div>
            <div className="gdp-manual-freq-grid">
              {manualFrequencies.map((row, idx) => (
                <div key={idx} className="gdp-manual-freq-item">
                  <input
                    type="text"
                    maxLength={1}
                    value={row.char}
                    onChange={(e) => handleUpdateFreq(idx, 'char', e.target.value)}
                    className="gdp-input gdp-input-sm w-12 text-center font-bold"
                  />
                  <span className="text-slate-400 font-bold">:</span>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={row.freq}
                    onChange={(e) => handleUpdateFreq(idx, 'freq', e.target.value)}
                    className="gdp-input gdp-input-sm w-20 text-center"
                  />
                  <button
                    onClick={() => handleRemoveManualRow(idx)}
                    disabled={manualFrequencies.length <= 2}
                    className="gdp-btn-icon-danger"
                    title="Remove symbol"
                  >
                    ×
                  </button>
                </div>
              ))}
              {manualFrequencies.length < 8 && (
                <button onClick={handleAddManualRow} className="gdp-add-pill-btn">
                  + Add Symbol
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Visualization Stage */}
      <div className="gdp-stage-grid">
        {/* Left Side: Priority Queue & Frequencies */}
        <div className="gdp-stage-card">
          <div className="gdp-stage-card-title">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Min-Priority Queue & Character Frequencies</span>
          </div>

          {/* Min Priority Queue Visualizer */}
          <div className="gdp-pq-container">
            <div className="gdp-pq-title">
              Current Min-Priority Queue (Sorted Ascending by Frequency):
            </div>
            <div className="gdp-pq-strip">
              {currentFrame.priorityQueue && currentFrame.priorityQueue.length > 0 ? (
                currentFrame.priorityQueue.map((node, idx) => {
                  const isActive = currentFrame.activeNodeIds?.includes(node.id);
                  return (
                    <div
                      key={node.id}
                      className={`gdp-pq-card ${isActive ? 'pq-active' : ''} ${idx < 2 ? 'pq-smallest' : ''}`}
                    >
                      <div className="gdp-pq-pos">#{idx + 1}</div>
                      <div className="gdp-pq-char">
                        {node.isLeaf ? (node.char === ' ' ? '␣' : node.char) : 'Node'}
                      </div>
                      <div className="gdp-pq-freq">{node.freq}</div>
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-slate-500 py-3">Queue empty (Root node extracted)</div>
              )}
            </div>
          </div>

          {/* Frequency Table */}
          <div className="gdp-table-container mt-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Character Code Mapping Table
            </div>
            <table className="gdp-vis-table">
              <thead>
                <tr>
                  <th>Character</th>
                  <th>Frequency</th>
                  <th>Huffman Code</th>
                  <th>Code Length</th>
                </tr>
              </thead>
              <tbody>
                {currentFrame.frequencies.map((f) => {
                  const charCode = (currentFrame.codes && currentFrame.codes[f.char]) || (codes && codes[f.char]);
                  return (
                    <tr key={f.char}>
                      <td className="font-bold text-slate-200">
                        <span className="gdp-char-pill">{f.char === ' ' ? 'SPACE' : f.char}</span>
                      </td>
                      <td>{f.freq}</td>
                      <td>
                        {charCode ? (
                          <span className="gdp-binary-code-badge">{charCode}</span>
                        ) : (
                          <span className="text-slate-500">Generating...</span>
                        )}
                      </td>
                      <td>
                        {charCode ? `${charCode.length} bit${charCode.length > 1 ? 's' : ''}` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Binary Tree Visualization */}
        <div className="gdp-stage-card">
          <div className="gdp-stage-card-title">
            <ListTree className="w-4 h-4 text-emerald-400" />
            <span>Optimal Huffman Binary Tree (Left = 0, Right = 1)</span>
          </div>

          <div className="gdp-tree-svg-container">
            {activeTree ? (
              <svg className="gdp-tree-svg" viewBox="0 0 100 320" preserveAspectRatio="none">
                {renderTreeEdges(activeTree)}
                {renderTreeNodes(activeTree)}
              </svg>
            ) : (
              <div className="gdp-tree-placeholder">
                <Cpu className="w-8 h-8 text-slate-600 mb-2" />
                <span>Tree will form as minimum nodes combine</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Encoding & Interactive Decoding Panel */}
      <div className="gdp-compression-panel">
        <div className="gdp-stage-card">
          <div className="gdp-stage-card-title">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Compression Statistics & Text Encoding</span>
          </div>

          {/* Stats Metrics Bar */}
          <div className="gdp-compression-metrics">
            <div className="gdp-metric-card">
              <div className="gdp-metric-label">Original Bits (8-bit ASCII)</div>
              <div className="gdp-metric-val text-slate-300">
                {currentFrame.originalBits} bits
              </div>
            </div>
            <div className="gdp-metric-card">
              <div className="gdp-metric-label">Compressed Bits</div>
              <div className="gdp-metric-val text-cyan-400">
                {currentFrame.compressedBits} bits
              </div>
            </div>
            <div className="gdp-metric-card">
              <div className="gdp-metric-label">Storage Saved</div>
              <div className="gdp-metric-val text-emerald-400">
                {currentFrame.compressionRatio}%
              </div>
            </div>
            <div className="gdp-metric-card">
              <div className="gdp-metric-label">Compression Factor</div>
              <div className="gdp-metric-val text-indigo-400">
                {currentFrame.compressedBits > 0
                  ? `${(currentFrame.originalBits / currentFrame.compressedBits).toFixed(2)}x`
                  : '—'}
              </div>
            </div>
          </div>

          {/* Encoded Binary String Display */}
          <div className="gdp-encoded-text-wrapper">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Encoded Binary Stream (Concatenated Prefix Codes):
            </div>
            <div className="gdp-encoded-bitstream">
              {currentFrame.encodedText ? (
                currentFrame.originalText.split('').map((char, idx) => {
                  const code = codes[char] || '';
                  return (
                    <span key={idx} className="gdp-bit-group" title={`'${char}' -> ${code}`}>
                      <span className="gdp-bit-code">{code}</span>
                      <span className="gdp-bit-char">{char}</span>
                    </span>
                  );
                })
              ) : (
                <span className="text-slate-500 italic">Binary stream will appear upon completion</span>
              )}
            </div>
          </div>

          {/* Interactive Binary Stream Decoder */}
          <div className="gdp-decoder-card">
            <div className="flex items-center gap-2 mb-2">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-slate-200">Interactive Huffman Decoder</span>
              <span className="text-xs text-slate-400">(Type or paste binary bits 0/1 to decode in real-time)</span>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={userBinaryInput}
                onChange={(e) => setUserBinaryInput(e.target.value.replace(/[^01]/g, ''))}
                placeholder="Enter binary bits (e.g. 11000101)..."
                className="gdp-input flex-1 font-mono tracking-widest text-emerald-400"
              />
              <div className="gdp-decoded-output-box">
                <span className="text-xs text-slate-400 mr-2">Decoded Text:</span>
                <span className="font-bold font-mono text-cyan-300 text-base">
                  {decodedResult || '—'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Algorithm Execution & Pseudocode Panel */}
      <AlgorithmExecutionPanel
        algoId="huffman-coding"
        currentStep={currentFrame}
      />

      {/* Common Controls */}
      <VisualizationControls
        currentStepIdx={currentStepIdx}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        speed={speed}
        onPlay={() => setIsPlaying(true)}
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
        currentSampleName={currentSampleName}
        onSelectSample={handleSelectSample}
        stepDescription={currentFrame.description}
        stepType={currentFrame.type}
      />
    </div>
  );
}
