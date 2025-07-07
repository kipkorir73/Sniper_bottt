import { useRef } from "react";

export default function useTickHistoryBuffer() {
  const buffer = useRef([]);

  function addTick(tick) {
    buffer.current.push(tick);
    if (buffer.current.length > 10000) {
      buffer.current.shift(); // keep only latest 10K
    }
  }

  function getHistory() {
    return [...buffer.current];
  }

  return {
    addTick,
    getHistory
  };
}
