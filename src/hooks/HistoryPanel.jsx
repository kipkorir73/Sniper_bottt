// File: src/HistoryPanel.jsx

import React from "react";

export default function HistoryPanel({ ticks, sniperLog }) {
  const digitStats = Array(10).fill(0);

  ticks.forEach((d) => {
    if (!isNaN(d)) digitStats[d]++;
  });

  return (
    <div className="mt-8 p-4 bg-gray-900 rounded shadow">
      <h3 className="text-xl font-bold mb-3">📜 History (Last 10,000 Ticks)</h3>
      <p className="text-sm mb-2 text-gray-400">Digit Frequencies:</p>
      <div className="grid grid-cols-5 gap-2">
        {digitStats.map((count, digit) => (
          <div
            key={digit}
            className="bg-gray-800 text-white p-2 rounded text-sm flex justify-between"
          >
            <span>Digit {digit}</span>
            <span>{count}x</span>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-2">🧠 Sniper Logs:</h4>
        {sniperLog.length === 0 ? (
          <p className="text-sm text-gray-500">No sniper events yet.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {sniperLog.map((log, index) => (
              <li
                key={index}
                className={`p-2 rounded bg-opacity-20 ${
                  log.result === "break"
                    ? "bg-green-700 text-green-300"
                    : log.result === "continued"
                    ? "bg-red-700 text-red-300"
                    : "bg-yellow-700 text-yellow-300"
                }`}
              >
                Digit {log.digit} → {log.pattern} → <strong>{log.result}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
