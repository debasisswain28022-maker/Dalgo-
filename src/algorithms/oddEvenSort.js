/**
 * Odd-Even Sort Step Generator
 * Also known as Brick Sort. Originally designed for parallel computing.
 * Alternates between:
 * 1. Odd Phase: comparing and swapping adjacent pairs at odd indices (1,2), (3,4)...
 * 2. Even Phase: comparing and swapping adjacent pairs at even indices (0,1), (2,3)...
 * Repeats until no swaps are made in both phases.
 * 
 * @param {number[]} initialArray 
 * @param {Object} [options]
 * @param {'asc'|'desc'} [options.order='asc']
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generateOddEvenSortSteps(initialArray, options = {}) {
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
    description: `Initial array before Odd-Even Sort (${order === 'desc' ? 'Descending' : 'Ascending'}).`,
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

  let isSorted = false;
  let iteration = 0;

  while (!isSorted) {
    isSorted = true;
    iteration++;

    // ── ODD PHASE ──
    steps.push({
      type: 'pass_start',
      indices: [],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Iteration ${iteration} — Odd Phase: comparing pairs at odd indices (1, 2), (3, 4)...`,
      comparisonsCount: comparisons,
      swapsCount: swaps,
      pass: iteration
    });

    for (let i = 1; i < n - 1; i += 2) {
      comparisons++;
      steps.push({
        type: 'compare',
        indices: [i, i + 1],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Odd Phase comparison: index ${i} (${arr[i]}) vs index ${i + 1} (${arr[i + 1]})`,
        comparisonsCount: comparisons,
        swapsCount: swaps,
        pass: iteration
      });

      if (isOutOfOrder(arr[i], arr[i + 1])) {
        swaps++;
        isSorted = false;
        const temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;

        steps.push({
          type: 'swap',
          indices: [i, i + 1],
          array: [...arr],
          sortedIndices: [...sortedIndices],
          description: `Odd Phase swap: index ${i} (${arr[i + 1]} ↔ ${arr[i]})`,
          comparisonsCount: comparisons,
          swapsCount: swaps,
          pass: iteration
        });
      }
    }

    // ── EVEN PHASE ──
    steps.push({
      type: 'pass_start',
      indices: [],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Iteration ${iteration} — Even Phase: comparing pairs at even indices (0, 1), (2, 3)...`,
      comparisonsCount: comparisons,
      swapsCount: swaps,
      pass: iteration
    });

    for (let i = 0; i < n - 1; i += 2) {
      comparisons++;
      steps.push({
        type: 'compare',
        indices: [i, i + 1],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Even Phase comparison: index ${i} (${arr[i]}) vs index ${i + 1} (${arr[i + 1]})`,
        comparisonsCount: comparisons,
        swapsCount: swaps,
        pass: iteration
      });

      if (isOutOfOrder(arr[i], arr[i + 1])) {
        swaps++;
        isSorted = false;
        const temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;

        steps.push({
          type: 'swap',
          indices: [i, i + 1],
          array: [...arr],
          sortedIndices: [...sortedIndices],
          description: `Even Phase swap: index ${i} (${arr[i + 1]} ↔ ${arr[i]})`,
          comparisonsCount: comparisons,
          swapsCount: swaps,
          pass: iteration
        });
      }
    }
  }

  // All elements are sorted
  for (let i = 0; i < n; i++) sortedIndices.push(i);

  steps.push({
    type: 'completed',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Odd-Even Sort complete! Array is sorted in ${order === 'desc' ? 'descending' : 'ascending'} order.`,
    comparisonsCount: comparisons,
    swapsCount: swaps,
    pass: iteration
  });

  return { steps, stats: { comparisons, swaps } };
}
