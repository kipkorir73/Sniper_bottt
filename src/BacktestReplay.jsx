// File: src/BacktestReplay.jsx

import React, { useState, useEffect } from "react";

export default function BacktestReplay({ ticks, onReplayTick }) {
  const [replaying, setReplaying] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let interval;
    if (replaying && index < ticks.length) {
      interval = setInterval(() => {
        onReplayTick(ticks[index]);
        setIndex((prev) => prev + 1);
      }, 50); // 20 ticks/sec
    } else if (index >= ticks.length) {
      setReplaying(false);
      setIndex(0);
    }
    return () => clearInterval(interval);
  }, [replaying, index, ticks]);

  return (
    <div className="mt-6 p-4 bg-blue-900 rounded">
      <h3 className="text-lg font-semibold mb-2">⏪ Backtest Replay Mode</h3>
      <p className="text-sm text-gray-300 mb-2">
        Replays the last {ticks.length} ticks and runs your strategy on them.
      </p>
      <button
        onClick={() => {
          setIndex(0);
          setReplaying(true);
        }}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        disabled={replaying}
      >
        {replaying ? "Replaying..." : "Start Replay"}
      </button>
    </div>
  );
}
