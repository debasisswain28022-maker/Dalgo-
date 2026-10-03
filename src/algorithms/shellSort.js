/**
 * Shell Sort Step Generator
 * Generalization of insertion sort using shrinking gap sequences.
 * @param {number[]} initialArray 
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generateShellSortSteps(initialArray) {
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
    gap: Math.floor(n / 2),
    sortedIndices: [...sortedIndices],
    description: 'Initial array for Shell Sort'
  });

  // Start with gap = floor(n/2), reduce gap by half each iteration
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    steps.push({
      type: 'gap_change',
      indices: [],
      gap: gap,
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Current Gap size = ${gap}. Comparing elements separated by ${gap} positions.`
    });

    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;

      steps.push({
        type: 'pick_key',
        indices: [i],
        gap: gap,
        keyVal: temp,
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Inspecting element ${temp} at index ${i} with gap ${gap}`
      });

      while (j >= gap) {
        comparisons++;
        steps.push({
          type: 'compare',
          indices: [j, j - gap],
          gap: gap,
          keyVal: temp,
          array: [...arr],
          sortedIndices: [...sortedIndices],
          description: `Comparing index ${j} (${arr[j]}) with gap element at index ${j - gap} (${arr[j - gap]})`
        });

        if (arr[j - gap] > temp) {
          swaps++;
          arr[j] = arr[j - gap];
          steps.push({
            type: 'shift',
            indices: [j, j - gap],
            gap: gap,
            keyVal: temp,
            array: [...arr],
            sortedIndices: [...sortedIndices],
            description: `${arr[j - gap]} > ${temp}. Shifting ${arr[j - gap]} from index ${j - gap} to index ${j}`
          });
          j -= gap;
        } else {
          break;
        }
      }

      arr[j] = temp;
      steps.push({
        type: 'insert',
        indices: [j],
        gap: gap,
        keyVal: temp,
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Placed element ${temp} into gap-sorted position at index ${j}`
      });
    }
  }

  steps.push({
    type: 'completed',
    indices: [],
    array: [...arr],
    gap: 0,
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    description: 'Shell Sort complete! Array is sorted.'
  });

  return { steps, stats: { comparisons, swaps } };
}
