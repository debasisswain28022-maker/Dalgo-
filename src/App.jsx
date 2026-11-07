import React, { useState, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './index.css';

// Code-split pages for optimized bundle loading
const Home = lazy(() => import('./pages/Home'));
const Algorithms = lazy(() => import('./pages/Algorithms'));
const Visualizer = lazy(() => import('./pages/Visualizer'));
const Compare = lazy(() => import('./pages/Compare'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const AlgorithmDetails = lazy(() => import('./pages/AlgorithmDetails'));
const GreedyDPPage = lazy(() => import('./greedy-dp/GreedyDPPage'));

function PageLoader() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.85rem',
      color: '#94a3b8',
      padding: '4rem 1rem'
    }}>
      <div style={{
        width: '38px',
        height: '38px',
        border: '3px solid rgba(99, 102, 241, 0.2)',
        borderTopColor: '#6366f1',
        borderRadius: '50%',
        animation: 'spin 0.75s linear infinite'
      }} />
      <span style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.04em' }}>
        Loading module...
      </span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedAlgoId, setSelectedAlgoId] = useState('bubble-sort');
  const [selectedGreedyAlgoId, setSelectedGreedyAlgoId] = useState('fractional-knapsack');

  const handleSelectAlgorithm = (algoId) => {
    setSelectedAlgoId(algoId);
  };

  const handleSelectGreedyAlgorithm = (algoId) => {
    setSelectedGreedyAlgoId(algoId);
  };

  return (
    <div className="app-layout">
      {/* Navigation Header */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectAlgorithm={handleSelectAlgorithm}
        onSelectGreedyAlgorithm={handleSelectGreedyAlgorithm}
      />

      {/* Main View Router */}
      <main className="main-content">
        <Suspense fallback={<PageLoader />}>
          {activeTab === 'home' && (
            <Home 
              onNavigate={setActiveTab}
              onSelectAlgorithm={handleSelectAlgorithm}
              onSelectGreedyAlgorithm={handleSelectGreedyAlgorithm}
            />
          )}

          {activeTab === 'algorithms' && (
            <Algorithms 
              onNavigate={setActiveTab}
              onSelectAlgorithm={handleSelectAlgorithm}
              onSelectGreedyAlgorithm={handleSelectGreedyAlgorithm}
            />
          )}

          {activeTab === 'greedy-dp' && (
            <GreedyDPPage 
              selectedAlgoId={selectedGreedyAlgoId}
              onSelectAlgoId={setSelectedGreedyAlgoId}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'visualizer' && (
            <Visualizer 
              selectedAlgoId={selectedAlgoId}
              onSelectAlgoId={setSelectedAlgoId}
            />
          )}

          {activeTab === 'compare' && (
            <Compare 
              onSelectAlgorithm={handleSelectAlgorithm}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizPage 
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'algorithm-details' && (
            <AlgorithmDetails 
              algorithmId={selectedAlgoId}
              onNavigate={setActiveTab}
              onSelectAlgorithm={handleSelectAlgorithm}
            />
          )}
        </Suspense>
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
