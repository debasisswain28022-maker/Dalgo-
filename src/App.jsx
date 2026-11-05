import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Algorithms from './pages/Algorithms';
import Visualizer from './pages/Visualizer';
import Compare from './pages/Compare';
import QuizPage from './pages/QuizPage';
import AlgorithmDetails from './pages/AlgorithmDetails';
import GreedyDPPage from './greedy-dp/GreedyDPPage';
import './index.css';

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
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
