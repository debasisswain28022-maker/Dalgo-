import { generateBubbleSortSteps } from './bubbleSort.js';
import { generateSelectionSortSteps } from './selectionSort.js';
import { generateInsertionSortSteps } from './insertionSort.js';
import { generateMergeSortSteps } from './mergeSort.js';
import { generateQuickSortSteps } from './quickSort.js';
import { generateHeapSortSteps } from './heapSort.js';
import { generateCountingSortSteps } from './countingSort.js';
import { generateRadixSortSteps } from './radixSort.js';
import { generateBucketSortSteps } from './bucketSort.js';
import { generateShellSortSteps } from './shellSort.js';

// Additional Sorting Algorithms
import { generateExchangeSortSteps } from './exchangeSort.js';
import { generateGnomeSortSteps } from './gnomeSort.js';
import { generateCocktailShakerSortSteps } from './cocktailShakerSort.js';
import { generateCombSortSteps } from './combSort.js';
import { generateOddEvenSortSteps } from './oddEvenSort.js';
import { generateCycleSortSteps } from './cycleSort.js';
import { generateStrandSortSteps } from './strandSort.js';
import { generateBinaryInsertionSortSteps } from './binaryInsertionSort.js';
import { generateLibrarySortSteps } from './librarySort.js';

// Divide and Conquer Sorting Algorithms
import { generateDualPivotQuickSortSteps } from './dualPivotQuickSort.js';
import { generateThreeWayQuickSortSteps } from './threeWayQuickSort.js';
import { generateIntroSortSteps } from './introSort.js';
import { generateTimSortSteps } from './timSort.js';
import { generateBlockMergeSortSteps } from './blockMergeSort.js';
import { generateInPlaceMergeSortSteps } from './inPlaceMergeSort.js';
import { generatePatienceSortSteps } from './patienceSort.js';
import { generateSmoothSortSteps } from './smoothSort.js';
import { generateTournamentSortSteps } from './tournamentSort.js';

export const algorithmGenerators = {
  // Existing 10 algorithms
  'bubble-sort': generateBubbleSortSteps,
  'selection-sort': generateSelectionSortSteps,
  'insertion-sort': generateInsertionSortSteps,
  'merge-sort': generateMergeSortSteps,
  'quick-sort': generateQuickSortSteps,
  'heap-sort': generateHeapSortSteps,
  'counting-sort': generateCountingSortSteps,
  'radix-sort': generateRadixSortSteps,
  'bucket-sort': generateBucketSortSteps,
  'shell-sort': generateShellSortSteps,

  // Additional 9 algorithms
  'exchange-sort': generateExchangeSortSteps,
  'gnome-sort': generateGnomeSortSteps,
  'cocktail-shaker-sort': generateCocktailShakerSortSteps,
  'comb-sort': generateCombSortSteps,
  'odd-even-sort': generateOddEvenSortSteps,
  'cycle-sort': generateCycleSortSteps,
  'strand-sort': generateStrandSortSteps,
  'binary-insertion-sort': generateBinaryInsertionSortSteps,
  'library-sort': generateLibrarySortSteps,

  // Divide and Conquer algorithms
  'dual-pivot-quick-sort': generateDualPivotQuickSortSteps,
  'three-way-quick-sort': generateThreeWayQuickSortSteps,
  'intro-sort': generateIntroSortSteps,
  'tim-sort': generateTimSortSteps,
  'block-merge-sort': generateBlockMergeSortSteps,
  'in-place-merge-sort': generateInPlaceMergeSortSteps,
  'patience-sort': generatePatienceSortSteps,
  'smooth-sort': generateSmoothSortSteps,
  'tournament-sort': generateTournamentSortSteps
};

export function runSortingAlgorithm(id, array, options = {}) {
  const generator = algorithmGenerators[id] || algorithmGenerators['bubble-sort'];
  if (!generator) {
    throw new Error(`Algorithm '${id}' not found`);
  }
  // Pass options to all generators
  return generator(array, options);
}
