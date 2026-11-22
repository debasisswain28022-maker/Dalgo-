import React, { useEffect } from 'react';
import { X, ArrowLeft, Sparkles, Check, Clock, HardDrive, ShieldCheck, ShieldAlert } from 'lucide-react';
import { MORE_SORTING_ALGORITHMS } from '../data/moreAlgorithms';

/**
 * Difficulty badge color resolver
 */
function getDifficultyBadge(diff) {
  switch (diff) {
    case 'Easy':
      return {
        bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        dot: 'bg-emerald-400',
        label: 'Easy'
      };
    case 'Medium':
      return {
        bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        dot: 'bg-amber-400',
        label: 'Medium'
      };
    case 'Hard':
      return {
        bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
        dot: 'bg-rose-400',
        label: 'Hard'
      };
    default:
      return {
        bg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
        dot: 'bg-indigo-400',
        label: diff
      };
  }
}

export default function MoreAlgorithmsModal({
  isOpen,
  onClose,
  onSelectAlgo,
  selectedAlgo,
  onBackToStandard
}) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="more-algos-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 id="more-algos-title" className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Additional Sorting Algorithms
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  9 Algorithms
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Choose an algorithm to load its live step-by-step visualization in Dalgo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onBackToStandard && (
              <button
                type="button"
                onClick={() => {
                  onBackToStandard();
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition"
                title="Return to standard sorting algorithms"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Standard</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Algorithm Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {MORE_SORTING_ALGORITHMS.map((algo) => {
              const isSelected = selectedAlgo === algo.id;
              const badge = getDifficultyBadge(algo.difficulty);

              return (
                <div
                  key={algo.id}
                  onClick={() => {
                    onSelectAlgo(algo.id);
                    onClose();
                  }}
                  className={`group relative flex flex-col justify-between p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-glow'
                      : 'bg-slate-850 border-slate-800/90 hover:border-indigo-500/60 hover:bg-slate-800/80'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onSelectAlgo(algo.id);
                      onClose();
                    }
                  }}
                >
                  {/* Top row: Name & Difficulty badge */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                        {algo.name}
                      </h3>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${badge.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        {algo.difficulty}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                      {algo.shortDescription || algo.tagline}
                    </p>
                  </div>

                  {/* Complexity & Specs */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300 mb-2.5">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3 text-sky-400" />
                        <span>Avg: <strong className="text-slate-200">{algo.complexity.average}</strong></span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <HardDrive className="w-3 h-3 text-emerald-400" />
                        <span>Space: <strong className="text-slate-200">{algo.complexity.space}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        {algo.stable ? (
                          <span className="text-emerald-400 flex items-center gap-0.5"><ShieldCheck className="w-3 h-3" /> Stable</span>
                        ) : (
                          <span className="text-slate-500 flex items-center gap-0.5"><ShieldAlert className="w-3 h-3" /> Unstable</span>
                        )}
                        <span>•</span>
                        <span>{algo.inPlace ? 'In-place' : 'Auxiliary'}</span>
                      </span>

                      <button
                        type="button"
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white'
                        }`}
                      >
                        {isSelected ? 'Active ✓' : 'Visualize →'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-900/90 text-xs text-slate-400">
          <span>Click any algorithm to visualize its comparisons, swaps, and animation steps.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
