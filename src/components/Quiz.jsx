import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, RotateCcw, Trophy, HelpCircle, Award } from 'lucide-react';

export default function Quiz({ filterAlgorithmId = null }) {
  const questions = filterAlgorithmId
    ? QUIZ_QUESTIONS.filter(q => q.algorithmId === filterAlgorithmId)
    : QUIZ_QUESTIONS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionId: optionIdx }
  const [showExplanation, setShowExplanation] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!questions || questions.length === 0) {
    return <div className="quiz-empty">No quiz questions available for this topic.</div>;
  }

  const currentQ = questions[currentIndex];
  const userSelected = selectedAnswers[currentQ.id];
  const hasAnswered = userSelected !== undefined;

  const handleSelectOption = (optIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optIdx }));
    setShowExplanation(prev => ({ ...prev, [currentQ.id]: true }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowExplanation({});
    setIsSubmitted(false);
  };

  return (
    <div className="quiz-container">
      {!isSubmitted ? (
        <>
          {/* Header & Progress Bar */}
          <div className="quiz-header font-sans">
            <div className="quiz-progress-info">
              <span className="quiz-step-count">
                Question <strong>{currentIndex + 1}</strong> of {questions.length}
              </span>
              <span className="quiz-score-live">
                Current Score: <strong>{score}</strong>
              </span>
            </div>

            <div className="quiz-progress-track">
              <div 
                className="quiz-progress-fill"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Box */}
          <div className="quiz-card">
            <h3 className="quiz-question-title">
              <HelpCircle className="w-6 h-6 text-indigo-400 inline mr-2" />
              {currentQ.question}
            </h3>

            {/* Options List */}
            <div className="quiz-options-grid">
              {currentQ.options.map((optionText, optIdx) => {
                const isOptionSelected = userSelected === optIdx;
                const isCorrect = optIdx === currentQ.correctAnswer;
                let optionState = '';

                if (hasAnswered) {
                  if (isCorrect) optionState = 'correct';
                  else if (isOptionSelected) optionState = 'wrong';
                  else optionState = 'disabled';
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={hasAnswered}
                    className={`quiz-option-btn ${optionState}`}
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="option-text">{optionText}</span>
                    
                    {hasAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />
                    )}
                    {hasAnswered && isOptionSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Callout */}
            {hasAnswered && (
              <div className={`quiz-explanation-box ${userSelected === currentQ.correctAnswer ? 'success' : 'warning'}`}>
                <div className="explanation-header font-bold">
                  {userSelected === currentQ.correctAnswer ? 'Correct!' : 'Incorrect'}
                </div>
                <p className="explanation-text">{currentQ.explanation}</p>
              </div>
            )}

            {/* Footer Navigation Buttons */}
            <div className="quiz-card-footer">
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="btn btn-outline"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Previous
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                  disabled={!hasAnswered}
                  className="btn btn-primary"
                >
                  Next Question <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              ) : (
                <button
                  onClick={() => setIsSubmitted(true)}
                  disabled={!hasAnswered}
                  className="btn btn-accent"
                >
                  View Final Score <Trophy className="w-4 h-4 ml-1" />
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Results / Final Score Screen */
        <div className="quiz-results-card">
          <div className="results-icon-wrapper">
            <Trophy className="w-16 h-16 text-amber-400 animate-bounce" />
          </div>
          <h2 className="results-title">Quiz Completed!</h2>
          <p className="results-subtitle">Great effort testing your algorithms knowledge.</p>

          <div className="results-score-circle">
            <span className="results-score-num">{score} / {questions.length}</span>
            <span className="results-score-pct">{percentage}%</span>
          </div>

          <p className="results-feedback">
            {percentage >= 80 
              ? "Outstanding! You have mastered sorting algorithms!"
              : percentage >= 50
              ? "Good job! Keep practicing to hone your algorithms skills."
              : "Keep learning! Review the algorithm pages and try again!"}
          </p>

          <div className="results-actions">
            <button onClick={handleRestart} className="btn btn-primary">
              <RotateCcw className="w-4 h-4 mr-1.5" /> Restart Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
