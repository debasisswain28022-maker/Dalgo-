/**
 * Fractional Knapsack Step Generator
 * 
 * Generates immutable snapshot states for:
 * 1. Initial items table
 * 2. Ratio calculation per item (animated)
 * 3. Sorting by ratio descending (with comparisons and swaps)
 * 4. Step-by-step knapsack filling (full, partial, rejected)
 * 5. Final summary
 */

export function generateKnapsackSteps(rawItems, capacity) {
  const steps = [];
  const W = Math.max(0, Number(capacity) || 0);

  // Deep clone input items
  let items = rawItems.map((item, idx) => ({
    id: item.id || `I${idx + 1}`,
    name: item.name || `Item ${idx + 1}`,
    weight: Math.max(0.1, Number(item.weight) || 1),
    value: Math.max(0, Number(item.value) || 0),
    ratio: null,
    fraction: 0,
    status: 'pending' // 'pending' | 'calculating' | 'comparing' | 'swapping' | 'sorted' | 'full' | 'partial' | 'rejected'
  }));

  // Step 1: Initial state
  steps.push({
    type: 'init',
    items: JSON.parse(JSON.stringify(items)),
    capacity: W,
    remainingCapacity: W,
    totalProfit: 0,
    totalWeight: 0,
    knapsackContents: [],
    activeItemIdx: null,
    comparedIndices: [],
    description: `Loaded ${items.length} items with Knapsack Capacity = ${W}. Ready to calculate value-to-weight ratios.`
  });

  // Step 2: Calculate value/weight ratio for each item
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const calcRatio = Number((item.value / item.weight).toFixed(2));

    // Show calculating state
    steps.push({
      type: 'calc_ratio',
      items: JSON.parse(JSON.stringify(items)),
      capacity: W,
      remainingCapacity: W,
      totalProfit: 0,
      totalWeight: 0,
      knapsackContents: [],
      activeItemIdx: i,
      comparedIndices: [],
      description: `Calculating Ratio for ${item.name}: Value (${item.value}) ÷ Weight (${item.weight}) = ${calcRatio}`
    });

    item.ratio = calcRatio;

    // Show updated state with ratio set
    steps.push({
      type: 'ratio_computed',
      items: JSON.parse(JSON.stringify(items)),
      capacity: W,
      remainingCapacity: W,
      totalProfit: 0,
      totalWeight: 0,
      knapsackContents: [],
      activeItemIdx: i,
      comparedIndices: [],
      description: `${item.name} ratio computed: ${item.ratio}`
    });
  }

  // Step 3: Sort items by ratio in descending order (using Bubble/Insertion sort steps for clear visual tracking)
  const n = items.length;
  steps.push({
    type: 'sort_start',
    items: JSON.parse(JSON.stringify(items)),
    capacity: W,
    remainingCapacity: W,
    totalProfit: 0,
    totalWeight: 0,
    knapsackContents: [],
    activeItemIdx: null,
    comparedIndices: [],
    description: 'Starting descending sort based on value-to-weight ratios (highest ratio first).'
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Comparison step
      steps.push({
        type: 'sort_compare',
        items: JSON.parse(JSON.stringify(items)),
        capacity: W,
        remainingCapacity: W,
        totalProfit: 0,
        totalWeight: 0,
        knapsackContents: [],
        activeItemIdx: null,
        comparedIndices: [j, j + 1],
        description: `Comparing ${items[j].name} (Ratio ${items[j].ratio}) with ${items[j + 1].name} (Ratio ${items[j + 1].ratio})`
      });

      if (items[j].ratio < items[j + 1].ratio) {
        // Swap items
        const temp = items[j];
        items[j] = items[j + 1];
        items[j + 1] = temp;

        steps.push({
          type: 'sort_swap',
          items: JSON.parse(JSON.stringify(items)),
          capacity: W,
          remainingCapacity: W,
          totalProfit: 0,
          totalWeight: 0,
          knapsackContents: [],
          activeItemIdx: null,
          comparedIndices: [j, j + 1],
          description: `Swapped: ${items[j].name} placed ahead of ${items[j + 1].name} to maintain descending ratio order.`
        });
      }
    }
  }

  steps.push({
    type: 'sort_complete',
    items: JSON.parse(JSON.stringify(items)),
    capacity: W,
    remainingCapacity: W,
    totalProfit: 0,
    totalWeight: 0,
    knapsackContents: [],
    activeItemIdx: null,
    comparedIndices: [],
    description: 'Items sorted successfully in descending order of ratio. Proceeding to knapsack filling.'
  });

  // Step 4: Fill the knapsack
  let remainingCapacity = W;
  let accumulatedProfit = 0;
  let accumulatedWeight = 0;
  const knapsackContents = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    // Evaluate item step
    steps.push({
      type: 'knapsack_eval',
      items: JSON.parse(JSON.stringify(items)),
      capacity: W,
      remainingCapacity,
      totalProfit: Number(accumulatedProfit.toFixed(2)),
      totalWeight: Number(accumulatedWeight.toFixed(2)),
      knapsackContents: JSON.parse(JSON.stringify(knapsackContents)),
      activeItemIdx: i,
      comparedIndices: [],
      description: `Evaluating ${item.name}: Weight = ${item.weight}, Remaining Capacity = ${remainingCapacity.toFixed(2)}`
    });

    if (remainingCapacity <= 0) {
      // Knapsack already full, reject this item
      item.fraction = 0;
      item.status = 'rejected';

      steps.push({
        type: 'knapsack_reject',
        items: JSON.parse(JSON.stringify(items)),
        capacity: W,
        remainingCapacity,
        totalProfit: Number(accumulatedProfit.toFixed(2)),
        totalWeight: Number(accumulatedWeight.toFixed(2)),
        knapsackContents: JSON.parse(JSON.stringify(knapsackContents)),
        activeItemIdx: i,
        comparedIndices: [],
        description: `Rejected ${item.name}: Knapsack is at maximum capacity (0 capacity remaining).`
      });
      continue;
    }

    if (item.weight <= remainingCapacity) {
      // Full item fits
      item.fraction = 1.0;
      item.status = 'full';
      accumulatedProfit += item.value;
      accumulatedWeight += item.weight;
      remainingCapacity -= item.weight;

      knapsackContents.push({
        id: item.id,
        name: item.name,
        weightTaken: item.weight,
        valueGained: item.value,
        fraction: 1.0,
        status: 'full',
        colorIdx: i
      });

      steps.push({
        type: 'knapsack_take_full',
        items: JSON.parse(JSON.stringify(items)),
        capacity: W,
        remainingCapacity: Number(remainingCapacity.toFixed(2)),
        totalProfit: Number(accumulatedProfit.toFixed(2)),
        totalWeight: Number(accumulatedWeight.toFixed(2)),
        knapsackContents: JSON.parse(JSON.stringify(knapsackContents)),
        activeItemIdx: i,
        comparedIndices: [],
        description: `Full Item Selected: Took 100% of ${item.name}. Gained +${item.value} profit, +${item.weight} weight. Remaining Capacity: ${remainingCapacity.toFixed(2)}`
      });
    } else {
      // Partial item taken
      const fraction = remainingCapacity / item.weight;
      const roundedFraction = Number(fraction.toFixed(4));
      const partialWeight = remainingCapacity;
      const partialProfit = item.value * fraction;

      item.fraction = roundedFraction;
      item.status = 'partial';
      accumulatedProfit += partialProfit;
      accumulatedWeight += partialWeight;
      remainingCapacity = 0;

      knapsackContents.push({
        id: item.id,
        name: item.name,
        weightTaken: Number(partialWeight.toFixed(2)),
        valueGained: Number(partialProfit.toFixed(2)),
        fraction: roundedFraction,
        status: 'partial',
        colorIdx: i
      });

      steps.push({
        type: 'knapsack_take_partial',
        items: JSON.parse(JSON.stringify(items)),
        capacity: W,
        remainingCapacity: 0,
        totalProfit: Number(accumulatedProfit.toFixed(2)),
        totalWeight: Number(accumulatedWeight.toFixed(2)),
        knapsackContents: JSON.parse(JSON.stringify(knapsackContents)),
        activeItemIdx: i,
        comparedIndices: [],
        description: `Partial Fraction Selected: Knapsack capacity only has ${partialWeight.toFixed(2)} remaining. Took fraction ${roundedFraction} (${(fraction * 100).toFixed(1)}%) of ${item.name} for +${partialProfit.toFixed(2)} profit. Knapsack is now 100% full!`
      });
    }
  }

  // Step 5: Final state
  steps.push({
    type: 'complete',
    items: JSON.parse(JSON.stringify(items)),
    capacity: W,
    remainingCapacity: Number(remainingCapacity.toFixed(2)),
    totalProfit: Number(accumulatedProfit.toFixed(2)),
    totalWeight: Number(accumulatedWeight.toFixed(2)),
    knapsackContents: JSON.parse(JSON.stringify(knapsackContents)),
    activeItemIdx: null,
    comparedIndices: [],
    description: `Optimal Solution Found! Total Weight: ${accumulatedWeight.toFixed(2)} / ${W}, Maximum Profit: ${accumulatedProfit.toFixed(2)}.`
  });

  return {
    steps,
    summary: {
      totalWeight: Number(accumulatedWeight.toFixed(2)),
      maxProfit: Number(accumulatedProfit.toFixed(2)),
      capacity: W,
      items: JSON.parse(JSON.stringify(items))
    }
  };
}

