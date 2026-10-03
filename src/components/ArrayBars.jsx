import React from 'react';

export default function ArrayBars({ array, currentStep, showValues = true }) {
  if (!array || array.length === 0) {
    return <div className="array-bars-empty">No array data available</div>;
  }

  const maxVal = Math.max(...array, 1);
  const minVal = Math.min(...array, 0);

  // Helper to determine bar status class
  const getBarStatus = (index) => {
    if (!currentStep) return 'default';

    const { type, indices, sortedIndices, pivotIdx, minIdx, leftPointer, rightPointer, keyVal } = currentStep;

    // Check if fully sorted element
    if (sortedIndices && sortedIndices.includes(index)) {
      return 'sorted';
    }

    // Pivot index check
    if (pivotIdx === index || (type === 'pivot_select' && indices.includes(index))) {
      return 'pivot';
    }

    // Min index or Key index
    if (minIdx === index || (type === 'new_min' && indices.includes(index))) {
      return 'min-element';
    }

    // Active indices involved in comparison, swap, or shift
    if (indices && indices.includes(index)) {
      if (type === 'swap' || type === 'heap_swap' || type === 'swap_pivot') {
        return 'swap';
      }
      if (type === 'compare' || type === 'heapify_inspect') {
        return 'compare';
      }
      if (type === 'shift' || type === 'overwrite' || type === 'insert' || type === 'place_output') {
        return 'active';
      }
      if (type === 'pick_key') {
        return 'key-element';
      }
      return 'active';
    }

    // Pointer highlights
    if (index === leftPointer) return 'pointer-left';
    if (index === rightPointer) return 'pointer-right';

    return 'default';
  };

  const isSmallArray = array.length <= 30;

  return (
    <div className="array-bars-wrapper">
      {/* Visual Bars Container */}
      <div className="array-bars-container">
        {array.map((value, index) => {
          const status = getBarStatus(index);
          const heightPercent = Math.max(8, Math.round((value / maxVal) * 100));

          return (
            <div
              key={index}
              className={`array-bar-col status-${status}`}
              style={{ flex: 1 }}
            >
              {/* Top value badge for small arrays */}
              {isSmallArray && showValues && (
                <span className="bar-value-top">{value}</span>
              )}

              {/* The bar element */}
              <div 
                className="array-bar-fill"
                style={{ height: `${heightPercent}%` }}
                title={`Index ${index}: ${value}`}
              >
                {/* Visual glow overlay */}
                <div className="bar-glow"></div>
              </div>

              {/* Index label at bottom */}
              {isSmallArray && (
                <span className="bar-index-bottom">{index}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* State Legend */}
      <div className="array-bars-legend">
        <div className="legend-item"><span className="legend-color default"></span> Default</div>
        <div className="legend-item"><span className="legend-color compare"></span> Comparing</div>
        <div className="legend-item"><span className="legend-color swap"></span> Swapping / Writing</div>
        <div className="legend-item"><span className="legend-color pivot"></span> Pivot</div>
        <div className="legend-item"><span className="legend-color key"></span> Key / Current</div>
        <div className="legend-item"><span className="legend-color sorted"></span> Sorted</div>
      </div>
    </div>
  );
}
