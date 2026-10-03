import React from 'react';

/**
 * Binary Heap Tree Visualization Component for Heap Sort
 */
export default function HeapTreeView({ array, currentStep }) {
  if (!array || array.length === 0) return null;

  const heapSize = currentStep?.heapSize ?? array.length;
  const activeIndices = currentStep?.indices || [];

  // Build binary tree structure up to 4 levels (up to 15 nodes for clean visual presentation)
  const displayNodesCount = Math.min(array.length, 15);

  const getStatus = (idx) => {
    if (idx >= heapSize) return 'sorted-out';
    if (activeIndices.includes(idx)) {
      if (currentStep?.type === 'heap_swap') return 'swap';
      return 'active';
    }
    if (idx === 0) return 'root';
    return 'in-heap';
  };

  // Helper to get parent and child positioning coordinates
  const renderTreeNodes = () => {
    // We organize nodes by depth level: Level 0 (1 node), Level 1 (2 nodes), Level 2 (4 nodes), Level 3 (8 nodes)
    const levels = [];
    let currentIdx = 0;
    let levelDepth = 0;

    while (currentIdx < displayNodesCount && levelDepth < 4) {
      const levelSize = Math.pow(2, levelDepth);
      const levelNodes = [];

      for (let i = 0; i < levelSize && currentIdx < displayNodesCount; i++) {
        levelNodes.push({
          idx: currentIdx,
          val: array[currentIdx],
          status: getStatus(currentIdx),
          parentIdx: Math.floor((currentIdx - 1) / 2)
        });
        currentIdx++;
      }
      levels.push(levelNodes);
      levelDepth++;
    }

    return levels;
  };

  const levels = renderTreeNodes();

  return (
    <div className="heap-tree-wrapper">
      <div className="heap-tree-header">
        <h4 className="heap-tree-title">Binary Heap Tree Structure</h4>
        <span className="heap-size-badge">Active Heap Size: <strong>{heapSize}</strong> / {array.length}</span>
      </div>

      <div className="heap-tree-container">
        {levels.map((levelNodes, levelIdx) => (
          <div key={levelIdx} className="heap-tree-level">
            {levelNodes.map((node) => (
              <div
                key={node.idx}
                className={`heap-node status-${node.status}`}
                title={`Index ${node.idx}: Value ${node.val}`}
              >
                <div className="heap-node-val">{node.val}</div>
                <div className="heap-node-idx">idx:{node.idx}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {array.length > 15 && (
        <div className="heap-tree-note">
          * Displaying top 15 binary heap nodes for optimal visual clarity.
        </div>
      )}
    </div>
  );
}
