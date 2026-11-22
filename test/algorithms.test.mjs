import { runSortingAlgorithm } from '../src/algorithms/index.js';

const ALGORITHMS_TO_TEST = [
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

const TEST_CASES = [
  { name: '1. Random Array', array: [64, 34, 25, 12, 22, 11, 90] },
  { name: '2. Already Sorted Array', array: [10, 20, 30, 40, 50, 60] },
  { name: '3. Reverse Sorted Array', array: [99, 88, 77, 66, 55, 44] },
  { name: '4. Array with Duplicates', array: [5, 2, 8, 5, 2, 8, 1, 5, 2] },
  { name: '5. Single Element Array', array: [42] },
  { name: '6. Two Elements Array', array: [15, 3] },
  { name: '7. Negative and Positive Values', array: [-10, 45, -3, 0, 18, -25, 7] }
];

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

for (const algoId of ALGORITHMS_TO_TEST) {
  console.log(`\n========================================`);
  console.log(`TESTING ALGORITHM: ${algoId}`);
  console.log(`========================================`);

  for (const tc of TEST_CASES) {
    for (const order of ['asc', 'desc']) {
      totalTests++;
      const expected = [...tc.array].sort((a, b) => order === 'desc' ? b - a : a - b);
      
      try {
        const { steps, stats } = runSortingAlgorithm(algoId, tc.array, { order });
        const lastStep = steps[steps.length - 1];
        const finalArray = lastStep ? (lastStep.array || lastStep.arraySnapshot) : [];

        const isCorrect = JSON.stringify(finalArray) === JSON.stringify(expected);

        if (isCorrect) {
          passedTests++;
          console.log(`  ✓ [${order.toUpperCase()}] ${tc.name} -> Sorted correctly (${steps.length} steps, ${stats.comparisons} comps, ${stats.swaps} swaps)`);
        } else {
          failedTests++;
          console.error(`  ✗ [${order.toUpperCase()}] ${tc.name} FAILED!`);
          console.error(`    Expected: ${JSON.stringify(expected)}`);
          console.error(`    Received: ${JSON.stringify(finalArray)}`);
        }
      } catch (err) {
        failedTests++;
        console.error(`  ✗ [${order.toUpperCase()}] ${tc.name} CRASHED with error:`, err);
      }
    }
  }
}

console.log(`\n----------------------------------------`);
console.log(`TEST SUMMARY: ${passedTests}/${totalTests} Passed, ${failedTests} Failed.`);
console.log(`----------------------------------------`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('ALL 9 ALGORITHMS PASSED ALL TEST SUITES PERFECTLY! 🎉');
}
