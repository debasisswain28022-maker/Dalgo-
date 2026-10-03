import React from 'react';
import { ArrowDown, CheckCircle2, ShieldCheck, HelpCircle, GitFork, Cpu, Layers, Check } from 'lucide-react';

export default function QuickSortVisualizer({
  currentStep,
  pivotStrategy,
  onPivotStrategyChange,
  originalArray = []
}) {
  if (!currentStep) {
    return <div className="qs-vis-empty">Press Start to begin Quick Sort visualization</div>;
  }

  const {
    phase = 'INITIAL ARRAY',
    array = [],
    sortedIndices = [],
    activeRange = [0, array.length - 1],
    pivotIdx = null,
    pivotVal = null,
    pointerI = -1,
    pointerJ = -1,
    comparedValues = null,
    leftPartition = null,
    rightPartition = null,
    codeLine = 1,
    description = '',
    treeStructure = [],
    comparisonsCount = 0,
    swapsCount = 0,
    partitionsCount = 0
  } = currentStep;

  const [low, high] = activeRange || [0, array.length - 1];

  // Helper to determine individual element status style
  const getElementStatus = (idx) => {
    if (sortedIndices.includes(idx)) return 'sorted';
    if (pivotIdx === idx) return 'pivot';
    if (idx === pointerJ) return 'current-j';
    if (idx === pointerI) return 'pointer-i';

    // If currently partitioning, check if in active partition range
    if (idx >= low && idx <= high) {
      if (pointerI !== -1 && idx <= pointerI) return 'less-than-pivot';
      return 'active-range';
    }
    return 'inactive';
  };

  return (
    <div className="quick-sort-visualizer-container">
      {/* Top Banner Toolbar */}
      <div className="qs-header-toolbar">
        <div className="strategy-selector-box">
          <label htmlFor="pivot-strategy-select" className="qs-label">Pivot Strategy:</label>
          <select 
            id="pivot-strategy-select"
            value={pivotStrategy}
            onChange={(e) => onPivotStrategyChange(e.target.value)}
            className="qs-dropdown"
          >
            <option value="last">Last Element Pivot (Lomuto)</option>
            <option value="first">First Element Pivot</option>
            <option value="middle">Middle Element Pivot</option>
            <option value="random">Random Element Pivot</option>
          </select>
        </div>

        <div className="qs-phase-badge">
          <span className="qs-phase-title">PHASE: {phase}</span>
        </div>
      </div>

      {/* Main Single-Screen Dashboard Grid */}
      <div className="qs-dashboard-grid">
        {/* LEFT COLUMN: Visual Representations */}
        <div className="qs-column-visuals">
          {/* 1. Array Display with Pointer Annotations */}
          <div className="qs-array-display-card">
            <div className="qs-card-title">
              <span>Active Subarray Range: [{low} .. {high}]</span>
            </div>

            <div className="qs-boxes-row">
              {array.map((val, idx) => {
                const status = getElementStatus(idx);
                const isPivot = pivotIdx === idx;
                const isI = pointerI === idx;
                const isJ = pointerJ === idx;
                const isSorted = sortedIndices.includes(idx);

                return (
                  <div key={idx} className={`qs-element-col status-${status}`}>
                    <div className="qs-top-marker">
                      {isPivot && (
                        <span className="marker-pivot-tag animate-bounce">
                          PIVOT
                        </span>
                      )}
                    </div>

                    <div className="qs-value-box">
                      <span className="qs-val">{val}</span>
                      {isSorted && <Check className="w-3.5 h-3.5 text-emerald-400 absolute top-1 right-1" />}
                    </div>

                    <span className="qs-idx-label">idx: {idx}</span>

                    <div className="qs-bottom-markers">
                      {isI && (
                        <div className="pointer-tag pointer-tag-i" title="Pointer i (Boundary of elements < pivot)">
                          <ArrowDown className="w-3 h-3 inline" /> i = {pointerI}
                        </div>
                      )}
                      {isJ && (
                        <div className="pointer-tag pointer-tag-j" title="Pointer j (Current element scanner)">
                          <ArrowDown className="w-3 h-3 inline" /> j = {pointerJ}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="qs-legend-row">
              <div className="legend-chip"><span className="legend-dot dot-pivot"></span> Pivot</div>
              <div className="legend-chip"><span className="legend-dot dot-current"></span> Scanner j</div>
              <div className="legend-chip"><span className="legend-dot dot-boundary"></span> Boundary i</div>
              <div className="legend-chip"><span className="legend-dot dot-less"></span> Less than Pivot</div>
              <div className="legend-chip"><span className="legend-dot dot-sorted"></span> Sorted</div>
            </div>
          </div>

          {/* 2. Three Partitions View */}
          {(pivotVal !== null || leftPartition !== null || rightPartition !== null) && (
            <div className="qs-three-partitions-card">
              <h4 className="qs-card-subheading">Partition Separation Result</h4>
              <div className="three-partitions-grid">
                <div className="partition-box box-less">
                  <div className="partition-header">
                    <span className="part-tag">LESS THAN PIVOT (&lt; {pivotVal})</span>
                  </div>
                  <div className="partition-items">
                    {leftPartition ? (
                      leftPartition.length > 0 ? (
                        leftPartition.map((v, i) => <span key={i} className="part-chip chip-less">{v}</span>)
                      ) : (
                        <span className="empty-text">None</span>
                      )
                    ) : (
                      <span className="empty-text">Building partition...</span>
                    )}
                  </div>
                </div>

                <div className="partition-box box-pivot">
                  <div className="partition-header">
                    <span className="part-tag">FIXED PIVOT</span>
                  </div>
                  <div className="partition-items">
                    {pivotVal !== null ? (
                      <span className="part-chip chip-pivot-fixed animate-pulse">
                        {pivotVal} (idx: {pivotIdx})
                      </span>
                    ) : (
                      <span className="empty-text">None</span>
                    )}
                  </div>
                </div>

                <div className="partition-box box-greater">
                  <div className="partition-header">
                    <span className="part-tag">GREATER THAN PIVOT (&gt;= {pivotVal})</span>
                  </div>
                  <div className="partition-items">
                    {rightPartition ? (
                      rightPartition.length > 0 ? (
                        rightPartition.map((v, i) => <span key={i} className="part-chip chip-greater">{v}</span>)
                      ) : (
                        <span className="empty-text">None</span>
                      )
                    ) : (
                      <span className="empty-text">Building partition...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Recursion Tree Visual Graph */}
          {treeStructure.length > 0 && (
            <div className="qs-recursion-tree-card">
              <div className="qs-tree-header">
                <h4 className="qs-card-subheading"><GitFork className="w-4 h-4 text-indigo-400 inline mr-1.5" /> Recursion Tree</h4>
                <span className="qs-tree-count">{treeStructure.length} Nodes</span>
              </div>

              <div className="qs-tree-graph">
                {treeStructure.map(node => (
                  <div
                    key={node.id}
                    className={`qs-tree-node ${node.status === 'completed' ? 'completed' : 'active'}`}
                  >
                    <span className="node-range">Range [{node.range[0]}..{node.range[1]}]</span>
                    <span className="node-values">[{node.values.join(', ')}]</span>
                    {node.pivotVal !== null && (
                      <span className="node-pivot">Pivot = {node.pivotVal}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Logic, Pseudocode & Explanation */}
        <div className="qs-column-logic">
          {/* 1. Dynamic Explanation Panel */}
          <div className="qs-explanation-panel">
            <div className="explanation-header">
              <HelpCircle className="w-5 h-5 text-amber-400 inline mr-2" />
              <span className="font-bold uppercase tracking-wider text-xs">WHAT IS HAPPENING?</span>
            </div>
            <p className="explanation-text">{description}</p>
          </div>

          {/* 2. Pseudocode Line Highlight Panel */}
          <div className="qs-panel-card code-panel font-mono">
            <h4 className="qs-panel-title font-sans">ALGORITHM PSEUDOCODE</h4>
            <div className="pseudocode-lines">
              <div className={`code-line ${codeLine === 1 ? 'active-line' : ''}`}>
                <span className="line-num">1</span> QUICK_SORT(A, low, high)
              </div>
              <div className={`code-line ${codeLine === 2 ? 'active-line' : ''}`}>
                <span className="line-num">2</span> &nbsp;&nbsp;if low &lt; high then
              </div>
              <div className={`code-line ${codeLine === 4 ? 'active-line' : ''}`}>
                <span className="line-num">3</span> &nbsp;&nbsp;&nbsp;&nbsp;p = PARTITION(A, low, high)
              </div>
              <div className={`code-line ${codeLine === 5 ? 'active-line' : ''}`}>
                <span className="line-num">4</span> &nbsp;&nbsp;&nbsp;&nbsp;QUICK_SORT(A, low, p - 1)
              </div>
              <div className={`code-line ${codeLine === 6 ? 'active-line' : ''}`}>
                <span className="line-num">5</span> &nbsp;&nbsp;&nbsp;&nbsp;QUICK_SORT(A, p + 1, high)
              </div>
            </div>
          </div>

          {/* 3. Partition Stats Panel */}
          <div className="qs-panel-card">
            <h4 className="qs-panel-title">PARTITION INFORMATION</h4>
            <div className="qs-panel-rows">
              <div className="qs-panel-row">
                <span className="qs-row-label">Pivot Value:</span>
                <span className="qs-row-val text-purple-400 font-bold">{pivotVal !== null ? pivotVal : 'None'}</span>
              </div>
              <div className="qs-panel-row">
                <span className="qs-row-label">Pivot Index:</span>
                <span className="qs-row-val text-purple-400">{pivotIdx !== null ? pivotIdx : '-'}</span>
              </div>
              <div className="qs-panel-row">
                <span className="qs-row-label">Pointer i (Boundary):</span>
                <span className="qs-row-val text-blue-400">{pointerI}</span>
              </div>
              <div className="qs-panel-row">
                <span className="qs-row-label">Pointer j (Scanner):</span>
                <span className="qs-row-val text-amber-400">{pointerJ}</span>
              </div>
              <div className="qs-panel-row">
                <span className="qs-row-label">Comparisons:</span>
                <span className="qs-row-val text-amber-400">{comparisonsCount}</span>
              </div>
              <div className="qs-panel-row">
                <span className="qs-row-label">Swaps:</span>
                <span className="qs-row-val text-rose-400">{swapsCount}</span>
              </div>
            </div>
          </div>

          {/* 4. Complexity & Completion */}
          <div className="qs-complexity-note-box">
            <span className="comp-tag best-avg">Best & Avg: O(n log n)</span>
            <span className="comp-tag worst">Worst: O(n²)</span>
          </div>

          {phase === 'COMPLETED' && (
            <div className="qs-completed-summary-card">
              <h3 className="summary-title"><CheckCircle2 className="w-5 h-5 text-emerald-400 inline mr-1.5" /> QUICK SORT COMPLETED ✓</h3>
              <div className="summary-arrays-row">
                <div>Original: <strong>[{originalArray.join(', ')}]</strong></div>
                <div>Sorted: <strong className="text-emerald-400">[{array.join(', ')}]</strong></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

