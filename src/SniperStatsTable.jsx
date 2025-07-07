// File: src/SniperStatsTable.jsx

import React from "react";

export default function SniperStatsTable({ sniperLog }) {
  const stats = Array(10).fill(null).map((_, digit) => ({
    digit,
    total: 0,
    breaks: 0,
    continues: 0,
  }));

  sniperLog.forEach(({ digit, result }) => {
    const stat = stats[digit];
    stat.total++;
    if (result === "break") stat.breaks++;
    else if (result === "continued") stat.continues++;
  });

  return (
    <div className="mt-8 p-4 bg-gray-800 text-white rounded shadow">
      <h3 className="text-xl font-bold mb-3">📈 Sniper Performance Stats</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-700">
            <th className="text-left p-2">Digit</th>
            <th className="text-left p-2">Total Entries</th>
            <th className="text-left p-2">Breaks</th>
            <th className="text-left p-2">Continued</th>
            <th className="text-left p-2">Win Rate</th>
          </tr>
        </thead>
        <tbody>
          {stats.map(({ digit, total, breaks, continues }) => (
            <tr key={digit} className="border-b border-gray-600">
              <td className="p-2">{digit}</td>
              <td className="p-2">{total}</td>
              <td className="p-2 text-green-400">{breaks}</td>
              <td className="p-2 text-red-400">{continues}</td>
              <td className="p-2">
                {total > 0 ? `${Math.round((breaks / total) * 100)}%` : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
