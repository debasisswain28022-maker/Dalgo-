# ⚡ Dalgo — Interactive Sorting Algorithm Visualizer & Learning Hub

An interactive, modern web application built with **React** and **Vite** designed to visualize, compare, and master key sorting algorithms step-by-step.

![Sorting Algorithm Visualizer](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)
![Deployment](https://img.shields.io/badge/Hosted%20On-GitHub%20Pages-22c55e?logo=github)

---

## ✨ Features

- 📊 **Step-by-Step Visualization**: Control speed, pause, step forward/backward, and customize array sizes in real-time.
- 📚 **Comprehensive Algorithm Guide**: Complete theoretical breakdowns, time/space complexities, pseudocode, and JavaScript implementations for 9 major sorting algorithms.
- ⚡ **Algorithm Comparison Tool**: Side-by-side performance benchmarks across different input distributions (Random, Nearly Sorted, Reversed).
- 🧠 **Interactive Quiz System**: Test your knowledge on algorithm trade-offs, stability, and complexity.
- 🎨 **Modern Dark Aesthetic**: Responsive layout with glowing bar visualizers and smooth animations.

---

## 🧮 Supported Algorithms

| Algorithm | Category | Best | Average | Worst | Space | Stable |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **Bubble Sort** | Beginner | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| **Selection Sort** | Beginner | O(n²) | O(n²) | O(n²) | O(1) | ❌ |
| **Insertion Sort** | Beginner | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| **Merge Sort** | Intermediate | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ |
| **Quick Sort** | Intermediate | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ |
| **Heap Sort** | Intermediate | O(n log n) | O(n log n) | O(n log n) | O(1) | ❌ |
| **Counting Sort** | Advanced | O(n + k) | O(n + k) | O(n + k) | O(n + k) | ✅ |
| **Radix Sort** | Advanced | O(d(n+b)) | O(d(n+b)) | O(d(n+b)) | O(n + b) | ✅ |
| **Bucket Sort** | Advanced | O(n + k) | O(n + k) | O(n²) | O(n + k) | ✅ |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/sorting-algorithm-visualizer.git

# Navigate to project directory
cd sorting-algorithm-visualizer

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 📦 Deployment

This repository includes a GitHub Actions workflow that automatically deploys the app to **GitHub Pages** whenever code is pushed to the `main` branch.

To enable GitHub Pages:
1. Go to repository **Settings** -> **Pages**.
2. Set **Source** to **GitHub Actions**.
