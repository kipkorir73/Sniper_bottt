// File: src/useDerivWebSocket.js

import { useEffect, useState } from "react";

export default function useDerivWebSocket(symbol = "R_100") {
  const [ticks, setTicks] = useState([]);
  const [digit, setDigit] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("wss://ws.derivws.com/websockets/v3");

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          ticks: symbol,
          subscribe: 1
        })
      );
    };

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.tick) {
        const quote = data.tick.quote.toFixed(4);
        const lastDigit = quote.slice(-1);
        setDigit(lastDigit);
        setTicks((prev) => [...prev.slice(-9999), lastDigit]);
      }
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  return { ticks, digit };
}
