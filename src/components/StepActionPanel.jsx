import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeftRight, GitCompare, CheckCircle2, Zap, Search, ArrowDown,
  ChevronRight, ScanLine, Layers, BarChart2, RotateCcw, PlayCircle,
  AlertCircle, Hash, TrendingDown, Package
} from 'lucide-react';

/**
 * Maps step type → { icon, label, color class }
 */
const STEP_TYPE_META = {
  init:            { icon: PlayCircle,     label: 'Initialize',      color: 'step-init' },
  compare:         { icon: GitCompare,     label: 'Compare',         color: 'step-compare' },
  swap:            { icon: ArrowLeftRight, label: 'Swap',            color: 'step-swap' },
  heap_swap:       { icon: ArrowLeftRight, label: 'Heap Swap',       color: 'step-swap' },
  swap_pivot:      { icon: ArrowLeftRight, label: 'Swap Pivot',      color: 'step-swap' },
  sorted_element:  { icon: CheckCircle2,   label: 'Sorted!',         color: 'step-sorted' },
  completed:       { icon: CheckCircle2,   label: 'Complete!',       color: 'step-sorted' },
  early_exit:      { icon: Zap,            label: 'Early Exit',      color: 'step-sorted' },
  pass_start:      { icon: ChevronRight,   label: 'Pass Start',      color: 'step-pass' },
  find_min:        { icon: Search,         label: 'Find Minimum',    color: 'step-min' },
  new_min:         { icon: TrendingDown,   label: 'New Minimum',     color: 'step-min' },
  pick_key:        { icon: ScanLine,       label: 'Pick Key',        color: 'step-key' },
  shift:           { icon: ArrowDown,      label: 'Shift',           color: 'step-shift' },
  insert:          { icon: ArrowDown,      label: 'Insert',          color: 'step-insert' },
  gap_change:      { icon: Hash,           label: 'Gap Change',      color: 'step-gap' },
  heapify_inspect: { icon: BarChart2,      label: 'Heapify',         color: 'step-compare' },
  heap_build:      { icon: Layers,         label: 'Build Heap',      color: 'step-pass' },
  overwrite:       { icon: ArrowDown,      label: 'Write',           color: 'step-insert' },
  place_output:    { icon: CheckCircle2,   label: 'Place Output',    color: 'step-sorted' },
  pivot_select:    { icon: AlertCircle,    label: 'Pivot Select',    color: 'step-pivot' },
  partition:       { icon: Package,        label: 'Partition',       color: 'step-pivot' },
  digit_pass:      { icon: Hash,           label: 'Digit Pass',      color: 'step-gap' },
  bucket_fill:     { icon: Package,        label: 'Fill Bucket',     color: 'step-key' },
  bucket_sort:     { icon: RotateCcw,      label: 'Sort Bucket',     color: 'step-pass' },
  bucket_concat:   { icon: Layers,         label: 'Concat Buckets',  color: 'step-insert' },
  count_increment: { icon: Hash,           label: 'Count',           color: 'step-key' },
  count_prefix:    { icon: BarChart2,      label: 'Prefix Sum',      color: 'step-gap' },
  // QuickSort-specific
  recursive_call:      { icon: GitCompare,     label: 'Recurse',         color: 'step-pass' },
  swap_pivot_to_end:   { icon: ArrowLeftRight, label: 'Move Pivot',      color: 'step-pivot' },
  select_pivot:        { icon: AlertCircle,    label: 'Select Pivot',    color: 'step-pivot' },
  pointer_init:        { icon: ChevronRight,   label: 'Init Pointers',   color: 'step-init' },
  no_swap:             { icon: GitCompare,     label: 'No Swap',         color: 'step-compare' },
  no_swap_same_index:  { icon: GitCompare,     label: 'Already Left',    color: 'step-compare' },
  base_case_element:   { icon: CheckCircle2,   label: 'Base Case',       color: 'step-sorted' },
  partition_complete:  { icon: Package,        label: 'Partition Done',  color: 'step-pivot' },
  swap_pivot:          { icon: ArrowLeftRight, label: 'Place Pivot',     color: 'step-swap' },
  // MergeSort-specific
  split:           { icon: GitCompare,     label: 'Split',           color: 'step-pass' },
  base_case:       { icon: CheckCircle2,   label: 'Base Case',       color: 'step-sorted' },
  start_merge:     { icon: Layers,         label: 'Start Merge',     color: 'step-key' },
  take_left:       { icon: ArrowDown,      label: 'Take Left',       color: 'step-insert' },
  take_right:      { icon: ArrowDown,      label: 'Take Right',      color: 'step-insert' },
  append_remaining:{ icon: ChevronRight,   label: 'Append Rest',     color: 'step-insert' },
  merge_complete:  { icon: CheckCircle2,   label: 'Merge Done',      color: 'step-sorted' },
  // HeapSort-specific
  build_heap_start:         { icon: Layers,         label: 'Build Heap',      color: 'step-pass' },
  max_heap_created:         { icon: CheckCircle2,   label: 'Max Heap Built',  color: 'step-sorted' },
  extract_max_start:        { icon: Search,         label: 'Extract Max',     color: 'step-min' },
  swap_root_with_last:      { icon: ArrowLeftRight, label: 'Swap Root',       color: 'step-swap' },
  reduce_heap_size:         { icon: TrendingDown,   label: 'Shrink Heap',     color: 'step-gap' },
  heapify_start:            { icon: BarChart2,      label: 'Heapify',         color: 'step-compare' },
  inspect_parent_children:  { icon: BarChart2,      label: 'Inspect Node',    color: 'step-compare' },
  compare_left:             { icon: GitCompare,     label: 'Compare Left',    color: 'step-compare' },
  compare_right:            { icon: GitCompare,     label: 'Compare Right',   color: 'step-compare' },
  heapify_swap:             { icon: ArrowLeftRight, label: 'Heapify Swap',    color: 'step-swap' },
  heapify_complete_node:    { icon: CheckCircle2,   label: 'Node OK',         color: 'step-sorted' },
};

