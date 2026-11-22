/**
 * Dual-Pivot Quick Sort Step Generator
 * Partitions array using two pivots (P1, P2 with P1 <= P2) dividing into 3 regions:
 * 1. Elements < P1
 * 2. Elements between P1 and P2 (P1 <= x <= P2)
 * 3. Elements > P2
 * 
 * @param {number[]} initialArray 
 * @param {Object} [options]
 * @param {'asc'|'desc'} [options.order='asc']
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generateDualPivotQuickSortSteps(initialArray, options = {}) {
  const order = options.order || 'asc';
  const arr = [...initialArray];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = [];

  const isLess = (a, b) => order === 'desc' ? a > b : a < b;
  const isGreater = (a, b) => order === 'desc' ? a < b : a > b;

  steps.push({
    type: 'init',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Initial array before Dual-Pivot Quick Sort (${order === 'desc' ? 'Descending' : 'Ascending'}). Uses two pivots to partition into 3 regions.`,
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

  function dualPivotPartition(low, high) {
    if (low >= high) {
      if (low === high && !sortedIndices.includes(low)) sortedIndices.push(low);
      return;
    }

    // Ensure arr[low] <= arr[high] (P1 <= P2)
    comparisons++;
    steps.push({
      type: 'compare',
      indices: [low, high],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Comparing boundary pivots at low (${arr[low]}) and high (${arr[high]})`,
      comparisonsCount: comparisons,
      swapsCount: swaps
    });

    if (isGreater(arr[low], arr[high])) {
      swaps++;
      const tmp = arr[low];
      arr[low] = arr[high];
      arr[high] = tmp;

      steps.push({
        type: 'swap',
        indices: [low, high],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Swapped boundary elements so Pivot 1 (${arr[low]}) <= Pivot 2 (${arr[high]})`,
        comparisonsCount: comparisons,
        swapsCount: swaps
      });
    }

    const p = arr[low];
    const q = arr[high];

    steps.push({
      type: 'pivot_select',
      indices: [low, high],
      pivotIdx: low,
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Selected Pivots: P1 = ${p} (index ${low}), P2 = ${q} (index ${high}). Partitioning into 3 regions.`,
      comparisonsCount: comparisons,
      swapsCount: swaps
    });

    let lt = low + 1;
    let gt = high - 1;
    let k = low + 1;

    while (k <= gt) {
      comparisons++;
      steps.push({
        type: 'compare',
        indices: [k, low],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Comparing element at index ${k} (${arr[k]}) with Pivot 1 (${p})`,
        comparisonsCount: comparisons,
        swapsCount: swaps
      });

      if (isLess(arr[k], p)) {
        // Belongs to Region 1 (< P1)
        swaps++;
        const tmp = arr[k];
        arr[k] = arr[lt];
        arr[lt] = tmp;

        steps.push({
          type: 'swap',
          indices: [k, lt],
          array: [...arr],
          sortedIndices: [...sortedIndices],
          description: `${arr[lt]} < P1 (${p}): moved to left region at index ${lt}`,
          comparisonsCount: comparisons,
          swapsCount: swaps
        });
        lt++;
        k++;
      } else {
        comparisons++;
        steps.push({
          type: 'compare',
          indices: [k, high],
          array: [...arr],
          sortedIndices: [...sortedIndices],
          description: `Comparing element at index ${k} (${arr[k]}) with Pivot 2 (${q})`,
          comparisonsCount: comparisons,
          swapsCount: swaps
        });

        if (isGreater(arr[k], q)) {
          // Belongs to Region 3 (> P2)
          while (k < gt) {
            comparisons++;
            if (isGreater(arr[gt], q)) {
              gt--;
            } else {
              break;
            }
          }

          swaps++;
          const tmp = arr[k];
          arr[k] = arr[gt];
          arr[gt] = tmp;

          steps.push({
            type: 'swap',
            indices: [k, gt],
            array: [...arr],
            sortedIndices: [...sortedIndices],
            description: `${arr[gt]} > P2 (${q}): exchanged into right region at index ${gt}`,
            comparisonsCount: comparisons,
            swapsCount: swaps
          });
          gt--;

          comparisons++;
          if (isLess(arr[k], p)) {
            swaps++;
            const t2 = arr[k];
            arr[k] = arr[lt];
            arr[lt] = t2;
            lt++;
          }
          k++;
        } else {
          // Belongs to Region 2 (P1 <= x <= P2)
          k++;
        }
      }
    }

    // Move pivots into their final positions
    lt--;
    gt++;

    swaps++;
    const tP1 = arr[low];
    arr[low] = arr[lt];
    arr[lt] = tP1;

    swaps++;
    const tP2 = arr[high];
    arr[high] = arr[gt];
    arr[gt] = tP2;

    if (!sortedIndices.includes(lt)) sortedIndices.push(lt);
    if (!sortedIndices.includes(gt)) sortedIndices.push(gt);

    steps.push({
      type: 'place_output',
      indices: [lt, gt],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Pivots settled in final positions: P1 at index ${lt} (${arr[lt]}), P2 at index ${gt} (${arr[gt]}).`,
      comparisonsCount: comparisons,
      swapsCount: swaps
    });

    // Recursively sort the 3 partitions
    dualPivotPartition(low, lt - 1);
    dualPivotPartition(lt + 1, gt - 1);
    dualPivotPartition(gt + 1, high);
  }

  dualPivotPartition(0, n - 1);

  for (let i = 0; i < n; i++) {
    if (!sortedIndices.includes(i)) sortedIndices.push(i);
  }

  steps.push({
    type: 'completed',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Dual-Pivot Quick Sort complete! All 3 partition branches merged into final ${order === 'desc' ? 'descending' : 'ascending'} order.`,
    comparisonsCount: comparisons,
    swapsCount: swaps
  });

  return { steps, stats: { comparisons, swaps } };
}
