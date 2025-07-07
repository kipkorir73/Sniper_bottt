// File: src/components/BacktestEngine.jsx

import React, { useState, useEffect } from "react";
import ReplaySlider from "./ReplaySlider";

function BacktestEngine({ digitHistory, displayVol }) {
  const [index, setIndex] = useState(100);
  const [replayLog, setReplayLog] = useState([]);

  useEffect(() => {
    let log = [];
    let clusterCount = {};
    let lastDigit = null;
    let repeat = 1;

    const sliced = digitHistory
      .filter((d) => d.vol === displayVol)
      .slice(0, index);

    for (let i = 0; i < sliced.length; i++) {
      const current = sliced[i]?.digit;
      if (current === lastDigit) {
        repeat++;
      } else {
        if (repeat >= 2) {
          if (!clusterCount[lastDigit]) clusterCount[lastDigit] = [];
          clusterCount[lastDigit].push({ index: i, count: repeat });
        }
        repeat = 1;
      }
      lastDigit = current;
    }

    let sniperResults = [];

    for (let digit in clusterCount) {
      const entries = clusterCount[digit];
      if (entries.length >= 3) {
        const lastCluster = entries[entries.length - 1];
        const next = sliced[lastCluster.index + 1]?.digit;
        sniperResults.push({
          digit,
          patternCount: entries.length,
          next,
          result: next === Number(digit) ? "❌ Continued" : "✅ Break",
        });
      }
    }

    setReplayLog(sniperResults);
  }, [index, digitHistory]);

  const winRate = (() => {
    const total = replayLog.length;
    const wins = replayLog.filter((x) => x.result === "✅ Break").length;
    return total ? ((wins / total) * 100).toFixed(1) + "%" : "-";
  })();

  return (
    <div className="bg-gray-800 p-4 mt-4 rounded">
      <h2 className="font-semibold mb-2">🎮 Backtest Replay Mode</h2>
      <ReplaySlider
        total={digitHistory.filter((d) => d.vol === displayVol).length}
        currentIndex={index}
        onChange={setIndex}
      />
      <div className="mt-2 text-sm">
        <strong>Replay Entries:</strong> {replayLog.length} <br />
        <strong>Win Rate:</strong> {winRate}
      </div>
      <div className="mt-2 max-h-40 overflow-y-auto text-xs">
        {replayLog.map((r, i) => (
          <div
            key={i}
            className={`flex justify-between border-b ${
              r.result === "✅ Break" ? "text-green-400" : "text-red-400"
            }`}
          >
            <span>Digit {r.digit}</span>
            <span>{r.patternCount}x</span>
            <span>{r.result}</span>
            <span>→ {r.next}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BacktestEngine;
