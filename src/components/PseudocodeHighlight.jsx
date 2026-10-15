import React from 'react';
import { Code2 } from 'lucide-react';

/**
 * Pseudocode lines for each algorithm.
 * Each item: { line: string, types: string[] }  — types that trigger highlight
 */
const PSEUDOCODE_MAP = {
  'bubble-sort': [
    { line: 'for i = 0 to n-1:', types: ['pass_start', 'init'] },
    { line: '  for j = 0 to n-i-1:', types: ['compare'] },
    { line: '    if A[j] > A[j+1]:', types: ['compare'] },
    { line: '      swap(A[j], A[j+1])', types: ['swap'] },
    { line: '  mark A[n-i-1] as sorted', types: ['sorted_element'] },
    { line: '  if no swaps: break  ← early exit', types: ['early_exit'] },
    { line: 'DONE ✓', types: ['completed'] },
  ],
  'selection-sort': [
    { line: 'for i = 0 to n-2:', types: ['find_min', 'init'] },
    { line: '  minIdx = i', types: ['find_min'] },
    { line: '  for j = i+1 to n-1:', types: ['compare'] },
    { line: '    if A[j] < A[minIdx]:', types: ['compare'] },
    { line: '      minIdx = j  ← new minimum', types: ['new_min'] },
    { line: '  swap(A[i], A[minIdx])', types: ['swap'] },
    { line: '  mark A[i] as sorted', types: ['sorted_element'] },
    { line: 'DONE ✓', types: ['completed'] },
  ],
  'insertion-sort': [
    { line: 'for i = 1 to n-1:', types: ['pick_key', 'init'] },
    { line: '  key = A[i]', types: ['pick_key'] },
    { line: '  j = i - 1', types: ['compare'] },
    { line: '  while j >= 0 and A[j] > key:', types: ['compare'] },
    { line: '    A[j+1] = A[j]  ← shift right', types: ['shift'] },
    { line: '    j--', types: ['shift'] },
    { line: '  A[j+1] = key  ← insert key', types: ['insert'] },
    { line: 'DONE ✓', types: ['completed'] },
  ],
  'shell-sort': [
    { line: 'gap = floor(n/2)', types: ['init', 'gap_change'] },
    { line: 'while gap > 0:', types: ['gap_change'] },
    { line: '  for i = gap to n-1:', types: ['pick_key'] },
    { line: '    key = A[i]', types: ['pick_key'] },
    { line: '    j = i', types: ['compare'] },
    { line: '    while j >= gap and A[j-gap] > key:', types: ['compare'] },
    { line: '      A[j] = A[j-gap]  ← shift', types: ['shift'] },
    { line: '      j -= gap', types: ['shift'] },
    { line: '    A[j] = key  ← insert', types: ['insert'] },
    { line: '  gap = floor(gap/2)', types: ['gap_change'] },
    { line: 'DONE ✓', types: ['completed'] },
  ],
  'counting-sort': [
    { line: 'Find max and min in array', types: ['init'] },
    { line: 'Create count[] of size (max-min+1)', types: ['init'] },
    { line: 'for each element x in A:', types: ['count_increment', 'compare'] },
    { line: '  count[x - min]++', types: ['count_increment', 'overwrite'] },
    { line: 'Compute prefix sums in count[]', types: ['count_prefix'] },
    { line: 'Place each element at correct position', types: ['place_output', 'active'] },
    { line: 'Copy output back to A', types: ['place_output'] },
    { line: 'DONE ✓', types: ['completed'] },
  ],
  'radix-sort': [
    { line: 'Find max value to determine digits', types: ['init'] },
    { line: 'for each digit place (1s, 10s, 100s...)', types: ['digit_pass', 'gap_change'] },
    { line: '  Apply counting sort by current digit', types: ['compare', 'count_increment'] },
    { line: '  Distribute elements into buckets', types: ['overwrite', 'place_output'] },
    { line: '  Collect buckets back into array', types: ['place_output'] },
    { line: 'DONE ✓', types: ['completed'] },
  ],
  'bucket-sort': [
    { line: 'Create n empty buckets', types: ['init'] },
    { line: 'for each element x in A:', types: ['bucket_fill', 'compare'] },
    { line: '  bucket_index = floor(n * x / max)', types: ['bucket_fill'] },
    { line: '  buckets[bucket_index].add(x)', types: ['bucket_fill'] },
    { line: 'Sort each non-empty bucket', types: ['bucket_sort'] },
    { line: 'Concatenate all buckets into A', types: ['bucket_concat', 'place_output'] },
    { line: 'DONE ✓', types: ['completed'] },
  ],
  'heap-sort': [
    { line: 'BUILD_MAX_HEAP(A)', types: ['init', 'heap_build', 'heapify_inspect'] },
    { line: '  heapify all nodes bottom-up', types: ['heapify_inspect'] },
    { line: 'for i = n-1 downto 1:', types: ['heap_swap', 'sorted_element'] },
    { line: '  swap(A[0], A[i])  ← extract max', types: ['heap_swap', 'swap'] },
    { line: '  HEAPIFY(A, 0, i)', types: ['heapify_inspect'] },
    { line: '    compare parent with children', types: ['heapify_inspect', 'compare'] },
    { line: '    swap largest child up if needed', types: ['heap_swap'] },
    { line: 'DONE ✓', types: ['completed'] },
  ],
  'merge-sort': [
    { line: 'MERGE_SORT(A, low, high):', types: ['init'] },
    { line: '  if low >= high: return  ← base case', types: ['completed'] },
    { line: '  mid = floor((low + high) / 2)', types: ['compare'] },
    { line: '  MERGE_SORT(A, low, mid)', types: ['compare'] },
    { line: '  MERGE_SORT(A, mid+1, high)', types: ['compare'] },
    { line: '  MERGE(left[], right[] → result[])', types: ['swap', 'overwrite'] },
    { line: '    compare & pick smaller element', types: ['compare'] },
    { line: 'DONE ✓', types: ['completed'] },
  ],
  'quick-sort': [
    { line: 'QUICK_SORT(A, low, high):', types: ['init'] },
    { line: '  if low >= high: return', types: ['completed'] },
    { line: '  pivot = A[high]  ← pick pivot', types: ['pivot_select'] },
    { line: '  i = low - 1  ← partition pointer', types: ['compare'] },
    { line: '  for j = low to high-1:', types: ['compare'] },
    { line: '    if A[j] <= pivot:', types: ['compare'] },
    { line: '      i++; swap(A[i], A[j])', types: ['swap', 'swap_pivot'] },
    { line: '  swap(A[i+1], pivot)  ← place pivot', types: ['swap_pivot'] },
    { line: '  Recurse on left & right partitions', types: ['partition'] },
    { line: 'DONE ✓', types: ['completed'] },
  ],
};

