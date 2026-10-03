export const QUIZ_QUESTIONS = [
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
    algorithmId: 'quick-sort'
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
    algorithmId: 'merge-sort'
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
    algorithmId: 'merge-sort'
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
    algorithmId: 'bubble-sort'
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
    algorithmId: 'heap-sort'
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
    algorithmId: 'radix-sort'
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
    algorithmId: 'bubble-sort'
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
    algorithmId: 'shell-sort'
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
    algorithmId: 'selection-sort'
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
    algorithmId: 'counting-sort'
  }
];
