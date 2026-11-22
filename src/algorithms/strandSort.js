/**
 * Strand Sort Step Generator
 * Repeatedly extracts sorted sublists ("strands") from the unsorted sublist,
 * and merges them into the accumulated sorted output list.
 * 
 * @param {number[]} initialArray 
 * @param {Object} [options]
 * @param {'asc'|'desc'} [options.order='asc']
 * @returns {{ steps: Array, stats: { comparisons: number, swaps: number } }}
 */
export function generateStrandSortSteps(initialArray, options = {}) {
  const order = options.order || 'asc';
  let arr = [...initialArray];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let swaps = 0; // Represents item transfers/insertions
  const sortedIndices = [];

  const isOrderValid = (prev, next) => order === 'desc' ? prev >= next : prev <= next;

  steps.push({
    type: 'init',
    indices: [],
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: `Initial array before Strand Sort (${order === 'desc' ? 'Descending' : 'Ascending'}). Extracts sorted strands and merges them.`,
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

  let output = [];
  let remaining = [...initialArray];
  let strandPass = 0;

  while (remaining.length > 0) {
    strandPass++;
    
    // 1. Pull first item from remaining as head of the new strand
    const strand = [remaining.shift()];
    swaps++;

    steps.push({
      type: 'pass_start',
      indices: [output.length],
      array: [...output, ...strand, ...remaining],
      sortedIndices: [...Array.from({ length: output.length }, (_, k) => k)],
      description: `Strand Pass ${strandPass}: Pulled strand head (${strand[0]}). Finding further elements for this strand.`,
      comparisonsCount: comparisons,
      swapsCount: swaps,
      pass: strandPass
    });

    // 2. Scan remaining list to add compatible elements to strand
    let i = 0;
    while (i < remaining.length) {
      const candidate = remaining[i];
      const lastStrandItem = strand[strand.length - 1];
      comparisons++;

      steps.push({
        type: 'compare',
        indices: [output.length + strand.length - 1, output.length + strand.length + i],
        array: [...output, ...strand, ...remaining],
        sortedIndices: [...Array.from({ length: output.length }, (_, k) => k)],
        description: `Comparing strand tail (${lastStrandItem}) with remaining candidate (${candidate})`,
        comparisonsCount: comparisons,
        swapsCount: swaps,
        pass: strandPass
      });

      if (isOrderValid(lastStrandItem, candidate)) {
        strand.push(candidate);
        remaining.splice(i, 1);
        swaps++;

        steps.push({
          type: 'shift',
          indices: [output.length + strand.length - 1],
          array: [...output, ...strand, ...remaining],
          sortedIndices: [...Array.from({ length: output.length }, (_, k) => k)],
          description: `Element ${candidate} fits order! Extracted into current strand: [${strand.join(', ')}].`,
          comparisonsCount: comparisons,
          swapsCount: swaps,
          pass: strandPass
        });
      } else {
        i++;
      }
    }

    // 3. Merge extracted strand with accumulated output list
    const merged = [];
    let oIdx = 0;
    let sIdx = 0;

    while (oIdx < output.length && sIdx < strand.length) {
      comparisons++;
      const outVal = output[oIdx];
      const strandVal = strand[sIdx];

      steps.push({
        type: 'compare',
        indices: [oIdx, output.length + sIdx],
        array: [...merged, ...output.slice(oIdx), ...strand.slice(sIdx), ...remaining],
        sortedIndices: [...Array.from({ length: merged.length }, (_, k) => k)],
        description: `Merging strand into sorted output: comparing output element ${outVal} vs strand element ${strandVal}`,
        comparisonsCount: comparisons,
        swapsCount: swaps,
        pass: strandPass
      });

      if (isOrderValid(outVal, strandVal)) {
        merged.push(outVal);
        oIdx++;
      } else {
        merged.push(strandVal);
        sIdx++;
        swaps++;
      }
    }

    while (oIdx < output.length) {
      merged.push(output[oIdx++]);
    }
    while (sIdx < strand.length) {
      merged.push(strand[sIdx++]);
      swaps++;
    }

    output = merged;
    arr = [...output, ...remaining];

    steps.push({
      type: 'sorted_element',
      indices: Array.from({ length: output.length }, (_, k) => k),
      array: [...arr],
      sortedIndices: Array.from({ length: output.length }, (_, k) => k),
      description: `Merged strand. Sorted output prefix now has ${output.length} elements.`,
      comparisonsCount: comparisons,
      swapsCount: swaps,
      pass: strandPass
    });
  }

  for (let k = 0; k < n; k++) sortedIndices.push(k);

  steps.push({
    type: 'completed',
    indices: [],
    array: [...output],
    sortedIndices: [...sortedIndices],
    description: `Strand Sort complete! All strands extracted and merged into final ${order === 'desc' ? 'descending' : 'ascending'} order.`,
    comparisonsCount: comparisons,
    swapsCount: swaps,
    pass: strandPass
  });

  return { steps, stats: { comparisons, swaps } };
}
