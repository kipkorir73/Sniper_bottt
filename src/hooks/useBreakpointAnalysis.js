
import { useRef } from "react";

export default function useBreakpointAnalysis() {
  const breakStatsRef = useRef({}); // Key: "Vol10-2"

  function recordPatternResult(volatility, digit, patternCount, broke) {
    const key = `${volatility}-${digit}`;
    if (!breakStatsRef.current[key]) {
      breakStatsRef.current[key] = {
        digit,
        countStats: {},
        maxSeen: 0
      };
    }

    const stats = breakStatsRef.current[key];
    if (!stats.countStats[patternCount]) {
      stats.countStats[patternCount] = { total: 0, breaks: 0, winRate: 0 };
    }

    stats.countStats[patternCount].total += 1;
    if (broke) stats.countStats[patternCount].breaks += 1;

    const c = stats.countStats[patternCount];
    c.winRate = Math.round(100 * (1 - c.breaks / c.total));
    stats.maxSeen = Math.max(stats.maxSeen, patternCount);
  }

  function getStats(volatility, digit) {
    const key = `${volatility}-${digit}`;
    return breakStatsRef.current[key] || null;
  }

  return {
    recordPatternResult,
    getStats
  };
}
