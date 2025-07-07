// File: src/useSniperTracker.js

import { useState } from "react";

export default function useSniperTracker(mode = "classic") {
  const [clusterLog, setClusterLog] = useState({});
  const [sniperDigit, setSniperDigit] = useState(null);
  const [sniperAlert, setSniperAlert] = useState(false);
  const [sniperZone, setSniperZone] = useState(false);
  const [sniperLog, setSniperLog] = useState([]);

  const getMinClusters = () => {
    switch (mode) {
      case "aggressive":
        return 2;
      case "conservative":
        return 4;
      case "classic":
      default:
        return 3;
    }
  };

  const handleTick = (digit, updatedTicks) => {
    let updated = { ...clusterLog };
    let current = updated[digit] || [];

    const lastTick = current.length > 0 ? current[current.length - 1] : null;

    // Check for cluster length (repeated digits)
    if (lastTick && lastTick.endsWith(digit)) {
      let len = parseInt(lastTick.slice(1)) + 1;
      current[current.length - 1] = `G${len}`;
    } else {
      // Count previous digits for new cluster
      let count = 1;
      for (let i = updatedTicks.length - 2; i >= 0; i--) {
        if (updatedTicks[i] === digit) count++;
        else break;
      }
      if (count >= 2) current.push(`G${count}`);
    }

    updated[digit] = current;
    setClusterLog(updated);

    // Trigger sniper alert based on mode
    const minClusters = getMinClusters();
    if (updated[digit].length >= minClusters) {
      setSniperDigit(digit);
      setSniperAlert(true);
      setSniperZone(true);
    }

    // Evaluate result when sniper is on
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
