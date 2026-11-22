/**
 * Library Sort Step Generator (Gapped Insertion Sort)
 * Inspired by a librarian leaving spaces (gaps) on shelves to allow inserting books
 * without shifting every subsequent book.
 * 
 * Maintains a gapped bookshelf structure:
 * - Uses binary search on occupied shelf slots.
 * - Inserts directly into empty gap slots when available (O(1) shifts).
 * - Shifts locally into adjacent gaps when two elements are immediately adjacent.
 * - Periodically performs a global Rebalance to evenly redistribute elements with fresh gaps.
 * 
 * @param {number[]} initialArray 
 * @param {Object} [options]
 * @param {'asc'|'desc'} [options.order='asc']
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generateLibrarySortSteps(initialArray, options = {}) {
  const order = options.order || 'asc';
  const arr = [...initialArray];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let swaps = 0; // Represents writes / insertions into shelf
  const sortedIndices = [];

  const shouldGoBefore = (key, val) => order === 'desc' ? key > val : key < val;

  steps.push({
    type: 'init',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Initial array before Library Sort (Gapped Insertion Sort). Maintains gaps between books to minimize shifts.`,
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

  // Bookshelf: an array with interleaved null gaps
  // Ample capacity (4x) so gaps are plentiful
  const shelfCapacity = Math.max(64, 4 * n);
  let shelf = new Array(shelfCapacity).fill(null);

  // Place first item in the shelf with gaps
  shelf[2] = arr[0];
  swaps++;
  sortedIndices.push(0);

  const getOccupiedIndices = () => {
    const list = [];
    for (let k = 0; k < shelf.length; k++) {
      if (shelf[k] !== null) list.push(k);
    }
    return list;
  };

  const syncArrayFromShelf = () => {
    const occupied = [];
    for (let k = 0; k < shelf.length; k++) {
      if (shelf[k] !== null) occupied.push(shelf[k]);
    }
    for (let k = 0; k < occupied.length; k++) {
      arr[k] = occupied[k];
    }
    return [...arr];
  };

  steps.push({
    type: 'insert',
    indices: [0],
    array: syncArrayFromShelf(),
    sortedIndices: [0],
    description: `Library shelf initialized: placed book ${arr[0]} on shelf slot 2 with surrounding gaps.`,
    libraryGaps: shelf.map(x => x === null ? '—' : x),
    comparisonsCount: comparisons,
    swapsCount: swaps,
    pass: 1
  });

  let roundThreshold = 1;

  for (let i = 1; i < n; i++) {
    const key = arr[i];

    // Rebalance at milestone rounds (powers of 2)
    if (i >= roundThreshold * 2) {
      roundThreshold *= 2;
      
      const currentBooks = [];
      for (let k = 0; k < shelf.length; k++) {
        if (shelf[k] !== null) currentBooks.push(shelf[k]);
      }

      shelf = new Array(shelfCapacity).fill(null);
      // Evenly space books: slot 2, 4, 6, 8...
      for (let k = 0; k < currentBooks.length; k++) {
        shelf[k * 2 + 2] = currentBooks[k];
        swaps++;
      }

      steps.push({
        type: 'gap_change',
        indices: Array.from({ length: i }, (_, k) => k),
        array: syncArrayFromShelf(),
        sortedIndices: Array.from({ length: i }, (_, k) => k),
        description: `Library Rebalance: evenly respread ${currentBooks.length} books across shelf with fresh interleaved gaps.`,
        libraryGaps: shelf.map(x => x === null ? '—' : x),
        comparisonsCount: comparisons,
        swapsCount: swaps,
        pass: i
      });
    }

    // Binary search over occupied slots
    const occupied = getOccupiedIndices();
    let low = 0;
    let high = occupied.length - 1;

    steps.push({
      type: 'pick_key',
      indices: [i],
      keyVal: key,
      array: syncArrayFromShelf(),
      sortedIndices: Array.from({ length: i }, (_, k) => k),
      description: `Inserting book ${key} into bookshelf using binary search across ${occupied.length} slotted books.`,
      libraryGaps: shelf.map(x => x === null ? '—' : x),
      comparisonsCount: comparisons,
      swapsCount: swaps,
      pass: i
    });

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const shelfIdx = occupied[mid];
      const shelfVal = shelf[shelfIdx];
      comparisons++;

      steps.push({
        type: 'compare',
        indices: [mid, i],
        keyVal: key,
        array: syncArrayFromShelf(),
        sortedIndices: Array.from({ length: i }, (_, k) => k),
        description: `Binary search on shelf: comparing book ${key} with shelf slot ${shelfIdx} (${shelfVal})`,
        libraryGaps: shelf.map(x => x === null ? '—' : x),
        comparisonsCount: comparisons,
        swapsCount: swaps,
        pass: i
      });

      if (shouldGoBefore(key, shelfVal)) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    // The key belongs strictly after prevSlot and strictly before nextSlot
    const prevSlot = low > 0 ? occupied[low - 1] : -1;
    const nextSlot = low < occupied.length ? occupied[low] : shelf.length;

    if (nextSlot - prevSlot > 1) {
      // Direct gap available between prevSlot and nextSlot
      const targetGapIdx = Math.floor((prevSlot + 1 + nextSlot) / 2);
      shelf[targetGapIdx] = key;
      swaps++;

      steps.push({
        type: 'insert',
        indices: [low],
        keyVal: key,
        array: syncArrayFromShelf(),
        sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
        description: `Gap hit! Inserted book ${key} directly into shelf gap at slot ${targetGapIdx} (0 shifts).`,
        libraryGaps: shelf.map(x => x === null ? '—' : x),
        comparisonsCount: comparisons,
        swapsCount: swaps,
        pass: i
      });
    } else {
      // No gap between prevSlot and nextSlot (adjacent books)
      // Search for nearest gap to the right or left
      let gapRight = nextSlot;
      while (gapRight < shelf.length && shelf[gapRight] !== null) {
        gapRight++;
      }

      let gapLeft = prevSlot;
      while (gapLeft >= 0 && shelf[gapLeft] !== null) {
        gapLeft--;
      }

      if (gapRight < shelf.length && (gapLeft < 0 || (gapRight - nextSlot <= prevSlot - gapLeft))) {
        // Shift rightward into gapRight
        for (let s = gapRight; s > nextSlot; s--) {
          shelf[s] = shelf[s - 1];
          swaps++;
        }
        shelf[nextSlot] = key;
        swaps++;
      } else if (gapLeft >= 0) {
        // Shift leftward into gapLeft
        for (let s = gapLeft; s < prevSlot; s++) {
          shelf[s] = shelf[s + 1];
          swaps++;
        }
        shelf[prevSlot] = key;
        swaps++;
      }

      steps.push({
        type: 'shift',
        indices: [low],
        keyVal: key,
        array: syncArrayFromShelf(),
        sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
        description: `Local gap shift: adjusted nearby books into adjacent gap to place book ${key}.`,
        libraryGaps: shelf.map(x => x === null ? '—' : x),
        comparisonsCount: comparisons,
        swapsCount: swaps,
        pass: i
      });
    }
  }

  // Final compaction: extract sorted books from shelf back into arr
  const finalSorted = [];
  for (let k = 0; k < shelf.length; k++) {
    if (shelf[k] !== null) finalSorted.push(shelf[k]);
  }
  for (let k = 0; k < n; k++) {
    arr[k] = finalSorted[k];
    sortedIndices.push(k);
  }

  steps.push({
    type: 'completed',
    indices: [],
    array: [...arr],
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    description: `Library Sort complete! Bookshelf compacted into final sorted array in ${order === 'desc' ? 'descending' : 'ascending'} order.`,
    libraryGaps: shelf.map(x => x === null ? '—' : x),
    comparisonsCount: comparisons,
    swapsCount: swaps,
    pass: n
  });

  return { steps, stats: { comparisons, swaps } };
}
