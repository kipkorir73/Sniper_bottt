// File: src/BacktestEngine.jsx

import React, { useEffect, useState } from "react";

const BacktestEngine = ({ digits, config, mode }) => {
  const [backtestResults, setBacktestResults] = useState({});

  useEffect(() => {
    if (digits.length < 1000) return;

    const clusters = [];
    const filtered = digits.filter((d) => config.digits.includes(d.digit));

    // Build clusters from digit stream
    for (let i = 1; i < filtered.length; i++) {
      const prev = filtered[i - 1];
      const curr = filtered[i];

      if (prev.digit === curr.digit) {
        const lastCluster = clusters[clusters.length - 1];
        if (lastCluster && lastCluster.digit === curr.digit && lastCluster.end === i - 1) {
          lastCluster.count++;
          lastCluster.end = i;
        } else {
          clusters.push({ digit: curr.digit, count: 2, start: i - 1, end: i });
        }
      }
    }

    // Group by digit
    const grouped = {};
    clusters.forEach((c) => {
      if (!grouped[c.digit]) grouped[c.digit] = [];
      grouped[c.digit].push(c);
    });

    const triggerLevel = mode === "classic" ? 3 : mode === "aggressive" ? 2 : 4;
    const result = {};

    for (const digitStr in grouped) {
      const digit = Number(digitStr);
      const clusterList = grouped[digit];
      let wins = 0;
      let total = 0;

      for (let i = 0; i < clusterList.length - triggerLevel; i++) {
        const slice = clusterList.slice(i, i + triggerLevel);
        const afterIndex = clusterList[i + triggerLevel]?.end + 1;
        const next = digits[afterIndex];
        if (next) {
          total++;
          if (next.digit !== digit) wins++;
        }
      }

      result[digit] = {
        total,
        wins,
        rate: total ? ((wins / total) * 100).toFixed(1) : 0,
      };
    }

    setBacktestResults(result);
  }, [digits, config, mode]);

  return (
    <div className="bg-gray-800 text-white p-4 rounded">
      <h2 className="font-semibold mb-2">📊 Backtest Results (last {digits.length} ticks)</h2>
      <div className="grid grid-cols-3 gap-2 text-sm">
        {Object.entries(backtestResults).map(([digit, data]) => (
          <div key={digit} className="bg-gray-700 p-2 rounded">
            <div>Digit {digit}</div>
            <div>
              {data.wins}/{data.total} wins
            </div>
            <div>{data.rate}% win rate</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BacktestEngine;
