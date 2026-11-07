import React, { useState, useEffect, useMemo } from 'react';
import VisualizationControls from '../common/VisualizationControls';
import AlgorithmExecutionPanel from '../common/AlgorithmExecutionPanel';
import { generateActivitySteps } from './logic';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Milestone
} from 'lucide-react';

const SAMPLES = [
  {
    name: 'Prompt Example (A1-A6)',
    activities: [
      { id: 'A1', name: 'A1', start: 1, finish: 4 },
      { id: 'A2', name: 'A2', start: 3, finish: 5 },
      { id: 'A3', name: 'A3', start: 0, finish: 6 },
      { id: 'A4', name: 'A4', start: 5, finish: 7 },
      { id: 'A5', name: 'A5', start: 8, finish: 9 },
      { id: 'A6', name: 'A6', start: 5, finish: 9 }
    ]
  },
  {
    name: 'Eight Meeting Rooms',
    activities: [
      { id: 'A1', name: 'Planning Sync', start: 1, finish: 3 },
      { id: 'A2', name: 'Tech Review', start: 2, finish: 5 },
      { id: 'A3', name: 'Design Workshop', start: 4, finish: 7 },
      { id: 'A4', name: 'Standup', start: 1, finish: 2 },
      { id: 'A5', name: 'Demo Call', start: 6, finish: 8 },
      { id: 'A6', name: 'Retro', start: 7, finish: 11 },
      { id: 'A7', name: 'Release Prep', start: 8, finish: 10 },
      { id: 'A8', name: 'All Hands', start: 9, finish: 12 }
    ]
  },
  {
    name: 'Dense Overlaps',
    activities: [
      { id: 'A1', name: 'Task 1', start: 1, finish: 6 },
      { id: 'A2', name: 'Task 2', start: 2, finish: 4 },
      { id: 'A3', name: 'Task 3', start: 4, finish: 8 },
      { id: 'A4', name: 'Task 4', start: 5, finish: 7 },
      { id: 'A5', name: 'Task 5', start: 7, finish: 9 }
    ]
  }
];

