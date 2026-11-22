import React, { useState, useEffect, useMemo } from 'react';
import { X, ArrowLeft, Sparkles, Search, Clock, HardDrive, ShieldCheck, ShieldAlert, GitFork } from 'lucide-react';
import { MORE_SORTING_ALGORITHMS, DIVIDE_AND_CONQUER_ALGORITHMS, OTHER_MORE_ALGORITHMS } from '../data/moreAlgorithms';

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
  const [activeCategory, setActiveCategory] = useState('Divide and Conquer');
  const [searchQuery, setSearchQuery] = useState('');

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset filter/search on open
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredAlgorithms = useMemo(() => {
    return MORE_SORTING_ALGORITHMS.filter((algo) => {
      const matchesCategory =
        activeCategory === 'All' ||
        algo.category === activeCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        algo.name.toLowerCase().includes(q) ||
        (algo.shortDescription && algo.shortDescription.toLowerCase().includes(q)) ||
        (algo.tagline && algo.tagline.toLowerCase().includes(q)) ||
        algo.difficulty.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  if (!isOpen) return null;

  const dcCount = DIVIDE_AND_CONQUER_ALGORITHMS.length;
  const otherCount = OTHER_MORE_ALGORITHMS.length;
  const totalCount = MORE_SORTING_ALGORITHMS.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="more-algos-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 id="more-algos-title" className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Additional Sorting Algorithms
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {totalCount} Total
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Explore advanced Divide and Conquer algorithms, hybrid sorts, and specialized distribution methods.
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

        {/* Filter bar: Categories & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3 border-b border-slate-800/80 bg-slate-950/50">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800/80 overflow-x-auto w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveCategory('Divide and Conquer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                activeCategory === 'Divide and Conquer'
                  ? 'bg-indigo-600 text-white shadow-glow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitFork className="w-3.5 h-3.5 text-indigo-300" />
              <span>Divide and Conquer ({dcCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('Additional Sorting Algorithms')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                activeCategory === 'Additional Sorting Algorithms'
                  ? 'bg-indigo-600 text-white shadow-glow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Exotic & Distribution ({otherCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                activeCategory === 'All'
                  ? 'bg-indigo-600 text-white shadow-glow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({totalCount})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search algorithms..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Algorithm Grid */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {filteredAlgorithms.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-sm">No algorithms found matching "{searchQuery}"</p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                className="mt-2 text-xs text-indigo-400 hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredAlgorithms.map((algo) => {
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
                        : 'bg-slate-900/90 border-slate-800/90 hover:border-indigo-500/60 hover:bg-slate-800/80'
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
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                          {algo.name}
                        </h3>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${badge.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {algo.difficulty}
                        </span>
                      </div>

                      <div className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400/80 mb-1.5">
                        {algo.category}
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
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-900/90 text-xs text-slate-400">
          <span>Showing {filteredAlgorithms.length} of {totalCount} algorithms. Click any card to launch its live visualization.</span>
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
