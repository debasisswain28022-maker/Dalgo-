# ⚡ Dalgo — Interactive Algorithm Visualizer & Learning Hub

An interactive, modern web application built with **React 19** and **Vite** designed to visualize, explore, and master key Computer Science algorithms step-by-step. Dalgo features **10 Sorting Algorithms** and **4 Greedy & Dynamic Programming Algorithms**, complete with live step controls, pictorial diagrams, synchronized pseudocode execution, multi-language code snippets (C, C++, Java, Python, JavaScript), and an interactive knowledge quiz.

![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite 6](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)
![Algorithms](https://img.shields.io/badge/Algorithms-14%20Total-indigo)
![Deployment](https://img.shields.io/badge/Hosted%20On-GitHub%20Pages-22c55e?logo=github)
[![Live Site](https://img.shields.io/badge/🌐%20Live%20Site-Visit%20Dalgo-6366f1?style=flat-square)](https://debasisswain28022-maker.github.io/Dalgo-/)

---

## 🌐 Live Demo

Experience the full interactive application online:

> **[https://debasisswain28022-maker.github.io/Dalgo-/](https://debasisswain28022-maker.github.io/Dalgo-/)**

---

## ✨ Key Features

### 1. 📊 Interactive Visualizations
- **Full Playback Controls:** Start, Play, Pause, Step Forward, Step Backward, and Reset on every visualizer.
- **Adjustable Speed Multipliers:** Fine-tune simulation delays from 0.5× up to 4×.
- **Keyboard Shortcuts:**
  - <kbd>Space</kbd> : Toggle Play / Pause
  - <kbd>→</kbd> : Step Forward
  - <kbd>←</kbd> : Step Backward
  - <kbd>R</kbd> : Reset Visualization to initial state

### 2. 💎 Greedy Algorithms & Dynamic Programming Hub
- **Fractional Knapsack (Greedy):**
  - Interactive item configuration (weight, value, capacity) with preset test suites.
  - Live value-to-weight ratio calculations ($v / w$) and step-by-step ratio sorting.
  - Item warehouse status cards (`Evaluating`, `100% Taken`, `Partial Fraction`, `Rejected`).
  - Physical container bucket stacking from the bottom floor up, with diagonal hazard stripes on fractional slices.
  - Real-time remaining capacity and accumulated profit counters.
- **Huffman Coding (Greedy):**
  - Text input compression mode and custom character frequency mode.
  - Min-Priority Queue step-by-step extraction and greedy combination animations.
  - Crisp SVG binary tree visualization with branch `0` (left) and `1` (right) badges.
  - Dynamic prefix code generation table, original vs compressed bit count, and compression ratio.
  - Live interactive binary bitstream decoder (type 0/1 bits to decode text in real-time).
- **Activity Selection (Greedy):**
  - Input activities with customizable start and finish times.
  - Sort by earliest finishing time ($f_i$) animation.
  - Interactive horizontal timeline chart with zero-offset time ticks and finish marker sweep line.
  - Clear visual distinction between selected compatible activities (green) and overlapping conflicts (red).
- **Longest Common Subsequence - LCS (Dynamic Programming):**
  - Compare any two strings with custom input fields.
  - 2D dynamic programming table with base-case zeros initialization.
  - Live mathematical recurrence callout highlighting matching cells ($1 + DP[i-1][j-1]$) vs mismatch maximums ($\max(DP[i-1][j], DP[i][j-1])$).
  - Animated backtracking path from $(m, n)$ back to $(0, 0)$ reconstructing the optimal subsequence.

### 3. 🔢 10 Sorting Algorithm Visualizers
- **Supported Sorting Algorithms:** Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Heap Sort, Counting Sort, Radix Sort, Bucket Sort, and Shell Sort.
- **Custom Array Presets:** Random, Nearly Sorted, Reversed, Few Unique, or custom comma-separated inputs.
- **Dedicated Sub-Visualizers:**
  - *Heap Sort:* Complete binary tree array-to-tree visual mapping with heapify node swapping.
  - *Quick Sort:* Dynamic pivot tracking and partitioning bounds.
  - *Merge Sort:* Auxiliary array splitting and merging levels.
- **Synthesized Audio:** Real-time Web Audio API frequency tones corresponding to bar values during comparisons and swaps.

### 4. 📚 Educational Execution & Pseudocode Panels
- **Synchronized Execution Panel:** Highlights the exact line of pseudocode executing at the current step.
- **Multi-Language Reference Implementations:** Complete, syntax-highlighted code in **C**, **C++**, **Java**, **Python**, and **JavaScript** for every algorithm.
- **Mathematical Foundations:** Formal time & space complexity proofs, recurrence relations, and algorithmic trade-offs.

### 5. ⚡ Side-by-Side Algorithm Comparison Tool
- Run multiple sorting algorithms simultaneously on identical datasets to visually evaluate performance differences between $O(n^2)$ and $O(n \log n)$ algorithms.

### 6. 🧠 Interactive Algorithm Knowledge Quiz
- **21 Challenging Questions** divided into categories:
  - *Sorting Algorithms (10 questions):* Stability, pivot selection, heap properties, worst-case bounds.
  - *Greedy & Dynamic Programming (11 questions):* Greedy choice property, prefix codes, interval compatibility, 2D DP recurrence.
- Instant feedback with detailed theoretical explanations for every option.

---

## 🧮 Algorithm Complexity Reference

### 1. Sorting Algorithms (10)

| Algorithm | Category | Best | Average | Worst | Auxiliary Space | Stable | In-Place |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Bubble Sort** | Beginner | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | ✅ | ✅ |
| **Selection Sort** | Beginner | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | ❌ | ✅ |
| **Insertion Sort** | Beginner | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | ✅ | ✅ |
| **Merge Sort** | Intermediate | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ | ✅ | ❌ |
| **Quick Sort** | Intermediate | $O(n \log n)$ | $O(n \log n)$ | $O(n^2)$ | $O(\log n)$ | ❌ | ✅ |
| **Heap Sort** | Intermediate | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(1)$ | ❌ | ✅ |
| **Counting Sort** | Advanced | $O(n + k)$ | $O(n + k)$ | $O(n + k)$ | $O(n + k)$ | ✅ | ❌ |
| **Radix Sort** | Advanced | $O(d(n + b))$ | $O(d(n + b))$ | $O(d(n + b))$ | $O(n + b)$ | ✅ | ❌ |
| **Bucket Sort** | Advanced | $O(n + k)$ | $O(n + k)$ | $O(n^2)$ | $O(n + k)$ | ✅ | ❌ |
| **Shell Sort** | Intermediate | $O(n \log n)$ | $O(n^{4/3})$ | $O(n^{3/2})$ | $O(1)$ | ❌ | ✅ |

### 2. Greedy Algorithms & Dynamic Programming (4)

| Algorithm | Paradigm | Greedy Strategy / DP Recurrence | Time Complexity | Space Complexity | Core Principle |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Fractional Knapsack** | Greedy | Decreasing Value/Weight Ratio ($v_i / w_i$) | $O(n \log n)$ | $O(1)$ | Takes full or partial items; ratio greediness guarantees global optimality. |
| **Huffman Coding** | Greedy | Repeatedly combine two lowest frequency nodes via Min-Heap | $O(n \log n)$ | $O(n)$ | Variable-length prefix codes; frequent characters receive shorter binary codes. |
| **Activity Selection** | Greedy | Earliest Finish Time ($f_i$) | $O(n \log n)$ | $O(1)$ | Leaves maximum remaining time for subsequent activities on a shared resource. |
| **Longest Common Subsequence** | Dynamic Programming | $DP[i][j] = 1 + DP[i-1][j-1]$ (match)<br>$\max(DP[i-1][j], DP[i][j-1])$ (mismatch) | $O(m \times n)$ | $O(m \times n)$ | Solves overlapping subproblems in a 2D matrix; backtracks optimal path to $(0,0)$. |

---

## 🏗️ Project Architecture

```
sorting_algorithm/
├── index.html
├── vite.config.js               # Vite config with relative asset base for GitHub Pages
├── package.json
├── src/
│   ├── App.jsx                  # Root router with React.lazy code-splitting
│   ├── index.css                # Global styles and themes
│   ├── algorithms/              # 10 Sorting algorithms step generators
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
│   ├── components/              # Shared sorting UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ArrayBars.jsx
│   │   ├── MergeSortVisualizer.jsx
│   │   ├── QuickSortVisualizer.jsx
│   │   ├── HeapSortVisualizer.jsx
│   │   ├── VisualizerControls.jsx
│   │   └── Quiz.jsx
│   ├── pages/                   # Application views
│   │   ├── Home.jsx
│   │   ├── Algorithms.jsx
│   │   ├── Visualizer.jsx
│   │   ├── Compare.jsx
│   │   ├── QuizPage.jsx
│   │   └── AlgorithmDetails.jsx
│   └── greedy-dp/               # Greedy & DP Module
│       ├── GreedyDPPage.jsx     # Category container and sub-navigator
│       ├── common/
│       │   ├── VisualizationControls.jsx   # Universal 6-button control bar
│       │   ├── AlgorithmExecutionPanel.jsx # Live pseudocode & step sync
│       │   └── EducationalSection.jsx      # Theory, proofs, multi-language code
│       ├── fractional-knapsack/
│       │   ├── logic.js
│       │   └── KnapsackVisualizer.jsx      # Bucket container & warehouse cards
│       ├── huffman-coding/
│       │   ├── logic.js
│       │   └── HuffmanVisualizer.jsx       # SVG binary tree & interactive decoder
│       ├── activity-selection/
│       │   ├── logic.js
│       │   └── ActivityVisualizer.jsx      # Horizontal timeline & sweep marker
│       ├── lcs/
│       │   ├── logic.js
│       │   └── LcsVisualizer.jsx           # 2D DP table & backtracking path
│       ├── data/
│       │   └── algorithmsData.js           # Multi-language code & math metadata
│       └── styles/
│           └── greedy-dp.css               # Dedicated styles & layout utilities
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `pnpm`

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/debasisswain28022-maker/Dalgo-.git

# 2. Navigate to project directory
cd Dalgo-

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📦 Building & Deployment

### Build for Production
```bash
npm run build
```
Vite will compile and code-split the application into optimized chunks inside the `dist/` folder.

### Deploy to GitHub Pages
The project uses the `gh-pages` package:
```bash
npm run deploy
```
This automatically runs `npm run build` and publishes the production `dist/` directory directly to the `gh-pages` branch.
