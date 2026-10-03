import React from 'react';
import { Play, BookOpen, Clock, HardDrive, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function AlgorithmCard({ algorithm, onLearn, onVisualize }) {
  const getCategoryClass = (category) => {
    switch (category) {
      case 'Beginner': return 'badge-beginner';
      case 'Intermediate': return 'badge-intermediate';
      case 'Advanced': return 'badge-advanced';
      default: return '';
    }
  };

  return (
    <div className="algorithm-card">
      <div className="card-top-row">
        <h3 className="card-title">{algorithm.name}</h3>
        <span className={`category-badge ${getCategoryClass(algorithm.category)}`}>
          {algorithm.category}
        </span>
      </div>

      <p className="card-description">{algorithm.shortDescription}</p>

      {/* Complexity Badges */}
      <div className="card-complexity-grid">
        <div className="complexity-item" title="Time Complexity">
          <Clock className="complexity-icon" />
          <div className="complexity-info">
            <span className="complexity-label">Avg Time</span>
            <span className="complexity-val">{algorithm.complexity.average}</span>
          </div>
        </div>

        <div className="complexity-item" title="Space Complexity">
          <HardDrive className="complexity-icon" />
          <div className="complexity-info">
            <span className="complexity-label">Space</span>
            <span className="complexity-val">{algorithm.complexity.space}</span>
          </div>
        </div>
      </div>

      <div className="card-meta-row">
        {algorithm.stable ? (
          <span className="meta-tag tag-stable" title="Preserves order of equal items">
            <ShieldCheck className="w-3.5 h-3.5 inline mr-1" /> Stable
          </span>
        ) : (
          <span className="meta-tag tag-unstable" title="May alter order of equal items">
            <ShieldAlert className="w-3.5 h-3.5 inline mr-1" /> Unstable
          </span>
        )}

        {algorithm.inPlace && (
          <span className="meta-tag tag-inplace">In-Place</span>
        )}
      </div>

      {/* Card Actions */}
      <div className="card-actions">
        <button 
          onClick={() => onLearn(algorithm.id)} 
          className="btn btn-sm btn-outline"
        >
          <BookOpen className="w-4 h-4" />
          <span>Learn</span>
        </button>
        <button 
          onClick={() => onVisualize(algorithm.id)} 
          className="btn btn-sm btn-primary"
        >
          <Play className="w-4 h-4" />
          <span>Visualize</span>
        </button>
      </div>
    </div>
  );
}
