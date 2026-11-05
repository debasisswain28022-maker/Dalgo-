import React, { useState, useEffect, useMemo } from 'react';
import VisualizationControls from '../common/VisualizationControls';
import AlgorithmExecutionPanel from '../common/AlgorithmExecutionPanel';
import { generateKnapsackSteps } from './logic';
import {
  Package,
  Scale,
  Plus,
  Trash2,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';

const SAMPLES = [
  {
    name: 'Standard Example (Prompt)',
    capacity: 50,
    items: [
      { id: 'I1', name: 'Item 1', weight: 10, value: 60 },
      { id: 'I2', name: 'Item 2', weight: 20, value: 100 },
      { id: 'I3', name: 'Item 3', weight: 30, value: 120 }
    ]
  },
  {
    name: 'Five Commodities',
    capacity: 60,
    items: [
      { id: 'I1', name: 'Gold Dust', weight: 10, value: 200 },
      { id: 'I2', name: 'Silver Ore', weight: 20, value: 240 },
      { id: 'I3', name: 'Copper Grain', weight: 30, value: 150 },
      { id: 'I4', name: 'Platinum Flakes', weight: 15, value: 360 },
      { id: 'I5', name: 'Titanium Shards', weight: 25, value: 200 }
    ]
  },
  {
    name: 'Tight Capacity',
    capacity: 25,
    items: [
      { id: 'I1', name: 'Item A', weight: 18, value: 72 },
      { id: 'I2', name: 'Item B', weight: 15, value: 90 },
      { id: 'I3', name: 'Item C', weight: 10, value: 50 },
      { id: 'I4', name: 'Item D', weight: 12, value: 84 }
    ]
  }
];

export default function KnapsackVisualizer() {
  const [selectedSampleName, setSelectedSampleName] = useState(SAMPLES[0].name);
  const [capacity, setCapacity] = useState(50);
  const [items, setItems] = useState([
    { id: 'I1', name: 'Item 1', weight: 10, value: 60 },
    { id: 'I2', name: 'Item 2', weight: 20, value: 100 },
    { id: 'I3', name: 'Item 3', weight: 30, value: 120 }
  ]);

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);

  // Generate steps from current configuration
  const { steps } = useMemo(() => {
    return generateKnapsackSteps(items, capacity);
  }, [items, capacity]);

  // Current frame snapshot
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
    setCapacity(sample.capacity);
    setItems(JSON.parse(JSON.stringify(sample.items)));
    setCurrentStepIdx(0);
  };

  // Add Item
  const handleAddItem = () => {
    if (items.length >= 8) return;
    setIsPlaying(false);
    const newIdx = items.length + 1;
    setItems([
      ...items,
      { id: `I${newIdx}`, name: `Item ${newIdx}`, weight: 15, value: 80 }
    ]);
    setCurrentStepIdx(0);
  };

  // Remove Item
  const handleRemoveItem = (idx) => {
    if (items.length <= 2) return;
    setIsPlaying(false);
    const updated = items.filter((_, i) => i !== idx);
    setItems(updated);
    setCurrentStepIdx(0);
  };

  // Edit Item
  const handleUpdateItem = (idx, field, val) => {
    setIsPlaying(false);
    const updated = [...items];
    const num = Math.max(1, Number(val) || 1);
    updated[idx] = { ...updated[idx], [field]: num };
    setItems(updated);
    setCurrentStepIdx(0);
  };

  // Control handlers
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

  const currentCapacity = currentFrame.capacity || capacity;
  const currentRemaining = currentFrame.remainingCapacity !== undefined ? currentFrame.remainingCapacity : capacity;
  const currentProfit = currentFrame.totalProfit || 0;
  const currentWeight = currentFrame.totalWeight || 0;
  const fillPercentage = currentCapacity > 0 ? Math.min(100, (currentWeight / currentCapacity) * 100) : 0;

  return (
    <div className="gdp-vis-wrapper">
      {/* Configuration Card */}
      <div className="gdp-config-card">
        <div className="gdp-config-header">
          <div className="gdp-config-title">
            <Package className="w-5 h-5 text-indigo-400" />
            <span>Knapsack Input Configuration</span>
          </div>
          <div className="gdp-capacity-input-wrap">
            <Scale className="w-4 h-4 text-cyan-400 mr-1.5" />
            <label className="text-sm font-semibold text-slate-300 mr-2">Knapsack Capacity (W):</label>
            <input
              type="number"
              min="5"
              max="200"
              value={capacity}
              onChange={(e) => {
                setIsPlaying(false);
                setCapacity(Math.max(5, Number(e.target.value) || 5));
                setCurrentStepIdx(0);
              }}
              className="gdp-input gdp-input-sm w-24 text-center font-bold"
            />
          </div>
        </div>

        {/* Items Input Table */}
        <div className="gdp-items-input-table">
          <div className="gdp-items-table-header">
            <span>Item Name</span>
            <span>Weight (kg)</span>
            <span>Value ($)</span>
            <span>Ratio ($/kg)</span>
            <span>Action</span>
          </div>
          <div className="gdp-items-table-body">
            {items.map((item, idx) => (
              <div key={item.id} className="gdp-items-table-row">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[idx].name = e.target.value;
                    setItems(updated);
                  }}
                  className="gdp-input gdp-input-sm"
                />
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={item.weight}
                  onChange={(e) => handleUpdateItem(idx, 'weight', e.target.value)}
                  className="gdp-input gdp-input-sm text-center"
                />
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={item.value}
                  onChange={(e) => handleUpdateItem(idx, 'value', e.target.value)}
                  className="gdp-input gdp-input-sm text-center"
                />
                <div className="gdp-ratio-preview">
                  {(item.value / item.weight).toFixed(2)}
                </div>
                <button
                  onClick={() => handleRemoveItem(idx)}
                  disabled={items.length <= 2}
                  className="gdp-btn-icon-danger"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          {items.length < 8 && (
            <button onClick={handleAddItem} className="gdp-add-item-btn">
              <Plus className="w-4 h-4 mr-1" /> Add Another Item
            </button>
          )}
        </div>
      </div>

      {/* Main Visualization Stage */}
      <div className="gdp-stage-grid">
        {/* Left Side: Items & Ratios Table with Animations */}
        <div className="gdp-stage-card">
          <div className="gdp-stage-card-title">
            <ArrowUpDown className="w-4 h-4 text-cyan-400" />
            <span>Items Table & Greedy Ratio Sort</span>
          </div>

          <div className="gdp-table-container">
            <table className="gdp-vis-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Weight (w)</th>
                  <th>Value (v)</th>
                  <th>Ratio (v/w)</th>
                  <th>Fraction Taken</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentFrame.items.map((item, idx) => {
                  const isActive = currentFrame.activeItemIdx === idx;
                  const isCompared = currentFrame.comparedIndices?.includes(idx);
                  let rowClass = '';
                  if (isActive) rowClass = 'gdp-row-active';
                  else if (isCompared) rowClass = 'gdp-row-compared';
                  else if (item.status === 'full') rowClass = 'gdp-row-full';
                  else if (item.status === 'partial') rowClass = 'gdp-row-partial';
                  else if (item.status === 'rejected') rowClass = 'gdp-row-rejected';

                  return (
                    <tr key={item.id} className={rowClass}>
                      <td className="font-semibold text-slate-200">
                        <span className="gdp-item-pill">{item.id}</span> {item.name}
                      </td>
                      <td>{item.weight}</td>
                      <td>${item.value}</td>
                      <td>
                        {item.ratio !== null ? (
                          <span className={`gdp-ratio-badge ${isActive ? 'pulse' : ''}`}>
                            {item.ratio.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td>
                        {item.fraction > 0 ? (
                          <span className="font-bold text-emerald-400">
                            {(item.fraction * 100).toFixed(1)}% ({item.fraction})
                          </span>
                        ) : item.status === 'rejected' ? (
                          <span className="text-rose-400 font-semibold">0% (0.0)</span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td>
                        {item.status === 'full' && (
                          <span className="gdp-status-badge gdp-badge-emerald">Full 100%</span>
                        )}
                        {item.status === 'partial' && (
                          <span className="gdp-status-badge gdp-badge-amber">Partial Fraction</span>
                        )}
                        {item.status === 'rejected' && (
                          <span className="gdp-status-badge gdp-badge-rose">Rejected</span>
                        )}
                        {(!item.status || item.status === 'pending') && (
                          <span className="gdp-status-badge gdp-badge-slate">Pending</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Ratio Calculation Explanation Box */}
          {currentFrame.type === 'calc_ratio' && currentFrame.activeItemIdx !== null && (
            <div className="gdp-formula-callout animate-fadeIn">
              <Sparkles className="w-4 h-4 text-amber-400 mr-2" />
              <span>
                <strong>Step 2 Calculation:</strong> {currentFrame.items[currentFrame.activeItemIdx].name} Ratio = Value (${currentFrame.items[currentFrame.activeItemIdx].value}) ÷ Weight ({currentFrame.items[currentFrame.activeItemIdx].weight}kg) = {(currentFrame.items[currentFrame.activeItemIdx].value / currentFrame.items[currentFrame.activeItemIdx].weight).toFixed(2)}
              </span>
            </div>
          )}

          {currentFrame.type === 'sort_compare' && (
            <div className="gdp-formula-callout gdp-callout-purple animate-fadeIn">
              <ArrowUpDown className="w-4 h-4 text-purple-400 mr-2" />
              <span>
                <strong>Step 3 Ratio Sorting:</strong> Comparing Item {currentFrame.items[currentFrame.comparedIndices[0]]?.name} (Ratio {currentFrame.items[currentFrame.comparedIndices[0]]?.ratio}) vs Item {currentFrame.items[currentFrame.comparedIndices[1]]?.name} (Ratio {currentFrame.items[currentFrame.comparedIndices[1]]?.ratio})
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Knapsack Visual Container & Dynamic Counters */}
        <div className="gdp-stage-card">
          <div className="gdp-stage-card-title">
            <Package className="w-4 h-4 text-emerald-400" />
            <span>Knapsack Container & Accumulated Profit</span>
          </div>

          {/* Metric Dashboard */}
          <div className="gdp-knapsack-metrics">
            <div className="gdp-metric-card">
              <div className="gdp-metric-label">Max Capacity</div>
              <div className="gdp-metric-val text-indigo-400">{currentCapacity} kg</div>
            </div>
            <div className="gdp-metric-card">
              <div className="gdp-metric-label">Remaining Space</div>
              <div className="gdp-metric-val text-cyan-400">{currentRemaining.toFixed(1)} kg</div>
            </div>
            <div className="gdp-metric-card">
              <div className="gdp-metric-label">Current Weight</div>
              <div className="gdp-metric-val text-amber-400">{currentWeight.toFixed(1)} kg</div>
            </div>
            <div className="gdp-metric-card">
              <div className="gdp-metric-label">Total Profit</div>
              <div className="gdp-metric-val text-emerald-400">${currentProfit.toFixed(2)}</div>
            </div>
          </div>

          {/* Visual Container Representation */}
          <div className="gdp-knapsack-bucket-wrapper">
            <div className="gdp-bucket-header">
              <span className="font-semibold text-slate-300">Knapsack Fill Level</span>
              <span className="font-mono text-cyan-400 font-bold">{fillPercentage.toFixed(1)}%</span>
            </div>

            <div className="gdp-knapsack-bucket">
              {/* Stacked Fill Segments */}
              {currentFrame.knapsackContents && currentFrame.knapsackContents.length > 0 ? (
                <div className="gdp-bucket-stack">
                  {currentFrame.knapsackContents.map((kc, idx) => {
                    const segmentHeight = (kc.weightTaken / currentCapacity) * 100;
                    return (
                      <div
                        key={idx}
                        className={`gdp-bucket-segment gdp-segment-${kc.status}`}
                        style={{ height: `${Math.max(14, segmentHeight)}%` }}
                        title={`${kc.name}: ${kc.weightTaken}kg for $${kc.valueGained} (${(kc.fraction * 100).toFixed(1)}%)`}
                      >
                        <div className="gdp-segment-info">
                          <span className="gdp-segment-title">{kc.name}</span>
                          <span className="gdp-segment-details">
                            {kc.weightTaken}kg • ${kc.valueGained.toFixed(1)}
                            {kc.status === 'partial' && ` (${(kc.fraction * 100).toFixed(0)}%)`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="gdp-bucket-empty">
                  <Package className="w-8 h-8 text-slate-600 mb-1" />
                  <span>Knapsack is empty</span>
                </div>
              )}
            </div>

            {/* Capacity Bar */}
            <div className="gdp-capacity-bar-track">
              <div
                className="gdp-capacity-bar-fill"
                style={{ width: `${fillPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Selected Items Manifest */}
          <div className="gdp-manifest-wrapper">
            <div className="gdp-manifest-title">Selected Items Breakdown:</div>
            {currentFrame.knapsackContents.length > 0 ? (
              <div className="gdp-manifest-chips">
                {currentFrame.knapsackContents.map((item, idx) => (
                  <div
                    key={idx}
                    className={`gdp-manifest-chip ${item.status === 'full' ? 'chip-full' : 'chip-partial'}`}
                  >
                    <span className="font-bold">{item.name}</span>
                    <span className="gdp-chip-badge">
                      {item.status === 'full' ? '100%' : `${(item.fraction * 100).toFixed(1)}%`}
                    </span>
                    <span className="text-xs text-slate-300">
                      +{item.weightTaken}kg | +${item.valueGained}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic">No items added to knapsack yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Live Algorithm Execution & Pseudocode Panel */}
      <AlgorithmExecutionPanel
        algoId="fractional-knapsack"
        currentStep={currentFrame}
      />

      {/* Common Interactive Controls */}
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
        currentSampleName={selectedSampleName}
        onSelectSample={handleSelectSample}
        stepDescription={currentFrame.description}
        stepType={currentFrame.type}
      />
    </div>
  );
}
