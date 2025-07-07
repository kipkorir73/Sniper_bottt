// File: src/App.jsx

import React, { useEffect, useState, useRef } from "react";
import AutoSniperToggle from "./AutoSniperToggle";
import StrategySettingsPanel from "./StrategySettingsPanel";
import ExportSniperLog from "./ExportSniperLog";
import SniperModeSwitcher from "./SniperModeSwitcher";
import useMotivationVoice from "./useMotivationVoice";
import ReplaySlider from "./hooks/.ReplaySlider";
import BacktestEngine from "./hooks/.BacktestEngine";

const DIGIT_LIMIT = 50000;

function App() {
  const [digits, setDigits] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [sniperLog, setSniperLog] = useState([]);
  const [autoSniper, setAutoSniper] = useState(true);
  const [strategyConfig, setStrategyConfig] = useState({
    minCount: 3,
    digits: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    vols: ["R_10", "R_25", "R_50", "R_75", "R_100"],
    displayVol: "R_10",
  });
  const [sniperMode, setSniperMode] = useState("classic");
  const [successStats, setSuccessStats] = useState({});
  const [replayIndex, setReplayIndex] = useState(null);

  const { motivate } = useMotivationVoice();

  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("wss://ws.derivws.com/websockets/v3?app_id=1089");
    wsRef.current = ws;

    ws.onopen = () => {
      strategyConfig.vols.forEach((symbol) => {
        ws.send(JSON.stringify({ ticks: symbol, subscribe: 1 }));
      });
    };

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.tick) {
        const digit = Number(data.tick.quote.toString().slice(-1));
        const volatility = data.tick.symbol;
        setDigits((prev) => {
          const next = [...prev, { digit, timestamp: data.tick.epoch, vol: volatility }];
          return next.slice(-DIGIT_LIMIT);
        });
      }
    };

    return () => ws.close();
  }, [strategyConfig.vols]);

  useEffect(() => {
    if (digits.length < 2) return;

    const currentDisplayVol = strategyConfig.displayVol;
    const filtered = digits.filter((d) => d.vol === currentDisplayVol);
    const latestDigit = filtered[filtered.length - 1]?.digit;

    let newClusters = [...clusters];
    const last = newClusters[newClusters.length - 1];

    if (last && last.digit === latestDigit) {
      last.count++;
      last.end = filtered.length - 1;
    } else {
      const secondLast = filtered[filtered.length - 2]?.digit;
      if (latestDigit === secondLast) {
        newClusters.push({
          digit: latestDigit,
          count: 2,
          start: filtered.length - 2,
          end: filtered.length - 1,
        });
      }
    }

    setClusters(newClusters);

    const clusterHistory = newClusters.filter((c) => strategyConfig.digits.includes(c.digit));
    const groupedByDigit = {};
    clusterHistory.forEach((c) => {
      if (!groupedByDigit[c.digit]) groupedByDigit[c.digit] = [];
      groupedByDigit[c.digit].push(c);
    });

    let stats = {};
    for (const digit in groupedByDigit) {
      const pattern = groupedByDigit[digit];
      const triggerLevel =
        sniperMode === "classic" ? 3 : sniperMode === "aggressive" ? 2 : 4;
      if (pattern.length >= triggerLevel) {
        const lastCluster = pattern[pattern.length - 1];
        const recentDigit = latestDigit;

        if (!stats[digit]) stats[digit] = { triggers: 0, breaks: 0 };
        stats[digit].triggers++;

        if (recentDigit !== Number(digit)) {
          stats[digit].breaks++;
          setSniperLog((prev) => [
            ...prev,
            {
              digit: Number(digit),
              patternCount: pattern.length,
              result: "✅ Break",
              timestamp: Date.now(),
            },
          ]);
          motivate(digit, 90);
        } else {
          setSniperLog((prev) => [
            ...prev,
            {
              digit: Number(digit),
              patternCount: pattern.length,
              result: "❌ Continued",
              timestamp: Date.now(),
            },
          ]);
          motivate(digit, 40);
        }
      }
    }

    setSuccessStats(stats);
  }, [digits]);

  const renderSuccessStats = () => {
    return Object.entries(successStats).map(([digit, stats], idx) => {
      const winRate = ((stats.breaks / stats.triggers) * 100).toFixed(1);
      return (
        <div key={idx} className="flex justify-between text-sm">
          <span>Digit {digit}</span>
          <span>{stats.breaks}/{stats.triggers} Wins</span>
          <span>{winRate}%</span>
        </div>
      );
    });
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <h1 className="text-xl font-bold mb-4">🎯 Digit Differ Sniper Tool</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="font-semibold mb-2">🔢 Live Digits - {strategyConfig.displayVol}</h2>
            <div className="flex gap-2 mb-2">
              {strategyConfig.vols.map((vol) => (
                <button
                  key={vol}
                  onClick={() =>
                    setStrategyConfig((prev) => ({ ...prev, displayVol: vol }))
                  }
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    vol === strategyConfig.displayVol
                      ? "bg-green-600"
                      : "bg-gray-600"
                  }`}
                >
                  {vol}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-10 gap-1">
              {digits
                .filter((d) => d.vol === strategyConfig.displayVol)
                .slice(-20)
                .map((d, i) => (
                  <div
                    key={i}
                    className="text-center p-1 rounded bg-gray-700"
                  >
                    {d.digit}
                  </div>
                ))}
            </div>
            <AutoSniperToggle autoSniper={autoSniper} setAutoSniper={setAutoSniper} />
            <SniperModeSwitcher mode={sniperMode} setMode={setSniperMode} />
            <StrategySettingsPanel config={strategyConfig} setConfig={setStrategyConfig} />
            <ReplaySlider max={digits.length - 1} value={replayIndex} onChange={setReplayIndex} />
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h2 className="font-semibold mb-2">📊 Sniper Log</h2>
          <div className="max-h-64 overflow-y-auto text-sm">
            {sniperLog.map((entry, idx) => (
              <div key={idx} className="flex justify-between border-b py-1">
                <span>Digit {entry.digit}</span>
                <span>{entry.result}</span>
                <span>{entry.patternCount}x</span>
                <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
          <ExportSniperLog sniperLog={sniperLog} />

          <h2 className="font-semibold mt-4 mb-2">📈 Strategy Win Rate</h2>
          {renderSuccessStats()}
        </div>
      </div>

      <div className="mt-6">
        <BacktestEngine digits={digits} config={strategyConfig} mode={sniperMode} />
      </div>
    </div>
  );
}

export default App;
