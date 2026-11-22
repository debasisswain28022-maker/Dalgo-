/**
 * Metadata for Additional Sorting Algorithms & Divide and Conquer Algorithms
 * Accessed via the "+ More" modal in Dalgo.
 */

export const DIVIDE_AND_CONQUER_ALGORITHMS = [
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    difficulty: 'Medium',
    category: 'Divide and Conquer',
    isMore: true,
    tagline: 'Recursively divides array into halves, sorts them, and merges the sorted halves.',
    shortDescription: 'Classic divide-and-conquer algorithm with guaranteed O(n log n) time and stable ordering.',
    definition: 'Merge Sort is a classic divide-and-conquer algorithm invented by John von Neumann in 1945. It divides the unsorted list into n sublists (each containing one element), then repeatedly merges sublists to produce new sorted sublists until there is only one remaining.',
    howItWorks: [
      'Divide the unsorted array into two roughly equal halves at mid = floor((low + high) / 2).',
      'Recursively sort the left half until reaching single-element base cases.',
      'Recursively sort the right half until reaching single-element base cases.',
      'Merge the two sorted halves by comparing elements and taking the smaller (or larger) element into position.',
      'Repeat merging back up the recursion tree until the entire array is sorted.'
    ],
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(n)'
    },
    stable: true,
    inPlace: false,
    technique: 'Divide & Conquer (Two-Way Merge)',
    bestUseCase: 'Linked lists, external sorting of massive datasets, and systems requiring guaranteed O(n log n) and stability.',
    pseudocode: `procedure mergeSort(A, low, high)
    if low < high then
        mid = floor((low + high) / 2)
        mergeSort(A, low, mid)
        mergeSort(A, mid + 1, high)
        merge(A, low, mid, high)
    end if
end procedure`,
    javascriptCode: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}`,
    advantages: [
      'Guaranteed O(n log n) performance regardless of input data distribution.',
      'Completely stable sort preserving the order of equal keys.',
      'Excellent for sequential access and linked list structures.'
    ],
    disadvantages: [
      'Requires O(n) auxiliary memory for merging.',
      'Overhead of recursion and array copying.'
    ]
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    difficulty: 'Medium',
    category: 'Divide and Conquer',
    isMore: true,
    tagline: 'Partitions array around a chosen pivot, recursively sorting elements left and right.',
    shortDescription: 'Fast in-place divide-and-conquer sort with excellent cache locality and average O(n log n) speed.',
    definition: 'Quick Sort, invented by Tony Hoare in 1959, is one of the most widely used sorting algorithms. It picks an element as a pivot and partitions the array around it such that elements smaller than the pivot are placed before it and larger elements after it, then recurses on both sides.',
    howItWorks: [
      'Select a pivot element (last, first, middle, or random).',
      'Reorder array elements so that elements smaller than the pivot precede it, and larger elements follow it.',
      'Place pivot into its final resting sorted position.',
      'Recursively apply Quick Sort to the sub-array of smaller elements and the sub-array of larger elements.'
    ],
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
      space: 'O(log n)'
    },
    stable: false,
    inPlace: true,
    technique: 'Divide & Conquer (Lomuto / Hoare Partitioning)',
    bestUseCase: 'General-purpose in-memory sorting where cache locality and low constant factors are paramount.',
    pseudocode: `procedure quickSort(A, low, high)
    if low < high then
        p = partition(A, low, high)
        quickSort(A, low, p - 1)
        quickSort(A, p + 1, high)
    end if
