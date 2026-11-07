import React, { useState } from 'react';
import Quiz from '../components/Quiz';
import { HelpCircle, Award, BookOpen, Sparkles, Layers } from 'lucide-react';

export default function QuizPage({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'sorting' | 'greedy-dp'

  return (
    <div className="quiz-page-container">
      <div className="page-header">
        <h1 className="page-title">Algorithms Knowledge Quiz</h1>
        <p className="page-subtitle">
          Test your mastery of sorting mechanics, greedy choice strategies, prefix codes, and dynamic programming recurrences.
        </p>

        {/* Category Filter Selector */}
        <div className="flex justify-center mt-6">
          <div className="inline-flex p-1.5 rounded-xl bg-slate-900/60 border border-slate-800 gap-1.5 shadow-md">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>All Questions (21)</span>
            </button>
            <button
              onClick={() => setSelectedCategory('sorting')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                selectedCategory === 'sorting'
                  ? 'bg-indigo-600 text-white shadow-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Sorting (10)</span>
            </button>
            <button
              onClick={() => setSelectedCategory('greedy-dp')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                selectedCategory === 'greedy-dp'
                  ? 'bg-indigo-600 text-white shadow-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Greedy & DP (11)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="quiz-wrapper-card">
        <Quiz filterCategory={selectedCategory} />
      </div>
    </div>
  );
}
