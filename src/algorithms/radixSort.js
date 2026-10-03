/**
 * Radix Sort Step Generator (LSD - Least Significant Digit)
 * @param {number[]} initialArray 
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generateRadixSortSteps(initialArray) {
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
    digitPlace: 1,
    sortedIndices: [],
    description: 'Initial array for Radix Sort'
  });

  const maxNum = Math.max(...arr);

  let exp = 1; // 1s digit, 10s digit, 100s digit...

  while (Math.floor(maxNum / exp) > 0) {
    steps.push({
      type: 'digit_pass_start',
      indices: [],
      array: [...arr],
      digitPlace: exp,
      sortedIndices: [],
      description: `Sorting by digit place: ${exp}s (${exp === 1 ? 'Ones' : exp === 10 ? 'Tens' : exp === 100 ? 'Hundreds' : exp + 's'} position)`
    });

    countSortByDigit(exp);
    exp *= 10;
  }

  steps.push({
    type: 'completed',
    indices: [],
    array: [...arr],
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    description: 'Radix Sort complete! Array sorted across all digit places.'
  });

  function countSortByDigit(exp) {
    const output = new Array(n).fill(0);
    const count = new Array(10).fill(0);

    // Count digit occurrences
    for (let i = 0; i < n; i++) {
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
      swaps++;

      steps.push({
        type: 'digit_count',
        indices: [i],
        digit: digit,
        digitPlace: exp,
        array: [...arr],
        countArray: [...count],
        sortedIndices: [],
        description: `Inspecting ${arr[i]}: digit at ${exp}s place is ${digit}`
      });
    }

    // Cumulative count
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    // Place into output array
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      const pos = count[digit] - 1;
      output[pos] = arr[i];
      count[digit]--;
      swaps++;

      steps.push({
        type: 'digit_place',
        indices: [i],
        outputIdx: pos,
        placedVal: arr[i],
        digitPlace: exp,
        array: [...output],
        sortedIndices: [],
        description: `Placing element ${arr[i]} into digit-bucket position ${pos}`
      });
    }

    // Copy to main array
    for (let i = 0; i < n; i++) {
      arr[i] = output[i];
    }
  }

  return { steps, stats: { comparisons, swaps } };
}
