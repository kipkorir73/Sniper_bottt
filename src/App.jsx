
import { useEffect, useState } from 'react';
import usePatternTracker from './hooks/usePatternTracker';
import useBreakpointAnalysis from './hooks/useBreakpointAnalysis';
import useSequenceAnalysis from './hooks/useSequenceAnalysis';

function App() {
  const [ticks, setTicks] = useState([]);
  const [volatility, setVolatility] = useState('Volatility 100');

  // Simulate WebSocket tick stream (you will replace with real Deriv API logic)
  useEffect(() => {
    const interval = setInterval(() => {
      const price = 100 + Math.random(); // Simulate random price
      const time = Date.now();
      const newTick = { price, time, volatility };
      setTicks(prev => [...prev.slice(-9999), newTick]);
    }, 1000);
    return () => clearInterval(interval);
  }, [volatility]);

  const { sniperAlerts, tickHistory, patternClusters } = usePatternTracker(ticks, volatility);
  const { getStats } = useBreakpointAnalysis();
  const { getSequences } = useSequenceAnalysis();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-mono">
      <h1 className="text-2xl mb-4 font-bold">🧠 Digit Differ Sniper Tool</h1>

      <div className="mb-4">
        <label className="mr-2">Select Volatility:</label>
        <select
          className="text-black p-1 rounded"
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

      <div className="bg-gray-800 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">🎯 Sniper Alerts</h2>
        <ul className="max-h-80 overflow-y-scroll">
          {sniperAlerts.map((alert, i) => (
            <li key={i} className="mb-2 p-2 border border-green-500 rounded">
              <div><strong>Digit:</strong> {alert.digit}</div>
              <div><strong>Volatility:</strong> {alert.volatility}</div>
              <div><strong>Pattern Count:</strong> {alert.sniperCount}</div>
              <div><strong>Chain:</strong> {alert.groupChain.join(' → ')}</div>
              <div><strong>Time:</strong> {new Date(alert.time).toLocaleTimeString()}</div>
            </li>
          ))}
        </ul>
      
      </div>

      <div className="mt-6 bg-gray-800 p-4 rounded shadow">
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

      <div className="mt-6 bg-gray-800 p-4 rounded shadow">
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
    </div>
  );


}

export default App;
