// File: src/StrategySettingsPanel.jsx

import React from "react";

export default function StrategySettingsPanel({ config, setConfig }) {
  const toggleDigit = (digit) => {
    const updated = [...config.digits];
    const index = updated.indexOf(digit);
    if (index !== -1) updated.splice(index, 1);
    else updated.push(digit);
    setConfig({ ...config, digits: updated });
  };

  const toggleVol = (vol) => {
    const updated = [...config.vols];
    const index = updated.indexOf(vol);
    if (index !== -1) updated.splice(index, 1);
    else updated.push(vol);
    setConfig({ ...config, vols: updated });
  };

  return (
    <div className="p-4 bg-gray-800 mt-6 rounded text-white">
      <h2 className="text-lg font-bold mb-3">🎯 Strategy Settings</h2>

      <div className="mb-4">
        <label className="block mb-1">Min Group Count to Trigger Sniper</label>
        <input
          type="number"
          min={2}
          max={6}
          value={config.minCount}
          onChange={(e) => setConfig({ ...config, minCount: parseInt(e.target.value) })}
          className="w-16 p-1 rounded text-black"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Digits to Track:</label>
        <div className="flex flex-wrap gap-2">
          {[...Array(10).keys()].map((digit) => (
            <button
              key={digit}
              className={`px-2 py-1 rounded border ${
                config.digits.includes(digit)
                  ? "bg-green-600 border-green-700"
                  : "bg-gray-600 border-gray-700"
              }`}
              onClick={() => toggleDigit(digit)}
            >
              {digit}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-1">Volatilities to Monitor:</label>
        <div className="flex flex-wrap gap-2">
          {["R_10", "R_25", "R_50", "R_75", "R_100"].map((vol) => (
            <button
              key={vol}
              className={`px-2 py-1 rounded border text-sm ${
                config.vols.includes(vol)
                  ? "bg-purple-600 border-purple-700"
                  : "bg-gray-600 border-gray-700"
              }`}
              onClick={() => toggleVol(vol)}
            >
              {vol.replace("R_", "Vol ")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
