export const ALGORITHMS = [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'Beginner',
    tagline: 'Repeatedly steps through the list, comparing adjacent elements and swapping them if they are in the wrong order.',
    shortDescription: 'Simple comparison-based algorithm that bubbles largest elements to the end.',
    definition: 'Bubble Sort is one of the simplest sorting algorithms. It repeatedly iterates over the array, compares adjacent elements, and swaps them if the left element is larger than the right element. After each pass, the largest unsorted element "bubbles" up to its correct position at the end.',
    howItWorks: [
      'Start at the beginning of the array (index 0).',
      'Compare element at index j with adjacent element at index j + 1.',
      'If arr[j] > arr[j + 1], swap them.',
      'Move to the next pair of elements and repeat.',
      'After pass 1, the largest item is guaranteed to be at the final index (n - 1).',
      'Repeat for n - 1 passes or until no swaps are performed in a pass.'
    ],
    complexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)'
    },
    stable: true,
    inPlace: true,
    technique: 'Comparison & Exchanging',
    bestUseCase: 'Educational purposes, small datasets, or arrays that are already nearly sorted.',
    pseudocode: `procedure bubbleSort(A : list of sortable items)
    n = length(A)
    repeat
        swapped = false
        for i = 1 to n-1 inclusive do
            if A[i-1] > A[i] then
                swap(A[i-1], A[i])
                swapped = true
            end if
        end for
        n = n - 1
    until not swapped
end procedure`,
    javascriptCode: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // Optimization: stop if already sorted
  }
  return arr;
}`,
    advantages: [
      'Very simple to understand and implement.',
      'Requires no additional memory (O(1) space complexity).',
      'Detects if the array is already sorted in O(n) best-case time.',
      'Stable sorting algorithm (preserves original order of equal elements).'
    ],
    disadvantages: [
      'Inefficient O(n²) average and worst-case time complexity.',
      'Performs a high number of element swaps compared to Selection or Insertion sort.',
      'Impractical for large datasets.'
    ]
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'Beginner',
    tagline: 'Divides the array into a sorted and unsorted region, repeatedly picking the minimum unsorted element.',
    shortDescription: 'In-place comparison sort that repeatedly selects the smallest unsorted element.',
    definition: 'Selection Sort works by repeatedly finding the minimum element from the unsorted section of the array and swapping it with the first element of that unsorted section, gradually expanding the sorted portion.',
    howItWorks: [
      'Initialize boundary of sorted array at index 0.',
      'Search through the unsorted array to find the minimum element.',
      'Swap the minimum element found with the first element of the unsorted section.',
      'Advance the boundary of the sorted array rightwards by 1.',
      'Repeat until all elements are in the sorted region.'
    ],
    complexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)'
    },
    stable: false,
    inPlace: true,
    technique: 'Selection & Placement',
    bestUseCase: 'Small arrays where memory writes are expensive (minimizes number of swaps to at most n - 1).',
    pseudocode: `procedure selectionSort(A : list of sortable items)
    n = length(A)
    for i = 0 to n - 2 do
        minIdx = i
        for j = i + 1 to n - 1 do
            if A[j] < A[minIdx] then
                minIdx = j
            end if
        end for
        if minIdx != i then
            swap(A[i], A[minIdx])
        end if
    end for
