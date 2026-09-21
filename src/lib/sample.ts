// Picks n variants from a joint distribution expressed as per-slot marginals
// (Jev's Choice questions are answered independently, so the joint is the
// product of the per-slot distributions).
//
// Two goals pull against each other: the grid should lean on what Jev
// actually rated well (completion), and the n frames should read as n
// different ideas, not n near-duplicates (variance). So: draw a weighted
// candidate pool (3n, without replacement, probabilities floored), then take
// picks greedily by max-min slot distance, breaking ties toward the likelier
// candidate. Small n (10) makes this cheap.
export function sampleJoint(
  distributions: Record<string, Record<string, number>>,
  n: number,
  exclude: Record<string, string>[] = [],
): Record<string, string>[] {
  const combos = jointCombos(distributions).filter(
    (c) => !exclude.some((ex) => Object.entries(ex).every(([k, v]) => c.schema[k] === v)),
  );
  const pool = weightedSampleWithoutReplacement(combos, Math.min(3 * n, combos.length));
  if (pool.length === 0) return [];
  pool.sort((a, b) => b.weight - a.weight);
  const maxW = pool[0].weight || 1;

  const picks: Combo[] = [pool.shift()!];
  while (picks.length < n && pool.length > 0) {
    let best = 0;
    let bestScore = -1;
    for (let i = 0; i < pool.length; i++) {
      const c = pool[i];
      const minDist = Math.min(...picks.map((p) => slotDistance(p.schema, c.schema)));
      // Distance dominates; weight (0..0.5) only orders candidates at equal distance.
      const score = minDist + 0.5 * (c.weight / maxW);
      if (score > bestScore) {
        bestScore = score;
        best = i;
      }
    }
    picks.push(pool.splice(best, 1)[0]);
  }
  return picks.map((p) => p.schema);
}

function slotDistance(a: Record<string, string>, b: Record<string, string>) {
  let d = 0;
  for (const k of Object.keys(a)) if (a[k] !== b[k]) d++;
  return d;
}

interface Combo {
  schema: Record<string, string>;
  weight: number;
}

function jointCombos(distributions: Record<string, Record<string, number>>): Combo[] {
  let combos: Combo[] = [{ schema: {}, weight: 1 }];
  for (const [slot, probs] of Object.entries(distributions)) {
    const next: Combo[] = [];
    for (const combo of combos) {
      for (const [option, p] of Object.entries(probs)) {
        // Floor rather than drop: Jev routinely puts ~0 on options that are
        // still worth seeing once in an exploration grid; the ordering the
        // distribution implies is preserved, only exclusion is not.
        next.push({ schema: { ...combo.schema, [slot]: option }, weight: combo.weight * Math.max(p, 0.05) });
      }
    }
    combos = next;
  }
  return combos;
}

function weightedSampleWithoutReplacement(items: Combo[], k: number): Combo[] {
  const pool = [...items];
  const picked: Combo[] = [];
  for (let i = 0; i < k; i++) {
    let r = Math.random() * pool.reduce((sum, x) => sum + x.weight, 0);
    let index = pool.length - 1;
    for (let j = 0; j < pool.length; j++) {
      r -= pool[j].weight;
      if (r <= 0) {
        index = j;
        break;
      }
    }
    picked.push(pool[index]);
    pool.splice(index, 1);
  }
  return picked;
}
