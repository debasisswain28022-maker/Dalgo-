import React, { useState } from 'react';
import CodeSelector from './CodeSelector';
import {
  BookOpen,
  Cpu,
  ListOrdered,
  FileText,
  Calculator,
  Binary,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Globe,
  Code2
} from 'lucide-react';

export default function EducationalSection({ algorithm }) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview & Theory', icon: BookOpen },
    { id: 'steps', label: 'Steps & Pseudocode', icon: ListOrdered },
    { id: 'math', label: 'Formulas & Samples', icon: Calculator },
    { id: 'complexity', label: 'Complexity & Pros/Cons', icon: Clock },
    { id: 'code', label: 'Source Code (C/C++/Java/Py)', icon: Code2 },
  ];

  return (
    <div className="gdp-edu-container">
      <div className="gdp-edu-nav">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`gdp-edu-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              <Icon className="w-4 h-4 mr-2" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="gdp-edu-content">
        {/* Tab 1: Overview & Theory */}
        {activeTab === 'overview' && (
          <div className="gdp-edu-panel">
            <div className="gdp-edu-card">
              <h3 className="gdp-edu-heading">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                1. Introduction
              </h3>
              <div className="gdp-edu-text whitespace-pre-line">
                {algorithm.introduction}
              </div>
            </div>

            <div className="gdp-edu-card">
              <h3 className="gdp-edu-heading">
                <Cpu className="w-5 h-5 text-cyan-400" />
                2. Working Principle
              </h3>
              <div className="gdp-edu-text whitespace-pre-line">
                {algorithm.workingPrinciple}
              </div>
            </div>

            <div className="gdp-edu-card">
              <h3 className="gdp-edu-heading">
                <Globe className="w-5 h-5 text-emerald-400" />
                Real-World Applications
              </h3>
              <ul className="gdp-feature-list">
                {algorithm.realWorldApplications.map((app, idx) => (
                  <li key={idx} className="gdp-feature-item">
                    <span className="gdp-bullet"></span>
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Steps & Pseudocode */}
        {activeTab === 'steps' && (
          <div className="gdp-edu-panel">
            <div className="gdp-edu-card">
              <h3 className="gdp-edu-heading">
                <ListOrdered className="w-5 h-5 text-amber-400" />
                3. Algorithm Steps
              </h3>
              <ol className="gdp-steps-numbered">
                {algorithm.algorithmSteps.map((step, idx) => (
                  <li key={idx} className="gdp-step-item">
                    <span className="gdp-step-index">{idx + 1}</span>
                    <span className="gdp-step-text-val">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="gdp-edu-card">
              <h3 className="gdp-edu-heading">
                <FileText className="w-5 h-5 text-purple-400" />
                4. Formal Pseudocode
              </h3>
              <div className="gdp-pseudocode-wrapper">
                <pre className="gdp-pseudocode-pre">
                  <code>{algorithm.pseudocode}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Mathematical Formulas & Sample I/O */}
        {activeTab === 'math' && (
          <div className="gdp-edu-panel">
            <div className="gdp-edu-card">
              <h3 className="gdp-edu-heading">
                <Calculator className="w-5 h-5 text-indigo-400" />
                5. Mathematical Formulations
              </h3>
              <div className="gdp-formulas-grid">
                {algorithm.mathematicalFormulas.map((mf, idx) => (
                  <div key={idx} className="gdp-formula-box">
                    <div className="gdp-formula-name">{mf.name}</div>
                    <div className="gdp-formula-display">{mf.formula}</div>
                    <div className="gdp-formula-desc">{mf.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="gdp-edu-card">
              <h3 className="gdp-edu-heading">
                <Binary className="w-5 h-5 text-cyan-400" />
                6. Sample Input & Output Walkthrough
              </h3>
              <div className="gdp-sample-io-grid">
                <div className="gdp-io-box">
                  <div className="gdp-io-title">Input Specification</div>
                  <pre className="gdp-io-pre">
                    <code>{algorithm.sampleInputOutput.input}</code>
                  </pre>
                </div>
                <div className="gdp-io-box">
                  <div className="gdp-io-title">Expected Execution & Output</div>
                  <pre className="gdp-io-pre">
                    <code>{algorithm.sampleInputOutput.output}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Complexities & Pros/Cons */}
        {activeTab === 'complexity' && (
          <div className="gdp-edu-panel">
            <div className="gdp-edu-card">
              <h3 className="gdp-edu-heading">
                <Clock className="w-5 h-5 text-amber-400" />
                7. Asymptotic Complexity Analysis
              </h3>
              <div className="gdp-complexity-cards">
                <div className="gdp-comp-item">
                  <div className="gdp-comp-label">Best-Case Time</div>
                  <div className="gdp-comp-value text-emerald-400">{algorithm.complexity.timeBest}</div>
                </div>
                <div className="gdp-comp-item">
                  <div className="gdp-comp-label">Average-Case Time</div>
                  <div className="gdp-comp-value text-amber-400">{algorithm.complexity.timeAverage}</div>
                </div>
                <div className="gdp-comp-item">
                  <div className="gdp-comp-label">Worst-Case Time</div>
                  <div className="gdp-comp-value text-rose-400">{algorithm.complexity.timeWorst}</div>
                </div>
                <div className="gdp-comp-item">
                  <div className="gdp-comp-label">Space Complexity</div>
                  <div className="gdp-comp-value text-indigo-400">{algorithm.complexity.space}</div>
                </div>
              </div>
            </div>

            <div className="gdp-pros-cons-grid">
              <div className="gdp-edu-card gdp-card-pros">
                <h3 className="gdp-edu-heading text-emerald-400">
                  <ThumbsUp className="w-5 h-5" />
                  Key Advantages
                </h3>
                <ul className="gdp-feature-list">
                  {algorithm.advantages.map((adv, idx) => (
                    <li key={idx} className="gdp-feature-item">
                      <span className="gdp-bullet gdp-bullet-emerald"></span>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="gdp-edu-card gdp-card-cons">
                <h3 className="gdp-edu-heading text-rose-400">
                  <ThumbsDown className="w-5 h-5" />
                  Disadvantages & Limitations
                </h3>
                <ul className="gdp-feature-list">
                  {algorithm.disadvantages.map((dis, idx) => (
                    <li key={idx} className="gdp-feature-item">
                      <span className="gdp-bullet gdp-bullet-rose"></span>
                      <span>{dis}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Code Implementations */}
        {activeTab === 'code' && (
          <div className="gdp-edu-panel">
            <div className="gdp-edu-card">
              <h3 className="gdp-edu-heading">
                <Code2 className="w-5 h-5 text-indigo-400" />
                Source Code Implementations
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                Full production-ready implementations in C, C++, Java, and Python. Select your language below to inspect and copy.
              </p>
              <CodeSelector implementations={algorithm.implementations} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
