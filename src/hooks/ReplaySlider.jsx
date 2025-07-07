// File: src/components/ReplaySlider.jsx

import React from "react";

function ReplaySlider({ total, currentIndex, onChange }) {
  return (
    <div className="mt-4">
      <label className="text-sm mb-1 block">
        ⏪ Replay Position: {currentIndex}/{total}
      </label>
      <input
        type="range"
        min={0}
        max={total}
        value={currentIndex}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

export default ReplaySlider;
