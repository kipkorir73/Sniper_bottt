// File: src/components/BacktestReplayPanel.jsx

import React, { useState, useEffect } from "react";

function BacktestReplayPanel({ digits, clusters, sniperLog }) {
  const [replayIndex, setReplayIndex] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);

  const displayDigits = digits.slice(0, replayIndex);

  const displaySnipers = sniperLog.filter(
    (log) => log.timestamp <= (displayDigits[displayDigits.length - 1]?.timestamp || 0)
  );

  const handleReplay = () => {
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setReplayIndex((prev) => {
          if (prev < digits.length) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, digits]);

  return (
    <div className="bg-gray-800 mt-6 p-4 rounded">
      <h2 className="font-semibold mb-2">🎬 Backtest Replay</h2>
      <div className="flex items-center gap-4 mb-4">
        <input
          type="range"
          min={30}
          max={digits.length}
          value={replayIndex}
          onChange={(e) => setReplayIndex(Number(e.target.value))}
          className="w-full"
        />
        <button
          onClick={handleReplay}
          className="bg-blue-600 px-3 py-1 rounded text-sm"
        >
          {isPlaying ? "⏸ Pause" : "▶️ Play"}
        </button>
      </div>

      <div className="grid grid-cols-10 gap-1 text-sm mb-2">
        {displayDigits.slice(-30).map((d, i) => (
          <div
            key={i}
            className="text-center p-1 rounded bg-gray-700"
          >
            {d.digit}
          </div>
        ))}
      </div>

      <div className="text-xs mt-2">
        <strong>Snipers Triggered by This Point:</strong>
        <ul className="max-h-32 overflow-y-auto mt-1">
          {displaySnipers.map((entry, idx) => (
            <li key={idx}>
              🧠 Digit {entry.digit} | {entry.result} | {entry.patternCount}x |{" "}
              {new Date(entry.timestamp).toLocaleTimeString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BacktestReplayPanel;

