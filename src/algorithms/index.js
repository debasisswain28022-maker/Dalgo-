import { generateBubbleSortSteps } from './bubbleSort';
import { generateSelectionSortSteps } from './selectionSort';
import { generateInsertionSortSteps } from './insertionSort';
import { generateMergeSortSteps } from './mergeSort';
import { generateQuickSortSteps } from './quickSort';
import { generateHeapSortSteps } from './heapSort';
import { generateCountingSortSteps } from './countingSort';
import { generateRadixSortSteps } from './radixSort';
import { generateBucketSortSteps } from './bucketSort';
import { generateShellSortSteps } from './shellSort';

export const algorithmGenerators = {
  'bubble-sort': generateBubbleSortSteps,
  'selection-sort': generateSelectionSortSteps,
  'insertion-sort': generateInsertionSortSteps,
  'merge-sort': generateMergeSortSteps,
  'quick-sort': generateQuickSortSteps,
  'heap-sort': generateHeapSortSteps,
  'counting-sort': generateCountingSortSteps,
  'radix-sort': generateRadixSortSteps,
  'bucket-sort': generateBucketSortSteps,
  'shell-sort': generateShellSortSteps
};

export function runSortingAlgorithm(id, array, options = {}) {
  const generator = algorithmGenerators[id];
  if (!generator) {
    throw new Error(`Algorithm '${id}' not found`);
  }
  if (id === 'quick-sort') {
    return generator(array, options.pivotStrategy || 'last');
  }
  return generator(array);
}
