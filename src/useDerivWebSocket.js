// File: src/useDerivWebSocket.js

import { useEffect, useRef, useState } from "react";

export default function useDerivWebSocket(volatility) {
  const [tickDigits, setTickDigits] = useState([]);
  const [lastDigit, setLastDigit] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    const tickHistory = [];
    const socket = new WebSocket("wss://ws.derivws.com/websockets/v3?app_id=1089");
    ws.current = socket;

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          ticks: volatility,
          subscribe: 1
        })
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = data.tick?.quote;
      if (!price) return;
      const digit = parseInt(price.toString().slice(-1));
      if (isNaN(digit)) return;

      tickHistory.push(digit);
      if (tickHistory.length > 10000) tickHistory.shift();

      setTickDigits([...tickHistory]);
      setLastDigit(digit);
    };

    return () => {
      socket.close();
    };
  }, [volatility]);

  return {
    ticks: tickDigits,
    digit: lastDigit
  };
}

