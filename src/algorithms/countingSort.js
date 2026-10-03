/**
 * Counting Sort Step Generator
 * Non-comparison integer sorting algorithm.
 * @param {number[]} initialArray 
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generateCountingSortSteps(initialArray) {
  const arr = [...initialArray];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let swaps = 0;

  if (n === 0) return { steps: [], stats: { comparisons: 0, swaps: 0 } };

  steps.push({
    type: 'init',
    indices: [],
    array: [...arr],
    countArray: [],
    sortedIndices: [],
    description: 'Initial array for Counting Sort'
  });

  const max = Math.max(...arr);
  const min = Math.min(...arr); // handle possible min shift if needed (assumes non-negative or offset)
  const range = max - min + 1;

  const count = new Array(range).fill(0);

  steps.push({
    type: 'count_init',
    indices: [],
    array: [...arr],
    countArray: [...count],
    minOffset: min,
    sortedIndices: [],
    description: `Created count array of size ${range} (range [${min}..${max}]) initialized to 0`
  });

  // Step 1: Count occurrences
  for (let i = 0; i < n; i++) {
    const val = arr[i];
    const countIdx = val - min;
    count[countIdx]++;
    swaps++; // auxiliary access

    steps.push({
      type: 'count_increment',
      indices: [i],
      countIdx: countIdx,
      array: [...arr],
      countArray: [...count],
      minOffset: min,
      sortedIndices: [],
      description: `Counting element ${val} at index ${i} → incremented count[${val}] to ${count[countIdx]}`
    });
  }

  // Step 2: Cumulative counts
  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
    swaps++;
    steps.push({
      type: 'cumulative_count',
      countIdx: i,
      array: [...arr],
      countArray: [...count],
      minOffset: min,
      sortedIndices: [],
      description: `Cumulative sum count[${i + min}] = count[${i + min}] + count[${i - 1 + min}] = ${count[i]}`
    });
  }

  // Step 3: Build output array
  const output = new Array(n).fill(0);
  const sortedIndices = [];

  for (let i = n - 1; i >= 0; i--) {
    const val = arr[i];
    const countIdx = val - min;
    const pos = count[countIdx] - 1;
    output[pos] = val;
    count[countIdx]--;
    swaps++;

    steps.push({
      type: 'place_output',
      indices: [i],
      outputIdx: pos,
      placedVal: val,
      array: [...output],
      countArray: [...count],
      minOffset: min,
      sortedIndices: [...sortedIndices],
      description: `Placing value ${val} from original index ${i} to output index ${pos}`
    });
  }

  // Copy output back to main array representation
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
    sortedIndices.push(i);
  }

  steps.push({
    type: 'completed',
    indices: [],
    array: [...arr],
    countArray: [...count],
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    description: 'Counting Sort complete! All elements placed in sorted order.'
  });

  return { steps, stats: { comparisons, swaps } };
}
