import html2canvas from 'html2canvas';

/**
 * Triggers a download of a given blob or data URL in the user's browser.
 */
export function downloadFile(urlOrBlob, filename) {
  let url = urlOrBlob;
  let isBlob = false;

  if (urlOrBlob instanceof Blob) {
    url = URL.createObjectURL(urlOrBlob);
    isBlob = true;
  }

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (isBlob) {
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
}

/**
 * Recursively inlines computed styles from source node to target cloned node.
 */
function inlineAllComputedStyles(source, target) {
  if (source.nodeType !== Node.ELEMENT_NODE || target.nodeType !== Node.ELEMENT_NODE) return;

  const computed = window.getComputedStyle(source);
  let cssText = '';
  // Copy essential styling properties
  for (let i = 0; i < computed.length; i++) {
    const prop = computed[i];
    cssText += `${prop}:${computed.getPropertyValue(prop)};`;
  }
  target.style.cssText = cssText;

  const sourceChildren = source.children;
  const targetChildren = target.children;
  for (let i = 0; i < sourceChildren.length; i++) {
    if (targetChildren[i]) {
      inlineAllComputedStyles(sourceChildren[i], targetChildren[i]);
    }
  }
}

/**
 * Inlines CSS rules matching SVG elements into an SVG `<style>` tag
 * so that SVG exports display correctly in standalone viewers (Illustrator, Inkscape, browsers).
 */
function getSvgWithStyles(svgElement, title = 'DAlgo Visualization') {
  const clonedSvg = svgElement.cloneNode(true);
  
  // Set dimensions and viewBox
  const box = svgElement.getBoundingClientRect();
  const width = Math.round(box.width) || 740;
  const height = Math.round(box.height) || 360;

  clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  if (!clonedSvg.getAttribute('viewBox')) {
    clonedSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  }
  clonedSvg.setAttribute('width', width);
  clonedSvg.setAttribute('height', height);

  // Inset dark background rect
  const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bgRect.setAttribute('width', '100%');
  bgRect.setAttribute('height', '100%');
  bgRect.setAttribute('fill', '#090d16');
  clonedSvg.insertBefore(bgRect, clonedSvg.firstChild);

  // Add watermark / title banner
  const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  titleText.setAttribute('x', '20');
  titleText.setAttribute('y', '25');
  titleText.setAttribute('fill', '#818cf8');
  titleText.setAttribute('font-family', 'Inter, system-ui, sans-serif');
  titleText.setAttribute('font-size', '12');
  titleText.setAttribute('font-weight', '700');
  titleText.setAttribute('letter-spacing', '0.04em');
  titleText.textContent = `DAlgo • ${title}`;
  clonedSvg.appendChild(titleText);

  // Inline computed styles for all SVG children
  inlineAllComputedStyles(svgElement, clonedSvg);

  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(clonedSvg);
  
  if (!svgString.match(/^<\?xml/)) {
    svgString = '<?xml version="1.0" standalone="no"?>\r\n' + svgString;
  }
  return { svgString, width, height };
}

/**
 * Export an SVG or HTML element as an SVG file (.svg)
 */
export async function exportToSvg(element, filename = 'dalgo-diagram', title = 'DAlgo Visualization') {
  if (!element) return;

  // 1. If element itself is an SVG or contains an SVG
  const svgEl = element.tagName && element.tagName.toLowerCase() === 'svg'
    ? element
    : element.querySelector('svg');

  if (svgEl) {
    const { svgString } = getSvgWithStyles(svgEl, title);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    downloadFile(blob, `${filename}.svg`);
    return true;
  }

  // 2. For HTML elements (LCS table, Timeline, Knapsack container): wrap with foreignObject
  const box = element.getBoundingClientRect();
  const width = Math.max(600, Math.round(box.width) + 40);
  const height = Math.max(300, Math.round(box.height) + 60);

  const clone = element.cloneNode(true);
  inlineAllComputedStyles(element, clone);

  const serializer = new XMLSerializer();
  const htmlContent = serializer.serializeToString(clone);

  const svgDoc = `<?xml version="1.0" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#090d16" rx="8" />
  <text x="20" y="28" fill="#818cf8" font-family="Inter, system-ui, sans-serif" font-size="13" font-weight="700">DAlgo • ${title}</text>
  <foreignObject x="20" y="44" width="${width - 40}" height="${height - 54}">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color: #f1f5f9; font-family: Inter, system-ui, sans-serif;">
      ${htmlContent}
    </div>
  </foreignObject>
</svg>`;

  const blob = new Blob([svgDoc], { type: 'image/svg+xml;charset=utf-8' });
  downloadFile(blob, `${filename}.svg`);
  return true;
}

/**
 * Export an SVG or HTML element as a high-resolution PNG image (.png)
 */
export async function exportToPng(element, filename = 'dalgo-diagram', title = 'DAlgo Visualization') {
  if (!element) return;

  // 1. If element is an SVG (e.g. Huffman Tree)
  const isSvg = element.tagName && element.tagName.toLowerCase() === 'svg';
  const svgEl = isSvg ? element : element.querySelector('svg');

  if (isSvg || (svgEl && element.classList.contains('gdp-tree-svg-container'))) {
    const targetSvg = isSvg ? element : svgEl;
    const { svgString, width, height } = getSvgWithStyles(targetSvg, title);
    
    return new Promise((resolve, reject) => {
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        const scale = 2; // 2x Retina resolution
        const canvas = document.createElement('canvas');
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext('2d');

        // Dark background
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);

        canvas.toBlob((pngBlob) => {
          if (pngBlob) {
            downloadFile(pngBlob, `${filename}.png`);
            resolve(true);
          } else {
            reject(new Error('Canvas toBlob failed'));
          }
        }, 'image/png');
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        // Fallback to html2canvas if direct SVG loading triggers error
        html2canvas(element, {
          backgroundColor: '#090d16',
          scale: 2,
          logging: false,
          useCORS: true
        }).then((canvas) => {
          canvas.toBlob((pngBlob) => {
            downloadFile(pngBlob, `${filename}.png`);
            resolve(true);
          });
        }).catch(reject);
      };

      img.src = url;
    });
  }

  // 2. For HTML elements (LCS table, Knapsack Bucket, Activity Selection Timeline, Array Bars)
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#090d16',
      scale: 2, // 2x crisp resolution for slides & papers
      logging: false,
      useCORS: true,
      allowTaint: true
    });

    // Add optional banner overlay
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = canvas.width;
    finalCanvas.height = canvas.height + 60;
    const ctx = finalCanvas.getContext('2d');

    // Header background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

    // Title banner
    ctx.fillStyle = '#818cf8';
    ctx.font = 'bold 24px Inter, system-ui, sans-serif';
    ctx.fillText(`DAlgo • ${title}`, 30, 38);

    // Render snapshot
    ctx.drawImage(canvas, 0, 50);

    return new Promise((resolve) => {
      finalCanvas.toBlob((pngBlob) => {
        downloadFile(pngBlob, `${filename}.png`);
        resolve(true);
      }, 'image/png');
    });
  } catch (err) {
    console.error('Error generating PNG export:', err);
    throw err;
  }
}

