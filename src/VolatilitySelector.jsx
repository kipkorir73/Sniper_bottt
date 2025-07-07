// File: src/VolatilitySelector.jsx

import React from "react";

const VOL_LIST = ["R_10", "R_25", "R_50", "R_75", "R_100"];

export default function VolatilitySelector({ selected, setSelected }) {
  return (
    <div className="mt-4">
      <label className="text-white font-semibold mr-2">⚡ Volatility:</label>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-600"
      >
        {VOL_LIST.map((vol) => (
          <option key={vol} value={vol}>
            {vol.replace("R_", "Vol ")}
          </option>
        ))}
      </select>
    </div>
  );
}
