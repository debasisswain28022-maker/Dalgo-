import React, { useState } from 'react';
import Quiz from '../components/Quiz';
import { HelpCircle, Award, BookOpen } from 'lucide-react';

export default function QuizPage({ onNavigate }) {
  return (
    <div className="quiz-page-container">
      <div className="page-header">
        <h1 className="page-title">Algorithms Knowledge Quiz</h1>
        <p className="page-subtitle">
          Test your understanding of sorting algorithm complexities, stability, pivot strategies, heap properties, and memory bounds.
        </p>
      </div>

      <div className="quiz-wrapper-card">
        <Quiz />
      </div>
    </div>
  );
}
