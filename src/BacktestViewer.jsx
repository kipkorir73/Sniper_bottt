// File: src/BacktestViewer.jsx

import React from "react";

export default function BacktestViewer({ events }) {
  if (!events || events.length === 0) return null;

  return (
    <div className="bg-gray-900 p-4 mt-4 rounded">
      <h2 className="text-xl font-semibold mb-2">📈 Backtest Summary</h2>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="p-1">#</th>
            <th className="p-1">Digit</th>
            <th className="p-1">Clusters</th>
            <th className="p-1">Result</th>
          </tr>
        </thead>
        <tbody>
          {events.map((entry, i) => (
            <tr
              key={i}
              className={`${
                entry.result === "✅ Break" ? "text-green-400" : "text-red-400"
              } border-b border-gray-800`}
            >
              <td className="p-1">{i + 1}</td>
              <td className="p-1">{entry.digit}</td>
              <td className="p-1">{entry.clusters.join(" → ")}</td>
              <td className="p-1">{entry.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
