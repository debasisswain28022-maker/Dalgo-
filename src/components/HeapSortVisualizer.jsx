import React from 'react';
import { Check, CheckCircle2, ShieldCheck, HelpCircle, Layers, Cpu, ArrowDown } from 'lucide-react';

export default function HeapSortVisualizer({ currentStep, originalArray = [] }) {
  if (!currentStep) {
    return <div className="hs-vis-empty">Press Start to begin Heap Sort visualization</div>;
  }

  const {
    phase = 'INITIAL ARRAY',
    array = [],
    heapSize = array.length,
    sortedIndices = [],
    activeParentIdx = null,
    leftChildIdx = null,
    rightChildIdx = null,
    largestIdx = null,
    comparedValues = null,
    codeLine = 1,
    description = '',
    comparisonsCount = 0,
    swapsCount = 0,
    heapifyCount = 0
  } = currentStep;

  const totalElements = array.length;
  const heapPct = Math.round((heapSize / (totalElements || 1)) * 100);

  // Helper to determine node visual status
  const getNodeStatus = (idx) => {
    if (idx >= heapSize || sortedIndices.includes(idx)) return 'sorted';
    if (idx === largestIdx && (leftChildIdx !== null || rightChildIdx !== null)) return 'largest';
    if (idx === activeParentIdx) return 'parent';
    if (idx === leftChildIdx) return 'left-child';
    if (idx === rightChildIdx) return 'right-child';
    if (idx === 0) return 'root';
    return 'in-heap';
  };

  // Group binary heap nodes into level rows (0: 1 node, 1: 2 nodes, 2: 4 nodes, 3: 8 nodes)
  const displayTreeNodesCount = Math.min(totalElements, 15);
  const levels = [];
  let currIdx = 0;
  let levelDepth = 0;

  while (currIdx < displayTreeNodesCount && levelDepth < 4) {
    const levelSize = Math.pow(2, levelDepth);
    const levelNodes = [];

    for (let i = 0; i < levelSize && currIdx < displayTreeNodesCount; i++) {
      levelNodes.push({
        idx: currIdx,
        val: array[currIdx],
        status: getNodeStatus(currIdx)
      });
      currIdx++;
    }
    levels.push(levelNodes);
    levelDepth++;
  }

  return (
    <div className="heap-sort-visualizer-container">
      {/* Top Banner Toolbar */}
      <div className="hs-header-toolbar">
        <div className="hs-phase-badge">
          <span className="hs-phase-title">PHASE: {phase}</span>
        </div>

        {/* Heap Size Indicator Progress Bar */}
        <div className="hs-size-indicator">
          <span className="qs-label">Heap Size: <strong>{heapSize}</strong> / {totalElements}</span>
          <div className="hs-progress-track">
            <div className="hs-progress-fill" style={{ width: `${heapPct}%` }}></div>
          </div>
        </div>
      </div>

      {/* Main Single-Screen Dashboard Grid (Visuals on Left, Explanation & Code on Right) */}
      <div className="hs-dashboard-grid">
        {/* LEFT COLUMN: Visual Representations */}
        <div className="hs-column-visuals">
          {/* 1. Synchronized Array Representation */}
          <div className="hs-array-display-card">
            <div className="hs-card-header font-bold text-xs uppercase tracking-wider text-slate-400">
              <span>Array & Heap Boundary Mapping</span>
            </div>

            <div className="hs-array-boxes-row">
              {array.map((val, idx) => {
                const status = getNodeStatus(idx);
                const isInHeap = idx < heapSize;
                const isSorted = !isInHeap || sortedIndices.includes(idx);

                return (
                  <div 
                    key={idx} 
                    className={`hs-element-col status-${status} ${!isInHeap ? 'in-sorted-area' : ''}`}
                  >
                    <div className="hs-top-label">
                      {idx === activeParentIdx && <span className="label-parent">PARENT</span>}
                      {idx === leftChildIdx && <span className="label-left">LEFT</span>}
                      {idx === rightChildIdx && <span className="label-right">RIGHT</span>}
                      {idx === 0 && activeParentIdx !== 0 && isInHeap && <span className="label-root">ROOT</span>}
                    </div>

                    <div className="hs-value-box">
                      <span className="hs-val">{val}</span>
                      {isSorted && <Check className="w-3.5 h-3.5 text-emerald-400 absolute top-1 right-1" />}
                    </div>

                    <span className="hs-idx-label">idx: {idx}</span>
                  </div>
                );
              })}
            </div>

            <div className="hs-boundary-info">
              <span className="boundary-pill heap-pill">Active Heap: [{array.slice(0, heapSize).join(', ')}]</span>
              <span className="boundary-pill sorted-pill">Sorted Area: [{array.slice(heapSize).join(', ')}]</span>
            </div>
          </div>

          {/* 2. Synchronized Binary Heap Tree Display */}
          <div className="hs-tree-card">
            <h4 className="hs-card-subheading">Synchronized Binary Heap Tree</h4>
            <div className="hs-tree-nodes-container">
              {levels.map((levelNodes, lvlIdx) => (
                <div key={lvlIdx} className="hs-tree-level-row">
                  {levelNodes.map((node) => (
                    <div
                      key={node.idx}
                      className={`hs-tree-node status-${node.status}`}
                      title={`Index ${node.idx}: Value ${node.val}`}
                    >
                      <div className="tree-val">{node.val}</div>
                      <div className="tree-idx">idx: {node.idx}</div>

                      {node.idx === activeParentIdx && <span className="tree-node-badge badge-p">Parent</span>}
                      {node.idx === leftChildIdx && <span className="tree-node-badge badge-l">Left</span>}
                      {node.idx === rightChildIdx && <span className="tree-node-badge badge-r">Right</span>}
                      {node.idx === largestIdx && <span className="tree-node-badge badge-max">Max</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="hs-legend-row">
              <div className="legend-chip"><span className="legend-dot dot-parent"></span> Parent</div>
              <div className="legend-chip"><span className="legend-dot dot-left"></span> Left</div>
              <div className="legend-chip"><span className="legend-dot dot-right"></span> Right</div>
              <div className="legend-chip"><span className="legend-dot dot-largest"></span> Largest</div>
              <div className="legend-chip"><span className="legend-dot dot-sorted"></span> Sorted</div>
            </div>
          </div>

          {/* 3. Array ↔ Tree Index Mapping Formula */}
          <div className="hs-mapping-card">
            <div className="mapping-header">
              <span className="font-bold text-xs uppercase tracking-wider text-indigo-400">Index Formulas</span>
            </div>
            <div className="mapping-formula-grid">
              <div className="formula-item">
                <span className="formula-title">Parent(i):</span>
                <span className="formula-code">⌊(i - 1) / 2⌋</span>
              </div>
              <div className="formula-item">
                <span className="formula-title">Left(i):</span>
                <span className="formula-code">2i + 1</span>
              </div>
              <div className="formula-item">
                <span className="formula-title">Right(i):</span>
                <span className="formula-code">2i + 2</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Logic, Pseudocode & Explanation */}
        <div className="hs-column-logic">
          {/* 1. Dynamic Explanation Panel (Top of Right Column for Immediate Visibility) */}
          <div className="hs-explanation-panel">
            <div className="explanation-header">
              <HelpCircle className="w-5 h-5 text-amber-400 inline mr-2" />
              <span className="font-bold uppercase tracking-wider text-xs">WHAT IS HAPPENING?</span>
            </div>
            <p className="explanation-text">{description}</p>
          </div>

          {/* 2. Pseudocode Line Highlight Panel */}
          <div className="hs-panel-card code-panel font-mono">
            <h4 className="hs-panel-title font-sans">ALGORITHM PSEUDOCODE</h4>
            <div className="pseudocode-lines">
              <div className={`code-line ${codeLine === 1 ? 'active-line' : ''}`}>
                <span className="line-num">1</span> HEAP_SORT(A)
              </div>
              <div className={`code-line ${codeLine === 2 ? 'active-line' : ''}`}>
                <span className="line-num">2</span> &nbsp;&nbsp;BUILD_MAX_HEAP(A)
              </div>
              <div className={`code-line ${codeLine === 4 ? 'active-line' : ''}`}>
                <span className="line-num">3</span> &nbsp;&nbsp;for i = n-1 down to 1:
              </div>
              <div className={`code-line ${codeLine === 4 ? 'active-line' : ''}`}>
                <span className="line-num">4</span> &nbsp;&nbsp;&nbsp;&nbsp;swap A[0] and A[i]
              </div>
              <div className={`code-line ${codeLine === 5 ? 'active-line' : ''}`}>
                <span className="line-num">5</span> &nbsp;&nbsp;&nbsp;&nbsp;heapSize--
              </div>
              <div className={`code-line ${codeLine === 6 ? 'active-line' : ''}`}>
                <span className="line-num">6</span> &nbsp;&nbsp;&nbsp;&nbsp;HEAPIFY(A, 0, heapSize)
              </div>
              <div className={`code-line ${codeLine === 7 || codeLine === 11 || codeLine === 14 || codeLine === 18 ? 'active-line' : ''}`}>
                <span className="line-num">7</span> HEAPIFY(A, i, heapSize)
              </div>
            </div>
          </div>

          {/* 3. Parent & Children Inspection Panel */}
          <div className="hs-panel-card">
            <h4 className="hs-panel-title">PARENT & CHILDREN INSPECTION</h4>
            <div className="hs-panel-rows">
              <div className="hs-panel-row">
                <span className="hs-row-label">Parent (Blue):</span>
                <span className="hs-row-val text-blue-400">
                  {activeParentIdx !== null ? `A[${activeParentIdx}] = ${array[activeParentIdx]}` : 'None'}
                </span>
              </div>
              <div className="hs-panel-row">
                <span className="hs-row-label">Left Child (Yellow):</span>
                <span className="hs-row-val text-amber-400">
                  {leftChildIdx !== null ? `A[${leftChildIdx}] = ${array[leftChildIdx]}` : 'None'}
                </span>
              </div>
              <div className="hs-panel-row">
                <span className="hs-row-label">Right Child (Orange):</span>
                <span className="hs-row-val text-orange-400">
                  {rightChildIdx !== null ? `A[${rightChildIdx}] = ${array[rightChildIdx]}` : 'None'}
                </span>
              </div>
              <div className="hs-panel-row">
                <span className="hs-row-label">Largest Node (Green):</span>
                <span className="hs-row-val text-emerald-400 font-bold">
                  {largestIdx !== null ? `A[${largestIdx}] = ${array[largestIdx]}` : 'None'}
                </span>
              </div>
              <div className="hs-panel-row">
                <span className="hs-row-label">Heapify Operations:</span>
                <span className="hs-row-val text-purple-400">{heapifyCount}</span>
              </div>
            </div>
          </div>

          {/* 4. Complexity & Completion */}
          <div className="hs-complexity-note-box">
            <span className="comp-tag best-avg">Build Heap: O(n)</span>
            <span className="comp-tag best-avg">Heapify: O(log n)</span>
            <span className="comp-tag overall">Overall: O(n log n)</span>
          </div>

          {phase === 'COMPLETED' && (
            <div className="hs-completed-summary-card">
              <h3 className="summary-title"><CheckCircle2 className="w-5 h-5 text-emerald-400 inline mr-1.5" /> HEAP SORT COMPLETED ✓</h3>
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

