/**
 * Gnome Sort Step Generator
 * Also known as "Stupid Sort". Looks at the current and previous element.
 * If in order, steps forward; if out of order, swaps them and steps backward.
 * 
 * @param {number[]} initialArray 
 * @param {Object} [options]
 * @param {'asc'|'desc'} [options.order='asc']
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generateGnomeSortSteps(initialArray, options = {}) {
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
    description: `Initial array before Gnome Sort (${order === 'desc' ? 'Descending' : 'Ascending'}).`,
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

  let pos = 0;
  let stepCounter = 0;

  while (pos < n) {
    stepCounter++;
    if (pos === 0) {
      pos++;
      continue;
    }

    comparisons++;
    steps.push({
      type: 'compare',
      indices: [pos - 1, pos],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Gnome inspects pair: index ${pos - 1} (${arr[pos - 1]}) and index ${pos} (${arr[pos]})`,
      comparisonsCount: comparisons,
      swapsCount: swaps,
      pass: pos
    });

    if (isOutOfOrder(arr[pos - 1], arr[pos])) {
      swaps++;
      const temp = arr[pos - 1];
      arr[pos - 1] = arr[pos];
      arr[pos] = temp;

      steps.push({
        type: 'swap',
        indices: [pos - 1, pos],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Elements out of order. Swapping index ${pos - 1} and ${pos}. Gnome steps backward to index ${pos - 1}.`,
        comparisonsCount: comparisons,
        swapsCount: swaps,
        pass: pos
      });

      pos--;
    } else {
      pos++;
    }
  }

  // All elements are sorted
  for (let i = 0; i < n; i++) sortedIndices.push(i);

  steps.push({
    type: 'completed',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Gnome Sort complete! Array fully sorted in ${order === 'desc' ? 'descending' : 'ascending'} order.`,
    comparisonsCount: comparisons,
    swapsCount: swaps,
    pass: pos
  });

  return { steps, stats: { comparisons, swaps } };
}
