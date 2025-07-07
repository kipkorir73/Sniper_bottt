import React from "react";

export default function BacktestViewer({ events }) {
  if (!events || events.length === 0) {
    return (
      <div className="bg-gray-800 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">📈 Backtest History</h2>
        <p>No sniper events found in the 10K tick history.</p>
      </div>
    );
  }

  const winRate = (
    (events.filter(e => e.result === "WIN").length / events.length) * 100
  ).toFixed(2);

  return (
    <div className="bg-gray-800 p-4 rounded mb-6">
      <h2 className="text-xl font-semibold mb-2">📈 Backtest History (10K Ticks)</h2>
      <p className="mb-2">Total Sniper Entries: {events.length}</p>
      <p className="mb-4">Overall Win Rate: {winRate}%</p>

      <table className="w-full text-sm border border-gray-700">
        <thead>
          <tr className="bg-gray-700">
            <th className="px-2 py-1 border-r border-gray-600">#</th>
            <th className="px-2 py-1 border-r border-gray-600">Digit</th>
            <th className="px-2 py-1 border-r border-gray-600">Clusters</th>
            <th className="px-2 py-1 border-r border-gray-600">Structure</th>
            <th className="px-2 py-1">Result</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e, i) => (
            <tr
              key={i}
              className={`text-center border-t ${
                e.result === "WIN" ? "bg-green-800" : "bg-red-800"
              }`}
            >
              <td className="px-2 py-1 border-r border-gray-700">{i + 1}</td>
              <td className="px-2 py-1 border-r border-gray-700">{e.digit}</td>
              <td className="px-2 py-1 border-r border-gray-700">{e.patternCount}</td>
              <td className="px-2 py-1 border-r border-gray-700">{e.structure}</td>
              <td className="px-2 py-1 font-bold">{e.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
