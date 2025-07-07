// File: src/App.jsx

import React, { useEffect, useState } from "react";
import useDerivWebSocket from "./useDerivWebSocket";
import useSniperTracker from "./useSniperTracker";
import useBacktestEngine from "./useBacktestEngine";
import BacktestViewer from "./BacktestViewer";
import SniperModeSelector from "./SniperModeSelector";
import { speak } from "./speechAlerts";

export default function App() {
  const [mode, setMode] = useState("classic");
  const { ticks, digit } = useDerivWebSocket("R_100");
  const {
    sniperDigit,
    sniperAlert,
    sniperZone,
    sniperLog,
    clusterLog,
    handleTick
  } = useSniperTracker(mode);

  useEffect(() => {
    if (digit) {
      handleTick(digit, ticks);
    }
  }, [digit]);

  useEffect(() => {
    if (sniperAlert && sniperDigit !== null) {
      speak(
        `Sniper Alert: Digit ${sniperDigit} repeating. Pattern forming in ${mode} mode.`,
        mode === "aggressive" ? "funny" : mode === "conservative" ? "serious" : "calm"
      );
    }
  }, [sniperAlert]);

  useBacktestEngine(ticks, (digit) => handleTick(digit, ticks));

  return (
    <div className="bg-black min-h-screen text-white p-6 font-mono">
      <h1 className="text-3xl font-bold mb-4">🎯 Digit Differ Sniper Bot</h1>

      <SniperModeSelector mode={mode} setMode={setMode} />

      <div className="mt-6">
        <h2 className="text-lg mb-2">🔢 Last 30 Digits:</h2>
        <div className="flex flex-wrap gap-1">
          {ticks.slice(-30).map((d, i) => (
            <span
              key={i}
              className="w-6 h-6 flex items-center justify-center bg-gray-800 rounded text-sm"
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      {sniperAlert && (
        <div className="mt-4 p-3 bg-yellow-600 text-black rounded">
          🚨 Sniper Alert: Digit {sniperDigit} has formed multiple clusters! Prepare!
        </div>
      )}

      <BacktestViewer events={sniperLog} />
    </div>
  );
}
