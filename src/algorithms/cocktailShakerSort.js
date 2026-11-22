/**
 * Cocktail Shaker Sort Step Generator
 * Bidirectional Bubble Sort: alternates forward and backward passes.
 * In each forward pass, the largest element moves to the right end.
 * In each backward pass, the smallest element moves to the left start.
 * 
 * @param {number[]} initialArray 
 * @param {Object} [options]
 * @param {'asc'|'desc'} [options.order='asc']
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generateCocktailShakerSortSteps(initialArray, options = {}) {
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
    description: `Initial array before Cocktail Shaker Sort (${order === 'desc' ? 'Descending' : 'Ascending'}).`,
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

  let start = 0;
  let end = n - 1;
  let swapped = true;
  let passNumber = 0;

  while (swapped && start < end) {
    swapped = false;
    passNumber++;

    // ── FORWARD PASS (Left to Right) ──
    steps.push({
      type: 'pass_start',
      indices: [start, end],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Pass ${passNumber} (Forward →): Bubbling largest unsorted element from index ${start} to ${end}.`,
      comparisonsCount: comparisons,
      swapsCount: swaps,
      pass: passNumber
    });

    for (let i = start; i < end; i++) {
      comparisons++;
      steps.push({
        type: 'compare',
        indices: [i, i + 1],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Forward compare: index ${i} (${arr[i]}) vs index ${i + 1} (${arr[i + 1]})`,
        comparisonsCount: comparisons,
        swapsCount: swaps,
        pass: passNumber
      });

      if (isOutOfOrder(arr[i], arr[i + 1])) {
        swaps++;
        swapped = true;
        const temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;

        steps.push({
          type: 'swap',
          indices: [i, i + 1],
          array: [...arr],
          sortedIndices: [...sortedIndices],
          description: `Swapped index ${i} and ${i + 1}`,
          comparisonsCount: comparisons,
          swapsCount: swaps,
          pass: passNumber
        });
      }
    }

    // Element at 'end' is now in place
    sortedIndices.push(end);
    steps.push({
      type: 'sorted_element',
      indices: [end],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Element at index ${end} (${arr[end]}) is settled in its sorted position.`,
      comparisonsCount: comparisons,
      swapsCount: swaps,
      pass: passNumber
    });
    end--;

    if (!swapped) break;

    // ── BACKWARD PASS (Right to Left) ──
    swapped = false;
    steps.push({
      type: 'pass_start',
      indices: [start, end],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Pass ${passNumber} (Backward ←): Bubbling smallest unsorted element from index ${end} down to ${start}.`,
      comparisonsCount: comparisons,
      swapsCount: swaps,
      pass: passNumber
    });

    for (let i = end - 1; i >= start; i--) {
      comparisons++;
      steps.push({
        type: 'compare',
        indices: [i, i + 1],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Backward compare: index ${i} (${arr[i]}) vs index ${i + 1} (${arr[i + 1]})`,
        comparisonsCount: comparisons,
        swapsCount: swaps,
        pass: passNumber
      });

      if (isOutOfOrder(arr[i], arr[i + 1])) {
        swaps++;
        swapped = true;
        const temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;

        steps.push({
          type: 'swap',
          indices: [i, i + 1],
          array: [...arr],
          sortedIndices: [...sortedIndices],
          description: `Swapped index ${i} and ${i + 1}`,
          comparisonsCount: comparisons,
          swapsCount: swaps,
          pass: passNumber
        });
      }
    }

    // Element at 'start' is now in place
    sortedIndices.push(start);
    steps.push({
      type: 'sorted_element',
      indices: [start],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Element at index ${start} (${arr[start]}) is settled in its sorted position.`,
      comparisonsCount: comparisons,
      swapsCount: swaps,
      pass: passNumber
    });
    start++;
  }

  // Ensure all remaining elements are marked sorted
  for (let i = 0; i < n; i++) {
    if (!sortedIndices.includes(i)) sortedIndices.push(i);
  }

  steps.push({
    type: 'completed',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Cocktail Shaker Sort complete! Array is fully sorted in ${order === 'desc' ? 'descending' : 'ascending'} order.`,
    comparisonsCount: comparisons,
    swapsCount: swaps,
    pass: passNumber
  });

  return { steps, stats: { comparisons, swaps } };
}
