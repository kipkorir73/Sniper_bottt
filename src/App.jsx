import React, { useState } from "react";
import usePatternTracker from "./hooks/usePatternTracker";
import useBreakpointAnalysis from "./hooks/useBreakpointAnalysis";
import useSequenceAnalysis from "./hooks/useSequenceAnalysis";
import useSniperLog from "./hooks/useSniperLog";
import useDerivWebSocket from "./hooks/useDerivWebSocket";

export default function App() {
  const [volatility, setVolatility] = useState("Volatility 100");
  const [ticks, setTicks] = useState([]);

  const { sniperAlerts, patternClusters } = usePatternTracker(ticks, volatility);
  const { getStats } = useBreakpointAnalysis();
  const { getSequences } = useSequenceAnalysis();
  const { recordSniperEntry, getSniperLogs } = useSniperLog();

  // Connect to Deriv live feed
  useDerivWebSocket(volatility, (tick) => {
    setTicks(prev => [...prev.slice(-29), tick]);
  });

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">🎯 Digit Sniper Bot (Deriv Live)</h1>

      {/* Volatility Selector */}
      <div className="mb-4">
        <label className="mr-2">Select Volatility:</label>
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

      {/* Live Digit Grid */}
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
              🧠 Digit {alert.digit} formed {alert.sniperCount} repeating patterns on {alert.volatility}
            </div>
          ))
        )}
      </div>

      {/* Breakpoint Stats Panel */}
      <div className="mb-6 bg-gray-800 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">📊 Breakpoint Stats (Last Sniper)</h2>
        {sniperAlerts.length > 0 && (() => {
          const last = sniperAlerts[sniperAlerts.length - 1];
          const stat = getStats(last.volatility, last.digit);
          if (!stat) return <p>No data yet.</p>;
          const stats = stat.countStats;
          return (
            <table className="w-full text-sm border border-gray-700">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-2 py-1 border-r border-gray-600">Pattern Count</th>
                  <th className="px-2 py-1 border-r border-gray-600">Breaks</th>
                  <th className="px-2 py-1 border-r border-gray-600">Total</th>
                  <th className="px-2 py-1">Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats).map(([count, s]) => (
                  <tr key={count} className="text-center border-t border-gray-700">
                    <td className="px-2 py-1 border-r border-gray-700">{count}</td>
                    <td className="px-2 py-1 border-r border-gray-700">{s.breaks}</td>
                    <td className="px-2 py-1 border-r border-gray-700">{s.total}</td>
                    <td className="px-2 py-1">{s.winRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          );
        })()}
      </div>

      {/* Sequence Structure Panel */}
      <div className="mb-6 bg-gray-800 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">💡 Pattern Structure Stats (Last Sniper)</h2>
        {sniperAlerts.length > 0 && (() => {
          const last = sniperAlerts[sniperAlerts.length - 1];
          const sequences = getSequences(last.volatility, last.digit);
          const entries = Object.entries(sequences);
          if (entries.length === 0) return <p>No pattern stats yet.</p>;
          return (
            <table className="w-full text-sm border border-gray-700">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-2 py-1 border-r border-gray-600">Pattern Chain</th>
                  <th className="px-2 py-1 border-r border-gray-600">Wins</th>
                  <th className="px-2 py-1 border-r border-gray-600">Losses</th>
                  <th className="px-2 py-1">Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(([chain, s]) => (
                  <tr key={chain} className="text-center border-t border-gray-700">
                    <td className="px-2 py-1 border-r border-gray-700">{chain}</td>
                    <td className="px-2 py-1 border-r border-gray-700">{s.wins}</td>
                    <td className="px-2 py-1 border-r border-gray-700">{s.losses}</td>
                    <td className="px-2 py-1">{s.winRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          );
        })()}
      </div>

      {/* Sniper Log */}
      <div className="mb-6 bg-gray-800 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">🧠 Sniper Entry Log</h2>
        <table className="w-full text-sm border border-gray-700">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-2 py-1 border-r border-gray-600">Time</th>
              <th className="px-2 py-1 border-r border-gray-600">Digit</th>
              <th className="px-2 py-1 border-r border-gray-600">Vol</th>
              <th className="px-2 py-1 border-r border-gray-600">Count</th>
              <th className="px-2 py-1 border-r border-gray-600">Chain</th>
              <th className="px-2 py-1">Result</th>
            </tr>
          </thead>
          <tbody>
            {getSniperLogs().map((log, idx) => (
              <tr key={idx} className="text-center border-t border-gray-700">
                <td className="px-2 py-1 border-r border-gray-700">{new Date(log.time * 1000).toLocaleTimeString()}</td>
                <td className="px-2 py-1 border-r border-gray-700">{log.digit}</td>
                <td className="px-2 py-1 border-r border-gray-700">{log.volatility}</td>
                <td className="px-2 py-1 border-r border-gray-700">{log.sniperCount}</td>
                <td className="px-2 py-1 border-r border-gray-700">{log.groupChain.join("→")}</td>
                <td className="px-2 py-1">{log.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

