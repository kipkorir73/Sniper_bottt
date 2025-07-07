// File: src/useSniperTracker.js

import { useState, useRef } from "react";

export default function useSniperTracker(mode = "classic") {
  const [sniperAlert, setSniperAlert] = useState(false);
  const [sniperDigit, setSniperDigit] = useState(null);
  const [sniperLog, setSniperLog] = useState([]);
  const [clusterLog, setClusterLog] = useState([]);
  const sniperZone = useRef(null);

  const groupPatterns = (digits) => {
    const groups = [];
    let i = 0;
    while (i < digits.length) {
      const current = digits[i];
      let count = 1;
      while (digits[i + 1] === current) {
        count++;
        i++;
      }
      if (count >= 2) {
        groups.push({ digit: current, length: count });
      }
      i++;
    }
    return groups;
  };

  const handleTick = (digit, allTicks) => {
    const clusters = groupPatterns(allTicks.slice(-100));
    const clusterMap = {};

    clusters.forEach((g) => {
      if (!clusterMap[g.digit]) clusterMap[g.digit] = [];
      clusterMap[g.digit].push(g);
    });

    // Detect sniper pattern
    Object.keys(clusterMap).forEach((d) => {
      const count = clusterMap[d].length;
      const lastWasCluster = clusters[clusters.length - 1]?.digit === parseInt(d);

      if (count >= 3 && lastWasCluster && d !== sniperZone.current) {
        setSniperAlert(true);
        setSniperDigit(parseInt(d));
        sniperZone.current = d;

        const pattern = clusterMap[d].map((g) => `G${g.length}`).join(" → ");

        setSniperLog((prev) => [
          ...prev,
          {
            digit: d,
            pattern,
            result: "pending",
            vol: "-",
            mode
          }
        ]);
      }

      if (d === sniperZone.current && count >= 3) {
        const recentGroup = clusterMap[d];
        const last = recentGroup[recentGroup.length - 1];
        const afterCluster = allTicks.slice(-5);

        if (afterCluster.filter((v) => v === parseInt(d)).length === 1) {
          // It broke!
          setSniperAlert(false);
          sniperZone.current = null;
          setSniperLog((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].result = "break";
            return updated;
          });
        } else if (afterCluster[afterCluster.length - 1] === parseInt(d)) {
          // Continued cluster
          setSniperLog((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].result = "continued";
            return updated;
          });
        }
      }
    });

    setClusterLog(clusters);
  };

  return {
    sniperAlert,
    sniperDigit,
    sniperZone,
    sniperLog,
    clusterLog,
    handleTick
  };
}