end procedure`,
    javascriptCode: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`,
    advantages: [
      'Simple to implement and memory efficient (O(1) extra space).',
      'Minimizes array writes: performs at most O(n) swaps.',
      'Performs predictably regardless of initial array ordering.'
    ],
    disadvantages: [
      'Quadratic O(n²) time complexity for all cases (best, average, worst).',
      'Does not adapt to pre-sorted input.',
      'Unstable algorithm by default.'
    ]
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'Beginner',
    tagline: 'Builds the final sorted array one item at a time by shifting elements to insert the current item.',
    shortDescription: 'Efficient for small datasets and nearly sorted arrays.',
    definition: 'Insertion Sort iterates through an input array and consumes one element per iteration. It finds the location where the element belongs within the sorted subarray to its left and inserts it there, shifting larger elements right.',
    howItWorks: [
      'Assume the first element (index 0) is already sorted.',
      'Pick the next unsorted element (the key).',
      'Compare the key with elements in the sorted subarray from right to left.',
      'Shift elements larger than key one position to the right.',
      'Insert the key into its correct empty position.',
      'Repeat for all elements.'
    ],
    complexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)'
    },
    stable: true,
    inPlace: true,
    technique: 'Incremental Insertion',
    bestUseCase: 'Small datasets (n < 50), online data streaming, or nearly sorted arrays.',
    pseudocode: `procedure insertionSort(A : list of sortable items)
    for i = 1 to length(A) - 1 do
        key = A[i]
        j = i - 1
        while j >= 0 and A[j] > key do
            A[j + 1] = A[j]
            j = j - 1
        end while
        A[j + 1] = key
    end for
end procedure`,
    javascriptCode: `function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
    advantages: [
      'Highly efficient for small or almost-sorted datasets (runs in O(n) best-case).',
      'In-place (O(1) memory) and stable.',
      'Adaptive: speed scales with how sorted the input array already is.',
      'Low constant factor overhead.'
    ],
    disadvantages: [
      'Quadratic O(n²) performance on reverse-sorted or large random arrays.',
      'High number of array element shifts.'
    ]
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'Intermediate',
    tagline: 'Divide-and-conquer algorithm that recursively splits the array in half, sorts each half, and merges them.',
    shortDescription: 'Guaranteed O(n log n) stable sorting using divide-and-conquer strategy.',
    definition: 'Merge Sort is a classic divide-and-conquer algorithm. It divides the unsorted array into two halves, recursively sorts each half, and then merges the two sorted halves back into a single unified sorted array.',
    howItWorks: [
      'Divide: Calculate mid index and recursively split array into left [start..mid] and right [mid+1..end].',
      'Base Case: When subarray length is 1 or 0, it is trivially sorted.',
      'Conquer: Recursively sort left and right subarrays.',
      'Combine (Merge): Compare elements from both sorted halves and insert the smaller element into the main array until all elements are merged.'
    ],
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(n)'
    },
    stable: true,
    inPlace: false,
    technique: 'Divide and Conquer',
    bestUseCase: 'Linked lists, external sorting of massive datasets, or when guaranteed O(n log n) stable performance is needed.',
    pseudocode: `procedure mergeSort(A : list of items)
    if length(A) <= 1 return A
    mid = length(A) / 2
    left = mergeSort(A[0..mid-1])
    right = mergeSort(A[mid..end])
    return merge(left, right)
end procedure`,
    javascriptCode: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
    advantages: [
      'Guaranteed O(n log n) time complexity in all cases (worst, average, best).',
      'Stable sorting algorithm.',
      'Excellent for sorting linked lists and large data files that do not fit in RAM.'
    ],
    disadvantages: [
      'Requires O(n) auxiliary memory space for temporary array allocation.',
      'Slower than Quick Sort on average for in-memory arrays due to copy overhead.'
    ]
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'Intermediate',
    tagline: 'Partitions the array around a pivot element so smaller elements go left and larger elements go right.',
    shortDescription: 'Fast, widely-used in-place divide-and-conquer algorithm.',
    definition: 'Quick Sort is an efficient divide-and-conquer sorting algorithm. It selects a "pivot" element from the array and partitions the other elements into two sub-arrays according to whether they are less than or greater than the pivot. The sub-arrays are then sorted recursively.',
    howItWorks: [
      'Pick a pivot element (e.g., last element, median-of-three, or random element).',
      'Partitioning: Rearrange array so elements smaller than pivot move left, elements greater move right.',
      'Place pivot in its correct final sorted position index.',
      'Recursively apply Quick Sort to the left partition and right partition.'
    ],
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
      space: 'O(log n)'
    },
    stable: false,
    inPlace: true,
    technique: 'Divide & Conquer (Partitioning)',
    bestUseCase: 'General-purpose in-memory sorting where cache performance and speed are paramount.',
    pseudocode: `procedure quickSort(A, low, high)
    if low < high then
        p = partition(A, low, high)
        quickSort(A, low, p - 1)
        quickSort(A, p + 1, high)
    end if
