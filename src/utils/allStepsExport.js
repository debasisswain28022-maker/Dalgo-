import { downloadFile } from './diagramExport.js';

/**
 * Escapes special XML/SVG characters.
 */
function escapeXml(unsafe) {
  if (unsafe === null || unsafe === undefined) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Helper to determine bar color based on step state.
 */
function getSortingBarState(index, step) {
  if (!step) {
    return { fill: '#3b82f6', stroke: '#60a5fa', text: '#ffffff', label: 'default' };
  }

  const { type, indices, sortedIndices, pivotIdx, minIdx, leftPointer, rightPointer } = step;

  // Fully sorted
  if (sortedIndices && sortedIndices.includes(index)) {
    return { fill: '#10b981', stroke: '#34d399', text: '#ffffff', label: 'sorted' };
  }

  // Pivot index
  if (pivotIdx === index || (type === 'pivot_select' && indices && indices.includes(index))) {
    return { fill: '#8b5cf6', stroke: '#a78bfa', text: '#ffffff', label: 'pivot' };
  }

  // Min index
  if (minIdx === index || (type === 'new_min' && indices && indices.includes(index))) {
    return { fill: '#f97316', stroke: '#fb923c', text: '#ffffff', label: 'min' };
  }

  // Active indices
  if (indices && indices.includes(index)) {
    if (type === 'swap' || type === 'heap_swap' || type === 'swap_pivot') {
      return { fill: '#ef4444', stroke: '#f87171', text: '#ffffff', label: 'swap' };
    }
    if (type === 'compare' || type === 'heapify_inspect') {
      return { fill: '#f59e0b', stroke: '#fbbf24', text: '#ffffff', label: 'compare' };
    }
    if (type === 'shift' || type === 'overwrite' || type === 'insert' || type === 'place_output') {
      return { fill: '#0284c7', stroke: '#38bdf8', text: '#ffffff', label: 'active' };
    }
    if (type === 'pick_key') {
      return { fill: '#06b6d4', stroke: '#22d3ee', text: '#ffffff', label: 'key' };
    }
    return { fill: '#0284c7', stroke: '#38bdf8', text: '#ffffff', label: 'active' };
  }

  if (index === leftPointer || index === rightPointer) {
    return { fill: '#6366f1', stroke: '#818cf8', text: '#ffffff', label: 'pointer' };
  }

  return { fill: '#3b82f6', stroke: '#60a5fa', text: '#ffffff', label: 'default' };
}

/**
 * Returns badge styling for step category.
 */
function getStepTypeBadge(type) {
  switch (type) {
    case 'compare':
    case 'heapify_inspect':
      return { text: 'COMPARE', bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', color: '#fbbf24' };
    case 'swap':
    case 'heap_swap':
    case 'swap_pivot':
      return { text: 'SWAP', bg: 'rgba(239, 68, 68, 0.18)', border: '#ef4444', color: '#f87171' };
    case 'pivot_select':
      return { text: 'PIVOT SELECTED', bg: 'rgba(139, 92, 246, 0.2)', border: '#8b5cf6', color: '#c084fc' };
    case 'shift':
    case 'overwrite':
    case 'insert':
    case 'place_output':
      return { text: 'WRITE / SHIFT', bg: 'rgba(2, 132, 199, 0.2)', border: '#0284c7', color: '#38bdf8' };
    case 'new_min':
      return { text: 'NEW MINIMUM', bg: 'rgba(249, 115, 22, 0.2)', border: '#f97316', color: '#fb923c' };
    case 'pick_key':
      return { text: 'KEY SELECTED', bg: 'rgba(6, 182, 212, 0.2)', border: '#06b6d4', color: '#22d3ee' };
    case 'sorted':
    case 'complete':
      return { text: 'SORTED / COMPLETE', bg: 'rgba(16, 185, 129, 0.2)', border: '#10b981', color: '#34d399' };
    default:
      return { text: 'STEP ACTION', bg: 'rgba(99, 102, 241, 0.15)', border: '#6366f1', color: '#a5b4fc' };
  }
}

/**
 * Generates an SVG string containing ALL steps needed to sort the array,
 * laid out in chronological order like on the website.
 */
export function generateAllSortingStepsSvg({
  algoName = 'Sorting Algorithm',
  algoData = null,
  initialArray = [],
  steps = []
}) {
  const stepsToRender = steps.length > 0 ? steps : [{
    array: initialArray,
    description: 'Initial array state',
    type: 'initial'
  }];

  const width = 1040;
  const cardWidth = 980;
  const cardX = 30;
  const cardHeight = 186;
  const cardGap = 16;
  const headerHeight = 170;
  const legendHeight = 110;
  const totalSteps = stepsToRender.length;

  const totalHeight = headerHeight + totalSteps * (cardHeight + cardGap) + legendHeight;

  // Compute global max and min for scaling
  const sampleArr = stepsToRender[0].array || stepsToRender[0].arraySnapshot || initialArray;
  const maxVal = Math.max(...sampleArr, 1);
  const minVal = Math.min(...sampleArr, 0);

  let cardsSvg = '';

  for (let idx = 0; idx < totalSteps; idx++) {
    const step = stepsToRender[idx];
    const currentArr = step.array || step.arraySnapshot || initialArray;
    const cardY = headerHeight + idx * (cardHeight + cardGap);
    const badge = getStepTypeBadge(step.type);
    const badgeWidth = Math.max(80, badge.text.length * 8.5 + 24);

    // Render bars for this step
    const L = currentArr.length;
    const containerInnerW = 920;
    const barWidth = Math.min(48, Math.max(12, Math.floor((containerInnerW - (L - 1) * 6) / L)));
    const totalBarsW = L * barWidth + (L - 1) * 6;
    const startX = cardX + 16 + (containerInnerW - totalBarsW) / 2;
    const baselineY = cardY + 74 + 78;

    let barsContent = '';
    for (let bIdx = 0; bIdx < L; bIdx++) {
      const val = currentArr[bIdx];
      const barX = startX + bIdx * (barWidth + 6);
      const barH = Math.max(12, Math.round(((val - minVal) / Math.max(maxVal - minVal, 1)) * 54));
      const barY = baselineY - barH;
      const status = getSortingBarState(bIdx, step);

      barsContent += `
        <!-- Bar ${bIdx} -->
        <text x="${barX + barWidth / 2}" y="${barY - 5}" text-anchor="middle" fill="#e2e8f0" font-family="'Fira Code', monospace" font-size="11" font-weight="700">${val}</text>
        <rect x="${barX}" y="${barY}" width="${barWidth}" height="${barH}" rx="4" fill="${status.fill}" stroke="${status.stroke}" stroke-width="1.5" />
        <text x="${barX + barWidth / 2}" y="${baselineY + 14}" text-anchor="middle" fill="#64748b" font-family="'Fira Code', monospace" font-size="10">${bIdx}</text>
      `;
    }

    cardsSvg += `
      <!-- Step ${idx + 1} Card -->
      <g id="step-${idx + 1}">
        <rect x="${cardX}" y="${cardY}" width="${cardWidth}" height="${cardHeight}" rx="10" fill="#0b1120" stroke="#1e293b" stroke-width="1.5" />
        
        <!-- Step Indicator Pill -->
        <rect x="${cardX + 16}" y="${cardY + 16}" width="112" height="26" rx="6" fill="#1e1b4b" stroke="#4338ca" stroke-width="1"/>
        <text x="${cardX + 72}" y="${cardY + 33}" text-anchor="middle" fill="#a5b4fc" font-family="Inter, system-ui, sans-serif" font-size="12" font-weight="700">Step ${idx + 1} / ${totalSteps}</text>

        <!-- Step Type Badge -->
        <rect x="${cardX + 136}" y="${cardY + 16}" width="${badgeWidth}" height="26" rx="6" fill="${badge.bg}" stroke="${badge.border}" stroke-width="1"/>
        <text x="${cardX + 136 + badgeWidth / 2}" y="${cardY + 33}" text-anchor="middle" fill="${badge.color}" font-family="Inter, system-ui, sans-serif" font-size="11" font-weight="800" letter-spacing="0.04em">${badge.text}</text>

        <!-- Step Description -->
        <text x="${cardX + 16}" y="${cardY + 60}" fill="#cbd5e1" font-family="Inter, system-ui, sans-serif" font-size="13" font-weight="500">${escapeXml(step.description || 'Sorting in progress...')}</text>

        <!-- Array Bars Stage Slot -->
        <rect x="${cardX + 16}" y="${cardY + 74}" width="${containerInnerW}" height="96" rx="8" fill="#030712" stroke="rgba(255,255,255,0.06)" />
        ${barsContent}
      </g>
    `;
  }

  // Header SVG
  const complexityInfo = algoData?.complexity
    ? `Best: ${algoData.complexity.best || '—'}  •  Average: ${algoData.complexity.average || '—'}  •  Space: ${algoData.complexity.space || '—'}`
    : `Total Elements: ${initialArray.length}  •  Execution Steps: ${totalSteps}`;

  const svgDocument = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${totalHeight}" viewBox="0 0 ${width} ${totalHeight}">
  <defs>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>

  <!-- Canvas Background -->
  <rect width="100%" height="100%" fill="#030712" />

  <!-- Main Header Banner -->
  <g id="header">
    <rect x="${cardX}" y="24" width="${cardWidth}" height="122" rx="12" fill="url(#headerGrad)" stroke="#312e81" stroke-width="1.5" />
    <text x="${cardX + 24}" y="56" fill="#818cf8" font-family="Inter, system-ui, sans-serif" font-size="13" font-weight="800" letter-spacing="0.08em">DALGO • COMPLETE ALGORITHM EXECUTION TRACE</text>
    <text x="${cardX + 24}" y="88" fill="#ffffff" font-family="Inter, system-ui, sans-serif" font-size="24" font-weight="800">${escapeXml(algoName)} — Step-by-Step Visualization Storyboard</text>
    <text x="${cardX + 24}" y="118" fill="#94a3b8" font-family="Inter, system-ui, sans-serif" font-size="13" font-weight="600">${escapeXml(complexityInfo)}  •  Total Steps: ${totalSteps}</text>
  </g>

  <!-- All Steps Cards Container -->
  ${cardsSvg}

  <!-- Footer Legend & Watermark -->
  <g id="footer" transform="translate(0, ${totalHeight - legendHeight})">
    <rect x="${cardX}" y="16" width="${cardWidth}" height="76" rx="10" fill="#0b1120" stroke="#1e293b" />
    <text x="${cardX + 20}" y="42" fill="#94a3b8" font-family="Inter, system-ui, sans-serif" font-size="12" font-weight="700">COLOR LEGEND:</text>
    
    <!-- Legend items -->
    <rect x="${cardX + 130}" y="32" width="14" height="14" rx="3" fill="#3b82f6"/>
    <text x="${cardX + 150}" y="44" fill="#cbd5e1" font-family="Inter, system-ui, sans-serif" font-size="12">Default</text>

    <rect x="${cardX + 230}" y="32" width="14" height="14" rx="3" fill="#f59e0b"/>
    <text x="${cardX + 250}" y="44" fill="#cbd5e1" font-family="Inter, system-ui, sans-serif" font-size="12">Comparing</text>

    <rect x="${cardX + 350}" y="32" width="14" height="14" rx="3" fill="#ef4444"/>
    <text x="${cardX + 370}" y="44" fill="#cbd5e1" font-family="Inter, system-ui, sans-serif" font-size="12">Swapping</text>

    <rect x="${cardX + 460}" y="32" width="14" height="14" rx="3" fill="#8b5cf6"/>
    <text x="${cardX + 480}" y="44" fill="#cbd5e1" font-family="Inter, system-ui, sans-serif" font-size="12">Pivot</text>

    <rect x="${cardX + 540}" y="32" width="14" height="14" rx="3" fill="#10b981"/>
    <text x="${cardX + 560}" y="44" fill="#cbd5e1" font-family="Inter, system-ui, sans-serif" font-size="12">Sorted</text>

    <text x="${cardX + cardWidth - 20}" y="58" text-anchor="end" fill="#64748b" font-family="Inter, system-ui, sans-serif" font-size="11">DAlgo Interactive Visualizer • Generated on ${new Date().toLocaleDateString()}</text>
  </g>
</svg>`;

  return { svgString: svgDocument, width, height: totalHeight };
}

/**
 * Exports all sorting steps as an SVG vector file (.svg)
 */
export async function exportAllSortingStepsSvg(options) {
  const { svgString } = generateAllSortingStepsSvg(options);
  const algoId = (options.algoName || 'sorting').toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${algoId}_all_steps_storyboard.svg`;
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  downloadFile(blob, filename);
  return filename;
}

/**
 * Exports all sorting steps as a high-resolution PNG image (.png)
 */
export async function exportAllSortingStepsPng(options) {
  const { svgString, width, height } = generateAllSortingStepsSvg(options);
  const algoId = (options.algoName || 'sorting').toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${algoId}_all_steps_storyboard.png`;

  return new Promise((resolve, reject) => {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      // Determine safe canvas scale based on total height
      const maxCanvasH = 16000;
      const scale = height > 6000 ? Math.min(1.2, maxCanvasH / height) : 1.5;

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      canvas.toBlob((pngBlob) => {
        if (pngBlob) {
          downloadFile(pngBlob, filename);
          resolve(filename);
        } else {
          reject(new Error('Failed to generate PNG blob from canvas.'));
        }
      }, 'image/png');
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    img.src = url;
  });
}

/**
 * Generates an SVG storyboard for Greedy & Dynamic Programming steps.
 */
export function generateAllGreedyDpStepsSvg({
  algoId,
  algoName = 'Algorithm',
  sampleName = '',
  steps = []
}) {
  const width = 1040;
  const cardWidth = 980;
  const cardX = 30;
  const headerHeight = 160;
  const legendHeight = 90;
  const cardHeight = algoId === 'longest-common-subsequence' ? 240 : 200;
  const cardGap = 16;
  const totalSteps = steps.length;
  const totalHeight = headerHeight + totalSteps * (cardHeight + cardGap) + legendHeight;

  let cardsSvg = '';

  for (let idx = 0; idx < totalSteps; idx++) {
    const step = steps[idx];
    const cardY = headerHeight + idx * (cardHeight + cardGap);
    const badge = getStepTypeBadge(step.type);
    const badgeWidth = Math.max(90, badge.text.length * 8 + 24);

    let visualContent = '';

    if (algoId === 'fractional-knapsack') {
      const items = step.items || [];
      const remaining = step.remainingCapacity !== undefined ? step.remainingCapacity.toFixed(1) : '—';
      const profit = step.totalProfit !== undefined ? step.totalProfit.toFixed(1) : '0';
      const weight = step.totalWeight !== undefined ? step.totalWeight.toFixed(1) : '0';

      let itemsChips = '';
      const chipW = Math.min(180, Math.floor(620 / Math.max(1, items.length)));
      items.forEach((it, i) => {
        const isFull = it.status === 'full';
        const isPartial = it.status === 'partial';
        const isRejected = it.status === 'rejected';
        const fillCol = isFull ? '#064e3b' : isPartial ? '#78350f' : isRejected ? '#4c0519' : '#1e293b';
        const strokeCol = isFull ? '#10b981' : isPartial ? '#f59e0b' : isRejected ? '#f43f5e' : '#475569';
        const statusText = isFull ? '100% Taken' : isPartial ? `${(it.fraction * 100).toFixed(0)}% Fraction` : isRejected ? '0% Rejected' : 'Waiting';

        itemsChips += `
          <g transform="translate(${cardX + 24 + i * (chipW + 8)}, ${cardY + 86})">
            <rect width="${chipW}" height="76" rx="6" fill="${fillCol}" stroke="${strokeCol}" stroke-width="1.2" />
            <text x="8" y="20" fill="#f8fafc" font-family="Inter, sans-serif" font-size="12" font-weight="700">${escapeXml(it.name || it.id)}</text>
            <text x="8" y="38" fill="#94a3b8" font-family="'Fira Code', monospace" font-size="10">${it.weight}kg • $${it.value}</text>
            <text x="8" y="54" fill="#38bdf8" font-family="'Fira Code', monospace" font-size="10">Ratio: ${(it.value / it.weight).toFixed(2)}/kg</text>
            <text x="8" y="68" fill="${strokeCol}" font-family="Inter, sans-serif" font-size="9" font-weight="700">${statusText}</text>
          </g>
        `;
      });

      visualContent = `
        <!-- Items Shelf -->
        ${itemsChips}
        <!-- Knapsack Metrics Box -->
        <g transform="translate(${cardX + 680}, ${cardY + 86})">
          <rect width="254" height="76" rx="6" fill="#030712" stroke="#334155" />
          <text x="14" y="24" fill="#a5b4fc" font-family="Inter, sans-serif" font-size="11" font-weight="700">KNAPSACK STATUS</text>
          <text x="14" y="44" fill="#e2e8f0" font-family="'Fira Code', monospace" font-size="11">Profit: <tspan fill="#34d399" font-weight="bold">$${profit}</tspan> | W: ${weight}kg</text>
          <text x="14" y="62" fill="#38bdf8" font-family="'Fira Code', monospace" font-size="11">Remaining: ${remaining}kg</text>
        </g>
      `;
    } else if (algoId === 'activity-selection') {
      const activities = step.activities || [];
      const busyUntil = step.currentFinishTime || 0;
      let actChips = '';
      const actW = Math.min(130, Math.floor(700 / Math.max(1, activities.length)));

      activities.forEach((act, i) => {
        const isSel = act.status === 'selected';
        const isRej = act.status === 'rejected';
        const isActive = step.activeIdx === i;
        const fillCol = isSel ? '#064e3b' : isRej ? '#4c0519' : isActive ? '#78350f' : '#1e293b';
        const strokeCol = isSel ? '#10b981' : isRej ? '#f43f5e' : isActive ? '#f59e0b' : '#475569';
        const statusText = isSel ? '✓ Selected' : isRej ? '✗ Rejected' : isActive ? '⚡ Testing' : 'Pending';

        actChips += `
          <g transform="translate(${cardX + 24 + i * (actW + 8)}, ${cardY + 86})">
            <rect width="${actW}" height="76" rx="6" fill="${fillCol}" stroke="${strokeCol}" stroke-width="1.2" />
            <text x="8" y="22" fill="#f8fafc" font-family="Inter, sans-serif" font-size="12" font-weight="700">${escapeXml(act.name)}</text>
            <text x="8" y="42" fill="#94a3b8" font-family="'Fira Code', monospace" font-size="11">[${act.start} ➔ ${act.finish}]</text>
            <text x="8" y="62" fill="${strokeCol}" font-family="Inter, sans-serif" font-size="10" font-weight="700">${statusText}</text>
          </g>
        `;
      });

      visualContent = `
        ${actChips}
        <g transform="translate(${cardX + 750}, ${cardY + 86})">
          <rect width="184" height="76" rx="6" fill="#030712" stroke="#334155" />
          <text x="14" y="24" fill="#a5b4fc" font-family="Inter, sans-serif" font-size="11" font-weight="700">RESOURCE STATUS</text>
          <text x="14" y="48" fill="#38bdf8" font-family="'Fira Code', monospace" font-size="12">Busy Until: t = ${busyUntil}</text>
          <text x="14" y="66" fill="#34d399" font-family="'Fira Code', monospace" font-size="11">Compatible: ${(step.selectedList || []).length}</text>
        </g>
      `;
    } else if (algoId === 'huffman-coding') {
      const pq = step.priorityQueue || [];
      let pqCards = '';
      const cardW = Math.min(100, Math.floor(700 / Math.max(1, pq.length)));

      pq.slice(0, 7).forEach((node, i) => {
        const isActive = step.activeNodeIds && step.activeNodeIds.includes(node.id);
        const fillCol = isActive ? '#78350f' : node.isLeaf ? '#064e3b' : '#31104b';
        const strokeCol = isActive ? '#f59e0b' : node.isLeaf ? '#10b981' : '#a855f7';

        pqCards += `
          <g transform="translate(${cardX + 24 + i * (cardW + 8)}, ${cardY + 86})">
            <rect width="${cardW}" height="76" rx="6" fill="${fillCol}" stroke="${strokeCol}" stroke-width="1.2" />
            <text x="8" y="20" fill="#94a3b8" font-family="'Fira Code', monospace" font-size="10">#${i + 1}</text>
            <text x="${cardW / 2}" y="42" text-anchor="middle" fill="#ffffff" font-family="Inter, sans-serif" font-size="16" font-weight="800">${node.isLeaf ? (node.char === ' ' ? '␣' : node.char) : 'Node'}</text>
            <text x="${cardW / 2}" y="62" text-anchor="middle" fill="#38bdf8" font-family="'Fira Code', monospace" font-size="12" font-weight="700">f:${node.freq}</text>
          </g>
        `;
      });

      visualContent = `
        ${pqCards}
        <g transform="translate(${cardX + 750}, ${cardY + 86})">
          <rect width="184" height="76" rx="6" fill="#030712" stroke="#334155" />
          <text x="14" y="24" fill="#a5b4fc" font-family="Inter, sans-serif" font-size="11" font-weight="700">COMPRESSION STATS</text>
          <text x="14" y="46" fill="#38bdf8" font-family="'Fira Code', monospace" font-size="11">Bits: ${step.compressedBits || '...'} / ${step.originalBits || '...'}</text>
          <text x="14" y="64" fill="#34d399" font-family="'Fira Code', monospace" font-size="11">Ratio: ${step.compressionRatio || '0'}%</text>
        </g>
      `;
    } else if (algoId === 'longest-common-subsequence') {
      const dp = step.dp || [];
      const rows = dp.length;
      const cols = rows > 0 ? dp[0].length : 0;
      let gridSvg = '';
      const cellW = Math.min(36, Math.floor(640 / Math.max(1, cols)));
      const cellH = Math.min(28, Math.floor(110 / Math.max(1, rows)));

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const val = dp[r][c];
          const isActive = step.activeCell && step.activeCell[0] === r && step.activeCell[1] === c;
          const isPath = step.backtrackPath && step.backtrackPath.some(([pr, pc]) => pr === r && pc === c);
          const isMatch = step.matchedCell && step.matchedCell[0] === r && step.matchedCell[1] === c;
          
          let cellFill = '#0f172a';
          let cellStroke = '#334155';
          if (isPath) { cellFill = '#059669'; cellStroke = '#34d399'; }
          else if (isActive) { cellFill = '#4338ca'; cellStroke = '#818cf8'; }
          else if (isMatch) { cellFill = '#065f46'; cellStroke = '#10b981'; }

          gridSvg += `
            <rect x="${cardX + 24 + c * cellW}" y="${cardY + 86 + r * cellH}" width="${cellW - 2}" height="${cellH - 2}" rx="3" fill="${cellFill}" stroke="${cellStroke}" />
            <text x="${cardX + 24 + c * cellW + cellW / 2}" y="${cardY + 86 + r * cellH + cellH / 2 + 4}" text-anchor="middle" fill="#f8fafc" font-family="'Fira Code', monospace" font-size="10" font-weight="700">${val !== null ? val : '·'}</text>
          `;
        }
      }

      visualContent = `
        <g>${gridSvg}</g>
        <g transform="translate(${cardX + 680}, ${cardY + 86})">
          <rect width="254" height="116" rx="6" fill="#030712" stroke="#334155" />
          <text x="14" y="24" fill="#a5b4fc" font-family="Inter, sans-serif" font-size="11" font-weight="700">DP RECURRENCE FORMULA</text>
          <text x="14" y="48" fill="#e2e8f0" font-family="'Fira Code', monospace" font-size="10">${escapeXml(step.formulaText || 'Base case initialization')}</text>
          <text x="14" y="74" fill="#38bdf8" font-family="'Fira Code', monospace" font-size="11">Reconstructed LCS:</text>
          <text x="14" y="98" fill="#34d399" font-family="'Fira Code', monospace" font-size="14" font-weight="800">${escapeXml(step.lcsString || 'In progress...')}</text>
        </g>
      `;
    }

    cardsSvg += `
      <!-- Step ${idx + 1} Card -->
      <g id="step-${idx + 1}">
        <rect x="${cardX}" y="${cardY}" width="${cardWidth}" height="${cardHeight}" rx="10" fill="#0b1120" stroke="#1e293b" stroke-width="1.5" />
        
        <!-- Step Pill -->
        <rect x="${cardX + 16}" y="${cardY + 16}" width="112" height="26" rx="6" fill="#1e1b4b" stroke="#4338ca" stroke-width="1"/>
        <text x="${cardX + 72}" y="${cardY + 33}" text-anchor="middle" fill="#a5b4fc" font-family="Inter, system-ui, sans-serif" font-size="12" font-weight="700">Step ${idx + 1} / ${totalSteps}</text>

        <!-- Type Badge -->
        <rect x="${cardX + 136}" y="${cardY + 16}" width="${badgeWidth}" height="26" rx="6" fill="${badge.bg}" stroke="${badge.border}" stroke-width="1"/>
        <text x="${cardX + 136 + badgeWidth / 2}" y="${cardY + 33}" text-anchor="middle" fill="${badge.color}" font-family="Inter, system-ui, sans-serif" font-size="11" font-weight="800" letter-spacing="0.04em">${badge.text}</text>

        <!-- Description -->
        <text x="${cardX + 16}" y="${cardY + 62}" fill="#cbd5e1" font-family="Inter, system-ui, sans-serif" font-size="13" font-weight="500">${escapeXml(step.description || 'Executing optimization step...')}</text>

        ${visualContent}
      </g>
    `;
  }

  const svgDocument = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${totalHeight}" viewBox="0 0 ${width} ${totalHeight}">
  <defs>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="#030712" />

  <!-- Header -->
  <g id="header">
    <rect x="${cardX}" y="24" width="${cardWidth}" height="122" rx="12" fill="url(#headerGrad)" stroke="#312e81" stroke-width="1.5" />
    <text x="${cardX + 24}" y="56" fill="#818cf8" font-family="Inter, system-ui, sans-serif" font-size="13" font-weight="800" letter-spacing="0.08em">DALGO • GREEDY & DYNAMIC PROGRAMMING EXECUTION TRACE</text>
    <text x="${cardX + 24}" y="88" fill="#ffffff" font-family="Inter, system-ui, sans-serif" font-size="24" font-weight="800">${escapeXml(algoName)} — Step-by-Step Visualization Storyboard</text>
    <text x="${cardX + 24}" y="118" fill="#94a3b8" font-family="Inter, system-ui, sans-serif" font-size="13" font-weight="600">Sample: ${escapeXml(sampleName)}  •  Total Steps: ${totalSteps}</text>
  </g>

  <!-- All Steps Cards -->
  ${cardsSvg}

  <!-- Footer Legend -->
  <g id="footer" transform="translate(0, ${totalHeight - legendHeight})">
    <rect x="${cardX}" y="14" width="${cardWidth}" height="60" rx="10" fill="#0b1120" stroke="#1e293b" />
    <text x="${cardX + 20}" y="48" fill="#818cf8" font-family="Inter, system-ui, sans-serif" font-size="12" font-weight="700">DAlgo Interactive Visualizer</text>
    <text x="${cardX + cardWidth - 20}" y="48" text-anchor="end" fill="#64748b" font-family="Inter, system-ui, sans-serif" font-size="11">All ${totalSteps} Steps in Chronological Order • Generated on ${new Date().toLocaleDateString()}</text>
  </g>
</svg>`;

  return { svgString: svgDocument, width, height: totalHeight };
}

/**
 * Exports all Greedy/DP steps as an SVG vector file (.svg)
 */
export async function exportAllGreedyDpStepsSvg(options) {
  const { svgString } = generateAllGreedyDpStepsSvg(options);
  const cleanId = (options.algoId || 'greedy_dp').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${cleanId}_all_steps_storyboard.svg`;
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  downloadFile(blob, filename);
  return filename;
}

/**
 * Exports all Greedy/DP steps as a high-resolution PNG image (.png)
 */
export async function exportAllGreedyDpStepsPng(options) {
  const { svgString, width, height } = generateAllGreedyDpStepsSvg(options);
  const cleanId = (options.algoId || 'greedy_dp').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${cleanId}_all_steps_storyboard.png`;

  return new Promise((resolve, reject) => {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      const maxCanvasH = 16000;
      const scale = height > 6000 ? Math.min(1.2, maxCanvasH / height) : 1.5;

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      canvas.toBlob((pngBlob) => {
        if (pngBlob) {
          downloadFile(pngBlob, filename);
          resolve(filename);
        } else {
          reject(new Error('Failed to generate PNG blob from canvas.'));
        }
      }, 'image/png');
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    img.src = url;
  });
}

