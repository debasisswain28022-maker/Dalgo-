import React from 'react';
import { BarChart3, Code2, Heart, Sparkles } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-col brand-col">
          <div className="footer-brand" onClick={() => setActiveTab('home')}>
            <BarChart3 className="footer-logo-icon" />
            <span className="footer-brand-title">D<span className="gradient-text">Algo</span></span>
          </div>
          <p className="footer-desc">
            DAlgo is an interactive educational platform built for computer science students to explore and master sorting algorithms through step-by-step animations.
          </p>
          <div className="tech-pills">
            <span className="pill">React.js</span>
            <span className="pill">Vite</span>
            <span className="pill">Web Audio</span>
            <span className="pill">CSS3 Glassmorphism</span>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Navigation</h4>
          <ul className="footer-links">
            <li><button onClick={() => setActiveTab('home')}>Home</button></li>
            <li><button onClick={() => setActiveTab('algorithms')}>Algorithms Catalog</button></li>
            <li><button onClick={() => setActiveTab('visualizer')}>Interactive Visualizer</button></li>
            <li><button onClick={() => setActiveTab('compare')}>Compare Matrix</button></li>
            <li><button onClick={() => setActiveTab('quiz')}>Practice Quiz</button></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Algorithms</h4>
          <ul className="footer-links">
            <li><button onClick={() => setActiveTab('algorithms')}>Bubble Sort</button></li>
            <li><button onClick={() => setActiveTab('algorithms')}>Selection & Insertion</button></li>
            <li><button onClick={() => setActiveTab('algorithms')}>Merge & Quick Sort</button></li>
            <li><button onClick={() => setActiveTab('algorithms')}>Heap Sort & Tree View</button></li>
            <li><button onClick={() => setActiveTab('algorithms')}>Counting, Radix & Bucket</button></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copyright">
          © {new Date().getFullYear()} DAlgo. Designed for interactive DSA learning.
        </div>
        <div className="footer-made-with">
          Crafted with <Heart className="w-4 h-4 text-rose-500 inline mx-1 fill-rose-500" /> for algorithms students
        </div>
      </div>
    </footer>
  );
}