const DEFAULT_META = { icon: PlayCircle, label: 'Step', color: 'step-init' };

/**
 * Animated Step Action Panel
 * Shows current step type, description, and running stats.
 */
export default function StepActionPanel({ currentStep, currentStepIdx, totalSteps, algoName }) {
  const [animKey, setAnimKey] = useState(0);
  const prevIdxRef = useRef(currentStepIdx);

  // Re-trigger animation every time step changes
  useEffect(() => {
    if (prevIdxRef.current !== currentStepIdx) {
      prevIdxRef.current = currentStepIdx;
      setAnimKey(k => k + 1);
    }
  }, [currentStepIdx]);

  if (!currentStep) {
    return (
      <div className="step-action-panel step-action-idle">
        <div className="step-idle-content">
          <PlayCircle className="step-idle-icon" />
          <p className="step-idle-text">Press <kbd className="step-kbd">Start</kbd> or <kbd className="step-kbd">→</kbd> to begin stepping through {algoName}</p>
        </div>
      </div>
    );
  }

  const type = currentStep.type || 'init';
  const meta = STEP_TYPE_META[type] || DEFAULT_META;
  const IconComp = meta.icon;

  const description = currentStep.description || '';
  const progress = totalSteps > 0 ? ((currentStepIdx + 1) / totalSteps) * 100 : 0;

  const comparisons = currentStep.comparisonsCount ?? 0;
  const swaps = currentStep.swapsCount ?? 0;
  const pass = currentStep.pass;

  return (
    <div className={`step-action-panel ${meta.color}`} key={animKey}>
      {/* Progress bar */}
      <div className="step-progress-track">
        <div className="step-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Type badge + icon */}
      <div className="step-header-row">
        <div className="step-type-badge">
          <IconComp className="step-type-icon" />
          <span className="step-type-label">{meta.label}</span>
        </div>

        <div className="step-counter-pill">
          Step <strong>{currentStepIdx + 1}</strong> / {totalSteps}
        </div>
      </div>

      {/* Description text — main content */}
      <div className="step-description-box">
        <p className="step-description-text">{description}</p>
      </div>

      {/* Inline comparison display if step has specific values */}
      {currentStep.type === 'compare' && currentStep.indices && currentStep.indices.length === 2 && (
        <div className="step-comparison-visual">
          <span className="cmp-box cmp-left">
            idx[{currentStep.indices[0]}]
          </span>
          <span className="cmp-operator">vs</span>
          <span className="cmp-box cmp-right">
            idx[{currentStep.indices[1]}]
          </span>
        </div>
      )}

      {currentStep.type === 'swap' && currentStep.indices && currentStep.indices.length === 2 && (
        <div className="step-comparison-visual">
          <span className="cmp-box cmp-swap">
            [{currentStep.indices[0]}]
          </span>
          <ArrowLeftRight className="cmp-swap-icon" />
          <span className="cmp-box cmp-swap">
            [{currentStep.indices[1]}]
          </span>
        </div>
      )}

      {currentStep.gap > 0 && (
        <div className="step-gap-badge">
          <Hash className="w-3.5 h-3.5" /> Gap: <strong>{currentStep.gap}</strong>
        </div>
      )}

      {pass > 0 && (
        <div className="step-pass-tag">Pass {pass}</div>
      )}

      {/* Stats row */}
      <div className="step-stats-row">
        {comparisons > 0 && (
          <div className="step-stat-chip chip-compare">
            <GitCompare className="w-3.5 h-3.5" />
            <span>{comparisons} comparisons</span>
          </div>
        )}
        {swaps > 0 && (
          <div className="step-stat-chip chip-swap">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>{swaps} swaps</span>
          </div>
        )}
      </div>
    </div>
  );
}
