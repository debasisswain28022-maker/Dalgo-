/**
 * Huffman Coding Step Generator & Tree Utilities
 * 
 * Generates immutable snapshot states for:
 * 1. Frequency calculation
 * 2. Leaf node creation
 * 3. Min-priority queue initialization
 * 4. Iterative greedy combination of two smallest nodes
 * 5. Complete binary tree generation with 0/1 edge labels
 * 6. Code assignment & text encoding
 * 7. Compression statistics and decoding
 */

let nextNodeId = 1;

export function createNode(char, freq, left = null, right = null) {
  return {
    id: `node_${nextNodeId++}`,
    char: char, // null for internal nodes
    freq: Number(freq),
    left: left,
    right: right,
    code: '',
    isLeaf: left === null && right === null
  };
}

// Deterministic comparator for min-priority queue
export function compareNodes(a, b) {
  if (a.freq !== b.freq) {
    return a.freq - b.freq;
  }
  // Tie-breaker: character order, then node ID
  const charA = a.char || a.id;
  const charB = b.char || b.id;
  return charA.localeCompare(charB);
}

// Traverse tree to generate prefix codes
export function assignCodes(node, currentCode = '', codesMap = {}) {
  if (!node) return codesMap;
  node.code = currentCode || (node.isLeaf ? '0' : '');
  if (node.isLeaf) {
    codesMap[node.char] = node.code;
    return codesMap;
  }
  if (node.left) assignCodes(node.left, currentCode + '0', codesMap);
  if (node.right) assignCodes(node.right, currentCode + '1', codesMap);
  return codesMap;
}

// Compute tree layout coordinates (x: 0..100, y: depth) for SVG rendering
export function layoutTree(root) {
  if (!root) return null;

  function countLeaves(node) {
    if (!node) return 0;
    if (node.isLeaf) return 1;
    return countLeaves(node.left) + countLeaves(node.right);
  }

  function assignPositions(node, depth = 0, leftBoundary = 0, width = 100) {
    if (!node) return;
    const leaves = countLeaves(node);
    node.depth = depth;
    node.y = 40 + depth * 65;

    if (node.isLeaf) {
      node.x = leftBoundary + width / 2;
    } else {
      const leftLeaves = countLeaves(node.left) || 1;
      const leftWidth = (leftLeaves / leaves) * width;
      const rightWidth = width - leftWidth;

      assignPositions(node.left, depth + 1, leftBoundary, leftWidth);
      assignPositions(node.right, depth + 1, leftBoundary + leftWidth, rightWidth);

      const leftX = node.left ? node.left.x : leftBoundary;
      const rightX = node.right ? node.right.x : leftBoundary + width;
      node.x = (leftX + rightX) / 2;
    }
  }

  assignPositions(root, 0, 5, 90);
  return root;
}