/**
 * Determine which pseudocode line to highlight based on step type.
 */
function getHighlightedLines(algoId, stepType) {
  const lines = PSEUDOCODE_MAP[algoId];
  if (!lines || !stepType) return [];
  return lines
    .map((line, idx) => (line.types.includes(stepType) ? idx : -1))
    .filter(idx => idx !== -1);
}

export default function PseudocodeHighlight({ algoId, currentStep }) {
  const lines = PSEUDOCODE_MAP[algoId];

  if (!lines) {
    return null; // No pseudocode for this algo (handled by dedicated visualizer)
  }

  const stepType = currentStep?.type || null;
  const highlightedLines = getHighlightedLines(algoId, stepType);

  return (
    <div className="pseudocode-panel">
      <div className="pseudocode-header">
        <Code2 className="w-4 h-4 text-cyan-400" />
        <span className="pseudocode-title">Pseudocode</span>
        {stepType && (
          <span className="pseudocode-step-badge">{stepType.replace(/_/g, ' ')}</span>
        )}
      </div>

      <div className="pseudocode-body">
        {lines.map((item, idx) => {
          const isActive = highlightedLines.includes(idx);
          return (
            <div
              key={idx}
              className={`pseudo-line ${isActive ? 'pseudo-line-active' : ''}`}
            >
              <span className="pseudo-ln">{idx + 1}</span>
              <span className="pseudo-code">{item.line}</span>
              {isActive && <span className="pseudo-arrow">◀</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
