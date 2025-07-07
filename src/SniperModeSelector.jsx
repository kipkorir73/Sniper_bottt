// File: src/SniperModeSelector.jsx

import React from "react";

export default function SniperModeSelector({ mode, setMode }) {
  return (
    <div className="flex gap-2 items-center mt-4">
      <label className="text-white font-semibold">🎯 Strategy Mode:</label>
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-600"
      >
        <option value="classic">Classic (3+ clusters)</option>
        <option value="conservative">Conservative (4+ clusters)</option>
        <option value="aggressive">Aggressive (2+ clusters)</option>
      </select>
    </div>
  );
}
