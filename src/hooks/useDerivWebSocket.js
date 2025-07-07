import { useEffect, useRef } from "react";

export default function useDerivWebSocket(volatility, onTick) {
  const wsRef = useRef(null);

  useEffect(() => {
    if (!volatility) return;

    const volMap = {
      "Volatility 10": "R_10",
      "Volatility 25": "R_25",
      "Volatility 50": "R_50",
      "Volatility 75": "R_75",
      "Volatility 100": "R_100"
    };

    const symbol = volMap[volatility];
    if (!symbol) return;

    const ws = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ ticks: symbol, subscribe: 1 }));
    };

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.tick && data.tick.quote) {
        const price = parseFloat(data.tick.quote);
        const digit = parseInt(price.toString().slice(-1));
        onTick({
          time: data.tick.epoch,
          price,
          digit,
          volatility
        });
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [volatility, onTick]);

  return null;
}
