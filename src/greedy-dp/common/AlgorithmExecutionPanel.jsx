import React, { useState } from 'react';
import { Code2, Copy, Check, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { GREEDY_DP_ALGORITHMS } from '../data/algorithmsData';

const ALGORITHM_PSEUDOCODE = {
  'fractional-knapsack': [
    { line: 'algorithm FractionalKnapsack(items, capacity W):', types: ['init'] },
    { line: '  for each item i in items:', types: ['calc_ratio', 'ratio_computed'] },
    { line: '    ratio[i] = item[i].value / item[i].weight', types: ['calc_ratio', 'ratio_computed'] },
    { line: '  sort items by ratio descending (r1 >= r2 >= ... >= rn)', types: ['sort_start', 'sort_compare', 'sort_swap', 'sort_complete'] },
    { line: '  remainingCapacity = W, totalProfit = 0', types: ['init', 'sort_complete'] },
    { line: '  for each item i in sorted items:', types: ['knapsack_eval'] },
    { line: '    if remainingCapacity <= 0: break  // knapsack full', types: ['knapsack_reject'] },
    { line: '    if item[i].weight <= remainingCapacity:  // take full item', types: ['knapsack_take_full'] },
    { line: '      fraction[i] = 1.0; totalProfit += item[i].value', types: ['knapsack_take_full'] },
    { line: '      remainingCapacity -= item[i].weight', types: ['knapsack_take_full'] },
    { line: '    else:  // take fraction of item', types: ['knapsack_take_partial'] },
    { line: '      fraction[i] = remainingCapacity / item[i].weight', types: ['knapsack_take_partial'] },
    { line: '      totalProfit += item[i].value * fraction[i]', types: ['knapsack_take_partial'] },
    { line: '      remainingCapacity = 0; break', types: ['knapsack_take_partial'] },
    { line: '  return totalProfit, fractions  // optimal solution', types: ['complete'] },
  ],
  'huffman-coding': [
    { line: 'algorithm HuffmanCoding(symbols):', types: ['init', 'calc_freq'] },
    { line: '  freq = countFrequency(each unique character)', types: ['calc_freq'] },
    { line: '  Q = MinPriorityQueue()', types: ['create_leaves'] },
    { line: '  for each (char, count) in freq: Q.insert(LeafNode(char, count))', types: ['create_leaves', 'build_pq'] },
    { line: '  while |Q| > 1:  // greedy merging', types: ['extract_min1', 'extract_min2', 'merge_nodes', 'insert_pq'] },
    { line: '    left = Q.extractMin()   // 1st smallest', types: ['extract_min1'] },
    { line: '    right = Q.extractMin()  // 2nd smallest', types: ['extract_min2'] },
    { line: '    parent = Node(freq = left.freq + right.freq)', types: ['merge_nodes'] },
    { line: '    parent.left = left (0), parent.right = right (1)', types: ['merge_nodes'] },
    { line: '    Q.insert(parent)', types: ['insert_pq'] },
    { line: '  root = Q.extractMin()  // single root tree', types: ['tree_complete'] },
    { line: '  codes = assignPrefixCodes(root, code="")', types: ['tree_complete'] },
    { line: '  encodedText = mapCharactersToCodes(text, codes)', types: ['complete'] },
    { line: '  return root, codes, encodedText', types: ['complete'] },
  ],
  'activity-selection': [
    { line: 'algorithm ActivitySelection(activities S):', types: ['init'] },
    { line: '  sort S in ascending order of finish time (f1 <= f2 <= ... <= fn)', types: ['sort_start', 'sort_compare', 'sort_swap', 'sort_complete'] },
    { line: '  selected = [S[0]]  // greedily pick earliest finisher', types: ['select_first'] },
    { line: '  lastFinish = S[0].finish', types: ['select_first'] },
    { line: '  for i = 1 to n - 1:', types: ['eval_activity'] },
    { line: '    if S[i].start >= lastFinish:  // compatible?', types: ['eval_activity', 'activity_selected'] },
    { line: '      selected.append(S[i])  // accept activity', types: ['activity_selected'] },
    { line: '      lastFinish = S[i].finish  // update marker', types: ['activity_selected'] },
    { line: '    else:', types: ['activity_rejected'] },
    { line: '      reject S[i]  // conflict with current schedule', types: ['activity_rejected'] },
    { line: '  return selected  // maximum compatible set', types: ['complete'] },
  ],
  'longest-common-subsequence': [
    { line: 'algorithm LCS(S1[1..m], S2[1..n]):', types: ['init'] },
    { line: '  DP = 2D array of size (m + 1) x (n + 1)', types: ['init'] },
    { line: '  for i = 0 to m: DP[i][0] = 0; for j = 0 to n: DP[0][j] = 0', types: ['base_cases'] },
    { line: '  for i = 1 to m:', types: ['cell_match', 'cell_mismatch'] },
    { line: '    for j = 1 to n:', types: ['cell_match', 'cell_mismatch'] },
    { line: '      if S1[i - 1] == S2[j - 1]:  // characters match', types: ['cell_match'] },
    { line: '        DP[i][j] = 1 + DP[i - 1][j - 1]  // diagonal + 1', types: ['cell_match'] },
    { line: '      else:  // mismatch', types: ['cell_mismatch'] },
    { line: '        DP[i][j] = max(DP[i - 1][j], DP[i][j - 1])  // max(top, left)', types: ['cell_mismatch'] },
    { line: '  // Backtracking from (m, n) to reconstruct LCS string', types: ['table_complete', 'backtrack_start'] },
    { line: '  while i > 0 and j > 0:', types: ['backtrack_start', 'backtrack_match', 'backtrack_move'] },
    { line: '    if S1[i - 1] == S2[j - 1]: add S1[i-1] to LCS, i--, j--', types: ['backtrack_match'] },
    { line: '    else if DP[i - 1][j] >= DP[i][j - 1]: i--  // move up', types: ['backtrack_move'] },
    { line: '    else: j--  // move left', types: ['backtrack_move'] },
    { line: '  return (LCS, DP[m][n])', types: ['complete'] },
  ]
};

export default function AlgorithmExecutionPanel({ algoId, currentStep }) {
  const [activeTab, setActiveTab] = useState('pseudo'); // 'pseudo' | 'cpp' | 'python' | 'java' | 'c'
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const lines = ALGORITHM_PSEUDOCODE[algoId] || [];
  const algoData = GREEDY_DP_ALGORITHMS.find(a => a.id === algoId);
  const stepType = currentStep?.type || 'init';

  // Highlight lines matching the current step type
  const highlightedLineIndices = lines
    .map((item, idx) => (item.types.includes(stepType) ? idx : -1))
    .filter(idx => idx !== -1);

  const handleCopy = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSourceCode = (lang) => {
    if (!algoData || !algoData.implementations) return '// Code not available';
    return algoData.implementations[lang] || '// Code not available';
  };

  return (
    <div className="gdp-algo-code-panel">
      {/* Header */}
      <div className="gdp-code-panel-header">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-sm text-slate-200">Algorithm & Live Execution</span>
          {stepType && (
            <span className="gdp-code-step-tag">
              {stepType.replace(/_/g, ' ').toUpperCase()}
            </span>
          )}
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1">
          <div className="gdp-code-panel-tabs">
            <button
              onClick={() => setActiveTab('pseudo')}
              className={`gdp-code-panel-tab ${activeTab === 'pseudo' ? 'active' : ''}`}
            >
              <Play className="w-3 h-3 mr-1 fill-current text-amber-400" />
              Live Pseudocode
            </button>
            <button
              onClick={() => setActiveTab('cpp')}
              className={`gdp-code-panel-tab ${activeTab === 'cpp' ? 'active' : ''}`}
            >
              C++
            </button>
            <button
              onClick={() => setActiveTab('python')}
              className={`gdp-code-panel-tab ${activeTab === 'python' ? 'active' : ''}`}
            >
              Python
            </button>
            <button
              onClick={() => setActiveTab('java')}
              className={`gdp-code-panel-tab ${activeTab === 'java' ? 'active' : ''}`}
            >
              Java
            </button>
            <button
              onClick={() => setActiveTab('c')}
              className={`gdp-code-panel-tab ${activeTab === 'c' ? 'active' : ''}`}
            >
              C
            </button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors ml-1"
            title={isExpanded ? 'Collapse code' : 'Expand code'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="gdp-code-panel-body">
          {activeTab === 'pseudo' ? (
            <div className="gdp-pseudo-lines-list">
              {lines.map((item, idx) => {
                const isActive = highlightedLineIndices.includes(idx);
                return (
                  <div
                    key={idx}
                    className={`gdp-pseudo-line ${isActive ? 'gdp-pseudo-line-active' : ''}`}
                  >
                    <span className="gdp-pseudo-line-num">{idx + 1}</span>
                    <span className="gdp-pseudo-line-code">{item.line}</span>
                    {isActive && (
                      <span className="gdp-pseudo-active-marker">
                        ◀ EXECUTING
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => handleCopy(getSourceCode(activeTab))}
                className="gdp-code-copy-floating"
                title="Copy Code"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                    <span className="text-emerald-400 text-xs">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    <span className="text-xs">Copy</span>
                  </>
                )}
              </button>
              <pre className="gdp-code-pre-block">
                <code>{getSourceCode(activeTab)}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
