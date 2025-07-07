
import { useRef } from "react";

export default function useSequenceAnalysis() {
  const sequenceStatsRef = useRef({}); // Key: 'Vol10-2'

  function recordSequence(volatility, digit, sequence, result) {
    const key = `${volatility}-${digit}`;
    if (!sequenceStatsRef.current[key]) {
      sequenceStatsRef.current[key] = {};
    }

    const chain = sequence.join("→");
    if (!sequenceStatsRef.current[key][chain]) {
      sequenceStatsRef.current[key][chain] = { total: 0, wins: 0, losses: 0, winRate: 0 };
    }

    const record = sequenceStatsRef.current[key][chain];
    record.total += 1;
    if (result === "win") record.wins += 1;
    if (result === "loss") record.losses += 1;
    record.winRate = Math.round((record.wins / record.total) * 100);
  }

  function getSequences(volatility, digit) {
    const key = `${volatility}-${digit}`;
    return sequenceStatsRef.current[key] || {};
  }

  return {
    recordSequence,
    getSequences
  };
}
