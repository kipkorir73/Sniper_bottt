// File: src/SniperModeSwitcher.jsx

import React from "react";

export default function SniperModeSwitcher({ mode, setMode }) {
  const modes = [
    { id: "classic", label: "🎯 Classic", desc: "Trigger on 3–4 group repeats" },
    { id: "aggressive", label: "🔥 Aggressive", desc: "Trigger early at 2–3" },
    { id: "conservative", label: "🛡 Conservative", desc: "Trigger at 4+ only" },
  ];

  return (
    <div className="mt-6 bg-gray-700 p-4 rounded text-white">
      <h3 className="text-md font-bold mb-2">🔀 Sniper Mode</h3>
      <div className="flex flex-col gap-2">
        {modes.map((m) => (
          <label
            key={m.id}
            className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
              mode === m.id ? "bg-green-700" : "bg-gray-600"
            }`}
          >
            <input
              type="radio"
              checked={mode === m.id}
              onChange={() => setMode(m.id)}
            />
            <div>
              <strong>{m.label}</strong>
              <p className="text-xs text-gray-300">{m.desc}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
