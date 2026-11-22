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
  'exchange-sort': [
    { line: 'for i = 0 to n - 2:', types: ['init', 'pass_start'] },
    { line: '  for j = i + 1 to n - 1:', types: ['compare'] },
    { line: '    if A[i] > A[j]:', types: ['compare'] },
    { line: '      swap(A[i], A[j])', types: ['swap'] },
    { line: '  mark A[i] as sorted', types: ['sorted_element'] },
    { line: 'DONE ✓', types: ['completed'] },
  ],
  'gnome-sort': [
    { line: 'pos = 0', types: ['init'] },
    { line: 'while pos < n:', types: ['compare'] },
    { line: '  if pos == 0 or A[pos] >= A[pos - 1]:', types: ['compare'] },
    { line: '    pos++', types: ['pass_start'] },
    { line: '  else:', types: ['compare'] },
    { line: '    swap(A[pos], A[pos - 1])', types: ['swap'] },
    { line: '    pos--', types: ['swap'] },
    { line: 'DONE ✓', types: ['completed'] },
  ],
  'cocktail-shaker-sort': [
    { line: 'while swapped and start < end:', types: ['init', 'pass_start'] },
    { line: '  Forward: compare & swap right', types: ['compare', 'swap'] },
    { line: '  mark A[end] sorted; end--', types: ['sorted_element'] },
    { line: '  Backward: compare & swap left', types: ['compare', 'swap'] },
    { line: '  mark A[start] sorted; start++', types: ['sorted_element'] },
    { line: 'DONE ✓', types: ['completed'] },
  ],
  'comb-sort': [
    { line: 'gap = n; shrink = 1.3', types: ['init', 'gap_change'] },
    { line: 'while not sorted:', types: ['gap_change'] },
    { line: '  gap = max(1, floor(gap / shrink))', types: ['gap_change'] },
    { line: '  for i = 0 to n - gap - 1:', types: ['compare'] },
    { line: '    if A[i] > A[i + gap]:', types: ['compare'] },
    { line: '      swap(A[i], A[i + gap])', types: ['swap'] },
    { line: 'DONE ✓', types: ['completed'] },
  ],
  'odd-even-sort': [
    { line: 'while not sorted:', types: ['init', 'pass_start'] },
    { line: '  Odd Phase: compare (1,2), (3,4)...', types: ['compare'] },
    { line: '    swap if out of order', types: ['swap'] },
    { line: '  Even Phase: compare (0,1), (2,3)...', types: ['compare'] },
    { line: '    swap if out of order', types: ['swap'] },
    { line: 'DONE ✓', types: ['completed'] },
  ],
  'cycle-sort': [
    { line: 'for cycleStart = 0 to n - 2:', types: ['init', 'pass_start'] },
    { line: '  item = A[cycleStart]', types: ['pass_start'] },
    { line: '  pos = cycleStart + count(smaller)', types: ['compare'] },
    { line: '  if pos == cycleStart: continue', types: ['sorted_element'] },
    { line: '  swap(item, A[pos])  ← write optimal', types: ['swap'] },
    { line: '  rotate rest of cycle to cycleStart', types: ['compare', 'swap'] },
    { line: 'DONE ✓', types: ['completed'] },
  ],
  'strand-sort': [
    { line: 'output = []', types: ['init'] },
    { line: 'while remaining has elements:', types: ['pass_start'] },
    { line: '  strand = [remove first item]', types: ['pick_key', 'pass_start'] },
    { line: '  extract compatible items to strand', types: ['compare', 'shift'] },
    { line: '  output = merge(output, strand)', types: ['compare', 'insert', 'sorted_element'] },
    { line: 'DONE ✓', types: ['completed'] },
  ],
  'binary-insertion-sort': [
    { line: 'for i = 1 to n - 1:', types: ['init', 'pick_key'] },
    { line: '  key = A[i]', types: ['pick_key'] },
    { line: '  pos = binarySearch(A[0..i-1], key)', types: ['compare', 'place_output'] },
    { line: '  shift elements A[pos..i-1] right', types: ['shift'] },
    { line: '  A[pos] = key', types: ['insert', 'sorted_element'] },
    { line: 'DONE ✓', types: ['completed'] },
  ],
  'library-sort': [
    { line: 'shelf = initializeWithGaps(A[0])', types: ['init', 'insert'] },
    { line: 'for each book in A:', types: ['pick_key'] },
    { line: '  if round: rebalanceGaps(shelf)', types: ['gap_change'] },
    { line: '  pos = binarySearchShelf(shelf, book)', types: ['compare'] },
    { line: '  if gap: insert directly (O(1))', types: ['insert'] },
    { line: '  else: shift locally to nearest gap', types: ['shift'] },
    { line: 'compact shelf to output', types: ['sorted_element', 'completed'] },
  ],
  'dual-pivot-quick-sort': [
    { line: 'if low >= high: return', types: ['completed'] },
    { line: 'if A[low] > A[high]: swap(A[low], A[high])', types: ['compare', 'swap'] },
    { line: 'p = A[low], q = A[high]  ← dual pivots', types: ['pivot_select'] },
    { line: 'l = low + 1, g = high - 1, k = l', types: ['init'] },
    { line: 'while k <= g: compare A[k] with p & q', types: ['compare'] },
    { line: '  if A[k] < p: swap(A[k], A[l]); l++; k++', types: ['swap'] },
    { line: '  else if A[k] >= q: swap(A[k], A[g]); g--', types: ['swap'] },
    { line: 'swap(A[low], A[l-1]); swap(A[high], A[g+1])', types: ['swap_pivot', 'sorted_element'] },
    { line: 'Recurse: (< p), (p..q), (> q)', types: ['completed'] },
  ],
  'three-way-quick-sort': [
    { line: 'if low >= high: return', types: ['completed'] },
    { line: 'pivot = A[low]  ← pick pivot', types: ['pivot_select', 'init'] },
    { line: 'lt = low, gt = high, i = low + 1', types: ['init'] },
    { line: 'while i <= gt:', types: ['compare'] },
    { line: '  if A[i] < pivot: swap(A[lt++], A[i++])', types: ['swap'] },
    { line: '  else if A[i] > pivot: swap(A[i], A[gt--])', types: ['swap'] },
    { line: '  else: i++  ← equal to pivot', types: ['compare'] },
    { line: 'mark A[lt..gt] as sorted', types: ['sorted_element'] },
    { line: 'Recurse on [low..lt-1] and [gt+1..high]', types: ['completed'] },
  ],
  'intro-sort': [
    { line: 'depthLimit = 2 * floor(log2(n))', types: ['init', 'intro_depth'] },
    { line: 'if size <= 8: InsertionSort(partition)', types: ['pick_key', 'shift', 'insert'] },
    { line: 'else if depthLimit == 0: HeapSort(partition)', types: ['heap_build', 'heapify_inspect', 'heap_swap'] },
    { line: 'else: QuickSort partition around pivot', types: ['pivot_select', 'compare', 'swap', 'swap_pivot'] },
    { line: '  Recurse with depthLimit - 1', types: ['intro_depth', 'sorted_element'] },
    { line: 'DONE ✓', types: ['completed'] },
  ],
  'tim-sort': [
    { line: 'minRun = calcMinRun(n)', types: ['init'] },
    { line: 'Identify natural runs (asc/desc)', types: ['run_identify', 'compare'] },
    { line: 'Extend short runs to minRun via InsertionSort', types: ['pick_key', 'shift', 'insert'] },
    { line: 'Push run onto pending stack', types: ['run_identify'] },
    { line: 'Merge adjacent runs stably when conditions met', types: ['merge_runs', 'compare', 'overwrite'] },
    { line: 'Final merges until 1 run remains', types: ['sorted_element'] },
    { line: 'DONE ✓', types: ['completed'] },
  ],
  'block-merge-sort': [
    { line: 'blockSize = floor(sqrt(n))', types: ['init', 'block_partition'] },
    { line: 'Sort individual blocks using InsertionSort', types: ['compare', 'swap'] },
    { line: 'Select tag elements / internal buffer', types: ['block_partition'] },
    { line: 'Sort blocks by head element', types: ['compare', 'swap'] },
    { line: 'Merge blocks using cyclic shifts (in-place)', types: ['merge_blocks', 'rotate', 'shift'] },
    { line: 'mark sorted', types: ['sorted_element'] },
    { line: 'DONE ✓', types: ['completed'] },
  ],
  'in-place-merge-sort': [
    { line: 'IN_PLACE_MERGE_SORT(low, high):', types: ['init'] },
    { line: '  if low >= high: return', types: ['completed'] },
    { line: '  mid = (low + high) / 2; recurse halves', types: ['init'] },
    { line: '  while i <= mid and j <= high:', types: ['compare'] },
    { line: '    if A[i] <= A[j]: i++', types: ['compare'] },
    { line: '    else: rotate A[i..j] right by 1 (O(1) space)', types: ['shift', 'insert', 'swap'] },
    { line: '      mid++; i++; j++', types: ['shift'] },
    { line: 'DONE ✓', types: ['sorted_element', 'completed'] },
  ],
  'patience-sort': [
    { line: 'piles = []', types: ['init'] },
    { line: 'for each card in array:', types: ['pile_search'] },
    { line: '  find leftmost pile with top >= card (binary search)', types: ['pile_search', 'compare'] },
    { line: '  place card on pile (or create new pile)', types: ['pile_push'] },
    { line: 'while piles not empty:', types: ['pile_extract'] },
    { line: '  find pile with minimum top card (k-way merge)', types: ['compare'] },
    { line: '  extract minimum card → output array', types: ['pile_extract', 'place_output', 'sorted_element'] },
    { line: 'DONE ✓', types: ['completed'] },
  ],
  'smooth-sort': [
    { line: 'Compute Leonardo numbers L(0)=1, L(1)=1, L(k)=L(k-1)+L(k-2)+1', types: ['init'] },
    { line: 'Build Leonardo heap forest incrementally', types: ['leonardo_build', 'compare'] },
    { line: '  semi-trinkle / trinkle roots across trees', types: ['trinkle', 'swap'] },
    { line: 'Extract elements from right to left:', types: ['sorted_element'] },
    { line: '  decompose rightmost Leonardo tree into subtrees', types: ['sift'] },
    { line: '  trinkle roots to restore heap property', types: ['trinkle', 'swap', 'compare'] },
    { line: 'DONE ✓ (Adaptive O(n) to O(n log n))', types: ['completed'] },
  ],
  'tournament-sort': [
    { line: 'tree = buildCompleteBinaryTree(A)', types: ['init', 'tree_build'] },
    { line: 'Run matches from leaves to root', types: ['tree_match', 'compare'] },
    { line: 'Root holds winner (champion)', types: ['tree_extract'] },
    { line: 'for i = 0 to n - 1:', types: ['sorted_element'] },
    { line: '  output[i] = extractChampion(root)', types: ['tree_extract', 'place_output'] },
    { line: '  replace winner leaf with INF', types: ['tree_replay'] },
    { line: '  replay matches along path to root (O(log n))', types: ['tree_replay', 'compare'] },
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
