// File: src/AutoSniperToggle.jsx

import React from "react";

export default function AutoSniperToggle({ autoSniper, setAutoSniper }) {
  return (
    <div className="mt-4">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={autoSniper}
          onChange={(e) => setAutoSniper(e.target.checked)}
          className="form-checkbox text-green-500"
        />
        <span className="text-sm text-gray-300">
          🧠 Enable Auto-Sniper Mode (track and log breaks automatically)
        </span>
      </label>
    </div>
  );
}
