import React, { useState } from "react";
import useDerivWebSocket from "./hooks/useDerivWebSocket";
import useTickHistoryBuffer from "./hooks/useTickHistoryBuffer";
import usePatternTracker from "./hooks/usePatternTracker";
import useBreakpointAnalysis from "./hooks/useBreakpointAnalysis";
import useBacktestEngine from "./hooks/useBacktestEngine";
import BacktestViewer from "./components/BacktestViewer";

export default function App() {
  const [volatility, setVolatility] = useState("Volatility 100");
  const [ticks, setTicks] = useState([]);
  const [mode, setMode] = useState("live"); // "live" or "history"

  const { addTick, getHistory } = useTickHistoryBuffer();
  const { sniperAlerts, patternClusters } = usePatternTracker(ticks, volatility);
  const { getStats } = useBreakpointAnalysis();
  const { sniperBacktestResults } = useBacktestEngine(getHistory());

  // WebSocket live tick feed
  useDerivWebSocket(volatility, (tick) => {
    addTick(tick);
    setTicks(prev => [...prev.slice(-29), tick]);
  });

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">🎯 Digit Sniper Bot (Deriv)</h1>

      {/* Volatility & Mode Selector */}
      <div className="flex items-center gap-4 mb-4">
        <div>
          <label className="mr-2">Volatility:</label>
          <select
            className="text-black px-2 py-1"
            value={volatility}
            onChange={(e) => setVolatility(e.target.value)}
          >
            <option>Volatility 10</option>
            <option>Volatility 25</option>
            <option>Volatility 50</option>
            <option>Volatility 75</option>
            <option>Volatility 100</option>
          </select>
        </div>
        <div>
          <label className="mr-2">Mode:</label>
          <select
            className="text-black px-2 py-1"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="live">Live</option>
            <option value="history">History</option>
          </select>
        </div>
      </div>

      {/* Live Tick Digit Grid */}
      {mode === "live" && (
        <>
          <div className="grid grid-cols-10 gap-1 bg-gray-900 p-2 rounded mb-4">
            {ticks.map((tick, idx) => (
              <div
                key={idx}
                className="bg-gray-700 text-center rounded py-1 font-mono"
              >
                {tick.digit}
              </div>
            ))}
          </div>

          {/* Sniper Alerts */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">📢 Sniper Alerts</h2>
            {sniperAlerts.length === 0 ? (
              <p>No sniper alerts yet...</p>
            ) : (
              sniperAlerts.map((alert, i) => (
                <div key={i} className="p-2 bg-green-700 rounded mb-1">
                  🧠 Digit {alert.digit} formed {alert.sniperCount} patterns on {alert.volatility}
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Backtest History Viewer */}
      {mode === "history" && (
        <BacktestViewer events={sniperBacktestResults} />
      )}
    </div>
  );
}
