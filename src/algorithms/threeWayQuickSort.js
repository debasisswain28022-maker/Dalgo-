/**
 * Three-Way Quick Sort Step Generator
 * Dijkstra's Dutch National Flag partition algorithm.
 * Partitions array into 3 sections:
 * 1. Elements < Pivot
 * 2. Elements == Pivot (multi-element center)
 * 3. Elements > Pivot
 * Only recurses on the < and > regions, providing O(n) performance on duplicate arrays.
 * 
 * @param {number[]} initialArray 
 * @param {Object} [options]
 * @param {'asc'|'desc'} [options.order='asc']
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generateThreeWayQuickSortSteps(initialArray, options = {}) {
  const order = options.order || 'asc';
  const arr = [...initialArray];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = [];

  const isLess = (a, b) => order === 'desc' ? a > b : a < b;
  const isGreater = (a, b) => order === 'desc' ? a < b : a > b;

  steps.push({
    type: 'init',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Initial array before Three-Way Quick Sort (${order === 'desc' ? 'Descending' : 'Ascending'}). Partitions into (< Pivot), (== Pivot), and (> Pivot).`,
    comparisonsCount: 0,
    swapsCount: 0,
    pass: 0
  });

  if (n <= 1) {
    if (n === 1) sortedIndices.push(0);
    steps.push({
      type: 'completed',
      indices: [],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: 'Array is sorted!',
      comparisonsCount: 0,
      swapsCount: 0,
      pass: 0
    });
    return { steps, stats: { comparisons: 0, swaps: 0 } };
  }

  function threeWayPartition(low, high) {
    if (low >= high) {
      if (low === high && !sortedIndices.includes(low)) sortedIndices.push(low);
      return;
    }

    const pivot = arr[low];
    let lt = low;
    let gt = high;
    let i = low + 1;

    steps.push({
      type: 'pivot_select',
      indices: [low],
      pivotIdx: low,
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Three-Way Partition range [${low}..${high}]: selected pivot ${pivot} at index ${low}.`,
      comparisonsCount: comparisons,
      swapsCount: swaps
    });

    while (i <= gt) {
      comparisons++;
      steps.push({
        type: 'compare',
        indices: [i, lt],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Comparing index ${i} (${arr[i]}) with Pivot (${pivot})`,
        comparisonsCount: comparisons,
        swapsCount: swaps
      });

      if (isLess(arr[i], pivot)) {
        swaps++;
        const tmp = arr[lt];
        arr[lt] = arr[i];
        arr[i] = tmp;

        steps.push({
          type: 'swap',
          indices: [lt, i],
          array: [...arr],
          sortedIndices: [...sortedIndices],
          description: `${arr[lt]} < pivot (${pivot}): swapped to left partition at index ${lt}`,
          comparisonsCount: comparisons,
          swapsCount: swaps
        });
        lt++;
        i++;
      } else if (isGreater(arr[i], pivot)) {
        swaps++;
        const tmp = arr[i];
        arr[i] = arr[gt];
        arr[gt] = tmp;

        steps.push({
          type: 'swap',
          indices: [i, gt],
          array: [...arr],
          sortedIndices: [...sortedIndices],
          description: `${arr[gt]} > pivot (${pivot}): swapped to right partition at index ${gt}`,
          comparisonsCount: comparisons,
          swapsCount: swaps
        });
        gt--;
      } else {
        // Equal to pivot
        steps.push({
          type: 'shift',
          indices: [i],
          array: [...arr],
          sortedIndices: [...sortedIndices],
          description: `Element at index ${i} (${arr[i]}) equals pivot (${pivot}). Stays in center equal-partition.`,
          comparisonsCount: comparisons,
          swapsCount: swaps
        });
        i++;
      }
    }

    // All elements in arr[lt..gt] equal pivot and are in their final sorted positions!
    for (let k = lt; k <= gt; k++) {
      if (!sortedIndices.includes(k)) sortedIndices.push(k);
    }

    steps.push({
      type: 'place_output',
      indices: Array.from({ length: gt - lt + 1 }, (_, idx) => lt + idx),
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Equal partition [${lt}..${gt}] holding value ${pivot} is now completely sorted!`,
      comparisonsCount: comparisons,
      swapsCount: swaps
    });

    // Recurse ONLY on the strictly smaller and strictly greater segments
    threeWayPartition(low, lt - 1);
    threeWayPartition(gt + 1, high);
  }

  threeWayPartition(0, n - 1);

  for (let i = 0; i < n; i++) {
    if (!sortedIndices.includes(i)) sortedIndices.push(i);
  }

  steps.push({
    type: 'completed',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Three-Way Quick Sort complete! All equal and partition blocks sorted in ${order === 'desc' ? 'descending' : 'ascending'} order.`,
    comparisonsCount: comparisons,
    swapsCount: swaps
  });

  return { steps, stats: { comparisons, swaps } };
}
