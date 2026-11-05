/**
 * Longest Common Subsequence (LCS) Step Generator
 * 
 * Generates immutable snapshot states for:
 * 1. String displays and DP matrix dimensions
 * 2. Base case initialization (row 0 and col 0 with zeros and explanation)
 * 3. Cell-by-cell recurrence calculation (match vs mismatch with highlighted referenced cells)
 * 4. Completed DP matrix
 * 5. Step-by-step backtracking path reconstruction
 * 6. Final LCS subsequence and explanation
 */

export function generateLcsSteps(rawS1, rawS2) {
  const steps = [];
  const s1 = String(rawS1 || 'ABCDGH').toUpperCase().trim() || 'A';
  const s2 = String(rawS2 || 'AEDFHR').toUpperCase().trim() || 'A';

  const m = s1.length;
  const n = s2.length;

  // Initialize DP table with nulls
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(null));

  // Step 1: Display both strings & initial empty matrix
  steps.push({
    type: 'init',
    s1,
    s2,
    dp: JSON.parse(JSON.stringify(dp)),
    activeCell: null,
    referencedCells: [],
    matchedCell: null,
    backtrackPath: [],
    lcsString: '',
    formulaText: 'DP matrix initialized with dimensions (m + 1) × (n + 1).',
    description: `Initialized DP table of size (${m + 1} × ${n + 1}) for String 1 "${s1}" (m=${m}) and String 2 "${s2}" (n=${n}).`
  });

  // Step 2: Initialize base cases (row 0 and column 0 = 0)
  for (let j = 0; j <= n; j++) {
    dp[0][j] = 0;
  }
  for (let i = 0; i <= m; i++) {
    dp[i][0] = 0;
  }

  steps.push({
    type: 'base_cases',
    s1,
    s2,
    dp: JSON.parse(JSON.stringify(dp)),
    activeCell: [0, 0],
    referencedCells: [],
    matchedCell: null,
    backtrackPath: [],
    lcsString: '',
    formulaText: 'Base Cases: DP[0][j] = 0 and DP[i][0] = 0 for all i, j.',
    description: 'Base Case Initialized: Row 0 and Column 0 filled with 0s because any string compared against an empty sequence (length 0) has an LCS of length 0.'
  });

  // Step 3: Fill DP table row by row
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const char1 = s1[i - 1];
      const char2 = s2[j - 1];
      const isMatch = char1 === char2;

      // Evaluation step
      if (isMatch) {
        const diagVal = dp[i - 1][j - 1];
        const calculatedVal = 1 + diagVal;
        dp[i][j] = calculatedVal;

        steps.push({
          type: 'cell_match',
          s1,
          s2,
          dp: JSON.parse(JSON.stringify(dp)),
          activeCell: [i, j],
          referencedCells: [[i - 1, j - 1]],
          matchedCell: [i, j],
          backtrackPath: [],
          lcsString: '',
          formulaText: `Match: S1[${i - 1}] ('${char1}') == S2[${j - 1}] ('${char2}')  ⟹  DP[${i}][${j}] = 1 + DP[${i - 1}][${j - 1}] = 1 + ${diagVal} = ${calculatedVal}`,
          description: `Characters Match at cell (${i}, ${j})! S1[${i - 1}] ('${char1}') == S2[${j - 1}] ('${char2}'). Recurrence applied: 1 + Diagonal DP[${i - 1}][${j - 1}] (${diagVal}) = ${calculatedVal}.`
        });
      } else {
        const topVal = dp[i - 1][j];
        const leftVal = dp[i][j - 1];
        const maxVal = Math.max(topVal, leftVal);
        dp[i][j] = maxVal;

        steps.push({
          type: 'cell_mismatch',
          s1,
          s2,
          dp: JSON.parse(JSON.stringify(dp)),
          activeCell: [i, j],
          referencedCells: [[i - 1, j], [i, j - 1]],
          matchedCell: null,
          backtrackPath: [],
          lcsString: '',
          formulaText: `Mismatch: S1[${i - 1}] ('${char1}') ≠ S2[${j - 1}] ('${char2}')  ⟹  DP[${i}][${j}] = max(Top: ${topVal}, Left: ${leftVal}) = ${maxVal}`,
          description: `Characters Mismatch at cell (${i}, ${j}): '${char1}' ≠ '${char2}'. Recurrence applied: max(Top DP[${i - 1}][${j}] = ${topVal}, Left DP[${i}][${j - 1}] = ${leftVal}) = ${maxVal}.`
        });
      }
    }
  }

  // Step 4: Table complete
  const finalLcsLen = dp[m][n];
  steps.push({
    type: 'table_complete',
    s1,
    s2,
    dp: JSON.parse(JSON.stringify(dp)),
    activeCell: [m, n],
    referencedCells: [],
    matchedCell: null,
    backtrackPath: [],
    lcsString: '',
    formulaText: `DP Matrix fully filled. Maximum LCS length is at DP[${m}][${n}] = ${finalLcsLen}.`,
    description: `DP Matrix complete! The length of the Longest Common Subsequence is ${finalLcsLen} (found at bottom-right cell DP[${m}][${n}]). Proceeding to Backtracking.`
  });

  // Step 5: Backtracking reconstruction
  let currI = m;
  let currJ = n;
  let backtrackPath = [[currI, currJ]];
  let accumulatedLcs = [];

  steps.push({
    type: 'backtrack_start',
    s1,
    s2,
    dp: JSON.parse(JSON.stringify(dp)),
    activeCell: [currI, currJ],
    referencedCells: [],
    matchedCell: null,
    backtrackPath: JSON.parse(JSON.stringify(backtrackPath)),
    lcsString: '',
    formulaText: `Starting backtrack from bottom-right cell (${currI}, ${currJ}).`,
    description: `Backtracking started from DP[${currI}][${currJ}] = ${dp[currI][currJ]}. Tracing backwards to reconstruct the exact LCS subsequence characters.`
  });

  while (currI > 0 && currJ > 0) {
    const char1 = s1[currI - 1];
    const char2 = s2[currJ - 1];

    if (char1 === char2) {
      accumulatedLcs.unshift(char1);
      currI--;
      currJ--;
      backtrackPath.push([currI, currJ]);

      steps.push({
        type: 'backtrack_match',
        s1,
        s2,
        dp: JSON.parse(JSON.stringify(dp)),
        activeCell: [currI, currJ],
        referencedCells: [],
        matchedCell: [currI + 1, currJ + 1],
        backtrackPath: JSON.parse(JSON.stringify(backtrackPath)),
        lcsString: accumulatedLcs.join(''),
        formulaText: `Match found ('${char1}')! Included in LCS. Moved diagonally to cell (${currI}, ${currJ}).`,
        description: `Backtrack: Character '${char1}' matched! Added to LCS. Moved diagonally to DP[${currI}][${currJ}]. Current LCS: "${accumulatedLcs.join('')}".`
      });
    } else if (dp[currI - 1][currJ] >= dp[currI][currJ - 1]) {
      // Move up (consistent tie-breaking rule: prefer top if equal)
      currI--;
      backtrackPath.push([currI, currJ]);

      steps.push({
        type: 'backtrack_move',
        s1,
        s2,
        dp: JSON.parse(JSON.stringify(dp)),
        activeCell: [currI, currJ],
        referencedCells: [],
        matchedCell: null,
        backtrackPath: JSON.parse(JSON.stringify(backtrackPath)),
        lcsString: accumulatedLcs.join(''),
        formulaText: `Top value (${dp[currI][currJ]}) >= Left value (${dp[currI + 1][currJ - 1]}). Moved Up.`,
        description: `Backtrack: '${char1}' ≠ '${char2}'. Top cell DP[${currI}][${currJ}] (${dp[currI][currJ]}) >= Left cell DP[${currI + 1}][${currJ - 1}] (${dp[currI + 1][currJ - 1]}). Moved UP to (${currI}, ${currJ}).`
      });
    } else {
      // Move left
      currJ--;
      backtrackPath.push([currI, currJ]);

      steps.push({
        type: 'backtrack_move',
        s1,
        s2,
        dp: JSON.parse(JSON.stringify(dp)),
        activeCell: [currI, currJ],
        referencedCells: [],
        matchedCell: null,
        backtrackPath: JSON.parse(JSON.stringify(backtrackPath)),
        lcsString: accumulatedLcs.join(''),
        formulaText: `Left value (${dp[currI][currJ]}) > Top value (${dp[currI][currJ + 1]}). Moved Left.`,
        description: `Backtrack: '${char1}' ≠ '${char2}'. Moved LEFT to (${currI}, ${currJ}).`
      });
    }
  }

  // Step 6: Complete
  const finalLcs = accumulatedLcs.join('');
  steps.push({
    type: 'complete',
    s1,
    s2,
    dp: JSON.parse(JSON.stringify(dp)),
    activeCell: null,
    referencedCells: [],
    matchedCell: null,
    backtrackPath: JSON.parse(JSON.stringify(backtrackPath)),
    lcsString: finalLcs,
    formulaText: `Completed! Longest Common Subsequence is "${finalLcs}" with length ${finalLcsLen}.`,
    description: `Optimal Solution Reconstructed! The Longest Common Subsequence is "${finalLcs}" of length ${finalLcsLen}. Backtracking path highlighted in emerald.`
  });

  return {
    steps,
    summary: {
      s1,
      s2,
      lcs: finalLcs,
      length: finalLcsLen,
      dpTable: dp,
      backtrackPath
    }
  };
}
