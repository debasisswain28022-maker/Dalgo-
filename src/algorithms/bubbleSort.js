/**
 * Bubble Sort Step Generator
 * @param {number[]} array 
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generateBubbleSortSteps(initialArray) {
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
    let swappedInPass = false;
    
    steps.push({
      type: 'pass_start',
      indices: [],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Starting Pass ${i + 1}`,
      pass: i + 1
    });

    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      
      steps.push({
        type: 'compare',
        indices: [j, j + 1],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Comparing elements at index ${j} (${arr[j]}) and index ${j + 1} (${arr[j + 1]})`,
        pass: i + 1
      });

      if (arr[j] > arr[j + 1]) {
        swaps++;
        swappedInPass = true;
        
        // Swap elements
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        steps.push({
          type: 'swap',
          indices: [j, j + 1],
          array: [...arr],
          sortedIndices: [...sortedIndices],
          description: `${arr[j + 1]} > ${arr[j]}, swapping elements at index ${j} and ${j + 1}`,
          pass: i + 1
        });
      }
    }

    sortedIndices.push(n - i - 1);
    steps.push({
      type: 'sorted_element',
      indices: [n - i - 1],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Element at index ${n - i - 1} (${arr[n - i - 1]}) is now in its sorted position`,
      pass: i + 1
    });

    if (!swappedInPass) {
      // Early exit if no swaps in pass
      for (let k = 0; k < n - i - 1; k++) {
        if (!sortedIndices.includes(k)) {
          sortedIndices.push(k);
        }
      }
      steps.push({
        type: 'early_exit',
        indices: [],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: 'No swaps needed in this pass. Array is fully sorted!',
        pass: i + 1
      });
      break;
    }
  }

  // Ensure all indices marked sorted
  for (let k = 0; k < n; k++) {
    if (!sortedIndices.includes(k)) {
      sortedIndices.push(k);
    }
  }

  steps.push({
    type: 'completed',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: 'Bubble Sort complete! Array is sorted.',
    pass: n
  });

  return { steps, stats: { comparisons, swaps } };
}
