/**
 * Binary Insertion Sort Step Generator
 * Employs binary search to locate the exact insertion position in O(log i) comparisons,
 * followed by block-shifting the greater elements rightward.
 * 
 * @param {number[]} initialArray 
 * @param {Object} [options]
 * @param {'asc'|'desc'} [options.order='asc']
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generateBinaryInsertionSortSteps(initialArray, options = {}) {
  const order = options.order || 'asc';
  const arr = [...initialArray];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let swaps = 0; // Tracks element shifts and insertions
  const sortedIndices = [0];

  const shouldGoBefore = (key, midVal) => order === 'desc' ? key > midVal : key < midVal;

  steps.push({
    type: 'init',
    indices: [0],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Initial array. Index 0 is trivially sorted (${order === 'desc' ? 'Descending' : 'Ascending'}).`,
    comparisonsCount: 0,
    swapsCount: 0,
    pass: 0
  });

  if (n <= 1) {
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

  for (let i = 1; i < n; i++) {
    const key = arr[i];

    steps.push({
      type: 'pick_key',
      indices: [i],
      keyVal: key,
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Pick key element ${key} at index ${i} to insert into sorted partition [0 ... ${i - 1}].`,
      comparisonsCount: comparisons,
      swapsCount: swaps,
      pass: i
    });

    // Binary search for insertion position in arr[0 ... i - 1]
    let low = 0;
    let high = i - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      comparisons++;

      steps.push({
        type: 'compare',
        indices: [mid, i],
        keyVal: key,
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Binary search: comparing key (${key}) with mid index ${mid} (${arr[mid]}) in range [${low}..${high}]`,
        comparisonsCount: comparisons,
        swapsCount: swaps,
        pass: i
      });

      if (shouldGoBefore(key, arr[mid])) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    const insertPos = low;

    steps.push({
      type: 'place_output',
      indices: [insertPos],
      keyVal: key,
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Binary search complete! Insertion target located at index ${insertPos}.`,
      comparisonsCount: comparisons,
      swapsCount: swaps,
      pass: i
    });

    // Shift elements right to create slot at insertPos
    for (let j = i - 1; j >= insertPos; j--) {
      swaps++;
      arr[j + 1] = arr[j];

      steps.push({
        type: 'shift',
        indices: [j, j + 1],
        keyVal: key,
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Shifting element ${arr[j]} right from index ${j} to ${j + 1}`,
        comparisonsCount: comparisons,
        swapsCount: swaps,
        pass: i
      });
    }

    // Insert key at insertPos
    arr[insertPos] = key;
    swaps++;
    sortedIndices.push(i);

    steps.push({
      type: 'insert',
      indices: [insertPos],
      keyVal: key,
      array: [...arr],
      sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
      description: `Inserted key ${key} at index ${insertPos}. Sorted partition now [0 ... ${i}].`,
      comparisonsCount: comparisons,
      swapsCount: swaps,
      pass: i
    });
  }

  steps.push({
    type: 'completed',
    indices: [],
    array: [...arr],
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    description: `Binary Insertion Sort complete! Array sorted in ${order === 'desc' ? 'descending' : 'ascending'} order.`,
    comparisonsCount: comparisons,
    swapsCount: swaps,
    pass: n
  });

  return { steps, stats: { comparisons, swaps } };
}