end procedure`,
    javascriptCode: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pIdx = partition(arr, low, high);
    quickSort(arr, low, pIdx - 1);
    quickSort(arr, pIdx + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
    advantages: [
      'Extremely fast in practice with low hidden constants and great cache locality.',
      'In-place algorithm requiring only O(log n) call stack space.',
      'Widely used in standard language runtimes.'
    ],
    disadvantages: [
      'Worst-case time complexity is O(n²) if pivot choices are poor (e.g., already sorted array with last element as pivot).',
      'Unstable algorithm.',
      'Performance sensitive to pivot selection strategy.'
    ]
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    category: 'Intermediate',
    tagline: 'Converts the array into a binary max-heap data structure and iteratively extracts the maximum root.',
    shortDescription: 'In-place sorting using a binary tree max-heap structure.',
    definition: 'Heap Sort leverages a Binary Heap data structure. It first organizes the array into a Max Heap (where parent nodes are greater than child nodes). It then repeatedly swaps the max root element with the last item of the heap, reduces heap size by 1, and heapifies the root.',
    howItWorks: [
      'Build a Max Heap from the input array in-place.',
      'The largest element is now at the root (index 0).',
      'Swap root (index 0) with the last item in the unsorted heap.',
      'Decrease heap size by 1 (marking the swapped element as sorted).',
      'Heapify down from root index 0 to restore Max Heap property.',
      'Repeat until heap size becomes 1.'
    ],
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(1)'
    },
    stable: false,
    inPlace: true,
    technique: 'Selection & Tree Structure (Heap)',
    bestUseCase: 'Systems requiring strict memory boundaries (O(1) space) and guaranteed worst-case O(n log n) execution time.',
    pseudocode: `procedure heapSort(A)
    buildMaxHeap(A)
    for i = length(A)-1 down to 1 do
        swap(A[0], A[i])
        heapify(A, i, 0)
    end for