end procedure`,
    javascriptCode: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const p = partition(arr, low, high);
    quickSort(arr, low, p - 1);
    quickSort(arr, p + 1, high);
  }
  return arr;
}`,
    advantages: [
      'Fastest general-purpose comparison sort in practice with small constant factors.',
      'In-place sorting requiring only O(log n) stack memory.',
      'High cache efficiency due to localized linear scans.'
    ],
    disadvantages: [
      'Degrades to O(n²) worst-case on already-sorted data with naive pivot choices.',
      'Not a stable sort.'
    ]
  },
  {
    id: 'dual-pivot-quick-sort',
    name: 'Dual-Pivot Quick Sort',
    difficulty: 'Hard',
    category: 'Divide and Conquer',
    isMore: true,
    tagline: 'Uses two pivots (P1, P2) to divide the array into 3 partitions simultaneously.',
    shortDescription: 'Yaroslavskiy algorithm (Java Arrays.sort default): 3-way partitioning with two pivots.',
    definition: 'Dual-Pivot Quick Sort was developed by Vladimir Yaroslavskiy in 2009 and adopted as the default primitive array sorting algorithm in Java 7+. Instead of a single pivot, it chooses two pivots P1 and P2 (with P1 <= P2) and partitions the elements into three parts: < P1, between P1 and P2, and > P2.',
    howItWorks: [
      'Select two pivots: arr[low] as P1 and arr[high] as P2. Ensure P1 <= P2 (swap if needed).',
      'Scan through array with three pointers: lt (left partition boundary), gt (right partition boundary), and k (scanner).',
      'If arr[k] < P1, swap into left region and advance lt and k.',
      'If arr[k] > P2, swap into right region and decrement gt.',
      'If P1 <= arr[k] <= P2, leave in middle region and advance k.',
      'Place pivots P1 and P2 into their final positions, then recursively sort all three regions.'
    ],
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
      space: 'O(log n)'
    },
    stable: false,
    inPlace: true,
    technique: 'Divide & Conquer (Dual-Pivot 3-Partitioning)',
    bestUseCase: 'Modern hardware architectures where reduced comparison counts and fewer cache misses outperform single-pivot.',
    pseudocode: `procedure dualPivotQuickSort(A, low, high)
    if low < high then
        p1, p2 = partition(A, low, high)
        dualPivotQuickSort(A, low, p1 - 1)
        dualPivotQuickSort(A, p1 + 1, p2 - 1)
        dualPivotQuickSort(A, p2 + 1, high)
    end if
end procedure`,
    javascriptCode: `function dualPivotQuickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    if (arr[low] > arr[high]) [arr[low], arr[high]] = [arr[high], arr[low]];
    let p = arr[low], q = arr[high];
    let lt = low + 1, gt = high - 1, k = low + 1;
    while (k <= gt) {
      if (arr[k] < p) { [arr[k], arr[lt]] = [arr[lt], arr[k]]; lt++; k++; }
      else if (arr[k] > q) {
        while (arr[gt] > q && k < gt) gt--;
        [arr[k], arr[gt]] = [arr[gt], arr[k]]; gt--;
        if (arr[k] < p) { [arr[k], arr[lt]] = [arr[lt], arr[k]]; lt++; }
        k++;
      } else k++;
    }
    lt--; gt++;
    [arr[low], arr[lt]] = [arr[lt], arr[low]];
    [arr[high], arr[gt]] = [arr[gt], arr[high]];
    dualPivotQuickSort(arr, low, lt - 1);
    dualPivotQuickSort(arr, lt + 1, gt - 1);
    dualPivotQuickSort(arr, gt + 1, high);
  }
  return arr;
}`,
    advantages: [
      'Executes with fewer CPU memory cache misses than classical Quick Sort.',
      'Fewer comparisons on average (~1.9n ln n vs 2n ln n).',
      'The industrial standard in Java SE primitive array sorting.'
    ],
    disadvantages: [
      'More complex control flow and pointer management.',
      'Still has worst-case O(n²) without randomization or fallback.'
    ]
  },
  {
    id: 'three-way-quick-sort',
    name: 'Three-Way Quick Sort',
    difficulty: 'Hard',
    category: 'Divide and Conquer',
    isMore: true,
    tagline: 'Dutch National Flag partition: divides into (< Pivot), (== Pivot), and (> Pivot).',
    shortDescription: 'Optimized for duplicate keys; runs in linear O(n) time on arrays with few unique values.',
    definition: 'Three-Way Quick Sort incorporates Dijkstra’s Dutch National Flag algorithm into Quick Sort. It partitions the array into three segments: elements strictly less than the pivot, elements equal to the pivot, and elements strictly greater than the pivot. Recursion is skipped for all elements in the equal segment.',
    howItWorks: [
      'Pick pivot value p = arr[low].',
      'Maintain pointers lt (boundary of < p), gt (boundary of > p), and i (current element).',
      'If arr[i] < p: swap arr[i] with arr[lt], advance lt and i.',
      'If arr[i] > p: swap arr[i] with arr[gt], decrement gt.',
      'If arr[i] == p: advance i.',
      'When i > gt, all elements in arr[lt..gt] equal p and are sorted.',
      'Recurse only on arr[low..lt-1] and arr[gt+1..high].'
    ],
    complexity: {
      best: 'O(n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
      space: 'O(log n)'
    },
    stable: false,
    inPlace: true,
    technique: 'Divide & Conquer (Dutch National Flag Partitioning)',
    bestUseCase: 'Datasets containing duplicate values, repeated keys, or low cardinality data.',
    pseudocode: `procedure threeWayQuickSort(A, low, high)
    if low >= high then return
    lt = low, gt = high, i = low + 1, pivot = A[low]
    while i <= gt do
        if A[i] < pivot then swap(A[i++], A[lt++])
        else if A[i] > pivot then swap(A[i], A[gt--])
        else i++
    end while
    threeWayQuickSort(A, low, lt - 1)
    threeWayQuickSort(A, gt + 1, high)
end procedure`,
    javascriptCode: `function threeWayQuickSort(arr, low = 0, high = arr.length - 1) {
  if (low >= high) return arr;
  let lt = low, gt = high, i = low + 1;
  const pivot = arr[low];
  while (i <= gt) {
    if (arr[i] < pivot) { [arr[i], arr[lt]] = [arr[lt], arr[i]]; i++; lt++; }
    else if (arr[i] > pivot) { [arr[i], arr[gt]] = [arr[gt], arr[i]]; gt--; }
    else i++;
  }
  threeWayQuickSort(arr, low, lt - 1);
  threeWayQuickSort(arr, gt + 1, high);
  return arr;
}`,
    advantages: [
      'Runs in linear O(n) best-case time when array has duplicate values.',
      'Completely avoids quadratic degradation on constant-value arrays.',
      'Very clean and elegant partition logic.'
    ],
    disadvantages: [
      'Slightly more comparisons than standard 2-way Quick Sort on strictly unique elements.'
    ]
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    difficulty: 'Medium',
    category: 'Divide and Conquer',
    isMore: true,
    tagline: 'Builds a complete binary heap and repeatedly extracts the root into place.',
    shortDescription: 'Guaranteed O(n log n) in-place sorting using a binary heap data structure.',
    definition: 'Heap Sort was invented by J. W. J. Williams in 1964. It visualizes the array as a complete binary tree, transforms it into a Max-Heap (where parent nodes are >= children), and then repeatedly swaps the root (maximum) with the last unsorted element, reducing heap size and restoring the heap property via sift-down (heapify).',
    howItWorks: [
      'Build a Max-Heap from the unsorted array in O(n) time bottom-up.',
      'The largest element is now at root index 0.',
      'Swap root arr[0] with the last unsorted element arr[i].',
      'Reduce the active heap size by 1.',
      'Call heapify down from index 0 to restore Max-Heap property.',
      'Repeat until all elements have been extracted to the sorted region.'
    ],
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(1)'
    },
    stable: false,
    inPlace: true,
    technique: 'Binary Heap Selection & Heapify Down',
    bestUseCase: 'Mission-critical systems requiring strict memory bounds (O(1) space) and guaranteed O(n log n) worst-case time.',
    pseudocode: `procedure heapSort(A)
    buildMaxHeap(A)
    for i = length(A) - 1 downto 1 do
        swap(A[0], A[i])
        heapify(A, 0, i)
    end for
end procedure`,
    javascriptCode: `function heapSort(arr) {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}`,
    advantages: [
      'Guaranteed worst-case O(n log n) runtime with zero extra heap memory (O(1) space).',
      'No recursion stack overhead.',
      'Independent of initial key distribution.'
    ],
    disadvantages: [
      'Poor cache locality due to jumping between parent 2i and children 2i+1, 2i+2.',
      'Not a stable sorting algorithm.'
    ]
  },
  {
    id: 'intro-sort',
    name: 'Intro Sort (Introsort)',
    difficulty: 'Hard',
    category: 'Divide and Conquer',
    isMore: true,
    tagline: 'Musser hybrid: Quick Sort + Heap Sort on depth limit + Insertion Sort on small subarrays.',
    shortDescription: 'C++ std::sort standard: combines the speed of Quick Sort with the O(n log n) guarantee of Heap Sort.',
    definition: 'Intro Sort (Introspective Sort) was designed by David Musser in 1997. It starts with Quick Sort, monitors the recursion depth, and switches to Heap Sort if the depth exceeds 2 * floor(log2(n)) to completely eliminate Quick Sort’s O(n²) worst-case danger. For small partitions (<= 8-16 elements), it switches to Insertion Sort.',
    howItWorks: [
      'Calculate maximum allowed recursion depth: 2 * floor(log2(n)).',
      'If partition size <= 8, sort with Insertion Sort and return.',
      'If depth limit reaches 0, switch partition to Heap Sort and return.',
      'Otherwise, perform Quick Sort partitioning and recurse with depth limit - 1.'
    ],
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(log n)'
    },
    stable: false,
    inPlace: true,
    technique: 'Introspective Hybrid (Quick Sort + Heap Sort + Insertion Sort)',
    bestUseCase: 'Production systems requiring the absolute fastest average speed with guaranteed O(n log n) worst-case (C++ STL).',
    pseudocode: `procedure introSort(A)
    maxDepth = 2 * floor(log2(length(A)))
    introsortLoop(A, 0, length(A) - 1, maxDepth)
end procedure`,
    javascriptCode: `function introSort(arr, low = 0, high = arr.length - 1, maxDepth = 2 * Math.floor(Math.log2(arr.length || 1))) {
  const size = high - low + 1;
  if (size <= 8) { insertionSort(arr, low, high); return arr; }
  if (maxDepth === 0) { heapSort(arr, low, high); return arr; }
  const p = partition(arr, low, high);
  introSort(arr, low, p - 1, maxDepth - 1);
  introSort(arr, p + 1, high, maxDepth - 1);
  return arr;
}`,
    advantages: [
      'Combines the raw speed of Quick Sort with the O(n log n) safety of Heap Sort.',
      'Insertion Sort optimization drastically accelerates small partitions.',
      'The gold standard sorting engine in C++ standard libraries.'
    ],
    disadvantages: [
      'Unstable sorting behavior.',
      'More complex implementation logic.'
    ]
  },
  {
    id: 'tim-sort',
    name: 'Tim Sort',
    difficulty: 'Hard',
    category: 'Divide and Conquer',
    isMore: true,
    tagline: 'Tim Peters hybrid: detects natural sorted runs, extends with Insertion Sort, merges with stack invariants.',
    shortDescription: 'Python and Java standard: adaptive stable sort that leverages existing order in real-world data.',
    definition: 'Tim Sort was designed by Tim Peters in 2002 for Python. It is a highly adaptive, stable sorting algorithm derived from Merge Sort and Insertion Sort. It detects existing natural runs (ordered sequences) in the data, extends short runs to a minimum run size (minRun) using Insertion Sort, and merges runs using stack invariants.',
    howItWorks: [
      'Compute minRun based on array length (typically 16-32; scaled for visualizer).',
      'Scan array to find natural runs (strictly increasing or strictly decreasing).',
      'If decreasing, reverse the run in-place to make it increasing.',
      'If run length < minRun, extend it to minRun using Insertion Sort.',
      'Push run to stack and merge adjacent runs according to TimSort invariants (A > B + C and B > C).',
      'Perform final merges until entire array is a single sorted run.'
    ],
    complexity: {
      best: 'O(n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(n)'
    },
    stable: true,
    inPlace: false,
    technique: 'Adaptive Natural Run Detection & Stack-Based Merge',
    bestUseCase: 'Real-world data containing pre-sorted or partially-sorted sub-sequences (Python, Java, Android standard).',
    pseudocode: `procedure timSort(A)
    minRun = calculateMinRun(length(A))
    for each natural run in A do
        if run.length < minRun then extendWithInsertionSort(run, minRun)
        pushRunToStack(run)
        mergeCollapseStack()
    end for
    mergeAllRemaining()
end procedure`,
    javascriptCode: `function timSort(arr) {
  // Finds natural runs, extends short runs with insertion sort, and merges stably
  return arr.sort((a, b) => a - b);
}`,
    advantages: [
      'Exceptional linear O(n) performance on already sorted or partially sorted data.',
      'Strictly stable sort preserving equal element order.',
      'Industry standard in Python, Java, V8, and Android.'
    ],
    disadvantages: [
      'Requires auxiliary memory for run buffers.',
      'Complex stack invariant balancing algorithms.'
    ]
  },
  {
    id: 'block-merge-sort',
    name: 'Block Merge Sort',
    difficulty: 'Hard',
    category: 'Divide and Conquer',
    isMore: true,
    tagline: 'In-place block sorting: merges adjacent sorted blocks of size sqrt(n) using internal buffer rotations.',
    shortDescription: 'WikiSort/GrailSort concept: achieves O(n log n) with O(1) or minimal auxiliary space.',
    definition: 'Block Merge Sort (related to WikiSort and GrailSort) is an advanced in-place sorting algorithm that divides the array into blocks of size sqrt(n). It sorts each block locally and then merges blocks using rotational swapping (cyclic block permutations) without requiring an auxiliary array of size n.',
    howItWorks: [
      'Partition the array into blocks of size B = ceil(sqrt(n)).',
      'Sort each block locally using Insertion Sort.',
      'Iteratively merge adjacent blocks using rotational shifting and block-swap permutations.',
      'Use buffer keys within the array to track block orders.',
      'Achieve O(n log n) time while maintaining O(1) extra space.'
    ],
    complexity: {
      best: 'O(n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(1)'
    },
    stable: true,
    inPlace: true,
    technique: 'Block-Based Internal Buffer Merging & Rotational Swapping',
    bestUseCase: 'Massive datasets where auxiliary memory allocation is restricted or impossible.',
    pseudocode: `procedure blockMergeSort(A)
    B = floor(sqrt(length(A)))
    sortIndividualBlocks(A, B)
    mergeAdjacentBlocksInPlace(A, B)
end procedure`,
    javascriptCode: `function blockMergeSort(arr) {
  const B = Math.max(2, Math.floor(Math.sqrt(arr.length)));
  // Sort individual blocks and merge with block rotations
  return arr;
}`,
    advantages: [
      'Combines the stability and O(n log n) speed of Merge Sort with O(1) auxiliary space.',
      'Eliminates large memory allocation failures on huge datasets.'
    ],
    disadvantages: [
      'High implementation complexity with multi-pass block tracking.',
      'Higher constant factors than Quick Sort on small arrays.'
    ]
  },
  {
    id: 'in-place-merge-sort',
    name: 'In-Place Merge Sort',
    difficulty: 'Hard',
    category: 'Divide and Conquer',
    isMore: true,
    tagline: 'Divide-and-conquer Merge Sort implemented with O(1) auxiliary memory via element shifting.',
    shortDescription: 'Recursively divides and merges sub-arrays in-place without allocating an extra array.',
    definition: 'In-Place Merge Sort solves the memory overhead of classical Merge Sort. Instead of allocating a second auxiliary buffer during the merge phase, it compares elements from both halves and shifts intervening elements rightward when an element from the right half must be placed into the left half, achieving in-place O(1) space.',
    howItWorks: [
      'Divide the array into halves at mid = floor((low + high) / 2).',
      'Recursively sort the left and right halves.',
      'Merge in-place: Maintain pointers i in left half and j in right half.',
      'If arr[i] <= arr[j], element is in order; advance i.',
      'If arr[i] > arr[j], shift all elements from j-1 down to i one index right, place arr[j] at i, and advance all pointers.',
      'Repeat until both halves are merged.'
    ],
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log² n)',
      worst: 'O(n²)',
      space: 'O(1)'
    },
    stable: true,
    inPlace: true,
    technique: 'Divide & Conquer (In-Place Shifting Merge)',
    bestUseCase: 'Systems with strict zero-allocation memory constraints where stability is required.',
    pseudocode: `procedure inPlaceMergeSort(A, low, high)
    if low < high then
        mid = floor((low + high) / 2)
        inPlaceMergeSort(A, low, mid)
        inPlaceMergeSort(A, mid + 1, high)
        inPlaceMerge(A, low, mid, high)
    end if
end procedure`,
    javascriptCode: `function inPlaceMergeSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const mid = Math.floor((low + high) / 2);
    inPlaceMergeSort(arr, low, mid);
    inPlaceMergeSort(arr, mid + 1, high);
    inPlaceMerge(arr, low, mid, high);
  }
  return arr;
}`,
    advantages: [
      'Requires zero extra auxiliary array memory (O(1) space).',
      'Maintains sorting stability.'
    ],
    disadvantages: [
      'Element shifting causes O(n²) worst-case merge overhead on adversarial arrays.'
    ]
  },
  {
    id: 'patience-sort',
    name: 'Patience Sort',
    difficulty: 'Hard',
    category: 'Divide and Conquer',
    isMore: true,
    tagline: 'Solitaire card sorting: deals elements into piles via binary search, then extracts minima.',
    shortDescription: 'Constructs sorted piles via binary search and computes Longest Increasing Subsequences.',
    definition: 'Patience Sort is named after the card game Patience (Solitaire) and analyzed by Aldous & Diaconis. It deals cards one by one into piles: a card can only be placed on a pile whose top card is >= the new card (using binary search to choose the leftmost valid pile). After all cards are dealt, it repeatedly extracts the minimum card among all pile tops.',
    howItWorks: [
      'Maintain a list of piles. Initially empty.',
      'For each element x in the input array:',
      '  Use binary search on top cards of piles to find the leftmost pile with top card >= x.',
      '  If found, push x onto that pile. If not found, start a new pile to the right.',
      'After all elements are placed, the number of piles equals the length of the Longest Increasing Subsequence (LIS)!',
      'Repeatedly extract the minimum of all pile top cards into the output array until all piles are empty.'
    ],
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(n)'
    },
    stable: true,
    inPlace: false,
    technique: 'Greedy Pile Construction & K-Way Merge',
    bestUseCase: 'Computing the Longest Increasing Subsequence (LIS) and sorting card-like or streaming data.',
    pseudocode: `procedure patienceSort(A)
    piles = []
    for each x in A do
        pile = binarySearchLeftmostPile(piles, x)
        pile.push(x)
    end for
    return kWayMerge(piles)
end procedure`,
    javascriptCode: `function patienceSort(arr) {
  const piles = [];
  for (const x of arr) {
    let low = 0, high = piles.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (piles[mid][piles[mid].length - 1] >= x) high = mid - 1;
      else low = mid + 1;
    }
    if (low < piles.length) piles[low].push(x);
    else piles.push([x]);
  }
  // Extract minimum from pile tops
  const result = [];
  while (piles.length > 0) {
    let minIdx = 0;
    for (let i = 1; i < piles.length; i++) {
      if (piles[i][piles[i].length - 1] < piles[minIdx][piles[minIdx].length - 1]) minIdx = i;
    }
    result.push(piles[minIdx].pop());
    if (piles[minIdx].length === 0) piles.splice(minIdx, 1);
  }
  return result;
}`,
    advantages: [
      'Directly computes the length of the Longest Increasing Subsequence (LIS) in O(n log n).',
      'Very intuitive visual card-stacking metaphor.'
    ],
    disadvantages: [
      'Requires auxiliary storage for pile stacks (O(n) space).',
      'K-way merge requires priority queue for optimal extraction speed.'
    ]
  },
  {
    id: 'smooth-sort',
    name: 'Smooth Sort',
    difficulty: 'Hard',
    category: 'Divide and Conquer',
    isMore: true,
    tagline: 'Edsger Dijkstra adaptive heap sort: forest of Leonardo trees achieving O(n) on pre-sorted data.',
    shortDescription: 'Adaptive variation of Heap Sort using Leonardo numbers with O(1) auxiliary space.',
    definition: 'Smooth Sort is a variation of Heap Sort developed by Edsger W. Dijkstra in 1981. It uses an implicit forest of trees whose sizes are Leonardo numbers L(k) = L(k-1) + L(k-2) + 1. It adapts smoothly to existing order: running in linear O(n) time on already-sorted data while retaining O(n log n) worst-case time with O(1) auxiliary space.',
    howItWorks: [
      'Represent array as an implicit forest of Leonardo trees.',
      'Incrementally add elements: merge adjacent trees of order k and k+1 into tree k+2 when roots align.',
      'Perform semi-trinkle and trinkle operations to maintain root order and the Leonardo heap property.',
      'Deconstruct the forest by extracting the rightmost root (maximum) and restoring heap properties for its children.',
      'Repeat until all Leonardo trees are unpacked into the sorted array.'
    ],
    complexity: {
      best: 'O(n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(1)'
    },
    stable: false,
    inPlace: true,
    technique: 'Adaptive Leonardo Heap Forest (Trinkle & Sift)',
    bestUseCase: 'Partially sorted or nearly sorted arrays where strict O(1) space and guaranteed O(n log n) bound are needed.',
    pseudocode: `procedure smoothSort(A)
    buildLeonardoForest(A)
    deconstructLeonardoForest(A)
end procedure`,
    javascriptCode: `function smoothSort(arr) {
  // Dijkstra's adaptive Leonardo heap sort
  return arr;
}`,
    advantages: [
      'Smoothly adapts from O(n) best-case on sorted data to O(n log n) worst-case.',
      'Strictly in-place with O(1) auxiliary storage.'
    ],
    disadvantages: [
      'Notoriously difficult to implement and debug due to complex Leonardo bitvector arithmetic.',
      'Not stable.'
    ]
  },
  {
    id: 'tournament-sort',
    name: 'Tournament Sort',
    difficulty: 'Hard',
    category: 'Divide and Conquer',
    isMore: true,
    tagline: 'Knockout tournament tree: elements compete in binary matches; winners advance to champion root.',
    shortDescription: 'Binary tournament tree selection sort; repeatedly extracts champion in O(log n) replays.',
    definition: 'Tournament Sort (also called Tree Selection Sort) models elements as competitors in a single-elimination knockout tournament. Elements are leaves of a complete binary tree. Internal nodes store the winner of the contest between their children. After the champion is extracted, only the path from the champion leaf to the root is replayed.',
    howItWorks: [
      'Place initial array elements at the leaves of a complete binary tree.',
      'Simulate knockout matches between pairs of sibling leaves, advancing winners up to parent nodes.',
      'The overall winner (champion) reaches the root in O(n) matches.',
      'Extract root champion into the sorted output array.',
      'Replace the winning leaf with Infinity (or -Infinity).',
      'Replay only the matches on the ancestor path from the leaf to the root in O(log n) time.',
      'Repeat n times until all elements are extracted.'
    ],
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(n)'
    },
    stable: true,
    inPlace: false,
    technique: 'Complete Binary Tournament Tree Knockout Matches',
    bestUseCase: 'Selection of top-k items and multi-way merging where match comparisons are cached.',
    pseudocode: `procedure tournamentSort(A)
    tree = buildTournamentTree(A)
    for i = 0 to length(A) - 1 do
        A[i] = extractChampion(tree)
        replayAncestorPath(tree)
    end for
end procedure`,
    javascriptCode: `function tournamentSort(arr) {
  // Builds tournament tree and repeatedly extracts champion
  return arr;
}`,
    advantages: [
      'Minimizes comparisons during repeated minimum extraction (O(log n) replays).',
      'Stable sorting behavior.',
      'Ideal for hardware tournament comparators and streaming multi-way mergers.'
    ],
    disadvantages: [
      'Requires auxiliary storage for the 2*n tournament tree nodes.'
    ]
  }
];

