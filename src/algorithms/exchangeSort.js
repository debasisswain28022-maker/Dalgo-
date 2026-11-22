/**
 * Exchange Sort Step Generator
 * Compares each element with all subsequent elements and exchanges them if out of order.
 * After the i-th pass, the i-th smallest (or largest) element is in its final position.
 * 
 * @param {number[]} initialArray 
 * @param {Object} [options]
 * @param {'asc'|'desc'} [options.order='asc']
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generateExchangeSortSteps(initialArray, options = {}) {
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
    description: `Initial array before Exchange Sort (${order === 'desc' ? 'Descending' : 'Ascending'}).`,
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

  for (let i = 0; i < n - 1; i++) {
    steps.push({
      type: 'pass_start',
      indices: [i],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Pass ${i + 1}: Finding element for position ${i}.`,
      comparisonsCount: comparisons,
      swapsCount: swaps,
      pass: i + 1
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      steps.push({
        type: 'compare',
        indices: [i, j],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Comparing index ${i} (${arr[i]}) with index ${j} (${arr[j]})`,
        comparisonsCount: comparisons,
        swapsCount: swaps,
        pass: i + 1
      });

      if (isOutOfOrder(arr[i], arr[j])) {
        swaps++;
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;

        steps.push({
          type: 'swap',
          indices: [i, j],
          array: [...arr],
          sortedIndices: [...sortedIndices],
          description: `Exchanging index ${i} (${arr[j]} → ${arr[i]}) and index ${j} (${arr[i]} → ${arr[j]})`,
          comparisonsCount: comparisons,
          swapsCount: swaps,
          pass: i + 1
        });
      }
    }

    sortedIndices.push(i);
    steps.push({
      type: 'sorted_element',
      indices: [i],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Element at index ${i} (${arr[i]}) is now confirmed in its sorted position.`,
      comparisonsCount: comparisons,
      swapsCount: swaps,
      pass: i + 1
    });
  }

  // The last remaining element is also sorted
  sortedIndices.push(n - 1);
  steps.push({
    type: 'completed',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Exchange Sort completed! All ${n} elements are sorted in ${order === 'desc' ? 'descending' : 'ascending'} order.`,
    comparisonsCount: comparisons,
    swapsCount: swaps,
    pass: n
  });

  return { steps, stats: { comparisons, swaps } };
}