export function generateHuffmanSteps(inputSource, isTextMode = true) {
  nextNodeId = 1;
  const steps = [];

  let frequencies = [];
  let originalText = '';

  if (isTextMode) {
    originalText = String(inputSource || 'HUFFMAN');
    if (!originalText.trim()) originalText = 'HUFFMAN';
    const counts = {};
    for (const ch of originalText) {
      counts[ch] = (counts[ch] || 0) + 1;
    }
    frequencies = Object.keys(counts).map((char) => ({
      char,
      freq: counts[char]
    }));
  } else {
    // Array of { char, freq }
    frequencies = (inputSource || []).map((item) => ({
      char: String(item.char || 'A'),
      freq: Math.max(1, Number(item.freq) || 1)
    }));
    originalText = frequencies.map((f) => f.char.repeat(Math.min(5, f.freq))).join('');
  }

  // Edge case: single character
  if (frequencies.length === 1) {
    const single = frequencies[0];
    const leaf = createNode(single.char, single.freq);
    leaf.code = '0';
    layoutTree(leaf);

    const codes = { [single.char]: '0' };
    const encoded = originalText.split('').map((c) => codes[c] || '0').join('');
    const origBits = originalText.length * 8;
    const compBits = encoded.length;
    const ratio = origBits > 0 ? Number(((1 - compBits / origBits) * 100).toFixed(1)) : 0;

    steps.push({
      type: 'complete',
      frequencies,
      priorityQueue: [leaf],
      activeNodeIds: [],
      root: leaf,
      codes,
      originalText,
      encodedText: encoded,
      originalBits: origBits,
      compressedBits: compBits,
      compressionRatio: ratio,
      description: `Single unique character '${single.char}'. Assigned single-bit Huffman code '0'.`
    });

    return { steps, root: leaf, codes, encodedText: encoded };
  }

  // Step 1: Initial frequency count
  steps.push({
    type: 'calc_freq',
    frequencies: JSON.parse(JSON.stringify(frequencies)),
    priorityQueue: [],
    activeNodeIds: [],
    root: null,
    codes: {},
    originalText,
    encodedText: '',
    originalBits: originalText.length * 8,
    compressedBits: 0,
    compressionRatio: 0,
    description: `Analyzed character frequencies for ${frequencies.length} unique symbols.`
  });

  // Step 2: Create leaf nodes
  let nodes = frequencies.map((item) => createNode(item.char, item.freq));

  steps.push({
    type: 'create_leaves',
    frequencies: JSON.parse(JSON.stringify(frequencies)),
    priorityQueue: JSON.parse(JSON.stringify(nodes)),
    activeNodeIds: nodes.map((n) => n.id),
    root: null,
    codes: {},
    originalText,
    encodedText: '',
    originalBits: originalText.length * 8,
    compressedBits: 0,
    compressionRatio: 0,
    description: `Created initial ${nodes.length} leaf tree nodes for each character.`
  });

  // Step 3: Build Min-Priority Queue (sorted by frequency ascending)
  nodes.sort(compareNodes);

  steps.push({
    type: 'build_pq',
    frequencies: JSON.parse(JSON.stringify(frequencies)),
    priorityQueue: JSON.parse(JSON.stringify(nodes)),
    activeNodeIds: [],
    root: null,
    codes: {},
    originalText,
    encodedText: '',
    originalBits: originalText.length * 8,
    compressedBits: 0,
    compressionRatio: 0,
    description: `Populated Min-Priority Queue sorted by frequency ascending (${nodes.map((n) => `${n.char}:${n.freq}`).join(', ')}).`
  });

  // Step 4: Iterative Greedy Merging
  let pq = [...nodes];
  let mergeRound = 1;

  while (pq.length > 1) {
    // Extract first minimum (left child)
    const min1 = pq.shift();

    steps.push({
      type: 'extract_min1',
      frequencies: JSON.parse(JSON.stringify(frequencies)),
      priorityQueue: JSON.parse(JSON.stringify(pq)),
      activeNodeIds: [min1.id],
      root: null,
      codes: {},
      originalText,
      encodedText: '',
      originalBits: originalText.length * 8,
      compressedBits: 0,
      description: `[Round ${mergeRound}] Extracted 1st minimum node: '${min1.char || min1.id}' with frequency ${min1.freq}.`
    });

    // Extract second minimum (right child)
    const min2 = pq.shift();

    steps.push({
      type: 'extract_min2',
      frequencies: JSON.parse(JSON.stringify(frequencies)),
      priorityQueue: JSON.parse(JSON.stringify(pq)),
      activeNodeIds: [min1.id, min2.id],
      root: null,
      codes: {},
      originalText,
      encodedText: '',
      originalBits: originalText.length * 8,
      compressedBits: 0,
      description: `[Round ${mergeRound}] Extracted 2nd minimum node: '${min2.char || min2.id}' with frequency ${min2.freq}.`
    });

    // Create new parent node
    const parentFreq = min1.freq + min2.freq;
    const parent = createNode(null, parentFreq, min1, min2);

    steps.push({
      type: 'merge_nodes',
      frequencies: JSON.parse(JSON.stringify(frequencies)),
      priorityQueue: JSON.parse(JSON.stringify(pq)),
      activeNodeIds: [parent.id, min1.id, min2.id],
      root: null,
      codes: {},
      originalText,
      encodedText: '',
      originalBits: originalText.length * 8,
      compressedBits: 0,
      description: `[Round ${mergeRound}] Combined nodes (${min1.freq} + ${min2.freq} = ${parentFreq}). Left branch = '0', Right branch = '1'.`
    });

    // Insert parent back into priority queue maintaining sorted order
    pq.push(parent);
    pq.sort(compareNodes);

    steps.push({
      type: 'insert_pq',
      frequencies: JSON.parse(JSON.stringify(frequencies)),
      priorityQueue: JSON.parse(JSON.stringify(pq)),
      activeNodeIds: [parent.id],
      root: null,
      codes: {},
      originalText,
      encodedText: '',
      originalBits: originalText.length * 8,
      compressedBits: 0,
      description: `[Round ${mergeRound}] Inserted combined parent node (${parentFreq}) back into Priority Queue.`
    });

    mergeRound++;
  }

  // The last remaining node is the root
  const root = pq[0];
  const codes = {};
  assignCodes(root, '', codes);
  layoutTree(root);

  // Step 5: Tree Complete
  steps.push({
    type: 'tree_complete',
    frequencies: JSON.parse(JSON.stringify(frequencies)),
    priorityQueue: JSON.parse(JSON.stringify(pq)),
    activeNodeIds: [root.id],
    root: JSON.parse(JSON.stringify(root)),
    codes: JSON.parse(JSON.stringify(codes)),
    originalText,
    encodedText: '',
    originalBits: originalText.length * 8,
    compressedBits: 0,
    description: `Huffman Tree construction complete! Root frequency = ${root.freq}. Traversed branches to assign binary codes.`
  });

  // Step 6: Text Encoding & Statistics
  let encodedText = '';
  let compressedBits = 0;
  for (const ch of originalText) {
    const code = codes[ch] || '';
    encodedText += code;
    compressedBits += code.length;
  }

  const originalBits = originalText.length * 8; // standard 8-bit ASCII assumption
  const compressionRatio = originalBits > 0 ? Number(((1 - compressedBits / originalBits) * 100).toFixed(1)) : 0;

  steps.push({
    type: 'complete',
    frequencies: JSON.parse(JSON.stringify(frequencies)),
    priorityQueue: JSON.parse(JSON.stringify(pq)),
    activeNodeIds: [],
    root: JSON.parse(JSON.stringify(root)),
    codes: JSON.parse(JSON.stringify(codes)),
    originalText,
    encodedText,
    originalBits,
    compressedBits,
    compressionRatio,
    description: `Encoding Complete! Original: ${originalBits} bits (8-bit ASCII), Compressed: ${compressedBits} bits. Space saved: ${compressionRatio}%.`
  });

  return {
    steps,
    root,
    codes,
    encodedText,
    summary: {
      originalBits,
      compressedBits,
      compressionRatio
    }
  };
}

// Interactive bitstream decoder: decodes a binary string using root
export function decodeHuffman(binaryString, root) {
  if (!root || !binaryString) return '';
  let result = '';
  let curr = root;

  // Single node edge case
  if (root.isLeaf) {
    return root.char.repeat(binaryString.length);
  }

  for (let i = 0; i < binaryString.length; i++) {
    const bit = binaryString[i];
    if (bit === '0') {
      curr = curr.left || curr;
    } else if (bit === '1') {
      curr = curr.right || curr;
    }

    if (curr && curr.isLeaf) {
      result += curr.char;
      curr = root; // Reset to root for next character
    }
  }

  return result;
}
