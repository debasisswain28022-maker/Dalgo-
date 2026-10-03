import React, { useState } from 'react';
import { ALGORITHMS } from '../data/algorithms';
import { ShieldCheck, ShieldAlert, Check, X, Play } from 'lucide-react';

export default function ComplexityTable({ onSelectAlgorithm, onVisualizeAlgorithm }) {
  const [filterCategory, setFilterCategory] = useState('All');

  const filteredAlgos = filterCategory === 'All'
    ? ALGORITHMS
    : ALGORITHMS.filter(a => a.category === filterCategory);

  return (
    <div className="complexity-table-wrapper">
      <div className="table-filter-bar">
        <h3 className="table-title">Algorithm Complexity Matrix</h3>
        <div className="category-filter-pills">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="table-scroll-container">
        <table className="complexity-table">
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Category</th>
              <th>Best Time</th>
              <th>Average Time</th>
              <th>Worst Time</th>
              <th>Space</th>
              <th>Stable</th>
              <th>In-Place</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlgos.map(algo => (
              <tr key={algo.id} className="table-row">
                <td className="font-semibold text-primary">
                  <button 
                    onClick={() => onSelectAlgorithm(algo.id)}
                    className="algo-name-link"
                  >
                    {algo.name}
                  </button>
                </td>
                <td>
                  <span className={`category-badge badge-${algo.category.toLowerCase()}`}>
                    {algo.category}
                  </span>
                </td>
                <td className="font-mono text-emerald-400">{algo.complexity.best}</td>
                <td className="font-mono text-amber-400 font-bold">{algo.complexity.average}</td>
                <td className="font-mono text-rose-400">{algo.complexity.worst}</td>
                <td className="font-mono text-cyan-400">{algo.complexity.space}</td>
                <td>
                  {algo.stable ? (
                    <span className="badge-status success"><ShieldCheck className="w-3.5 h-3.5 inline mr-1" /> Yes</span>
                  ) : (
                    <span className="badge-status danger"><ShieldAlert className="w-3.5 h-3.5 inline mr-1" /> No</span>
                  )}
                </td>
                <td>
                  {algo.inPlace ? (
                    <span className="badge-status success"><Check className="w-3.5 h-3.5 inline mr-1" /> Yes</span>
                  ) : (
                    <span className="badge-status neutral"><X className="w-3.5 h-3.5 inline mr-1" /> No</span>
                  )}
                </td>
                <td>
                  <button 
                    onClick={() => onVisualizeAlgorithm(algo.id)}
                    className="btn btn-xs btn-primary inline-flex items-center gap-1"
                  >
                    <Play className="w-3 h-3" />
                    <span>Visualize</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
