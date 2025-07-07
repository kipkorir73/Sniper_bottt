import { useMemo } from "react";

function groupClusters(digits) {
  const clusters = [];
  let current = [];
  for (let i = 0; i < digits.length; i++) {
    if (i === 0 || digits[i] === digits[i - 1]) {
      current.push(digits[i]);
    } else {
      if (current.length > 1) {
        clusters.push({ digit: current[0], count: current.length, endIndex: i - 1 });
      }
      current = [digits[i]];
    }
  }
  if (current.length > 1) {
    clusters.push({ digit: current[0], count: current.length, endIndex: digits.length - 1 });
  }
  return clusters;
}

function simulateSniperBacktest(ticks) {
  const digits = ticks.map(t => t.digit);
  const sniperEvents = [];

  for (let i = 0; i < ticks.length; i++) {
    const subDigits = digits.slice(0, i + 1);
    const clusters = groupClusters(subDigits);
    const lastCluster = clusters[clusters.length - 1];

    if (!lastCluster) continue;

    const digit = lastCluster.digit;
    const history = clusters.filter(c => c.digit === digit);
    if (history.length >= 3) {
      const triggerIndex = lastCluster.endIndex;
      const nextTick = ticks[triggerIndex + 1];
      const broke = nextTick?.digit !== digit;
      sniperEvents.push({
        entryIndex: triggerIndex,
        digit,
        patternCount: history.length,
        structure: history.slice(-3).map(h => "G" + h.count).join("→"),
        result: broke ? "WIN" : "LOSS"
      });
    }
  }

  return sniperEvents;
}

export default function useBacktestEngine(ticks) {
  const events = useMemo(() => {
    return simulateSniperBacktest(ticks);
  }, [ticks]);

  return {
    sniperBacktestResults: events
  };
}

