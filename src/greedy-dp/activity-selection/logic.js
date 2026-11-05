/**
 * Activity Selection Step Generator
 * 
 * Generates immutable snapshot states for:
 * 1. Initial display on table and horizontal timeline
 * 2. Sorting by finish time ascending (with comparisons and swaps)
 * 3. Selecting the first activity (earliest finish time)
 * 4. Step-by-step compatibility checks (Start >= LastFinish)
 * 5. Selection (green) vs Rejection (red/grey with conflict reason)
 * 6. Final compatible schedule and timeline
 */

export function generateActivitySteps(rawActivities) {
  const steps = [];

  // Deep clone input activities
  let acts = rawActivities.map((a, idx) => ({
    id: a.id || `A${idx + 1}`,
    name: a.name || `Activity ${idx + 1}`,
    start: Math.max(0, Number(a.start) || 0),
    finish: Math.max(1, Number(a.finish) || 1),
    status: 'pending', // 'pending' | 'sorting' | 'evaluating' | 'selected' | 'rejected'
    rejectionReason: null
  }));

  // Ensure start < finish
  acts.forEach((a) => {
    if (a.start >= a.finish) {
      a.finish = a.start + 1;
    }
  });

  const maxTimeline = Math.max(...acts.map((a) => a.finish), 10);

  // Step 1: Initial unsorted state
  steps.push({
    type: 'init',
    activities: JSON.parse(JSON.stringify(acts)),
    currentFinishTime: 0,
    selectedList: [],
    rejectedList: [],
    activeIdx: null,
    comparedIndices: [],
    maxTimeline,
    description: `Loaded ${acts.length} activities on the timeline. Need to sort them by finish times.`
  });

  // Step 2: Sort activities by finish time ascending
  const n = acts.length;
  steps.push({
    type: 'sort_start',
    activities: JSON.parse(JSON.stringify(acts)),
    currentFinishTime: 0,
    selectedList: [],
    rejectedList: [],
    activeIdx: null,
    comparedIndices: [],
    maxTimeline,
    description: 'Beginning sorting of activities by finish time in non-decreasing order (earliest finish first).'
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        type: 'sort_compare',
        activities: JSON.parse(JSON.stringify(acts)),
        currentFinishTime: 0,
        selectedList: [],
        rejectedList: [],
        activeIdx: null,
        comparedIndices: [j, j + 1],
        maxTimeline,
        description: `Comparing finish times: ${acts[j].name} (Finish: ${acts[j].finish}) vs ${acts[j + 1].name} (Finish: ${acts[j + 1].finish})`
      });

      if (acts[j].finish > acts[j + 1].finish) {
        const temp = acts[j];
        acts[j] = acts[j + 1];
        acts[j + 1] = temp;

        steps.push({
          type: 'sort_swap',
          activities: JSON.parse(JSON.stringify(acts)),
          currentFinishTime: 0,
          selectedList: [],
          rejectedList: [],
          activeIdx: null,
          comparedIndices: [j, j + 1],
          maxTimeline,
          description: `Swapped: ${acts[j].name} finishes earlier than ${acts[j + 1].name}, moving forward.`
        });
      }
    }
  }

  steps.push({
    type: 'sort_complete',
    activities: JSON.parse(JSON.stringify(acts)),
    currentFinishTime: 0,
    selectedList: [],
    rejectedList: [],
    activeIdx: null,
    comparedIndices: [],
    maxTimeline,
    description: 'Sorting completed! All activities are now ordered by finish times. Ready for greedy selection.'
  });

  // Step 3: Select the first activity
  let currentFinishTime = acts[0].finish;
  acts[0].status = 'selected';
  const selectedList = [JSON.parse(JSON.stringify(acts[0]))];
  const rejectedList = [];

  steps.push({
    type: 'select_first',
    activities: JSON.parse(JSON.stringify(acts)),
    currentFinishTime,
    selectedList: JSON.parse(JSON.stringify(selectedList)),
    rejectedList: [],
    activeIdx: 0,
    comparedIndices: [],
    maxTimeline,
    description: `Selected 1st Activity ${acts[0].name} (Interval [${acts[0].start}, ${acts[0].finish}]): finishes earliest among all activities. Resource marker set to finish time ${currentFinishTime}.`
  });

  // Step 4 & 5: Check remaining activities
  for (let i = 1; i < acts.length; i++) {
    const act = acts[i];

    // Evaluating step
    steps.push({
      type: 'eval_activity',
      activities: JSON.parse(JSON.stringify(acts)),
      currentFinishTime,
      selectedList: JSON.parse(JSON.stringify(selectedList)),
      rejectedList: JSON.parse(JSON.stringify(rejectedList)),
      activeIdx: i,
      comparedIndices: [],
      maxTimeline,
      description: `Evaluating ${act.name} [Start: ${act.start}, Finish: ${act.finish}]: Comparing Start Time (${act.start}) >= Last Finish Time (${currentFinishTime})`
    });

    if (act.start >= currentFinishTime) {
      // Compatible -> Select
      act.status = 'selected';
      currentFinishTime = act.finish;
      selectedList.push(JSON.parse(JSON.stringify(act)));

      steps.push({
        type: 'activity_selected',
        activities: JSON.parse(JSON.stringify(acts)),
        currentFinishTime,
        selectedList: JSON.parse(JSON.stringify(selectedList)),
        rejectedList: JSON.parse(JSON.stringify(rejectedList)),
        activeIdx: i,
        comparedIndices: [],
        maxTimeline,
        description: `Compatible! ${act.name} starts at ${act.start} which is >= ${selectedList[selectedList.length - 2]?.finish || 0}. Activity SELECTED! Advanced marker to ${currentFinishTime}.`
      });
    } else {
      // Conflict -> Reject
      act.status = 'rejected';
      act.rejectionReason = `Starts at ${act.start}, but resource is busy until ${currentFinishTime} (Overlap of ${currentFinishTime - act.start} units)`;
      rejectedList.push(JSON.parse(JSON.stringify(act)));

      steps.push({
        type: 'activity_rejected',
        activities: JSON.parse(JSON.stringify(acts)),
        currentFinishTime,
        selectedList: JSON.parse(JSON.stringify(selectedList)),
        rejectedList: JSON.parse(JSON.stringify(rejectedList)),
        activeIdx: i,
        comparedIndices: [],
        maxTimeline,
        description: `Conflict Detected! ${act.name} starts at ${act.start} < Last Finish Time ${currentFinishTime}. Resource occupied — REJECTED!`
      });
    }
  }

  // Step 6: Final result
  steps.push({
    type: 'complete',
    activities: JSON.parse(JSON.stringify(acts)),
    currentFinishTime,
    selectedList: JSON.parse(JSON.stringify(selectedList)),
    rejectedList: JSON.parse(JSON.stringify(rejectedList)),
    activeIdx: null,
    comparedIndices: [],
    maxTimeline,
    description: `Optimal Schedule Created! Selected ${selectedList.length} non-overlapping activities (${selectedList.map((a) => a.name).join(', ')}) out of ${acts.length} total.`
  });

  return {
    steps,
    summary: {
      totalActivities: acts.length,
      selectedCount: selectedList.length,
      rejectedCount: rejectedList.length,
      selectedActivities: selectedList,
      rejectedActivities: rejectedList
    }
  };
}