end procedure`,
    javascriptCode: `function heapSort(arr) {
  const n = arr.length;
  // Build Max Heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}

function heapify(arr, size, rootIdx) {
  let largest = rootIdx;
  const left = 2 * rootIdx + 1;
  const right = 2 * rootIdx + 2;

  if (left < size && arr[left] > arr[largest]) largest = left;
  if (right < size && arr[right] > arr[largest]) largest = right;

  if (largest !== rootIdx) {
    [arr[rootIdx], arr[largest]] = [arr[largest], arr[rootIdx]];
    heapify(arr, size, largest);
  }
}`,
    advantages: [
      'Guaranteed O(n log n) performance for all cases.',
      'In-place algorithm requiring O(1) extra space.',
      'Does not suffer from quadratic worst-case degradation like Quick Sort.'
    ],
    disadvantages: [
      'Slower than Quick Sort in practice due to poor CPU cache locality (jumping across array tree nodes).',
      'Unstable sorting algorithm.'
    ]
  },
  {
    id: 'counting-sort',
    name: 'Counting Sort',
    category: 'Advanced',
    tagline: 'Non-comparison sorting algorithm that counts frequency of each distinct key.',
    shortDescription: 'Linear-time O(n + k) sorting for discrete integer ranges.',
    definition: 'Counting Sort is a non-comparison integer sorting algorithm. It counts the number of objects having distinct key values, calculates cumulative totals, and places each object directly into its correct index in the output array.',
    howItWorks: [
      'Find the maximum and minimum key values in the array to determine range k.',
      'Initialize a count array of size k with all zeros.',
      'Iterate through original array and increment count[arr[i]].',
      'Transform count array into cumulative frequencies.',
      'Iterate backwards through original array and place elements into output array according to cumulative position.'
    ],
    complexity: {
      best: 'O(n + k)',
      average: 'O(n + k)',
      worst: 'O(n + k)',
      space: 'O(n + k)'
    },
    stable: true,
    inPlace: false,
    technique: 'Non-Comparison (Histogram Counting)',
    bestUseCase: 'Sorting small integer ranges (e.g., ages, exam scores 0-100, or sub-routine in Radix sort).',
    pseudocode: `procedure countingSort(A, k)
    create count array C of size k initialized to 0
    for each x in A do
        C[x] = C[x] + 1
    for i = 1 to k-1 do
        C[i] = C[i] + C[i-1]
    create output array B of size length(A)
    for i = length(A)-1 down to 0 do
        B[C[A[i]] - 1] = A[i]
        C[A[i]] = C[A[i]] - 1
    return B
end procedure`,
    javascriptCode: `function countingSort(arr) {
  if (arr.length <= 1) return arr;
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;
  
  const count = new Array(range).fill(0);
  const output = new Array(arr.length);
  
  for (let i = 0; i < arr.length; i++) {
    count[arr[i] - min]++;
  }
  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
  }
  for (let i = arr.length - 1; i >= 0; i--) {
    const val = arr[i];
    output[count[val - min] - 1] = val;
    count[val - min]--;
  }
  return output;
}`,
    advantages: [
      'Achieves linear O(n + k) time, beating the O(n log n) comparison bound.',
      'Stable sorting algorithm.'
    ],
    disadvantages: [
      'Inapplicable if range k is extremely large (e.g. k = 10^9 takes 1GB count array).',
      'Restricted to discrete keys (integers, characters, strings).'
    ]
  },
  {
    id: 'radix-sort',
    name: 'Radix Sort',
    category: 'Advanced',
    tagline: 'Sorts keys digit by digit starting from the least significant digit to most significant digit.',
    shortDescription: 'Non-comparison sort that processes digits position by position.',
    definition: 'Radix Sort processes digits sequentially from LSD (Least Significant Digit) to MSD (Most Significant Digit) using a stable sub-sorting algorithm (typically Counting Sort) for each digit place.',
    howItWorks: [
      'Find the maximum number to know the max number of digits d.',
      'Set digit place exp = 1 (1s place).',
      'Sort array using Counting Sort based on the digit at position exp.',
      'Multiply exp by 10 (10s, 100s, 1000s place).',
      'Repeat until all digit places up to d are processed.'
    ],
    complexity: {
      best: 'O(d · (n + b))',
      average: 'O(d · (n + b))',
      worst: 'O(d · (n + b))',
      space: 'O(n + b)'
    },
    stable: true,
    inPlace: false,
    technique: 'Non-Comparison (Positional Digit Bucket)',
    bestUseCase: 'Fixed-width numbers, floating-point representations, or strings (e.g. phone numbers, zip codes).',
    pseudocode: `procedure radixSort(A)
    maxVal = getMax(A)
    for exp = 1; maxVal / exp > 0; exp = exp * 10 do
        countingSortByDigit(A, exp)
    end for
end procedure`,
    javascriptCode: `function radixSort(arr) {
  if (arr.length <= 1) return arr;
  const max = Math.max(...arr);
  let exp = 1;
  while (Math.floor(max / exp) > 0) {
    countSortByDigit(arr, exp);
    exp *= 10;
  }
  return arr;
}

function countSortByDigit(arr, exp) {
  const n = arr.length;
  const output = new Array(n);
  const count = new Array(10).fill(0);

  for (let i = 0; i < n; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;
  }
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }
  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    output[count[digit] - 1] = arr[i];
    count[digit]--;
  }
  for (let i = 0; i < n; i++) arr[i] = output[i];
}`,
    advantages: [
      'Linear time complexity O(d · n) when digit count d is small/constant.',
      'Beats comparison-based sorting for large quantities of integers or fixed-length strings.'
    ],
    disadvantages: [
      'Slower than Quick Sort if key word length is large (high d).',
      'Higher memory allocation for auxiliary count and output arrays.'
    ]
  },
  {
    id: 'bucket-sort',
    name: 'Bucket Sort',
    category: 'Advanced',
    tagline: 'Distributes elements into sub-range buckets, sorts each bucket individually, and concatenates results.',
    shortDescription: 'Distribution sort suitable for uniformly distributed floating-point or integer data.',
    definition: 'Bucket Sort (or bin sort) divides input elements into multiple buckets based on their value ranges. Each bucket is then sorted individually using Insertion Sort or recursively using Bucket Sort, and concatenated.',
    howItWorks: [
      'Create k empty buckets spanning value range [min..max].',
      'Scatter: Place each element arr[i] into bucket idx = floor(k * (arr[i] - min) / range).',
      'Sort: Sort each non-empty bucket individually using Insertion Sort.',
      'Gather: Concatenate sorted buckets sequentially back into main array.'
    ],
    complexity: {
      best: 'O(n + k)',
      average: 'O(n + k)',
      worst: 'O(n²)',
      space: 'O(n + k)'
    },
    stable: true,
    inPlace: false,
    technique: 'Distribution & Local Sorting',
    bestUseCase: 'Inputs uniformly distributed over a continuous interval (e.g. floats in range [0, 1]).',
    pseudocode: `procedure bucketSort(A, k)
    create k empty buckets
    for i = 0 to length(A)-1 do
        insert A[i] into bucket[hash(A[i])]
    for i = 0 to k-1 do
        sort(bucket[i])
    concatenate buckets[0..k-1] into output
