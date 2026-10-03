import React from 'react';
import { ArrowDown, Check, ArrowRight, Layers, HelpCircle, CheckCircle2 } from 'lucide-react';

// Recursive Binary Tree Node Component for Merge Sort Divide Tree
function RecursiveTreeNode({ nodeId, nodeMap, currentStep }) {
  if (!nodeId || !nodeMap.has(nodeId)) return null;
  const node = nodeMap.get(nodeId);

  const isSplit = currentStep.splitNodeId === node.id;
  const isBase = currentStep.baseNodeId === node.id;
  const isMergingParent = currentStep.parentNodeId === node.id;
  const isMergingChild = currentStep.leftChildId === node.id || currentStep.rightChildId === node.id;

  let statusClass = node.status;
  if (isSplit) statusClass = 'active-splitting';
  if (isBase) statusClass = 'active-base';
  if (isMergingParent) statusClass = 'active-merging-parent';
  if (isMergingChild) statusClass = 'active-merging-child';

  const leftChildId = node.children && node.children[0];
  const rightChildId = node.children && node.children[1];
  const hasChildren = Boolean(leftChildId || rightChildId);

  return (
    <div className="tree-node-branch">
      <div 
        className={`tree-node-box status-${statusClass}`}
        title={`Range [${node.range[0]}..${node.range[1]}]`}
      >
        <div className="node-values">
          [{node.values.join(', ')}]
        </div>
      </div>

      {hasChildren && (
        <div className="tree-children-container">
          <div className="tree-children-row">
            {leftChildId && (
              <div className="tree-child-wrapper">
                <RecursiveTreeNode nodeId={leftChildId} nodeMap={nodeMap} currentStep={currentStep} />
              </div>
            )}
            {rightChildId && (
              <div className="tree-child-wrapper">
                <RecursiveTreeNode nodeId={rightChildId} nodeMap={nodeMap} currentStep={currentStep} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MergeSortVisualizer({ currentStep, array }) {
  if (!currentStep) {
    return <div className="merge-vis-empty">Press Start to begin Merge Sort visualization</div>;
  }

  const {
    phase = 'DIVIDING',
    divideLevel = 0,
    mergeLevel = 0,
    totalDivideLevels = 3,
    treeStructure = [],
    leftArray = [],
    rightArray = [],
    resultArray = [],
    leftCompareIdx = null,
    rightCompareIdx = null,
    comparedValues = null,
    description = '',
    comparisonsCount = 0,
    movesCount = 0,
    arraySnapshot = []
  } = currentStep;

  // Build node lookup map for recursive tree rendering
  const nodeMap = new Map();
  treeStructure.forEach(node => nodeMap.set(node.id, node));
  const rootNode = treeStructure.find(node => node.parentId === null) || treeStructure[0];

  return (
    <div className="merge-visualizer-container">
      {/* Top Banner Toolbar */}
      <div className="merge-phase-banner">
        <div className="phase-pill-group">
          <span className={`phase-pill ${phase === 'DIVIDING' ? 'active-divide' : ''}`}>
            1. DIVIDE PHASE
          </span>
          <span className={`phase-pill ${phase === 'BASE CASE' ? 'active-base' : ''}`}>
            2. SINGLE ELEMENTS
          </span>
          <span className={`phase-pill ${phase === 'MERGING' ? 'active-merge' : ''}`}>
            3. MERGING PHASE
          </span>
          {phase === 'COMPLETED' && (
            <span className="phase-pill active-completed">
              <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" /> SORTED
            </span>
          )}
        </div>

        <div className="level-info-pills">
          {phase === 'MERGING' && (
            <span className="info-badge merge-badge">
              Merge Level: <strong>{mergeLevel}</strong> / {totalDivideLevels}
            </span>
          )}
          {phase === 'DIVIDING' && (
            <span className="info-badge divide-badge">
              Divide Level: <strong>{divideLevel}</strong> / {totalDivideLevels}
            </span>
          )}
        </div>
      </div>

      {/* Main Single-Screen Dashboard Grid */}
      <div className="merge-dashboard-grid">
        {/* LEFT COLUMN: Visual Representations */}
        <div className="merge-column-visuals">
          {/* 1. Divide Phase Tree Hierarchy */}
          <div className="merge-tree-section">
            <h4 className="section-subheading">Recursive Divide Tree</h4>
            <div className="tree-levels-wrapper">
              {rootNode && (
                <RecursiveTreeNode 
                  nodeId={rootNode.id} 
                  nodeMap={nodeMap} 
                  currentStep={currentStep} 
                />
              )}
            </div>
          </div>

          {/* 2. Merging Workstation */}
          {(phase === 'MERGING' || phase === 'BASE CASE' || leftArray.length > 0 || rightArray.length > 0) && (
            <div className="merge-workstation">
              <h4 className="section-subheading">Active Merge Workstation</h4>
              
              <div className="merge-arrays-grid">
                <div className="subarray-card card-left">
                  <div className="subarray-header">
                    <span className="card-tag">LEFT ARRAY</span>
                    <span className="count-tag">{leftArray.length} items</span>
                  </div>
                  <div className="subarray-elements">
                    {leftArray.length > 0 ? (
                      leftArray.map((val, idx) => {
                        const isComparing = idx === leftCompareIdx;
                        const isTaken = idx < leftCompareIdx;
                        return (
                          <div 
                            key={idx} 
                            className={`element-chip left-chip ${isComparing ? 'comparing' : ''} ${isTaken ? 'taken' : ''}`}
                          >
                            {val}
                          </div>
                        );
                      })
                    ) : (
                      <span className="empty-text">Empty</span>
                    )}
                  </div>
                </div>

                <div className="compare-symbol-box">
                  {comparedValues ? (
                    <div className="compared-badge-card animate-pulse">
                      <span className="comp-val val-left">{comparedValues.leftVal}</span>
                      <span className="comp-op">{comparedValues.operator}</span>
                      <span className="comp-val val-right">{comparedValues.rightVal}</span>
                    </div>
                  ) : (
                    <span className="vs-label">VS</span>
                  )}
                </div>

                <div className="subarray-card card-right">
                  <div className="subarray-header">
                    <span className="card-tag">RIGHT ARRAY</span>
                    <span className="count-tag">{rightArray.length} items</span>
                  </div>
                  <div className="subarray-elements">
                    {rightArray.length > 0 ? (
                      rightArray.map((val, idx) => {
                        const isComparing = idx === rightCompareIdx;
                        const isTaken = idx < rightCompareIdx;
                        return (
                          <div 
                            key={idx} 
                            className={`element-chip right-chip ${isComparing ? 'comparing' : ''} ${isTaken ? 'taken' : ''}`}
                          >
                            {val}
                          </div>
                        );
                      })
                    ) : (
                      <span className="empty-text">Empty</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="result-array-card">
                <div className="result-header">
                  <span className="result-tag">MERGED RESULT ARRAY</span>
                  <span className="result-count">{resultArray.length} items</span>
                </div>
                <div className="result-elements">
                  {resultArray.length > 0 ? (
                    resultArray.map((val, idx) => (
                      <div key={idx} className="element-chip result-chip animate-pop">
                        {val}
                      </div>
                    ))
                  ) : (
                    <span className="empty-placeholder">Result array is currently empty.</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Logic, Explanation & Snapshot */}
        <div className="merge-column-logic">
          {/* 1. Dynamic Explanation Panel */}
          <div className="merge-explanation-panel">
            <div className="explanation-header">
              <HelpCircle className="w-5 h-5 text-amber-400 inline mr-2" />
              <span className="font-bold uppercase tracking-wider text-xs">WHAT IS HAPPENING?</span>
            </div>
            <p className="explanation-text">{description}</p>
          </div>

          {/* 2. Main Array Snapshot */}
          <div className="main-array-snapshot-box">
            <span className="snapshot-title">Main Array Snapshot:</span>
            <div className="snapshot-chips">
              {arraySnapshot.map((val, idx) => {
                const inActiveRange = currentStep.activeRange && idx >= currentStep.activeRange[0] && idx <= currentStep.activeRange[1];
                return (
                  <div key={idx} className={`snap-chip ${inActiveRange ? 'in-range' : ''}`}>
                    <span className="snap-val">{val}</span>
                    <span className="snap-idx">[{idx}]</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Pseudocode Highlight Card */}
          <div className="qs-panel-card code-panel font-mono">
            <h4 className="qs-panel-title font-sans">MERGE SORT PSEUDOCODE</h4>
            <div className="pseudocode-lines">
              <div className={`code-line ${phase === 'DIVIDING' ? 'active-line' : ''}`}>
                <span className="line-num">1</span> MERGE_SORT(A, low, high)
              </div>
              <div className={`code-line ${phase === 'DIVIDING' ? 'active-line' : ''}`}>
                <span className="line-num">2</span> &nbsp;&nbsp;mid = floor((low + high) / 2)
              </div>
              <div className={`code-line ${phase === 'DIVIDING' ? 'active-line' : ''}`}>
                <span className="line-num">3</span> &nbsp;&nbsp;MERGE_SORT(A, low, mid)
              </div>
              <div className={`code-line ${phase === 'DIVIDING' ? 'active-line' : ''}`}>
                <span className="line-num">4</span> &nbsp;&nbsp;MERGE_SORT(A, mid + 1, high)
              </div>
              <div className={`code-line ${phase === 'MERGING' || phase === 'BASE CASE' ? 'active-line' : ''}`}>
                <span className="line-num">5</span> &nbsp;&nbsp;MERGE(A, low, mid, high)
              </div>
            </div>
          </div>

          {/* 4. Statistics Footer */}
          <div className="merge-stats-footer">
            <div className="merge-stat">
              <span className="stat-label">Comparisons:</span>
              <span className="stat-value text-amber-400">{comparisonsCount}</span>
            </div>

            <div className="merge-stat">
              <span className="stat-label">Moves / Writes:</span>
              <span className="stat-value text-rose-400">{movesCount}</span>
            </div>

            <div className="merge-stat">
              <span className="stat-label">Merge Level:</span>
              <span className="stat-value text-cyan-400">{mergeLevel} / {totalDivideLevels}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

