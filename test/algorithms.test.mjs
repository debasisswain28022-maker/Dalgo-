import { runSortingAlgorithm } from '../src/algorithms/index.js';

const DIVIDE_AND_CONQUER_ALGORITHMS = [
  'merge-sort',
  'quick-sort',
  'dual-pivot-quick-sort',
  'three-way-quick-sort',
  'heap-sort',
  'intro-sort',
  'tim-sort',
  'block-merge-sort',
  'in-place-merge-sort',
  'patience-sort',
  'smooth-sort',
  'tournament-sort'
];

const OTHER_MORE_ALGORITHMS = [
  'exchange-sort',
  'gnome-sort',
  'cocktail-shaker-sort',
  'comb-sort',
  'odd-even-sort',
  'cycle-sort',
  'strand-sort',
  'binary-insertion-sort',
  'library-sort'
];

const ALL_ALGORITHMS = [...DIVIDE_AND_CONQUER_ALGORITHMS, ...OTHER_MORE_ALGORITHMS];

const TEST_CASES = [
  { name: '1. Random Array', array: [64, 34, 25, 12, 22, 11, 90] },
  { name: '2. Already Sorted Array', array: [10, 20, 30, 40, 50, 60] },
  { name: '3. Reverse Sorted Array', array: [99, 88, 77, 66, 55, 44] },
  { name: '4. Array with Duplicates', array: [5, 2, 8, 5, 2, 8, 1, 5, 2] },
  { name: '5. Single Element Array', array: [42] },
  { name: '6. Empty Array', array: [] },
  { name: '7. Two Elements Array', array: [15, 3] },
  { name: '8. Negative and Positive Values', array: [-10, 45, -3, 0, 18, -25, 7] }
];

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

console.log(`\n===============================================================`);
console.log(`RUNNING FULL COMPREHENSIVE SUITE FOR ${ALL_ALGORITHMS.length} ALGORITHMS`);
console.log(`===============================================================\n`);

for (const algoId of ALL_ALGORITHMS) {
  const isDandC = DIVIDE_AND_CONQUER_ALGORITHMS.includes(algoId);
  console.log(`\n---------------------------------------------------------------`);
  console.log(`[${isDandC ? 'DIVIDE & CONQUER' : 'MORE ALGORITHMS'}] TESTING: ${algoId}`);
  console.log(`---------------------------------------------------------------`);

  for (const tc of TEST_CASES) {
    for (const order of ['asc', 'desc']) {
      totalTests++;
      const expected = [...tc.array].sort((a, b) => order === 'desc' ? b - a : a - b);
      
      try {
        const { steps, stats } = runSortingAlgorithm(algoId, tc.array, { order });
        const lastStep = steps[steps.length - 1];
        const finalArray = lastStep ? (lastStep.array || lastStep.arraySnapshot || []) : [];

        const isCorrect = JSON.stringify(finalArray) === JSON.stringify(expected);

        if (isCorrect) {
          passedTests++;
          const compCount = stats?.comparisons ?? stats?.comparisonsCount ?? 0;
          const swapCount = stats?.swaps ?? stats?.swapsCount ?? stats?.movesCount ?? 0;
          console.log(`  ✓ [${order.toUpperCase()}] ${tc.name} (${tc.array.length} items) -> OK (${steps.length} steps, ${compCount} comps, ${swapCount} ops)`);
        } else {
          failedTests++;
          console.error(`  ✗ [${order.toUpperCase()}] ${tc.name} FAILED!`);
          console.error(`    Input:    ${JSON.stringify(tc.array)}`);
          console.error(`    Expected: ${JSON.stringify(expected)}`);
          console.error(`    Received: ${JSON.stringify(finalArray)}`);
        }
      } catch (err) {
        failedTests++;
        console.error(`  ✗ [${order.toUpperCase()}] ${tc.name} CRASHED!`, err);
      }
    }
  }
}

console.log(`\n===============================================================`);
console.log(`TEST SUMMARY: ${passedTests}/${totalTests} Passed, ${failedTests} Failed.`);
console.log(`===============================================================`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log(`ALL ${ALL_ALGORITHMS.length} ALGORITHMS PASSED 100% OF TESTS! 🎉`);
}
