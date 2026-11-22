/**
 * Cycle Sort Step Generator
 * An in-place sorting algorithm that is theoretically optimal in terms of memory writes.
 * Each element is either already in its correct position or written at most once per cycle.
 * 
 * @param {number[]} initialArray 
 * @param {Object} [options]
 * @param {'asc'|'desc'} [options.order='asc']
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generateCycleSortSteps(initialArray, options = {}) {
  const order = options.order || 'asc';
  const arr = [...initialArray];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let swaps = 0; // Tracks memory writes
  const sortedIndices = [];

  const isBefore = (a, b) => order === 'desc' ? a > b : a < b;

  steps.push({
    type: 'init',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Initial array before Cycle Sort (${order === 'desc' ? 'Descending' : 'Ascending'}). Optimal for minimum writes.`,
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

  // Loop through array to find cycles to rotate
  for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
    let item = arr[cycleStart];
    let pos = cycleStart;

    steps.push({
      type: 'pass_start',
      indices: [cycleStart],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Cycle start at index ${cycleStart}. Inspecting item ${item}.`,
      comparisonsCount: comparisons,
      swapsCount: swaps,
      pass: cycleStart + 1
    });

    // Find where to put the item by counting all elements strictly before it
    for (let i = cycleStart + 1; i < n; i++) {
      comparisons++;
      steps.push({
        type: 'compare',
        indices: [cycleStart, i],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Comparing item ${item} with element at index ${i} (${arr[i]})`,
        comparisonsCount: comparisons,
        swapsCount: swaps,
        pass: cycleStart + 1
      });

      if (isBefore(arr[i], item)) {
        pos++;
      }
    }

    // If item is already in correct position
    if (pos === cycleStart) {
      if (!sortedIndices.includes(cycleStart)) sortedIndices.push(cycleStart);
      steps.push({
        type: 'sorted_element',
        indices: [cycleStart],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Element at index ${cycleStart} (${arr[cycleStart]}) is already in its correct cycle position. 0 writes needed.`,
        comparisonsCount: comparisons,
        swapsCount: swaps,
        pass: cycleStart + 1
      });
      continue;
    }

    // Ignore duplicates
    while (item === arr[pos]) {
      pos++;
    }

    // Put item into its correct position
    if (pos !== cycleStart) {
      swaps++; // 1 memory write
      const temp = arr[pos];
      arr[pos] = item;
      item = temp;

      steps.push({
        type: 'swap',
        indices: [cycleStart, pos],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Placed item into correct position ${pos}. Displaced ${item} to continue the cycle.`,
        comparisonsCount: comparisons,
        swapsCount: swaps,
        pass: cycleStart + 1
      });
    }

    // Rotate the rest of the cycle
    while (pos !== cycleStart) {
      pos = cycleStart;

      // Find where to put displaced item
      for (let i = cycleStart + 1; i < n; i++) {
        comparisons++;
        steps.push({
          type: 'compare',
          indices: [cycleStart, i],
          array: [...arr],
          sortedIndices: [...sortedIndices],
          description: `Rotating cycle: comparing displaced ${item} with index ${i} (${arr[i]})`,
          comparisonsCount: comparisons,
          swapsCount: swaps,
          pass: cycleStart + 1
        });

        if (isBefore(arr[i], item)) {
          pos++;
        }
      }

      while (item === arr[pos]) {
        pos++;
      }

      if (item !== arr[pos]) {
        swaps++; // 1 memory write
        const temp = arr[pos];
        arr[pos] = item;
        item = temp;

        steps.push({
          type: 'swap',
          indices: [cycleStart, pos],
          array: [...arr],
          sortedIndices: [...sortedIndices],
          description: `Cycle rotation write: inserted at index ${pos}. Displaced ${item}.`,
          comparisonsCount: comparisons,
          swapsCount: swaps,
          pass: cycleStart + 1
        });
      }
    }

    if (!sortedIndices.includes(cycleStart)) sortedIndices.push(cycleStart);
  }

  for (let i = 0; i < n; i++) {
    if (!sortedIndices.includes(i)) sortedIndices.push(i);
  }

  steps.push({
    type: 'completed',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Cycle Sort complete! All cycles resolved with minimal memory writes (${swaps} writes total).`,
    comparisonsCount: comparisons,
    swapsCount: swaps,
    pass: n
  });

  return { steps, stats: { comparisons, swaps } };
}
