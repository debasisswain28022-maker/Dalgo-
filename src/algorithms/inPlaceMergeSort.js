/**
 * In-Place Merge Sort Step Generator
 * Standard divide-and-conquer Merge Sort with in-place merging (O(1) auxiliary space).
 * Shifts elements rightward during merge to place elements in order without extra array allocation.
 * 
 * @param {number[]} initialArray 
 * @param {Object} [options]
 * @param {'asc'|'desc'} [options.order='asc']
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generateInPlaceMergeSortSteps(initialArray, options = {}) {
  const order = options.order || 'asc';
  const arr = [...initialArray];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = [];

  const isOutOfOrder = (a, b) => order === 'desc' ? a < b : a > b;

  steps.push({
    type: 'init',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Initial array before In-Place Merge Sort (${order === 'desc' ? 'Descending' : 'Ascending'}). Merges without auxiliary array allocation.`,
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

  function inPlaceMerge(start, mid, end) {
    let i = start;
    let j = mid + 1;

    steps.push({
      type: 'pass_start',
      indices: [start, end],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `In-Place Merge: merging sub-arrays [${start}..${mid}] and [${mid + 1}..${end}]`,
      comparisonsCount: comparisons,
      swapsCount: swaps
    });

    while (i <= mid && j <= end) {
      comparisons++;
      steps.push({
        type: 'compare',
        indices: [i, j],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Comparing index ${i} (${arr[i]}) with index ${j} (${arr[j]})`,
        comparisonsCount: comparisons,
        swapsCount: swaps
      });

      if (!isOutOfOrder(arr[i], arr[j])) {
        i++;
      } else {
        const val = arr[j];
        let index = j;

        // Shift elements from index-1 down to i rightward by 1
        while (index !== i) {
          swaps++;
          arr[index] = arr[index - 1];
          index--;
        }
        arr[i] = val;
        swaps++;

        steps.push({
          type: 'shift',
          indices: [i, j],
          array: [...arr],
          sortedIndices: [...sortedIndices],
          description: `In-place shift: moved ${val} into position ${i}`,
          comparisonsCount: comparisons,
          swapsCount: swaps
        });

        i++;
        mid++;
        j++;
      }
    }
  }

  function mergeSortHelper(low, high) {
    if (low < high) {
      const mid = Math.floor((low + high) / 2);
      mergeSortHelper(low, mid);
      mergeSortHelper(mid + 1, high);
      inPlaceMerge(low, mid, high);
    } else if (low === high) {
      if (!sortedIndices.includes(low)) sortedIndices.push(low);
    }
  }

  mergeSortHelper(0, n - 1);

  for (let i = 0; i < n; i++) {
    if (!sortedIndices.includes(i)) sortedIndices.push(i);
  }

  steps.push({
    type: 'completed',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `In-Place Merge Sort complete! Sorted in ${order === 'desc' ? 'descending' : 'ascending'} order with O(1) extra space.`,
    comparisonsCount: comparisons,
    swapsCount: swaps
  });

  return { steps, stats: { comparisons, swaps } };
}
