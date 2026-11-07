export const QUIZ_QUESTIONS = [
  // ── SORTING ALGORITHMS ──────────────────────────────────────────────────────
  {
    id: 1,
    question: "Which sorting algorithm relies on selecting a pivot element to partition the array into smaller and larger subarrays?",
    options: [
      "Merge Sort",
      "Quick Sort",
      "Heap Sort",
      "Selection Sort"
    ],
    correctAnswer: 1,
    explanation: "Quick Sort is a divide-and-conquer algorithm that selects a pivot element and partitions the array into elements less than the pivot and elements greater than the pivot.",
    algorithmId: 'quick-sort',
    category: 'sorting'
  },
  {
    id: 2,
    question: "What is the worst-case time complexity of Merge Sort?",
    options: [
      "O(n²)",
      "O(n log n)",
      "O(n)",
      "O(log n)"
    ],
    correctAnswer: 1,
    explanation: "Merge Sort guarantees O(n log n) time complexity in all cases (best, average, and worst) because it always splits arrays in half and performs linear O(n) merges.",
    algorithmId: 'merge-sort',
    category: 'sorting'
  },
  {
    id: 3,
    question: "Which of the following sorting algorithms is NOT in-place (requires O(n) auxiliary space)?",
    options: [
      "Heap Sort",
      "Insertion Sort",
      "Merge Sort",
      "Bubble Sort"
    ],
    correctAnswer: 2,
    explanation: "Standard Merge Sort requires O(n) additional memory allocation to store temporary subarrays during the merge phase.",
    algorithmId: 'merge-sort',
    category: 'sorting'
  },
  {
    id: 4,
    question: "What makes a sorting algorithm 'Stable'?",
    options: [
      "It runs in O(n log n) time in all cases.",
      "It does not use recursion.",
      "It preserves the relative order of elements with equal key values.",
      "It uses O(1) auxiliary memory space."
    ],
    correctAnswer: 2,
    explanation: "A sorting algorithm is stable if two items with equal key values appear in the sorted output in the same relative order as in the original input.",
    algorithmId: 'bubble-sort',
    category: 'sorting'
  },
  {
    id: 5,
    question: "Which algorithm converts the input array into a complete binary tree structure before sorting?",
    options: [
      "Radix Sort",
      "Heap Sort",
      "Shell Sort",
      "Bucket Sort"
    ],
    correctAnswer: 1,
    explanation: "Heap Sort builds a Max Heap (binary tree structure represented as an array) where parent nodes are greater than or equal to their children.",
    algorithmId: 'heap-sort',
    category: 'sorting'
  },
  {
    id: 6,
    question: "Which non-comparison sorting algorithm sorts items digit-by-digit from Least Significant Digit to Most Significant Digit?",
    options: [
      "Counting Sort",
      "Bucket Sort",
      "Radix Sort",
      "Quick Sort"
    ],
    correctAnswer: 2,
    explanation: "Radix Sort processes numbers position by position, starting from the ones place (LSD) up to the highest digit place using a stable counting sort pass per digit.",
    algorithmId: 'radix-sort',
    category: 'sorting'
  },
  {
    id: 7,
    question: "What is the best-case time complexity of Bubble Sort when optimized with a swapped flag?",
    options: [
      "O(n²)",
      "O(n log n)",
      "O(n)",
      "O(1)"
    ],
    correctAnswer: 2,
    explanation: "With a boolean swap check, if an array is already sorted, Bubble Sort makes a single pass of n-1 comparisons, detects zero swaps, and terminates early in O(n) time.",
    algorithmId: 'bubble-sort',
    category: 'sorting'
  },
  {
    id: 8,
    question: "Shell Sort is an extension of which basic sorting algorithm?",
    options: [
      "Selection Sort",
      "Insertion Sort",
      "Bubble Sort",
      "Merge Sort"
    ],
    correctAnswer: 1,
    explanation: "Shell Sort generalizes Insertion Sort by allowing exchanges of elements that are far apart according to a gap sequence, reducing the total shifts needed.",
    algorithmId: 'shell-sort',
    category: 'sorting'
  },
  {
    id: 9,
    question: "Which sorting algorithm minimizes the total number of element swaps to at most O(n)?",
    options: [
      "Selection Sort",
      "Bubble Sort",
      "Insertion Sort",
      "Quick Sort"
    ],
    correctAnswer: 0,
    explanation: "Selection Sort performs at most n-1 swaps in total because it finds the absolute minimum element for each position before performing a single swap.",
    algorithmId: 'selection-sort',
    category: 'sorting'
  },
  {
    id: 10,
    question: "What is the main limitation of Counting Sort?",
    options: [
      "It is an unstable sort.",
      "It has a worst-case complexity of O(n log n).",
      "It requires a discrete, relatively small range of key values (k).",
      "It cannot sort arrays smaller than 10 elements."
    ],
    correctAnswer: 2,
    explanation: "Counting Sort requires space proportional to the difference between the max and min values (range k). If range k is very large (e.g. k = 1,000,000,000), space requirement becomes impractical.",
    algorithmId: 'counting-sort',
    category: 'sorting'
  },

  // ── GREEDY ALGORITHMS & DYNAMIC PROGRAMMING ────────────────────────────────
  {
    id: 11,
    question: "Why does the Greedy approach find the globally optimal solution for Fractional Knapsack, but fails for 0/1 Knapsack?",
    options: [
      "Fractional Knapsack has a lower theoretical time complexity.",
      "Being able to take fractions ensures capacity is fully utilized with the highest value-to-weight ratio items without leaving unfilled space.",
      "0/1 Knapsack items cannot be sorted by ratio.",
      "Fractional Knapsack requires dynamic programming."
    ],
    correctAnswer: 1,
    explanation: "In Fractional Knapsack, items can be subdivided. Taking full or fractional amounts of items strictly sorted by decreasing value/weight ratio guarantees maximum profit. In 0/1 Knapsack, taking a high-ratio item might leave empty space that cannot be filled, causing greedy to miss a better combination.",
    algorithmId: 'fractional-knapsack',
    category: 'greedy-dp'
  },
  {
    id: 12,
    question: "In the Fractional Knapsack algorithm, how are items prioritized before filling the knapsack?",
    options: [
      "By increasing weight (lightest first)",
      "By decreasing value (most expensive first)",
      "By decreasing value-to-weight ratio (Value ÷ Weight)",
      "By random index order"
    ],
    correctAnswer: 2,
    explanation: "The greedy choice strategy sorts items in descending order of their value-to-weight ratio (v / w). This ensures each unit of weight added contributes the maximum possible profit.",
    algorithmId: 'fractional-knapsack',
    category: 'greedy-dp'
  },
  {
    id: 13,
    question: "What essential property allows Huffman codes to be decoded unambiguously without using separators between characters?",
    options: [
      "All codes have the exact same bit length (fixed-width).",
      "Prefix Property: No character's binary code is a prefix of any other character's binary code.",
      "Each code must be a palindrome binary string.",
      "Every code begins with '1' and ends with '0'."
    ],
    correctAnswer: 1,
    explanation: "Because Huffman codes satisfy the Prefix Property (no valid code is a prefix of another code), the decoder reads bits sequentially and matches characters uniquely as soon as a leaf node in the Huffman tree is reached.",
    algorithmId: 'huffman-coding',
    category: 'greedy-dp'
  },
  {
    id: 14,
    question: "During each step of constructing a Huffman Tree with n characters, what does the greedy algorithm combine?",
    options: [
      "The two nodes with the highest frequencies",
      "The two nodes with the lowest frequencies",
      "The root node and the leftmost leaf",
      "Any two random nodes in the queue"
    ],
    correctAnswer: 1,
    explanation: "Huffman's algorithm repeatedly extracts the two nodes with the smallest frequencies from a Min-Priority Queue, creates a parent node with their combined frequency, and re-inserts the parent back into the priority queue until only one root tree remains.",
    algorithmId: 'huffman-coding',
    category: 'greedy-dp'
  },
  {
    id: 15,
    question: "What is the time complexity to construct a Huffman Tree for n distinct characters using a binary min-heap?",
    options: [
      "O(n²)",
      "O(n log n)",
      "O(n)",
      "O(2ⁿ)"
    ],
    correctAnswer: 1,
    explanation: "Building the initial min-heap takes O(n). There are n-1 merge iterations, and each heap extract-min and insert operation takes O(log n) time. Thus, the total time complexity is O(n log n).",
    algorithmId: 'huffman-coding',
    category: 'greedy-dp'
  },
  {
    id: 16,
    question: "In the Activity Selection Problem, which greedy criterion guarantees selecting the maximum number of mutually compatible activities?",
    options: [
      "Select the activity with the shortest duration (finish - start)",
      "Select the activity that starts earliest",
      "Select the activity that finishes earliest",
      "Select the activity that overlaps the least with others"
    ],
    correctAnswer: 2,
    explanation: "Selecting the activity with the earliest finish time leaves the maximum possible remaining time for subsequent activities, which guarantees finding the maximum-size set of compatible activities.",
    algorithmId: 'activity-selection',
    category: 'greedy-dp'
  },
  {
    id: 17,
    question: "When evaluating an activity against the last selected activity, what condition must hold for it to be compatible?",
    options: [
      "Start Time >= Previous Activity's Finish Time",
      "Start Time <= Previous Activity's Finish Time",
      "Finish Time <= Previous Activity's Start Time",
      "Duration >= Previous Activity's Duration"
    ],
    correctAnswer: 0,
    explanation: "An activity can be scheduled only if its start time is greater than or equal to the finish time of the last scheduled activity, ensuring the shared resource is free and no overlapping occurs.",
    algorithmId: 'activity-selection',
    category: 'greedy-dp'
  },
  {
    id: 18,
    question: "In Dynamic Programming for LCS of strings X and Y, what is the recurrence relation when X[i-1] == Y[j-1] (matching characters)?",
    options: [
      "DP[i][j] = max(DP[i-1][j], DP[i][j-1])",
      "DP[i][j] = 1 + DP[i-1][j-1]",
      "DP[i][j] = DP[i-1][j-1]",
      "DP[i][j] = 1 + max(DP[i-1][j], DP[i][j-1])"
    ],
    correctAnswer: 1,
    explanation: "When characters X[i-1] and Y[j-1] match, they extend the longest common subsequence of prefixes X[0..i-2] and Y[0..j-2] by 1. Therefore, DP[i][j] = 1 + DP[i-1][j-1].",
    algorithmId: 'longest-common-subsequence',
    category: 'greedy-dp'
  },
  {
    id: 19,
    question: "Why are the first row DP[0][j] and first column DP[i][0] in the LCS matrix initialized with 0?",
    options: [
      "To save memory allocation space",
      "Because the length of any common subsequence with an empty string (Ø) is 0",
      "Because index 0 represents negative values in 1-based indexing",
      "To signal that backtracking is complete"
    ],
    correctAnswer: 1,
    explanation: "An empty string Ø contains 0 characters, so the longest common subsequence between an empty string and any prefix of another string is always of length 0.",
    algorithmId: 'longest-common-subsequence',
    category: 'greedy-dp'
  },
  {
    id: 20,
    question: "What are the time and space complexities of the standard 2D DP matrix approach to find the LCS of two strings of lengths m and n?",
    options: [
      "Time: O(m + n), Space: O(1)",
      "Time: O(m × n), Space: O(m × n)",
      "Time: O(2ᵐ⁺ⁿ), Space: O(m × n)",
      "Time: O(m log n), Space: O(n)"
    ],
    correctAnswer: 1,
    explanation: "The DP table has (m+1) × (n+1) cells. Each cell requires O(1) computation time, yielding O(m × n) overall time complexity, and storing the matrix requires O(m × n) space.",
    algorithmId: 'longest-common-subsequence',
    category: 'greedy-dp'
  },
  {
    id: 21,
    question: "What is the fundamental difference between Greedy Algorithms and Dynamic Programming?",
    options: [
      "Greedy algorithms always use recursion, while DP algorithms never use recursion.",
      "Greedy makes a locally optimal choice at each step without backtracking, while DP solves all overlapping subproblems and guarantees global optimality.",
      "DP algorithms are always faster than Greedy algorithms.",
      "Greedy algorithms require sorting, but DP algorithms do not."
    ],
    correctAnswer: 1,
    explanation: "A greedy algorithm makes the choice that looks best at the current moment hoping it leads to a global optimum, without re-evaluating past choices. Dynamic programming considers all possible subproblems and guarantees global optimality by memoizing solutions to overlapping subproblems.",
    algorithmId: 'greedy-dp-general',
    category: 'greedy-dp'
  }
];
