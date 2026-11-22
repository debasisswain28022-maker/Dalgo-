/**
 * Tournament Sort Step Generator
 * Complete binary tree knockout competition (selection sort variant):
 * 1. Build tournament tree where leaves are array elements.
 * 2. Compete in pairwise matches up to the root (champion).
 * 3. Extract champion into sorted array, set leaf to Infinity, and replay ancestor path.
 * 
 * @param {number[]} initialArray 
 * @param {Object} [options]
 * @param {'asc'|'desc'} [options.order='asc']
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generateTournamentSortSteps(initialArray, options = {}) {
  const order = options.order || 'asc';
  const arr = [...initialArray];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = [];

  const isBetter = (a, b) => order === 'desc' ? a > b : a < b;
  const INF = order === 'desc' ? -Infinity : Infinity;

  steps.push({
    type: 'init',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Initial array before Tournament Sort (${order === 'desc' ? 'Descending' : 'Ascending'}). Builds a knockout tournament tree and repeatedly extracts the champion.`,
    comparisonsCount: 0,
    swapsCount: 0,
    pass: 0
  });

  if (n <= 1) {
    if (n === 1) sortedIndices.push(0);
    steps.push({
      type: 'completed',
      indices: [],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: 'Array is sorted!',
      comparisonsCount: 0,
      swapsCount: 0,
      pass: 0
    });
    return { steps, stats: { comparisons: 0, swaps: 0 } };
  }

  // Find next power of 2 for tree leaves
  let numLeaves = 1;
  while (numLeaves < n) numLeaves *= 2;

  // Tree representation of size 2 * numLeaves:
  // Root at 1. Leaves from numLeaves to 2 * numLeaves - 1.
  // tree[i] stores the index in initialArray or -1 for dummy
  const leafValues = new Array(numLeaves).fill(INF);
  for (let i = 0; i < n; i++) leafValues[i] = arr[i];

  const tree = new Array(2 * numLeaves).fill(-1);

  // Initialize leaves with their indices
  for (let i = 0; i < numLeaves; i++) {
    tree[numLeaves + i] = i;
  }

  // Function to decide winner between two contestant leaf indices
  function playMatch(idxA, idxB) {
    if (idxA === -1 && idxB === -1) return -1;
    if (idxA === -1) return idxB;
    if (idxB === -1) return idxA;

    const valA = leafValues[idxA];
    const valB = leafValues[idxB];

    if (valA === INF && valB === INF) return idxA;
    if (valA === INF) return idxB;
    if (valB === INF) return idxA;

    comparisons++;
    if (isBetter(valA, valB)) {
      return idxA;
    } else {
      return idxB;
    }
  }

  // Phase 1: Build initial tournament tree from leaves up
  for (let i = numLeaves - 1; i >= 1; i--) {
    const leftWinner = tree[2 * i];
    const rightWinner = tree[2 * i + 1];
    tree[i] = playMatch(leftWinner, rightWinner);
  }

  steps.push({
    type: 'pass_start',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Tournament Tree built across ${numLeaves} contestant slots. Root champion is ${leafValues[tree[1]]}.`,
    comparisonsCount: comparisons,
    swapsCount: swaps,
    pass: 1
  });

  // Phase 2: Extract champion n times
  const output = [];

  for (let step = 0; step < n; step++) {
    const championLeafIdx = tree[1];
    const championVal = leafValues[championLeafIdx];

    output.push(championVal);
    swaps++;
    arr[step] = championVal;
    sortedIndices.push(step);

    steps.push({
      type: 'place_output',
      indices: [step],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Champion extracted: ${championVal} placed into sorted position ${step}.`,
      comparisonsCount: comparisons,
      swapsCount: swaps,
      pass: step + 2
    });

    // Mark winner leaf as eliminated (INF)
    leafValues[championLeafIdx] = INF;

    // Replay ancestor path from champion leaf to root
    let node = Math.floor((numLeaves + championLeafIdx) / 2);
    while (node >= 1) {
      const leftChild = 2 * node;
      const rightChild = 2 * node + 1;
      tree[node] = playMatch(tree[leftChild], tree[rightChild]);
      node = Math.floor(node / 2);
    }
  }

  steps.push({
    type: 'completed',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Tournament Sort complete! Champion extraction produced final ${order === 'desc' ? 'descending' : 'ascending'} sorted array.`,
    comparisonsCount: comparisons,
    swapsCount: swaps
  });

  return { steps, stats: { comparisons, swaps } };
}
