# DAlgo — Project Module Documentation

> A complete reference for every file in the project, what it does, and how every module connects to the others.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Build](#2-tech-stack--build)
3. [Directory Structure](#3-directory-structure)
4. [Entry Points](#4-entry-points)
5. [Pages (Route Views)](#5-pages-route-views)
6. [Components](#6-components)
7. [Algorithm Engine](#7-algorithm-engine)
8. [Data Layer](#8-data-layer)
9. [Utilities](#9-utilities)
10. [Styling](#10-styling)
11. [Module Connection Map](#11-module-connection-map)
12. [Data Flow Diagrams](#12-data-flow-diagrams)
13. [Step Object Formats](#13-step-object-formats)
14. [Key Design Decisions](#14-key-design-decisions)

---

## 1. Project Overview

**DAlgo** is a React + Vite single-page application for interactively visualizing, learning, and comparing 10 sorting algorithms. It uses a **custom client-side router** built with React `useState` — there is no URL routing library (no React Router). Navigation state is held at the `App` level and passed down as props.

Hosted on GitHub Pages at the base path `/Dalgo-/`.

---

## 2. Tech Stack & Build

| Tool | Version | Role |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8.x | Build tool & dev server |
| Lucide React | — | Icon library |
| Vanilla CSS | — | All styling (no Tailwind) |
| Web Audio API | Browser native | Pitch tones during animation |

**Build Config** — `vite.config.js`

```js
base: '/Dalgo-/'   // GitHub Pages deployment base path
```

---

## 3. Directory Structure

```
sorting_algorithm/
├── src/
│   ├── main.jsx                  <- React DOM entry point
│   ├── App.jsx                   <- Root component + client-side router
│   ├── index.css                 <- Global design system (all CSS, 97KB)
│   ├── App.css                   <- App-level layout overrides
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Algorithms.jsx
│   │   ├── AlgorithmDetails.jsx
│   │   ├── Visualizer.jsx
│   │   ├── Compare.jsx
│   │   └── QuizPage.jsx
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ThemeToggle.jsx
│   │   ├── ArrayBars.jsx
│   │   ├── AlgorithmCard.jsx
│   │   ├── ComplexityTable.jsx
│   │   ├── CodeViewer.jsx
│   │   ├── Quiz.jsx
│   │   ├── VisualizerControls.jsx
│   │   ├── StepActionPanel.jsx
│   │   ├── PseudocodeHighlight.jsx
│   │   ├── VisualizerErrorBoundary.jsx
│   │   ├── MergeSortVisualizer.jsx
│   │   ├── QuickSortVisualizer.jsx
│   │   ├── HeapSortVisualizer.jsx
│   │   └── HeapTreeView.jsx
│   ├── algorithms/
│   │   ├── index.js
│   │   ├── bubbleSort.js
│   │   ├── selectionSort.js
│   │   ├── insertionSort.js
│   │   ├── mergeSort.js
│   │   ├── quickSort.js
│   │   ├── heapSort.js
│   │   ├── countingSort.js
│   │   ├── radixSort.js
│   │   ├── bucketSort.js
│   │   └── shellSort.js
│   ├── data/
│   │   ├── algorithms.js
│   │   └── quizQuestions.js
│   └── utils/
│       └── audio.js
├── vite.config.js
├── package.json
├── README.md
└── working.md
```

---

## 4. Entry Points

### `src/main.jsx`
Bootstraps React. Renders `<App />` inside `StrictMode` into `#root`.

### `src/App.jsx`
Root component and client-side router. Holds two global state values:

| State | Type | Purpose |
|---|---|---|
| `activeTab` | string | Active page: `'home'`, `'algorithms'`, `'visualizer'`, `'compare'`, `'quiz'`, `'algorithm-details'` |
| `selectedAlgoId` | string | Active algorithm ID (e.g. `'merge-sort'`) |

Always renders `<Navbar>` + one conditional page + `<Footer>`.

Navigation pattern: components call `onNavigate(tabId)` and/or `onSelectAlgorithm(algoId)` (passed as props) to change the active view.

---

## 5. Pages (Route Views)

### `Home.jsx` — Tab: `'home'`
Landing page. Hero section with CTA buttons, live algorithm animation preview (auto-looping `ArrayBars` via `setInterval`), "Why Visualize?" features grid, and algorithm category showcase grid.

**Props:** `onNavigate`, `onSelectAlgorithm`
**Key imports:** `ALGORITHMS`, `ArrayBars`, `runSortingAlgorithm`

---

### `Algorithms.jsx` — Tab: `'algorithms'`
Browse/search all 10 algorithms in a card grid. Search bar filters by name, description, or technique. Category pills filter by Beginner / Intermediate / Advanced.

**Props:** `onNavigate`, `onSelectAlgorithm`
**Key imports:** `ALGORITHMS`, `AlgorithmCard`

---

### `AlgorithmDetails.jsx` — Tab: `'algorithm-details'`
Full detail page for the selected algorithm. Eight sections:

| Section | Content |
|---|---|
| A - Header | Name, category badge, stable/in-place tags |
| B - Definition | Full paragraph from `algo.definition` |
| C - How It Works | Numbered list from `algo.howItWorks[]` |
| D - Embedded Visualizer | Mini playback controls + visualization canvas |
| E - Implementation | CodeViewer (JS + Pseudocode tabs) |
| F - Complexity | Best / Average / Worst / Space cards |
| G - Pros & Cons | From `algo.advantages[]` and `algo.disadvantages[]` |
| H - Quick Quiz | `<Quiz filterAlgorithmId={algo.id} />` |

Embedded visualizer routing:

| Algorithm | Component |
|---|---|
| `heap-sort` | `HeapSortVisualizer` |
| `quick-sort` | `QuickSortVisualizer` |
| `merge-sort` | `MergeSortVisualizer` (uses `step.arraySnapshot`) |
| All others | `ArrayBars` (uses `step.array`) |

**Props:** `algorithmId`, `onNavigate`, `onSelectAlgorithm`

---

### `Visualizer.jsx` — Tab: `'visualizer'`
Full-screen interactive visualizer with complete playback controls.

State managed:

| State | Purpose |
|---|---|
| `arraySize` | Elements count (auto-capped per algorithm) |
| `speed` | Playback delay ms |
| `presetType` | Array shape: random / nearly-sorted / reversed / few-unique |
| `customInput` | Raw text from custom input field |
| `soundEnabled` | Web Audio toggle |
| `pivotStrategy` | Quick Sort pivot mode |
| `array` | Source array |
| `steps[]` | All pre-computed steps from generator |
| `currentStepIdx` | Pointer into steps[] |
| `isPlaying` | Auto-advance active |

Key behaviors:
- Steps recomputed on `[algoId, array, pivotStrategy]` change.
- Playback via chained `setTimeout` (not `setInterval`).
- Keyboard shortcuts: `Space` (play/pause), Arrow keys (step), `R` (reset).
- Size caps: Heap 15, Merge/Quick 20, others 80.
- `DEDICATED_VIS_ALGOS = {'heap-sort', 'quick-sort', 'merge-sort'}` — these use dedicated components with no right panel.
- Canvas wrapped in `VisualizerErrorBoundary`.

**Props:** `selectedAlgoId`, `onSelectAlgoId`

---

### `Compare.jsx` — Tab: `'compare'`
Runs up to 4 algorithms simultaneously on the same shared array.

Three page sections:
1. Algorithm selector pills + benchmark toolbar (Generate, Run, Reset, Size slider)
2. Benchmark grid — one card per algorithm with independent `ArrayBars` animation + stats
3. Technique & Use-Case matrix + full `ComplexityTable`

Runner state: `{ algoId: { steps[], currentIdx, isDone } }` — all advanced by one shared `setTimeout` loop.

**Merge Sort fix:** Merge Sort steps use `arraySnapshot` not `array`. `Compare.jsx` normalizes:
```js
const displayArray = currentFrame?.array ?? currentFrame?.arraySnapshot ?? sharedArray;
```
Also creates a `normalizedStep` that maps `activeRange` to `indices` for `ArrayBars` bar coloring.

**Props:** `onSelectAlgorithm`, `onNavigate`

---

### `QuizPage.jsx` — Tab: `'quiz'`
Wrapper page. Renders a header and `<Quiz />` with no filter (shows all questions).

**Props:** `onNavigate`

---

## 6. Components

### `Navbar.jsx`
Always-visible header. Desktop nav + mobile hamburger drawer. Inline search dropdown filters `ALGORITHMS` by name/category, navigates to `algorithm-details` on click. Embeds `ThemeToggle`.

**Props:** `activeTab`, `setActiveTab`, `onSelectAlgorithm`

---

### `Footer.jsx`
Site footer with branding, nav links, and algorithm category quick-links.

**Props:** `setActiveTab`

---

### `ThemeToggle.jsx`
Dark/light mode button. Toggles `dark` class on `<html>`. Reads/writes `localStorage` key `dalgo-theme`. Falls back to OS `prefers-color-scheme`.

---

### `ArrayBars.jsx`
Universal bar chart visualizer. Renders one colored vertical bar per array element.

Props: `array` (values), `currentStep` (step object), `showValues` (boolean)

Bar color determined by `step.type` and step fields:
- `step.indices[]` → primary colored bars
- `step.sortedIndices[]` → green sorted bars
- `step.pivotIdx`, `step.minIdx`, `step.leftPointer`, `step.rightPointer` → special positions

Color states: `status-default`, `status-compare`, `status-swap`, `status-sorted`, `status-active`, `status-pivot`, `status-min-element`, `status-key-element`, `status-pointer-left`, `status-pointer-right`

**Used by:** `Home`, `AlgorithmDetails`, `Visualizer`, `Compare`

---

### `AlgorithmCard.jsx`
Card for the Algorithms catalog grid. Shows name, category badge, description, complexities, stability, in-place tag. "Learn" and "Visualize" action buttons.

**Props:** `algorithm`, `onLearn(id)`, `onVisualize(id)`

---

### `ComplexityTable.jsx`
Full HTML table of all 10 algorithms. Columns: Algorithm, Category, Best/Avg/Worst Time, Space, Stable, In-Place, Visualize. Category filter pills.

**Props:** `onSelectAlgorithm(id)`, `onVisualizeAlgorithm(id)`
**Used by:** `Compare.jsx`

---

### `CodeViewer.jsx`
Tabbed panel showing JavaScript or Pseudocode for an algorithm. Copy-to-clipboard button.

**Props:** `pseudocode`, `javascriptCode`
**Used by:** `AlgorithmDetails.jsx`

---

### `Quiz.jsx`
Multiple-choice quiz engine. One question per screen, prev/next navigation, immediate feedback (correct/wrong highlight + explanation callout), final score screen, restart.

Optional `filterAlgorithmId` prop — restricts to questions tagged with that algorithm.

**Data:** `QUIZ_QUESTIONS` from `src/data/quizQuestions.js`
**Used by:** `QuizPage.jsx` (all), `AlgorithmDetails.jsx` (filtered)

---

### `VisualizerControls.jsx`
Full control panel for `Visualizer.jsx`. Provides: algorithm dropdown (grouped), generate array, play/pause, step backward/forward, reset, preset pills, speed slider, size slider (capped), audio toggle, custom array input form with validation.

**Props:** All playback state + callbacks from `Visualizer.jsx`

---

### `StepActionPanel.jsx`
Animated step information panel in the Visualizer right column. Shows:
- Colored type badge with icon (maps 40+ step types via `STEP_TYPE_META`)
- Progress bar and step counter
- Description text
- Inline compare/swap visual for index-based steps
- Gap badge (Shell Sort), Pass badge (Bubble Sort)
- Running comparisons/swaps stats

**Props:** `currentStep`, `currentStepIdx`, `totalSteps`, `algoName`
**Used by:** `Visualizer.jsx` (non-dedicated algorithms only)

---

### `PseudocodeHighlight.jsx`
Pseudocode panel with live line highlighting. Contains `PSEUDOCODE_MAP` — static map of `algoId → [{line, types[]}]` for all 10 algorithms. Each line lists which step types cause it to highlight.

Returns `null` for Merge/Quick/Heap Sort (they have inline pseudocode in their dedicated visualizers).

**Props:** `algoId`, `currentStep`
**Used by:** `Visualizer.jsx` (non-dedicated algorithms only)

---

### `VisualizerErrorBoundary.jsx`
React class `ErrorBoundary` wrapping the visualization canvas. Shows friendly error card with retry button on render crashes. Auto-resets state when `algoId` prop changes.

**Props:** `algoId`, `onReset`
**Used by:** `Visualizer.jsx`

---

### `MergeSortVisualizer.jsx`
Dedicated two-column dashboard for Merge Sort.

Left column:
- Recursive Divide Tree (recursive `RecursiveTreeNode` sub-component, color-coded by node status)
- Active Merge Workstation (Left array | VS comparison badge | Right array, Result array)

Right column:
- "What is happening?" explanation panel
- Main Array Snapshot with `activeRange` highlighted
- Inline pseudocode panel
- Statistics footer

Step fields consumed: `phase`, `treeStructure[]`, `leftArray[]`, `rightArray[]`, `resultArray[]`, `leftCompareIdx`, `rightCompareIdx`, `comparedValues`, `description`, `arraySnapshot`, `activeRange`, `comparisonsCount`, `movesCount`, `mergeLevel`, `totalDivideLevels`, `divideLevel`

**Props:** `currentStep`, `array` (pass `step.arraySnapshot`)
**Used by:** `Visualizer.jsx`, `AlgorithmDetails.jsx`

---

### `QuickSortVisualizer.jsx`
Dedicated visualizer for Quick Sort. Renders partition pointer (`i`, `j`) positions, pivot highlight, left/right partition zones, recursion tree, and inline pseudocode.

**Props:** `currentStep`, `pivotStrategy`, `onPivotStrategyChange`, `originalArray`
**Used by:** `Visualizer.jsx`, `AlgorithmDetails.jsx`

---

### `HeapSortVisualizer.jsx`
Dedicated visualizer for Heap Sort. Renders array bars + `HeapTreeView` binary tree side by side.

**Props:** `currentStep`, `originalArray`
**Used by:** `Visualizer.jsx`, `AlgorithmDetails.jsx`

---

### `HeapTreeView.jsx`
Binary heap tree diagram. Renders up to 4 depth levels (max 15 nodes). Node color states: `root`, `in-heap`, `sorted-out`, `active`, `swap`. Parent index: `floor((i-1)/2)`.

**Props:** `array`, `currentStep`
**Used by:** `HeapSortVisualizer.jsx`

---

## 7. Algorithm Engine

### `algorithms/index.js` — Central Registry

```js
export const algorithmGenerators = {
  'bubble-sort': generateBubbleSortSteps,
  'selection-sort': generateSelectionSortSteps,
  'insertion-sort': generateInsertionSortSteps,
  'merge-sort': generateMergeSortSteps,
  'quick-sort': generateQuickSortSteps,
  'heap-sort': generateHeapSortSteps,
  'counting-sort': generateCountingSortSteps,
  'radix-sort': generateRadixSortSteps,
  'bucket-sort': generateBucketSortSteps,
  'shell-sort': generateShellSortSteps
};

export function runSortingAlgorithm(id, array, options = {}) {
  // Special: Quick Sort needs pivotStrategy
  if (id === 'quick-sort') return generator(array, options.pivotStrategy || 'last');
  return generator(array);
  // Always returns: { steps: Step[], stats: { comparisons, swaps } }
}
```

### Individual Algorithm Files

All generators are pure functions that copy the input array and pre-compute ALL steps eagerly.

| File | Generator | Array field | Unique extra fields |
|---|---|---|---|
| `bubbleSort.js` | `generateBubbleSortSteps` | `array` | `sortedIndices[]`, `pass` |
| `selectionSort.js` | `generateSelectionSortSteps` | `array` | `minIdx`, `sortedIndices[]` |
| `insertionSort.js` | `generateInsertionSortSteps` | `array` | `keyVal`, `sortedIndices[]` |
| `shellSort.js` | `generateShellSortSteps` | `array` | `gap`, `sortedIndices[]` |
| `countingSort.js` | `generateCountingSortSteps` | `array` | `countArray[]`, `minOffset` |
| `radixSort.js` | `generateRadixSortSteps` | `array` | `digitPlace` |
| `bucketSort.js` | `generateBucketSortSteps` | `array` | `buckets[]` |
| `mergeSort.js` | `generateMergeSortSteps` | **`arraySnapshot`** | `treeStructure[]`, `leftArray[]`, `rightArray[]`, `resultArray[]`, `phase`, `activeRange[]`, `comparisonsCount`, `movesCount` |
| `quickSort.js` | `generateQuickSortSteps` | `array` | `pivotIdx`, `pivotVal`, `treeStructure[]`, `activeRange[]`, `comparisonsCount`, `swapsCount` |
| `heapSort.js` | `generateHeapSortSteps` | `array` | `heapSize`, `sortedIndices[]`, `comparisonsCount`, `swapsCount`, `codeLine` |

> **CRITICAL:** Merge Sort is the ONLY algorithm using `arraySnapshot` instead of `array` for its current array state. Every component rendering merge sort steps must handle this difference.

---

## 8. Data Layer

### `data/algorithms.js` — ALGORITHMS array

10 algorithm metadata objects. Each shape:

```js
{
  id: 'merge-sort',
  name: 'Merge Sort',
  category: 'Intermediate',  // 'Beginner' | 'Intermediate' | 'Advanced'
  tagline: '...',
  shortDescription: '...',
  definition: '...',
  howItWorks: ['...', '...'],
  complexity: { best, average, worst, space },
  stable: true,
  inPlace: false,
  technique: 'Divide and Conquer',
  bestUseCase: '...',
  pseudocode: `...`,
  javascriptCode: `...`,
  advantages: ['...'],
  disadvantages: ['...']
}
```

Consumed by: `Navbar`, `Home`, `Algorithms`, `AlgorithmDetails`, `Visualizer`, `Compare`, `ComplexityTable`, `VisualizerControls`

### `data/quizQuestions.js` — QUIZ_QUESTIONS array

~20 question objects:

```js
{
  id: 1,
  question: '...',
  options: ['A', 'B', 'C', 'D'],
  correctAnswer: 1,          // 0-indexed
  explanation: '...',
  algorithmId: 'quick-sort' // for per-algo filtering
}
```

Consumed by: `Quiz.jsx`

---

## 9. Utilities

### `utils/audio.js` — `playTone(val, minVal, maxVal, durationMs)`

Web Audio API pitch tone synthesizer. Singleton `AudioContext` (lazy init, handles browser autoplay policy). Maps element value to 200–850 Hz sine wave with smooth gain envelope (40ms default). Called by `Visualizer.jsx` on each step when `soundEnabled === true`.

---

## 10. Styling

### `index.css` (97 KB)
The complete design system. Contains:
- CSS custom properties: color tokens, spacing, radii, shadows, gradients
- Dark/light theme via `:root` and `.dark` on `<html>`
- Layout: `app-layout`, `main-content`, `vis-main-grid`, `benchmark-grid`, etc.
- All component CSS: bars, cards, buttons, badges, table, navbar, footer, quiz, dedicated visualizer panels
- Animation keyframes: `animate-pop`, `animate-pulse`, bar glow

### `App.css`
Small supplementary layout file.

---

## 11. Module Connection Map

```
main.jsx
  └── App.jsx  [state: activeTab, selectedAlgoId]
        ├── Navbar.jsx
        │     └── ThemeToggle.jsx
        │     (reads ALGORITHMS for search)
        │
        ├── Home.jsx
        │     ├── ArrayBars.jsx
        │     └── runSortingAlgorithm()  [from algorithms/index.js]
        │     (reads ALGORITHMS for category grid)
        │
        ├── Algorithms.jsx
        │     └── AlgorithmCard.jsx
        │     (reads ALGORITHMS)
        │
        ├── AlgorithmDetails.jsx
        │     ├── ArrayBars.jsx
        │     ├── CodeViewer.jsx
        │     ├── Quiz.jsx  [reads QUIZ_QUESTIONS]
        │     ├── MergeSortVisualizer.jsx
        │     │     └── RecursiveTreeNode (internal)
        │     ├── QuickSortVisualizer.jsx
        │     ├── HeapSortVisualizer.jsx
        │     │     └── HeapTreeView.jsx
        │     └── runSortingAlgorithm()
        │     (reads ALGORITHMS)
        │
        ├── Visualizer.jsx
        │     ├── VisualizerControls.jsx  [reads ALGORITHMS]
        │     ├── VisualizerErrorBoundary.jsx
        │     ├── ArrayBars.jsx
        │     ├── MergeSortVisualizer.jsx
        │     ├── QuickSortVisualizer.jsx
        │     ├── HeapSortVisualizer.jsx
        │     │     └── HeapTreeView.jsx
        │     ├── StepActionPanel.jsx
        │     ├── PseudocodeHighlight.jsx
        │     ├── runSortingAlgorithm()
        │     └── playTone()  [from utils/audio.js]
        │     (reads ALGORITHMS)
        │
        ├── Compare.jsx
        │     ├── ArrayBars.jsx
        │     ├── ComplexityTable.jsx  [reads ALGORITHMS]
        │     └── runSortingAlgorithm()
        │     (reads ALGORITHMS)
        │
        ├── QuizPage.jsx
        │     └── Quiz.jsx  [reads QUIZ_QUESTIONS]
        │
        └── Footer.jsx


Algorithm Engine (pure JS, no React dependencies):
  algorithms/index.js
        ├── bubbleSort.js
        ├── selectionSort.js
        ├── insertionSort.js
        ├── mergeSort.js     [DIFFERENT: arraySnapshot, not array]
        ├── quickSort.js
        ├── heapSort.js
        ├── countingSort.js
        ├── radixSort.js
        ├── bucketSort.js
        └── shellSort.js
```

---

## 12. Data Flow Diagrams

### A. Visualizer Playback

```
User picks algorithm & generates array
     |
     v
runSortingAlgorithm(algoId, array, options)
     |
     v
All steps[] pre-computed at once (eager)
     |
     v
State: steps[], currentStepIdx=0, isPlaying=false
     |
     v
User clicks Start -> isPlaying=true
     |
     v
setTimeout loop: currentStepIdx++ every `speed` ms
     |
     v
currentFrame = steps[currentStepIdx]
     |---> ArrayBars (array, currentStep) -> colored bars
     |---> StepActionPanel (currentStep) -> type badge + description
     |---> PseudocodeHighlight (algoId, currentStep) -> highlighted lines
     └---> playTone() if soundEnabled -> Web Audio pitch
```

### B. Compare Benchmark

```
User selects algorithms (2-4)
     |
     v
sharedArray generated (same for all)
     |
     v
For each algo: runSortingAlgorithm(id, sharedArray)
     |
     v
runnerState = { algoId: {steps[], currentIdx:0, isDone:false}, ... }
     |
     v
User clicks Run -> isComparing=true
     |
     v
Single setTimeout loop advances ALL runners simultaneously
  -> all isDone? -> isComparing=false
     |
     v
For each runner:
  displayArray = frame.array ?? frame.arraySnapshot ?? sharedArray
  normalizedStep = {indices from activeRange, type mapped} (Merge Sort shim)
     |
     v
ArrayBars renders independently per algorithm
```

### C. Navigation

```
User clicks button/link
     |
     v
onNavigate(tabId) -> App.setActiveTab
onSelectAlgorithm(algoId) -> App.setSelectedAlgoId
     |
     v
App re-renders -> correct page shown
```

---

## 13. Step Object Formats

### Standard (Bubble, Selection, Insertion, Shell, Counting, Radix, Bucket Sort)

```js
{
  type: 'compare' | 'swap' | 'shift' | 'sorted_element' | 'completed' | ...,
  indices: [i, j],              // Active indices
  array: [...],                 // Current array state  <-- 'array' key
  sortedIndices: [...],         // Fully sorted positions
  description: 'Comparing...',
  pass: 2,                      // Bubble Sort pass number
  gap: 4,                       // Shell Sort gap
  comparisonsCount: 12,
  swapsCount: 5
}
```

### Merge Sort (different keys!)

```js
{
  type: 'split' | 'base_case' | 'compare' | 'take_left' | 'take_right'
      | 'append_remaining' | 'merge_complete' | 'completed' | 'start_merge' | 'init',
  phase: 'DIVIDING' | 'BASE CASE' | 'MERGING' | 'COMPLETED',
  arraySnapshot: [...],         // Current array state  <-- NOT 'array'
  activeRange: [start, end],    // Active subarray range  <-- NOT 'indices'
  treeStructure: [{ id, level, indexInLevel, parentId, range, values, status, children }],
  leftArray: [...],
  rightArray: [...],
  resultArray: [...],
  leftCompareIdx: 0,
  rightCompareIdx: 2,
  comparedValues: { leftVal, rightVal, operator },
  description: '...',
  divideLevel: 2,
  mergeLevel: 1,
  totalDivideLevels: 3,
  comparisonsCount: 4,
  movesCount: 6
}
```

### Quick Sort

```js
{
  type: 'pivot_select' | 'compare' | 'swap' | 'swap_pivot' | 'partition_complete'
      | 'no_swap' | 'base_case_element' | 'completed' | ...,
  array: [...],
  sortedIndices: [...],
  pivotIdx: 4,
  pivotVal: 42,
  activeRange: [2, 8],
  pointerI: 3,
  pointerJ: 5,
  treeStructure: [...],
  description: '...',
  comparisonsCount: 8,
  swapsCount: 3
}
```

### Heap Sort

```js
{
  type: 'heapify_inspect' | 'heap_swap' | 'sorted_element' | 'build_heap_start'
      | 'max_heap_created' | 'extract_max_start' | 'completed' | ...,
  array: [...],
  sortedIndices: [...],
  heapSize: 9,
  activeParentIdx: 2,
  leftChildIdx: 5,
  rightChildIdx: 6,
  largestIdx: 5,
  codeLine: 3,
  description: '...',
  comparisonsCount: 7,
  swapsCount: 4,
  heapifyCount: 2
}
```

---

## 14. Key Design Decisions

### Client-Side State Router (No React Router)
`activeTab` state in `App.jsx` drives which page renders. Simple, zero-dependency. Trade-off: browser back/forward and deep links don't work. Chosen for GitHub Pages static hosting simplicity.

### Pre-Computed Steps (Eager Evaluation)
All animation steps computed once when the array changes. Stored as an array, replayed by advancing `currentStepIdx`. Benefits: instant backward stepping, no computation during playback. Cost: memory proportional to `arraySize × stepCount`.

### Merge Sort Field Name Divergence
Merge Sort uses `arraySnapshot` + `activeRange` instead of `array` + `indices` because merge sort operates on subarray regions conceptually rather than specific swapped index pairs. The dedicated `MergeSortVisualizer` is built for this format. `Compare.jsx` applies a normalization shim to bridge the gap for `ArrayBars`.

### Dedicated Visualizers
Merge Sort, Quick Sort, and Heap Sort have rich algorithm-specific UIs (divide trees, recursion trees, binary heap diagrams). They are identified in `DEDICATED_VIS_ALGOS` and bypass the generic side-panel layout entirely.

### Array Size Caps Per Algorithm

| Algorithm | Max Size | Reason |
|---|---|---|
| Heap Sort | 15 | Binary tree node legibility |
| Merge Sort | 20 | Divide tree diagram clarity |
| Quick Sort | 20 | Recursion tree / partition diagram clarity |
| All others | 80 | General frame rate performance |

### Theme System
`dark` CSS class on `<html>` switches all CSS custom properties. No JS color logic during rendering. Theme persists to `localStorage` under key `dalgo-theme`.

### Web Audio Synthesis
`AudioContext` created lazily on first use (browser autoplay policy compliance). Element value mapped linearly to 200–850 Hz sine wave. Errors silently swallowed — audio is non-critical.