end procedure`,
    javascriptCode: `function bucketSort(arr) {
  if (arr.length <= 1) return arr;
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const bucketCount = Math.floor(Math.sqrt(arr.length)) || 5;
  const range = (max - min) / bucketCount || 1;
  const buckets = Array.from({ length: bucketCount }, () => []);

  for (let i = 0; i < arr.length; i++) {
    let bIdx = Math.floor((arr[i] - min) / range);
    if (bIdx >= bucketCount) bIdx = bucketCount - 1;
    buckets[bIdx].push(arr[i]);
  }

  const result = [];
  for (let i = 0; i < bucketCount; i++) {
    // Insertion sort on each bucket
    insertionSort(buckets[i]);
    result.push(...buckets[i]);
  }
  return result;
}`,
    advantages: [
      'Executes in O(n) average time for uniformly distributed data.',
      'Easily parallelizable since individual buckets can be sorted independently.'
    ],
    disadvantages: [
      'Degrades to O(n²) if elements cluster heavily in a single bucket.',
      'Requires extra memory for bucket allocation.'
    ]
  },
  {
    id: 'shell-sort',
    name: 'Shell Sort',
    category: 'Advanced',
    tagline: 'Variation of insertion sort that compares far-apart elements using a shrinking gap sequence.',
    shortDescription: 'Diminishing increment sort bridging O(n²) insertion sort and O(n log n) algorithms.',
    definition: 'Shell Sort improves Insertion Sort by breaking the array into sub-lists of elements separated by a "gap" sequence. It sorts these sub-lists and gradually decreases the gap down to 1 (which equals standard insertion sort on a mostly-sorted array).',
    howItWorks: [
      'Initialize gap size sequence (e.g. n/2, n/4, ..., 1).',
      'For current gap size, perform insertion sort on elements spaced gap apart.',
      'Reduce gap size by half.',
      'Repeat until gap = 1, ensuring final pass is standard fast insertion sort.'
    ],
    complexity: {
      best: 'O(n log n)',
      average: 'O(n^(4/3))',
      worst: 'O(n²)',
      space: 'O(1)'
    },
    stable: false,
    inPlace: true,
    technique: 'Diminishing Increment Insertion',
    bestUseCase: 'Medium-sized arrays when simple in-place implementation is needed without extra recursion memory.',
    pseudocode: `procedure shellSort(A)
    n = length(A)
    for gap = n/2 down to 1 step gap/2 do
        for i = gap to n-1 do
            temp = A[i]
            j = i
            while j >= gap and A[j - gap] > temp do
                A[j] = A[j - gap]
                j = j - gap
            end while
            A[j] = temp
        end for
    end for
end procedure`,
    javascriptCode: `function shellSort(arr) {
  const n = arr.length;
  for (let gap = Math.floor(n / 2); gap > 0; Math.floor(gap /= 2)) {
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = temp;
    }
  }
  return arr;
}`,
    advantages: [
      'In-place sorting with zero extra auxiliary array allocations.',
      'Significantly faster than standard Bubble/Selection/Insertion sort.',
      'Simple implementation with no recursive stack overhead.'
    ],
    disadvantages: [
      'Performance strongly depends on the gap sequence chosen.',
      'Unstable sorting algorithm.',
      'Outperformed by Quick Sort and Merge Sort on large datasets.'
    ]
  }
];
