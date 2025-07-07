// File: src/components/DigitSuccessStats.jsx

import React from "react";

function DigitSuccessStats({ sniperLog }) {
  const summary = {};

  sniperLog.forEach((entry) => {
    const { digit, result } = entry;
    if (!summary[digit]) {
      summary[digit] = { total: 0, breaks: 0, continues: 0 };
    }
    summary[digit].total++;
    if (result.includes("Break")) summary[digit].breaks++;
    else summary[digit].continues++;
  });

  const getRate = (b, t) => (t ? ((b / t) * 100).toFixed(1) + "%" : "0%");

  return (
    <div className="bg-gray-800 p-4 mt-4 rounded">
      <h2 className="font-semibold mb-2">📈 Sniper Success by Digit</h2>
      <table className="text-sm w-full text-left">
        <thead>
          <tr>
            <th className="pr-2">Digit</th>
            <th className="pr-2">Snipes</th>
            <th className="pr-2">✅ Breaks</th>
            <th className="pr-2">❌ Continues</th>
            <th className="pr-2">Win Rate</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(summary).map(([digit, data]) => (
            <tr key={digit}>
              <td className="pr-2">{digit}</td>
              <td className="pr-2">{data.total}</td>
              <td className="pr-2">{data.breaks}</td>
              <td className="pr-2">{data.continues}</td>
              <td className="pr-2">{getRate(data.breaks, data.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DigitSuccessStats;
