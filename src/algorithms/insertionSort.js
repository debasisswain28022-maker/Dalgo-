/**
 * Insertion Sort Step Generator
 * @param {number[]} initialArray 
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generateInsertionSortSteps(initialArray) {
  const arr = [...initialArray];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = [0]; // index 0 is trivially sorted initially

  steps.push({
    type: 'init',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: 'Initial array. Index 0 is considered sorted partition.',
    pass: 0
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push({
      type: 'pick_key',
      indices: [i],
      keyVal: key,
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Current element to insert (key): ${key} at index ${i}`,
      pass: i
    });

    while (j >= 0) {
      comparisons++;
      steps.push({
        type: 'compare',
        indices: [j, j + 1],
        keyVal: key,
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Comparing key (${key}) with element at index ${j} (${arr[j]})`,
        pass: i
      });

      if (arr[j] > key) {
        swaps++;
        arr[j + 1] = arr[j];
        
        steps.push({
          type: 'shift',
          indices: [j, j + 1],
          keyVal: key,
          array: [...arr],
          sortedIndices: [...sortedIndices],
          description: `${arr[j]} > ${key}. Shifting ${arr[j]} right to index ${j + 1}`,
          pass: i
        });
        j--;
      } else {
        break;
      }
    }

    arr[j + 1] = key;
    sortedIndices.push(i);

    steps.push({
      type: 'insert',
      indices: [j + 1],
      keyVal: key,
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Inserted key ${key} at position ${j + 1}`,
      pass: i
    });
  }

  steps.push({
    type: 'completed',
    indices: [],
    array: [...arr],
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    description: 'Insertion Sort complete! Array is sorted.',
    pass: n
  });

  return { steps, stats: { comparisons, swaps } };
}
