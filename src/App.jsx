// File: src/App.jsx

import React, { useEffect, useState } from "react";
import useDerivWebSocket from "./useDerivWebSocket";
import useSniperTracker from "./useSniperTracker";
import useBacktestEngine from "./useBacktestEngine";
import BacktestViewer from "./BacktestViewer";
import { speak } from "./speechAlerts";

export default function App() {
  const [volatility, setVolatility] = useState("R_100");
  const [tickLimit] = useState(10000);

  const { ticks, digit } = useDerivWebSocket(volatility);
  const {
    sniperAlert,
    sniperDigit,
    clusterLog,
    sniperLog,
    sniperZone,
    handleTick
  } = useSniperTracker();

  const backtest = useBacktestEngine(ticks, handleTick);

  useEffect(() => {
    if (digit !== null) handleTick(digit);
  }, [digit]);

  useEffect(() => {
    if (sniperAlert && sniperDigit !== null) {
      speak(
        `Sniper Alert: Digit ${sniperDigit} formed multiple clusters. Watch for a break. Volatility ${volatility}`
      );
    }
  }, [sniperAlert]);

  return (
    <div className="min-h-screen bg-black text-white p-4 font-mono">
      <h1 className="text-2xl mb-4 font-bold">🎯 Deriv Digit Differ Sniper</h1>

      <div className="mb-4">
        <label className="mr-2">Volatility:</label>
        <select
          className="bg-gray-800 px-2 py-1"
          value={volatility}
          onChange={(e) => setVolatility(e.target.value)}
        >
          {[
            "R_10",
            "R_25",
            "R_50",
            "R_75",
            "R_100"
          ].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">🧠 Last 30 Digits:</h2>
        <div className="flex gap-1 flex-wrap">
          {ticks.slice(-30).map((d, i) => (
            <span key={i} className="bg-gray-700 px-2 py-1 rounded">
              {d}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">📊 Cluster Tracker:</h2>
        {Object.entries(clusterLog).map(([digit, groups]) => (
          <div key={digit} className="mb-1">
            Digit {digit}: {groups.join(" → ")}
          </div>
        ))}
      </div>

      <div className="mb-4">
        {sniperAlert && (
          <div className="p-4 bg-red-800 rounded">
            🚨 Sniper Alert: Digit {sniperDigit} has formed {clusterLog[sniperDigit].length} clusters. Watch next tick!
          </div>
        )}

        {sniperZone && (
          <div className="p-4 bg-yellow-700 rounded mt-2">
            🎯 Sniper Zone Active: Awaiting confirmation for digit {sniperDigit}...
          </div>
        )}
      </div>

      <BacktestViewer events={sniperLog} />
    </div>
  );
}
