/**
 * Metadata for the 9 Additional Sorting Algorithms
 * Accessed via the "+ More" button in Dalgo.
 */

export const MORE_SORTING_ALGORITHMS = [
  {
    id: 'exchange-sort',
    name: 'Exchange Sort',
    difficulty: 'Easy',
    category: 'Beginner',
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
    category: 'Beginner',
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
    category: 'Intermediate',
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
    category: 'Intermediate',
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
    category: 'Intermediate',
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
        // Odd phase
        for i = 1 to length(A) - 2 step 2 do
            if A[i] > A[i + 1] then
                swap(A[i], A[i + 1]); isSorted = false
            end if
        end for
        // Even phase
        for i = 0 to length(A) - 2 step 2 do
            if A[i] > A[i + 1] then
                swap(A[i], A[i + 1]); isSorted = false
            end if
        end for
    end while
end procedure`,
    javascriptCode: `function oddEvenSort(arr) {
  let isSorted = false;
  while (!isSorted) {
    isSorted = true;
    for (let i = 1; i < arr.length - 1; i += 2) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        isSorted = false;
      }
    }
    for (let i = 0; i < arr.length - 1; i += 2) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        isSorted = false;
      }
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
    category: 'Intermediate',
    isMore: true,
    tagline: 'Theoretically optimal in-place sort that minimizes total memory write operations.',
    shortDescription: 'Places elements directly into their permutation cycles with minimum writes.',
    definition: 'Cycle Sort is an in-place, unstable sorting algorithm based on the idea that the permutation to be sorted can be factored into cycles. It is theoretically optimal in terms of memory writes: each element is written either 0 times (if already in place) or at most 1 time to its final destination.',
    howItWorks: [
      'Iterate cycleStart from 0 to n - 2.',
      'Pick item = arr[cycleStart] and find its target position by counting smaller elements in the remaining list.',
      'If pos == cycleStart, the item is already correctly placed.',
      'Otherwise, skip any duplicate keys at pos, write item to arr[pos], and pick up displaced element.',
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
    pseudocode: `procedure cycleSort(A : list of sortable items)
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
    let item = arr[cycleStart];
    let pos = cycleStart;
    for (let i = cycleStart + 1; i < n; i++) {
      if (arr[i] < item) pos++;
    }
    if (pos === cycleStart) continue;
    while (item === arr[pos]) pos++;
    let temp = arr[pos]; arr[pos] = item; item = temp;
    while (pos !== cycleStart) {
      pos = cycleStart;
      for (let i = cycleStart + 1; i < n; i++) {
        if (arr[i] < item) pos++;
      }
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
      'Not a stable sort.',
      'Complex control flow compared to Selection Sort.'
    ]
  },
  {
    id: 'strand-sort',
    name: 'Strand Sort',
    difficulty: 'Medium',
    category: 'Intermediate',
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
    pseudocode: `procedure strandSort(A : list of sortable items)
    output = []
    while A is not empty do
        strand = [remove A[0]]
        for each x in A do
            if x >= strand.last then
                strand.append(remove x from A)
            end if
        end for
        output = merge(output, strand)
    end while
    return output
end procedure`,
    javascriptCode: `function strandSort(arr) {
  let remaining = [...arr];
  let output = [];
  while (remaining.length > 0) {
    const strand = [remaining.shift()];
    let i = 0;
    while (i < remaining.length) {
      if (remaining[i] >= strand[strand.length - 1]) {
        strand.push(remaining.splice(i, 1)[0]);
      } else {
        i++;
      }
    }
    // Merge strand into output
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
    category: 'Intermediate',
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
    pseudocode: `procedure binaryInsertionSort(A : list of sortable items)
    for i = 1 to length(A) - 1 do
        key = A[i]
        low = 0, high = i - 1
        while low <= high do
            mid = floor((low + high) / 2)
            if key < A[mid] then high = mid - 1
            else low = mid + 1
        end while
        for j = i - 1 downto low do
            A[j + 1] = A[j]
        end for
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
    for (let j = i - 1; j >= low; j--) {
      arr[j + 1] = arr[j];
    }
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
      'Still requires O(n²) array shifts in the worst and average cases.',
      'O(n log n) best-case comparisons is slightly slower than normal insertion sort on already sorted data.'
    ]
  },
  {
    id: 'library-sort',
    name: 'Library Sort',
    difficulty: 'Hard',
    category: 'Advanced',
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
    pseudocode: `procedure librarySort(A : list of sortable items)
    shelf = initializeWithGaps(A[0])
    for i = 1 to length(A) - 1 do
        if roundBoundaryReached(i) then
            shelf = rebalanceGaps(shelf)
        end if
        pos = binarySearchShelf(shelf, A[i])
        if shelf[pos] is gap then
            shelf[pos] = A[i]
        else
            shiftLocallyToNearestGap(shelf, pos, A[i])
        end if
    end for
    return compactShelf(shelf)
end procedure`,
    javascriptCode: `function librarySort(arr) {
  const n = arr.length;
  if (n <= 1) return arr;
  let shelf = new Array(Math.max(16, 2 * n)).fill(null);
  shelf[1] = arr[0];
  let roundThreshold = 1;

  for (let i = 1; i < n; i++) {
    if (i >= roundThreshold * 2) {
      roundThreshold *= 2;
      const books = shelf.filter(x => x !== null);
      shelf = new Array(shelf.length).fill(null);
      books.forEach((b, idx) => shelf[idx * 2 + 1] = b);
    }
    const occupied = [];
    shelf.forEach((v, idx) => { if (v !== null) occupied.push({ val: v, idx }); });
    let low = 0, high = occupied.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (arr[i] < occupied[mid].val) high = mid - 1;
      else low = mid + 1;
    }
    const target = low < occupied.length ? occupied[low].idx - 1 : occupied[occupied.length - 1].idx + 1;
    if (shelf[target] === null) {
      shelf[target] = arr[i];
    } else {
      let r = target;
      while (r < shelf.length && shelf[r] !== null) r++;
      for (let s = r; s > target; s--) shelf[s] = shelf[s - 1];
      shelf[target] = arr[i];
    }
  }
  return shelf.filter(x => x !== null);
}`,
    advantages: [
      'Achieves O(n log n) average time complexity using an insertion-based paradigm.',
      'Gaps minimize element shifting drastically compared to standard insertion sort.',
      'Theoretical basis for cache-oblivious B-trees and file-system directory indices.'
    ],
    disadvantages: [
      'Requires auxiliary memory for the gapped array (O(n) space).',
      'Rebalancing overhead adds complexity.',
      'Unstable sorting behavior.'
    ]
  }
];
