// File: src/ExportSniperLog.jsx

import React from "react";

export default function ExportSniperLog({ sniperLog }) {
  const downloadCSV = () => {
    const headers = ["Digit", "Result", "PatternCount", "Timestamp"].join(",");
    const rows = sniperLog.map((log) =>
      [log.digit, log.result, log.patternCount, new Date(log.timestamp).toLocaleString()].join(",")
    );
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `sniper-log-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-4">
      <button
        onClick={downloadCSV}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        ⬇️ Export Sniper Log (CSV)
      </button>
    </div>
  );
}
