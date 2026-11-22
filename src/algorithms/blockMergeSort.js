/**
 * Block Merge Sort Step Generator
 * In-place/low-space block-based merge algorithm (WikiSort/GrailSort style).
 * Divides array into blocks of size sqrt(n), sorts blocks, and merges them using block rotations.
 * 
 * @param {number[]} initialArray 
 * @param {Object} [options]
 * @param {'asc'|'desc'} [options.order='asc']
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generateBlockMergeSortSteps(initialArray, options = {}) {
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
    description: `Initial array before Block Merge Sort (${order === 'desc' ? 'Descending' : 'Ascending'}). Divides into sqrt(n) blocks and merges in-place.`,
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

  const blockSize = Math.max(2, Math.floor(Math.sqrt(n)));

  // Helper: insertion sort on a block [start..end]
  function sortBlock(start, end) {
    for (let i = start + 1; i <= end; i++) {
      const key = arr[i];
      let j = i - 1;

      while (j >= start) {
        comparisons++;
        if (isOutOfOrder(arr[j], key)) {
          swaps++;
          arr[j + 1] = arr[j];
          j--;
        } else {
          break;
        }
      }
      arr[j + 1] = key;
      swaps++;
    }
  }

  // 1. Sort individual blocks
  for (let i = 0; i < n; i += blockSize) {
    const end = Math.min(n - 1, i + blockSize - 1);
    sortBlock(i, end);

    steps.push({
      type: 'gap_change',
      indices: [i, end],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Block Sort: sorted block [${i}..${end}] of size ${end - i + 1}`,
      comparisonsCount: comparisons,
      swapsCount: swaps
    });
  }

  // Helper: In-place block merge using rotational shifting
  function inPlaceMerge(start, mid, end) {
    let i = start;
    let j = mid + 1;

    while (i <= mid && j <= end) {
      comparisons++;
      steps.push({
        type: 'compare',
        indices: [i, j],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Block Merge: comparing index ${i} (${arr[i]}) vs index ${j} (${arr[j]})`,
        comparisonsCount: comparisons,
        swapsCount: swaps
      });

      if (!isOutOfOrder(arr[i], arr[j])) {
        i++;
      } else {
        const val = arr[j];
        let k = j;

        while (k > i) {
          swaps++;
          arr[k] = arr[k - 1];
          k--;
        }
        arr[i] = val;
        swaps++;

        steps.push({
          type: 'shift',
          indices: [i, j],
          array: [...arr],
          sortedIndices: [...sortedIndices],
          description: `Block rotation: shifted element ${val} to position ${i}`,
          comparisonsCount: comparisons,
          swapsCount: swaps
        });

        i++;
        mid++;
        j++;
      }
    }
  }

  // 2. Iteratively merge blocks
  for (let width = blockSize; width < n; width *= 2) {
    for (let i = 0; i < n; i += 2 * width) {
      const mid = Math.min(n - 1, i + width - 1);
      const end = Math.min(n - 1, i + 2 * width - 1);
      if (mid < end) {
        inPlaceMerge(i, mid, end);
      }
    }
  }

  for (let i = 0; i < n; i++) sortedIndices.push(i);

  steps.push({
    type: 'completed',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Block Merge Sort complete! All blocks merged in-place in ${order === 'desc' ? 'descending' : 'ascending'} order.`,
    comparisonsCount: comparisons,
    swapsCount: swaps
  });

  return { steps, stats: { comparisons, swaps } };
}
