// File: src/components/ReplaySlider.jsx

import React, { useEffect, useState } from "react";

const ReplaySlider = ({ tickHistory, onStep }) => {
  const [position, setPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(100);

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPosition((prev) => {
          const next = prev + 1;
          if (next >= tickHistory.length) {
            clearInterval(interval);
            setIsPlaying(false);
            return prev;
          }
          onStep(tickHistory[next], next);
          return next;
        });
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, tickHistory, onStep]);

  const handleManualStep = (e) => {
    const val = parseInt(e.target.value);
    setPosition(val);
    onStep(tickHistory[val], val);
  };

  return (
    <div className="bg-gray-900 text-white p-3 rounded mt-4">
      <h3 className="font-bold mb-2">⏪ Replay Mode</h3>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <label className="text-sm">
          Speed:{" 
