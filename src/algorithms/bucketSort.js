/**
 * Bucket Sort Step Generator
 * @param {number[]} initialArray 
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generateBucketSortSteps(initialArray) {
  const arr = [...initialArray];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let swaps = 0;

  if (n <= 1) {
    return {
      steps: [{
        type: 'completed',
        indices: [],
        array: [...arr],
        sortedIndices: Array.from({ length: n }, (_, k) => k),
        description: 'Bucket Sort complete!'
      }],
      stats: { comparisons: 0, swaps: 0 }
    };
  }

  steps.push({
    type: 'init',
    indices: [],
    array: [...arr],
    buckets: [],
    sortedIndices: [],
    description: 'Initial unsorted array for Bucket Sort'
  });

  const maxVal = Math.max(...arr);
  const minVal = Math.min(...arr);
  const bucketCount = Math.floor(Math.sqrt(n)) || 5;
  const bucketRange = (maxVal - minVal) / bucketCount || 1;

  const buckets = Array.from({ length: bucketCount }, () => []);

  steps.push({
    type: 'buckets_create',
    indices: [],
    array: [...arr],
    buckets: buckets.map(b => [...b]),
    sortedIndices: [],
    description: `Created ${bucketCount} empty buckets spanning value range [${minVal}..${maxVal}]`
  });

  // Step 1: Distribute array elements into buckets
  for (let i = 0; i < n; i++) {
    const val = arr[i];
    let bIdx = Math.floor((val - minVal) / bucketRange);
    if (bIdx >= bucketCount) bIdx = bucketCount - 1;

    buckets[bIdx].push(val);
    swaps++;

    steps.push({
      type: 'bucket_distribute',
      indices: [i],
      bucketIdx: bIdx,
      placedVal: val,
      array: [...arr],
      buckets: buckets.map(b => [...b]),
      sortedIndices: [],
      description: `Element ${val} placed into Bucket #${bIdx + 1}`
    });
  }

  // Step 2: Sort individual buckets using insertion sort & concatenate
  const sortedArray = [];
  
  for (let bIdx = 0; bIdx < bucketCount; bIdx++) {
    const bucket = buckets[bIdx];
    
    if (bucket.length > 0) {
      steps.push({
        type: 'bucket_sort_start',
        bucketIdx: bIdx,
        array: [...arr],
        buckets: buckets.map(b => [...b]),
        sortedIndices: [],
        description: `Sorting Bucket #${bIdx + 1} containing elements: [${bucket.join(', ')}]`
      });

      // Simple insertion sort on bucket
      for (let i = 1; i < bucket.length; i++) {
        const key = bucket[i];
        let j = i - 1;
        while (j >= 0 && bucket[j] > key) {
          comparisons++;
          swaps++;
          bucket[j + 1] = bucket[j];
          j--;
        }
        if (j >= 0) comparisons++;
        bucket[j + 1] = key;
      }

      steps.push({
        type: 'bucket_sorted',
        bucketIdx: bIdx,
        array: [...arr],
        buckets: buckets.map(b => [...b]),
        sortedIndices: [],
        description: `Bucket #${bIdx + 1} sorted: [${bucket.join(', ')}]`
      });

      for (const val of bucket) {
        sortedArray.push(val);
      }
    }
  }

  // Copy sorted back to original array format step-by-step
  for (let i = 0; i < n; i++) {
    arr[i] = sortedArray[i];
  }

  steps.push({
    type: 'completed',
    indices: [],
    array: [...arr],
    buckets: buckets.map(b => [...b]),
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    description: 'Bucket Sort complete! All sorted buckets combined.'
  });

  return { steps, stats: { comparisons, swaps } };
}
