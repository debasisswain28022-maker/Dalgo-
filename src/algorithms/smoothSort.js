/**
 * Smooth Sort Step Generator
 * Edsger Dijkstra's 1981 adaptive variation of Heap Sort.
 * Organizes elements into an implicit forest of Leonardo trees (sizes 1, 1, 3, 5, 9, 15, 25...).
 * Achieves O(n) on pre-sorted data and O(n log n) worst-case with O(1) auxiliary space.
 * 
 * @param {number[]} initialArray 
 * @param {Object} [options]
 * @param {'asc'|'desc'} [options.order='asc']
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generateSmoothSortSteps(initialArray, options = {}) {
  const order = options.order || 'asc';
  const arr = [...initialArray];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = [];

  // cmp(a, b) > 0 means a is greater than b in current sort order (comes after b)
  const cmp = (a, b) => order === 'desc' ? b - a : a - b;

  steps.push({
    type: 'init',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Initial array before Smooth Sort (${order === 'desc' ? 'Descending' : 'Ascending'}). Dijkstra's adaptive Leonardo heap sort (O(n) on pre-sorted).`,
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

  // Precompute Leonardo numbers: L(0)=1, L(1)=1, L(k) = L(k-1) + L(k-2) + 1
  const LP = [1, 1];
  while (LP[LP.length - 1] < n + 10) {
    const len = LP.length;
    LP.push(LP[len - 1] + LP[len - 2] + 1);
  }

  // Sift down within a Leonardo tree rooted at rootIdx of order p
  function sift(rootIdx, p) {
    let r = rootIdx;

    while (p >= 2) {
      const c2 = r - 1; // right child
      const c1 = r - 1 - LP[p - 2]; // left child
      let extremeChild = c1;

      comparisons++;
      if (cmp(arr[c2], arr[c1]) > 0) {
        extremeChild = c2;
      }

      comparisons++;
      if (cmp(arr[extremeChild], arr[r]) > 0) {
        swaps++;
        const tmp = arr[r];
        arr[r] = arr[extremeChild];
        arr[extremeChild] = tmp;

        steps.push({
          type: 'heap_swap',
          indices: [r, extremeChild],
          array: [...arr],
          sortedIndices: [...sortedIndices],
          description: `SmoothSort sift: swapped root ${r} with child ${extremeChild} in Leonardo tree L(${p})`,
          comparisonsCount: comparisons,
          swapsCount: swaps
        });

        if (extremeChild === c1) {
          r = c1;
          p = p - 1;
        } else {
          r = c2;
          p = p - 2;
        }
      } else {
        break;
      }
    }
  }

  // Trinkle: restores heap property across tree roots
  function trinkle(rootIdx, p, treeOrders) {
    let curR = rootIdx;
    let curP = p;
    let tIdx = treeOrders.length - 1;

    while (tIdx > 0) {
      const prevRoot = curR - LP[treeOrders[tIdx]];
      comparisons++;

      if (cmp(arr[prevRoot], arr[curR]) <= 0) {
        break;
      }

      if (curP >= 2) {
        const c2 = curR - 1;
        const c1 = curR - 1 - LP[curP - 2];
        comparisons += 2;
        if (cmp(arr[c2], arr[prevRoot]) >= 0 || cmp(arr[c1], arr[prevRoot]) >= 0) {
          break;
        }
      }

      swaps++;
      const tmp = arr[curR];
      arr[curR] = arr[prevRoot];
      arr[prevRoot] = tmp;

      steps.push({
        type: 'heap_swap',
        indices: [curR, prevRoot],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `SmoothSort trinkle: ordered tree root ${curR} with previous root ${prevRoot}`,
        comparisonsCount: comparisons,
        swapsCount: swaps
      });

      curR = prevRoot;
      tIdx--;
      curP = treeOrders[tIdx];
    }
    sift(curR, curP);
  }

  // Phase 1: Build Leonardo forest
  const treeOrders = [];

  for (let i = 0; i < n; i++) {
    const numTrees = treeOrders.length;
    let isMerged = false;

    if (numTrees >= 2 && treeOrders[numTrees - 2] === treeOrders[numTrees - 1] + 1) {
      const newOrder = treeOrders[numTrees - 2] + 1;
      treeOrders.pop();
      treeOrders.pop();
      treeOrders.push(newOrder);
      isMerged = true;
    } else if (numTrees >= 1 && treeOrders[numTrees - 1] === 1) {
      treeOrders.push(0);
    } else {
      treeOrders.push(1);
    }

    const curOrder = treeOrders[treeOrders.length - 1];
    if (isMerged) {
      sift(i, curOrder);
    }
    trinkle(i, curOrder, treeOrders);

    steps.push({
      type: 'heapify_inspect',
      indices: [i],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Added element ${arr[i]} into Leonardo tree forest (active roots: ${treeOrders.length}).`,
      comparisonsCount: comparisons,
      swapsCount: swaps
    });
  }

  // Phase 2: Deconstruct forest and extract sorted roots
  for (let i = n - 1; i >= 0; i--) {
    const p = treeOrders.pop();

    if (p >= 2) {
      const c2 = i - 1;
      const c1 = i - 1 - LP[p - 2];

      treeOrders.push(p - 1);
      trinkle(c1, p - 1, treeOrders);

      treeOrders.push(p - 2);
      trinkle(c2, p - 2, treeOrders);
    }

    sortedIndices.push(i);
    steps.push({
      type: 'sorted_element',
      indices: [i],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Element at index ${i} (${arr[i]}) settled in sorted position.`,
      comparisonsCount: comparisons,
      swapsCount: swaps
    });
  }

  steps.push({
    type: 'completed',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Smooth Sort complete! Leonardo trees unpacked in ${order === 'desc' ? 'descending' : 'ascending'} order.`,
    comparisonsCount: comparisons,
    swapsCount: swaps
  });

  return { steps, stats: { comparisons, swaps } };
}
