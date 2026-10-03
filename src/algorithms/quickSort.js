/**
 * Educational Quick Sort Step Generator
 * Emits detailed atomic steps for Pivot Selection, Partition Pointers (i, j),
 * Element Comparisons, Swaps, 3-Partition Separation, and Recursion Tree nodes.
 * 
 * @param {number[]} initialArray 
 * @param {string} pivotStrategy - 'last' | 'first' | 'middle' | 'random'
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number, partitionsCount: number } }}
 */
export function generateQuickSortSteps(initialArray, pivotStrategy = 'last') {
  const mainArr = [...initialArray];
  const n = mainArr.length;
  const steps = [];

  let comparisonsCount = 0;
  let swapsCount = 0;
  let partitionsCount = 0;
  const sortedIndices = [];

  if (n === 0) {
    return { steps: [], stats: { comparisons: 0, swaps: 0, partitionsCount: 0 } };
  }

  // Recursion Tree nodes collection
  // Node: { id, low, high, pivotVal, pivotIdx, leftRange, rightRange, status: 'pending'|'partitioning'|'completed' }
  const treeNodesMap = new Map();

  function createNodeId(low, high) {
    return `qs-node-${low}-${high}`;
  }

  function getTreeSnapshot() {
    const snapshot = [];
    treeNodesMap.forEach((node) => {
      snapshot.push({
        id: node.id,
        low: node.low,
        high: node.high,
        range: [node.low, node.high],
        values: mainArr.slice(node.low, node.high + 1),
        pivotVal: node.pivotVal,
        pivotIdx: node.pivotIdx,
        status: node.status,
        children: [...node.children]
      });
    });
    return snapshot;
  }

  // Initial Step
  steps.push({
    type: 'init',
    phase: 'INITIAL ARRAY',
    array: [...mainArr],
    sortedIndices: [...sortedIndices],
    activeRange: [0, n - 1],
    pivotIdx: null,
    pivotVal: null,
    pointerI: -1,
    pointerJ: -1,
    comparedValues: null,
    codeLine: 1, // "QUICK_SORT(A, low, high)"
    description: `Initial unsorted array of ${n} elements. Using Pivot Strategy: ${pivotStrategy.toUpperCase()}.`,
    treeStructure: getTreeSnapshot(),
    comparisonsCount,
    swapsCount,
    partitionsCount
  });

  if (n === 1) {
    sortedIndices.push(0);
    steps.push({
      type: 'completed',
      phase: 'COMPLETED',
      array: [...mainArr],
      sortedIndices: [0],
      activeRange: [0, 0],
      pivotIdx: null,
      pivotVal: null,
      pointerI: 0,
      pointerJ: 0,
      comparedValues: null,
      codeLine: 5,
      description: 'Single element array is trivially sorted! Quick Sort Completed.',
      treeStructure: getTreeSnapshot(),
      comparisonsCount: 0,
      swapsCount: 0,
      partitionsCount: 0
    });
    return { steps, stats: { comparisons: 0, swaps: 0, partitionsCount: 0 } };
  }

  // Helper to pick pivot index based on strategy
  function pickPivotIndex(low, high) {
    if (pivotStrategy === 'first') return low;
    if (pivotStrategy === 'middle') return Math.floor((low + high) / 2);
    if (pivotStrategy === 'random') return low + Math.floor(Math.random() * (high - low + 1));
    return high; // default 'last'
  }

  function quickSort(low, high, parentNodeId = null) {
    if (low < high) {
      const nodeId = createNodeId(low, high);
      const node = {
        id: nodeId,
        low,
        high,
        pivotVal: null,
        pivotIdx: null,
        status: 'partitioning',
        children: []
      };
      treeNodesMap.set(nodeId, node);
      if (parentNodeId && treeNodesMap.has(parentNodeId)) {
        treeNodesMap.get(parentNodeId).children.push(nodeId);
      }

      steps.push({
        type: 'recursive_call',
        phase: 'RECURSION',
        array: [...mainArr],
        sortedIndices: [...sortedIndices],
        activeRange: [low, high],
        pivotIdx: null,
        pivotVal: null,
        pointerI: low - 1,
        pointerJ: low,
        codeLine: 2, // "if low < high"
        description: `Recursive call QuickSort(A, low=${low}, high=${high}) on range [${low}..${high}]`,
        treeStructure: getTreeSnapshot(),
        comparisonsCount,
        swapsCount,
        partitionsCount
      });

      const pivotFinalIdx = partition(low, high, nodeId);
      node.pivotIdx = pivotFinalIdx;
      node.pivotVal = mainArr[pivotFinalIdx];
      node.status = 'completed';

      sortedIndices.push(pivotFinalIdx);

      // Recurse Left
      quickSort(low, pivotFinalIdx - 1, nodeId);
      // Recurse Right
      quickSort(pivotFinalIdx + 1, high, nodeId);

    } else if (low === high) {
      if (!sortedIndices.includes(low)) sortedIndices.push(low);
      steps.push({
        type: 'base_case_element',
        phase: 'BASE CASE',
        array: [...mainArr],
        sortedIndices: [...sortedIndices],
        activeRange: [low, high],
        pivotIdx: low,
        pivotVal: mainArr[low],
        pointerI: low,
        pointerJ: low,
        codeLine: 1,
        description: `Subarray at index ${low} contains single element (${mainArr[low]}) — marked sorted.`,
        treeStructure: getTreeSnapshot(),
        comparisonsCount,
        swapsCount,
        partitionsCount
      });
    }
  }

  function partition(low, high, nodeId) {
    partitionsCount++;
    const rawPivotIdx = pickPivotIndex(low, high);
    
    // If strategy is not 'last', swap chosen pivot to last index high for uniform Lomuto partitioning
    if (rawPivotIdx !== high) {
      swapsCount++;
      const temp = mainArr[rawPivotIdx];
      mainArr[rawPivotIdx] = mainArr[high];
      mainArr[high] = temp;

      steps.push({
        type: 'swap_pivot_to_end',
        phase: 'PIVOT SELECTION',
        array: [...mainArr],
        sortedIndices: [...sortedIndices],
        activeRange: [low, high],
        pivotIdx: high,
        pivotVal: mainArr[high],
        pointerI: low - 1,
        pointerJ: low,
        codeLine: 4, // "p = PARTITION(A, low, high)"
        description: `Pivot Strategy (${pivotStrategy.toUpperCase()}): Moved selected pivot ${mainArr[high]} to end index ${high}`,
        treeStructure: getTreeSnapshot(),
        comparisonsCount,
        swapsCount,
        partitionsCount
      });
    }

    const pivotVal = mainArr[high];
    const pivotIdx = high;

    steps.push({
      type: 'select_pivot',
      phase: 'PIVOT SELECTION',
      array: [...mainArr],
      sortedIndices: [...sortedIndices],
      activeRange: [low, high],
      pivotIdx: high,
      pivotVal: pivotVal,
      pointerI: low - 1,
      pointerJ: low,
      codeLine: 4,
      description: `PIVOT SELECTED: Pivot = ${pivotVal} at index ${high} for partition range [${low}..${high}]`,
      treeStructure: getTreeSnapshot(),
      comparisonsCount,
      swapsCount,
      partitionsCount
    });

    let i = low - 1;

    steps.push({
      type: 'pointer_init',
      phase: 'PARTITION POINTERS',
      array: [...mainArr],
      sortedIndices: [...sortedIndices],
      activeRange: [low, high],
      pivotIdx: high,
      pivotVal: pivotVal,
      pointerI: i,
      pointerJ: low,
      codeLine: 4,
      description: `Initialized partition pointers: i = ${i} (boundary of elements < pivot) and j = ${low} (current scanner)`,
      treeStructure: getTreeSnapshot(),
      comparisonsCount,
      swapsCount,
      partitionsCount
    });

    for (let j = low; j < high; j++) {
      comparisonsCount++;
      const currentVal = mainArr[j];

      // Step: Compare
      steps.push({
        type: 'compare',
        phase: 'COMPARE ELEMENT WITH PIVOT',
        array: [...mainArr],
        sortedIndices: [...sortedIndices],
        activeRange: [low, high],
        pivotIdx: high,
        pivotVal: pivotVal,
        pointerI: i,
        pointerJ: j,
        comparedValues: { currentVal, pivotVal, isLess: currentVal < pivotVal },
        codeLine: 4,
        description: `Comparing Current element A[j=${j}] (${currentVal}) with Pivot (${pivotVal}): ${currentVal} ${currentVal < pivotVal ? '<' : '>='} ${pivotVal}`,
        treeStructure: getTreeSnapshot(),
        comparisonsCount,
        swapsCount,
        partitionsCount
      });

      if (currentVal < pivotVal) {
        i++;
        if (i !== j) {
          swapsCount++;
          const temp = mainArr[i];
          mainArr[i] = mainArr[j];
          mainArr[j] = temp;

          steps.push({
            type: 'swap',
            phase: 'SWAP ELEMENTS',
            array: [...mainArr],
            sortedIndices: [...sortedIndices],
            activeRange: [low, high],
            pivotIdx: high,
            pivotVal: pivotVal,
            pointerI: i,
            pointerJ: j,
            swappedIndices: [i, j],
            swappedValues: [mainArr[i], mainArr[j]],
            comparedValues: { currentVal, pivotVal, isLess: true },
            codeLine: 4,
            description: `${currentVal} < ${pivotVal} → Move i forward to ${i} and swap A[i] (${mainArr[i]}) with A[j] (${mainArr[j]})`,
            treeStructure: getTreeSnapshot(),
            comparisonsCount,
            swapsCount,
            partitionsCount
          });
        } else {
          steps.push({
            type: 'no_swap_same_index',
            phase: 'SWAP ELEMENTS',
            array: [...mainArr],
            sortedIndices: [...sortedIndices],
            activeRange: [low, high],
            pivotIdx: high,
            pivotVal: pivotVal,
            pointerI: i,
            pointerJ: j,
            comparedValues: { currentVal, pivotVal, isLess: true },
            codeLine: 4,
            description: `${currentVal} < ${pivotVal} → Move i forward to ${i}. Element already in correct left partition.`,
            treeStructure: getTreeSnapshot(),
            comparisonsCount,
            swapsCount,
            partitionsCount
          });
        }
      } else {
        steps.push({
          type: 'no_swap',
          phase: 'COMPARE ELEMENT WITH PIVOT',
          array: [...mainArr],
          sortedIndices: [...sortedIndices],
          activeRange: [low, high],
          pivotIdx: high,
          pivotVal: pivotVal,
          pointerI: i,
          pointerJ: j,
          comparedValues: { currentVal, pivotVal, isLess: false },
          codeLine: 4,
          description: `${currentVal} >= pivot (${pivotVal}) → No swap. Move scanner j to next element.`,
          treeStructure: getTreeSnapshot(),
          comparisonsCount,
          swapsCount,
          partitionsCount
        });
      }
    }

    // Place pivot in final position (i + 1)
    swapsCount++;
    const finalPivotIdx = i + 1;
    const temp = mainArr[finalPivotIdx];
    mainArr[finalPivotIdx] = mainArr[high];
    mainArr[high] = temp;

    const leftPartition = mainArr.slice(low, finalPivotIdx);
    const rightPartition = mainArr.slice(finalPivotIdx + 1, high + 1);

    steps.push({
      type: 'swap_pivot',
      phase: 'PIVOT FINAL POSITION',
      array: [...mainArr],
      sortedIndices: [...sortedIndices],
      activeRange: [low, high],
      pivotIdx: finalPivotIdx,
      pivotVal: pivotVal,
      pointerI: finalPivotIdx,
      pointerJ: high,
      swappedIndices: [high, finalPivotIdx],
      codeLine: 4,
      description: `Placing Pivot ${pivotVal} into its final sorted index ${finalPivotIdx}. Swapped index ${high} with index ${finalPivotIdx}.`,
      treeStructure: getTreeSnapshot(),
      comparisonsCount,
      swapsCount,
      partitionsCount
    });

    steps.push({
      type: 'partition_complete',
      phase: 'PARTITION COMPLETE',
      array: [...mainArr],
      sortedIndices: [...sortedIndices, finalPivotIdx],
      activeRange: [low, high],
      pivotIdx: finalPivotIdx,
      pivotVal: pivotVal,
      leftPartition: [...leftPartition],
      rightPartition: [...rightPartition],
      codeLine: 4,
      description: `Partition Complete for range [${low}..${high}]: Left (Less) = [${leftPartition.join(', ')}], Pivot = ${pivotVal}, Right (Greater) = [${rightPartition.join(', ')}]`,
      treeStructure: getTreeSnapshot(),
      comparisonsCount,
      swapsCount,
      partitionsCount
    });

    return finalPivotIdx;
  }

  // Execute algorithm
  quickSort(0, n - 1);

  // Ensure all indices marked sorted
  for (let k = 0; k < n; k++) {
    if (!sortedIndices.includes(k)) sortedIndices.push(k);
  }

  steps.push({
    type: 'completed',
    phase: 'COMPLETED',
    array: [...mainArr],
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    activeRange: [0, n - 1],
    pivotIdx: null,
    pivotVal: null,
    pointerI: n - 1,
    pointerJ: n - 1,
    codeLine: 6,
    description: `QUICK SORT COMPLETED ✓ Original Array sorted into [${mainArr.join(', ')}] across ${partitionsCount} total partitions!`,
    treeStructure: getTreeSnapshot(),
    comparisonsCount,
    swapsCount,
    partitionsCount
  });

  return { 
    steps, 
    stats: { 
      comparisons: comparisonsCount, 
      swaps: swapsCount, 
      partitionsCount 
    } 
  };
}