export default function ActivityVisualizer() {
  const [selectedSampleName, setSelectedSampleName] = useState(SAMPLES[0].name);
  const [activities, setActivities] = useState([
    { id: 'A1', name: 'A1', start: 1, finish: 4 },
    { id: 'A2', name: 'A2', start: 3, finish: 5 },
    { id: 'A3', name: 'A3', start: 0, finish: 6 },
    { id: 'A4', name: 'A4', start: 5, finish: 7 },
    { id: 'A5', name: 'A5', start: 8, finish: 9 },
    { id: 'A6', name: 'A6', start: 5, finish: 9 }
  ]);

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(650);

  // Generate steps
  const { steps } = useMemo(() => {
    return generateActivitySteps(activities);
  }, [activities]);

  const currentFrame = steps[currentStepIdx] || steps[0];

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStepIdx >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStepIdx((prev) => Math.min(prev + 1, steps.length - 1));
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIdx, steps.length, speed]);

  // Sample selector
  const handleSelectSample = (sample) => {
    setIsPlaying(false);
    setSelectedSampleName(sample.name);
    setActivities(JSON.parse(JSON.stringify(sample.activities)));
    setCurrentStepIdx(0);
  };

  const handleAddActivity = () => {
    if (activities.length >= 8) return;
    setIsPlaying(false);
    const newIdx = activities.length + 1;
    setActivities([
      ...activities,
      { id: `A${newIdx}`, name: `A${newIdx}`, start: 6, finish: 10 }
    ]);
    setCurrentStepIdx(0);
  };

  const handleRemoveActivity = (idx) => {
    if (activities.length <= 2) return;
    setIsPlaying(false);
    setActivities(activities.filter((_, i) => i !== idx));
    setCurrentStepIdx(0);
  };

  const handleUpdateActivity = (idx, field, val) => {
    setIsPlaying(false);
    const updated = [...activities];
    const num = Math.max(0, Number(val) || 0);
    updated[idx] = { ...updated[idx], [field]: num };
    if (updated[idx].finish <= updated[idx].start) {
      updated[idx].finish = updated[idx].start + 1;
    }
    setActivities(updated);
    setCurrentStepIdx(0);
  };

  // Controls
  const handlePlay = () => {
    if (currentStepIdx >= steps.length - 1) {
      setCurrentStepIdx(0);
    }
    setIsPlaying(true);
  };

  const handleStart = () => {
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepIdx >= steps.length - 1) {
      setCurrentStepIdx(0);
    } else {
      setCurrentStepIdx((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStepIdx((prev) => Math.max(prev - 1, 0));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        document.activeElement && (
          document.activeElement.tagName === 'INPUT' ||
          document.activeElement.tagName === 'TEXTAREA' ||
          document.activeElement.tagName === 'SELECT'
        )
      ) return;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => {
          if (!prev && currentStepIdx >= steps.length - 1) {
            setCurrentStepIdx(0);
            return true;
          }
          return !prev;
        });
      } else if (e.key === 'ArrowRight' || e.code === 'ArrowRight') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIdx((prev) => Math.min(prev + 1, steps.length - 1));
      } else if (e.key === 'ArrowLeft' || e.code === 'ArrowLeft') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIdx((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'r' || e.key === 'R' || e.code === 'KeyR') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIdx(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIdx, steps.length]);

  const maxTimeline = currentFrame.maxTimeline || 12;
  const timeTicks = Array.from({ length: maxTimeline + 1 }, (_, i) => i);

  return (
    <div className="gdp-vis-wrapper">
      {/* Input Configuration Card */}
      <div className="gdp-config-card">
        <div className="gdp-config-header">
          <div className="gdp-config-title">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <span>Activity Intervals Input</span>
          </div>
          <div className="text-xs text-slate-400">
            Rule: Greedy choice selects the compatible activity finishing earliest.
          </div>
        </div>

        {/* Input Table */}
        <div className="gdp-items-input-table">
          <div className="gdp-items-table-header">
            <span>Activity</span>
            <span>Start Time (s)</span>
            <span>Finish Time (f)</span>
            <span>Duration (f - s)</span>
            <span>Action</span>
          </div>
          <div className="gdp-items-table-body">
            {activities.map((act, idx) => (
              <div key={act.id} className="gdp-items-table-row">
                <input
                  type="text"
                  value={act.name}
                  onChange={(e) => {
                    const updated = [...activities];
                    updated[idx].name = e.target.value;
                    setActivities(updated);
                  }}
                  className="gdp-input gdp-input-sm"
                />
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={act.start}
                  onChange={(e) => handleUpdateActivity(idx, 'start', e.target.value)}
                  className="gdp-input gdp-input-sm text-center"
                />
                <input
                  type="number"
                  min="1"
                  max="25"
                  value={act.finish}
                  onChange={(e) => handleUpdateActivity(idx, 'finish', e.target.value)}
                  className="gdp-input gdp-input-sm text-center"
                />
                <div className="gdp-ratio-preview text-slate-300 font-mono">
                  {act.finish - act.start} hrs
                </div>
                <button
                  onClick={() => handleRemoveActivity(idx)}
                  disabled={activities.length <= 2}
                  className="gdp-btn-icon-danger"
                  title="Remove activity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          {activities.length < 8 && (
            <button onClick={handleAddActivity} className="gdp-add-item-btn">
              <Plus className="w-4 h-4 mr-1" /> Add Another Activity
            </button>
          )}
        </div>
      </div>

      {/* Common Controls */}
      <VisualizationControls
        currentStepIdx={currentStepIdx}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        speed={speed}
        onPlay={handlePlay}
        onPause={() => setIsPlaying(false)}
        onNext={handleNext}
        onPrev={handlePrev}
        onReset={handleReset}
        onStart={handleStart}
        onSpeedChange={setSpeed}
        onStepSelect={(idx) => {
          setIsPlaying(false);
          setCurrentStepIdx(idx);
        }}
        samples={SAMPLES}
        currentSampleName={selectedSampleName}
        onSelectSample={handleSelectSample}
        stepDescription={currentFrame.description}
        stepType={currentFrame.type}
      />

      {/* Main Visualization Stage: Timeline & Status */}
      <div className="gdp-stage-grid">
        {/* Left Side: Interactive Horizontal Timeline */}
        <div className="gdp-stage-card">
          <div className="gdp-stage-card-title">
            <Milestone className="w-4 h-4 text-cyan-400" />
            <span>Interactive Horizontal Timeline Chart</span>
            {currentFrame.currentFinishTime > 0 && (
              <span className="ml-auto text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                Resource Busy Until: t = {currentFrame.currentFinishTime}
              </span>
            )}
          </div>

          <div className="gdp-timeline-container">
            {/* Horizontal Time Axis Header */}
            <div className="gdp-time-axis">
              {timeTicks.map((tick) => (
                <div
                  key={tick}
                  className="gdp-time-tick"
                  style={{ left: `${(tick / maxTimeline) * 100}%` }}
                >
                  <span className="gdp-tick-label">{tick}</span>
                  <div className="gdp-tick-line"></div>
                </div>
              ))}
            </div>

            {/* Current Resource Finish Time Boundary Line */}
            {currentFrame.currentFinishTime > 0 && (
              <div
                className="gdp-finish-marker-line"
                style={{ left: `${(currentFrame.currentFinishTime / maxTimeline) * 100}%` }}
              >
                <div className="gdp-marker-flag">
                  Available: t ≥ {currentFrame.currentFinishTime}
                </div>
              </div>
            )}

            {/* Activity Bars */}
            <div className="gdp-timeline-bars">
              {currentFrame.activities.map((act, idx) => {
                const isActive = currentFrame.activeIdx === idx;
                const isCompared = currentFrame.comparedIndices?.includes(idx);
                const leftPercent = (act.start / maxTimeline) * 100;
                const widthPercent = ((act.finish - act.start) / maxTimeline) * 100;

                let barClass = 'bar-pending';
                if (act.status === 'selected') barClass = 'bar-selected';
                else if (act.status === 'rejected') barClass = 'bar-rejected';
                else if (isActive) barClass = 'bar-evaluating';
                else if (isCompared) barClass = 'bar-compared';

                return (
                  <div key={act.id} className="gdp-timeline-row">
                    <div className="gdp-timeline-row-label">
                      <span className="font-semibold text-slate-300">{act.name}</span>
                      <span className="text-xs text-slate-500 font-mono">
                        [{act.start}, {act.finish}]
                      </span>
                    </div>

                    <div className="gdp-timeline-track">
                      <div
                        className={`gdp-activity-bar ${barClass} ${isActive ? 'pulse' : ''}`}
                        style={{
                          left: `${leftPercent}%`,
                          width: `${Math.max(5, widthPercent)}%`
                        }}
                      >
                        <span className="gdp-bar-label">
                          {act.name} ({act.finish - act.start}h)
                        </span>
                        {act.status === 'selected' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 ml-1" />
                        )}
                        {act.status === 'rejected' && (
                          <XCircle className="w-3.5 h-3.5 text-rose-300 ml-1" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Decisions Table & Metrics */}
        <div className="gdp-stage-card">
          <div className="gdp-stage-card-title">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Activity Status & Compatibility Decisions</span>
          </div>

          {/* Metric Badges */}
          <div className="gdp-knapsack-metrics">
            <div className="gdp-metric-card">
              <div className="gdp-metric-label">Total Activities</div>
              <div className="gdp-metric-val text-indigo-400">
                {currentFrame.activities.length}
              </div>
            </div>
            <div className="gdp-metric-card">
              <div className="gdp-metric-label">Compatible (Selected)</div>
              <div className="gdp-metric-val text-emerald-400">
                {currentFrame.selectedList.length}
              </div>
            </div>
            <div className="gdp-metric-card">
              <div className="gdp-metric-label">Conflicts (Rejected)</div>
              <div className="gdp-metric-val text-rose-400">
                {currentFrame.rejectedList.length}
              </div>
            </div>
            <div className="gdp-metric-card">
              <div className="gdp-metric-label">Resource Busy Until</div>
              <div className="gdp-metric-val text-amber-400">
                t = {currentFrame.currentFinishTime}
              </div>
            </div>
          </div>

          {/* Activity Decisions Table */}
          <div className="gdp-table-container">
            <table className="gdp-vis-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Interval</th>
                  <th>Status</th>
                  <th>Reason / Decision Rule</th>
                </tr>
              </thead>
              <tbody>
                {currentFrame.activities.map((act, idx) => {
                  const isActive = currentFrame.activeIdx === idx;
                  let badge = <span className="gdp-status-badge gdp-badge-slate">Pending</span>;
                  let reasonText = 'Waiting for evaluation';

                  if (act.status === 'selected') {
                    badge = <span className="gdp-status-badge gdp-badge-emerald">Selected</span>;
                    reasonText = idx === 0
                      ? 'Earliest finishing activity'
                      : `Start (${act.start}) >= Last Finish (${act.start >= (currentFrame.selectedList[currentFrame.selectedList.findIndex(s => s.id === act.id) - 1]?.finish || 0) ? (currentFrame.selectedList[currentFrame.selectedList.findIndex(s => s.id === act.id) - 1]?.finish || 0) : ''})`;
                  } else if (act.status === 'rejected') {
                    badge = <span className="gdp-status-badge gdp-badge-rose">Rejected</span>;
                    reasonText = act.rejectionReason || 'Overlap conflict detected';
                  } else if (isActive) {
                    badge = <span className="gdp-status-badge gdp-badge-amber">Checking</span>;
                    reasonText = `Checking if Start ${act.start} >= ${currentFrame.currentFinishTime}`;
                  }

                  return (
                    <tr
                      key={act.id}
                      className={
                        act.status === 'selected'
                          ? 'gdp-row-full'
                          : act.status === 'rejected'
                          ? 'gdp-row-rejected'
                          : isActive
                          ? 'gdp-row-active'
                          : ''
                      }
                    >
                      <td className="font-bold text-slate-200">{act.name}</td>
                      <td className="font-mono text-xs">[{act.start}, {act.finish}]</td>
                      <td>{badge}</td>
                      <td className="text-xs text-slate-300">{reasonText}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Selected Schedule Summary Bar */}
          <div className="gdp-manifest-wrapper mt-4">
            <div className="gdp-manifest-title">Optimal Scheduled Sequence:</div>
            {currentFrame.selectedList.length > 0 ? (
              <div className="gdp-manifest-chips">
                {currentFrame.selectedList.map((a, idx) => (
                  <div key={idx} className="gdp-manifest-chip chip-full">
                    <span className="font-bold">{a.name}</span>
                    <span className="gdp-chip-badge">[{a.start} - {a.finish}]</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic">No activity scheduled yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Live Algorithm Execution & Pseudocode Panel */}
      <AlgorithmExecutionPanel
        algoId="activity-selection"
        currentStep={currentFrame}
      />
    </div>
  );
}
