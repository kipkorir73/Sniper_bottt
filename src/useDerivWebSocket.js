// File: src/useDerivWebSocket.js

import { useEffect, useState, useRef } from "react";

const DERIV_API = "wss://ws.derivws.com/websockets/v3";

export default function useDerivWebSocket(selectedVolatility) {
  const [ticks, setTicks] = useState([]);
  const [digit, setDigit] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!selectedVolatility) return;

    if (socketRef.current) {
      socketRef.current.close();
    }

    const ws = new WebSocket(DERIV_API);
    socketRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          ticks: selectedVolatility,
          subscribe: 1
        })
      );
    };

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.tick) {
        const quote = data.tick.quote.toFixed(4);
        const lastDigit = quote[quote.length - 1];
        setTicks((prev) => [...prev.slice(-9999), lastDigit]);
        setDigit(lastDigit);
      }
    };

    return () => {
      ws.close();
    };
  }, [selectedVolatility]);

  return { ticks, digit };
}