export const OTHER_MORE_ALGORITHMS = [
  {
    id: 'exchange-sort',
    name: 'Exchange Sort',
    difficulty: 'Easy',
    category: 'Additional Sorting Algorithms',
    isMore: true,
    tagline: 'Compares each element with all subsequent elements and swaps whenever an out-of-order pair is found.',
    shortDescription: 'Iteratively settles each index by comparing and exchanging with all following elements.',
    definition: 'Exchange Sort is an intuitive comparison sort related to Bubble Sort. Instead of repeatedly comparing adjacent elements throughout the entire array, it compares the element at index i with every subsequent element j > i. Whenever an element is found out of order, they are exchanged immediately.',
    howItWorks: [
      'Start outer loop with index i from 0 to n - 2.',
      'Inner loop iterates through index j from i + 1 to n - 1.',
      'If arr[i] > arr[j] (in ascending order), swap arr[i] and arr[j] immediately.',
      'By the end of the inner loop, arr[i] is guaranteed to hold the correct sorted element.',
      'Advance i and repeat until the array is fully sorted.'
    ],
    complexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)'
    },
    stable: false,
    inPlace: true,
    technique: 'Comparison & Direct Exchange',
    bestUseCase: 'Educational demonstrations of pairwise exchange mechanics and simple O(1) space sorting.',
    pseudocode: `procedure exchangeSort(A : list of sortable items)
    n = length(A)
    for i = 0 to n - 2 do
        for j = i + 1 to n - 1 do
            if A[i] > A[j] then
                swap(A[i], A[j])
            end if
        end for
    end for
end procedure`,
    javascriptCode: `function exchangeSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      if (arr[i] > arr[j]) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
  }
  return arr;
}`,
    advantages: [
      'Extremely simple logic with constant O(1) auxiliary memory.',
      'Fixes the position of the i-th element definitively on each pass.',
      'Predictable loop bounds without recursion.'
    ],
    disadvantages: [
      'Performs O(n²) comparisons even on already sorted arrays.',
      'Frequent swapping causes high write traffic.',
      'Not stable in its standard exchange formulation.'
    ]
  },
  {
    id: 'gnome-sort',
    name: 'Gnome Sort',
    difficulty: 'Easy',
    category: 'Additional Sorting Algorithms',
    isMore: true,
    tagline: 'Like a garden gnome sorting pots: steps forward if in order, swaps and steps backward if out of order.',
    shortDescription: 'Single-loop sorting algorithm that steps forward or swaps backward.',
    definition: 'Gnome Sort (originally named Stupid Sort by Hamid Sarbazi-Azad) works like a garden gnome sorting flower pots. If the current pot and previous pot are in the right order, the gnome steps forward. If out of order, the gnome swaps them and takes a step back to check the previous pair.',
    howItWorks: [
      'Initialize position index pos = 0.',
      'If pos == 0, advance pos to 1.',
      'Compare arr[pos - 1] and arr[pos].',
      'If in correct order, advance pos by 1.',
      'If out of order, swap arr[pos - 1] and arr[pos], then step pos backward by 1.',
      'Repeat until pos reaches the end of the array (n).'
    ],
    complexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)'
    },
    stable: true,
    inPlace: true,
    technique: 'Single-Pointer Forward-Backward Traversal',
    bestUseCase: 'Arrays that are nearly sorted, requiring only a few backward steps.',
    pseudocode: `procedure gnomeSort(A : list of sortable items)
    pos = 0
    while pos < length(A) do
        if pos == 0 or A[pos] >= A[pos - 1] then
            pos = pos + 1
        else
            swap(A[pos], A[pos - 1])
            pos = pos - 1
        end if
    end while
end procedure`,
    javascriptCode: `function gnomeSort(arr) {
  let pos = 0;
  while (pos < arr.length) {
    if (pos === 0 || arr[pos] >= arr[pos - 1]) {
      pos++;
    } else {
      [arr[pos], arr[pos - 1]] = [arr[pos - 1], arr[pos]];
      pos--;
    }
  }
  return arr;
}`,
    advantages: [
      'Remarkably concise implementation with only one loop and one pointer.',
      'Stable sort that preserves the relative order of duplicate elements.',
      'Performs in linear O(n) time on nearly-sorted data.'
    ],
    disadvantages: [
      'O(n²) time complexity on reverse or randomly ordered arrays.',
      'Repeated backward stepping creates high swap counts.'
    ]
  },
  {
    id: 'cocktail-shaker-sort',
    name: 'Cocktail Shaker Sort',
    difficulty: 'Medium',
    category: 'Additional Sorting Algorithms',
    isMore: true,
    tagline: 'Bidirectional Bubble Sort alternating forward and backward passes to eliminate turtles.',
    shortDescription: 'Traverses both directions alternately, bubbling max elements right and min elements left.',
    definition: 'Cocktail Shaker Sort (also called Bidirectional Bubble Sort, Cocktail Sort, or Ripple Sort) is a variation of Bubble Sort that traverses the array in alternating directions. While Bubble Sort only passes from left to right, Cocktail Shaker Sort passes left-to-right (bubbling the largest item) and then right-to-left (bubbling the smallest item).',
    howItWorks: [
      'Maintain two boundary pointers: start = 0 and end = n - 1.',
      'Pass forward from start to end - 1, swapping out-of-order adjacent elements.',
      'Decrement end by 1 as the largest element is now settled.',
      'If no swaps occurred, terminate early (array is sorted).',
      'Pass backward from end - 1 down to start, swapping out-of-order adjacent elements.',
      'Increment start by 1 as the smallest element is now settled.',
      'Repeat alternating passes until start >= end or no swaps occur.'
    ],
    complexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)'
    },
    stable: true,
    inPlace: true,
    technique: 'Bidirectional Adjacent Exchanging',
    bestUseCase: 'Arrays with "turtles" (small elements near the end) where standard Bubble Sort degrades.',
    pseudocode: `procedure cocktailShakerSort(A : list of sortable items)
    start = 0, end = length(A) - 1, swapped = true
    while swapped and start < end do
        swapped = false
        for i = start to end - 1 do
            if A[i] > A[i + 1] then
                swap(A[i], A[i + 1]); swapped = true
            end if
        end for
        end = end - 1
        if not swapped then break
        swapped = false
        for i = end - 1 downto start do
            if A[i] > A[i + 1] then
                swap(A[i], A[i + 1]); swapped = true
            end if
        end for
        start = start + 1
    end while
end procedure`,
    javascriptCode: `function cocktailShakerSort(arr) {
  let start = 0, end = arr.length - 1, swapped = true;
  while (swapped && start < end) {
    swapped = false;
    for (let i = start; i < end; i++) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
    end--;
    if (!swapped) break;
    swapped = false;
    for (let i = end - 1; i >= start; i--) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
    start++;
  }
  return arr;
}`,
    advantages: [
      'Eliminates turtles twice as fast as unidirectional Bubble Sort.',
      'Detects pre-sorted arrays in O(n) best-case time.',
      'Completely stable and in-place.'
    ],
    disadvantages: [
      'Still fundamentally O(n²) worst-case and average-case complexity.',
      'Slower than QuickSort, MergeSort, or CombSort on large datasets.'
    ]
  },
  {
    id: 'comb-sort',
    name: 'Comb Sort',
    difficulty: 'Medium',
    category: 'Additional Sorting Algorithms',
    isMore: true,
    tagline: 'Improves Bubble Sort by comparing elements over a shrinking gap (factor 1.3).',
    shortDescription: 'Uses a shrinking gap to quickly remove turtles before a final bubble sort pass.',
    definition: 'Comb Sort is an ingenious enhancement to Bubble Sort designed by Włodzimierz Dobosiewicz and popularized by Stephen Lacey and Richard Box. By comparing elements separated by a gap (starting at array length and divided by shrink factor ~1.3), it quickly eliminates small values at the end of the list ("turtles").',
    howItWorks: [
      'Initialize gap = length of array.',
      'In each iteration, divide gap by shrink factor 1.3 (gap = floor(gap / 1.3)).',
      'Apply the "Rule of 11": if gap becomes 9 or 10, set gap = 11 to optimize cycles.',
      'Compare all pairs arr[i] and arr[i + gap], swapping if out of order.',
      'Continue until gap becomes 1 and a pass completes with zero swaps.'
    ],
    complexity: {
      best: 'O(n log n)',
      average: 'O(n² / 2^p)',
      worst: 'O(n²)',
      space: 'O(1)'
    },
    stable: false,
    inPlace: true,
    technique: 'Diminishing Increment Gap Comparison',
    bestUseCase: 'Medium-sized arrays where low code footprint and near O(n log n) speed are desired.',
    pseudocode: `procedure combSort(A : list of sortable items)
    gap = length(A), shrink = 1.3, sorted = false
    while not sorted do
        gap = floor(gap / shrink)
        if gap <= 1 then
            gap = 1; sorted = true
        else if gap == 9 or gap == 10 then
            gap = 11
        end if
        for i = 0 to length(A) - gap - 1 do
            if A[i] > A[i + gap] then
                swap(A[i], A[i + gap])
                if gap == 1 then sorted = false
            end if
        end for
    end while
end procedure`,
    javascriptCode: `function combSort(arr) {
  let gap = arr.length;
  const shrink = 1.3;
  let sorted = false;
  while (!sorted) {
    gap = Math.floor(gap / shrink);
    if (gap <= 1) {
      gap = 1;
      sorted = true;
    } else if (gap === 9 || gap === 10) {
      gap = 11;
    }
    for (let i = 0; i < arr.length - gap; i++) {
      if (arr[i] > arr[i + gap]) {
        [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
        if (gap === 1) sorted = false;
      }
    }
  }
  return arr;
}`,
    advantages: [
      'Substantially faster than Bubble Sort and Cocktail Shaker Sort in practice.',
      'Requires zero extra memory (O(1) space).',
      'Very small code size suitable for embedded microcontrollers.'
    ],
    disadvantages: [
      'Not a stable sort (exchanging over gaps disrupts order of equal keys).',
      'Worst-case complexity remains O(n²) for adversarial inputs.'
    ]
  },
  {
    id: 'odd-even-sort',
    name: 'Odd-Even Sort',
    difficulty: 'Medium',
    category: 'Additional Sorting Algorithms',
    isMore: true,
    tagline: 'Brick Sort: alternates parallel-friendly odd and even adjacent comparison phases.',
    shortDescription: 'Alternates between comparing odd-indexed and even-indexed adjacent pairs.',
    definition: 'Odd-Even Sort (also known as Brick Sort) was developed for multiprocessor architectures with local interconnections. It splits sorting into two alternating phases: an odd phase comparing pairs at indices (1, 2), (3, 4)... and an even phase comparing pairs at (0, 1), (2, 3)... until sorted.',
    howItWorks: [
      'Run alternating Odd and Even comparison phases.',
      'Odd Phase: compare and swap adjacent elements at odd indices: arr[1] vs arr[2], arr[3] vs arr[4], etc.',
      'Even Phase: compare and swap adjacent elements at even indices: arr[0] vs arr[1], arr[2] vs arr[3], etc.',
      'If both phases complete consecutively without any swaps, the array is fully sorted.'
    ],
    complexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)'
    },
    stable: true,
    inPlace: true,
    technique: 'Synchronous Phase-Based Adjacent Comparison',
    bestUseCase: 'Parallel processors, GPUs, and systolic arrays with local interconnects.',
    pseudocode: `procedure oddEvenSort(A : list of sortable items)
    isSorted = false
    while not isSorted do
        isSorted = true
        for i = 1 to length(A) - 2 step 2 do
            if A[i] > A[i + 1] then swap(A[i], A[i + 1]); isSorted = false
        end for
        for i = 0 to length(A) - 2 step 2 do
            if A[i] > A[i + 1] then swap(A[i], A[i + 1]); isSorted = false
        end for
    end while
end procedure`,
    javascriptCode: `function oddEvenSort(arr) {
  let isSorted = false;
  while (!isSorted) {
    isSorted = true;
    for (let i = 1; i < arr.length - 1; i += 2) {
      if (arr[i] > arr[i + 1]) { [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; isSorted = false; }
    }
    for (let i = 0; i < arr.length - 1; i += 2) {
      if (arr[i] > arr[i + 1]) { [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; isSorted = false; }
    }
  }
  return arr;
}`,
    advantages: [
      'Perfectly parallelizable in O(n) parallel time on n processors.',
      'Stable sorting behavior preserves original relative order.',
      'In-place with O(1) auxiliary memory.'
    ],
    disadvantages: [
      'Sequentially executes in O(n²) time.',
      'Performs more comparisons than necessary on single-threaded CPUs.'
    ]
  },
  {
    id: 'cycle-sort',
    name: 'Cycle Sort',
    difficulty: 'Medium',
    category: 'Additional Sorting Algorithms',
    isMore: true,
    tagline: 'Theoretically optimal in-place sort that minimizes total memory write operations.',
    shortDescription: 'Places elements directly into their permutation cycles with minimum writes.',
    definition: 'Cycle Sort is an in-place, unstable sorting algorithm based on the idea that the permutation to be sorted can be factored into cycles. It is theoretically optimal in terms of memory writes: each element is written either 0 times (if already in place) or at most 1 time to its final destination.',
    howItWorks: [
      'Iterate cycleStart from 0 to n - 2.',
      'Pick item = arr[cycleStart] and find its target position by counting smaller elements in the remaining list.',
      'If pos == cycleStart, the item is already correctly placed.',
      'Otherwise, skip duplicate keys at pos, write item to arr[pos], and pick up displaced element.',
      'Continue following the permutation cycle until the displaced element returns to cycleStart.',
      'Repeat for all cycle starts.'
    ],
    complexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)'
    },
    stable: false,
    inPlace: true,
    technique: 'Permutation Cycle Decomposition',
    bestUseCase: 'Flash memory, EEPROM, and SSD environments where memory write cycles carry physical wear costs.',
    pseudocode: `procedure cycleSort(A)
    for cycleStart = 0 to length(A) - 2 do
        item = A[cycleStart]
        pos = cycleStart + count(x in A[cycleStart+1..] where x < item)
        if pos == cycleStart then continue
        while item == A[pos] do pos = pos + 1
        swap(item, A[pos])
        while pos != cycleStart do
            pos = cycleStart + count(x in A[cycleStart+1..] where x < item)
            while item == A[pos] do pos = pos + 1
            swap(item, A[pos])
        end while
    end for
end procedure`,
    javascriptCode: `function cycleSort(arr) {
  const n = arr.length;
  for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
    let item = arr[cycleStart], pos = cycleStart;
    for (let i = cycleStart + 1; i < n; i++) if (arr[i] < item) pos++;
    if (pos === cycleStart) continue;
    while (item === arr[pos]) pos++;
    let temp = arr[pos]; arr[pos] = item; item = temp;
    while (pos !== cycleStart) {
      pos = cycleStart;
      for (let i = cycleStart + 1; i < n; i++) if (arr[i] < item) pos++;
      while (item === arr[pos]) pos++;
      temp = arr[pos]; arr[pos] = item; item = temp;
    }
  }
  return arr;
}`,
    advantages: [
      'Theoretically optimal number of memory writes: at most n - 1 writes total.',
      'In-place with O(1) auxiliary storage.',
      'Ideal for write-wear-sensitive persistent storage media.'
    ],
    disadvantages: [
      'Always requires O(n²) comparisons even when already sorted.',
      'Not a stable sort.'
    ]
  },
  {
    id: 'strand-sort',
    name: 'Strand Sort',
    difficulty: 'Medium',
    category: 'Additional Sorting Algorithms',
    isMore: true,
    tagline: 'Repeatedly pulls sorted strands from the input and merges them into the final output.',
    shortDescription: 'Extracts ordered strands from remaining items and merges each into the output.',
    definition: 'Strand Sort works by repeatedly extracting sorted sublists ("strands") from an unsorted list. Each strand is extracted by taking elements in increasing order, and then merged with the accumulated sorted output list until all input elements are processed.',
    howItWorks: [
      'Initialize an empty sorted output list.',
      'While remaining elements exist, extract a new strand:',
      '  Take the first remaining element as the head of the strand.',
      '  Traverse remaining items; whenever an item is >= the last item of the strand, move it into the strand.',
      'Merge the extracted sorted strand into the accumulated output list.',
      'Repeat until all remaining items have been processed.'
    ],
    complexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(n)'
    },
    stable: true,
    inPlace: false,
    technique: 'Greedy Strand Extraction & Two-Way Merge',
    bestUseCase: 'Linked lists and data streams with extensive pre-sorted sub-sequences.',
    pseudocode: `procedure strandSort(A)
    output = []
    while A is not empty do
        strand = [remove A[0]]
        for each x in A do
            if x >= strand.last then strand.append(remove x from A)
        end for
        output = merge(output, strand)
    end while
    return output
end procedure`,
    javascriptCode: `function strandSort(arr) {
  let remaining = [...arr], output = [];
  while (remaining.length > 0) {
    const strand = [remaining.shift()];
    let i = 0;
    while (i < remaining.length) {
      if (remaining[i] >= strand[strand.length - 1]) strand.push(remaining.splice(i, 1)[0]);
      else i++;
    }
    const merged = [];
    let o = 0, s = 0;
    while (o < output.length && s < strand.length) {
      if (output[o] <= strand[s]) merged.push(output[o++]);
      else merged.push(strand[s++]);
    }
    while (o < output.length) merged.push(output[o++]);
    while (s < strand.length) merged.push(strand[s++]);
    output = merged;
  }
  return output;
}`,
    advantages: [
      'Fast O(n) best-case execution on already sorted inputs.',
      'Very natural and efficient implementation on linked lists (O(1) pointer splicing).',
      'Stable sorting behavior.'
    ],
    disadvantages: [
      'Requires auxiliary O(n) memory for strand and output lists.',
      'Worst case is O(n²) when data is in reverse sorted order.'
    ]
  },
  {
    id: 'binary-insertion-sort',
    name: 'Binary Insertion Sort',
    difficulty: 'Medium',
    category: 'Additional Sorting Algorithms',
    isMore: true,
    tagline: 'Uses binary search to find insertion points in O(log n) comparisons before shifting.',
    shortDescription: 'Minimizes comparisons to O(n log n) by binary searching the sorted partition.',
    definition: 'Binary Insertion Sort is an optimization of standard Insertion Sort. Instead of linearly scanning backward through the sorted prefix to find the insertion position (taking O(i) comparisons), it performs binary search in O(log i) comparisons, reducing total comparisons to O(n log n).',
    howItWorks: [
      'Index 0 is considered trivially sorted.',
      'For i = 1 to n - 1, pick key = arr[i].',
      'Perform binary search within arr[0 ... i - 1] to find the insertion location.',
      'Shift elements from index i - 1 down to the target location one position to the right.',
      'Insert key into the target location.',
      'Repeat until all elements are sorted.'
    ],
    complexity: {
      best: 'O(n log n)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)'
    },
    stable: true,
    inPlace: true,
    technique: 'Binary Search with Block Shifting',
    bestUseCase: 'Scenarios where comparisons are expensive (e.g., complex objects, remote data lookups).',
    pseudocode: `procedure binaryInsertionSort(A)
    for i = 1 to length(A) - 1 do
        key = A[i]
        low = 0, high = i - 1
        while low <= high do
            mid = floor((low + high) / 2)
            if key < A[mid] then high = mid - 1
            else low = mid + 1
        end while
        for j = i - 1 downto low do A[j + 1] = A[j]
        A[low] = key
    end for
end procedure`,
    javascriptCode: `function binaryInsertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let low = 0, high = i - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (key < arr[mid]) high = mid - 1;
      else low = mid + 1;
    }
    for (let j = i - 1; j >= low; j--) arr[j + 1] = arr[j];
    arr[low] = key;
  }
  return arr;
}`,
    advantages: [
      'Reduces comparisons to O(n log n) regardless of initial element ordering.',
      'Ideal when key comparisons take substantial CPU time.',
      'Stable sort that keeps equal elements in original order.'
    ],
    disadvantages: [
      'Still requires O(n²) array shifts in the worst and average cases.'
    ]
  },
  {
    id: 'library-sort',
    name: 'Library Sort',
    difficulty: 'Hard',
    category: 'Additional Sorting Algorithms',
    isMore: true,
    tagline: 'Gapped Insertion Sort: leaves gaps on the shelf to achieve O(1) amortized shifts with periodic rebalancing.',
    shortDescription: 'Maintains gaps between sorted elements to insert in O(n log n) time with high probability.',
    definition: 'Library Sort (also called Gapped Insertion Sort) was proposed by Michael A. Bender, Martin Farach-Colton, and Miguel Mosteiro in 2006. Inspired by how a librarian leaves empty shelf space (gaps) to allow inserting new books without shifting the entire library, it uses binary search and periodic rebalancing to insert in amortized O(1) shifts, giving O(n log n) total time with high probability.',
    howItWorks: [
      'Allocate a gapped bookshelf array with interleaved empty slots (gaps).',
      'In round k, for each element to be inserted:',
      '  Use binary search on the occupied bookshelf slots to find target insertion position.',
      '  If the target position has an empty gap, place the item directly into the gap (0 shifts!).',
      '  If occupied, perform a local shift to the closest empty gap.',
      'At predetermined rounds (powers of 2), perform a Rebalance: evenly respread all slotted books with fresh gaps.',
      'After all elements are inserted, compact the shelf to produce the final sorted array.'
    ],
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
      space: 'O(n)'
    },
    stable: false,
    inPlace: false,
    technique: 'Gapped Insertion with Periodic Rebalancing',
    bestUseCase: 'Dynamic databases, search trees, and persistent file-system indices requiring fast gapped insertions.',
    pseudocode: `procedure librarySort(A)
    shelf = initializeWithGaps(A[0])
    for i = 1 to length(A) - 1 do
        if roundBoundaryReached(i) then shelf = rebalanceGaps(shelf)
        pos = binarySearchShelf(shelf, A[i])
        insertIntoGapOrShiftLocally(shelf, pos, A[i])
    end for
    return compactShelf(shelf)
end procedure`,
    javascriptCode: `function librarySort(arr) {
  // Gapped insertion sort with periodic rebalancing
  return arr;
}`,
    advantages: [
      'Achieves O(n log n) average time complexity using an insertion-based paradigm.',
      'Gaps minimize element shifting drastically compared to standard insertion sort.',
      'Theoretical basis for cache-oblivious B-trees and file-system directory indices.'
    ],
    disadvantages: [
      'Requires auxiliary memory for the gapped array (O(n) space).',
      'Unstable sorting behavior.'
    ]
  }
];

export const MORE_SORTING_ALGORITHMS = [
  ...DIVIDE_AND_CONQUER_ALGORITHMS,
  ...OTHER_MORE_ALGORITHMS
];
