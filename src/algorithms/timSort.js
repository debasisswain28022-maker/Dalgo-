/**
 * Tim Sort Step Generator
 * Tim Peters' hybrid stable sort (used in Python and Java):
 * 1. Computes minRun (4..8 for visualizer, up to 32).
 * 2. Identifies natural ascending or strictly descending runs.
 * 3. Extends short runs to minRun using Insertion Sort.
 * 4. Merges adjacent runs using a stable two-way merge.
 * 
 * @param {number[]} initialArray 
 * @param {Object} [options]
 * @param {'asc'|'desc'} [options.order='asc']
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generateTimSortSteps(initialArray, options = {}) {
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
    description: `Initial array before Tim Sort (${order === 'desc' ? 'Descending' : 'Ascending'}). Finds natural runs, extends to minRun via Insertion Sort, and merges runs stably.`,
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

  // Calculate minRun for visualizer (between 4 and 8)
  const minRun = Math.max(4, Math.min(8, Math.ceil(n / 4)));

  function binaryInsertionSort(start, end) {
    for (let i = start + 1; i <= end; i++) {
      const key = arr[i];
      let j = i - 1;

      steps.push({
        type: 'pick_key',
        indices: [i],
        keyVal: key,
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `TimSort run extension: inserting element ${key} at index ${i}`,
        comparisonsCount: comparisons,
        swapsCount: swaps
      });

      while (j >= start) {
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

        if (isOutOfOrder(arr[j], key)) {
          swaps++;
          arr[j + 1] = arr[j];
          steps.push({
            type: 'shift',
            indices: [j, j + 1],
            keyVal: key,
            array: [...arr],
            sortedIndices: [...sortedIndices],
            description: `Shifted element ${arr[j]} right`,
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
  }

  // Merge two adjacent sorted runs: arr[start..mid] and arr[mid+1..end]
  function mergeRuns(start, mid, end) {
    const leftLen = mid - start + 1;
    const rightLen = end - mid;
    const leftArr = arr.slice(start, mid + 1);
    const rightArr = arr.slice(mid + 1, end + 1);

    steps.push({
      type: 'pass_start',
      indices: [start, end],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Merging Run [${start}..${mid}] and Run [${mid + 1}..${end}]`,
      comparisonsCount: comparisons,
      swapsCount: swaps
    });

    let i = 0, j = 0, k = start;

    while (i < leftLen && j < rightLen) {
      comparisons++;
      steps.push({
        type: 'compare',
        indices: [start + i, mid + 1 + j],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Merging: comparing left run (${leftArr[i]}) vs right run (${rightArr[j]})`,
        comparisonsCount: comparisons,
        swapsCount: swaps
      });

      if (!isOutOfOrder(leftArr[i], rightArr[j])) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      swaps++;
      steps.push({
        type: 'overwrite',
        indices: [k],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Placed element ${arr[k]} into merged position ${k}`,
        comparisonsCount: comparisons,
        swapsCount: swaps
      });
      k++;
    }

    while (i < leftLen) {
      arr[k] = leftArr[i++];
      swaps++;
      k++;
    }
    while (j < rightLen) {
      arr[k] = rightArr[j++];
      swaps++;
      k++;
    }
  }

  // 1. Identify natural runs and extend short runs
  const runs = [];
  let curr = 0;

  while (curr < n) {
    let runStart = curr;
    let runEnd = curr;

    if (runEnd < n - 1) {
      runEnd++;
      comparisons++;
      if (isOutOfOrder(arr[runStart], arr[runEnd])) {
        // Strictly descending: reverse to ascending
        while (runEnd < n - 1) {
          comparisons++;
          if (isOutOfOrder(arr[runEnd], arr[runEnd + 1])) {
            runEnd++;
          } else {
            break;
          }
        }
        // Reverse descending run
        let l = runStart, r = runEnd;
        while (l < r) {
          swaps++;
          const tmp = arr[l];
          arr[l] = arr[r];
          arr[r] = tmp;
          l++;
          r--;
        }
      } else {
        // Ascending run
        while (runEnd < n - 1) {
          comparisons++;
          if (!isOutOfOrder(arr[runEnd], arr[runEnd + 1])) {
            runEnd++;
          } else {
            break;
          }
        }
      }
    }

    const runLen = runEnd - runStart + 1;
    if (runLen < minRun) {
      const targetEnd = Math.min(n - 1, runStart + minRun - 1);
      binaryInsertionSort(runStart, targetEnd);
      runEnd = targetEnd;
    }

    runs.push({ start: runStart, end: runEnd });
    curr = runEnd + 1;
  }

  // 2. Merge runs pairwise until only 1 run remains
  while (runs.length > 1) {
    const newRuns = [];
    for (let i = 0; i < runs.length; i += 2) {
      if (i + 1 < runs.length) {
        mergeRuns(runs[i].start, runs[i].end, runs[i + 1].end);
        newRuns.push({ start: runs[i].start, end: runs[i + 1].end });
      } else {
        newRuns.push(runs[i]);
      }
    }
    runs.length = 0;
    runs.push(...newRuns);
  }

  for (let i = 0; i < n; i++) sortedIndices.push(i);

  steps.push({
    type: 'completed',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Tim Sort complete! All runs merged into final ${order === 'desc' ? 'descending' : 'ascending'} order.`,
    comparisonsCount: comparisons,
    swapsCount: swaps
  });

  return { steps, stats: { comparisons, swaps } };
}
