/**
 * Selection Sort Step Generator
 * @param {number[]} initialArray 
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generateSelectionSortSteps(initialArray) {
  const arr = [...initialArray];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = [];

  steps.push({
    type: 'init',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: 'Initial unsorted array',
    pass: 0
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    
    steps.push({
      type: 'find_min',
      indices: [i],
      minIdx: minIdx,
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Finding minimum element starting from index ${i} (current value: ${arr[i]})`,
      pass: i + 1
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      
      steps.push({
        type: 'compare',
        indices: [j, minIdx],
        minIdx: minIdx,
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Comparing index ${j} (${arr[j]}) with current min index ${minIdx} (${arr[minIdx]})`,
        pass: i + 1
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          type: 'new_min',
          indices: [j],
          minIdx: minIdx,
          array: [...arr],
          sortedIndices: [...sortedIndices],
          description: `New minimum found: ${arr[j]} at index ${j}`,
          pass: i + 1
        });
      }
    }

    if (minIdx !== i) {
      swaps++;
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;

      steps.push({
        type: 'swap',
        indices: [i, minIdx],
        minIdx: null,
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Swapping element ${arr[minIdx]} at index ${i} with minimum ${arr[i]} at index ${minIdx}`,
        pass: i + 1
      });
    }

    sortedIndices.push(i);
    steps.push({
      type: 'sorted_element',
      indices: [i],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Index ${i} (${arr[i]}) is now sorted`,
      pass: i + 1
    });
  }

  sortedIndices.push(n - 1);
  steps.push({
    type: 'completed',
    indices: [],
    array: [...arr],
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    description: 'Selection Sort complete! Array is fully sorted.',
    pass: n
  });

  return { steps, stats: { comparisons, swaps } };
}
