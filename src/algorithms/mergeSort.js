/**
 * Educational Merge Sort Step Generator
 * Emits detailed atomic steps for DIVIDE, SINGLE ELEMENT, and MERGE phases.
 * @param {number[]} initialArray 
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generateMergeSortSteps(initialArray) {
  const mainArr = [...initialArray];
  const n = mainArr.length;
  const steps = [];

  let comparisonsCount = 0;
  let movesCount = 0;

  if (n === 0) {
    return { steps: [], stats: { comparisons: 0, swaps: 0 } };
  }

  // Calculate max levels for divide phase
  const maxLevels = Math.ceil(Math.log2(Math.max(n, 2)));

  // Global tree nodes collection to track visual tree structure
  // Each node: { id, level, indexInLevel, parentId, values: [...], range: [start, end], status: 'pending'|'active'|'split'|'merging'|'merged' }
  const treeNodesMap = new Map();

  function createNodeId(level, idx) {
    return `node-${level}-${idx}`;
  }

  // Helper to build initial tree node hierarchy
  function buildTreeSkeleton(arr, start, end, level, indexInLevel, parentId = null) {
    const nodeId = createNodeId(level, indexInLevel);
    const node = {
      id: nodeId,
      level,
      indexInLevel,
      parentId,
      range: [start, end],
      values: arr.slice(start, end + 1),
      status: 'pending',
      children: []
    };
    treeNodesMap.set(nodeId, node);

    if (start < end) {
      const mid = Math.floor((start + end) / 2);
      const leftChildId = buildTreeSkeleton(arr, start, mid, level + 1, indexInLevel * 2, nodeId);
      const rightChildId = buildTreeSkeleton(arr, mid + 1, end, level + 1, indexInLevel * 2 + 1, nodeId);
      node.children = [leftChildId, rightChildId];
    }
    return nodeId;
  }

  const rootId = buildTreeSkeleton(mainArr, 0, n - 1, 0, 0);

  function getTreeSnapshot() {
    const snapshot = [];
    treeNodesMap.forEach((node) => {
      snapshot.push({
        id: node.id,
        level: node.level,
        indexInLevel: node.indexInLevel,
        parentId: node.parentId,
        range: [...node.range],
        values: [...node.values],
        status: node.status,
        children: [...node.children]
      });
    });
    return snapshot;
  }

  // STEP 0: Initial State
  steps.push({
    type: 'init',
    phase: 'DIVIDING',
    divideLevel: 0,
    mergeLevel: 0,
    totalDivideLevels: maxLevels,
    treeStructure: getTreeSnapshot(),
    leftArray: [],
    rightArray: [],
    resultArray: [],
    leftCompareIdx: null,
    rightCompareIdx: null,
    comparedValues: null,
    description: `Original unsorted array containing ${n} elements. Preparing recursive divide phase.`,
    arraySnapshot: [...mainArr],
    activeRange: [0, n - 1],
    comparisonsCount,
    movesCount
  });

  if (n === 1) {
    const rootNode = treeNodesMap.get(rootId);
    rootNode.status = 'merged';
    steps.push({
      type: 'completed',
      phase: 'COMPLETED',
      divideLevel: 0,
      mergeLevel: 0,
      totalDivideLevels: 0,
      treeStructure: getTreeSnapshot(),
      leftArray: [],
      rightArray: [],
      resultArray: [...mainArr],
      leftCompareIdx: null,
      rightCompareIdx: null,
      comparedValues: null,
      description: 'Single element array is trivially sorted! Merge Sort Complete.',
      arraySnapshot: [...mainArr],
      activeRange: [0, 0],
      comparisonsCount: 0,
      movesCount: 0
    });
    return { steps, stats: { comparisons: 0, swaps: 0 } };
  }

  // Recursively process Divide & Merge steps
  function executeMergeSort(nodeId) {
    const node = treeNodesMap.get(nodeId);
    const [start, end] = node.range;

    // Set node active for splitting
    node.status = 'active';

    if (start < end) {
      const mid = Math.floor((start + end) / 2);
      const [leftId, rightId] = node.children;
      const leftNode = treeNodesMap.get(leftId);
      const rightNode = treeNodesMap.get(rightId);

      steps.push({
        type: 'split',
        phase: 'DIVIDING',
        divideLevel: node.level + 1,
        mergeLevel: 0,
        totalDivideLevels: maxLevels,
        treeStructure: getTreeSnapshot(),
        splitNodeId: nodeId,
        leftArray: [...leftNode.values],
        rightArray: [...rightNode.values],
        resultArray: [],
        leftCompareIdx: null,
        rightCompareIdx: null,
        comparedValues: null,
        description: `Dividing section [${node.values.join(', ')}] into Left [${leftNode.values.join(', ')}] and Right [${rightNode.values.join(', ')}]`,
        arraySnapshot: [...mainArr],
        activeRange: [start, end],
        comparisonsCount,
        movesCount
      });

      node.status = 'split';

      // Recursively split Left
      executeMergeSort(leftId);
      // Recursively split Right
      executeMergeSort(rightId);

      // Now Merge Left & Right
      performMerge(nodeId, leftId, rightId);
    } else {
      // Base Case: Single element
      node.status = 'base_case';
      steps.push({
        type: 'base_case',
        phase: 'BASE CASE',
        divideLevel: node.level,
        mergeLevel: 0,
        totalDivideLevels: maxLevels,
        treeStructure: getTreeSnapshot(),
        baseNodeId: nodeId,
        leftArray: [],
        rightArray: [],
        resultArray: [...node.values],
        leftCompareIdx: null,
        rightCompareIdx: null,
        comparedValues: null,
        description: `Base Case: Subarray [${node.values[0]}] contains single element at index ${start}.`,
        arraySnapshot: [...mainArr],
        activeRange: [start, end],
        comparisonsCount,
        movesCount
      });
    }
  }

  function performMerge(parentNodeId, leftChildId, rightChildId) {
    const parentNode = treeNodesMap.get(parentNodeId);
    const leftNode = treeNodesMap.get(leftChildId);
    const rightNode = treeNodesMap.get(rightChildId);

    const [start, end] = parentNode.range;
    const mid = Math.floor((start + end) / 2);

    parentNode.status = 'merging';
    leftNode.status = 'merging';
    rightNode.status = 'merging';

    const leftVals = [...leftNode.values];
    const rightVals = [...rightNode.values];
    const mergedResult = [];

    let i = 0;
    let j = 0;
    let mainIdx = start;

    steps.push({
      type: 'start_merge',
      phase: 'MERGING',
      divideLevel: parentNode.level,
      mergeLevel: maxLevels - parentNode.level,
      totalDivideLevels: maxLevels,
      treeStructure: getTreeSnapshot(),
      parentNodeId,
      leftChildId,
      rightChildId,
      leftArray: [...leftVals],
      rightArray: [...rightVals],
      resultArray: [],
      leftCompareIdx: 0,
      rightCompareIdx: 0,
      comparedValues: null,
      description: `Starting Merge of Left [${leftVals.join(', ')}] and Right [${rightVals.join(', ')}]`,
      arraySnapshot: [...mainArr],
      activeRange: [start, end],
      comparisonsCount,
      movesCount
    });

    // Merge loop
    while (i < leftVals.length && j < rightVals.length) {
      comparisonsCount++;
      const valL = leftVals[i];
      const valR = rightVals[j];
      const operator = valL <= valR ? '<=' : '>';

      // Step: Compare
      steps.push({
        type: 'compare',
        phase: 'MERGING',
        divideLevel: parentNode.level,
        mergeLevel: maxLevels - parentNode.level,
        totalDivideLevels: maxLevels,
        treeStructure: getTreeSnapshot(),
        leftArray: [...leftVals],
        rightArray: [...rightVals],
        resultArray: [...mergedResult],
        leftCompareIdx: i,
        rightCompareIdx: j,
        comparedValues: { leftVal: valL, rightVal: valR, operator },
        description: `Comparing Left element ${valL} and Right element ${valR}`,
        arraySnapshot: [...mainArr],
        activeRange: [start, end],
        comparisonsCount,
        movesCount
      });

      if (valL <= valR) {
        movesCount++;
        mergedResult.push(valL);
        mainArr[mainIdx] = valL;

        steps.push({
          type: 'take_left',
          phase: 'MERGING',
          divideLevel: parentNode.level,
          mergeLevel: maxLevels - parentNode.level,
          totalDivideLevels: maxLevels,
          treeStructure: getTreeSnapshot(),
          leftArray: [...leftVals],
          rightArray: [...rightVals],
          resultArray: [...mergedResult],
          leftCompareIdx: i,
          rightCompareIdx: j,
          takenValue: valL,
          comparedValues: { leftVal: valL, rightVal: valR, operator: '<=' },
          description: `${valL} <= ${valR} → Moving ${valL} from Left array into Result array.`,
          arraySnapshot: [...mainArr],
          activeRange: [start, end],
          comparisonsCount,
          movesCount
        });
        i++;
      } else {
        movesCount++;
        mergedResult.push(valR);
        mainArr[mainIdx] = valR;

        steps.push({
          type: 'take_right',
          phase: 'MERGING',
          divideLevel: parentNode.level,
          mergeLevel: maxLevels - parentNode.level,
          totalDivideLevels: maxLevels,
          treeStructure: getTreeSnapshot(),
          leftArray: [...leftVals],
          rightArray: [...rightVals],
          resultArray: [...mergedResult],
          leftCompareIdx: i,
          rightCompareIdx: j,
          takenValue: valR,
          comparedValues: { leftVal: valL, rightVal: valR, operator: '>' },
          description: `${valR} < ${valL} → Moving ${valR} from Right array into Result array.`,
          arraySnapshot: [...mainArr],
          activeRange: [start, end],
          comparisonsCount,
          movesCount
        });
        j++;
      }
      mainIdx++;
    }

    // Append remaining Left elements
    while (i < leftVals.length) {
      movesCount++;
      const valL = leftVals[i];
      mergedResult.push(valL);
      mainArr[mainIdx] = valL;

      steps.push({
        type: 'append_remaining',
        phase: 'MERGING',
        divideLevel: parentNode.level,
        mergeLevel: maxLevels - parentNode.level,
        totalDivideLevels: maxLevels,
        treeStructure: getTreeSnapshot(),
        leftArray: [...leftVals],
        rightArray: [...rightVals],
        resultArray: [...mergedResult],
        leftCompareIdx: i,
        rightCompareIdx: null,
        takenValue: valL,
        comparedValues: null,
        description: `Right array exhausted. Appending remaining Left element ${valL} into Result array.`,
        arraySnapshot: [...mainArr],
        activeRange: [start, end],
        comparisonsCount,
        movesCount
      });
      i++;
      mainIdx++;
    }

    // Append remaining Right elements
    while (j < rightVals.length) {
      movesCount++;
      const valR = rightVals[j];
      mergedResult.push(valR);
      mainArr[mainIdx] = valR;

      steps.push({
        type: 'append_remaining',
        phase: 'MERGING',
        divideLevel: parentNode.level,
        mergeLevel: maxLevels - parentNode.level,
        totalDivideLevels: maxLevels,
        treeStructure: getTreeSnapshot(),
        leftArray: [...leftVals],
        rightArray: [...rightVals],
        resultArray: [...mergedResult],
        leftCompareIdx: null,
        rightCompareIdx: j,
        takenValue: valR,
        comparedValues: null,
        description: `Left array exhausted. Appending remaining Right element ${valR} into Result array.`,
        arraySnapshot: [...mainArr],
        activeRange: [start, end],
        comparisonsCount,
        movesCount
      });
      j++;
      mainIdx++;
    }

    // Node is now merged
    parentNode.values = [...mergedResult];
    parentNode.status = 'merged';

    steps.push({
      type: 'merge_complete',
      phase: 'MERGING',
      divideLevel: parentNode.level,
      mergeLevel: maxLevels - parentNode.level,
      totalDivideLevels: maxLevels,
      treeStructure: getTreeSnapshot(),
      parentNodeId,
      leftArray: [...leftVals],
      rightArray: [...rightVals],
      resultArray: [...mergedResult],
      leftCompareIdx: null,
      rightCompareIdx: null,
      comparedValues: null,
      description: `Completed Merge for section [${start}..${end}] → Result: [${mergedResult.join(', ')}]`,
      arraySnapshot: [...mainArr],
      activeRange: [start, end],
      comparisonsCount,
      movesCount
    });
  }

  // Execute recursive generation
  executeMergeSort(rootId);

  // Final Completion Step
  steps.push({
    type: 'completed',
    phase: 'COMPLETED',
    divideLevel: 0,
    mergeLevel: maxLevels,
    totalDivideLevels: maxLevels,
    treeStructure: getTreeSnapshot(),
    leftArray: [],
    rightArray: [],
    resultArray: [...mainArr],
    leftCompareIdx: null,
    rightCompareIdx: null,
    comparedValues: null,
    description: `Merge Sort Completed! Original array is fully sorted: [${mainArr.join(', ')}]`,
    arraySnapshot: [...mainArr],
    activeRange: [0, n - 1],
    comparisonsCount,
    movesCount
  });

  return { steps, stats: { comparisons: comparisonsCount, swaps: movesCount } };
}
