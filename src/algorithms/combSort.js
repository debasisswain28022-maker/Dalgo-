/**
 * Comb Sort Step Generator
 * Improves on Bubble Sort by comparing elements with a shrinking gap (factor 1.3).
 * Eliminates "turtles" (small elements near the end) and finishes with gap=1.
 * 
 * @param {number[]} initialArray 
 * @param {Object} [options]
 * @param {'asc'|'desc'} [options.order='asc']
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generateCombSortSteps(initialArray, options = {}) {
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
    description: `Initial array before Comb Sort (${order === 'desc' ? 'Descending' : 'Ascending'}).`,
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

  let gap = n;
  const shrinkFactor = 1.3;
  let sorted = false;
  let passNumber = 0;

  while (!sorted) {
    passNumber++;
    // Shrink gap
    gap = Math.floor(gap / shrinkFactor);
    if (gap <= 1) {
      gap = 1;
      sorted = true; // Assume sorted unless swap occurs at gap=1
    } else if (gap === 9 || gap === 10) {
      gap = 11; // Comb Sort "Rule of 11" optimization
    }

    steps.push({
      type: 'gap_change',
      indices: [],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Comb Sort Pass ${passNumber}: Current Gap = ${gap}`,
      gap,
      comparisonsCount: comparisons,
      swapsCount: swaps,
      pass: passNumber
    });

    for (let i = 0; i < n - gap; i++) {
      const j = i + gap;
      comparisons++;

      steps.push({
        type: 'compare',
        indices: [i, j],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Comparing index ${i} (${arr[i]}) and index ${j} (${arr[j]}) separated by gap ${gap}`,
        gap,
        comparisonsCount: comparisons,
        swapsCount: swaps,
        pass: passNumber
      });

      if (isOutOfOrder(arr[i], arr[j])) {
        swaps++;
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;

        if (gap === 1) {
          sorted = false;
        }

        steps.push({
          type: 'swap',
          indices: [i, j],
          array: [...arr],
          sortedIndices: [...sortedIndices],
          description: `Exchanging index ${i} (${arr[j]}) and index ${j} (${arr[i]}) over gap ${gap}`,
          gap,
          comparisonsCount: comparisons,
          swapsCount: swaps,
          pass: passNumber
        });
      }
    }
  }

  // All sorted
  for (let i = 0; i < n; i++) sortedIndices.push(i);

  steps.push({
    type: 'completed',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Comb Sort complete! Array is sorted in ${order === 'desc' ? 'descending' : 'ascending'} order.`,
    comparisonsCount: comparisons,
    swapsCount: swaps,
    pass: passNumber
  });

  return { steps, stats: { comparisons, swaps } };
}
