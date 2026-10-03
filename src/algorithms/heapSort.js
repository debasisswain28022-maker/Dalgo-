/**
 * Educational Heap Sort Step Generator
 * Emits detailed atomic steps for Build Max Heap, Parent-Child Comparisons,
 * Heapify Down, Root Extraction, Heap Shrinking, and Pseudocode line highlights.
 * 
 * @param {number[]} initialArray 
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number, heapifyCount: number } }}
 */
export function generateHeapSortSteps(initialArray) {
  const mainArr = [...initialArray];
  const n = mainArr.length;
  const steps = [];

  let comparisonsCount = 0;
  let swapsCount = 0;
  let heapifyCount = 0;
  const sortedIndices = [];

  if (n === 0) {
    return { steps: [], stats: { comparisons: 0, swaps: 0, heapifyCount: 0 } };
  }

  // Initial Step
  steps.push({
    type: 'init',
    phase: 'INITIAL ARRAY',
    array: [...mainArr],
    heapSize: n,
    sortedIndices: [...sortedIndices],
    activeParentIdx: null,
    leftChildIdx: null,
    rightChildIdx: null,
    largestIdx: null,
    codeLine: 1, // "HEAP_SORT(A)"
    description: `Initial unsorted array of ${n} elements. Preparing to build Max Heap.`,
    comparisonsCount,
    swapsCount,
    heapifyCount
  });

  if (n === 1) {
    sortedIndices.push(0);
    steps.push({
      type: 'completed',
      phase: 'COMPLETED',
      array: [...mainArr],
      heapSize: 0,
      sortedIndices: [0],
      activeParentIdx: null,
      leftChildIdx: null,
      rightChildIdx: null,
      largestIdx: 0,
      codeLine: 6,
      description: 'Single element array is trivially sorted! Heap Sort Completed.',
      comparisonsCount: 0,
      swapsCount: 0,
      heapifyCount: 0
    });
    return { steps, stats: { comparisons: 0, swaps: 0, heapifyCount: 0 } };
  }

  // =========================================================================
  // PHASE 1: BUILD MAX HEAP
  // =========================================================================
  steps.push({
    type: 'build_heap_start',
    phase: 'PHASE 1: BUILD MAX HEAP',
    array: [...mainArr],
    heapSize: n,
    sortedIndices: [...sortedIndices],
    activeParentIdx: null,
    leftChildIdx: null,
    rightChildIdx: null,
    largestIdx: null,
    codeLine: 2, // "BUILD_MAX_HEAP(A)"
    description: `PHASE 1: Building Max Heap. Starting heapify from last non-leaf node index ${Math.floor(n / 2) - 1}.`,
    comparisonsCount,
    swapsCount,
    heapifyCount
  });

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i, 'BUILD MAX HEAP');
  }

  steps.push({
    type: 'max_heap_created',
    phase: 'PHASE 1: BUILD MAX HEAP',
    array: [...mainArr],
    heapSize: n,
    sortedIndices: [...sortedIndices],
    activeParentIdx: 0,
    leftChildIdx: null,
    rightChildIdx: null,
    largestIdx: 0,
    codeLine: 2,
    description: `MAX HEAP CREATED ✓ Root element A[0] (${mainArr[0]}) contains the maximum element of the active heap.`,
    comparisonsCount,
    swapsCount,
    heapifyCount
  });

  // =========================================================================
  // PHASE 2: EXTRACT MAXIMUM & SHRINK HEAP
  // =========================================================================
  let currentHeapSize = n;

  for (let i = n - 1; i > 0; i--) {
    const maxVal = mainArr[0];
    const lastVal = mainArr[i];

    // Step: Highlight root extraction swap
    steps.push({
      type: 'extract_max_start',
      phase: 'PHASE 2: EXTRACT MAXIMUM',
      array: [...mainArr],
      heapSize: currentHeapSize,
      sortedIndices: [...sortedIndices],
      activeParentIdx: 0,
      lastIdx: i,
      codeLine: 4, // "swap A[0] and A[i]"
      description: `PHASE 2: Root element A[0] (${maxVal}) is the largest in the heap. Swapping root with last heap element A[${i}] (${lastVal}).`,
      comparisonsCount,
      swapsCount,
      heapifyCount
    });

    // Perform swap
    swapsCount++;
    mainArr[0] = lastVal;
    mainArr[i] = maxVal;
    sortedIndices.push(i);

    steps.push({
      type: 'swap_root_with_last',
      phase: 'PHASE 2: EXTRACT MAXIMUM',
      array: [...mainArr],
      heapSize: currentHeapSize,
      sortedIndices: [...sortedIndices],
      activeParentIdx: 0,
      lastIdx: i,
      swappedIndices: [0, i],
      codeLine: 4,
      description: `Swapped root ${maxVal} with end element ${lastVal}. Element ${maxVal} is now placed in its final sorted position at index ${i}.`,
      comparisonsCount,
      swapsCount,
      heapifyCount
    });

    // Reduce Heap Size
    currentHeapSize--;
    steps.push({
      type: 'reduce_heap_size',
      phase: 'REDUCE HEAP SIZE',
      array: [...mainArr],
      heapSize: currentHeapSize,
      sortedIndices: [...sortedIndices],
      activeParentIdx: 0,
      codeLine: 5, // "heapSize--"
      description: `Reduced active heap size to ${currentHeapSize} / ${n}. Element ${maxVal} is moved to SORTED area.`,
      comparisonsCount,
      swapsCount,
      heapifyCount
    });

    // Heapify Root
    steps.push({
      type: 'heapify_start',
      phase: 'PHASE 3: HEAPIFY AGAIN',
      array: [...mainArr],
      heapSize: currentHeapSize,
      sortedIndices: [...sortedIndices],
      activeParentIdx: 0,
      codeLine: 6, // "HEAPIFY(A, 0, heapSize)"
      description: `Heapifying root node at index 0 (value ${mainArr[0]}) to restore Max Heap property for size ${currentHeapSize}.`,
      comparisonsCount,
      swapsCount,
      heapifyCount
    });

    heapify(currentHeapSize, 0, 'PHASE 3: HEAPIFY');
  }

  sortedIndices.push(0);

  steps.push({
    type: 'completed',
    phase: 'COMPLETED',
    array: [...mainArr],
    heapSize: 0,
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    activeParentIdx: null,
    leftChildIdx: null,
    rightChildIdx: null,
    largestIdx: null,
    codeLine: 6,
    description: `HEAP SORT COMPLETED ✓ All elements sorted into [${mainArr.join(', ')}]. Heap is empty.`,
    comparisonsCount,
    swapsCount,
    heapifyCount
  });

  return {
    steps,
    stats: {
      comparisons: comparisonsCount,
      swaps: swapsCount,
      heapifyCount
    }
  };

  // Helper Heapify Function
  function heapify(size, parentIdx, currentPhaseLabel) {
    heapifyCount++;
    let largest = parentIdx;
    const left = 2 * parentIdx + 1;
    const right = 2 * parentIdx + 2;

    const parentVal = mainArr[parentIdx];
    const leftVal = left < size ? mainArr[left] : null;
    const rightVal = right < size ? mainArr[right] : null;

    // Step: Inspect parent & children
    steps.push({
      type: 'inspect_parent_children',
      phase: currentPhaseLabel,
      array: [...mainArr],
      heapSize: size,
      sortedIndices: [...sortedIndices],
      activeParentIdx: parentIdx,
      leftChildIdx: left < size ? left : null,
      rightChildIdx: right < size ? right : null,
      largestIdx: largest,
      parentVal,
      leftVal,
      rightVal,
      codeLine: 7, // "HEAPIFY(A, i, heapSize)"
      description: `Inspecting Node index ${parentIdx} (Parent = ${parentVal}). Left Child = ${leftVal !== null ? leftVal : 'None'} (idx ${left}), Right Child = ${rightVal !== null ? rightVal : 'None'} (idx ${right}).`,
      comparisonsCount,
      swapsCount,
      heapifyCount
    });

    if (left < size) {
      comparisonsCount++;
      const isLeftLarger = mainArr[left] > mainArr[largest];
      
      steps.push({
        type: 'compare_left',
        phase: currentPhaseLabel,
        array: [...mainArr],
        heapSize: size,
        sortedIndices: [...sortedIndices],
        activeParentIdx: parentIdx,
        leftChildIdx: left,
        rightChildIdx: right < size ? right : null,
        largestIdx: isLeftLarger ? left : largest,
        parentVal,
        leftVal,
        rightVal,
        comparedValues: { val1: mainArr[left], val2: mainArr[largest], isGreater: isLeftLarger },
        codeLine: 11, // "if left < heapSize AND A[left] > A[largest]"
        description: `Comparing Left child A[${left}] (${mainArr[left]}) with current largest A[${largest}] (${mainArr[largest]}): ${mainArr[left]} ${isLeftLarger ? '>' : '<='} ${mainArr[largest]}`,
        comparisonsCount,
        swapsCount,
        heapifyCount
      });

      if (isLeftLarger) {
        largest = left;
      }
    }

    if (right < size) {
      comparisonsCount++;
      const isRightLarger = mainArr[right] > mainArr[largest];

      steps.push({
        type: 'compare_right',
        phase: currentPhaseLabel,
        array: [...mainArr],
        heapSize: size,
        sortedIndices: [...sortedIndices],
        activeParentIdx: parentIdx,
        leftChildIdx: left < size ? left : null,
        rightChildIdx: right,
        largestIdx: isRightLarger ? right : largest,
        parentVal,
        leftVal,
        rightVal,
        comparedValues: { val1: mainArr[right], val2: mainArr[largest], isGreater: isRightLarger },
        codeLine: 14, // "if right < heapSize AND A[right] > A[largest]"
        description: `Comparing Right child A[${right}] (${mainArr[right]}) with current largest A[${largest}] (${mainArr[largest]}): ${mainArr[right]} ${isRightLarger ? '>' : '<='} ${mainArr[largest]}`,
        comparisonsCount,
        swapsCount,
        heapifyCount
      });

      if (isRightLarger) {
        largest = right;
      }
    }

    if (largest !== parentIdx) {
      swapsCount++;
      const swapValParent = mainArr[parentIdx];
      const swapValLargest = mainArr[largest];

      // Perform Swap
      mainArr[parentIdx] = swapValLargest;
      mainArr[largest] = swapValParent;

      steps.push({
        type: 'heapify_swap',
        phase: currentPhaseLabel,
        array: [...mainArr],
        heapSize: size,
        sortedIndices: [...sortedIndices],
        activeParentIdx: parentIdx,
        leftChildIdx: left < size ? left : null,
        rightChildIdx: right < size ? right : null,
        largestIdx: parentIdx, // now new value is parent
        swappedIndices: [parentIdx, largest],
        swappedValues: [swapValLargest, swapValParent],
        codeLine: 18, // "swap A[i] and A[largest]"
        description: `Child at index ${largest} (${swapValLargest}) is larger than Parent at index ${parentIdx} (${swapValParent}). Swapped ${swapValParent} and ${swapValLargest}.`,
        comparisonsCount,
        swapsCount,
        heapifyCount
      });

      // Recursively heapify affected subtree
      heapify(size, largest, currentPhaseLabel);
    } else {
      steps.push({
        type: 'heapify_complete_node',
        phase: currentPhaseLabel,
        array: [...mainArr],
        heapSize: size,
        sortedIndices: [...sortedIndices],
        activeParentIdx: parentIdx,
        leftChildIdx: left < size ? left : null,
        rightChildIdx: right < size ? right : null,
        largestIdx: parentIdx,
        codeLine: 17, // "if largest != i"
        description: `Parent at index ${parentIdx} (${mainArr[parentIdx]}) is already larger than or equal to its children. Subtree heapified.`,
        comparisonsCount,
        swapsCount,
        heapifyCount
      });
    }
  }
}
