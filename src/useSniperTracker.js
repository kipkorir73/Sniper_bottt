// File: src/useSniperTracker.js

import { useState } from "react";

export default function useSniperTracker() {
  const [clusterLog, setClusterLog] = useState({});
  const [sniperDigit, setSniperDigit] = useState(null);
  const [sniperAlert, setSniperAlert] = useState(false);
  const [sniperZone, setSniperZone] = useState(false);
  const [sniperLog, setSniperLog] = useState([]);

  const handleTick = (digit) => {
    let updated = { ...clusterLog };
    let current = updated[digit] || [];

    const lastTick = current.length > 0 ? current[current.length - 1] : null;

    // Check for cluster length (repeated digits)
    if (lastTick && lastTick.endsWith(digit)) {
      let len = parseInt(lastTick.slice(1)) + 1;
      current[current.length - 1] = `G${len}`;
    } else if (
      current.length === 0 ||
      (lastTick && !lastTick.endsWith(digit))
    ) {
      // Only add new cluster if it's at least 2 (G2)
      let count = 1;
      for (let i = updatedTicks.length - 2; i >= 0; i--) {
        if (updatedTicks[i] === digit) count++;
        else break;
      }
      if (count >= 2) current.push(`G${count}`);
    }

    updated[digit] = current;
    setClusterLog(updated);

    // Trigger sniper alert if clusters >= 3 for that digit
    if (updated[digit].length >= 3) {
      setSniperDigit(digit);
      setSniperAlert(true);
      setSniperZone(true);
    }

    // Check sniper zone (confirmation of break or not)
    if (sniperZone && digit === sniperDigit) {
      const prev = updated[sniperDigit] || [];
      const isBreak = prev.length === 0 || prev[prev.length - 1] !== `G2`;

      setSniperLog((prevLog) => [
        ...prevLog,
        {
          digit: sniperDigit,
          clusters: prev,
          result: isBreak ? "✅ Break" : "❌ Continued"
        }
      ]);

      setSniperAlert(false);
      setSniperZone(false);
      setClusterLog((log) => ({ ...log, [sniperDigit]: [] }));
    }
  };

  return {
    sniperDigit,
    sniperAlert,
    sniperZone,
    sniperLog,
    clusterLog,
    handleTick
  };
}
