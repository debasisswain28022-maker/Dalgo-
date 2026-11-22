/**
 * Intro Sort (Introsort) Step Generator
 * Musser's hybrid algorithm used in C++ std::sort:
 * 1. Starts with Quick Sort.
 * 2. Monitors recursion depth limit: 2 * floor(log2(n)).
 * 3. Switches to Heap Sort if depth limit is exceeded to prevent O(n²) worst-case.
 * 4. Switches to Insertion Sort on small partitions (size <= 8).
 * 
 * @param {number[]} initialArray 
 * @param {Object} [options]
 * @param {'asc'|'desc'} [options.order='asc']
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generateIntroSortSteps(initialArray, options = {}) {
  const order = options.order || 'asc';
  const arr = [...initialArray];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = [];

  const shouldSwap = (a, b) => order === 'desc' ? a < b : a > b;

  steps.push({
    type: 'init',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Initial array before Intro Sort (${order === 'desc' ? 'Descending' : 'Ascending'}). Hybrid: Quick Sort → Heap Sort (on depth limit) → Insertion Sort (small partitions).`,
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

  // Insertion sort for small partitions
  function insertionSort(low, high) {
    steps.push({
      type: 'pass_start',
      indices: [low, high],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Introsort Switch: Partition [${low}..${high}] size <= 8. Switching to fast Insertion Sort.`,
      comparisonsCount: comparisons,
      swapsCount: swaps
    });

    for (let i = low + 1; i <= high; i++) {
      const key = arr[i];
      let j = i - 1;

      steps.push({
        type: 'pick_key',
        indices: [i],
        keyVal: key,
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Insertion phase: picked key ${key} at index ${i}`,
        comparisonsCount: comparisons,
        swapsCount: swaps
      });

      while (j >= low) {
        comparisons++;
        steps.push({
          type: 'compare',
          indices: [j, j + 1],
          keyVal: key,
          array: [...arr],
          sortedIndices: [...sortedIndices],
          description: `Comparing key (${key}) with index ${j} (${arr[j]})`,
          comparisonsCount: comparisons,
          swapsCount: swaps
        });

        if (shouldSwap(arr[j], key)) {
          swaps++;
          arr[j + 1] = arr[j];
          steps.push({
            type: 'shift',
            indices: [j, j + 1],
            keyVal: key,
            array: [...arr],
            sortedIndices: [...sortedIndices],
            description: `Shifted element ${arr[j]} rightward`,
            comparisonsCount: comparisons,
            swapsCount: swaps
          });
          j--;
        } else {
          break;
        }
      }
      arr[j + 1] = key;
      swaps++;
    }

    for (let k = low; k <= high; k++) {
      if (!sortedIndices.includes(k)) sortedIndices.push(k);
    }
  }

  // Heap sort fallback when recursion depth exceeds threshold
  function heapSort(low, high) {
    const count = high - low + 1;

    steps.push({
      type: 'pass_start',
      indices: [low, high],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Introsort Switch: Recursion depth limit hit! Switching partition [${low}..${high}] to Heap Sort to guarantee O(n log n).`,
      comparisonsCount: comparisons,
      swapsCount: swaps
    });

    function heapify(subCount, i) {
      let extreme = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < subCount) {
        comparisons++;
        if (shouldSwap(arr[low + left], arr[low + extreme])) {
          extreme = left;
        }
      }

      if (right < subCount) {
        comparisons++;
        if (shouldSwap(arr[low + right], arr[low + extreme])) {
          extreme = right;
        }
      }

      if (extreme !== i) {
        swaps++;
        const tmp = arr[low + i];
        arr[low + i] = arr[low + extreme];
        arr[low + extreme] = tmp;

        steps.push({
          type: 'heap_swap',
          indices: [low + i, low + extreme],
          array: [...arr],
          sortedIndices: [...sortedIndices],
          description: `Heapify swap: index ${low + i} and ${low + extreme}`,
          comparisonsCount: comparisons,
          swapsCount: swaps
        });

        heapify(subCount, extreme);
      }
    }

    // Build heap
    for (let i = Math.floor(count / 2) - 1; i >= 0; i--) {
      heapify(count, i);
    }

    // Extract elements from heap
    for (let i = count - 1; i > 0; i--) {
      swaps++;
      const tmp = arr[low];
      arr[low] = arr[low + i];
      arr[low + i] = tmp;

      if (!sortedIndices.includes(low + i)) sortedIndices.push(low + i);

      steps.push({
        type: 'heap_swap',
        indices: [low, low + i],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Extracted heap root to settled position ${low + i}`,
        comparisonsCount: comparisons,
        swapsCount: swaps
      });

      heapify(i, 0);
    }

    if (!sortedIndices.includes(low)) sortedIndices.push(low);
  }

  // Quick Sort partition
  function partition(low, high) {
    const pivot = arr[high];
    let i = low - 1;

    steps.push({
      type: 'pivot_select',
      indices: [high],
      pivotIdx: high,
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Quick Sort phase: Partitioning range [${low}..${high}] with pivot ${pivot}`,
      comparisonsCount: comparisons,
      swapsCount: swaps
    });

    for (let j = low; j < high; j++) {
      comparisons++;
      steps.push({
        type: 'compare',
        indices: [j, high],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Comparing index ${j} (${arr[j]}) with pivot (${pivot})`,
        comparisonsCount: comparisons,
        swapsCount: swaps
      });

      if (!shouldSwap(arr[j], pivot)) {
        i++;
        swaps++;
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;

        steps.push({
          type: 'swap',
          indices: [i, j],
          array: [...arr],
          sortedIndices: [...sortedIndices],
          description: `Partition swap: index ${i} (${arr[j]}) ↔ index ${j} (${arr[i]})`,
          comparisonsCount: comparisons,
          swapsCount: swaps
        });
      }
    }

    swaps++;
    const tmp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = tmp;

    if (!sortedIndices.includes(i + 1)) sortedIndices.push(i + 1);

    steps.push({
      type: 'place_output',
      indices: [i + 1],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Pivot ${pivot} placed into sorted index ${i + 1}`,
      comparisonsCount: comparisons,
      swapsCount: swaps
    });

    return i + 1;
  }

  const maxDepth = 2 * Math.floor(Math.log2(n || 1));

  function introsortHelper(low, high, depthLimit) {
    const size = high - low + 1;
    if (size <= 1) {
      if (size === 1 && !sortedIndices.includes(low)) sortedIndices.push(low);
      return;
    }

    if (size <= 8) {
      insertionSort(low, high);
      return;
    }

    if (depthLimit === 0) {
      heapSort(low, high);
      return;
    }

    const p = partition(low, high);
    introsortHelper(low, p - 1, depthLimit - 1);
    introsortHelper(p + 1, high, depthLimit - 1);
  }

  introsortHelper(0, n - 1, maxDepth);

  for (let i = 0; i < n; i++) {
    if (!sortedIndices.includes(i)) sortedIndices.push(i);
  }

  steps.push({
    type: 'completed',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Intro Sort complete! Fully sorted using optimal hybrid switches (${order === 'desc' ? 'descending' : 'ascending'}).`,
    comparisonsCount: comparisons,
    swapsCount: swaps
  });

  return { steps, stats: { comparisons, swaps } };
}
