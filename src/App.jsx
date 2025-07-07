// File: src/App.jsx

import React, { useEffect, useState, useRef } from "react";
import AutoSniperToggle from "./AutoSniperToggle";
import StrategySettingsPanel from "./StrategySettingsPanel";
import ExportSniperLog from "./ExportSniperLog";
import SniperModeSwitcher from "./SniperModeSwitcher";
import useMotivationVoice from "./useMotivationVoice";

const DIGIT_LIMIT = 10000;

function getClusters(entries) {
  const clusters = [];
  for (let i = 1; i < entries.length; i++) {
    const prev = entries[i - 1];
    const curr = entries[i];
    if (curr.digit === prev.digit) {
      if (
        clusters.length &&
        clusters[clusters.length - 1].digit === curr.digit &&
        clusters[clusters.length - 1].end === i - 1
      ) {
        clusters[clusters.length - 1].end = i;
        clusters[clusters.length - 1].count++;
      } else {
        clusters.push({ digit: curr.digit, start: i - 1, end: i, count: 2 });
      }
    }
  }
  return clusters;
}

function App() {
  const [digits, setDigits] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [sniperLog, setSniperLog] = useState([]);
  const [autoSniper, setAutoSniper] = useState(true);
  const [strategyConfig, setStrategyConfig] = useState({
    minCount: 3,
    digits: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    vols: ["R_10", "R_25", "R_50", "R_75", "R_100"],
  });
  const [sniperMode, setSniperMode] = useState("classic");

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
        setDigits((prev) => {
          const next = [...prev, { digit, timestamp: data.tick.epoch }];
          return next.slice(-DIGIT_LIMIT);
        });
      }
    };

    return () => ws.close();
  }, [strategyConfig.vols]);

  useEffect(() => {
    if (digits.length < 2) return;
    const latestDigit = digits[digits.length - 1].digit;

    let newClusters = [...clusters];
    const last = newClusters[newClusters.length - 1];

    if (last && last.digit === latestDigit) {
      last.count++;
      last.end = digits.length - 1;
    } else {
      const secondLast = digits[digits.length - 2].digit;
      if (latestDigit === secondLast) {
        newClusters.push({
          digit: latestDigit,
          count: 2,
          start: digits.length - 2,
          end: digits.length - 1,
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

    for (const digit in groupedByDigit) {
      const pattern = groupedByDigit[digit];
      const triggerLevel =
        sniperMode === "classic" ? 3 : sniperMode === "aggressive" ? 2 : 4;
      if (pattern.length >= triggerLevel) {
        const lastCluster = pattern[pattern.length - 1];
        const recentDigit = digits[digits.length - 1].digit;

        if (autoSniper) {
          if (recentDigit !== Number(digit)) {
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
    }
  }, [digits]);

  const recent = digits.slice(-30);
  const recentClusters = getClusters(recent);

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <h1 className="text-xl font-bold mb-4">🎯 Digit Differ Sniper Tool</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="font-semibold mb-2">🔢 Live Digits</h2>
            <div className="flex overflow-x-auto space-x-1 p-1 bg-black rounded">
              {recent.map((entry, i) => {
                const cluster = recentClusters.find(c => i >= c.start && i <= c.end);
                const isStart = cluster && i === cluster.start;
                return (
                  <div
                    key={i}
                    className={`min-w-[45px] text-center py-1 px-2 rounded border ${
                      cluster
                        ? "bg-red-800 border-red-400"
                        : "bg-gray-900 border-gray-600"
                    }`}
                  >
                    <div className="text-xs text-gray-400">
                      {new Date(entry.timestamp * 1000).toLocaleTimeString("en-GB", {
                        hour12: false,
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </div>
                    <div className="text-green-300 text-lg font-bold">
                      {entry.digit}
                    </div>
                    {isStart && (
                      <div className="text-xs font-bold text-yellow-300">
                        G{cluster.count}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <AutoSniperToggle autoSniper={autoSniper} setAutoSniper={setAutoSniper} />
            <SniperModeSwitcher mode={sniperMode} setMode={setSniperMode} />
            <StrategySettingsPanel config={strategyConfig} setConfig={setStrategyConfig} />
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
        </div>
      </div>
    </div>
  );
}

export default App;
