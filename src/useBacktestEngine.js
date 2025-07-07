// File: src/useBacktestEngine.js

import { useEffect } from "react";

export default function useBacktestEngine(ticks, handleTick) {
  useEffect(() => {
    if (ticks.length === 10000) {
      // Replaying full history
      let delay = 10;
      ticks.forEach((digit, i) => {
        setTimeout(() => {
          handleTick(digit);
        }, i * delay);
      });
    }
  }, [ticks]);

  return null;
}
