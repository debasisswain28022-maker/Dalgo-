/**
 * Patience Sort Step Generator
 * Based on the card game Patience (Solitaire) and longest increasing subsequences:
 * 1. Piles Building: For each element, binary search for the leftmost pile with top card >= x.
 *    If found, push x onto that pile; otherwise create a new pile.
 * 2. K-Way Merge Extraction: Repeatedly extract the minimum of all pile top cards into the output array.
 * 
 * @param {number[]} initialArray 
 * @param {Object} [options]
 * @param {'asc'|'desc'} [options.order='asc']
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generatePatienceSortSteps(initialArray, options = {}) {
  const order = options.order || 'asc';
  const arr = [...initialArray];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = [];

  const shouldPlaceOnPile = (x, top) => order === 'desc' ? x >= top : x <= top;
  const isOutOfOrder = (a, b) => order === 'desc' ? a < b : a > b;

  steps.push({
    type: 'init',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Initial array before Patience Sort (${order === 'desc' ? 'Descending' : 'Ascending'}). Deals cards into sorted piles, then merges pile tops.`,
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

  // Phase 1: Deal elements into piles
  // Each pile is an array: top card is pile[pile.length - 1]
  const piles = [];

  for (let i = 0; i < n; i++) {
    const x = arr[i];

    steps.push({
      type: 'pick_key',
      indices: [i],
      keyVal: x,
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Patience deal: inspecting card ${x} at index ${i} to place on leftmost suitable pile.`,
      comparisonsCount: comparisons,
      swapsCount: swaps,
      pass: 1
    });

    // Binary search for the leftmost pile whose top card is >= x (or <= x for desc)
    let low = 0;
    let high = piles.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const topCard = piles[mid][piles[mid].length - 1];
      comparisons++;

      steps.push({
        type: 'compare',
        indices: [i],
        keyVal: x,
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Comparing card ${x} with Pile ${mid} top card (${topCard})`,
        comparisonsCount: comparisons,
        swapsCount: swaps,
        pass: 1
      });

      if (shouldPlaceOnPile(x, topCard)) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    if (low < piles.length) {
      piles[low].push(x);
      swaps++;
      steps.push({
        type: 'insert',
        indices: [i],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Placed card ${x} onto existing Pile ${low}. Pile top is now ${x}.`,
        comparisonsCount: comparisons,
        swapsCount: swaps,
        pass: 1
      });
    } else {
      piles.push([x]);
      swaps++;
      steps.push({
        type: 'insert',
        indices: [i],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Started new Pile ${piles.length - 1} with card ${x}. Total piles: ${piles.length}.`,
        comparisonsCount: comparisons,
        swapsCount: swaps,
        pass: 1
      });
    }
  }

  // Phase 2: Extract minimums from pile tops (k-way merge)
  let outIdx = 0;

  steps.push({
    type: 'pass_start',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Patience Extraction: created ${piles.length} piles. Now repeatedly extracting champion card from pile tops.`,
    comparisonsCount: comparisons,
    swapsCount: swaps,
    pass: 2
  });

  while (piles.length > 0) {
    let bestPileIdx = 0;

    for (let p = 1; p < piles.length; p++) {
      comparisons++;
      const candidateVal = piles[p][piles[p].length - 1];
      const bestVal = piles[bestPileIdx][piles[bestPileIdx].length - 1];

      if (isOutOfOrder(bestVal, candidateVal)) {
        bestPileIdx = p;
      }
    }

    // Pop champion card from best pile
    const winningVal = piles[bestPileIdx].pop();
    if (piles[bestPileIdx].length === 0) {
      piles.splice(bestPileIdx, 1);
    }

    arr[outIdx] = winningVal;
    swaps++;
    sortedIndices.push(outIdx);

    steps.push({
      type: 'place_output',
      indices: [outIdx],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Extracted ${winningVal} from pile tops into sorted output position ${outIdx}.`,
      comparisonsCount: comparisons,
      swapsCount: swaps,
      pass: 2
    });

    outIdx++;
  }

  steps.push({
    type: 'completed',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Patience Sort complete! All piles extracted into final ${order === 'desc' ? 'descending' : 'ascending'} order.`,
    comparisonsCount: comparisons,
    swapsCount: swaps
  });

  return { steps, stats: { comparisons, swaps } };
}
