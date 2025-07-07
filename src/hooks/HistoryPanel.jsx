// File: src/components/HistoryPanel.jsx

import React from "react";

export default function HistoryPanel({ logs = [] }) {
  if (logs.length === 0) return null;

  const wins = logs.filter((log) => log.result === "break").length;
  const total = logs.length;
  const accuracy = total > 0 ? ((wins / total) * 100).toFixed(1) : 0;

  return (
    <div className="mt-6 p-4 bg-gray-900 border border-gray-700 rounded">
      <h2 className="text-xl font-bold mb-4">📜 Sniper History Log</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-600">
              <th className="p-2">#</th>
              <th className="p-2">Digit</th>
              <th className="p-2">Pattern</th>
              <th className="p-2">Result</th>
              <th className="p-2">Vol</th>
              <th className="p-2">Mode</th>
            </tr>
          </thead>
          <tbody>
            {logs.slice(-100).reverse().map((log, index) => (
              <tr
                key={index}
                className={
                  log.result === "break"
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                <td className="p-2">{total - index}</td>
                <td className="p-2">{log.digit}</td>
                <td className="p-2">{log.pattern}</td>
                <td className="p-2">{log.result}</td>
                <td className="p-2">{log.vol}</td>
                <td className="p-2">{log.mode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-300">
        ✅ <strong>{wins}</strong> sniper wins / ❌ <strong>{total - wins}</strong> fails → 🎯 <strong>{accuracy}%</strong> accuracy
      </div>
    </div>
  );
}
